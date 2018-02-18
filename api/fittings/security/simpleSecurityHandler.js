
const jwt = require('jsonwebtoken');
const debug = require('debug')("horsesRef:security");
const fs = require('fs');
const config = require('config');
const createParam = require('../../helpers/customParams').create;
const getParam = require('../../helpers/customParams').get;
const errorCodes = require('../../helpers/errorCodes');

/*
Initialisation de l'authentification, récupération des paramètres de la configuration
Retourne une promesse car les données comme le secret peuvent être accédés dans un fichier ou via un serveur
 */
const initAuthentication = () => {
  if(config.has('auth.secret')) {
    return Promise.resolve(config.get('auth.secret'));
  }
  if(config.has('auth.secretPath')) {
    return new Promise((resolve, reject) => {
      fs.readFile(config.get('auth.secretPath'), (err, data) => {
        if(err) {
          reject(Error('Unable to read the jwt secret file'))
        }
        else {
          resolve(data);
        }
      });
    });
  }
  if(config.has('auth.secretUrl')) {
    return Promise.reject(Error('Not implemented yet'));
  }
  return Promise.reject(Error('No authentication key provided'));
};

// Paramètres de configuration initalement vide se remplit lorsque la promesse d'initialisation est remplie
const defaultParameters = {
};

// Récupération des paramètres de config
initAuthentication().then((secret) => {
  // Secret de décodage du jwt
  defaultParameters.sharedSecret = secret;

  // Options de décodage du jwt
  defaultParameters.options = {};
  if (config.has('auth.issuer') && config.get('auth.issuer')) defaultParameters.options.issuer = config.get('auth.issuer');
  if (config.has('auth.audience') && config.get('auth.audience')) defaultParameters.options.audience = config.get('auth.audience');

  // mapping utilisé lorsqu'il n'y a pas de tenant i.e. l'administration du service
  defaultParameters.adminGroupRoleMapping = config.has('auth.adminGroupRoleMapping') ? config.get('auth.adminGroupRoleMapping'):{};
});

const error401 = (errMsg, callback) => {
  debug(errMsg);
  callback(errorCodes.error(errorCodes.UNAUTHORIZED));
};

const error403 = (errMsg, callback) => {
  debug(errMsg);
  callback(errorCodes.error(errorCodes.FORBIDDEN));
};

const handleSuperAdmin = (req, token, usedParameters, callback) => {
  const groups = token.Grp["admin"];
  const groupRoleMapping = usedParameters.adminGroupRoleMapping;
  let isSuperAdmin = false;
  groups.forEach(g => groupRoleMapping[g] && groupRoleMapping[g].forEach(
    r => isSuperAdmin = isSuperAdmin || r === 'adm'
  ));
  if (isSuperAdmin) {
    createParam(req, "authorization", token);
    // Super admin donne tous les droits
    createParam(req, "roles", ['adm', 'mng', 'snd', 'usr']);
    callback();
  }
  return isSuperAdmin;
};

/**
 * @param parameters définissant le secret et les options de décodage du JWT
 * @param handleTenantErr gestion de l'erreur de récupération du tenant
 * @param getGroups récupération des groups pour le tenant
 * @param getRoleMapping recupération du mapping pour le tenant
 * @returns {function(*=, *, *=, *=)} le handler pour la sécurité
 */
const BearerSecurityHandler = (parameters, handleTenantErr, getGroups, getRoleMapping) =>
  /**
   * Handler de l'authentification par JWT. Génère une erreur si aucun token ou un token invalide est transmit. Sinon les
   * informations (user, roles,...) du token sont disponibles dans le champ req.authenticationToken, ensuite la main est
   * passée au controller qui doit vérifier que l'utilisateur à bien les droits nécessaires.
   * @param req requête
   * @param authOrSecDef définition swagger du type d'authentification
   * @param authorizationHeader la clé fournie
   * @param callback à appeler si une erreur <pre>Error("texte de l'erreur") est passé en paramètre le process s'arrête et
   * générère une erreur. On peut ajouter à l'erreur un statusCode (401, 403,...) et un code (texte d'identification de
   * l'erreur)
   */
  (req, authOrSecDef, authorizationHeader, callback) => {

    const usedParameters = Object.assign({}, defaultParameters, parameters);

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      error401(`Authorization error: "wrong Authorization protocol"`, callback);
    }
    else {
      jwt.verify(authorizationHeader.split(' ')[1], usedParameters.sharedSecret, usedParameters.options, (err, token) => {
        if (err) {
          error401(`${err.name}: "${err.message}"`, callback);
          return;
        }
        if (handleTenantErr(getParam(req, "tenant", "err"), callback)) return;
        if (handleSuperAdmin(req, token, usedParameters,callback)) return;

        // Récupération du tenant s'il existe
        const tenant = getParam(req, "tenant", "value");
        // Récupération des groupes dont fait parti l'utilisateur qui se trouve dans le token
        // objet qui pour chaque tenant contient un tableau des groupes auquel l'utilisateur appartient
        // ex: {"test":["marketing"], "autreTenant":["chef"]}
        const groups = getGroups(tenant, token);

        // Récupération du groupRoleMapping pour le tenant
        // objet contenant la liste des rôles par groupe
        // ex: { "marketing" : ["snd"], "administrateur" : ["mng", "usr"], "utilisateur": [ "usr"] }
        // Si le tenant est invalide ou que le mapping n'est pas présent on utilise une configuration par défaut
        // Cette dernière est utilisée pour les reqêtes d'administration du service
        const groupRoleMapping = getRoleMapping(tenant, usedParameters.adminGroupRoleMapping);

        // Liste des rôles à remplir
        const roles = new Set();
        // Ajout des rôles issu du mapping des groupes
        // ex: pour le tenant "test", on aura le Set(["snd"]) issue du group "marketing"
        groups.forEach(g => groupRoleMapping[g] && groupRoleMapping[g].forEach(r => roles.add(r)));

        // Récupération des rôles autorisés pour l'opération en cours
        // S'il n'y a pas de swagger disponible c'est qu'on est en mode de test
        const swagger = req.swagger || { operation: { "x-security": { roles: ["adm"] } } };
        const xSecurity = swagger.operation['x-security'];
        const allowedRoles = xSecurity && xSecurity.roles || [];

        // Vérification que l'un des rôles dont dispose le token est autorisé
        const accessGranted = allowedRoles.reduce((accessGranted, r) => accessGranted || roles.has(r), false);
        if (accessGranted) {
          // ok on ajoute les paramètres extrait (le token et les roles) et on passe la main au contrôleur
          createParam(req, "authorization", token);
          createParam(req, "roles", roles);
          callback();
        }
        else {
          // nok erreur 403
          error403(`Access is not granted for [${[...roles]}] (should be in [${allowedRoles}])`, callback);
        }
      });
    }
  };
BearerTenantSecurityHandler = parameters =>
  BearerSecurityHandler(parameters,
    (err, callback) => {
      if (err) {
        if(err.code === errorCodes.NOT_FOUND) {
          error401(`Authorization error: "No such tenant"`, callback);
        }
        else {
          callback(errorCodes.error(err.code));
        }
        // erreur => bye bye
        return true;
      }
      return false;
    },
    (tenant, token) =>
      tenant && token.Grp && token.Grp[tenant && tenant.id] // tenant
      || !tenant && token.Grp && token.Grp["admin"]         // Pas de tenant
      || [],
    (tenant, adminGroupRoleMapping) => tenant && tenant.groupRoleMapping || adminGroupRoleMapping
  );

const BearerAdmSecurityHandler = parameters =>
  BearerSecurityHandler(parameters,
    (err, callback) => {
      if (err) {
        callback(errorCodes.error(err.code));
        // erreur => bye bye
        return true;
      }
      return false;
    },
    (tenant, token) => token.Grp && token.Grp["admin"]  // Pas de tenant ou onlyAdmin => admin
      || [],                                        // fallback
    (tenant, adminGroupRoleMapping) => adminGroupRoleMapping
  );



/**
 * Handler pour le securityDefinitions Bearer
 * Si d'autres modèles de sécurités sont créés il faut les ajouter ici
 */
module.exports = (parameters) => ({
  swaggerSecurityHandlers: {
    Bearer: BearerTenantSecurityHandler(parameters),
    BearerAdm: BearerAdmSecurityHandler(parameters),
  }
});
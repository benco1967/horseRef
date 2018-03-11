
const basicAuth = require('basic-auth');
const config = require('config');
const error401 = require('./commonSecurity').error401;
const tenantFn = require('./commonSecurity').tenantFn;
const admFn = require('./commonSecurity').admFn;
const authentification = require('./commonSecurity').authentification;

const defaultParameters = {
  basic: {
    users: config.has('auth.basic.users') ? config.get('auth.basic.users') : []
  },
  adminGroupRoleMapping: config.has('auth.adminGroupRoleMapping') ? config.get('auth.adminGroupRoleMapping') : {}
};
/**
 * fonction de test des mots de passse.
 * Il est possible de modifier cette méthode si on souhaite encoder le mot de passe ou le contrôle
 * @param password fourni par l'utilisateur
 * @param control fourni par les crédentials
 * @returns {boolean} true si le mot de passe correspond au contrôle
 */
const checkPassword = (password, control) => password === control;

/**
 * @param parameters définissant le secret et les options de décodage du JWT
 * @param fn object contenant les fonctions
 * @returns {function(*=, *, *=, *=)} le handler pour la sécurité
 */
const BasicSecurityHandler = (parameters, fn) =>
/**
 * Handler de l'authentification par username/password. Génère une erreur si les données transmises sont invalides.
 * Sinon les informations (user, roles,...) sont disponibles dans la configuration ensuite la main est passée au
 * controller qui doit vérifier que l'utilisateur à bien les droits nécessaires.
 * @param req requête
 * @param authOrSecDef définition swagger du type d'authentification
 * @param authorizationHeader la clé fournie
 * @param callback à appeler si une erreur <pre>Error("texte de l'erreur") est passé en paramètre le process s'arrête et
 * générère une erreur. On peut ajouter à l'erreur un statusCode (401, 403,...) et un code (texte d'identification de
 * l'erreur)
 */
  (req, authOrSecDef, authorizationHeader, callback) => {
    try {
      const credential = basicAuth(req);
      const basicParameters = credential && Object.assign({},
        defaultParameters.basic,
        parameters && parameters.basic || undefined);
      const user = credential &&
        basicParameters.users.find(u => u.username === credential.name && checkPassword(u.password, credential.pass));
      if (user) {
        const adminGroupRoleMapping = (parameters && parameters || defaultParameters).adminGroupRoleMapping;
        authentification(fn(adminGroupRoleMapping), req, callback, user);
      }
      else {
        error401(req, `Authorization error: "invalid name / password"`, callback);
      }
    }
    catch (err) {
      error401(req, `Authorization error: "invalid basic authentication"`, callback);
    }
  };


/**
 * Handler pour le securityDefinitions Bearer
 * Si d'autres modèles de sécurités sont créés il faut les ajouter ici
 */
module.exports = {
  Basic: parameters => BasicSecurityHandler(parameters, tenantFn),
  BasicAdm: parameters => BasicSecurityHandler(parameters, admFn),
};

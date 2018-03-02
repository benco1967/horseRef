
const debug = require('debug')("notifSender:security");
const errorCodes = require('../../helpers/errorCodes');
const createParam = require('../../helpers/customParams').create;
const getParam = require('../../helpers/customParams').get;

const error401 = (req, errMsg, callback) => {
  debug(errMsg);
  const err = errorCodes.error(errorCodes.UNAUTHORIZED, errMsg);
  err.headers = { "WWW-Authenticate": `Basic realm="Authentication requise", charset="UTF-8"`};
  callback(err);
};

const error403 = (errMsg, callback) => {
  debug(errMsg);
  callback(errorCodes.error(errorCodes.FORBIDDEN, errMsg));
};

const handleSuperAdmin = (adminGroupRoleMapping) => (req, user, callback) => {
  const groups = user.groups["admin"];
  let isSuperAdmin = groups && groups.reduce((isAdmin, g) =>
      isAdmin || adminGroupRoleMapping[g] && adminGroupRoleMapping[g].indexOf('adm') !== -1, false);
  if (isSuperAdmin) {
    // Super admin donne tous les droits
    user.roles = ['adm', 'mng', 'snd', 'usr'];
    createParam(req, "user", user);
    callback();
  }
  return isSuperAdmin;
};


const admFn = (adminGroupRoleMapping) => ({
  handleTenantErr: (req, err, callback) => {
    if (err) {
      callback(errorCodes.error(err.code));
      // erreur => bye bye
      return true;
    }
    return false;
  },
  handleSuperAdmin: handleSuperAdmin(adminGroupRoleMapping),
  getGroups: (user) => user.groups && user.groups["admin"]  // Pas de tenant ou onlyAdmin => admin
    || [],                                        // fallback
  getRoleMapping: () => adminGroupRoleMapping
});

const tenantFn = (adminGroupRoleMapping)=> ({
  handleTenantErr: (req, err, callback) => {
    if (err && err.code === errorCodes.NOT_FOUND) {
      error401(req, `Authorization error: "No such tenant"`, callback);
      return true; // erreur => bye bye
    }
    return admFn(adminGroupRoleMapping).handleTenantErr(req, err, callback);
  },
  handleSuperAdmin: handleSuperAdmin(adminGroupRoleMapping),
  getGroups: (user, tenant) => tenant ?
    user.groups && user.groups[tenant && tenant.id] || [] :
    admFn(adminGroupRoleMapping).getGroups(user),
  getRoleMapping: (tenant) => tenant && tenant.groupRoleMapping || adminGroupRoleMapping
});



const authentification = (fn, req, callback, user) => {

  if (fn.handleTenantErr(req, getParam(req, "tenant", "err"), callback)) return;
  if (fn.handleSuperAdmin(req, user, callback)) return;

  // Récupération du tenant s'il existe
  const tenant = getParam(req, "tenant", "value");
  // Récupération des groupes dont fait parti l'utilisateur qui se trouve dans le token
  // objet qui pour chaque tenant contient un tableau des groupes auquel l'utilisateur appartient
  // ex: {"test":["marketing"], "autreTenant":["chef"]}
  const groups = fn.getGroups(user, tenant);

  // Récupération du groupRoleMapping pour le tenant
  // objet contenant la liste des rôles par groupe
  // ex: { "marketing" : ["snd"], "administrateur" : ["mng", "usr"], "utilisateur": [ "usr"] }
  // Si le tenant est invalide ou que le mapping n'est pas présent on utilise une configuration par défaut
  // Cette dernière est utilisée pour les reqêtes d'administration du service
  const groupRoleMapping = fn.getRoleMapping(tenant);

  // Liste des rôles à remplir
  const roles = new Set();
  // Ajout des rôles issu du mapping des groupes
  // ex: pour le tenant "test", on aura le Set(["snd"]) issue du group "marketing"
  groups.forEach(g => groupRoleMapping[g] && groupRoleMapping[g].forEach(r => roles.add(r)));
  user.roles = roles;

  // Récupération des rôles autorisés pour l'opération en cours
  // S'il n'y a pas de swagger disponible c'est qu'on est en mode de test
  const swagger = req.swagger || { operation: { "x-allowedRoles": ["adm"] } };
  const allowedRoles = swagger.operation['x-allowedRoles'] || [];

  // Vérification que l'un des rôles dont dispose le token est autorisé
  const accessGranted = allowedRoles.reduce((accessGranted, r) => accessGranted || roles.has(r), false);
  if (accessGranted) {
    // ok on ajoute les paramètres extrait (le token et les roles) et on passe la main au contrôleur
    createParam(req, "user", user);
    callback();
  }
  else {
    // nok erreur 403
    error403(`Access is not granted for [${[...roles]}] (should be in [${allowedRoles}])`, callback);
  }
};

module.exports = {
  error401,
  error403,
  admFn,
  tenantFn,
  authentification
};

/**
 * Ce fitting extrait le tenant à partir du paramètre swagger indiqué par le paramètre x-tenantLoader dans la définition
 * de la méthode dans le fichier swagger.yaml.
 * voir READ.md
 */

const debug = require('debug')("horsesRef:tenant");
const getParam = require('../helpers/customParams').get;
const removeParam = require('../helpers/customParams').remove;
const errorCodes = require('../helpers/errorCodes');

module.exports = () => (context, callback) => {
  const tenant = getParam(context.request, "tenant", "value");
  if (tenant === null) {
    return callback();
  }

  // Test de la date d'expiration et désactivation si nécessaire
  const expireAt = tenant.expiredAt;
  if (tenant.enable === true && expireAt && expireAt < Date.now()) {
    debug(`desactivation date reached, desactivate tenant ${tenant.id}`);
    tenant.enable = false;
    tenant.save();
  }
  // mise à jour de la date d'expiration si désactivé
  if (tenant.enable === false && (!expireAt || expireAt > Date.now())) {
    debug(`set date for desactivated tenant ${tenant.id}`);
    tenant.expiredAt = Date.now();
    tenant.save();
  }

  // si le tenant est désactivé
  const swagger = context.request.swagger;
  const shouldDisable = swagger && swagger.operation['x-tenantDisabler'];
  const enable = tenant.enable;
  if (shouldDisable && enable === false) {
    removeParam(context.request, "tenant");
    callback(errorCodes.error(errorCodes.GONE));
  }
  else {
    callback();
  }
};
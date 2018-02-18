/**
 * Ce fitting extrait le tenant à partir du paramètre swagger indiqué par le paramètre x-tenantLoader dans la définition
 * de la méthode dans le fichier swagger.yaml.
 * voir READ.md
 */

const error = require('debug')("horsesRef:error");
const tenants = require('../models/tenant');
const createParam = require('../helpers/customParams').create;

module.exports = () => (context, callback) => {
  const swagger = context.request.swagger;
  const tenantPrm = swagger.operation['x-tenantLoader'];
  const tenantId = tenantPrm && swagger.params[tenantPrm] && swagger.params[tenantPrm].value || null;
  if(tenantId !== null) {
    tenants.get(tenantId)
      .then(tenant => {
        createParam(context.request, "tenant", { value: tenant, err: null });
        callback();
      })
      .catch(err => {
        error(`unknow tenant "${tenantId}"`);
        createParam(context.request, "tenant", { value: null, err });
        // Aucune erreur n'est levée car sinon le security handler est shunté et savoir qu'un tenant
        // n'existe pas est une information stratégique qu'il ne faut pas afficher si on n'a pas les
        // droits suffisants. On laisse le contrôleur faire le check de la validité du tenant
        callback();
      });
  }
  else {
    callback();
  }
};
'use strict';

const tenants = require('../models/tenant');

const links = require('../helpers/linkBuilder');
const getParam = require('../helpers/customParams').get;

const codeToResponse = require('../helpers/errorCodes').codeToResponse;
const url = "/horsesRef";
/**
 * Gestion des tenants par le super administrateur
 * Permet de :
 * <li>lister les tenants
 * <li>créer un tenant
 * <li>récupérer les paramètres administrateur du tenant
 * <li>modifier les paramètres administrateur du tenant
 */
module.exports = {
  getAllTenants,
  createTenant,
  getAdminTenantSettings,
  setAdminTenantSettings,
};

/**
 * Méthode pour GET /admin/tenants
 *
 * Retourne les tenants de ce service
 * @param req requête
 * @param res réponse sous forme d'un tableau de tous les tenants
 *
 */
function getAllTenants(req, res) {
  // TODO la pagination
  tenants.getAll()
    .then(tenants => {
      res.status(200).json(tenants);
    })
    .catch(err => {
      codeToResponse(res, err);
    });
}

/**
 * Méthode pour POST /admin/tenants
 *
 * Crée un tenant pour ce service
 * @param req le json contenant l'id et la description du nouveau tenant
 * @param res 201 : créé, 409: erreur car déjà créé, 500: autre erreur
 */
function createTenant(req, res) {
  function addTenantUri(res, idTenant) {
    res.header("link",
      new links()
        .add({
          href: `${url}/admin/tenants/${idTenant}`,
          rel: "self",
          title: "Reference to the tenant uri",
          name: "tenant",
          method: "GET",
          type: "application/json"
        })
        .build()
    );
  }

  const newTenant = req.swagger.params.tenant.value;
  tenants.create(newTenant.id, newTenant.texts.description, newTenant.contacts)
    .then(tenant => {
      addTenantUri(res, tenant.id);
      res.status(201).json();
    })
    .catch(err => {
      codeToResponse(res, err);
    });
}

/**
 *
 * @param req
 * @param res
 */
function getAdminTenantSettings(req, res) {
  const tenant = getParam(req, "tenant", "value");
  if(tenant !== null) {
    res.status(200).json(tenant.adminSettings || {});
  }
  else {
    codeToResponse(res, getParam(req, "tenant", "err"));
  }
}

/**
 * 
 * @param req
 * @param res
 */
function setAdminTenantSettings(req, res) {
  const tenantId = getParam(req, "tenant", "value", "id");
  const settings = req.swagger.params.settings.value;
  tenants.update(tenantId, "adminSettings", settings)
    .then(settings => {
      res.status(200).json(settings);
    })
    .catch(err => {
      codeToResponse(res, err);
    });
}
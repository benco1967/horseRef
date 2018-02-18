'use strict';

const tenants = require('../models/tenant');
const groupRoleMappingValidator = require('../models/groupRoleMapping').validator;

const codeToResponse = require('../helpers/errorCodes').codeToResponse;
const error = require('../helpers/errorCodes').error;
const BAD_REQUEST = require('../helpers/errorCodes').BAD_REQUEST;
const getParam = require('../helpers/customParams').get;

module.exports = {
  getTenantSettings,
  setTenantSettings,
  getTenantGroupRoleMapping,
  setTenantGroupRoleMapping,
};

/**
 * Méthode pour GET /admin/tenants
 *
 * Retourne les tenants de ce service
 * @param req requête
 * @param res réponse
 *
 */
function getTenantSettings(req, res) {

  const tenant = getParam(req, "tenant", "value");
  if(tenant !== null) {
    res.status(200).json(tenant.settings || {});
  }
  else {
    codeToResponse(res, getParam(req, "tenant", "err"));
  }
}

function setTenantSettings(req, res) {
  const tenantId = getParam(req, "tenant", "value", "id");
  const settings = req.swagger.params.settings.value;
  tenants.update(tenantId, "settings", settings)
    .then(settings => {
      res.status(200).json(settings);
    })
    .catch(err => {
      codeToResponse(res, err);
    });
}


function getTenantGroupRoleMapping(req, res) {

  const tenant = getParam(req, "tenant", "value");
  if(tenant !== null) {
    res.status(200).json(tenant.groupRoleMapping || {});
  }
  else {
    codeToResponse(res, getParam(req, "tenant", "err"));
  }
}

function setTenantGroupRoleMapping(req, res) {
  const tenantId = getParam(req, "tenant", "value", "id");
  const groupRoleMapping = req.swagger.params.groupRoleMapping.value;
  groupRoleMappingValidator(false)(groupRoleMapping)
    .catch(err => {
      throw error(BAD_REQUEST, err)
    })
    .then(() =>
      tenants.update(tenantId, "groupRoleMapping", groupRoleMapping)
    )
    .then(groupRoleMapping => {
      res.status(200).json(groupRoleMapping);
    })
    .catch(err => {
      codeToResponse(res, err);
    });
}

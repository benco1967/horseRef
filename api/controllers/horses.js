'use strict';

const debug = require('debug')("horsesRef:info");
const horseModel = require('../models/horseModel');
const getParam = require('../helpers/customParams').get;
const links = require('../helpers/linkBuilder');
const codeToResponse = require('../helpers/errorCodes').codeToResponse;
const errorToResponse = require('../helpers/errorCodes').errorToResponse;
const error = require('../helpers/errorCodes').error;
const NOT_FOUND = require('../helpers/errorCodes').NOT_FOUND;
const BAD_REQUEST = require('../helpers/errorCodes').BAD_REQUEST;


//TODO
module.exports = {
  getHorses,
  createHorse,
  getHorse,
  updateHorse,
  patchHorse,
};

/**
 *
 */
function getHorses(req, res) {
  const tenant = getParam(req, "tenant", "value");
  horseModel.getAll(tenant.id)
    .then(horses => {
      res.status(200).json(horses);
    });
}

function getHorse(req, res) {
  const tenant = getParam(req, "tenant", "value");
  horseModel.get(tenant.id, req.swagger.params.horseId.value)
    .then(horse => {
      if (horse === null) {
        codeToResponse(res, error(NOT_FOUND));
      }
      else {
        res.status(200).json(horse);
      }
    })
    .catch(err => {
      codeToResponse(res, err);
    });
}

function createHorse(req, res) {
  //TODO gérer l'url dans la config
  const url = "/horsesRef";

  if(horseModel.validator(req.body)) {
    const tenant = getParam(req, "tenant", "value");
    const authorization = getParam(req, "authorization");
    horseModel.update(null, authorization.Usr, tenant.id, req.body)
      .then(id => {
        debug(`new horse ${id} created`);
        res
          .header("link",
            new links()
              .add({
                href: `${url}/${tenant.id}/horses/${id}`,
                rel: "self",
                title: "Refers to the newly created horse",
                name: "self",
                method: "GET",
                type: "application/json"
              })
              .build())
          .status(201).end();
      })
      .catch(err => {
        codeToResponse(res, err);
      });
  }
  else {
    errorToResponse(res, BAD_REQUEST, `invalid horse format`);
  }
}
function updateHorse(req, res) {
  if(horseModel.validator(req.body)) {
    const horseId = req.swagger.params.horseId.value;
    const tenant = getParam(req, "tenant", "value");
    const authorization = getParam(req, "authorization");
    horseModel.update(horseId, authorization.Usr, tenant.id, req.body)
      .then(() => {
        res.status(200).end();
      })
      .catch(err => {
        codeToResponse(res, err);
      });
  }
  else {
    errorToResponse(res, BAD_REQUEST, `invalid horse format`);
  }
}
function patchHorse(req, res) {
  const horseId = req.swagger.params.horseId.value;
  const tenant = getParam(req, "tenant", "value");
  const authorization = getParam(req, "authorization");
  horseModel.patch(horseId, authorization.Usr, tenant.id, req.body)
    .then(() => {
      res.status(200).end();
    })
    .catch(err => {
      codeToResponse(res, err);
    });
}

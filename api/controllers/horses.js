'use strict';

const util = require('util');

const debug = require('debug')("horsesRef:info");
const error = require('debug')("horsesRef:error");
const horseModel = require('../models/horseModel');
const getParam = require('../helpers/customParams').get;

//TODO
module.exports = {
  getHorses,
  createHorse,
  getHorse,
  patchHorse,
};

/**
 *
 */
function getHorses(req, res) {
  res.status(200).json([]);
}

function getHorse(req, res) {
  const tenant = getParam(req, "tenant", "value");
  horseModel.get(tenant.id, req.swagger.params.horseId.value)
    .then(horse => {
      res.status(200).json(horse);
    })
}

function createHorse(req, res) {
  if(horseModel.validator(req.body)) {
    const tenant = getParam(req, "tenant", "value");
    const authorization = getParam(req, "authorization");
    horseModel.update(authorization.Usr, tenant.id, req.body)
      .then(id => res.status(201).end());
  }
  else {
    res.status(400).json({});
  }
}
function patchHorse(req, res) {
  res.status(503).json();
}

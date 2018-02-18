'use strict';

const debug = require('debug')("horsesRef:horse");
const mongoose = require('mongoose');
const checkDB = require('./dbConnection').checkDB;
const jsonpatch = require('fast-json-patch');
const uuid = require('uuid/v4');
const ajv = new require('ajv')();


const horseSchema = require('./horseSchema');
// Definitions du modele
const horsePatches = new mongoose.Schema({
    id:  {
      type :      String,
      required :  true,
    },
    tenantId : {
      type :      String,
      required :  true,
    },
    userId : {
      type :      String,
      required :  true,
    },
    date : {
      type :      Date,
      required :  true,
    },
    patches : [
      mongoose.Schema.Types.Mixed
    ]

  });

// Models are created from schemas using the mongoose.model() method:
const horsePatchesModel = mongoose.model('horsePatches', horsePatches , 'horsePatches');

/**
 *
 * @returns {Promise.<TResult>}
 */
const get = (tenantId, id) => checkDB()
  .then(() => horsePatchesModel
    .aggregate()
    .match({ tenantId, id })  // recherche tous les patches sur le cheval
    .sort({ date: 1 })      //trie les resultats par date
    .unwind("$patches")      //applati tous les patches
    .group({ _id: "$id", patches: { $push:"$patches" } }) // regroupe tous les patches en un tableau
    .exec()
    .then(result => {
      console.log(result)
      console.log(`${tenantId} ${id}`)
      if(result === null || result.length === 0) {
        // No such horse
        return null;
      }
      if(result.length !== 1) {
        throw Error(`Horses db integrity error ${id} (${result.length})`);
      }
      //reconstruction du cheval
      return jsonpatch.applyPatch({ tenantId, id }, result[0].patches).newDocument;
    }));

const update = (userId, tenantId, horseNew) => get(tenantId, horseNew.id || "")
  .then(horsePrev => {
    const defaultHorse = { updatedAt: Date.now() };
    if(horsePrev === null) {
      horsePrev = {};
      defaultHorse.createdAt = Date.now();
      defaultHorse.id = uuid();
      defaultHorse.tenantId = tenantId;
    }
    horseNew = Object.assign(defaultHorse, horseNew);
    const patches = jsonpatch.compare(horsePrev, horseNew);

    const entry = {
      id: horseNew.id,
      tenantId,
      userId,
      date: new Date(),
      patches
    };

    return horsePatchesModel.create(entry);
  })
  .then(entry => entry.id);

// make this available in our Node applications
module.exports = {
  validator: ajv.compile(horseSchema),
  model: horsePatchesModel,
  get,
  update,
};

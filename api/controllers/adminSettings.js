'use strict';

const adminSettings = require('../models/adminSettings');
const codeToResponse = require('../helpers/errorCodes').codeToResponse;

module.exports = {
  getAdminSettings,
  setAdminSettings,
};

/**
 * Méthode pour GET /admin/settings
 *
 * Retourne les paramètres généraux
 * @param req request
 * @param res réponse JSON des paramètres
 */
function getAdminSettings(req, res) {
  adminSettings.get()
  // suppression des champs inutiles (_v, _id)
    .then(settings =>
      settings.toObject({
        versionKey: false,
        minimize: false,
        transform: (doc, ret) => { delete ret._id; return ret; },
      }))
    .then(settings => {
      res.json(settings);
    })
    .catch(err => {
      codeToResponse(res, err);
    });
}

/**
 * Méthode pour PUT /admin/settings
 *
 * Retourne les paramètres généraux
 * @param req request
 * @param res réponse JSON des paramètres
 */
function setAdminSettings(req, res) {
  adminSettings.update(req.body)
    .then(settings => {
      res.json(settings);
    })
    .catch(err => {
      codeToResponse(res, err);
    });

}

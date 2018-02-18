'use strict';

const links = require('../helpers/linkBuilder');
const StatusBuilder = require('../helpers/statusBuilder');
const ROLES = require('../models/groupRoleMapping').ROLES;

module.exports = {
  general,
  status,
  license,
  version,
  roles,
};

/**
 * Méthode pour /admin
 *
 * Point d'entrée qui retourne la liste des liens disponibles
 * @param req request
 * @param res réponse contenant les liens nécessaires à la découverte du service dans l'entête et une description dans
 * le corps
 */
function general(req, res) {

  //TODO gérer l'url dans la config
  const url = "/horsesRef";

  res.header("link",
    new links()
      .add({
        href: `${url}/admin/status`,
        rel: "status",
        title: "Refers to the service's status",
        name: "status",
        method: "GET",
        type: "application/json"
      })
      .add({
        href: `${url}/admin/license`,
        rel: "license",
        title: "Refers to the service's license",
        name: "license",
        method: "GET",
        type: "plain/text"
      })
      .add({
        href: `${url}/admin/roles`,
        rel: "roles",
        title: "List all available roles",
        name: "roles",
        method: "GET",
        type: "application/json"
      })
      .add({
        href: `${url}/admin/version`,
        rel: "version",
        title: "Refers to the service's version",
        name: "version",
        method: "GET",
        type: "application/json"
      })
      .add({
        href: `${url}/admin/swagger.json`,
        rel: "swagger",
        title: "Refers to the service's swagger definition",
        name: "swagger",
        method: "GET",
        type: "application/json"
      })
      .add({
        href: `${url}/admin/tenants`,
        rel: "tenants",
        title: "List all available tenants",
        name: "tenants",
        method: "GET",
        type: "application/json"
      })
      .build()
  );
  res.json({
      title: "Administration endpoint",
      description: "Welcome to the multitenancy administration endpoint, you will find all available tenants"
    });
}

/**
 * Méthode pour /admin/version
 *
 * Retourne la version de ce service
 * @param req request
 * @param res réponse contenant la version du service
 */
function version(req, res) {
  //TODO mettre la version et notamment le build_number dynamiquement
  res.json({
    name: "horsesRef",
    version: {
      number: "0.0.0",
      build_number: "0",
      build_type: "debug"
    }
  });
}
/**
 * Méthode pour /admin/status
 *
 * Retourne le status courant de ce service
 * @param req request
 * @param res réponse json décrivant l'état du service et de ses dépendances
 */
function status(req, res) {
  new StatusBuilder()
    .addDependencie(require('../helpers/dbStatus'))
    .getStatus()
    .then(status => res.json(status));
}
/**
 * Méthode pour /admin/license
 *
 * Retourne la licence de ce service
 * @param req request
 * @param res réponse au format au format Atom XML RFC4946
 */
function license(req, res) {
  const root = __dirname + '/../..';
  const licenseFilePath = '/config/license.xml';
  res.sendFile(
    licenseFilePath,
    { root },
    err => {
      if(err) {
        console.error(`error to get the license: ${err}`);
        res.status(500).json({message: err});
      }
    });
}

/**
 * Méthode pour /admin/roles
 *
 * Retourne la liste des roles disponibles pour ce service
 * @param req request
 * @param res réponse JSON décrivant les rôles du services
 */
function roles(req, res) {
  res.json(ROLES);

}


'use strict';


const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const debug = require('debug')("horsesRef:info");


module.exports = app; // for testing

// Swagger a la très mauvaise idée de modifier la config qui est normalement immutable
// On doit donc autoriser les modifications
process.env.ALLOW_CONFIG_MUTATIONS = true;
const config = require('config');

const configSwagger = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers : require('./api/fittings/security/simpleSecurityHandler')().swaggerSecurityHandlers,
};

debug(`HorsesRef Service is starting in "${config.util.getEnv('NODE_ENV')}" mode`);

SwaggerExpress.create(configSwagger, (err, swaggerExpress) => {
  process.env.ALLOW_CONFIG_MUTATIONS = false;

  if (err) {
    throw err;
  }

  // install middleware
  swaggerExpress.register(app);

  app.listen(config.get('port'));

  if (swaggerExpress.runner.swagger.paths['/admin']) {
    debug(`try this: curl http://127.0.0.1:${config.get('port')}/admin`);
  }
});
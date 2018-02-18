'use strict';

const error = require('debug')("horsesRef:error");

const CODES = {
  BAD_REQUEST      : { name: 'BAD_REQUEST'      , status: 400, message: "Bad request" },
  UNAUTHORIZED     : { name: 'UNAUTHORIZED'     , status: 401, message: "Access denied, invalid token" },
  FORBIDDEN        : { name: 'FORBIDDEN'        , status: 403, message: "Access not allowed for this accreditation" },
  NOT_FOUND        : { name: 'NOT_FOUND'        , status: 404, message: "No such tenant" },
  ALREADY_EXISTS   : { name: 'ALREADY_EXISTS'   , status: 409, message: "" },
  FORBIDDEN_ID     : { name: 'FORBIDDEN_ID'     , status: 409, message: "" },
  GONE             : { name: 'GONE'             , status: 410, message: "This tenant is no more available" },
  UNKNOW           : { name: 'UNKNOW'           , status: 500, message: "" },
  UNABLE_TO_CONNECT: { name: 'UNABLE_TO_CONNECT', status: 503, message: "Service unavailable, DB unreachable" },
  };

module.exports = {
  BAD_REQUEST      : Symbol.for('BAD_REQUEST'      ),
  UNAUTHORIZED     : Symbol.for('UNAUTHORIZED'     ),
  FORBIDDEN        : Symbol.for('FORBIDDEN'        ),
  NOT_FOUND        : Symbol.for('NOT_FOUND'        ),
  ALREADY_EXISTS   : Symbol.for('ALREADY_EXISTS'   ),
  FORBIDDEN_ID     : Symbol.for('FORBIDDEN_ID'     ),
  GONE             : Symbol.for('GONE'             ),
  UNKNOW           : Symbol.for('UNKNOW'           ),
  UNABLE_TO_CONNECT: Symbol.for('UNABLE_TO_CONNECT'),
  /**
   * Fonction convertisant une erreur interne en une erreur http
   * @param res la réponse contenant le json de l'erreur
   * @param err l'erreur de type { code : Symbol, message: "xxx" }
   */
  codeToResponse: (res, err) => {
    const code = CODES[err && err.code && Symbol.keyFor(err.code)] || CODES.UNKNOW;
    error(`Internal error : (${code.name}) ${err && err.message && JSON.stringify(err) || err}`);
    res.status(code.status).json({ name: err && err.name || code.name, message: err && err.message || err || code.message });
  },
  error: (status, msg) => {
    const code = CODES[Symbol.keyFor(status)];
    const error = Error(msg || code.message);
    error.statusCode = code.status;
    error.code = status;
    return error;
  }
};

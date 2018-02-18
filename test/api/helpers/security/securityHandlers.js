const should = require('should');
const jwt = require('jsonwebtoken');
const getParam = require('../../../../api/helpers/customParams').get;

const parameters = {
  sharedSecret: "secret",
  options: {
    issuer: "test",
    audience: /test/
  },
  adminGroupRoleMapping: { admin: ["adm"] },
};
const simpleSecurityHandler = require('../../../../api/fittings/security/simpleSecurityHandler')(parameters);
const bearerSecurityHandler = simpleSecurityHandler.swaggerSecurityHandlers.Bearer;

const parametersNull = {
  sharedSecret: "secret",
  options: {},
  adminGroupRoleMapping: { admin: ["adm"] },
};
const simpleSecurityHandlerNull = require('../../../../api/fittings/security/simpleSecurityHandler')(parametersNull);
const bearerSecurityHandlerNull = simpleSecurityHandlerNull.swaggerSecurityHandlers.Bearer;

const defaultPayload = {
  iss: "test",
  aud: "test and other value",
  sub: "test@example.com",
  Grp: { admin: [ "admin" ], test: ["admin"] },
};

const createToken = (payload, parameters) => {
  return "Bearer " + jwt.sign(payload, parameters.sharedSecret);
};

describe('Bearer Security Handler', () => {

  describe('Direct test with function without check of issuer and audience', () => {

    it('Valid token without check of issuer and audience', done => {
      const req = {};
      bearerSecurityHandlerNull(req, null, createToken(Object.assign({}, defaultPayload), parameters), (err) => {
        should.not.exist(err);
        getParam(req, "authorization").should.have.match(defaultPayload);
        done();
      });
    });

    it('Invalid token', done => {
      const req = {};
      bearerSecurityHandlerNull(req, null, "Not a Bearer token", (err) => {
        should.exist(err);
        done();
      });
    });

  });

  describe('Direct test with function with issuer and audience', () => {

    it('Valid token', done => {
      const req = {};
      bearerSecurityHandler(req, null, createToken(Object.assign({}, defaultPayload), parameters), (err) => {
        should.not.exist(err);
        getParam(req, "authorization").should.have.match(defaultPayload);
        done();
      });
    });

    it('Valid token with wrong issuer', done => {
      const req = {};
      bearerSecurityHandler(req, null, createToken(Object.assign({}, defaultPayload, { iss: "wrongIssuer" }), parameters), (err) => {
        should.exist(err);
        done();
      });
    });

    it('Valid token with wrong aud', done => {
      const req = {};
      bearerSecurityHandler(req, null, createToken(Object.assign({}, defaultPayload, { aud: "not the good one" }), parameters), (err) => {
        should.exist(err);
        done();
      });
    });

  });

});
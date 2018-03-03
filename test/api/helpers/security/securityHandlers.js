const should = require('should');
const jwt = require('jsonwebtoken');
const getParam = require('../../../../api/helpers/customParams').get;

const parameters = {
  bearer: {
    sharedSecret: "secret",
    options: {
      issuer: "test",
      audience: /test/
    }
  },
  basic: {

  },
  adminGroupRoleMapping: { admin: ["adm"] },
};
const bearerSecurityHandler = require('../../../../api/fittings/security/bearerSecurityHandler').Bearer(parameters);

const parametersNull = {
  bearer: {
    sharedSecret: "secret",
    options: {}
  },
  basic: {
  },
  adminGroupRoleMapping: { admin: ["adm"] },
};
const bearerSecurityHandlerNull = require('../../../../api/fittings/security/bearerSecurityHandler').Bearer(parametersNull);
const basicSecurityHandlerNull = require('../../../../api/fittings/security/basicSecurityHandler').Basic(parametersNull);

const defaultPayload = {
  iss: "test",
  aud: "test and other value",
  sub: "test@example.com",
  Usr: "admin",
  Grp: { admin: [ "admin" ], test: ["admin"] },
};

const createToken = (payload, parameters) => {
  return "Bearer " + jwt.sign(payload, parameters.bearer.sharedSecret);
};
const defaultReq = {res:{header:() => {}}};

describe('Bearer Security Handler', () => {

  describe('Direct test with function without check of issuer and audience', () => {

    it('Valid token without check of issuer and audience', done => {
      const req = defaultReq;
      bearerSecurityHandlerNull(req, null, createToken(Object.assign({}, defaultPayload), parameters), (err) => {
        should.not.exist(err);
        getParam(req, "user").should.have.match({ userId: defaultPayload.Usr, groups: defaultPayload.Grp });
        done();
      });
    });

    it('Invalid token', done => {
      bearerSecurityHandlerNull(defaultReq, null, "Not a Bearer token", (err) => {
        should.exist(err);
        err.should.have.match({statusCode: 401, message: /wrong Authorization protocol/});
        done();
      });
    });

  });

  describe('Direct test with function with issuer and audience', () => {

    it('Valid token', done => {
      const req = defaultReq;
      bearerSecurityHandler(req, null, createToken(Object.assign({}, defaultPayload), parameters), (err) => {
        should.not.exist(err);
        getParam(req, "user").should.have.match({ userId: defaultPayload.Usr, groups: defaultPayload.Grp });
        done();
      });
    });

    it('Valid token with wrong issuer', done => {
      bearerSecurityHandler(defaultReq, null, createToken(Object.assign({}, defaultPayload, { iss: "wrongIssuer" }), parameters), (err) => {
        should.exist(err);
        err.should.have.match({statusCode: 401, message: /jwt issuer invalid/});
        done();
      });
    });

    it('Valid token with wrong aud', done => {
      bearerSecurityHandler(defaultReq, null, createToken(Object.assign({}, defaultPayload, { aud: "not the good one" }), parameters), (err) => {
        should.exist(err);
        err.should.have.match({statusCode: 401, message: /jwt audience invalid/});
        done();
      });
    });

  });

});

describe('Basic Security Handler', () => {

  describe('Direct test with function', () => {

    it('Valid authentification', done => {
      const req = Object.assign({}, defaultReq, { headers:{ authorization: "Basic YWRtaW46YWRtaW4=" } });
      basicSecurityHandlerNull(req, null, null, (err) => {
        should.not.exist(err);
        getParam(req, "user").should.have.match({
          userId: "admin",
          groups: { admin: [ "admin" ] },
          roles: [ 'adm', 'mng', 'snd', 'usr' ]
        });
        done();
      });
    });

    it('valid authentification but wrong user', done => {
      const req = Object.assign({}, defaultReq, { headers:{ authorization: "Basic d2hhdGV2ZXI6d2hhdGV2ZXI=" } });// no authentication
      basicSecurityHandlerNull(req, null, null, (err) => {
        should.exist(err);
        err.should.have.match({statusCode: 401, message: /invalid name \/ password/});
        done();
      });
    });
    it('Invalid authentification', done => {
      basicSecurityHandlerNull(defaultReq, null, null, (err) => {
        should.exist(err);
        err.should.have.match({statusCode: 401, message: /invalid basic authentication/});
        done();
      });
    });

  });

});

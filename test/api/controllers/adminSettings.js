const should = require('should');
const request = require('supertest');

const createTestTenant = require('../helpers/dbTest').createTestTenant;

const server = require('../../../app');

const withTimestamps = {
  createdAt: (date) => date.should.be.a.Date,
  updatedAt: (date) => date.should.be.a.Date,
};

require('../helpers/security/generateAuthorization')().then(authorization => {
  describe('controllers general settings', () => {

    describe('admin/settings', () => {

      describe('GET /admin/settings', () => {
        const settings = {
          texts: {
            description: [
              {
                "text": "paramètres de l'administration",
                "locale": "fr"
              }
            ]
          },
          lang: 'fr',
          groupRoleMapping: {
            admin: ["adm"]
          },
          authentication: [],
        };
        it('should return settings of the new tenant', done => {
          createTestTenant().then(() => {
            request(server)
              .get('/admin/settings')
              .set('Accept', 'application/json')
              .set('Authorization', authorization)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                should.not.exist(err);
                res.body.should.match(Object.assign({}, settings, withTimestamps));
                done();
              });
          });
        });

        it('should fail if no Authorization', done => {
          createTestTenant().then(() => {
            request(server)
              .get('/admin/settings')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(401)
              .end((err, res) => {
                should.not.exist(err);
                done();
              });
          });
        });

      });

      describe('PUT /admin/settings', () => {

        const settings = {
          texts: {
            description: [
              {
                "text": "paramètres de l'administration du service",
                "locale": "fr"
              }
            ]
          },
          lang: 'fr',
          groupRoleMapping: {
            admin: ["adm", "mng"]
          },
          authentication: [],
        };
        it('should return settings of the new tenant', done => {
          createTestTenant().then(() => {
            request(server)
              .put('/admin/settings')
              .set('Accept', 'application/json')
              .set('Authorization', authorization)
              .send(settings)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                should.not.exist(err);
                res.body.should.match(Object.assign({}, settings, withTimestamps));
                done();
              });
          });
        });

        it('should fail if no Authorization', done => {
          createTestTenant().then(() => {
            request(server)
              .put('/admin/settings')
              .set('Accept', 'application/json')
              .send(
                {
                  something: "useless"
                }
              )
              .expect('Content-Type', /json/)
              .expect(401)
              .end((err, res) => {
                should.not.exist(err);
                done();
              });
          });

        });

      });

    });

  });

});

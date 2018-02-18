const should = require('should');
const request = require('supertest');
const createTestTenant = require('../helpers/dbTest').createTestTenant;

require('../helpers/dbTest');

const server = require('../../../app');

require('../helpers/security/generateAuthorization')().then(authorization => {
  describe('controllers horses', () => {

    describe('/{tenant}/horses', () => {

      describe('GET /{tenant}/horses', () => {

        it('should return horses', done => {
          createTestTenant().then(() => {
            request(server)
              .get('/test/horses')
              .set('Accept', 'application/json')
              .set('Authorization', authorization)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                should.not.exist(err);
                res.body.should
                  .be.instanceof(Array)
                  .and
                  .matchEach({
                    name: name => name.should.be.a.String,
                  });
                done();
              });
          });
        });

        it('should fail if no Authorization', done => {
          createTestTenant().then(() => {
            request(server)
              .get('/test/horses')
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

      describe('POST /{tenant}/horses', () => {

        it('should return new horse id', done => {
          createTestTenant().then(() => {
            request(server)
              .post('/test/horses')
              .set('Accept', 'application/json')
              .set('Authorization', authorization)
              .send(
                {
                  name: "test",
                }
              )
              .expect(201)
              .end((err, res) => {
                should.not.exist(err);
                res.body.should
                  .match({});
                done();
              });
          });
        });

        it('should fail if no Authorization', done => {
          createTestTenant().then(() => {
            request(server)
              .post('/test/horses')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(401)
              .send(
                {
                  name: "test",
                }
              )
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
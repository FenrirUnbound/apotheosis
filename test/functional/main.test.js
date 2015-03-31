var expect = require('chai').expect;

describe('Main', function describeMain() {
  var server;

  beforeEach(function beforeAll(done) {
    var main = require('../../lib/server');
    main().then(function (hapiServer) {
      server = hapiServer;
      done();
    })
    .done();
  });

  afterEach(function afterAll(done) {
    server.stop(done);
  });

  describe('-- Status', function describeStatus() {
    it('serves a status OK', function testStatusOk(done) {
      server.inject({
        method: 'GET',
        url: '/api/status'
      }, function (response) {
        var data;
        expect(response.statusCode).to.equal(200);
        data = JSON.parse(response.payload);
        expect(data).to.deep.equal({status:'OK'});
        done();
      });
    });
  });
});

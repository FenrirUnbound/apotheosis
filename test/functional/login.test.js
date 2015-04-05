var expect = require('chai').expect;
var mockery = require('mockery');
var path = require('path');

describe('Login', function describeLogin() {
  var server;

  before(function onceBefore() {
    var env;
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
    env = require('node-env-file');
    env(path.resolve(__dirname, '..', '..', '.env'), {raise: false});
  });


  beforeEach(function beforeAll(done) {
    var main = require('../../lib/server');
    main().then(function (hapiServer) {
      server = hapiServer;
      done();
    })
    .done();
  });

  afterEach(function afterAll(done) {
    server.stop(function () {
        server = null;
        mockery.resetCache();
        done();
    });
  });

  after(function onceAfter() {
    mockery.disable();
  });

  it('should validate a pseudo login', function testLogin(done) {
    server.inject({
      method: 'POST',
      url: '/api/login'
    }, function verify(response) {
      expect(response.statusCode).to.equal(204);
      done();
    });
  });
});

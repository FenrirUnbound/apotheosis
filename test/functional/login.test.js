var atob = require('atob');
var cookie = require('cookie');
var expect = require('chai').expect;
var mockery = require('mockery');
var path = require('path');
var q = require('q');

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

  function parseAndValidateCookie(response) {
    var headerInformation = response.headers['set-cookie'].pop();
    var cookies = cookie.parse(headerInformation);
    var result = {};

    expect(cookies).to.have.property('player');
    expect(cookies).to.have.property('Path')
      .that.deep.equal('/');

    result.player = parseInt(atob(cookies.player), 10);

    return result;
  }

  it('should validate a login', function testLogin(done) {
    var testId = 88888888;

    server.inject({
      method: 'POST',
      url: '/api/login',
      payload: {playerId: testId}
    }, function verify(response) {
      var cookies;
      expect(response.statusCode).to.equal(204);
      expect(response.headers).to.have.property('set-cookie');

      cookies = parseAndValidateCookie(response);
      expect(cookies).to.have.property('player')
        .that.equal(testId);

      done();
    });
  });
});

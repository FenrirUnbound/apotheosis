var atob = require('atob');
var cookie = require('cookie');
var expect = require('chai').expect;
var mockery = require('mockery');
var path = require('path');

describe('Main', function describeMain() {
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

  describe('-- HTML Page', function describePage() {
    it('serves a HTML page', function testHtmlPage(done) {
      server.inject({
        method: 'GET',
        url: '/admin.html'
      }, function (response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers).to.have.property('content-type')
          .that.contains('text/html');
        done();
      });
    });
  });

  describe('-- Games', function describeGames() {
    function checkAndGetCookies(response) {
      var cookies;

      expect(response.headers).to.have.property('set-cookie');

      cookies = cookie.parse(response.headers['set-cookie'].shift());
      expect(cookies).to.have.property('player');

      return JSON.parse(atob(cookies.player));
    }

    it('should create a game', function testCreateGame(done) {
      var CREATED_STATE = 0;

      server.inject({
        method: 'POST',
        url: '/api/games'
      }, function (response) {
        var data;
        var playerData;
        expect(response.statusCode).to.equal(201);
        playerData = checkAndGetCookies(response);

        data = JSON.parse(response.payload);
        expect(data).to.have.property('gameId')
          .that.is.greaterThan(0);
        expect(data).to.have.property('gameState')
          .that.equal(CREATED_STATE);
        expect(data).to.have.property('creator')
          .that.equal(playerData.playerId);
        done();
      });
    });
  });
});

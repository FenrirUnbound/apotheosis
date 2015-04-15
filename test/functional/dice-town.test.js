var expect = require('chai').expect;
var mockery = require('mockery');
var path = require('path');

describe('Dice-Town', function describeMain() {
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
    this.timeout(5000);
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
        url: '/dice_town/api/status'
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
        url: '/dice_town/admin.html'
      }, function (response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers).to.have.property('content-type')
          .that.contains('text/html');
        done();
      });
    });
  });
});

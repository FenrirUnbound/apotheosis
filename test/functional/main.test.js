var expect = require('chai').expect;
var mockery = require('mockery');

describe('Main', function describeMain() {
  var server;

  before(function onceBefore() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
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
    server.stop(done);
    mockery.resetCache();
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
});

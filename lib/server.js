var hapi = require('hapi');
var q = require('q');
var server = new hapi.Server();
server.connection({port: process.env.PORT});

function registerRoutes(server) {
  var promise = q.defer();

  server.register({
    register: require('./routes').status
  }, {
    routes: {
      prefix: '/api/status'
    }
  }, function registeredRoutes() {
    promise.resolve(server);
  });

  return promise.promise;
}

module.exports = function () {
  var promise = q.defer();

  registerRoutes(server)
  .then(function () {
    server.start(function serverStarted() {
      console.log('Server running at: ', server.info.uri);
      promise.resolve(server);
    });
  })
  .done();

  return promise.promise;
};

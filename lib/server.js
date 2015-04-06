var hapi = require('hapi');
var q = require('q');
var routes = require('./routes');
var server = new hapi.Server();
server.connection({port: process.env.PORT});

function enableCookie(server) {
  return q.fcall(function () {
    server.state('player', {
      encoding: 'base64json',
      path: '/'
    });

    return server;
  });
}

function registerRoutes(server) {
  var register = q.nbind(server.register, server);

  return q.keys(routes)
  .then(function (endpoints) {
    return endpoints.map(function (endpoint) {
      return register({
        register: routes[endpoint]
      }, {
        routes: {
          prefix: '/api/' + endpoint
        }
      });
    });
  })
  .then(function (registrations) {
    return q.all(registrations);
  })
  .then(function () {
    server.route({
      method: 'GET',
      path: '/{filename*}',
      handler: {
        directory: {
          path: 'public'
        }
      }
    });
  })
  .then(function () {
    return server;
  });
}

module.exports = function () {
  var promise = q.defer();

  registerRoutes(server)
  .then(enableCookie)
  .then(function () {
    server.start(function serverStarted() {
      console.log('Server running at: ', server.info.uri);
      promise.resolve(server);
    });
  })
  .done();

  return promise.promise;
};

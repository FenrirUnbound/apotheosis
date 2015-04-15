var customRoutes = require('./customRoutes');
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

function pluginRegistration(plugins, routePrefix) {
  var register = q.nbind(server.register, server);

  return q.keys(plugins)
  .then(function (endpoints) {
    return endpoints.map(function (endpoint) {
      return register({
        register: plugins[endpoint]
      }, {
        routes: {
          prefix: routePrefix + endpoint
        }
      });
    });
  })
  .then(function (registrations) {
    return q.all(registrations);
  })
}

function registerRoutes(server) {
  var register = q.nbind(server.register, server);

  return q.all([
    pluginRegistration(routes, '/api/'),
    pluginRegistration(customRoutes, '/')
  ])
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

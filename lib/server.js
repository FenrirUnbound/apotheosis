var dumbAuth = require('./dumb-auth');
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

  q().then(function () {
    // TODO: make a separate function
    var deferred = q.defer();

    server.register(dumbAuth, function (err) {
      server.auth.strategy('simple', 'dumb');
      return deferred.resolve();
    });

    return deferred.promise;
  })
  .then(function () {
    return registerRoutes(server);
  })
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

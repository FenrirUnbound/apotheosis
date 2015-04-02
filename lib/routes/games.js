var game = require('../models/game');

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply({status: 'OK'});
    }
  });

  server.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {
      game.createGame()
      .then(function(info) {
        reply(info).code(201);
      });
    }
  });

  next();
};

exports.register.attributes = {
  name: 'gamesRoutes',
  version: '1.0.0'
};

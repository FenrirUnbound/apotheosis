var joi = require('joi');

exports.register = function (server, options, next) {
  server.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {
      reply()
        .code(204)
        .state('player', request.payload.playerId);
    },
    config: {
      validate: {
        payload: joi.object().keys({
          playerId: joi.number().integer().min(1)
        }).requiredKeys('playerId')
      }
    }
  });

  next();
};

exports.register.attributes = {
  name: 'loginRoutes',
  version: '1.0.0'
};

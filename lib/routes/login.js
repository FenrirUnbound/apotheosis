exports.register = function (server, options, next) {
  server.route({
    method: 'POST',
    path: '/',
    handler: function (request, reply) {
      reply()
        .code(204);
    }
  });

  next();
};

exports.register.attributes = {
  name: 'loginRoutes',
  version: '1.0.0'
};

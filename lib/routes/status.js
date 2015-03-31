exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply({status: 'OK'});
    }
  });

  next();
};

exports.register.attributes = {
  name: 'statusRoutes',
  version: '1.0.0'
};

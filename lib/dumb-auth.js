var atob = require('atob');
var boom = require('boom');
var cookie = require('cookie');
var q = require('q');

function parseCookies(userCookies) {
  return q(userCookies)
  .then(function (cookies) {
    return cookie.parse(cookies);
  })
  .then(function (cookies) {
    var result = {};
    Object.keys(cookies).forEach(function objectify(item) {
      var data = atob(cookies[item]);
      result[item] = JSON.parse(data);
    });
    return result;
  });
}

function authentication(request, reply) {
  q(request.headers)
  .then(function validateHeaders(headers) {
    if (!headers.hasOwnProperty('cookie')) {
      throw new Error('No player login data found');
    } else {
      return headers['cookie'];
    }
  })
  .then(parseCookies)
  .then(function validateCookies(cookies) {
    if (!cookies.hasOwnProperty('player')) {
      throw new Error('No player login data found!');
    } else {
      return cookies.player;
    }
  })
  .then(function (player) {
    return reply.continue({
      credentials: {
        id: player.playerId
      }
    });
  })
  .catch(function (reason) {
    // TODO: better 'reason'
    return reply(boom.unauthorized(reason));
  })
  .done();
}

function scheme(server, options) {
  return {
    authenticate: authentication
  };
}

exports.register = function (plugin, options, next) {
  plugin.auth.scheme('dumb', scheme);

  next();
};

exports.register.attributes = {
  name: 'dumbAuth',
  version: '1.0.0'
};

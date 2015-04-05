var atob = require('atob');
var cookie = require('cookie');
var game = require('../models/game');
var q = require('q');

function parseCookies(request) {
  return q.fcall(function () {
    var parsedCookies;
    var result = {};

    if (!request.headers.hasOwnProperty('set-cookie')) {
      return result;
    }
    parsedCookies = cookie.parse(request.headers['set-cookie']);

    Object.keys(parsedCookies).forEach(function decodeCookies(item) {
      var data = atob(parsedCookies[item]);
      result[item] = JSON.parse(data);
    });

    return result;
  });
}

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
      parseCookies(request)
      .then(function (cookies) {
        var playerData;

        if(cookies.hasOwnProperty('player')) {
          playerData = cookies.player.playerId;
        }

        return playerData;
      })
      .then(game.createGame)
      .then(function(info) {
        reply(info).code(201).state('player', {playerId: info.creator});
      })
      .done();
    }
  });

  next();
};

exports.register.attributes = {
  name: 'gamesRoutes',
  version: '1.0.0'
};

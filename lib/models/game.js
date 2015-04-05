var player = require('./player');
var q = require('q');
var url = require('url');
var wreck = require('wreck');

var GAME_STATE = require('./gameState');

function registerGame() {
  var post = q.nbind(wreck.post, wreck);
  var targetUrl = url.format({
    host: process.env.GAME_HOST,
    pathname: '/api/games/mc',
    protocol: 'http'
  });

  return post(targetUrl, {json: true})
  .spread(function (response, payload) {
    return payload;
  });
}

function createGame() {
  return q.all([
    registerGame(),
    player.generateRandomPlayer()
  ])
  .spread(function (gameReservation, creatorInfo) {
    return {
      creator: creatorInfo.userId,
      gameId: gameReservation.gameId,
      gameState: GAME_STATE.CREATED
    };
  });
}

module.exports = {
  createGame: createGame
};

var q = require('q');
var url = require('url');
var wreck = require('wreck');

function createGame() {
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

module.exports = {
  createGame: createGame
};

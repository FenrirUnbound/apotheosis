var q = require('q');
var wreck = require('wreck');

function createGame() {
  var post = q.nbind(wreck.post, wreck);

  return post('http://dry-shore-4613.herokuapp.com/api/games/mc', {json: true})
  .spread(function (response, payload) {
    return payload;
  });
}

module.exports = {
  createGame: createGame
};

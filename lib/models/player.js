var q = require('q');

function generateRandomPlayer() {
  return q.fcall(function () {
    return {
      userId: Date.now()
    };
  });
}

module.exports = {
  generateRandomPlayer: generateRandomPlayer
};

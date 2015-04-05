var expect = require('chai').expect;

describe('Model -- Player', function describeModelPlayer() {
  var player;

  beforeEach(function () {
    player = require('../../../lib/models/player');
  });

  it('should generate a random player', function testRandomPlayer(done) {
    player.generateRandomPlayer()
    .then(function (user) {
      expect(user).to.be.an('object');
      expect(user).to.have.property('userId')
        .that.is.at.most(Date.now());
      done();
    })
    .done();
  });
});

var expect = require('chai').expect;

describe('Game State', function describeGameState() {
  var gameStates = require('../../../lib/models/gameState');

  it('has the CREATED state', function testCreated() {
    var next = [];
    var properties;

    expect(gameStates).to.have.property('CREATED');
    expect(gameStates).to.have.property('properties')
      .that.has.property(gameStates.CREATED);

    properties = gameStates.properties[gameStates.CREATED];
    expect(properties).to.have.property('label')
      .that.deep.equal('created');
    expect(properties).to.have.property('next')
      .that.deep.equal(next);
  });
});

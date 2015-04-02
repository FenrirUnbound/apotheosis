var React = require('react');

module.exports = React.createClass({
  displayName: 'gameList',
  render: function () {
    var game = (this.props.gameId) ? React.createElement('li', null, this.props.gameId) : null;

    return (
      React.createElement('section', null,
        React.createElement('h3', null, 'Game List'),
        React.createElement('ul', null, game)
      )
    );
  }
});

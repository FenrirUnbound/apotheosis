var React = require('react');
var $ = require('zepto-browserify');

module.exports = React.createClass({
  displayName: 'createGame',
  render: function renderCreateGame() {
    return (
      React.createElement('form', {onSubmit: this.props.handleCreateGame},
        React.createElement('button', null, 'Create New Game')
      )
    );
  }
});

var CreateGame = require('./admin/gameGenerator');
var GameList = require('./admin/gameList');
var React = require('react');
var $ = require('jquery');

var Admin = React.createClass({
  displayName: 'admin',
  getInitialState: function () {
    return {gameId: 0};
  },
  handleCreateGame: function (e) {
    e.preventDefault();
    var my = this;

    $.ajax({
      url: '/api/games',
      method: 'POST',
      dataType: 'json',
      success: function (serverData) {
        my.setState({gameId: serverData.gameId});
      }
    });
  },
  render: function () {
    return (
      React.createElement('section', null,
        React.createElement(CreateGame, {handleCreateGame: this.handleCreateGame}),
        React.createElement(GameList, {gameId: this.state.gameId})
      )
    );
  }
});

React.render(
  React.createElement(Admin, null),
  document.getElementById('content')
);

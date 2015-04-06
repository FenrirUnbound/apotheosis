var cookieParser = require('cookie');
var React = require('react');
var $ = require('zepto-browserify').$;

var Login = React.createClass({
  displayName: 'LoginClass',
  handleSubmit: function (e) {
    e.preventDefault();
    var value = $('#loginInput').val();

    $.ajax({
      url: '/api/login',
      type: 'POST',
      dataType: 'json',
      data: {playerId: value},
      success: function (serverData) {
        console.log(document.cookie);
        var cookies = cookieParser.parse(document.cookie);
        var stuff = atob(cookies.player);
        console.log(stuff);
        console.log(typeof stuff);
      }
    });
  },
  render: function () {
    return (
      React.createElement('form', {onSubmit: this.handleSubmit},
        React.createElement('input', {id: 'loginInput'}),
        React.createElement('button', null, 'login')
      )
    );
  }
});

React.render(
  React.createElement(Login, null),
  document.getElementById('content')
);

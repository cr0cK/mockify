'use strict';

module.exports = (function () {
  var app     = require('express')(),
      server  = require('http').Server(app),
      io      = require('socket.io')(server),
      config  = require('./config');

  io.on('connection', function (socket) {
    socket.on('action', function (data) {
      console.log('receive', data);
    });
  });

  return {
    run: function () {
      server.listen(config.wsapp.port);
      console.log('Express server for websockets listening on port ' +
        config.wsapp.port);
    }
  };
})();

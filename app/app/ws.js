'use strict';

module.exports = (function () {
  var app     = require('express')(),
      server  = require('http').Server(app),
      io      = require('socket.io')(server),
      proxy   = require('./ws/proxy'),
      config  = require('./config');

  /**
   * Init Websockets connexion.
   */
  io.on('connection', function (socket) {
    console.log('Web socket connected.');

    // handle 'proxy' websockets
    socket.on('proxy', proxy.handleWS);

    // send the proxy childs stdout to websocket
    proxy.getEventEmitter().on('stdout', function (data) {
      io.emit('proxyLog', data.toString('utf8'));
    });
  });

  return {
    /**
     * Start the Express server.
     */
    run: function () {
      server.listen(config.wsapp.port);
      console.log('Express server for websockets listening on port ' +
        config.wsapp.port);
    }
  };
})();

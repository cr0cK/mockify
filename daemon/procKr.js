/**
 * This file is the procKr websocket interface, started as a daemon.
 */

'use strict';

module.exports = (function () {
  var config    = require('../config/config'),
      wsPort    = config.wsServer.port,
      io        = require('socket.io')(wsPort),
      spawn     = require('child_process').spawn;

  var expressChild;

  // setInterval(function () {
  //   console.log('.');
  // }, 1000);

  io.on('connection', function (socket) {
    socket.emit('hello', { message: 'Hi! This is procKr daemon.' });

    socket.on('web', function (action) {
      if (action === 'start') {
        expressChild = spawn('nodemon', [
          '-L', '--watch', 'app', '--debug', '../express/procKr.js'
        ]);
        console.log('web started!');
      }
    });
  });
})();

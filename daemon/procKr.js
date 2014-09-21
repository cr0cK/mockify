/**
 * This file is the procKr websocket interface, started as a daemon.
 */

'use strict';

module.exports = (function () {
  var io    = require('./ws/io'),
      web   = require('./action/web'),
      db    = require('./lib/db');

  /**
   * Create the database if it not exists.
   */
  db.create();

  io.on('connection', function (socket) {
    socket.on('hello', function () {
      socket.emit('hello', 'Hi! This is procKr daemon.');
    });

    socket.on('startWeb', function () {
      web.start().then(function (msgLog) {
        socket.emit('startWeb', msgLog);
      });
    });

    socket.on('stopWeb', function () {
      web.stop().then(function (msgLog) {
        socket.emit('stopWeb', msgLog);
      });
    });
  });
})();

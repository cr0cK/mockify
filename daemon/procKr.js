/**
 * This file is the procKr websocket interface, started as a daemon.
 */

'use strict';

module.exports = (function () {
  var io    = require('./ws/io'),
      http  = require('./action/http'),
      db    = require('./lib/db');

  // create the database if it not exists.
  db.create();

  // start the http server
  http.start().then(function (msgLog) {
    console.log(msgLog);
  });

  io.on('connection', function (socket) {
    socket.on('hello', function () {
      socket.emit('hello', 'Hi! This is procKr daemon.');
    });

    socket.on('startHttp', function () {
      http.start().then(function (msgLog) {
        socket.emit('startHttp', msgLog);
      });
    });

    socket.on('stopHttp', function () {
      http.stop().then(function (msgLog) {
        socket.emit('stopHttp', msgLog);
      });
    });

    socket.on('addProxy', function (proxy) {
      console.log('add proxy', proxy);
    });
  });
})();

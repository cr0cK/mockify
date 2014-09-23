/**
 * This file is the procKr websocket interface, started as a daemon.
 */

'use strict';

module.exports = (function () {
  var io              = require('./ws/io'),
      http            = require('./ws/http'),
      db              = require('./lib/db'),
      daemonRootDir   = __dirname;

  // create the database if it not exists.
  db.create();

  // start the http server
  http.start().then(function (msgLog) {
    console.log(msgLog);
  });

  io.sockets.on('connection', function (socket) {
    var target  = new (require('./ws/target'))(socket, daemonRootDir);

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

    socket.on('listTargets', target.list);
    socket.on('addTarget', target.add);
    socket.on('removeTarget', target.remove);
    socket.on('enableTarget', target.enable);
  });
})();

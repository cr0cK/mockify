/**
 * This file is the procKr websocket interface, started as a daemon.
 */

'use strict';

module.exports = (function () {
  var io              = require('./ws/io'),
      http            = require('./ws/http'),
      db              = require('./lib/db'),
      daemonRootDir   = __dirname,
      target          = require('./ws/target')(daemonRootDir),
      alert           = require('./ws/alert')();

  // create the database if it not exists.
  db.create();

  // start the http server
  http.start().then(function (msgLog) {
    console.log(msgLog);
  }, alert.error);

  io.sockets.on('connection', function (socket) {
    socket.on('hello', function () {
      io.emit('hello', 'Hi! This is procKr daemon.');
    });

    socket.on('startHttp', function () {
      http.start().then(function (msgLog) {
        io.emit('startHttp', msgLog);
      }, alert.error);
    });

    socket.on('stopHttp', function () {
      http.stop().then(function (msgLog) {
        io.emit('stopHttp', msgLog);
      }, alert.error);
    });

    socket.on('listTargets', function () {
      target.list().then(function (targets) {
        io.emit('listTargets', {
          message: 'List of saved targets:',
          targets: targets
        });
      }, alert.error);
    });

    socket.on('addTarget', function (targetProperties) {
      target.add(targetProperties).then(function (targets) {
        io.emit('listTargets', {
          message: 'The target has been added.',
          targets: targets
        });
      }, alert.error);
    });

    socket.on('removeTarget', function (targetProperties) {
      target.disable(targetProperties)
        .then(function () {
          return target.remove(targetProperties);
        }, alert.error)
        .then(function (msgLog) {
          io.emit('removeTarget', msgLog);
        }, alert.error);
    });

    socket.on('enableTarget', function (targetProperties) {
      // enable a target starts a proxy but return it own websocket event
      target.startProxy(targetProperties).then(function (childStdout) {
        io.emit('enableTarget', childStdout);
      }, alert.error);
    });

    socket.on('disableTarget', function (targetProperties) {
      target.disable(targetProperties).then(function (msgLog) {
        io.emit('disableTarget', msgLog);
      }, alert.error);
    });

    socket.on('recordingTarget', function (data) {
      target.recording(data)
        .then(function (msgLog) {
          io.emit('recordingTarget', msgLog);
        }, alert.error);
    });

    socket.on('startProxy', function (targetProperties) {
      target.startProxy(targetProperties).then(function (childStdout) {
        io.emit('startProxy', childStdout);
      }, alert.error);
    });

    socket.on('startMock', function (targetProperties) {
      target.startMock(targetProperties).then(function (childStdout) {
        io.emit('startMock', childStdout);
      }, alert.error);
    });
  });
})();

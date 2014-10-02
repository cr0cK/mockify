'use strict';

module.exports = function (socket) {
  var Q     = require('q'),
      _     = require('lodash');

  /**
   * List the targets.
   */
  var list = function () {
    var deferred = Q.defer();

    socket.emit('listTargets');
    socket
      .on('listTargets', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  /**
   * Add a target.
   * @param {int}     port
   * @param {string}  url
   */
  var add = function (port, url) {
    var deferred = Q.defer();

    socket.emit('addTarget', {port: port, url: url});
    socket
      // listen a listTargets event to displayed current targets
      .on('listTargets', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  /**
   * Remove a target.
   * @param {int}     id
   */
  var remove = function (id) {
    var deferred = Q.defer();

    socket.emit('removeTarget', {id: id});
    socket
      .on('removeTarget', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  /**
   * Disable a target.
   * @param {int}     id
   */
  var disable = function (id) {
    var deferred = Q.defer();

    socket.emit('disableTarget', {id: id});
    socket
      .on('disableTarget', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  /**
   * Enable/disable the recording of data passing through a proxy.
   * @param {int}     id
   */
  var recording = function (id, bool) {
    var deferred = Q.defer();

    socket.emit('recordingTarget', {
      targetProperties: {id: id},
      status: bool
    });
    socket
      .on('recordingTarget', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  /**
   * Start the proxy of a target.
   * @param {int}     id
   */
  var startProxy = function (id) {
    var deferred = Q.defer();

    socket.emit('startProxy', {id: id});
    socket
      .on('startProxy', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  /**
   * Start the mock of a target.
   * @param {int}     id
   */
  var startMock = function (id) {
    var deferred = Q.defer();

    socket.emit('startMock', {id: id});
    socket
      .on('startMock', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  /**
   * Return an eventEmitter and emit event each time a log is coming from the
   * process childs.
   * Used to display logs in the cli.
   */
  var log = function () {
    var eventEmitter_ = new (require('events').EventEmitter)();

    _.forEach(['proxy', 'mock'], function (eventSource) {
      socket
        .on(eventSource + 'Out', function (logData) {
          eventEmitter_.emit('out', logData);
        })
        .on(eventSource + 'Response', function (logData) {
          eventEmitter_.emit('response', logData);
        })
        .on(eventSource + 'Error', function (logData) {
          // the 'error' event throws an error (?)
          eventEmitter_.emit('error_', logData);
        });
    });

    return eventEmitter_;
  };

  return {
    list: list,
    add: add,
    remove: remove,
    disable: disable,
    recording: recording,
    startProxy: startProxy,
    startMock: startMock,
    log: log
  };
};

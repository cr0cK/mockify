'use strict';

module.exports = function (socket) {
  var Q     = require('q');

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
   * Start a proxy for a target.
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

  return {
    list: list,
    add: add,
    remove: remove,
    disable: disable,
    recording: recording,
    startProxy: startProxy
  };
};

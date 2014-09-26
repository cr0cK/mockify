'use strict';

module.exports = function (socket) {
  var Q     = require('q');

  /**
   * Emit a ws and listen the response/error to resolve/reject a promise.
   * Return a promise.
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
   * Enable the target.
   * @param {int}     id
   */
  var enable = function (id) {
    var deferred = Q.defer();

    socket.emit('enableTarget', {id: id});
    socket
      .on('enableTarget', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  /**
   * Disable the target.
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
   * Enable/disable the recording of data passing through the proxy.
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

  return {
    list: list,
    add: add,
    remove: remove,
    enable: enable,
    disable: disable,
    recording: recording
  };
};

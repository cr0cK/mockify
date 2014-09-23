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
      // listen a listTargets event to displayed current targets
      .on('listTargets', deferred.resolve)
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

  return {
    list: list,
    add: add,
    remove: remove,
    enable: enable
  };
};

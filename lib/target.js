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

    socket.on('listTargets', function (targets) {
      deferred.resolve(targets);
    });

    socket.on('alert', function (alert) {
      deferred.reject(alert);
    });

    return deferred.promise;
  };

  return {
    list: list
  };
};

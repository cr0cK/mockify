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
      .on('alert', deferred.reject);

    return deferred.promise;
  };

  return {
    list: list
  };
};

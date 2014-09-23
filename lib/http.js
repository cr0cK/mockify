'use strict';

module.exports = function (socket) {
  var Q     = require('q');

  /**
   * Start the web app.
   */
  var start = function () {
    var deferred = Q.defer();

    socket.emit('startHttp');
    socket
      .on('startHttp', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  /**
   * Stop the web app.
   */
  var stop = function () {
    var deferred = Q.defer();

    socket.emit('stopHttp');
    socket
      .on('stopHttp', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  return {
    start: start,
    stop: stop
  };
};

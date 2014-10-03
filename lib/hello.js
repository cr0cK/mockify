'use strict';

module.exports = function (socket) {
  var Q     = require('q');

  /**
   * Say hello to the mockify websocket server.
   */
  var say = function () {
    var deferred = Q.defer(),
        attempts = 0;

    setInterval(function () {
      process.stdout.write('.');
      attempts++;

      if (attempts > 5) {
        deferred.reject('Can\'t connect to mockify :(');
      }
    }, 1000);

    socket.emit('hello');
    socket
      .on('hello', deferred.resolve)
      .on('alertError', deferred.reject);

    return deferred.promise;
  };

  return {
    say: say
  };
};

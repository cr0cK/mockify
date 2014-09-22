'use strict';

module.exports = function (socket) {
  var Q     = require('q');

  /**
   * Say hello to the procKr websocket server.
   */
  var say = function () {
    var deferred = Q.defer(),
        attempts = 0;

    setInterval(function () {
      process.stdout.write('.');
      attempts++;

      if (attempts > 5) {
        deferred.reject('Can\'t connect to procKr :(');
      }
    }, 1000);

    socket.emit('hello');
    socket
      .on('hello', deferred.resolve)
      .on('alert', deferred.reject);

    return deferred.promise;
  };

  return {
    say: say
  };
};

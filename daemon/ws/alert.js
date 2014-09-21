'use strict';

module.exports = (function () {
  var io              = require('./io').connected;

  /**
   * Emit an error.
   */
  var error = function (message) {
    io().then(function (socket) {
      console.log('emit alert', message);
      socket.emit('alert', {message: message});
    });
  };

  return {
    error: error
  };
})();

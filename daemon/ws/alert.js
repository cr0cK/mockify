'use strict';

module.exports = function (socket) {
  /**
   * Emit an error.
   */
  var error = function (message) {
    message = message || 'An unknown error has occurred :(';
    socket.emit('alert', {message: message});
  };

  return {
    error: error
  };
};

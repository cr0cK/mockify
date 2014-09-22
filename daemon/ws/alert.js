'use strict';

module.exports = function (socket) {
  /**
   * Emit an error.
   */
  var error = function (message) {
    socket.emit('alert', {message: message});
  };

  return {
    error: error
  };
};

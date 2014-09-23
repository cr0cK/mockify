'use strict';

module.exports = function (socket) {

  /**
   * Emit an info.
   */
  var info = function (message) {
    socket.emit('alertInfo', {message: message});
  };

  /**
   * Emit an error.
   */
  var error = function (message) {
    message = message || 'An unknown error has occurred :(';
    socket.emit('alertError', {message: message});
  };

  return {
    info: info,
    error: error
  };
};

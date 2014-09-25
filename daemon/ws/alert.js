'use strict';

module.exports = function () {
  var io              = require('./io');

  /**
   * Emit an info.
   */
  var info = function (message) {
    io.emit('alertInfo', {message: message});
  };

  /**
   * Emit an error.
   */
  var error = function (message) {
    var util = require('util');
    util.debug(message);

    message = message || 'An unknown error has occurred :(';
    io.emit('alertError', {message: message});
  };

  return {
    info: info,
    error: error
  };
};

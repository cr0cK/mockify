/**
 * Handler to log on stdout.
 */

'use strict';

module.exports = function () {
  var _s        = require('underscore.string'),
      clog      = function () { console.log.apply(this, arguments); },
      exit      = function () { process.exit(1); };

  /**
   * Print message.
   */
  var log = function (message) {
    clog(_s.trim(message));
  };

  /**
   * Print message with a new line.
   */
  var logn = function (message) {
    clog(_s.trim(message) + '\n');
  };

  /**
   * Print error.
   */
  var error = function (message) {
    clog(_s.trim(message) + '\n');
  };

  /**
   * Print error with a new line.
   */
  var errorn = function (message) {
    clog(_s.trim(message) + '\n');
  };

  /**
   * Print message and exit the process.
   */
  var logExit = function (message) {
    log(message);
    exit();
  };

  return {
    log: log,
    logn: logn,
    error: error,
    errorn: errorn,
    logExit: logExit
  };
};

/**
 * Handler to log on stdout.
 */

'use strict';

module.exports = function () {
  var _s        = require('underscore.string'),
      cliColor  = require('cli-color'),
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
  var lognExit = function (message) {
    logn(message);
    exit();
  };

  /**
   * Display logs from childs stdout / stderr.
   * @param  {Object} msgData
   */
  var childLog = function (msgData) {
    var color;

    if (msgData.type === 'error') {
      color = cliColor.red;
    } else {
      switch (msgData.source) {
        case 'proxy':
          color = cliColor.green;
          break;
        case 'mock':
          color = cliColor.yellow;
          break;
        default:
          color = cliColor.white;
          break;
      }
    }

    return clog(color(msgData.message.trim()));
  };

  return {
    log: log,
    logn: logn,
    error: error,
    errorn: errorn,
    lognExit: lognExit,
    childLog: childLog
  };
};

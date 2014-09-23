/**
 * Handler to display alerts.
 */

'use strict';

module.exports = function () {
  var _         = require('lodash'),
      logHdlr   = require('./log')(),
      exit      = function () { process.exit(1); };

  /**
   * Display the alert on stdout and exit the process.
   */
  var error = function (obj) {
    var str = _.has(obj, 'message') ?
      obj.message : 'An unknown error has occurred.';

    logHdlr.errorn(str);
    exit();
  };

  return {
    error: error
  };
};

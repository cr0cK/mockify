/**
 * Handler to display errors.
 */

'use strict';

module.exports = function () {
  var _         = require('lodash'),
      log       = function () { console.log.apply(this, arguments); },
      exit      = function () { process.exit(1); };

  /**
   * Display the alert on stdout and exit the process.
   */
  var error = function (obj) {
    var str = _.has(obj, 'message') ?
      obj.message : 'An unknown error has occurred.';

    log(str);
    exit();
  };

  return {
    error: error
  };
};

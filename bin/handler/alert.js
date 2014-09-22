/**
 * Handler to display errors.
 */

'use strict';

module.exports = function () {
  var _         = require('lodash'),
      log       = function () { console.log.apply(this, arguments); },
      exit      = function () { process.exit(1); };

  /**
   * List targets saved in database and display them in a ASCII table.
   * @param  {Array}  targets   Target entities.
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

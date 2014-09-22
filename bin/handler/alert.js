/**
 * Handler to display errors.
 */

'use strict';

module.exports = function () {
  var log       = function () { console.log.apply(this, arguments); },
      exit      = function () { process.exit(1); };

  /**
   * List targets saved in database and display them in a ASCII table.
   * @param  {Array}  targets   Target entities.
   */
  var error = function (message) {
    log(message || 'An unknown error has occurred :(');
    exit();
  };

  return {
    error: error
  };
};

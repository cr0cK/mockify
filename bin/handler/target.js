/**
 * Handler for targets for the procKr cli.
 */

'use strict';

module.exports = function () {
  var CliTable  = require('cli-table'),
      _         = require('./../../daemon/lib/helper')._,
      log       = function () { console.log.apply(this, arguments); },
      exit      = function () { process.exit(1); };

  /**
   * List targets saved in database and display them in a ASCII table.
   * @param  {Array}  targets   Target entities.
   */
  var list = function (targets) {
    if (_.isArray(targets) && targets.length) {
      var heads = _.keys(_.publicProperties(targets[0]));

      var table = new CliTable({
        head: heads,
        style: {
          head: ['cyan']
        }
      });

      _.forEach(targets, function (target) {
        table.push(_.values(target));
      });

      log(table.toString());
    } else {
      log('No target found.');
    }

    exit();
  };

  return {
    list: list
  };
};

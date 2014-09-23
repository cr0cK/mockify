/**
 * Handler for targets for the procKr cli.
 */

'use strict';

module.exports = function () {
  var CliTable  = require('cli-table'),
      _         = require('./../../daemon/lib/helper')._,
      cliColor  = require('cli-color'),
      logHldr   = require('./log')(),
      exit      = function () { process.exit(1); };

  /**
   * List targets saved in database and display them in a ASCII table.
   * @param  {Object}  response   Struct with the message and targets
   */
  var list = function (response) {
    if (_.isArray(response.targets) && response.targets.length) {
      logHldr.logn(cliColor.bold(response.message));

      var heads = _.keys(_.publicProperties(response.targets[0]));

      var table = new CliTable({
        head: heads,
        style: {
          head: ['cyan']
        }
      });

      _.forEach(response.targets, function (target) {
        table.push(_.values(target));
      });

      logHldr.log(table.toString());
    } else {
      logHldr.logn('No target found.');
    }

    exit();
  };

  return {
    list: list
  };
};

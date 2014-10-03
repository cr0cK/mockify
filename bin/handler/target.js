/**
 * Handler for targets for the mockify cli.
 */

'use strict';

module.exports = function () {
  var CliTable  = require('cli-table'),
      _         = require('./../../daemon/lib/helper')._,
      _s        = require('underscore.string'),
      cliColor  = require('cli-color'),
      logHldr   = require('./log')(),
      Target    = require('./../../daemon/entity/target'),
      exit      = function () { process.exit(1); };

  /**
   * List targets and display them in a ASCII table.
   * @param  {Object}  response   Struct with the message and targets
   */
  var list = function (response) {
    if (_.isArray(response.targets) && response.targets.length) {
      // get Target objects
      response.targets = _.map(response.targets, function (properties) {
        return new Target(properties);
      });

      // humanize heads of columns
      var heads = _.map(response.targets[0].orderedKeys(), function (k) {
        return _s.humanize(k.substr(1));
      });

      var table = new CliTable({
        head: heads,
        style: {
          head: ['cyan']
        }
      });

      // retrieve values of Target objects
      _.forEach(response.targets, function (target) {
        var values = _.map(target.orderedKeys(), function (k) {
          if (target[k] === undefined || target[k] === null) {
            target[k] = 'undefined (?)';
          }

          return target[k];
        });
        table.push(values);
      });

      // output
      logHldr.logn(cliColor.bold(response.message));
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

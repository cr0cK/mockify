'use strict';

module.exports = function (socket) {
  var Target          = require('./../entity/target'),
      targetStorage   = require('./../storage/target'),
      alert           = require('./alert')(socket);

  /**
   * Emit a ws with the list of targets.
   */
  var list = function (message) {
    targetStorage.list(function (err, targets) {
      err && alert.error(err) || socket.emit('listTargets', {
        message: (message || 'List of saved targets:'),
        targets: targets
      });
    });
  };

  /**
   * Add a target and emit a ws with the list of targets.
   */
  var add = function (targetProperties) {
    targetStorage.create(new Target(targetProperties), function (err) {
      err && alert.error(err) || list('The target has been added.');
    });
  };

  /**
   * Remove a target and emit a ws with the list of targets.
   */
  var remove = function (targetProperties) {
    targetStorage.remove(new Target(targetProperties), function (err, target) {
      var message;

      if (!err && target === undefined) {
        message = 'The target has not been found, no target has been removed.';
      }

      err && alert.error(err) ||
        list(message || 'The target has been removed.');
    });
  };

  return {
    list: list,
    add: add,
    remove: remove
  };
};

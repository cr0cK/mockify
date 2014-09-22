'use strict';

module.exports = function (socket) {
  var Target          = require('./../entity/target'),
      targetStorage   = require('./../storage/target'),
      alert           = require('./alert')(socket);

  /**
   * Add a target and emit a ws with the list of targets.
   */
  var add = function (targetData) {
    var target = new Target(targetData);

    targetStorage.create(target, function (err) {
      err && alert.error(err);
    });
  };

  /**
   * Emit a ws with the list of targets.
   */
  var list = function () {
    targetStorage.list(function (err, targets) {
      err && alert.error(err);
      socket.emit('listTargets', targets);
    });
  };

  return {
    add: add,
    list: list
  };
};

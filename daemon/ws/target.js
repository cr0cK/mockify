'use strict';

module.exports = function (socket) {
  var Target          = require('./../entity/target'),
      targetStorage   = require('./../storage/target'),
      alert           = require('./alert')(socket);

  /**
   * Emit a ws with the list of targets.
   */
  var list = function () {
    targetStorage.list(function (err, targets) {
      err && alert.error(err) || socket.emit('listTargets', targets);
    });
  };

  /**
   * Add a target and emit a ws with the list of targets.
   */
  var add = function (targetProperties) {
    targetStorage.create(new Target(targetProperties), function (err) {
      err && alert.error(err) || list();
    });
  };

  return {
    list: list,
    add: add
  };
};

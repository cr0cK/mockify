'use strict';

module.exports = (function () {
  var db      = require('./../lib/db'),
      _       = require('./../lib/helper')._,
      Target  = require('./../entity/target');

  /**
   * Create a target in database.
   */
  var create = function (target, callback) {
    db.model('Target').create([_.publicProperties(target)], callback);
  };

  /**
   * List targets.
   */
  var list = function (callback) {
    db.model('Target').find({}, function (err, targets) {
      callback(err, _.map(targets, function (properties) {
        return new Target(properties);
      }));
    });
  };

  return {
    create: create,
    list: list
  };
})();

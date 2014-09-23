'use strict';

module.exports = (function () {
  var db      = require('./../lib/db'),
      _       = require('./../lib/helper')._,
      Target  = require('./../entity/target');

  /**
   * Retrieve a target.
   * @param  {object}   properties
   * @param  {Function} callback
   */
  var get = function (id, callback) {
    db.model('Target').get(id, function (err, row) {
      callback(err, new Target(row));
    });
  }

  /**
   * List targets.
   * @param  {Function} callback
   */
  var list = function (callback) {
    db.model('Target').find({}, function (err, targets) {
      callback(err, _.map(targets, function (properties) {
        return new Target(properties);
      }));
    });
  };

  /**
   * Create a target in database.
   * @param  {Target}   target
   * @param  {Function} callback
   */
  var create = function (target, callback) {
    db.model('Target').create([_.publicProperties(target)], callback);
  };

  /**
   * Remove a target in database.
   * @param  {Target}   target
   * @param  {Function} callback
   */
  var remove = function (target, callback) {
    db.model('Target').find({id: target.id()}).remove(callback);
  };

  return {
    get: get,
    list: list,
    create: create,
    remove: remove
  };
})();

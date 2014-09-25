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
  };

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
    db.model('Target').create(
      [_.publicProperties(target, ['_port', '_url'])],
      callback
    );
  };

  /**
   * Remove a target in database.
   * @param  {Target}   target
   * @param  {Function} callback
   */
  var remove = function (target, callback) {
    db.model('Target').find({id: target.id()}).remove(callback);
  };

  /**
   * Update a target in database.
   * @param  {Target}   target
   * @param  {Object}   properties
   * @param  {Function} callback
   */
  var update = function (target, properties, callback) {
    db.model('Target').get(target.id(), function (err, proxy) {
      if (proxy) {
        _.privateMerge(proxy, properties);

        proxy.save(function (err, row) {
          callback(err, !err && new Target(row));
        });
      }
    });
  };

  return {
    get: get,
    list: list,
    create: create,
    remove: remove,
    update: update
  };
})();

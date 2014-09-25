/* global _ */

(function () {
  'use strict';

  _.str.include('Underscore.string', 'string');

  /**
   * Merge properties as private attributes in obj.
   * ie: {id: 42} => obj._id = 42
   */
  function privateMerge(objet_, properties) {
    _.forEach(properties, function (value, key) {
      if (key.substr(0, 1) !== '_') {
        key = '_' + key;
      }
      objet_[key] = value;
    });
    return objet_;
  }

  /**
   * Return an object with the public/private attributes of obj.
   * The lodash character of private properties is removed.
   */
  function publicProperties(obj, keys) {
    var properties = {};
    _.forIn(obj, function (value, key) {
      if (!_.isFunction(obj[key]) &&
        (!_.isArray(keys) || _.isArray(keys) && _.contains(keys, key))) {
        key = key.replace(/^_/, '');
        properties[key] = value;
      }
    });
    return properties;
  }

  _.mixin({
    privateMerge: privateMerge,
    publicProperties: publicProperties
  });
})();

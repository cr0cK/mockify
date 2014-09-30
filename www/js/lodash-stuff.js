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

  /**
   * Format a deep comparison between two arrays of objects,
   * omitted of their Angular extra keys.
   * @param  {Array}
   * @param  {Array}
   * @return {Boolean}
   */
  function isAlmostEqual(array1, array2) {
    var arrays_ = [];

    _.forEach([array1, array2], function (array) {
      arrays_.push(_.map(array, function (obj) {
        return _.omit(obj, function (value, key) {
          return /^\$+/.test(key);
        });
      }));
    });

    return _.isEqual(arrays_[0], arrays_[1]);
  }

  _.mixin({
    privateMerge: privateMerge,
    publicProperties: publicProperties,
    isAlmostEqual: isAlmostEqual
  });
})();

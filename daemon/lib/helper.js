module.exports = (function () {
  'use strict';

  /**
   * Return lodash extended with custom methods.
   */
  var lodashExtended = function () {
    var _ = require('lodash');

    /**
     * Return an UUID
     */
    function uuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    }

    /**
     * Merge properties as private attributes in obj.
     * ie: {id: 42} => obj._id = 42
     */
    function privateMerge(obj, properties) {
      _.forEach(properties, function (value, key) {
        if (key.substr(0, 1) !== '_') {
          key = '_' + key;
        }
        obj[key] = value;
      });
      return obj;
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
      uuid: uuid,
      privateMerge: privateMerge,
      publicProperties: publicProperties
    });

    return _;
  };

  return {
    _: lodashExtended()
  };
})();

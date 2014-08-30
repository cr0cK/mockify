/* global _ */

(function () {
  'use strict';

  _.str.include('Underscore.string', 'string');

  /**
   * Merge properties as private attributes in objet_.
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

  function publicProperties(obj) {
    var properties = {};
    _.forIn(obj, function (value, key) {
      if (!_.isFunction(obj[key])) {
        key = key.replace(/^_/, '');
        properties[key] = value;
      }
    });
    return properties;
  }

  _.mixin({
    'privateMerge': privateMerge,
    'publicProperties': publicProperties
  });
})();

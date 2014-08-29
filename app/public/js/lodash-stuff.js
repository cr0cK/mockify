/* global _ */

'use strict';

(function () {
  _.str.include('Underscore.string', 'string');

  /**
   * Merge properties as private attributes in objet_.
   */
  function privateMerge(objet_, properties) {
    _.forEach(properties, function (v, k) {
      objet_['_' + k] = v;
    });
    return objet_;
  }

  _.mixin({
    'privateMerge': privateMerge
  });
})();

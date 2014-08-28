(function () {
  'use strict';

  angular.module('mocKr.entity.proxy', [
  ])

  /**
   * Return an object ready to be instanciated to describe a Proxy entity.
   */
  .factory('proxyFactory', [function () {
    var Proxy = function (properties) {
      _.merge(this, properties);
    };

    return Proxy;
  }]);
})();

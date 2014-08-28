'use strict';

var Proxy_ = (function () {
  var _ = require('lodash');

  var Proxy = function (properties) {
    _.merge(this, properties);
  };

  return Proxy;
})();

module.exports = Proxy_;

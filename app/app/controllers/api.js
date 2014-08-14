'use strict';

var exp = (function () {
  var wsProxy = require('./../ws/proxy'),
      _       = require('lodash');

  var index = (function () {
    return function (req, res) {
      res.json({ message: 'Welcome to the mocKr api!' });
    };
  })();

  var proxy = (function () {
    return {
      /**
       * Return the list of proxy childs.
       */
      list: function (req, res) {
        res.json(_.map(wsProxy.childStore(), function (childStorage) {
          return {
            target: childStorage.target(),
            port: childStorage.port()
          };
        }));
      }
    };
  })();

  return {
    index: index,
    proxy: proxy
  };
})();

exports.index = exp.index;
exports.proxy = exp.proxy;

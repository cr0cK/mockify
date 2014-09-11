module.exports = (function () {
  'use strict';

  var exp = (function () {
    var index = (function () {
      return function (req, res) {
        res.json({ message: 'Welcome to the procKr api!' });
      };
    })();

    var proxy = (function () {
      return {
        /**
         * Return the list of proxy childs.
         */
        list: function (req, res) {
          res.json({ message: 'Welcome to the procKr api!' });
        }
      };
    })();

    return {
      index: index,
      proxy: proxy
    };
  })();

  return {
    index: exp.index,
    proxy: exp.proxy
  };
})();

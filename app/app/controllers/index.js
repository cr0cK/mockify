'use strict';

exports.index = (function () {
  return function (req, res) {
    res.render('index', {
      title: 'mockr'
    });
  };
})();

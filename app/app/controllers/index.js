var index = (function () {
  'use strict';

  /**
   * do something with the user model
   * var User = require('../models/user');
   */


  return function (req, res) {
    res.render('index', {
      title: 'mockr'
    });
  };


})();

exports.index = index;

module.exports = (function () {
  'use strict';

  var indexRouter = require('express').Router();

  function index(req, res) {
    res.render('index', { title: 'procKr' });
  }

  indexRouter.route('/').get(index);

  return indexRouter;
})();

'use strict';

var indexRouter = require('express').Router();

function index(req, res) {
  res.render('index', { title: 'procKr' });
}

// register controllers
indexRouter.route('/').get(index);

// exports router
module.exports = indexRouter;

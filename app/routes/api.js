'use strict';

var apiRouter = require('express').Router();

function notImplementedYet(res) {
  res.json({ message: 'Not implemented yet' });
}

function index(req, res) {
  res.json({
    message: 'Welcome to the procKr api!\nAPI is reachable.'
  });
}

function listProxies(req, res) {
  notImplementedYet(res);
}
function getProxy(req, res) {
  notImplementedYet(res);
}
function createProxy(req, res) {
  notImplementedYet(res);
}
function updateProxy(req, res) {
  notImplementedYet(res);
}
function removeProxy(req, res) {
  notImplementedYet(res);
}

apiRouter.route('/').get(index);
apiRouter.route('/proxies')
  .get(listProxies)
  .post(createProxy);
apiRouter.route('/proxies/:id')
  .get(getProxy)
  .put(updateProxy)
  .delete(removeProxy);

module.exports = apiRouter;

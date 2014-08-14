var express = require('express'),
    controllers = require('../controllers/api');

var apiRouter = express.Router();

apiRouter.route('/').all(controllers.index);
apiRouter.get('/proxy/list', controllers.proxy.list);

exports.apiRouter = apiRouter;

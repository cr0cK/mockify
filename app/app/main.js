/* global require, __dirname */

'use strict';

module.exports = (function () {
  var express        = require('express'),
      path           = require('path'),
      swig           = require('swig'),
      logger         = require('morgan'),
      compress       = require('compression'),
      favicon        = require('static-favicon'),
      methodOverride = require('method-override'),
      errorHandler   = require('errorhandler'),
      db             = require('./lib/db'),
      config         = require('./config'),
      indexRoutes    = require('./routes/index'),
      apiRoutes      = require('./routes/api');

  /**
   * Create Dabase if it not exists
   */
  db.create();

  /**
   * Express configuration.
   */
  var rootPath = process.env.PWD;
  var app = express();
  var isDevelopment = app.get('env') === 'development';

  app.set('port', config.server.port);
  app.engine('html', swig.renderFile);
  app.set('views', path.join(rootPath, 'app', 'views'));
  app.set('view engine', 'html');

  app
    .use(compress())
    .use(favicon())
    .use(methodOverride())
    .use(express.static(path.join(rootPath, 'build')))
    .use(indexRoutes.indexRouter)
    .use('/api', apiRoutes.apiRouter)
    .use(function (req, res) {
      res.status(404).render('404', {title: 'Not Found :('});
    })
    .use(function (err, res) {
      console.error(err.stack);
      res.send(500, 'Something is broken!');
    });

  if (isDevelopment) {
    app.use(logger('dev'));
    app.use(errorHandler());
    swig.setDefaults({cache: false});
  }

  /**
   * Public interface.
   */
  return {
    run: function () {
      app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
      });
    }
  };
})();

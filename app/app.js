/* global require, process, __dirname */

/**
 * Module dependencies.
 */

'use strict';

(function() {
  // don't check SSL
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  var express        = require('express'),
      path           = require('path'),
      // mongoose       = require('mongoose'),
      swig           = require('swig'),
      logger         = require('morgan'),
      bodyParser     = require('body-parser'),
      compress       = require('compression'),
      favicon        = require('static-favicon'),
      methodOverride = require('method-override'),
      errorHandler   = require('errorhandler'),
      config         = require('./config'),
      routes         = require('./routes'),

      proxy          = require('./app/middleware/proxy.js');
      // proxy          = require('simple-http-proxy');


      // _              = require('lodash'),


  var app = express();
  var isDevelopment = app.get('env') === 'development';


  /**&
   * Express configuration.
   */
  app.set('port', config.server.port);
  app.engine('html', swig.renderFile);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'html');

  app
    .use(compress())
    .use(favicon())
    .use('/proxy', proxy())
    .use(bodyParser())
    .use(methodOverride())
    .use(express.static(path.join(__dirname, 'build')))
    .use(routes.indexRouter)
    .use(function (req, res) {
      res.status(404).render('404', {title: 'Not Found :('});
    })
    .use(function (err, res) {
      console.error(err.stack);
      res.send(500, 'Something broke!');
    });

  if (isDevelopment) {
    app.use(logger('dev'));
    app.use(errorHandler());
    swig.setDefaults({ cache: false });
  }

  app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });




  var app2 = express();
  var server = require('http').Server(app2);
  var io = require('socket.io')(server);

  server.listen(3334);

  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('action', function (data) {
      console.log('receive', data);
    });
  });




  // var app2 = express();

  // app2.get('/', function(req, res){
  //   res.send('hello world');
  // });

  // app2.listen(2222, function () {
  //   console.log('Express server listening on port ' + 2222);
  // });


})();

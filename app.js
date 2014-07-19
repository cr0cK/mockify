/**
 * Module dependencies.
 */

var express        = require('express'),
    path           = require('path'),
    mongoose       = require('mongoose'),
    swig           = require('swig'),
    logger         = require('morgan'),
    bodyParser     = require('body-parser'),
    compress       = require('compression'),
    favicon        = require('static-favicon'),
    methodOverride = require('method-override'),
    errorHandler   = require('errorhandler'),
    config         = require('./config'),
    routes         = require('./routes');


mongoose.connect(config.database.url);
mongoose.connection.on('error', function () {
  console.log('mongodb connection error');
});

var app = express();
var isDevelopment = app.get('env') === 'development';

/**
 * Express configuration.
 */
app.set('port', config.server.port);
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app
  .use(compress())
  .use(favicon())
  .use(bodyParser())
  .use(methodOverride())
  .use(express.static(path.join(__dirname, 'build')))
  .use(routes.indexRouter)
  .use(function (req, res) {
    res.status(404).render('404', {title: 'Not Found :('});
  });

if (isDevelopment) {
  app.use(logger('dev'));
  app.use(errorHandler());
  swig.setDefaults({ cache: false });
}

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

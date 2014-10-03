/**
 * This is the mock binary which allows to 'start' fake APIs by serving the
 * data in the mockify database.
 */

'use strict';

var argv        = require('minimist')(process.argv.slice(2)),
    _           = require('lodash'),
    _s          = require('underscore.string'),
    express     = require('express'),
    bodyParser  = require('body-parser'),
    router      = express.Router(),
    db          = require('../lib/db'),
    targetId    = argv.targetId;

/**
 * Write log on stdout/stderr.
 */
var log = function (message) {
  process.stdout.write('[mock-out] ' + message + '\n');
};

var logError = function (message) {
  process.stderr.write('[mock-error] ' + message + '\n');
};

var logResponse = function (message) {
  process.stdout.write('[mock-response] ' + message + '\n');
};

/**
 * Express app with an in-memory database which will be used to mock data.
 */
var runApp = function (target, db) {
  var mockData = (function () {
    return function (req, res) {
      // search a response for the current query
      db.model('Response').find({
        method: req.method,
        url: req.url,
        parameters: JSON.stringify(req.body),
        targetId: target.id
      }, function (err, responses) {
        if (err) {
          log('An error has occurred when fetching data. ' + err);
          res.status(500).send(err);
        } else {
          var response = _.first(responses);

          if (!response) {
            res.status(404).send('No response has been found.');

            logResponse(_s.sprintf('%s %s %s on localhost:%s',
              '404', req.method, req.url, target.port));
          } else {
            logResponse(_s.sprintf('%s %s %s on localhost:%s',
              response.status, response.method, response.url, target.port));

            // set headers
            _.forEach(response.resHeaders, function (value, key) {
              res.setHeader(key, value);
            });

            res.setHeader('X-mockify-rowuuid', response.uuid);

            res
              .status(response.status || 500)
              .send(response.body || 'empty body');
          }
        }
      });
    };
  })();

  router.route('/*').all(mockData);

  var app = express();

  app
    .set('port', target.port)
    // to support JSON-encoded bodies()
    .use(bodyParser.json())
    // to support URL-encoded bodies
    .use(bodyParser.urlencoded({
      extended: true
    }))
    .use(router)
    .listen(app.get('port'), function () {
      var message = _s.sprintf('%s %d %s %s',
        'Mock listening on port',
        app.get('port'),
        'and mocking the target ID:',
        targetId
      );

      log(message);
    });
};

// search Target in DB
db.whenReady().then(function () {
  if (!targetId) {
    log('The target has not been set.');
  }

  db.model('Target').get(targetId, function (err, target_) {
    if (err) {
      logError('An error has occurred when fetching data. ' +  err);
      process.exit(1);
    }

    // dump the database in memory, used for this process
    db.toMemory(function (err, db_) {
      if (err) {
        logError('err ' + err);
        process.exit(1);
      }

      // run the Express app with the target row and the in-memory database
      runApp(target_, db_);
    });
  });
});

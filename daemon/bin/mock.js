(function () {
  'use strict';

  var argv        = require('minimist')(process.argv.slice(2)),
      _           = require('lodash'),
      _s          = require('underscore.string'),
      express     = require('express'),
      bodyParser  = require('body-parser'),
      router      = express.Router(),
      db          = require('../app/lib/db'),
      proxyId     = argv.proxyId;

  /**
   * Write log on stdout.
   */
  var log = function (message) {
    console.log(message);
  };

  /**
   * Express app with an in-memory database which will be used to mock data.
   */
  var runApp = function (Proxy, db) {
    var mockData = (function () {
      return function (req, res) {
        // search a response for the current query
        db.model('Response').find({
          method: req.method,
          url: req.url,
          parameters: JSON.stringify(req.body),
          proxyId: Proxy.id
        }, function (err, responses) {
          if (err) {
            log('An error has occurred when fetching data.', err);
            res.status(500).send(err);
          } else {
            var response = _.first(responses);

            if (!response) {
              res.status(404).send('No response has been found.');

              log(_s.sprintf('[mockLog]%d %s %s on localhost:%s',
                404, req.method, req.url, Proxy.port));
            } else {
              log(_s.sprintf('[mockLog]%d %s %s on localhost:%s',
                response.status, response.method, response.url, Proxy.port));

              // set headers
              _.forEach(response.resHeaders, function (value, key) {
                res.setHeader(key, value);
              });

              res.setHeader('X-procKr-rowuuid', response.uuid);

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
      .set('port', Proxy.port)
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
          'and mocking the proxy ID:',
          proxyId
        );

        log(message);
      });
  };

  // search proxy in DB
  db.whenReady().then(function () {
    if (!proxyId) {
      log('The proxy has not been set.');
    }

    db.model('Proxy').get(proxyId, function (err, Proxy_) {
      if (err) {
        log('An error has occurred when fetching data.', err);
        process.exit(1);
      }

      // dump the database in memory, used for this process
      db.toMemory(function (err, db_) {
        if (err) {
          log('err', err);
          return;
        }

        // run the Express app with the Proxy row and the in-memory database
        runApp(Proxy_, db_);
      });
    });
  });
})();

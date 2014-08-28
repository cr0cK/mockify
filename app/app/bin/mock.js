'use strict';


(function () {
  var _           = require('lodash'),
      express     = require('express'),
      bodyParser  = require('body-parser'),
      router      = express.Router(),
      db          = require('./../lib/db');

  /**
   * Express app with an in-memory database which will be used to mock data.
   */
  var runApp = function (db) {
    var mockData = (function () {
      return function (req, res) {
        // search a response for the current query
        db.model('Response').find({
          method: req.method,
          url: req.url
        }, function (err, responses) {
          if (err) {
            res.status(500).send(err);
          }
          else {
            var response = _.first(responses);

            if (!response) {
              res.status(404).send('No response has been found.');
            }
            else {
              // set headers
              _.forEach(response.resHeaders, function (value, key) {
                res.setHeader(key, value);
              });

              res.setHeader('X-MocKr-rowuuid', response.uuid);

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
      // @TODO make port configurable
      .set('port', 4001)
      .use(bodyParser.json())          // to support JSON-encoded bodies
      .use(bodyParser.urlencoded())    // to support URL-encoded bodies
      .use(router)
      .listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
      });
  };

  // dump the database in memory to be used for mocking
  db.toMemory(function (err, db_) {
    if (err) {
      console.log('err', err);
      return;
    }

    // run the Express app with the in-memory database
    runApp(db_);
  });
})();

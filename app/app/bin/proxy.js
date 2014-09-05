/* global Buffer */

/**
 * Standalone proxy.
 * Started as a child process of the Express app.
 */
'use strict';

(function () {
  var httpProxy   = require('http-proxy'),
      jsonBody    = require('body/json'),
      argv        = require('minimist')(process.argv.slice(2)),
      _           = require('lodash'),
      _s          = require('underscore.string'),
      moment      = require('moment'),
      url         = require('url'),
      db          = require('./../lib/db'),
      guid        = require('./../lib/helper').guid,
      port        = argv.port || 4000,
      proxyId     = argv.proxyId,
      target      = argv.target || 'http://localhost';

  /**
   * Write log on stdout.
   */
  var log = function (message) {
    console.log(message);
  };

  // create proxy
  var proxy = httpProxy.createProxyServer({
    secure: false,
    xfwd: true
  });

  // To modify the proxy connection before data is sent, you can listen
  // for the 'proxyReq' event. When the event is fired, you will receive
  // the following arguments:
  // (http.ClientRequest proxyReq, http.IncomingMessage req,
  //  http.ServerResponse res, Object options). This mechanism is useful when
  // you need to modify the proxy request before the proxy connection
  // is made to the target.
  //
  proxy.on('proxyReq', function (proxyReq, req, res) {
    // hack the host in the header to be able to proxy a different host
    var parsedTarget = url.parse(target);
    proxyReq._headers.host = parsedTarget.host;

    // generate a random uuid to not match Etag and avoid "304 not modified"
    // (304 responses will not trigger the 'data' event from the response object
    // and therefore we can't save body in database)
    proxyReq._headers['if-none-match'] = guid();

    // don't send the cookies of localhost
    proxyReq._headers.cookie = '';

    var message = _s.sprintf('[%s] %s%s -> %s%s',
      req.method,
      req.headers.host,
      req.url,
      proxyReq._headers.host,
      proxyReq.path
    );

    // stdout captured by the main app
    log(message);

    // set a header to identify the query in order to save its response
    var uuid = guid();
    proxyReq.setHeader('X-MocKr-rowuuid', uuid);

    // decode body to json
    jsonBody(req, res, function (__, json) {
      var data = {
        uuid: uuid,
        dateCreated: moment().toDate(),
        url: req.url,
        method: req.method,
        parameters: (_.isObject(json) && json) || {},
        reqHeaders: req.headers,
        proxyId: proxyId
      };

      db.model('Response').create([data], function (err) {
        if (err) {
          log('An error has occurred', err);
        }
      });
    });
  });

  proxy.on('proxyRes', function (res) {
    var buffers = [];
    res.on('data', function (chunk) {
      buffers.push(chunk);
    });

    res.on('end', function () {
      var res_ = this.req.res;
      var uuid = this.req._headers['x-mockr-rowuuid'];

      var megaBuffer = Buffer.concat(buffers);

      db.model('Response').find({uuid: uuid}, function (err, responses) {
        var response = _.first(responses);

        // if response found, update headers and body
        if (response) {
          response.resHeaders = res_.headers;
          response.status = res_.statusCode;
          response.body = megaBuffer.toString('utf8');

          response.save(function (err) {
            if (err) {
              log('An error has occurred', err);
            }
          });
        }
      });
    });
  });

  var server = require('http').createServer(function (req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    proxy.web(req, res, {target: target});
  });

  log('Proxy listening on localhost:' + port + ' and proxying ' + target);

  server.listen(port);
})();

/* global Buffer */

/**
 * Standalone proxy.
 * Started as a child process of the Express app.
 */
'use strict';

(function () {
  var httpProxy   = require('http-proxy'),
      anyBody     = require('body/any'),
      argv        = require('minimist')(process.argv.slice(2)),
      _           = require('lodash'),
      _s          = require('underscore.string'),
      moment      = require('moment'),
      url         = require('url'),
      db          = require('./../lib/db'),
      guid        = require('./../lib/helper').guid,
      port        = argv.port || 4000,
      target      = argv.target || 'http://localhost';

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
  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    // hack the host in the header to be able to proxy a different host
    var parsedTarget = url.parse(target);
    proxyReq._headers.host = parsedTarget.host;

    // don't send cookies of localhost!
    proxyReq._headers.cookie = '';

    var log = _s.sprintf('[%s] %s%s -> %s%s',
      req.method,
      req.headers.host,
      req.url,
      proxyReq._headers.host,
      proxyReq.path
    );

    // stdout captured by the main app
    console.log(log);

    // set a header to identify the query in order to save its response
    var uuid = guid();
    proxyReq.setHeader('X-MocKr-rowuuid', uuid);

    // decode body to json
    anyBody(req, res, function (__, json) {
      var data = {
        uuid        : uuid,
        dateCreated : moment().toDate(),
        url         : req.url,
        method      : req.method,
        parameters  : (_.isObject(json) && json) || {},
        reqHeaders  : req.headers,
        apiId       : 42
      };

      db.model('Response').create([data], function (err) {
        if (err) {
          console.log('An error has occurred', err);
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
              console.log('An error has occurred', err);
            }
          });
        }
      });
    });
  });

  var server = require('http').createServer(function(req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    proxy.web(req, res, {target: target});
  });

  console.log('Proxy listening on localhost:' + port + ' and proxying ' +
    target);
  server.listen(port);
})();

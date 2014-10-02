/**
 * This is the proxy binary which allows to proxy and save queries in the
 * procKr database?
 */

/* global Buffer */

'use strict';

var httpProxy   = require('http-proxy'),
    jsonBody    = require('body/json'),
    argv        = require('minimist')(process.argv.slice(2)),
    _           = require('lodash'),
    _s          = require('underscore.string'),
    moment      = require('moment'),
    url         = require('url'),
    db          = require('../lib/db'),
    targetId    = argv.targetId,
    exit        = function () { process.exit(1); };

/**
 * Write log on stdout.
 */
var log = function (message) {
  process.stdout.write('[proxy-out] ' + message + '\n');
};

var logError = function (message) {
  process.stderr.write('[proxy-error] ' + message + '\n');
};

var logResponse = function (message) {
  process.stdout.write('[proxy-response] ' + message + '\n');
};

/**
 * Start the proxy.
 * @param  {int}  port  Port to listen
 * @param  {url_} url_  Url to proxy
 */
var startProxy = function (target) {
  var server = require('http').createServer(function (req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    proxy.web(req, res, {target: target.url});
  });

  server.listen(target.port);

  log(_s.sprintf('Proxy listening on localhost:%s and proxying %s',
    target.port, target.url));

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
  proxy.on('proxyReq', function handleProxyRequest(proxyReq, req, res) {
    // hack the host in the header to be able to proxy a different host
    var parsedTarget = url.parse(target.url);
    proxyReq._headers.host = parsedTarget.host;

    // generate a random uuid to not match Etag and avoid "304 not modified"
    // (304 responses will not trigger the 'data' event from the response object
    // and therefore we can't save body in database)
    proxyReq._headers['if-none-match'] = _.uuid();

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
    logResponse(message);

    // save the response only if recording the target
    if (target.recording) {
      // set a header to identify the query in order to save its response
      var uuid = _.uuid();
      proxyReq.setHeader('X-procKr-rowuuid', uuid);

      // decode body to json
      jsonBody(req, res, function (__, json) {
        var data = {
          uuid: uuid,
          dateCreated: moment().toDate(),
          url: req.url,
          method: req.method,
          parameters: (_.isObject(json) && json) || {},
          reqHeaders: req.headers,
          targetId: targetId
        };

        db.model('Response').create([data], function (err) {
          if (err) {
            logError('An error has occurred ' + err);
          }
        });
      });
    }
  });

  proxy.on('proxyRes', function (res) {
    // do nothing if not recording the target
    if (!target.recording) {
      return;
    }

    var buffers = [];
    res.on('data', function (chunk) {
      buffers.push(chunk);
    });

    res.on('end', function () {
      var res_ = this.req.res;
      var uuid = this.req._headers['x-prockr-rowuuid'];

      var megaBuffer = Buffer.concat(buffers);

      db.model('Response').find({uuid: uuid}, function (err, responses) {
        var response = _.first(responses);

        // if response found, update headers and body
        if (response) {
          response.resHeaders = res_.headers;
          response.status = res_.statusCode;
          response.body = megaBuffer.toString('utf8');

          // be sure to have a complete response before saving it
          if (response.resHeaders && response.status && response.body) {
            response.save(function (err) {
              if (err) {
                logError('An error has occurred. ' + err);
              }
            });
          }
        }
      });
    });
  });
};

db.whenReady().then(function () {
  db.model('Target').get(targetId, function (err, target) {
    if (!target) {
      logError('The target has not been found.');
      exit();
    }

    startProxy(target);
  });
});

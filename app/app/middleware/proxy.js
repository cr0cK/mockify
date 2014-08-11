/**
 * Proxy Middleware.
 *
 * Proxy request to endpoint(s) and save results in database.
 */

'use strict';

module.exports = function () {
  var simpleHttpProxy = require('simple-http-proxy');
  var db = require('../lib/db');

  var proxyOn = true;
  var proxyOpts = {
    onrequest: function (req) {
      console.log('proxy state:', proxyOn);

      // req.headers['X-Api-Key'] = 'ABC';

      console.log(req);

      db();

      // _.each(req, function (k, v) {
      //   console.log(k, v);
      // });
    }
  };

  return simpleHttpProxy('https://crock.gandi.net/api/v5', proxyOpts);
};

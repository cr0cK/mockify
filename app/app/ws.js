/**
 * Handle all the communication by Websockets.
 * Every component send events to this module which is forwarded to the browser
 * via Websockets.
 */

'use strict';

module.exports = (function () {
  var app     = require('express')(),
      server  = require('http').Server(app),
      io      = require('socket.io')(server),
      _       = require('lodash'),
      proxy   = require('./ws/proxy'),
      config  = require('./config');

  /**
   * Format the list of proxies from ChildStorage objects.
   */
  var formatProxyList = function (childStore) {
    return _.map(childStore, function (childStorage) {
      return {
        target: childStorage.target(),
        port: childStorage.port()
      };
    });
  };

  /**
   * Once connection is etablished, listen events and send/emit WS.
   */
  io.on('connection', function (socket) {
    console.log('Web socket connected.');

    // send the list of proxies when loading the Angular interface
    socket.emit('proxyList', formatProxyList(proxy.childStore()));

    // listen 'proxy' websockets and proxy them to a module
    socket.on('proxy', proxy.handleWS);

    // proxy logs (+stdout of childs)
    proxy.eventEmitter().on('log', function (data) {
      socket.emit('proxyLog', data.toString('utf8'));
    });

    // list of proxy childs
    proxy.eventEmitter().on('list', function (childStore) {
      socket.emit('proxyList', formatProxyList(childStore));
    });
  });

  return {
    /**
     * Start the Express server.
     */
    run: function () {
      server.listen(config.wsapp.port);
      console.log('Express server for websockets listening on port ' +
        config.wsapp.port);
    }
  };
})();

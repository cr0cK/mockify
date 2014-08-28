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
      proxy   = require('./ws/proxy'),
      config  = require('./config');

  /**
   * Format the list of proxies from ChildStorage objects.
   */
  // var formatProxyList = function (childStore) {
  //   return _.map(childStore, function (childStorage) {
  //     return {
  //       target: childStorage.target(),
  //       port: childStorage.port()
  //     };
  //   });
  // };

  /**
   * Once connection is etablished, listen events and send/emit WS.
   */
  io.on('connection', function (socket) {
    console.log('Web socket connected.');

    /* Emitters */

    // refresh the list of proxies
    var emitListProxies = function () {
      proxy.list(function (err, proxies) {
        socket.emit('listProxies', proxies);
      });
    }

    // send the list of proxies when loading the Angular interface
    emitListProxies();

    // proxy logs (+stdout of childs)
    proxy.eventEmitter().on('log', function (data) {
      socket.emit('proxyLog', data.toString('utf8'));
    });

    // list of proxy childs
    // proxy.eventEmitter().on('list', function (childStore) {
    //   proxy.list(function (err, proxies) {
    //     socket.emit('listProxies', proxies);
    //   });
    // });

    /* Listeners */

    // ...
    socket.on('proxy', proxy.handleWS);

    // add a proxy in DB and emit a WS to refresh the list.
    socket.on('addProxy', function (proxyEntity) {
      proxy.add(proxyEntity, function (err) {
        if (err) {
          console.log('An error has occurred when saving a new Proxy.', err);
          return;
        }

        emitListProxies();
      });
    });

    // remove a proxy in DB and emit a WS to refresh the list.
    socket.on('removeProxy', function (proxyEntity) {
      proxy.remove(proxyEntity, function (err) {
        if (err) {
          console.log('An error has occurred when deleting a Proxy.', err);
          return;
        }

        emitListProxies();
      });
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

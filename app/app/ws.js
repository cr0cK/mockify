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
      Proxy   = require('./entity/proxy'),
      config  = require('./config');

  /**
   * Once connection is etablished, listen events and send/emit WS.
   */
  io.on('connection', function (socket) {
    console.log('Web socket connected.');

    /* Emitters */

    // refresh the list of proxies
    var emitListProxies = function () {
      Proxy.list(function (err, proxies) {
        socket.emit('listProxies', proxies);
      });
    };

    // send the list of proxies when loading the Angular interface
    emitListProxies();

    // Forward childs stdout to websockets
    Proxy.eventEmitter().on('log', function (data) {
      socket.emit('proxyLog', data.toString('utf8'));
    });

    /* Listeners */

    /**
     * Add a proxy in DB and emit a WS to refresh the list.
     */
    socket.on('addProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);

      proxyEntity.add(function (err) {
        if (err) {
          console.log('An error has occurred when saving a new Proxy.', err);
          return;
        }

        emitListProxies();
      });
    });

    /**
     * Remove a proxy in DB and emit a WS to refresh the list.
     */
    socket.on('removeProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);

      proxyEntity.remove(function (err) {
        if (err) {
          console.log('An error has occurred when deleting a Proxy.', err);
          return;
        }

        emitListProxies();
      });
    });

    /**
     * Start a proxy.
     */
    socket.on('startProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);
      proxyEntity.start();
    });

    /**
     * Stop a proxy.
     */
    socket.on('stopProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);
      proxyEntity.stop();
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

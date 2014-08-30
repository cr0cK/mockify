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
        if (err) {
          socket.emit('alert', {
            strong: 'Can\'t list the proxies!',
            message: err
          });
        }

        if (proxies.length) {
          socket.emit('listProxies', proxies);
        }
      });
    };

    // send the list of proxies when loading the Angular interface
    emitListProxies();

    // Forward childs stdout to websockets
    // Remove listeners before binding to avoid to have as much as listeners
    // as the user has reloaded its interface...
    Proxy.eventEmitter().removeAllListeners('log').on('log', function (data) {
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
          socket.emit('alert', {
            strong: 'Can\'t add the proxy!',
            message: err
          });
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
          socket.emit('alert', {
            strong: 'Can\'t remove the proxy!',
            message: err
          });
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

    /**
     * Mock a proxy.
     */
    socket.on('mockProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);
      proxyEntity.mock();
    });

    /**
     * Disable/enable recording for a proxy.
     */
    socket.on('toggleRecordingProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);
      proxyEntity.toggleRecording(function (err) {
        if (err) {
          socket.emit('alert', {
            strong: 'Can\'t update the proxy!',
            message: err
          });
        }
      });
    });

    /**
     * Disable/enable a proxy.
     */
    socket.on('toggleDisableProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);
      proxyEntity.toggleDisable(function (err) {
        if (err) {
          socket.emit('alert', {
            strong: 'Can\'t update the proxy!',
            message: err
          });
        }
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

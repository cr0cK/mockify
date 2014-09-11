/**
 * Handle all the communication by Websockets.
 * Every component send events to this module which is forwarded to the browser
 * via Websockets.
 */

module.exports = function (server) {
  'use strict';

  var _       = require('lodash'),
      Q       = require('q'),
      io      = require('socket.io')(server),
      Proxy   = require('./entity/proxy');

  var listProxiesLoop;

  /**
   * Once connection is etablished, listen events and send/emit WS.
   */
  io.on('connection', function (socket) {
    console.log('Web socket connected.');

    var emitAlert = function (title, message) {
      socket.emit('alert', {
        strong: message,
        message: message
      });
    };

    /* Emitters */

    // refresh the list of proxies
    var emitListProxies = function () {
      Q.ninvoke(Proxy.list).then(function (proxies) {
        socket.emit('listProxies', proxies);
      }).catch(function (err) {
        emitAlert('Can\'t list the proxies!', err);
      });
    };

    // refresh proxies every x sec
    listProxiesLoop && clearInterval(listProxiesLoop);
    listProxiesLoop = setInterval(emitListProxies, 2500);

    // send the list of proxies when loading the Angular interface
    emitListProxies();

    // Forward childs stdout to websockets
    // Remove listeners before binding to avoid to have as much as listeners
    // as the user has reloaded its interface...
    Proxy.eventEmitter().removeAllListeners('log').on('log', function (data) {
      var event_ = 'log';

      // search a tag between brackets
      var matches = data.message.match(/^\[([^\]]+)\]/);
      if (_.isArray(matches) && matches.length) {
        event_ = matches[1];
        // remove tag
        data.message = data.message.replace(/^\[.+\]/, '');
      }

      socket.emit(event_, data);
    });

    /* Listeners */

    /**
     * Add a proxy in DB and emit a WS to refresh the list.
     */
    socket.on('addProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);

      Q.ninvoke(proxyEntity, 'add').then(function () {
        emitListProxies();
      }).catch(function (err) {
        emitAlert('Can\'t add the proxy!', err);
      });
    });

    /**
     * Remove a proxy in DB and emit a WS to refresh the list.
     */
    socket.on('removeProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);

      Q.ninvoke(proxyEntity, 'remove').then(function () {
        emitListProxies();
      }).catch(function (err) {
        emitAlert('Can\'t remove the proxy!', err);
      });
    });

    /**
     * Mock a proxy.
     */
    socket.on('toggleMockProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);

      proxyEntity.toggleMock().catch(function (err) {
        emitAlert('Can\'t toggle mock/proxy!', err);
      });
    });

    /**
     * Disable/enable recording for a proxy.
     */
    socket.on('toggleRecordingProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);

      Q.ninvoke(proxyEntity, 'toggleRecording').catch(function (err) {
        emitAlert('Can\'t toggle recording!', err);
      });
    });

    /**
     * Enable/disable a proxy.
     */
    socket.on('toggleEnableProxy', function (proxy) {
      var proxyEntity = new Proxy(proxy);

      Q.ninvoke(proxyEntity, 'toggleEnable').catch(function (err) {
        emitAlert('Can\'t enable the proxy!', err);
      });
    });
  });

  return io;
};

(function () {
  'use strict';

  angular.module('mocKr.entity.proxy', [
    'mocKr.service.webSocket'
  ])

  /**
   * Return an object ready to be instanciated to describe a Proxy entity.
   */
  .factory('proxyFactory', ['webSocketService', function (webSocket) {
    var Proxy = function (properties) {
      _.merge(this, properties);
    };

    Proxy.prototype.isRecording = function () {
      return this._isRecording;
    };

    /**
     * Add the proxy by emitting a websocket to the server.
     */
    Proxy.prototype.add = function () {
      webSocket.emit('addProxy', this);
    };

    /**
     * Remove the proxy from the DB by emitting a websocket to the server.
     */
    Proxy.prototype.remove = function () {
      webSocket.emit('removeProxy', this);
    };

    /**
     * Start the proxy by emitting a websocket to the server.
     */
    Proxy.prototype.start = function () {
      webSocket.emit('startProxy', this);
    };

    /**
     * Stop the proxy by emitting a websocket to the server.
     */
    Proxy.prototype.stop = function () {
      webSocket.emit('stopProxy', this);
    };

    return Proxy;
  }]);
})();

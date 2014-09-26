(function () {
  'use strict';

  angular.module('procKr.entity.target', [
    'procKr.service.webSocket'
  ])

  /**
   * Return an object ready to be instanciated to describe a Target entity.
   */
  .factory('targetFactory', ['webSocketService', function (webSocket) {
    var Target = function (properties) {
      // in order to not have to wait the websocket remove event,
      // when hide the target when clicking on the remove icon.
      this.hidden = false,

      this._id =
      this._port =
      this._url =
      this._recording =
      this._proxying =
      this._mocking =
      this._enabled;

      _.privateMerge(this, properties);
    };

    Target.prototype.id = function () {
      return this._id;
    };

    Target.prototype.port = function () {
      return this._port;
    };

    Target.prototype.url = function () {
      return this._url;
    };

    Target.prototype.recording = function () {
      return this._recording;
    };

    Target.prototype.proxying = function () {
      return this._proxying;
    };

    Target.prototype.mocking = function () {
      return this._mocking;
    };

    Target.prototype.enabled = function () {
      return this._enabled;
    };

    /**
     * Add the target by emitting a websocket to the server.
     */
    Target.prototype.add = function () {
      webSocket.emit('addTarget', _.publicProperties(this, ['_port', '_url']));
    };

    /**
     * Remove the target from the DB by emitting a websocket to the server.
     */
    Target.prototype.remove = function () {
      webSocket.emit('removeTarget', _.publicProperties(this));
    };

    /**
     * Set the target to record false/true in the DB by emitting a websocket
     * to the server.
     */
    Target.prototype.toggleRecording = function () {
      // need to switch the flag here because the template is not binded to a
      // model
      this._recording = !this._recording;
      webSocket.emit('recordingTarget', {
        targetProperties: {id: this._id},
        status: this._recording
      });
    };

    /**
     * Enable/disable the mock.
     */
    Target.prototype.toggleMock = function () {
      webSocket.emit('toggleMockTarget', _.publicProperties(this));
    };

    /**
     * Set the target to enabled true/false in the DB by emitting a websocket
     * to the server.
     */
    Target.prototype.toggleEnable = function () {
      var event_ = this._enabled ? 'enableTarget' : 'disableTarget';
      webSocket.emit(event_, {id: this._id});
    };

    /**
     * Start the mock by emitting a websocket to the server.
     */
    Target.prototype.mock = function () {
      webSocket.emit('mockTarget', _.publicProperties(this));
    };

    return Target;
  }]);
})();

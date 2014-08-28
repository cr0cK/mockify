/* global io */

(function () {
  'use strict';

  angular.module('mocKr.service.webSocket', [
  ])

  .factory('webSocketService', [function () {
    var socket = io('http://localhost:3334');

    return {
      on: function (event_, callback) {
        socket.on(event_, function (data) {
          callback(data);
        });
      },

      emit: function (event_, data) {
        socket.emit(event_, data);
      }
    };
  }]);
})();

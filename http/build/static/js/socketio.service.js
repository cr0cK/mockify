/* global io */

(function () {
  'use strict';

  angular.module('procKr.service.webSocket', [
  ])

  .factory('webSocketService', ['$rootScope', '$interval',
    function ($rootScope, $interval) {
      var socket = io();

      // check that the websocket server is up every X secs
      $interval(function () {
        if (!socket.connected) {
          $rootScope.$emit('alert', {
            message: 'Websocket server has gone away!'
          });
        } else {
          $rootScope.$emit('hideAlert');
        }
      }, 3000);

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
    }
  ]);
})();

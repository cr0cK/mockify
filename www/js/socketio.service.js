/* global io */

(function () {
  'use strict';

  angular.module('mockify.service.webSocket', [
  ])

  .factory('webSocketService', ['$rootScope', '$interval',
    function ($rootScope, $interval) {
      // @FIXME The port should be read from the config
      var socket = io('http://localhost:5001');

      // check that the websocket server is up every X secs
      $interval(function () {
        if (!socket.connected) {
          $rootScope.$emit('alertError', {
            message: 'Websocket server has gone away!'
          });
        } else {
          $rootScope.$emit('hideAlert');
        }
      }, 10000);

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

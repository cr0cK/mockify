(function () {
  'use strict';

  angular.module('procKr.logs', [
    'procKr.service.webSocket',
    'procKr.logs.directives',

    'perfect_scrollbar'
  ])

  .controller('LogsCtrl', ['$scope', 'webSocketService',
    function ($scope, webSocket) {
      $scope.logs = [];

      _.forEach(['proxy', 'mock'], function (eventSource) {
        webSocket.on(eventSource + 'Out', function (data) {
          $scope.$apply(function () {
            $scope.logs.push({
              message: data
            });
          });
        });

        webSocket.on(eventSource + 'Error', function (data) {
          $scope.$apply(function () {
            $scope.logs.push({
              type: 'error',
              message: data
            });
          });
        });
      });
    }
  ]);
})();

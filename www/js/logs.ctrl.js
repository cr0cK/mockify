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

      webSocket.on('proxyOut', function (data) {
        $scope.$apply(function () {
          $scope.logs.push({
            message: data
          });
        });
      });

      webSocket.on('proxyError', function (data) {
        $scope.$apply(function () {
          $scope.logs.push({
            type: 'error',
            message: data
          });
        });
      });
    }
  ]);
})();

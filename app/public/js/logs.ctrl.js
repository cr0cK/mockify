(function () {
  'use strict';

  angular.module('mocKr.logs', [
    'mocKr.service.webSocket'
  ])

  .controller('LogsCtrl', ['$scope', 'webSocketService',
    function ($scope, webSocket) {
      $scope.proxyLogs = [];

      webSocket.on('proxyLog', function (data) {
        $scope.$apply(function () {
          $scope.proxyLogs.push(data);
        });
      });
    }
  ]);
})();

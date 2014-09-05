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
          if (
            data.type !== 'error' ||
            data.type === 'error' && /Error/.test(data.message)
          ) {
            $scope.proxyLogs.push(data);
          }
        });
      });
    }
  ]);
})();

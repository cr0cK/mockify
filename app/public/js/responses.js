(function () {
  'use strict';

  angular.module('mocKr.responses', [
    'mocKr.service.webSocket'
  ])

  .controller('ResponsesCtrl', ['$scope', 'webSocketService',
    function ($scope, webSocket) {
      $scope.responsesLogs = [];

      webSocket.on('proxyLog', function (data) {
        $scope.$apply(function () {
          if (
            data.type !== 'error' ||
            data.type === 'error' && /Error/.test(data.message)
          ) {
            $scope.responsesLogs.push(data);
          }
        });
      });
    }
  ]);
})();

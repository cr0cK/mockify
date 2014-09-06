(function () {
  'use strict';

  angular.module('mocKr.responses', [
    'mocKr.service.webSocket'
  ])

  .controller('ResponsesCtrl', ['$scope', 'webSocketService',
    function ($scope, webSocket) {
      $scope.responsesLogs = [];

      var displayLog = function (data) {
        $scope.$apply(function () {
          if (
            data.type !== 'error' ||
            data.type === 'error' && /Error/.test(data.message)
          ) {
            $scope.responsesLogs.push(data);
          }
        });
      };

      webSocket.on('mockLog', displayLog);
      webSocket.on('proxyLog', displayLog);
    }
  ]);
})();

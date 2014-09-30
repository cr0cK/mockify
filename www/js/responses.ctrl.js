(function () {
  'use strict';

  angular.module('procKr.responses', [
    'procKr.service.webSocket'
  ])

  .controller('ResponsesCtrl', ['$scope', 'webSocketService',
    function ($scope, webSocket) {
      $scope.logs = [];

      webSocket.on('proxyResponse', function (data) {
        $scope.$apply(function () {
          $scope.logs.push({
            message: data
          });
        });
      });
    }
  ]);
})();

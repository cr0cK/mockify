(function () {
  'use strict';

  angular.module('procKr.responses', [
    'procKr.service.webSocket'
  ])

  .controller('ResponsesCtrl', ['$scope', 'webSocketService',
    function ($scope, webSocket) {
      $scope.logs = [];

      _.forEach(['proxy', 'mock'], function (eventSource) {
        webSocket.on(eventSource + 'Response', function (data) {
          $scope.$apply(function () {
            $scope.logs.push({
              message: data
            });
          });
        });
      });
    }
  ]);
})();

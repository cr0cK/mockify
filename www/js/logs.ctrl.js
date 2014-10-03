(function () {
  'use strict';

  angular.module('mockify.logs', [
    'mockify.service.webSocket',
    'mockify.logs.directives',

    'perfect_scrollbar'
  ])

  .controller('LogsCtrl', ['$scope', 'webSocketService',
    function ($scope, webSocket) {
      $scope.logs = [];

      _.forEach(['proxy', 'mock'], function (eventSource) {
        webSocket.on(eventSource + 'Out', function (logData) {
          $scope.$apply(function () {
            $scope.logs.push(logData);
          });
        });

        webSocket.on(eventSource + 'Error', function (logData) {
          $scope.$apply(function () {
            $scope.logs.push(logData);
          });
        });
      });
    }
  ]);
})();

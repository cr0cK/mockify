(function () {
  'use strict';

  angular.module('mocKr.logs', [
    'mocKr.service.webSocket',
    'mocKr.logs.directives',

    'perfect_scrollbar'
  ])

  .controller('LogsCtrl', ['$scope', 'webSocketService',
    function ($scope, webSocket) {
      $scope.logs = [];

      webSocket.on('log', function (data) {
        $scope.$apply(function () {
          if (
            data.type !== 'error' ||
            data.type === 'error' && /Error/.test(data.message)
          ) {
            $scope.logs.push(data);
          }
        });
      });
    }
  ]);
})();

(function () {
  'use strict';

  angular.module('mocKr.logs', [
    'mocKr.service.webSocket',

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
  ])

  /**
   * Each time the 'logs' change, update the scroll to bottom smootly.
   */
  .directive('updateScroll', [function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var e = element;
        scope.$watch('logs', function () {
          e.animate({scrollTop: e.prop('scrollHeight')}, 500);
        }, true);
      }
    };
  }]);
})();

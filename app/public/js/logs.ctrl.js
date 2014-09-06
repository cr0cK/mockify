(function () {
  'use strict';

  angular.module('mocKr.logs', [
    'mocKr.service.webSocket',

    'perfect_scrollbar'
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
  ])

  /**
   * Each time the 'proxyLogs' change, update the scroll to bottom smootly.
   */
  .directive('updateScroll', [function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var e = element;
        scope.$watch('proxyLogs', function () {
          console.log(e.prop('scrollHeight'), e.height());

          e.animate({scrollTop: e.prop('scrollHeight')}, 500);
        }, true);
      }
    };
  }]);
})();

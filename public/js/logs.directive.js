(function () {
  'use strict';

  angular.module('mocKr.logs.directives', [
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

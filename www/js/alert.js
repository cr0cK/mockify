(function () {
  'use strict';

  angular.module('mockify.alert', [
    'mockify.service.webSocket'
  ])

  /**
   * Handle alerts sent by websockets.
   */
  .controller('AlertCtrl', ['$scope', 'webSocketService',
    function ($scope, webSocket) {
      $scope.showAlert = false;

      var saveDataToScope = function (data) {
        $scope.type = data.type || 'danger';
        $scope.strong = data.strong;
        $scope.message = data.message;
        $scope.showAlert = true;
      };

      $scope.$root.$on('alertError', function (e, data) {
        saveDataToScope(data);
      });

      $scope.$root.$on('hideAlert', function () {
        $scope.showAlert = false;
      });

      webSocket.on('alertError', function (data) {
        $scope.$apply(function () {
          saveDataToScope(data);
        });
      });
    }
  ]);
})();

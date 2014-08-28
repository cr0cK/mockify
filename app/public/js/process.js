(function () {
  'use strict';

  angular.module('mocKr.process', [
    'mocKr.service.localStorage'
  ])

  .controller('ProcessListCtrl', [
    '$scope', 'localStorageFactory', function ($scope) {

    $scope.title = 'ProcessListCtrl';
  }]);
})();

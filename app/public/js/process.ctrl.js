(function () {
  'use strict';

  angular.module('mocKr.process', [
    'mocKr.service.webSocket',
    'mocKr.service.localStorage'
  ])

  .controller('ProcessListCtrl', [
    '$scope', 'webSocketService', 'localStorageFactory',
    function ($scope, webSocket, localStorage) {

    $scope.proxyList = [];

    webSocket.on('proxyList', function (data) {
      $scope.$apply(function () {
        $scope.proxyList = data;
      });
    });

    var initDefaultTarget = function () {
      $scope.targetsStored = localStorage.get('targets');
      return localStorage.last('targets') ||
        'http://jsonplaceholder.typicode.com';
    };

    $scope.defaultValues = {
      // target: 'http://localhost',
      target: initDefaultTarget(),
      port: 4000
    };

    $scope.startProxy = function () {
      // @TODO check format
      // see https://gist.github.com/jlong/2428561

      var target = ($scope.target || $scope.defaultValues.target);

      // save the target
      localStorage.push('targets', target);

      webSocket.emit('proxy', {
        action: 'start',
        target: target,
        port: ($scope.port || $scope.defaultValues.port)
      });

      delete $scope.target;
      delete $scope.port;

      $scope.defaultValues.target = initDefaultTarget();
    };

    $scope.stopProxy = function (proxy) {
      webSocket.emit('proxy', {
        action: 'stop',
        target: (
          // if a proxy has been defined
          (proxy && proxy.target) ||
          // input value
          $scope.target ||
          // fallback to default value
          $scope.defaultValues.target
        ),
        port: (
          (proxy && proxy.port) ||
          $scope.port ||
          $scope.defaultValues.port
        )
      });
    };

    $scope.deleteSavedTargets = function () {
      localStorage.delete('targets');

      delete $scope.target;
      $scope.defaultValues.target = initDefaultTarget();
    };
  }]);
})();

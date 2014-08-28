/* global io */

(function () {
  'use strict';

  angular.module('mocKr.logs', [
    'mocKr.service.localStorage'
  ])

  .controller('LogsCtrl', [
    '$scope', 'localStorageFactory', function ($scope, localStorage) {

    var socket = io('http://localhost:3334');

    $scope.proxyLogs = $scope.proxyList = [];

    socket.on('proxyLog', function (data) {
      $scope.$apply(function () {
        $scope.proxyLogs.push(data);
      });
    });

    socket.on('proxyList', function (data) {
      $scope.$apply(function () {
        $scope.proxyList = data;
      });
    });

    var initDefaultTarget = function () {
      $scope.targetsStored = localStorage.get('targets');
      return localStorage.last('targets') || 'http://httpbin.org';
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

      socket.emit('proxy', {
        action: 'start',
        target: target,
        port: ($scope.port || $scope.defaultValues.port)
      });

      delete $scope.target;
      delete $scope.port;

      $scope.defaultValues.target = initDefaultTarget();
    };

    $scope.stopProxy = function (proxy) {
      socket.emit('proxy', {
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

/* global io */

(function () {
  'use strict';

  angular.module('app', [
    'ui.router',

    'templates'
  ])

  .config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('index', {
        url: '/',
        // data: {
        //   pageTitle: gettext('Title')
        // },
        views: {
          'main': {
            templateUrl: 'index.html',
            controller: 'IndexCtrl'
          }
        }
      });
  })

  .controller('IndexCtrl', ['$scope', function ($scope) {
    var socket = io('http://localhost:3334');

    $scope.proxyLogs = [];
    $scope.proxyList = [];

    socket.on('proxyLog', function (data) {
      console.log('receive', data);

      $scope.$apply(function () {
        $scope.proxyLogs.push(data);
      });
    });

    socket.on('proxyList', function (data) {
      $scope.$apply(function () {
        $scope.proxyList = data;
      });
    });

    $scope.defaultValues = {
      target: 'http://localhost',
      port: 4000
    };

    $scope.startProxy = function () {
      socket.emit('proxy', {
        action: 'start',
        target: ($scope.target || $scope.defaultValues.target),
        port: ($scope.port || $scope.defaultValues.port)
      });
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

  }]);
})();

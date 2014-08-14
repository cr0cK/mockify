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

    socket.on('proxyLog', function (data) {
      console.log('receive', data);

      $scope.$apply(function () {
        $scope.proxyLogs.push(data);
      });
    });

    $scope.defaultValues = {
      target: 'http://localhost',
      port: 4000
    };

    $scope.startProxy = function () {
      console.log('start proxy');
      socket.emit('proxy', {
        action: 'start',
        target: ($scope.target || $scope.defaultValues.target),
        port: ($scope.port || $scope.defaultValues.port)
      });
    };

    $scope.stopProxy = function () {
      console.log('stop proxy');
      socket.emit('proxy', {
        action: 'stop',
        target: ($scope.target || $scope.defaultValues.target),
        port: ($scope.port || $scope.defaultValues.port)
      });
    };

  }]);
})();

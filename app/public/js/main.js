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

    $scope.startProxy = function () {
      console.log('start proxy');
      socket.emit('proxy', {
        action: 'start',
        url: $scope.url,
        port: $scope.port
      });
    };

    $scope.stopProxy = function () {
      console.log('stop proxy');
      socket.emit('proxy', {
        action: 'stop',
        url: $scope.url,
        port: $scope.port
      });
    };
  }]);
})();

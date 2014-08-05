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
    $scope.title = 'Bienvenue !';
    $scope.hello = 'Hello !';

    var socket = io.connect('http://localhost:3334');
      socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });

    $scope.send = function () {
      socket.emit('action', { value: $scope.value });
      $scope.value = '';
    };
  }]);
})();

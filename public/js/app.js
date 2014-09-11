(function () {
  'use strict';

  angular.module('procKr', [
    'ui.router',
    'ui.bootstrap',

    'templates',

    'procKr.dashboard'
  ])

  .config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
      .state('app', {
        url: '/',
        views: {
          error: {
            templateUrl: 'error.html',
            controller: 'ErrorCtrl'
          },
          header: {
            templateUrl: 'header.html'
          },
          layout: {
            templateUrl: '2columns.html'
          }
        }
      });
  })

  .run(['$rootScope', '$state', function ($rootScope, $state) {
    // display route state for debug
    $rootScope.$on('$stateChangeSuccess', function (e, current) {
      console.log('Current state:', current.name);
    });

    // go to the dashboard when loading the app
    $rootScope.$on('$stateChangeStart', function (next, current) {
      if (current.name === 'app') {
        $state.go('app.dashboard');
      }
    });
  }])

  /**
   * Handle errors sent by websockets.
   */
  .controller('ErrorCtrl', ['webSocketService', '$scope',
    function (webSocket, $scope) {
      $scope.showAlert = false;

      webSocket.on('alert', function (data) {
        $scope.$apply(function () {
          $scope.type = data.type || 'danger';
          $scope.strong = data.strong;
          $scope.message = data.message;
          $scope.showAlert = true;
        });
      });
    }
  ]);
})();

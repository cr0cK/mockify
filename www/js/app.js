(function () {
  'use strict';

  angular.module('mockify', [
    'ui.router',
    'ui.bootstrap',

    'templates',

    'mockify.alert',
    'mockify.dashboard'
  ])

  .config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
      .state('app', {
        url: '/',
        views: {
          alert: {
            templateUrl: 'alert.html',
            controller: 'AlertCtrl'
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
  }]);
})();

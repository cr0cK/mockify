(function () {
  'use strict';

  angular.module('mocKr', [
    'ui.router',
    'ui.bootstrap',

    'templates',

    'mocKr.dashboard'
  ])

  .config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
      .state('app', {
        url: '/',
        views: {
          'header': {
            templateUrl: 'header.html'
          },
          'layout': {
            templateUrl: '2columns.html'
          },
          'footer': {
            templateUrl: 'footer.html'
          }
        }
      });
  })

  .run(['$rootScope', '$state', function ($rootScope, $state) {
    // display route state for debug
    $rootScope.$on('$stateChangeSuccess', function(e, current) {
      console.log('Current state:', current.name);
    });

    // go to the dashboard when loading the app
    $rootScope.$on('$stateChangeStart', function(next, current) {
      if (current.name === 'app') {
        $state.go('app.dashboard');
      }
    });
  }]);
})();

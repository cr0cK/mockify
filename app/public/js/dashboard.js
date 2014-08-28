(function () {
  'use strict';

  angular.module('mocKr.dashboard', [
    'mocKr.logs',
    'mocKr.process'
  ])

  .config(function ($urlRouterProvider, $stateProvider) {
    $stateProvider
      .state('app.dashboard', {
        url: 'dashboard',
        views: {
          'primaryContainer': {
            templateUrl: 'logs.html',
            controller: 'LogsCtrl'
          },
          'secondaryContainer': {
            templateUrl: 'process-list.html',
            controller: 'ProcessListCtrl'
          }
        }
      });
  });
})();

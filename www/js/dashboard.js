(function () {
  'use strict';

  angular.module('procKr.dashboard', [
    'procKr.process',
    'procKr.responses',
    'procKr.logs'
  ])

  .config(function ($urlRouterProvider, $stateProvider) {
    $stateProvider
      .state('app.dashboard', {
        url: 'dashboard',
        views: {
          primaryContainer: {
            templateUrl: 'responses.html',
            controller: 'ResponsesCtrl'
          },
          secondaryContainer: {
            templateUrl: 'targets.html',
            controller: 'TargetCtrl'
          },
          logsContainer: {
            templateUrl: 'logs.html',
            controller: 'LogsCtrl'
          }
        }
      });
  });
})();

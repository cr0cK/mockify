(function () {
  'use strict';

  angular.module('procKr.process', [
    'procKr.service.webSocket',
    'procKr.service.localStorage',
    'procKr.entity.target',

    'toggle-switch'
  ])

  .controller('TargetCtrl', [
    '$scope',
    '$interval',
    'webSocketService',
    'localStorageFactory',
    'targetFactory',

    function (
      $scope,
      $interval,
      webSocket,
      localStorage,
      Target
    ) {

      var initDefaultUrl = function () {
        $scope.targetsStored = localStorage.get('targets', 10);
        return localStorage.last('targets') ||
          'http://jsonplaceholder.typicode.com';
      };

      $scope.targetList = [];

      $scope.defaultValues = {
        url: initDefaultUrl(),
        port: 4000
      };

      /**
       * Register a target in the DB.
       */
      $scope.addAndStartTarget = function (port, url) {
        port = port || $scope.defaultValues.port;
        url = url || $scope.defaultValues.url;

        // save the url
        localStorage.push('urls', url);

        // create an entity
        var target = new Target({
          port: port,
          url: url,
          proxying: 0,
          mocking: 0,
          enabled: 0
        });

        target.add();

        $scope.targetsList.push(target);

        delete $scope.target;
        delete $scope.port;

        $scope.defaultValues.target = initDefaultUrl();
      };

      /**
       * Stop and remove a target from the DB
       * @param  {Target}  target  Target entity
       */
      $scope.removeTarget = function (target) {
        target.hidden = true;
        target.remove();
      };

      /**
       * Enable/Disable the record for a target.
       */
      $scope.toggleRecordTarget = function (target) {
        target.toggleRecording();
      };

      /**
       * Enable the target / Disable the mock
       * Disable the target / Enable the mock
       */
      $scope.toggleMockTarget = function (target) {
        target.toggleMock();
      };

      /**
       * Enable/disable the target.
       */
      $scope.toggleEnableTarget = function (target) {
        target.toggleEnable();
      };

      /**
       * Websockets events
       */

      /**
       * Get the list of targets.
       */
      var listTargets = function () {
        webSocket.emit('listTargets');

        webSocket.on('listTargets', function (data) {
          $scope.$apply(function () {
            $scope.targetsList = _.map(data.targets, function (targetProps) {
              return new Target(targetProps);
            });
          });
        });
      };

      listTargets();

      // refresh targets every X seconds
      $interval(listTargets, 3000);
    }
  ]);
})();

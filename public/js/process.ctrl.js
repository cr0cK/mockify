(function () {
  'use strict';

  angular.module('procKr.process', [
    'procKr.service.webSocket',
    'procKr.service.localStorage',
    'procKr.entity.proxy',

    'toggle-switch'
  ])

  .controller('ProcessListCtrl', [
    '$scope',
    'webSocketService',
    'localStorageFactory',
    'proxyFactory',
    function (
      $scope,
      webSocket,
      localStorage,
      Proxy
    ) {

      var initDefaultTarget = function () {
        $scope.targetsStored = localStorage.get('targets');
        return localStorage.last('targets') ||
          'http://jsonplaceholder.typicode.com';
      };

      $scope.proxyList = [];

      $scope.defaultValues = {
        // target: 'http://localhost',
        target: initDefaultTarget(),
        port: 4000
      };

      /**
       * Register a proxy in the DB and start it.
       */
      $scope.addAndStartProxy = function (port, target, status) {
        // @TODO check format
        // see https://gist.github.com/jlong/2428561
        port = port || $scope.defaultValues.port;
        target = target || $scope.defaultValues.target;

        // save the target
        localStorage.push('targets', target);

        // create an entity
        var proxy = new Proxy({
          port: port,
          target: target,
          status: status,
          isEnabled: 0,
          isMocked: 0
        });

        // send websockets
        proxy.add();
        proxy.start();

        delete $scope.target;
        delete $scope.port;

        $scope.defaultValues.target = initDefaultTarget();
      };

      /**
       * Stop and remove a proxy from the DB
       * @param  {Proxy}  proxy  Proxy entity
       */
      $scope.removeProxy = function (proxy) {
        proxy.stop();
        proxy.remove();
      };

      /**
       * Enable/Disable the record for a proxy.
       */
      $scope.toggleRecordProxy = function (proxy) {
        proxy.toggleRecording();
      };

      /**
       * Enable the proxy / Disable the mock
       * Disable the proxy / Enable the mock
       */
      $scope.toggleMockProxy = function (proxy) {
        proxy.toggleMock();
      };

      /**
       * Enable/disable the proxy.
       */
      $scope.toggleEnableProxy = function (proxy) {
        proxy.toggleEnable();
      };

      // $scope.$watch('proxiesList', function (a, b) {
      //   console.log(a, b);
      // }, true);

      /**
       * ...
       */
      // $scope.deleteSavedTargets = function () {
      //   localStorage.delete('targets');

      //   delete $scope.target;
      //   $scope.defaultValues.target = initDefaultTarget();
      // };

      /**
       * Websockets events
       */

      // add proxies in the scope
      webSocket.on('listProxies', function (proxies) {
        $scope.$apply(function () {
          $scope.proxiesList = _.map(proxies, function (proxyProperties) {
            return new Proxy(proxyProperties);
          });
        });
      });
    }
  ]);
})();

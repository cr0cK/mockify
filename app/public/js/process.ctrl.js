(function () {
  'use strict';

  angular.module('mocKr.process', [
    'mocKr.service.webSocket',
    'mocKr.service.localStorage',
    'mocKr.entity.proxy'
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

    $scope.proxyList = [];

    var initDefaultTarget = function () {
      $scope.targetsStored = localStorage.get('targets');
      return localStorage.last('targets') ||
        'http://jsonplaceholder.typicode.com';
    };

    $scope.defaultValues = {
      // target: 'http://localhost',
      target: initDefaultTarget(),
      port: 4000
    };

    /**
     * Register a proxy in the DB.
     */
    $scope.addProxy = function (port, target, status) {
      port = port || $scope.defaultValues.port;
      target = target || $scope.defaultValues.target;

      var proxy = new Proxy({
        port: port,
        target: target,
        status: status
      });

      webSocket.emit('addProxy', proxy);
    };

    /**
     * Remove a proxy on the DB
     * @param  {Proxy}  proxy  Proxy entity
     */
    $scope.removeProxy = function (proxy) {
      webSocket.emit('removeProxy', proxy);
    };

    $scope.startProxy = function () {
      // @TODO check format
      // see https://gist.github.com/jlong/2428561

      var target = ($scope.target || $scope.defaultValues.target);

      // save the target
      localStorage.push('targets', target);

      webSocket.emit('proxy', {
        action: 'start',
        target: target,
        port: ($scope.port || $scope.defaultValues.port)
      });

      delete $scope.target;
      delete $scope.port;

      $scope.defaultValues.target = initDefaultTarget();
    };

    $scope.stopProxy = function (proxy) {
      webSocket.emit('proxy', {
        action: 'stop',
        target: (
          // if a proxy has been defined
          (proxy && proxy.target) ||
          // input value
          $scope.target ||
          // fallback to default value
          $scope.defaultValues.target
        ),
        port: (
          (proxy && proxy.port) ||
          $scope.port ||
          $scope.defaultValues.port
        )
      });
    };

    $scope.deleteSavedTargets = function () {
      localStorage.delete('targets');

      delete $scope.target;
      $scope.defaultValues.target = initDefaultTarget();
    };

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
  }]);
})();

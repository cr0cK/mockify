'use strict';

module.exports = function () {
  var path      = require('path'),
      Q         = require('q'),
      forever   = require('forever');

  /**
   * Start the mockify daemon.
   */
  var start = function () {
    var deferred = Q.defer();

    var daemonRootDir = path.resolve(process.env.PWD, 'daemon'),
        binPath = path.join(daemonRootDir, 'mockify.js');

    forever.startDaemon(binPath, {
      silent          : false,
      max             : 10,
      watch           : true,
      watchDirectory  : daemonRootDir,
      cwd             : daemonRootDir,
      logFile         : path.join(daemonRootDir, 'log', 'mockify.log'),
      outFile         : path.join(daemonRootDir, 'log', 'mockify.out.log'),
      errFile         : path.join(daemonRootDir, 'log', 'mockify.err.log')
    });

    // @FIXME Handle forever errors
    deferred.resolve('mockify daemon has been started.');

    return deferred.promise;
  };

  /**
   * Stop the mockify daemon.
   */
  var stop = function () {
    var deferred = Q.defer();

    // @FIXME Handle error if stopping when mockify is not started
    forever.stopAll().on('stopAll', function () {
      // @FIXME Handle forever errors
      deferred.resolve('mockify daemon has been stopped.');
    });

    return deferred.promise;
  };

  return {
    start: start,
    stop: stop
  };
};

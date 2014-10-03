/**
 * Handle the web interface process.
 */

'use strict';

module.exports = (function () {
  var path      = require('path'),
      spawn     = require('child_process').spawn,
      Q         = require('q');

  var httpChild;

  /**
   * Start the http server and save the child process.
   */
  var start = function () {
    var deferred = Q.defer();

    if (httpChild) {
      deferred.resolve('The http server is already started.');

    } else {
      httpChild = spawn('node', [
        path.join(__dirname, '..', '..', 'http', 'app.js')
      ]);

      httpChild.stdout.on('data', function (data) {
        deferred.resolve(data.toString('utf-8'));
      });

      // log stderr
      httpChild.stderr.on('data', function (data) {
        deferred.reject(data.toString('utf-8'));
      });
    }

    return deferred.promise;
  };

  /**
   * Stop the http server.
   */
  var stop = function () {
    var deferred = Q.defer();

    if (!httpChild) {
      deferred.resolve('The http server is already stopped.');
    } else {
      httpChild.kill('SIGHUP');

      httpChild.on('exit', function () {
        deferred.resolve('The http server has been stopped.');
        httpChild = undefined;
      });
    }

    return deferred.promise;
  };

  return {
    start: start,
    stop: stop
  };
})();

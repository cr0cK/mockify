'use strict';

module.exports = (function () {
  var forever   = require('forever'),
      path      = require('path'),
      config    = require('./config/daemon'),
      log       = function () { console.log.apply(this, arguments); };

  /**
   * Start the procKr daemon.
   * @param  {int}  port  procKr port
   */
  var start = function (port) {
    port = port || config.daemon.port;

    var runDir = path.join(__dirname, 'daemon'),
        binPath = path.join(runDir, 'app.js');

    forever.startDaemon(binPath, {
      silent              : false,
      watch               : true,
      watchDirectory      : runDir,
      cwd                 : runDir
      // logFile             : '/var/log/botker/forever-www.log',
      // outFile             : '/var/log/botker/forever-www-stdout.log',
      // errFile             : '/var/log/botker/forever-www-stderr.log',
    });

    log('procKr daemon has been started.');
  };

  /**
   * Stop the procKr daemon.
   */
  var stop = function () {
    forever.stopAll().on('stopAll', function () {
      log('procKr daemon has been stopped.');
    });
  };

  /**
   * Display a nice output with forever current running daemons.
   */
  var status = function () {
    forever.list(true, function (err, daemons) {
      log((err === null && !daemons && 'procKr is not running.') || daemons);
    });
  };

  return {
    start: start,
    stop: stop,
    status: status
  };
})();

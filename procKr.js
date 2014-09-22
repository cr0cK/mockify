'use strict';

module.exports = (function () {
  var forever   = require('forever'),
      path      = require('path'),
      config    = require('./config/config'),
      wsPort    = config.wsServer.port,
      socket    = require('socket.io-client')('http://localhost:' + wsPort),

      // to remove
      log       = function () { console.log.apply(this, arguments); },
      exit      = function () { process.exit(1); },

      hello     = require('./lib/hello')(socket),
      http      = require('./lib/http')(socket),
      target    = require('./lib/target')(socket);



  /**
   * Start the procKr daemon.
   */
  var start = function () {
    var runDir = path.join(__dirname, 'daemon'),
        binPath = path.join(runDir, 'procKr.js');

    forever.startDaemon(binPath, {
      silent          : false,
      max             : 10,
      watch           : true,
      watchDirectory  : runDir,
      cwd             : runDir,
      logFile         : path.join(runDir, 'log', 'procKr.log'),
      outFile         : path.join(runDir, 'log', 'procKr.out.log'),
      errFile         : path.join(runDir, 'log', 'procKr.err.log')
    });

    // @FIXME Handle daemon errors
    log('procKr daemon has been started.');
    exit();
  };

  /**
   * Stop the procKr daemon.
   */
  var stop = function () {
    // @FIXME Handle error if stopping when procKr is not started
    forever.stopAll().on('stopAll', function () {
      log('procKr daemon has been stopped.');
      exit();
    });
  };

  /**
   * Display a nice output with forever current running daemons.
   */
  var status = function () {
    forever.list(true, function (err, daemons) {
      log((err === null && !daemons && 'procKr is not running.') || daemons);
      exit();
    });
  };

  return {
    start: start,
    stop: stop,
    status: status,


    sayHello: hello.say,
    startHttp: http.start,
    stopHttp: http.stop,
    listTargets: target.list
  };
})();

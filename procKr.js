'use strict';

module.exports = (function () {
  var config    = require('./config/config'),
      wsPort    = config.wsServer.port,
      socket    = require('socket.io-client')('http://localhost:' + wsPort),
      daemon    = require('./lib/daemon')(),
      status    = require('./lib/status')(),
      hello     = require('./lib/hello')(socket),
      http      = require('./lib/http')(socket),
      target    = require('./lib/target')(socket);

  return {
    start: daemon.start,
    stop: daemon.stop,
    status: status.get,
    sayHello: hello.say,
    startHttp: http.start,
    stopHttp: http.stop,
    listTargets: target.list,
    addTarget: target.add,
    removeTarget: target.remove,
    enableTarget: target.enable,
    disableTarget: target.disable,
    recordingTarget: target.recording,
  };
})();

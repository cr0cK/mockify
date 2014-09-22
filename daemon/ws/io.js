'use strict';

module.exports = (function () {
  var config    = require('../../config/config'),
      wsPort    = config.wsServer.port,
      io        = require('socket.io').listen(wsPort);

  return io;
})();

'use strict';

module.exports = (function () {
  var config    = require('../../config/config'),
      wsPort    = config.wsServer.port,
      // io        = require('socket.io')(wsPort),
      io        = require('socket.io').listen(wsPort),
      Q         = require('q'),
      socket_   ;

  console.log('NEW SOCKET ???');

  return {
    io: io,
    connected: function () {
      var deferred = Q.defer();

      if (socket_) {
        deferred.resolve(socket_);
      } else {
        io.sockets.on('connection', function (socket) {
          socket_ = socket;
          deferred.resolve(socket_);
        });
      }

      return deferred.promise;
    }
  } ;
})();

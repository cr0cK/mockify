'use strict';


module.exports = (function () {
  var pathAbs       = process.env.PWD,
      path          = require('path'),
      spawn         = require('child_process').spawn,
      _             = require('lodash'),
      eventEmitter  = new (require('events').EventEmitter)();

  var childs = {};

  return {
    /**
     * Receive the data from the websocket and handle the proxy child process.
     */
    handleWS: function (data) {
      if (!data.action) {
        console.log('[ws/proxy] Missing action.');
        return;
      }

      var childId = [data.target, data.port].join(':');

      switch (data.action) {
        /**
         * Start the child
         */
        case 'start':
          if (!_.has(childs, childId)) {
            var child = spawn('node', [
              path.join(pathAbs, 'proxy.js'),
              '--target=' + data.target,
              '--port=' + data.port
            ]);

            // send child stdout to an eventEmitter, listened by
            // the main app and forwarded to the browser via websockets
            child.stdout.on('data', function (data) {
              eventEmitter.emit('log', data);
            });

            // save childs
            childs[childId] = child;
          }

          break;

        /**
         * Stop the child.
         */
        case 'stop':
          childs[childId].kill('SIGHUP');
          delete childs[childId];
          eventEmitter.emit('log', 'Process has been killed.');
          break;

        default:
          console.log('[ws/proxy] Invalid action ' + data.action);
          break;
      }
    },

    /**
     * Return the event emitter for logging.
     */
    getEventEmitter: function () {
      return eventEmitter;
    }
  };
})();

'use strict';


module.exports = (function () {
  var pathAbs       = process.env.PWD,
      path          = require('path'),
      spawn         = require('child_process').spawn,
      _             = require('lodash'),
      eventEmitter  = new (require('events').EventEmitter)();

  var childs = {};

  return {
    handleWS: function (data) {
      if (!data.action) {
        console.log('[ws/proxy] Missing action.');
        return;
      }

      switch (data.action) {
        case 'start':
          var key = [data.url, data.port].join(':');

          if (!_.has(childs, key)) {
            var bin = path.join(pathAbs, 'proxy.js');
            // TODO url, port
            var child = spawn('node', [bin]);

            // send child stdout to an eventEmitter, listened by
            // the main app and forwarded to the browser via websockets
            child.stdout.on('data', function (data) {
              eventEmitter.emit('stdout', data);
            });

            childs[key] = child;
          }

          break;

        case 'stop':
          break;

        default:
          console.log('[ws/proxy] Invalid action ' + data.action);
      }
    },

    getEventEmitter: function () {
      return eventEmitter;
    }
  };

})();

'use strict';


module.exports = (function () {
  var path          = require('path'),
      binPath       = path.join(process.env.PWD, 'app', 'bin'),
      spawn         = require('child_process').spawn,
      _             = require('lodash'),
      eventEmitter  = new (require('events').EventEmitter)();

  var childStore = {};

  /**
   * Allows to store spawn objects with additional informations.
   */
  var ChildStorage = function (target, port, child) {
    this._target = target;
    this._port = port;
    this._child = child;
  };

  ChildStorage.prototype = {
    id: function () {
      return [this._target, this._port].join('|');
    },

    target: function () {
      return this._target;
    },

    port: function () {
      return this._port;
    },

    child: function (child) {
      if (child) {
        this._child = child;
      }
      return this._child;
    }
  };

  return {
    /**
     * Receive the data from the websocket and handle the proxy child process.
     */
    handleWS: function (data) {
      if (!data.action) {
        console.log('[ws/proxy] Missing action.');
        return;
      }

      var childStorage = new ChildStorage(data.target, data.port),
          childId = childStorage.id();

      switch (data.action) {
        /**
         * Start the child
         */
        case 'start':
          if (!_.has(childStore, childId)) {
            var spawnedChild = spawn('node', [
              path.join(binPath, 'proxy.js'),
              '--target=' + data.target,
              '--port=' + data.port
            ]);

            // send child stdout to an eventEmitter, listened by
            // the main app and forwarded to the browser via websockets
            spawnedChild.stdout.on('data', function (data) {
              eventEmitter.emit('log', data);
            });

            // save the child in a ChildStorage object
            childStorage.child(spawnedChild);
            childStore[childId] = childStorage;
          }

          break;

        /**
         * Stop the child.
         */
        case 'stop':
          if (_.has(childStore, childId)) {
            childStore[childId].child().kill('SIGHUP');
            delete childStore[childId];
            eventEmitter.emit('log', 'Process has been killed.');
          }
          else {
            eventEmitter.emit('log', 'No process found.');
          }
          break;

        default:
          console.log('[ws/proxy] Invalid action ' + data.action);
          break;
      }
    },

    /**
     * Return the event emitter for logging.
     */
    eventEmitter: function () {
      return eventEmitter;
    },

    /**
     * Return the childStore object (dictionnary of ChildStorage objects)
     */
    childStore: function () {
      return childStore;
    }
  };
})();

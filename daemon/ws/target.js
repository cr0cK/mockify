'use strict';

module.exports = function (rootDir) {
  var _               = require('lodash'),
      _s              = require('underscore.string'),
      Q               = require('q'),
      spawn           = require('child_process').spawn,
      path            = require('path'),
      Target          = require('./../entity/target'),
      targetStorage   = require('./../storage/target'),
      isRunning       = require('is-running'),
      eventEmitter_   = new (require('events').EventEmitter)(),
      proxyChilds     = {},
      mockChilds      = {};

  /**
   * Return the event emitter instance.
   * Used to emit ws on child events.
   * @return {EventEmitter}
   */
  var eventEmitter = function () {
    return eventEmitter_;
  };

  /**
   * Emit a ws with the list of targets.
   */
  var list = function () {
    var deferred = Q.defer();

    targetStorage.list(function (err, targets) {
      if (err) {
        deferred.reject(err);
        return;
      }

      // set the state of the target according to the current process childs
      _.forEach(targets, function (target) {
        var id = target.id();

        // check that the process is still running
        if (_.has(proxyChilds, id) && !isRunning(proxyChilds[id].pid)) {
          delete proxyChilds[id];
        }

        if (_.has(mockChilds, id) && !isRunning(mockChilds[id].pid)) {
          delete mockChilds[id];
        }

        target.proxying(_.has(proxyChilds, id));
        target.mocking(_.has(mockChilds, id));
      });

      deferred.resolve(targets);
    });

    return deferred.promise;
  };

  /**
   * Add a target and emit a ws with the list of targets.
   * @param  {Object} targetProperties
   */
  var add = function (targetProperties) {
    var deferred = Q.defer(),
        target = new Target(targetProperties);

    if (target.isValid()) {
      targetStorage.create(target, function (err) {
        err && deferred.reject(err) || deferred.resolve(list());
      });
    } else {
      deferred.reject('The format of the target is invalid.');
    }

    return deferred.promise;
  };

  /**
   * Disable the target, remove it and emit a ws with the message status
   * @param  {Object} targetProperties
   */
  var remove = function (targetProperties) {
    var deferred = Q.defer();

    targetStorage.remove(new Target(targetProperties), function (err) {
      err && deferred.reject(err) ||
        deferred.resolve('The target has been removed.');
    });

    return deferred.promise;
  };

  /**
   * Disable a target (stop all child processes for this target)
   * @param  {Object} targetProperties
   */
  var disable = function (targetProperties) {
    var deferred = Q.defer();

    targetStorage.get(targetProperties.id, function (err, target) {
      if (err) {
        deferred.reject('This target has not been found.');
        return;
      }

      return _stopChilds(target)
        .then(function () {
          deferred.resolve('The target has been disabled.');
        }, deferred.reject);
    });

    return deferred.promise;
  };

  /**
   * Enable / disable the recording state of the target.
   *
   * Because it's hot to fetch the target when processing the request because
   * of the asynchronous workflow, we restart the proxy when toggling the
   * recording flag. It's simpler.
   *
   * @param  {Object}   Target properties + status (true/false)
   */
  var recording = function (data) {
    var deferred = Q.defer();

    targetStorage.get(data.targetProperties.id, function (err, target) {
      if (err) {
        deferred.reject('This target has not been found.');
        return;
      }

      return _stopChilds(target)
        .then(function () {
          var deferred_ = Q.defer();

          targetStorage.update(target, {recording: data.status},
            function (err, target_) {
              err && deferred_.reject(err);
              deferred_.resolve(target_);
            }
          );

          return deferred_.promise;
        })

        .then(function (target) {
          return _startProxy(target);
        })

        .then(function () {
          var onMsg =
            'The recording of data has been activated on the target.\n' +
            'The proxy has been restarted.';
          var offMsg =
            'The recording of data has been deactivated on the target.\n' +
            'The proxy has been restarted.';
          var msg = data.status ? onMsg : offMsg;

          deferred.resolve(msg);
        })

        .catch(deferred.reject);
    });

    return deferred.promise;
  };

  /**
   * Start the proxy for a target.
   * @param  {Object} targetProperties
   */
  var startProxy = function (targetProperties) {
    var deferred = Q.defer();

    targetStorage.get(targetProperties.id, function (err, target) {
      if (err) {
        deferred.reject('This target has not been found.');
        return;
      }

      _stopChilds(target)
        .then(function () {
          return _startProxy(target);
        })
        .then(deferred.resolve, deferred.reject);
    });

    return deferred.promise;
  };

  /**
   * Start the mock for a target.
   * @param  {Object} targetProperties
   */
  var startMock = function (targetProperties) {
    var deferred = Q.defer();

    targetStorage.get(targetProperties.id, function (err, target) {
      if (err) {
        deferred.reject('This target has not been found.');
        return;
      }

      _stopChilds(target)
        .then(function () {
          return _startMock(target);
        })
        .then(deferred.resolve, deferred.reject);
    });

    return deferred.promise;
  };

  /**
   * Stop all childs (mocks or proxies).
   * @param  {Target} Target
   */
  var _stopChilds = function (target) {
    var promises = [];

    var childs = [proxyChilds[target.id()], mockChilds[target.id()]];

    delete proxyChilds[target.id()];
    delete mockChilds[target.id()];

    _.forEach(childs, function (child) {
      var deferred = Q.defer();

      promises.push(deferred);

      if (child && !child.killed) {
        child.kill('SIGHUP');
        child.on('exit', function () {
          deferred.resolve(target);
        });
      } else {
        deferred.resolve(target);
      }
    });

    return Q.all(promises);
  };

  /**
   * Start the proxy of a target.
   * @param  {Target} Target
   */
  var _startProxy = function (target) {
    var deferred = Q.defer(),
        proxyBinPath = path.join(rootDir, 'bin', 'proxy.js');

    proxyChilds[target.id()] = spawn('node', [
      path.join(proxyBinPath),
      '--targetId=' + target.id()
    ]);

    proxyChilds[target.id()].stdout.on('data', function (data) {
      var message = data.toString('utf8');

      deferred.resolve(message);

      var event_ = _extractEvent(data);
      if (event_) {
        eventEmitter().emit(event_, {
          source: 'proxy',
          type: 'info',
          message: _removeLogPrefix(message)
        });
      }
    });

    proxyChilds[target.id()].stderr.on('data', function (data) {
      deferred.reject(data.toString('utf8'));
      eventEmitter().emit('proxyError', {
        source: 'proxy',
        type: 'error',
        message: _removeLogPrefix(data.toString('utf8'))
      });
    });

    return deferred.promise;
  };

  /**
   * Start the mock of a target.
   * @param  {Target} Target
   */
  var _startMock = function (target) {
    var deferred = Q.defer(),
        mockBinPath = path.join(rootDir, 'bin', 'mock.js');

    mockChilds[target.id()] = spawn('node', [
      path.join(mockBinPath),
      '--targetId=' + target.id()
    ]);

    mockChilds[target.id()].stdout.on('data', function (data) {
      var message = data.toString('utf8');

      deferred.resolve(message);

      var event_ = _extractEvent(data);
      if (event_) {
        eventEmitter().emit(event_, {
          source: 'mock',
          type: 'info',
          message: _removeLogPrefix(message)
        });
      }
    });

    mockChilds[target.id()].stderr.on('data', function (data) {
      deferred.reject(data.toString('utf8'));
      eventEmitter().emit('mockError', {
        source: 'mock',
        type: 'error',
        message: _removeLogPrefix(data.toString('utf8'))
      });
    });

    return deferred.promise;
  };

  /**
   * Extract the event name from the prefix of the child log message.
   * @return {String}   The event name
   */
  var _extractEvent = function (data) {
    var str = data.toString('utf8'),
        matches = str.match(/\[([^-]+)-([^\]]+)\]/),
        who = matches.length === 3 && matches[1],
        what = matches.length === 3 && matches[2];

    return who && what && who + _s.capitalize(what);
  };

  /**
   * Remove the prefix of log messages (example: '[mock-response]'')
   * @param  {String} message
   * @return {String}
   */
  var _removeLogPrefix = function (message) {
    return message.replace(/^\[.+\]\s*/, '');
  };

  return {
    eventEmitter: eventEmitter,
    list: list,
    add: add,
    remove: remove,
    disable: disable,
    recording: recording,
    startProxy: startProxy,
    startMock: startMock
  };
};

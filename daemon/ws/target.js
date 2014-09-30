'use strict';

module.exports = function (rootDir) {
  var _               = require('lodash'),
      _s              = require('underscore.string'),
      Q               = require('q'),
      spawn           = require('child_process').spawn,
      path            = require('path'),
      Target          = require('./../entity/target'),
      targetStorage   = require('./../storage/target'),
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
        target.proxying(_.has(proxyChilds, id));
        target.mocking(_.has(mockChilds, id));
      });

      deferred.resolve(targets);
    });

    return deferred.promise;
  };

  /**
   * Add a target and emit a ws with the list of targets.
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
   * Enable the target (start the proxy).
   */
  var enable = function (targetProperties) {
    var deferred = Q.defer(),
        proxyBinPath = path.join(rootDir, 'bin', 'proxy.js');

    targetStorage.get(targetProperties.id, function (err, target) {
      if (err) {
        deferred.reject('This target has not been found.');
        return;
      }

      proxyChilds[target.id()] = spawn('node', [
        path.join(proxyBinPath),
        '--targetId=' + target.id()
      ]);

      proxyChilds[target.id()].stdout.on('data', function (data) {
        var str = data.toString('utf8'),
            matches = str.match(/\[([^-]+)-([^\]]+)\]/),
            who = matches.length === 3 && matches[1],
            what = matches.length === 3 && matches[2],
            event_ = who && what && who + _s.capitalize(what);

        deferred.resolve(str);

        if (event_) {
          eventEmitter().emit(event_, str);
        }
      });

      proxyChilds[target.id()].stderr.on('data', function (data) {
        deferred.reject(data.toString('utf8'));
        eventEmitter().emit('childStderr', data.toString('utf8'));
      });
    });

    return deferred.promise;
  };

  /**
   * Disable a target (stop all child processes for this target)
   * @param  {Integer}   targetId
   */
  var disable = function (targetProperties) {
    var deferred = Q.defer();

    targetStorage.get(targetProperties.id, function (err, target) {
      if (err) {
        deferred.reject('This target has not been found.');
        return;
      }

      var childs = [proxyChilds[target.id()], mockChilds[target.id()]],
          resolve = function (target) {
            delete proxyChilds[target.id()];
            delete mockChilds[target.id()];
            deferred.resolve('The target has been disabled.');
          };

      _.forEach(childs, function (child) {
        if (child && !child.killed) {
          child.kill('SIGHUP');
          child.on('exit', function () {
            resolve(target);
          });
        } else {
          resolve(target);
        }
      });
    });

    return deferred.promise;
  };

  /**
   * Enable / disable the recording state of the target.
   * @param  {Integer}   targetId
   */
  var recording = function (data) {
    var deferred = Q.defer();

    targetStorage.get(data.targetProperties.id, function (err, target) {
      if (err) {
        deferred.reject('This target has not been found.');
        return;
      }

      targetStorage.update(target, {recording: data.status},
        function (err, target_) {
          err && deferred.reject(err);
          var msg = target_.recording() ?
            'The proxy is recording data right now.' :
            'The proxy has stopped recording data.';
          deferred.resolve(msg);
        }
      );
    });

    return deferred.promise;
  };

  return {
    eventEmitter: eventEmitter,
    list: list,
    add: add,
    remove: remove,
    enable: enable,
    disable: disable,
    recording: recording
  };
};

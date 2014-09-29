'use strict';

module.exports = function (rootDir) {
  var _               = require('lodash'),
      Q               = require('q'),
      spawn           = require('child_process').spawn,
      path            = require('path'),
      Target          = require('./../entity/target'),
      targetStorage   = require('./../storage/target'),
      proxyChilds     = {},
      mockChilds      = {};

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

      return _stopChilds(target).then(function () {
        deferred.resolve('The target has been disabled.');
      }, deferred.reject);
    });

    return deferred.promise;
  };

  /**
   * Enable / disable the recording state of the target.
   * @param  {Object}   Target properties + status (true/false)
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

  /**
   * Start a proxy for a target.
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
        .then(_startProxy)
        .then(deferred.resolve, deferred.reject);
    });

    return deferred.promise;
  };

  /**
   * Stop all childs (mocks or proxies).
   * @param  {Target} Target
   */
  var _stopChilds = function (target) {
    var deferred = Q.defer();

    var childs = [proxyChilds[target.id()], mockChilds[target.id()]],
        resolve = function (target) {
          delete proxyChilds[target.id()];
          delete mockChilds[target.id()];
          deferred.resolve(target);
        };

    if (!childs.length) {
      deferred.resolve(target);
    }

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

    return deferred.promise;
  };

  /**
   * Start a proxy for a target.
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
      deferred.resolve(data.toString('utf8'));
    });

    proxyChilds[target.id()].stderr.on('data', function (data) {
      deferred.reject(data.toString('utf8'));
    });

    return deferred.promise;
  };

  return {
    list: list,
    add: add,
    remove: remove,
    disable: disable,
    recording: recording,
    startProxy: startProxy
  };
};

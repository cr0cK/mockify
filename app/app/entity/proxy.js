'use strict';

module.exports = (function () {
  var _             = require('../lib/helper')._,
      path          = require('path'),
      spawn         = require('child_process').spawn,
      // running       = require('is-running'),
      binPath       = path.join(process.env.PWD, 'app', 'bin'),
      db            = require('./../lib/db'),
      eventEmitter_ = new (require('events').EventEmitter)();

  var Proxy = function (properties) {
    this._id =
    this._port =
    this._target =
    this._status =
    this._isRecording =
    this._isMocked =
    this._isDisabled =
    this._child;

    _.privateMerge(this, properties);
  };

  /**
   * Add a proxy in DB.
   */
  Proxy.prototype.add = function (callback) {
    db.model('Proxy').create([_.publicProperties(this)], function (err) {
      callback(err);
    });
  };

  /**
   * Remove a proxy from DB.
   */
  Proxy.prototype.remove = function (callback) {
    db.model('Proxy').find({id: this._id}).remove(function (err) {
      callback(err);
    });
  };

  /**
   * Start a child process.
   */
  Proxy.prototype.start = function () {
    var self = this;

    this._child = spawn('node', [
      path.join(binPath, 'proxy.js'),
      '--target=' + this.target,
      '--port=' + this.port
    ]);

    // log stdout
    this._child.stdout.on('data', function (data) {
      self._log(data);
    });
  };

  /**
   * Stop the child process.
   */
  Proxy.prototype.stop = function () {
    if (this._child) {
      this._child.kill('SIGHUP');
      this._log('Proxy has been killed.');
    }
    else {
      this._log('No process has been found.');
    }
  };

  /**
   * Start the mock for this proxy.
   * The proxy child is stopped and the mock child is started on the same port.
   */
  Proxy.prototype.mock = function () {
    console.log('mock!!');
  };

  /**
   * Disable/enable the recording for the proxy.
   */
  Proxy.prototype.toggleRecording = function (callback) {
    var self = this;
    db.model('Proxy').get(this._id, function (err, Proxy) {
      Proxy.isRecording = self._isRecording;
      Proxy.save(function (err) {
        callback(err);
      });
    });
  };

  /**
   * Disable/enable the proxy.
   */
  Proxy.prototype.toggleDisable = function (callback) {
    var self = this;
    db.model('Proxy').get(this._id, function (err, Proxy) {
      Proxy.isDisabled = self._isDisabled;
      Proxy.save(function (err) {
        callback(err);
      });
    });
  };

  /**
   * Emit an event for logging.
   */
  Proxy.prototype._log = function (message) {
    eventEmitter_.emit('log', message);
  };

  /**
   * Return the event emitter for the outside communication.
   */
  Proxy.eventEmitter = function () {
    return eventEmitter_;
  };

  /**
   * List all proxies from DB.
   */
  Proxy.list = function (callback) {
    db.model('Proxy').find({}, function (err, proxies) {
      callback(err, _.map(proxies, function (properties) {
        return new Proxy(properties);
      }));
    });
  };

  return Proxy;
})();

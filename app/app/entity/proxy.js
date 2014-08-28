'use strict';

var Proxy_ = (function () {
  var _             = require('lodash'),
      path          = require('path'),
      spawn         = require('child_process').spawn,
      binPath       = path.join(process.env.PWD, 'app', 'bin'),
      db            = require('./../lib/db'),
      eventEmitter_ = new (require('events').EventEmitter)();

  var Proxy = function (properties) {
    this.id =
    this.port =
    this.target =
    this.status =
    this._child = undefined;

    _.merge(this, properties);
  };

  /**
   * Add a proxy in DB.
   */
  Proxy.prototype.add = function (callback) {
    db.model('Proxy').create([this], function (err) {
      callback(err);
    });
  };

  /**
   * Remove a proxy from DB.
   */
  Proxy.prototype.remove = function (callback) {
    db.model('Proxy').find({id: this.id}).remove(function (err) {
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

module.exports = Proxy_;

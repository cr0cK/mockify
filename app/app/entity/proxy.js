'use strict';

module.exports = (function () {
  var _             = require('../lib/helper')._,
      path          = require('path'),
      spawn         = require('child_process').spawn,
      // running       = require('is-running'),
      binPath       = path.join(process.env.PWD, 'app', 'bin'),
      db            = require('./../lib/db'),
      eventEmitter_ = new (require('events').EventEmitter)(),
      proxyChilds   = {},
      mockChilds    = {};

  var Proxy = function (properties) {
    this._id =
    this._port =
    this._target =
    this._status =
    this._isRecording =
    this._isMocked =
    this._isDisabled;

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
   * Start the proxy.
   */
  Proxy.prototype.startProxy = function () {
    var self = this;

    proxyChilds[this._id] = spawn('node', [
      path.join(binPath, 'proxy.js'),
      '--target=' + this._target,
      '--port=' + this._port,
      '--proxyId=' + this._id
    ]);

    proxyChilds[this._id].on('message', function () {
      console.log('message', arguments);
    });

    proxyChilds[this._id].on('exit', function () {
      console.log('exit', arguments);
      delete proxyChilds[this._id];
      self._log('Proxy has been killed.');
    });

    proxyChilds[this._id].on('error', function () {
      console.log('error', arguments);
    });

    console.log(proxyChilds[this._id].pid);

    // log stdout
    proxyChilds[this._id].stdout.on('data', function (data) {
      self._log(data);
    });

    // log stderr
    proxyChilds[this._id].stderr.on('data', function (data) {
      var message = 'Unknow error';
      var matches = data.toString('utf8')
          .split('\n').join(', ')
          .match(/(Error.*),/);

      if (_.isArray(matches) && matches.length > 2) {
        message = matches[1];
      }

      console.log('errorstderr', message);
      self._log(message, 'error');
    });
  };

  /**
   * Start the mock
   */
  Proxy.prototype.startMock = function () {
    var self = this;

    mockChilds[this._id] = spawn('node', [
      path.join(binPath, 'mock.js'),
      '--port=' + this._port,
      '--proxyId=' + this._id
    ]);

    // log stdout
    mockChilds[this._id].stdout.on('data', function (data) {
      self._log(data);
    });
  };

  /**
   * Stop the child process.
   */
  Proxy.prototype.stopProxy = function () {
    var self = this;

    if (proxyChilds[this._id]) {
      proxyChilds[this._id].kill('SIGHUP');
    }
    else {
      this._log('No process has been found.');
    }
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
   * Disable/enable the mock for the proxy.
   */
  Proxy.prototype.toggleMock = function (callback) {
    var self = this;

    if (this._isMocked) {
      this.startProxy();
    }
    else {
      this.stopProxy();
    }

    // db.model('Proxy').get(this._id, function (err, Proxy) {
    //   Proxy.isRecording = self._isRecording;
    //   Proxy.save(function (err) {
    //     callback(err);
    //   });
    // });
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
   * @param  {String|Buffer} message   Message
   * @param  {String} type      A choice between ['info', 'error']
   */
  Proxy.prototype._log = function (message, type) {
    if (message instanceof Buffer) {
      message = message.toString('utf8');
    }

    eventEmitter_.emit('log', {
      message: message,
      type: (type || 'info')
    });
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

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
    var self = this;

    this._id =
    this._port =
    this._target =
    this._status =
    this._isRecording;

    _.privateMerge(this, properties);

    // set to true if some childs are started
    this._isRunning = _.has(proxyChilds, this._id);
    this._isMocked = _.has(mockChilds, this._id);

    // disable the proxy if no proxy or mocked is running
    this._isDisabled = !this._isRunning && !this._isMocked;

    // update the disable flag in DB
    db.model('Proxy').get(this._id, function (err, Proxy) {
      Proxy.isDisabled = self._isDisabled;
      Proxy.save(db.log);
    });
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
    proxyChilds[this._id] = spawn('node', [
      path.join(binPath, 'proxy.js'),
      '--target=' + this._target,
      '--port=' + this._port,
      '--proxyId=' + this._id
    ]);

    this.bindEvent('Proxy', proxyChilds[this._id], proxyChilds);
  };

  /**
   * Stop the child process.
   */
  Proxy.prototype.stopProxy = function (callback) {
    if (proxyChilds[this._id]) {
      proxyChilds[this._id].kill('SIGHUP');
      if (callback) {
        proxyChilds[this._id].on('exit', callback);
      }
    }
  };

  /**
   * Start the mock
   */
  Proxy.prototype.startMock = function () {
    mockChilds[this._id] = spawn('node', [
      path.join(binPath, 'mock.js'),
      '--port=' + this._port,
      '--proxyId=' + this._id
    ]);

    this.bindEvent('Mock', mockChilds[this._id], mockChilds);
  };

  /**
   * Stop the child process.
   */
  Proxy.prototype.stopMock = function (callback) {
    if (mockChilds[this._id]) {
      mockChilds[this._id].kill('SIGHUP');
      if (callback) {
        mockChilds[this._id].on('exit', callback);
      }
    }
  };

  /**
   * Bind child events to websocket / logging.
   */
  Proxy.prototype.bindEvent = function (label, child, store) {
    var self = this;

    console.log(label + ' PID', child.pid);

    child.on('exit', function () {
      console.log('exit', arguments);
      delete store[self._id];
      self._log(label + ' has been stopped.');
    });

    child.on('error', function () {
      console.log('error', arguments);
    });

    // log stdout
    child.stdout.on('data', function (data) {
      self._log(data);
    });

    // log stderr
    child.stderr.on('data', function (data) {
      var message = data.toString('utf8');

      console.log(label + ' stderr', message);
      self._log(message, 'error');
    });
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
  Proxy.prototype.toggleMock = function () {
    var self = this;

    if (this._isMocked) {
      this.stopMock(function () {
        self.startProxy();
      });
    }

    if (this._isRunning) {
      this.stopProxy(function () {
        self.startMock();
      });
    }
  };

  /**
   * Disable/enable the proxy.
   */
  Proxy.prototype.toggleDisable = function (callback) {
    var self = this;

    db.model('Proxy').get(this._id, function (err, Proxy) {
      Proxy.isDisabled = self._isDisabled;

      // when enabling the Proxy, we don't run the proxy by default,
      // we run the mock => the proxy is "mocked" by default.
      if (Proxy.isDisabled) {
        self.startMock();
      } else {
        // when disabling the Proxy, we stop all
        self.stopProxy();
        self.stopMock();
      }

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

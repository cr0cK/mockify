'use strict';

module.exports = (function () {
  var _             = require('../lib/helper')._,
      Q             = require('q'),
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

    // enable the proxy if proxy or mock is running
    this._isEnabled = this._isRunning || this._isMocked;

    // update the disable flag in DB
    db.model('Proxy').get(this._id, function (err, Proxy) {
      if (Proxy) {
        Proxy.isEnabled = self._isEnabled;
        Proxy.save(db.log);
      }
    });
  };

  /**
   * Add a proxy in DB.
   */
  Proxy.prototype.add = function (callback) {
    db.model('Proxy').create([_.publicProperties(this)], callback);
  };

  /**
   * Stop all child processes and remove a proxy from DB.
   */
  Proxy.prototype.remove = function (callback) {
    var self = this;

    this.stopAll().then(function () {
      db.model('Proxy').find({id: self._id}).remove(function (err) {
        callback(err);
      });
    })
    .catch(function (error) {
      this._logError(error);
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

    this.bindEvent('Proxy', proxyChilds, this._id);
  };

  /**
   * Stop the child process.
   */
  Proxy.prototype.stopProxy = function () {
    var deferred = Q.defer();

    if (proxyChilds[this._id]) {
      proxyChilds[this._id].kill('SIGHUP');
      proxyChilds[this._id].on('exit', function () {
        deferred.resolve();
      });
    }

    return deferred.promise;
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

    this.bindEvent('Mock', mockChilds, this._id);
  };

  /**
   * Stop the child process.
   */
  Proxy.prototype.stopMock = function () {
    var deferred = Q.defer();

    if (mockChilds[this._id]) {
      mockChilds[this._id].kill('SIGHUP');
      mockChilds[this._id].on('exit', function () {
        deferred.resolve();
      });
    }

    return deferred.promise;
  };

  /**
   * Stop all processes.
   */
  Proxy.prototype.stopAll = function () {
    var promises = [];

    if (this._isMocked) {
      promises.push(this.stopMock());
    }

    if (this._isRunning) {
      promises.push(this.stopProxy());
    }

    return Q.all(promises);
  };

  /**
   * Bind child events to websocket / logging.
   */
  Proxy.prototype.bindEvent = function (label, childs, id) {
    var self = this,
        child = childs[id];

    console.log(label + ' PID', child.pid);

    child.on('exit', function () {
      delete childs[self._id];
      self['_log' + label](label + ' has been stopped.');
    });

    child.on('error', function () {
      console.log('error', arguments);
    });

    // log stdout
    child.stdout.on('data', function (data) {
      self['_log' + label](data);
    });

    // log stderr
    child.stderr.on('data', function (data) {
      self['_log' + label](data, 'error');
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
      this.stopMock().then(function () {
        self.startProxy();
      });
    }

    if (this._isRunning) {
      this.stopProxy().then(function () {
        self.startMock();
      });
    }
  };

  /**
   * Enable/disable the proxy.
   */
  Proxy.prototype.toggleEnable = function (callback) {
    var self = this;

    db.model('Proxy').get(this._id, function (err, Proxy) {
      Proxy.isEnabled = self._isEnabled;

      // when adding a proxy, we don't run the proxy by default,
      // we run the mock => the proxy is "mocked" by default.
      if (!Proxy.isEnabled) {
        self.startMock();
      } else {
        // when disabling the Proxy, we stop all
        self.stopAll();
      }

      Proxy.save(function (err) {
        callback(err);
      });
    });
  };

  /**
   * Log proxy event.
   */
  Proxy.prototype._logProxy = function (message, type) {
    this._log(message, type || 'infoProxy');
  };

  /**
   * Log mock event.
   */
  Proxy.prototype._logMock = function (message, type) {
    this._log(message, type || 'infoMock');
  };

  /**
   * Log error.
   * Prefix the message by "Error:" to pass the filter in Angular.
   * See LogsCtrl.
   */
  Proxy.prototype._logError = function (message) {
    this._log('Error: ' + message, 'error');
  };

  /**
   * Emit an event for mock logging.
   * @param  {String|Buffer}  message   Message
   * @param  {String}         type      A choice between ['info', 'error']
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

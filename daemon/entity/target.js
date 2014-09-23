'use strict';

module.exports = (function () {
  var _             = require('../lib/helper')._;

  var Target = function (properties) {
    // var self = this;

    this._id =
    this._port =
    this._url =
    this._isRecording;

    _.privateMerge(this, properties);

    // // set to true if some childs are started
    // this._isRunning = _.has(proxyChilds, this._id);
    // this._isMocked = _.has(mockChilds, this._id);

    // // enable the proxy if proxy or mock is running
    // this._isEnabled = this._isRunning || this._isMocked;

    // // update the disable flag in DB
    // db.model('Proxy').get(this._id, function (err, Proxy) {
    //   if (Proxy) {
    //     Proxy.isEnabled = self._isEnabled;
    //     Proxy.save(db.log);
    //   }
    // });
  };

  Target.prototype.id = function () {
    return this._id;
  };

  return Target;

})();

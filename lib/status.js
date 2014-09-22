'use strict';

module.exports = function () {
  var Q         = require('q'),
      forever   = require('forever');

  /**
   * Display a nice output with forever current running daemons.
   */
  var get = function () {
    var deferred = Q.defer();

    forever.list(true, function (err, daemons) {
      if (!err && !daemons) {
        err = {message: 'No daemon is running.'};
      }

      err && deferred.reject(err) || deferred.resolve(daemons);
    });

    return deferred.promise;
  };

  return {
    get: get
  };
};

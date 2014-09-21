'use strict';

module.exports = (function () {
  var db    = require('./../lib/db'),
      _     = require('./../lib/helper')._;

  return {
    /**
     * Create a target in database.
     */
    create: function (target, callback) {
      db.model('Target').create([_.publicProperties(target)], callback);
    }
  };
})();

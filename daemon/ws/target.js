'use strict';

module.exports = (function () {
  var //Q               = require('q'),
      Target          = require('./../entity/target'),
      targetStorage   = require('./../storage/target'),
      alert           = require('./alert');

  /**
   * Add a target.
   */
  var add = function (targetData) {
    var target = new Target(targetData);

    targetStorage.create(target, function (err, record) {
      alert.error('ceci est un test');
      console.log(err, record);
    });

    // console.log(target, targetStorage);

    // Q.nfcall(targetStorage, 'create', target).then(function (record) {
    //   console.log('recorded!', record);
    //   // emitListProxies();
    // }).catch(function (err) {
    //   console.log('not recorded', err);
    // });
  };

  return {
    add: add
  };
})();

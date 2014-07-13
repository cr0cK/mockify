/* global module */

var settings = (function () {
  'use strict';

  var moduleName = 'hostingstats';

  return {
    buildDir: './build',
    vendorFiles: [
      './public/vendor/jquery/dist/jquery.min.js'
    ]
  };

})();

module.exports = settings;

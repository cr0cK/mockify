/* jshint maxlen:100 */

'use strict';

var settings = (function () {
  return {
    appName: 'procKr',
    buildDir: 'express/build/static',
    serverFiles: [
      'app/**/*.js'
    ],
    vendorFiles: [
      'www/vendor/jquery/dist/jquery.min.js',
      'www/vendor/angular/angular.js',
      'www/vendor/socket.io-client/socket.io.js',
      'www/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'www/vendor/angular-ui-router/release/angular-ui-router.js',
      'www/vendor/angular-bootstrap-toggle-switch/angular-toggle-switch.js',
      'www/vendor/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
      'www/vendor/perfect-scrollbar/min/perfect-scrollbar.with-mousewheel.min.js',
      'www/vendor/lodash/dist/lodash.js',
      'www/vendor/underscore.string/lib/underscore.string.js'
    ]
  };

})();

module.exports = settings;

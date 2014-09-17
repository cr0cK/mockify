/* jshint maxlen:100 */

'use strict';

var settings = (function () {
  return {
    appName: 'procKr',
    buildDir: './www/build',
    serverFiles: [
      'app/**/*.js'
    ],
    vendorFiles: [
      './vendor/jquery/dist/jquery.min.js',
      './vendor/angular/angular.js',
      './vendor/socket.io-client/socket.io.js',
      './vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      './vendor/angular-ui-router/release/angular-ui-router.js',
      './vendor/angular-bootstrap-toggle-switch/angular-toggle-switch.js',
      './vendor/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
      './vendor/perfect-scrollbar/min/perfect-scrollbar.with-mousewheel.min.js',
      './vendor/moment.js',
      './vendor/lodash/dist/lodash.js',
      './vendor/lodash/dist/lodash.js',
      './vendor/underscore.string/lib/underscore.string.js'
    ]
  };

})();

module.exports = settings;

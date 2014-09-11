/* jshint maxlen:100 */

'use strict';

var settings = (function () {
  return {
    appName: 'procKr',
    buildDir: './build/static',
    serverFiles: [
      'app/**/*.js'
    ],
    vendorFiles: [
      './public/vendor/jquery/dist/jquery.min.js',
      './public/vendor/angular/angular.js',
      './public/vendor/socket.io-client/socket.io.js',
      './public/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      './public/vendor/angular-ui-router/release/angular-ui-router.js',
      './public/vendor/angular-bootstrap-toggle-switch/angular-toggle-switch.js',
      './public/vendor/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
      './public/vendor/perfect-scrollbar/min/perfect-scrollbar.with-mousewheel.min.js',
      './public/vendor/moment.js',
      './public/vendor/lodash/dist/lodash.js',
      './public/vendor/lodash/dist/lodash.js',
      './public/vendor/underscore.string/lib/underscore.string.js'
    ]
  };

})();

module.exports = settings;

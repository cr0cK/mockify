/* global module */

'use strict';

var settings = (function () {
  return {
    appName: 'mocKr',
    buildDir: './build/static',
    serverFiles: [
      'app/controllers/**/*.js', 'app/routes/**/*.js',
      'app.js', 'config.js'
    ],
    vendorFiles: [
      './public/vendor/jquery/dist/jquery.min.js',
      './public/vendor/angular/angular.js',
      './public/vendor/socket.io-client/socket.io.js',
      './public/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      './public/vendor/angular-ui-router/release/angular-ui-router.js',
      './public/vendor/moment.js',
      './public/vendor/lodash/dist/lodash.js',
      './public/vendor/lodash/dist/lodash.js',
      './public/vendor/underscore.string/lib/underscore.string.js'
    ]
  };

})();

module.exports = settings;

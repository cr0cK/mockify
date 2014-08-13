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
      './public/vendor/angular/angular.min.js',
      './public/vendor/socket.io-client/socket.io.js',
      './public/vendor/angular-ui-router/release/angular-ui-router.min.js'
    ]
  };

})();

module.exports = settings;
/* global module */

var settings = (function () {
  'use strict';

  return {
    appName: 'mocKr',
    buildDir: './build/static',
    serverFiles: [
      'controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js',
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

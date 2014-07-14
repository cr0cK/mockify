/* global module */

var settings = (function () {
  'use strict';

  return {
    appName: 'mocKr',
    buildDir: './build',
    binDir: './bin',
    serverFiles: [
      'controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js',
      'app.js', 'config.js'
    ],
    vendorFiles: [
      './public/vendor/jquery/dist/jquery.min.js'
    ]
  };

})();

module.exports = settings;

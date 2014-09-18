module.exports = (function () {
  'use strict';

  var config = {
    development: {
      daemon: {
        port: 5000
      },
      wsServer: {
        port: 5001
      },
      web: {
        port: 3000
      }
    },
    testing: {
      daemon: {
        port: 5000
      },
      wsServer: {
        port: 5001
      },
      web: {
        port: 3000
      }
    },
    production: {
      daemon: {
        port: 5000
      },
      wsServer: {
        port: 5001
      },
      web: {
        port: 3000
      }
    }
  };

  return config[process.env.NODE_ENV || 'development'];
})();

module.exports = (function () {
  'use strict';

  var config = {
    development: {
      server: {
        port: 3000
      },
      wsapp: {
        port: 3334
      }
    },
    testing: {
      server: {
        port: 3001
      },
      wsapp: {
        port: 3334
      }
    },
    production: {
      server: {
        port: 8080
      },
      wsapp: {
        port: 3334
      }
    }
  };

  return config[process.env.NODE_ENV || 'development'];
})();

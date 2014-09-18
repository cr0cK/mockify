module.exports = (function () {
  'use strict';

  var config = {
    development: {
      daemon: {
        port: 5555
      },
      wsapp: {
        port: 3334
      }
    },
    testing: {
      daemon: {
        port: 5556
      },
      wsapp: {
        port: 3334
      }
    },
    production: {
      daemon: {
        port: 8055
      },
      wsapp: {
        port: 3334
      }
    }
  };

  return config[process.env.NODE_ENV || 'development'];
})();

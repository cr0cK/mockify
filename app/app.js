'use strict';

var mainApp = require('./app/main'),
    wsApp = require('./app/ws');

mainApp.run();
wsApp.run();

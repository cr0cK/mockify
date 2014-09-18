'use strict';

var mainApp = require('./main')(),
    server  = require('http').Server(mainApp),
    port = process.env.PORT || require('../config/config').web.port;

server.listen(port);

console.log('Webapp listening on port %s', port);

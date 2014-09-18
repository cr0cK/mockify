'use strict';

var mainApp = require('./main')(),
    server  = require('http').Server(mainApp),
    port = process.env.PORT || require('../config/config').web.port;

server.listen(port);

console.log('The http server is listening on port %s.', port);

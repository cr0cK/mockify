'use strict';

var mainApp = require('./app/main')(),
    server  = require('http').Server(mainApp),
    port = process.env.PORT || require('./app/config').server.port;

require('./app/ws')(server);

server.listen(port);
console.log('application listening on port %s', port);

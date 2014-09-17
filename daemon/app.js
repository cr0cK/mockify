'use strict';

module.exports = (function () {

  var http = require('http');

  var app = http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('testing. . .\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');

  var io = require('socket.io')(app);

  io.on('connection', function (socket) {
    socket.emit('hello', { message: 'Hi! This is procKr daemon.' });

    // socket.on('my other event', function (data) {
    //   console.log(data);
    // });
  });
})();

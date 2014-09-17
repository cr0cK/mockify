#!/usr/bin/env node

'use strict';

var fs        = require('fs'),
    program   = require('commander'),
    config    = require('./app/config'),
    log       = function () {
      console.log.apply(this, arguments);
    };

/**
 * Start the procKr webapp.
 */
var start = function (port) {
  var mainApp = require('./app/main')(),
      server  = require('http').Server(mainApp);

  require('./app/ws')(server);

  port = port || config.server.port;
  server.listen(port);

  log('procKr webapp is listening on port %s.', port);
};

/**
 * Handle argv options.
 */
program
  .version(JSON.parse(fs.readFileSync('package.json')).version);

program
  .command('start [port]')
  .description('Start the webapp. Use the port 3000 by default.')
  .action(start);

program
 .command('proxy-list')
 .description('List registered proxies.')
 .action(function () {
   console.log('list proxies');
 });

program.command('proxy-add <port> <target>')
 .description('Add a proxy which will listen on the port <port> and will ' +
    'serve the target <target>.')
 .action(function () {
   console.log('add proxy', arguments);
 });

program.parse(process.argv);

if (!program.args.length) {
  log( program.helpInformation() );
  process.exit();
}


// var Table = require('cli-table');

// // instantiate
// var table = new Table({
//   head: ['port', 'target', 'rec.', 'status', 'id', 'enable'],
//   style: {
//     head: ['cyan']
//   }
// });

// // table is an Array, so you can `push`, `unshift`, `splice` and friends
// table.push(
//   ['First value', 'Second value'],
//   ['First value', 'Second value']
// );

// console.log(table.toString());

#!/usr/bin/env node

'use strict';

var fs        = require('fs'),
    program   = require('commander'),
    config    = require('./app/config'),
    db        = require('./app/lib/db'),
    proxy     = require('./app/entity/proxy'),
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
    db.whenReady().then(function () {
      proxy.list(function (err, proxies) {
        // console.log(proxies);
        //
        // var io = require('socket.io');

        // io.emit()

        //
        //
        // var Table   = require('cli-table');
        // var _       = require('./app/lib/helper')._;

        // if (!proxies.length) {
        //   return;
        // }

        // var table = new Table({
        //   head: _.keys(_.publicProperties(_.first(proxies))),
        //   style: {head: ['cyan']}
        // });

        // console.log(proxies[0]._isRecording);

        // _.forEach(proxies, function (proxy) {
        //   proxy = _.publicProperties(proxy);

        //   var values = _.map(_.values(proxy), function (value) {
        //     // console.log(value);
        //     return value || false;
        //   });

        //   table.push(values);
        // });

        // log(table.toString());
      });
    });
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

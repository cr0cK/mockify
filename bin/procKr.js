#!/usr/bin/env node

/**
 * The file is the procKr cli.
 *
 * Usage examples:
 * $ procKr start
 * $ procKr add-target 4000 http://jsonplaceholder.typicode.com jsonplaceholder
 * $ procKr enable-target jsonplaceholder
 * $ procKr mock-target jsonplaceholder
 *
 * See README.md for more informations.
 */

'use strict';

var program   = require('commander');

var //fs        = require('fs'),
    program   = require('commander'),
    procKr    = require('procKr'),
    log       = function () {
      console.log.apply(this, arguments);
    };


/**
 * Handle argv options.
 */
// @FIxME
// program.version(JSON.parse(fs.readFileSync('package.json')).version);
program.version('0.0.1');

program
  .command('start [port]')
  .description('Start the daemon. Use the port 5555 by default.')
  .action(procKr.start);

program
  .command('stop')
  .description('Stop procKr daemon.')
  .action(procKr.stop);

program
  .command('status')
  .description('Check procKr status.')
  .action(procKr.status);

program.parse(process.argv);

if (!program.args.length) {
  log( program.helpInformation() );
  process.exit();
}

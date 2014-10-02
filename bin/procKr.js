#!/usr/bin/env node

/**
 * This file is the procKr cli.
 *
 * Usage examples:
 * $ procKr start
 * $ procKr add-target 4000 http://jsonplaceholder.typicode.com jsonplaceholder
 * $ procKr list-targets
 * $ procKr enable-target jsonplaceholder
 * $ procKr mock-target jsonplaceholder
 *
 * See README.md for more informations.
 */

'use strict';

var program   = require('commander');

var //fs        = require('fs'),
    program      = require('commander'),
    procKr       = require('../procKr'),
    logHdlr      = require('./handler/log')(),
    alertHdlr    = require('./handler/alert')(),
    targetHdlr   = require('./handler/target')(),
    log          = function () { console.log.apply(this, arguments); };

// @FIXME
// program.version(JSON.parse(fs.readFileSync('package.json')).version);
program.version('0.0.1');

program
  .command('start')
  .description('Start the daemon.')
  .action(function () {
    procKr.start()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('stop')
  .description('Stop procKr daemon.')
  .action(function () {
    procKr.stop()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('status')
  .description('Check procKr status.')
  .action(function () {
    procKr.status()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('hello')
  .description('Say hello to procKr to test websocket connexion.')
  .action(function () {
    procKr.sayHello()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('start-http')
  .description('Start the procKr http server.')
  .action(function () {
    procKr.startHttp()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('stop-http')
  .description('Stop the procKr http server.')
  .action(function () {
    procKr.stopHttp()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('list-targets')
  .description('List the targets.')
  .action(function () {
    procKr.listTargets()
      .then(targetHdlr.list, alertHdlr.error)
      .catch(log);
  });

program
  .command('add-target <port> <url>')
  .description('Add a target. Port is a number between 1 and 9999.')
  .action(function (port, url) {
    procKr.addTarget(port, url)
      .then(targetHdlr.list, alertHdlr.error)
      .catch(log);
  });

program
  .command('remove-target <id>')
  .description('Remove a target.')
  .action(function (id) {
    procKr.removeTarget(id)
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('enable-target <id>')
  .description('Enable a target (alias of the start-proxy command).')
  .action(function (id) {
    procKr.startProxy(id)
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('disable-target <id>')
  .description('Disable a target (stop all processes for this target).')
  .action(function (id) {
    procKr.disableTarget(id)
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('recording <id> <boolean>')
  .description(
    'Enable/disable the recording of data passing through a proxy.')
  .action(function (id, bool) {
    procKr.recordingTarget(id, (bool === 'true' || bool === '1'))
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('start-proxy <id>')
  .description(
    'Start the proxy of a target.')
  .action(function (id) {
    procKr.startProxy(id)
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('start-mock <id>')
  .description('Start the mock of a target.')
  .action(function (id) {
    procKr.startMock(id)
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('log')
  .description('See logs.')
  .action(function () {
    procKr.log()
      .on('response', logHdlr.childLog)
      .on('out', logHdlr.childLog);
  });

program.parse(process.argv);

if (!program.args.length) {
  log(program.helpInformation());
  process.exit();
}

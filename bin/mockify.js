#!/usr/bin/env node

/**
 * This file is the mockify cli.
 *
 * Usage examples:
 * $ mockify start
 * $ mockify add-target 4000 http://jsonplaceholder.typicode.com jsonplaceholder
 * $ mockify list-targets
 * $ mockify enable-target jsonplaceholder
 * $ mockify mock-target jsonplaceholder
 *
 * See README.md for more informations.
 */

'use strict';

var program   = require('commander');

var //fs        = require('fs'),
    program      = require('commander'),
    mockify       = require('../mockify'),
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
    mockify.start()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('stop')
  .description('Stop mockify daemon.')
  .action(function () {
    mockify.stop()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('status')
  .description('Check mockify status.')
  .action(function () {
    mockify.status()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('hello')
  .description('Say hello to mockify to test websocket connexion.')
  .action(function () {
    mockify.sayHello()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('start-http')
  .description('Start the mockify http server.')
  .action(function () {
    mockify.startHttp()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('stop-http')
  .description('Stop the mockify http server.')
  .action(function () {
    mockify.stopHttp()
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('list-targets')
  .description('List the targets.')
  .action(function () {
    mockify.listTargets()
      .then(targetHdlr.list, alertHdlr.error)
      .catch(log);
  });

program
  .command('add-target <port> <url>')
  .description('Add a target. Port is a number between 1 and 9999.')
  .action(function (port, url) {
    mockify.addTarget(port, url)
      .then(targetHdlr.list, alertHdlr.error)
      .catch(log);
  });

program
  .command('remove-target <id>')
  .description('Remove a target.')
  .action(function (id) {
    mockify.removeTarget(id)
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('enable-target <id>')
  .description('Enable a target (alias of the start-proxy command).')
  .action(function (id) {
    mockify.startProxy(id)
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('disable-target <id>')
  .description('Disable a target (stop all processes for this target).')
  .action(function (id) {
    mockify.disableTarget(id)
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('recording <id> <boolean>')
  .description(
    'Enable/disable the recording of data passing through a proxy.')
  .action(function (id, bool) {
    mockify.recordingTarget(id, (bool === 'true' || bool === '1'))
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('start-proxy <id>')
  .description(
    'Start the proxy of a target.')
  .action(function (id) {
    mockify.startProxy(id)
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('start-mock <id>')
  .description('Start the mock of a target.')
  .action(function (id) {
    mockify.startMock(id)
      .then(logHdlr.lognExit, alertHdlr.error)
      .catch(log);
  });

program
  .command('log')
  .description('See logs.')
  .action(function () {
    mockify.log()
      .on('response', logHdlr.childLog)
      .on('out', logHdlr.childLog)
      .on('error_', logHdlr.childLog);
  });

program.parse(process.argv);

if (!program.args.length) {
  log(program.helpInformation());
  process.exit();
}

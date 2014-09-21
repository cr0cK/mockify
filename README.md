# procKr

procKr is the API mocking made easy.

Record and replay your API calls for test or development.

Warning: procKr is still experimental not ready for production. I'm working on it!

## Installation

``` bash
git clone https://github.com/cr0cK/procKr.git && cd prockr
npm install
bower install
./gulp build
./gulp serve
```

Open your browser at [localhost:3000](http://localhost:3000)

## How does it work?

procKr is basicly a proxy manager, just follow those simple steps:

1. Create a proxy toward the service to mock
1. Turn **record** mode on
1. Make a bunch of api calls through the proxy
1. Turn **mock** mode on
1. Proxy now returns recorded requests

The proxy will record everything which passing through it and the mock will use this data to return exactly the same results, according HTTP verb, status, query parameters, etc.

procKr uses a SQLite database to store data and spawn in-memory databases for mocking.

## Features

* Save query and response of API(s)
* Mock the exact same request with exact same results

## Using procKr from the command line

``` bash
$ procKr start
procKr is running. PID: 12345

$ procKr start-http
procKr http server is listening on localhost:3000.

$ procKr add-target 4000 http://jsonplaceholder.typicode.com
Proxy has been added (ID:1).

$ procKr add-target 4001 http://localhost:9084
Proxy has been added (ID:2).

$ procKr list-target
List of targets:
┌─────────────────────────────────────┬──────┬────┬─────────────┬───────────┬───────────┬──────────┐
│ target                              │ port │ id │ isRecording │ isEnabled │ isRunning │ isMocked │
├─────────────────────────────────────┼──────┼────┼─────────────┼───────────┼───────────┼──────────┤
│ http://jsonplaceholder.typicode.com │ 4000 │ 1  │ false       │ false     │ false     │ false    │
├─────────────────────────────────────┼──────┼────┼─────────────┼───────────┼───────────┼──────────┤
│ http://localhost:9084               │ 4001 │ 2  │ false       │ false     │ false     │ false    │
└─────────────────────────────────────┴──────┴────┴─────────────┴───────────┴───────────┴──────────┘

$ procKr enable-target 1
The proxy of the target ID:1 is proxing http://jsonplaceholder.typicode.com on localhost:4000.

$ procKr start-mock 1
The proxy of the target ID:1 has been stopped.
The mock of the target ID:1 is mocking http://jsonplaceholder.typicode.com records on localhost:4000.

$ procKr start-proxy 1
The mock of the target ID:1 has been stopped.
The proxy of the target ID:1 is proxing http://jsonplaceholder.typicode.com on localhost:4000.

$ procKr disable-target 1
The proxy of the target ID:1 has been stopped.
The target ID:1 has been disabled.

$ procKr delete-target 1
The target ID:1 has been deleted.
```

## Using procKr module from node.js

``` js
var procKr = require('procKr');

// start the daemon
procKr.start();

// add targets
procKr.addTarget(4000, 'http://jsonplaceholder.typicode.com');
procKr.addTarget(4001, 'http://localhost:9084');

// list targets
procKr.listTarget(function (err, targets) { console.log(targets); });

// enable a target
procKr.enableTarget(1, function (err) { ... });

// start a mock
procKr.startMock(1, function (err) { ... });

// start a proxy
procKr.startProxy(1, function (err) { ... });

// disable a target
procKr.disableTarget(1, function (err) { ... });

// delete a target
procKr.deleteTarget(1, function (err) { ... });
```

## Roadmap

* Customize recorded sessions (edit response and request content, status code, headers)
* Add delay for proxy responses to test unexpected scenarios
* Enhance webapp logs to keep track of history
* Use procKr own api to manipule it in your code
* Cli
* Lib
* Daemonize procKr

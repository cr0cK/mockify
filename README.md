# mockify

mockify is the API mocking made easy.

Record and replay your API calls for test or development.

Warning: mockify is still experimental not ready for production. I'm working on it!

## Installation

``` bash
git clone https://github.com/cr0cK/mockify.git && cd mockify
npm install
bower install
./gulp build
./gulp serve
```

Open your browser at [localhost:3000](http://localhost:3000)

## How does it work?

mockify is basicly a proxy manager, just follow those simple steps:

1. Create a proxy toward the service to mock
1. Turn **record** mode on
1. Make a bunch of api calls through the proxy
1. Turn **mock** mode on
1. Proxy now returns recorded requests

The proxy will record everything which passing through it and the mock will use this data to return exactly the same results, according HTTP verb, status, query parameters, etc.

mockify uses a SQLite database to store data and spawn in-memory databases for mocking.

## Features

* Save query and response of API(s)
* Mock the exact same request with exact same results

## Using mockify from the command line

``` bash
$ mockify start
mockify is running. PID: 12345

$ mockify start-http
mockify http server is listening on localhost:3000.

$ mockify add-target 4000 http://jsonplaceholder.typicode.com
Proxy has been added (ID:1).

$ mockify add-target 4001 http://localhost:9084
Proxy has been added (ID:2).

$ mockify list-target
List of targets:
┌─────────────────────────────────────┬──────┬────┬─────────────┬───────────┬───────────┬──────────┐
│ target                              │ port │ id │ isRecording │ isEnabled │ isRunning │ isMocked │
├─────────────────────────────────────┼──────┼────┼─────────────┼───────────┼───────────┼──────────┤
│ http://jsonplaceholder.typicode.com │ 4000 │ 1  │ false       │ false     │ false     │ false    │
├─────────────────────────────────────┼──────┼────┼─────────────┼───────────┼───────────┼──────────┤
│ http://localhost:9084               │ 4001 │ 2  │ false       │ false     │ false     │ false    │
└─────────────────────────────────────┴──────┴────┴─────────────┴───────────┴───────────┴──────────┘

$ mockify enable-target 1
The proxy of the target ID:1 is proxing http://jsonplaceholder.typicode.com on localhost:4000.

$ mockify start-mock 1
The proxy of the target ID:1 has been stopped.
The mock of the target ID:1 is mocking http://jsonplaceholder.typicode.com records on localhost:4000.

$ mockify start-proxy 1
The mock of the target ID:1 has been stopped.
The proxy of the target ID:1 is proxing http://jsonplaceholder.typicode.com on localhost:4000.

$ mockify disable-target 1
The proxy of the target ID:1 has been stopped.
The target ID:1 has been disabled.

$ mockify delete-target 1
The target ID:1 has been deleted.
```

## Using mockify module from node.js

``` js
var mockify = require('mockify');

// start the daemon
mockify.start();

// add targets
mockify.addTarget(4000, 'http://jsonplaceholder.typicode.com');
mockify.addTarget(4001, 'http://localhost:9084');

// list targets
mockify.listTarget(function (err, targets) { console.log(targets); });

// enable a target
mockify.enableTarget(1, function (err) { ... });

// start a mock
mockify.startMock(1, function (err) { ... });

// start a proxy
mockify.startProxy(1, function (err) { ... });

// disable a target
mockify.disableTarget(1, function (err) { ... });

// delete a target
mockify.deleteTarget(1, function (err) { ... });
```

## Roadmap

* Customize recorded sessions (edit response and request content, status code, headers)
* Add delay for proxy responses to test unexpected scenarios
* Enhance webapp logs to keep track of history
* Use mockify own api to manipule it in your code
* Cli
* Lib
* Daemonize mockify

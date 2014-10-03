# mockify

Mockify is the API mocking made easy.

Record and replay your API calls for tests or development.

Warning: mockify is still experimental not ready for production.

## Installation

* From npm:
``` bash
npm install -g mockify
```

* From source:
``` bash
git clone https://github.com/cr0cK/mockify.git && cd mockify
sudo npm link
```

## Development

If you want to work on mockify, use Gulp tasks:

``` bash
cd mockify

# install dependencies
npm install
bower intall

# watch your app (the build will be triggered for each modification and your code will be linted)
./gulp watch

# start mockify
./gulp start

# Just type ./gulp to see all available tasks.
```

Open your browser at [localhost:3000](http://localhost:3000)

## How does it work?

Mockify is basicly a proxy manager, just follow those simple steps:

1. Create a target toward the service to mock
1. Enable it, the proxy will start
1. Turn **record** mode on
1. Make a bunch of api calls through the proxy
1. Turn **mock** mode on
1. Mockify now returns recorded requests

The proxy will record everything which passing through it and the mock will use this data to return exactly the same results, according HTTP verb, status, query parameters, etc.

Mockify uses a SQLite database to store data and spawn in-memory databases for mocking.

## The different parts of mockify

![alt tag](https://github.com/cr0cK/mockify/blob/doc/doc/architecture.png)

## Features

* Save query and response of API(s)
* Mock the exact same request with exact same results

## Using mockify with the built-in webapp

![alt tag](https://github.com/cr0cK/mockify/blob/doc/doc/mockify.png)

## Using mockify from the command line

You can fully use mockify only with a shell. Here a quick example.

``` bash
$ mockify start
mockify daemon has been started.

$ mockify add-target 4000 http://jsonplaceholder.typicode.com
The target has been added.

┌────┬──────┬─────────────────────────────────────┬───────────┬──────────┬─────────┬─────────┐
│ Id │ Port │ Url                                 │ Recording │ Proxying │ Mocking │ Enabled │
├────┼──────┼─────────────────────────────────────┼───────────┼──────────┼─────────┼─────────┤
│ 1  │ 4000 │ http://jsonplaceholder.typicode.com │ 1         │ false    │ false   │ false   │
└────┴──────┴─────────────────────────────────────┴───────────┴──────────┴─────────┴─────────┘

$ mockify enable-target 1
[proxy-out] Proxy listening on localhost:4000 and proxying http://jsonplaceholder.typicode.com

$ mockify log
# in another shell, type: curl localhost:4000/users
localhost:4000/users -> jsonplaceholder.typicode.com/users
^C

$ mockify start-mock 1
[mock-out] Mock listening on port 4000 and mocking the target ID: 1

$ mockify log
# in another shell, type: curl localhost:4000/users
200 GET /users on localhost:4000
^C

$ mockify disable-target 1
The target has been disabled.

$ curl http://localhost:4000/users
curl: (7) Failed to connect to localhost port 4000: Connection refused
```

Just type ``mockify`` to list all available commands.

## Using mockify module from node.js

``` js
var mockify = require('mockify');

/* All these methods return a promise: */

// start mockify daemon
mockify.start()
  .then(function () { /* ... */ })
  .catch(function () { /* ... */ });

// stop mockify daemon
mockify.stop();

// list the daemon(s) status
mockify.status();

// send a ping to mockify to check if it is running
mockify.sayHello();

// start the httpserver which serves the webapp
mockify.startHttp();

// stop the httpserver
mockify.stopHttp();

// list saved targets
mockify.listTargets();

// add a target
mockify.addTarget(port, url);

// remove a target
mockify.removeTarget(id);

// start a proxy to the url of the target
// (stop the mock if it was running)
mockify.startProxy(id);

// start a mock to the url of the target
// (stop the proxy if it was running)
mockify.startMock(id);

// disable proxy or mock of a target
mockify.disableTarget(id);

// enable / disable the recording for a target
mockify.recordingTarget(id, bool);

/* You can log all proxies / mocks output with the log method which returns an eventEmitter: */
mockify.log()
  .on('response', console.log)
  .on('out', console.info)
  .on('error_', console.error);
```

## Roadmap

* Customize recorded sessions (edit response and request content, status code, headers)
* Add delay for proxy responses to test unexpected scenarios
* Enhance webapp logs to keep track of history

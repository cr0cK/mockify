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

## Roadmap

* Customize recorded sessions (edit response and request content, status code, headers)
* Add delay for proxy responses to test unexpected scenarios
* Enhance webapp logs to keep track of history
* Use procKr own api to manipule it in your code


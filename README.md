# mocKr

A tool to easily mock an existing API. It's an experimental tool not yet ready to be used. I'm working for that!

## How does it work?

mocKr is a webapp which is able to run some child processes to proxy or mock an existing API.

The proxy will record everything which passing through it and the mock will use this data to return exactly the same results, according HTTP verb, status, query parameters, etc.

mocKr uses a SQLite database to store data and spawn in-memory databases for mocking.

## Features

* Save query and response of API(s)
* Mock them exactly with the same results

## Features in the pipe
* Customize queries by updating the response, the status code, the delay, etc. in order to test your app with some unexpected scenarios
* Use the webapp to have nicer logs and to keep track of the history
* Use the mocKr own api to manipule it in your code

## Installation

* clone this repository
* cd app
* npm install
* bower install
* ./gulp build
* ./gulp serve

Go to localhost:3000

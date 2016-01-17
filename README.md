# ISO8601-duration
Node/Js-module for parsing and making sense of ISO8601-durations

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)][1]
[![Build Status: Travis](https://travis-ci.org/tolu/ISO8601-duration.svg?branch=master)][2]

## Usage

### Install

`npm install iso8601-duration`

### Use from ES2015 or ES5 context

`es5 example here`

`es2015 example here`

### Interface

```
export default {
	fromSeconds,
	pattern,
	parse
}
```

### Example with fixing json from api
```
import * as iso8601 from 'iso8601-duration';

const getWithSensibleDUrations = someApiEndpoint => {
	// return promise
	return new Promise(resolve => {
		// fetch text
		fetch('some-api-endpoint')
			.then(res => res.text())
			.then(jsonString => {
				// convert iso8601 durations to total seconds
				var pattern = new RegExp(iso8601.pattern.source, 'g');
				jsonString = jsonString.replace(pattern, m => {
					return iso8601.toSeconds(iso8601.parse(m));
				});
				// resolve original request with sensible durations
				resolve( JSON.parse(jsonString) );
		});
	});
}

```

[1]: https://github.com/sindresorhus/xo "xo on github"
[2]: https://travis-ci.org/tolu/ISO8601-duration "travis build status"
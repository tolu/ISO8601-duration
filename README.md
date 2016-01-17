# ISO8601-duration
Node/Js-module for parsing and making sense of ISO8601-durations

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)][1]
[![Build Status: Travis](https://travis-ci.org/tolu/ISO8601-duration.svg?branch=master)][2]

## Install

```
$ npm install iso8601-duration
```

## Usage

### Interface

```js
export const toSeconds; // fn = obj => number
export const pattern;   // ISO8601 RegExp
export const parse;     // fn = string => obj
export default {
	toSeconds,
	pattern,
	parse
}
```

### Example
```js
import {parse, toSeconds, pattern} as iso8601 from 'iso8601-duration';

const getWithSensibleDUrations = someApiEndpoint => {
	// return promise
	return new Promise(resolve => {
		// fetch text
		fetch('some-api-endpoint')
			.then(res => res.text())
			.then(jsonString => {
				// convert iso8601 durations to total seconds
				// create new pattern that matche son surrounding double-quotes
				const pattern = new RegExp(`\\"${pattern.source}\\"`, 'g');
				jsonString = jsonString.replace(pattern, m => {
					return toSeconds(parse(m));
				});
				// resolve original request with sensible durations
				resolve( JSON.parse(jsonString) );
		});
	});
}

```

## License

MIT © Tobias Lundin

[1]: https://github.com/sindresorhus/xo "xo on github"
[2]: https://travis-ci.org/tolu/ISO8601-duration "travis build status"
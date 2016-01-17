# ISO8601-duration
Node/Js-module for parsing and making sense of ISO8601-durations

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)][1]
[![Build Status: Travis](https://travis-ci.org/tolu/ISO8601-duration.svg?branch=master)][2]
[![npm version](https://badge.fury.io/js/iso8601-duration.svg)][3]

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

// convert iso8601 duration-strings to total seconds from some api
const getWithSensibleDUrations = someApiEndpoint => {
	// return promise, like fetch does
	return new Promise(resolve => {
		// fetch text
		fetch(someApiEndpoint)
			.then(res => res.text())
			.then(jsonString => {

				// create new pattern that matches on surrounding double-quotes
				// so we can replace the string with an actual number
				const replacePattern = new RegExp(`\\"${pattern.source}\\"`, 'g');
				jsonString = jsonString.replace(replacePattern, m => {
					return toSeconds(parse(m));
				});
				// resolve original request with sensible durations in object
				resolve( JSON.parse(jsonString) );
		});
	});
}

```

## License

MIT © Tobias Lundin

[1]: https://github.com/sindresorhus/xo "xo on github"
[2]: https://travis-ci.org/tolu/ISO8601-duration "travis build status"
[3]: https://badge.fury.io/js/iso8601-duration "npm badge"

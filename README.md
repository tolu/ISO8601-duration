# ISO8601-duration

Node/Js-module for parsing and making sense of ISO 8601 durations

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Ftolu%2Fiso8601-duration%2Fbadge&style=popout)][gh-action]
[![npm version](https://img.shields.io/npm/v/iso8601-duration.svg)][npm]
![npm bundle size][bundlephobia]

> A new standard is on it's way, see [Temporal.Duration](https://tc39.es/proposal-temporal/docs/duration.html)  
> Tests (most) in this module now validate against [@js-temporal/polyfill](https://www.npmjs.com/package/@js-temporal/polyfill)

## The ISO 8601 duration format

> **TL;DR**  
> **`PnYnMnWnDTnHnMnS`** - `P<date>T<time>`.  
> (P) **Y**ears, **M**onths, **W**eeks, **D**ays (T) **H**ours, **M**inutes, **S**econds.  
> Example: `P1Y1M1DT1H1M1.1S` = One year, one month, one day, one hour, one minute, one second, and 100 milliseconds

Durations in ISO 8601 comes in 2 variants:

**ISO 8601-1**  
Weeks are not allowed to appear together with any other units and durations can only be positive (used until [v2.0.0](https://github.com/tolu/ISO8601-duration/releases/tag/v2.0.0) in this module).  
Valid patterns with weeks: `P2W`.  
Invalid patterns with weeks: `P2W2D`.

**ISO 8601-2**  
An extension to the standard, allows combining weeks with other units (supported since [v2.1.0](https://github.com/tolu/ISO8601-duration/releases/tag/v2.1.0) in this module).  
Valid patterns with weeks: `P2W` & `P2W2DT5H`, etc.

_ISO 8601-2 also allows for a sign character at the start of the string (`-P1D`, `+P1M`), this is not yet supported by this module._

### **`PnYnMnWnDTnHnMnS`** - `P<date>T<time>`

- The `n` is replaced by the value for each of the date and time elements that follow the `n`.
- Leading zeros are not required.
- Fractions are allowed on the smallest unit in the string, e.g. `P0.5D` or `PT1.0001S` but not `PT0.5M0.1S`.

Check out the details on [Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Durations) or in the coming [Temporal.Duration](https://tc39.es/proposal-temporal/docs/duration.html) spec.

## Install

```sh
npm install iso8601-duration
```

## Usage

Most noteworthy of the interface is the ability to provide a `date` for `toSeconds`-calculations.  
Why becomes evident when working with durations that span dates as all months are not equally long.  
E.g January of 2016 is **744 hours** compared to the **696 hours** of February 2016.

If a date is not provided for `toSeconds` the timestamp `Date.now()` is used as baseline.

### Interface

```js
export const toSeconds; // fn = (obj, date?) => number
export const pattern;   // ISO 8601 RegExp
export const parse;     // fn = string => obj
export default {
	toSeconds,
	pattern,
	parse
}
```

### Example

Simple usage

```js
import { parse, end, toSeconds, pattern } from "iso8601-duration";

console.log(parse("P1Y2M4DT20H44M12.67S"));
/* outputs =>
{
	years: 1,
	months: 2,
	days: 4,
	hours: 20,
	minutes: 44,
	seconds: 12.67
}
*/

console.log(toSeconds(parse("PT1H30M10.5S")));
// outputs => 5410.5

console.log(end(parse("P1D")));
// outputs => DateObj 2017-10-04T10:14:50.190Z
```

A more complete usecase / example

```js
import { parse, toSeconds, pattern } from "iso8601-duration";

// convert iso8601 duration-strings to total seconds from some api
const getWithSensibleDurations = (someApiEndpoint) => {
  // return promise, like fetch does
  return new Promise((resolve) => {
    // fetch text
    fetch(someApiEndpoint)
      .then((res) => res.text())
      .then((jsonString) => {
        // create new pattern that matches on surrounding double-quotes
        // so we can replace the string with an actual number
        const replacePattern = new RegExp(`\\"${pattern.source}\\"`, "g");
        jsonString = jsonString.replace(replacePattern, (m) => {
          return toSeconds(parse(m));
        });
        // resolve original request with sensible durations in object
        resolve(JSON.parse(jsonString));
      });
  });
};
```

## License

MIT @ https://tolu.mit-license.org/

[gh-action]: https://actions-badge.atrox.dev/tolu/iso8601-duration/goto
[npm]: https://www.npmjs.com/package/iso8601-duration "npm package"
[bundlephobia]: https://img.shields.io/bundlephobia/minzip/iso8601-duration

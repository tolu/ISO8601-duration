"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.toSeconds = exports.end = exports.parse = exports.pattern = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @description A module for parsing ISO8601 durations
 */

/**
 * The pattern used for parsing ISO8601 duration (PnYnMnDTnHnMnS).
 * This does not cover the week format PnW.
 */
// PnYnMnDTnHnMnS
var numbers = '\\d+(?:[\\.,]\\d+)?';
var weekPattern = "(".concat(numbers, "W)");
var datePattern = "(".concat(numbers, "Y)?(").concat(numbers, "M)?(").concat(numbers, "D)?");
var timePattern = "T(".concat(numbers, "H)?(").concat(numbers, "M)?(").concat(numbers, "S)?");
var iso8601 = "P(?:".concat(weekPattern, "|").concat(datePattern, "(?:").concat(timePattern, ")?)");
var objMap = ['weeks', 'years', 'months', 'days', 'hours', 'minutes', 'seconds'];
var defaultDuration = Object.freeze({
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});
/**
 * The ISO8601 regex for matching / testing durations
 */

var pattern = new RegExp(iso8601);
/** Parse PnYnMnDTnHnMnS format to Duration
 * @param {String} durationString - PnYnMnDTnHnMnS formatted string
 * @return {Duration} - With a property for each part of the pattern
 */

exports.pattern = pattern;

var parse = function parse(durationString) {
  var _durationString$match;

  // Slice away first entry in match-array
  return ((_durationString$match = durationString.match(pattern)) === null || _durationString$match === void 0 ? void 0 : _durationString$match.slice(1).reduce(function (prev, next, idx) {
    prev[objMap[idx]] = parseFloat(next) || 0;
    return prev;
  }, {})) || _objectSpread({}, defaultDuration);
};
/**
 * Convert ISO8601 duration Duration to an end Date.
 *
 * @param {Duration} duration - The duration instance
 * @param {Date} startDate - The starting Date for calculating the duration
 * @return {Date} - The resulting end Date
 */


exports.parse = parse;

var end = function end(duration, startDate) {
  duration = Object.assign({}, defaultDuration, duration); // Create two equal timestamps, add duration to 'then' and return time difference

  var timestamp = startDate ? startDate.getTime() : Date.now();
  var then = new Date(timestamp);
  var _duration = duration,
      _duration$years = _duration.years,
      years = _duration$years === void 0 ? 0 : _duration$years,
      _duration$months = _duration.months,
      months = _duration$months === void 0 ? 0 : _duration$months,
      _duration$days = _duration.days,
      days = _duration$days === void 0 ? 0 : _duration$days,
      _duration$hours = _duration.hours,
      hours = _duration$hours === void 0 ? 0 : _duration$hours,
      _duration$minutes = _duration.minutes,
      minutes = _duration$minutes === void 0 ? 0 : _duration$minutes,
      _duration$seconds = _duration.seconds,
      seconds = _duration$seconds === void 0 ? 0 : _duration$seconds,
      _duration$weeks = _duration.weeks,
      weeks = _duration$weeks === void 0 ? 0 : _duration$weeks;
  then.setFullYear(then.getFullYear() + years);
  then.setMonth(then.getMonth() + months);
  then.setDate(then.getDate() + days);
  then.setHours(then.getHours() + hours);
  then.setMinutes(then.getMinutes() + minutes);
  then.setMilliseconds(then.getMilliseconds() + seconds * 1000); // Special case weeks

  then.setDate(then.getDate() + weeks * 7);
  return then;
};
/**
 * Convert ISO8601 Duration to seconds
 *
 * @param {Duration} duration - The duration instance
 * @param {Date} startDate - The starting point for calculating the duration
 * @return {number}
 */


exports.end = end;

var toSeconds = function toSeconds(duration, startDate) {
  duration = Object.assign({}, defaultDuration, duration);
  var timestamp = startDate ? startDate.getTime() : Date.now();
  var now = new Date(timestamp);
  var then = end(duration, now);
  var seconds = (then.getTime() - now.getTime()) / 1000;
  return seconds;
};

exports.toSeconds = toSeconds;
var _default = {
  end: end,
  toSeconds: toSeconds,
  pattern: pattern,
  parse: parse
};
exports["default"] = _default;
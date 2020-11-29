"use strict";
/**
 * @description A module for parsing ISO8601 durations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSeconds = exports.end = exports.parse = exports.pattern = void 0;
// PnYnMnDTnHnMnS
const numbers = '\\d+(?:[\\.,]\\d+)?';
const weekPattern = `(${numbers}W)`;
const datePattern = `(${numbers}Y)?(${numbers}M)?(${numbers}D)?`;
const timePattern = `T(${numbers}H)?(${numbers}M)?(${numbers}S)?`;
const iso8601 = `P(?:${weekPattern}|${datePattern}(?:${timePattern})?)`;
const objMap = ['weeks', 'years', 'months', 'days', 'hours', 'minutes', 'seconds'];
/**
 * The ISO8601 regex for matching / testing durations
 */
exports.pattern = new RegExp(iso8601);
/**
 * Parse PnYnMnDTnHnMnS format to object
 */
const parse = (durationString) => {
    // Slice away first entry in match-array
    const match = durationString.match(exports.pattern);
    if (match == null) {
        throw TypeError(`Malformed duration string: ${durationString} != 'PnYnMnDTnHnMnS'-format`);
    }
    return match.slice(1).reduce((prev, next, idx) => {
        prev[objMap[idx]] = parseFloat(next) || 0;
        return prev;
    }, {});
};
exports.parse = parse;
/**
 * Convert ISO8601 duration object to an end Date.
 */
const end = (duration, startDate) => {
    // Create two equal timestamps, add duration to 'then' and return time difference
    const timestamp = (startDate ? startDate.getTime() : Date.now());
    const then = new Date(timestamp);
    then.setFullYear(then.getFullYear() + duration.years);
    then.setMonth(then.getMonth() + duration.months);
    then.setDate(then.getDate() + duration.days);
    then.setHours(then.getHours() + duration.hours);
    then.setMinutes(then.getMinutes() + duration.minutes);
    // Then.setSeconds(then.getSeconds() + duration.seconds);
    then.setMilliseconds(then.getMilliseconds() + (duration.seconds * 1000));
    // Special case weeks
    then.setDate(then.getDate() + (duration.weeks * 7));
    return then;
};
exports.end = end;
/**
 * Convert ISO8601 duration object to seconds
 */
const toSeconds = (duration, startDate) => {
    const timestamp = (startDate ? startDate.getTime() : Date.now());
    const now = new Date(timestamp);
    const then = exports.end(duration, now);
    const seconds = (then.getTime() - now.getTime()) / 1000;
    return seconds;
};
exports.toSeconds = toSeconds;
exports.default = {
    end: exports.end,
    toSeconds: exports.toSeconds,
    pattern: exports.pattern,
    parse: exports.parse
};

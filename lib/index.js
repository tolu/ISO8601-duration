"use strict";
/**
 * @description A module for parsing ISO8601 durations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSeconds = exports.end = exports.parse = exports.pattern = void 0;
/**
 * The pattern used for parsing ISO8601 duration (PnYnMnDTnHnMnS).
 * This does not cover the week format PnW.
 */
// PnYnMnDTnHnMnS
var numbers = "\\d+(?:[\\.,]\\d+)?";
var weekPattern = "(".concat(numbers, "W)");
var datePattern = "(".concat(numbers, "Y)?(").concat(numbers, "M)?(").concat(numbers, "D)?");
var timePattern = "T(".concat(numbers, "H)?(").concat(numbers, "M)?(").concat(numbers, "S)?");
var iso8601 = "P(?:".concat(weekPattern, "|").concat(datePattern, "(?:").concat(timePattern, ")?)");
var objMap = [
    "weeks",
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
];
var defaultDuration = Object.freeze({
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
});
/**
 * The ISO8601 regex for matching / testing durations
 */
exports.pattern = new RegExp(iso8601);
/** Parse PnYnMnDTnHnMnS format to object
 * @param {string} durationString - PnYnMnDTnHnMnS formatted string
 * @return {typeof defaultDuration} - With a property for each part of the pattern
 */
var parse = function (durationString) {
    // Slice away first entry in match-array
    return durationString
        .match(exports.pattern)
        .slice(1)
        .reduce(function (prev, next, idx) {
        prev[objMap[idx]] = parseFloat(next) || 0;
        return prev;
    }, {});
};
exports.parse = parse;
/**
 * Convert ISO8601 duration object to an end Date.
 *
 * @param {Object} duration - The duration object
 * @param {Date} [startDate] - The starting Date for calculating the duration
 * @return {Date} - The resulting end Date
 */
var end = function (duration, startDate) {
    duration = Object.assign({}, defaultDuration, duration);
    // Create two equal timestamps, add duration to 'then' and return time difference
    var timestamp = startDate ? startDate.getTime() : Date.now();
    var then = new Date(timestamp);
    then.setFullYear(then.getFullYear() + duration.years);
    then.setMonth(then.getMonth() + duration.months);
    then.setDate(then.getDate() + duration.days);
    then.setHours(then.getHours() + duration.hours);
    then.setMinutes(then.getMinutes() + duration.minutes);
    // Then.setSeconds(then.getSeconds() + duration.seconds);
    then.setMilliseconds(then.getMilliseconds() + duration.seconds * 1000);
    // Special case weeks
    then.setDate(then.getDate() + duration.weeks * 7);
    return then;
};
exports.end = end;
/**
 * Convert ISO8601 duration object to seconds
 *
 * @param {Object} duration - The duration object
 * @param {Date} [startDate] - The starting point for calculating the duration
 * @return {Number}
 */
var toSeconds = function (duration, startDate) {
    duration = Object.assign({}, defaultDuration, duration);
    var timestamp = startDate ? startDate.getTime() : Date.now();
    var now = new Date(timestamp);
    var then = (0, exports.end)(duration, now);
    var seconds = (then.getTime() - now.getTime()) / 1000;
    return seconds;
};
exports.toSeconds = toSeconds;
exports.default = {
    end: exports.end,
    toSeconds: exports.toSeconds,
    pattern: exports.pattern,
    parse: exports.parse,
};

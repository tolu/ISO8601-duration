"use strict";
/**
 * @description A module for parsing ISO8601 durations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSeconds = exports.end = exports.parse = exports.pattern = void 0;
/**
 * The pattern used for parsing ISO8601 duration (PnYnMnWnDTnHnMnS).
 */
// PnYnMnWnDTnHnMnS
var numbers = "\\d+";
var fractionalNumbers = "".concat(numbers, "(?:[\\.,]").concat(numbers, ")?");
var datePattern = "(".concat(numbers, "Y)?(").concat(numbers, "M)?(").concat(numbers, "W)?(").concat(numbers, "D)?");
var timePattern = "T(".concat(fractionalNumbers, "H)?(").concat(fractionalNumbers, "M)?(").concat(fractionalNumbers, "S)?");
var iso8601 = "P(?:".concat(datePattern, "(?:").concat(timePattern, ")?)");
var objMap = [
    "years",
    "months",
    "weeks",
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
/** Parse PnYnMnDTnHnMnS format to object */
var parse = function (durationString) {
    var matches = durationString.replace(/,/g, ".").match(exports.pattern);
    if (!matches) {
        throw new RangeError("invalid duration: ".concat(durationString));
    }
    // Slice away first entry in match-array (the input string)
    var slicedMatches = matches.slice(1);
    if (slicedMatches.filter(function (v) { return v != null; }).length === 0) {
        throw new RangeError("invalid duration: ".concat(durationString));
    }
    // A fraction is only allowed on the last present (smallest) unit
    var fractionalIdx = slicedMatches.findIndex(function (v) { return /\./.test(v || ""); });
    if (fractionalIdx !== -1) {
        var lastPresentIdx = slicedMatches.reduce(function (acc, v, idx) { return (v != null ? idx : acc); }, -1);
        if (fractionalIdx !== lastPresentIdx) {
            throw new RangeError("only the smallest unit can be fractional");
        }
    }
    return slicedMatches.reduce(function (prev, next, idx) {
        prev[objMap[idx]] = parseFloat(next || "0") || 0;
        return prev;
    }, {});
};
exports.parse = parse;
/**
 * The day the date part of a duration ends on, as midnight UTC. The math runs
 * in UTC, where no day has a DST gap that could move the time of day.
 */
var endDay = function (duration, startDate) {
    // Clamp the day to the last day of the target month, so that e.g.
    // Jan 31 + P1M is Feb 28, not an overflow into March
    var day = new Date(0);
    day.setUTCFullYear(startDate.getFullYear() + duration.years, startDate.getMonth() + duration.months + 1, 0);
    day.setUTCDate(Math.min(startDate.getDate(), day.getUTCDate()) +
        duration.weeks * 7 +
        duration.days);
    return day;
};
/** Milliseconds in the hours, minutes and seconds of a duration */
var timeMilliseconds = function (duration) {
    // Round at nanosecond level to remove float noise (1.001 * 1000 is
    // 1000.9999999999999), then floor to whole milliseconds like Temporal does
    var seconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
    return Math.floor(Math.round(seconds * 1e9) / 1e6);
};
/** Convert ISO8601 duration object to an end Date. */
var end = function (durationInput, startDate) {
    if (startDate === void 0) { startDate = new Date(); }
    var duration = Object.assign({}, defaultDuration, durationInput);
    // Move to the end day in one step, keeping the local time of day
    var day = endDay(duration, startDate);
    var then = new Date(startDate.getTime());
    then.setFullYear(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate());
    // Hours, minutes and seconds are exact time, like in Temporal: add them to
    // the timestamp, not to the wall clock, so PT24H is 24 hours across DST
    then.setTime(then.getTime() + timeMilliseconds(duration));
    return then;
};
exports.end = end;
/** Convert ISO8601 duration object to seconds */
var toSeconds = function (durationInput, startDate) {
    if (startDate === void 0) { startDate = new Date(); }
    var duration = Object.assign({}, defaultDuration, durationInput);
    // Count whole days on the calendar, so DST changes on the way do not add or
    // remove an hour (P1D is always 86400 seconds)
    var startDay = new Date(0);
    startDay.setUTCFullYear(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    var days = endDay(duration, startDate).getTime() - startDay.getTime();
    return (days + timeMilliseconds(duration)) / 1000;
};
exports.toSeconds = toSeconds;
exports.default = {
    end: exports.end,
    toSeconds: exports.toSeconds,
    pattern: exports.pattern,
    parse: exports.parse,
};

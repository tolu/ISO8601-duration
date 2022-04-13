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
    // Check only one fraction is used
    if (slicedMatches.filter(function (v) { return /\./.test(v || ""); }).length > 1) {
        throw new RangeError("only the smallest unit can be fractional");
    }
    return slicedMatches.reduce(function (prev, next, idx) {
        prev[objMap[idx]] = parseFloat(next || "0") || 0;
        return prev;
    }, {});
};
exports.parse = parse;
/** Convert ISO8601 duration object to an end Date. */
var end = function (durationInput, startDate) {
    if (startDate === void 0) { startDate = new Date(); }
    var duration = Object.assign({}, defaultDuration, durationInput);
    // Create two equal timestamps, add duration to 'then' and return time difference
    var timestamp = startDate.getTime();
    var then = new Date(timestamp);
    then.setFullYear(then.getFullYear() + duration.years);
    then.setMonth(then.getMonth() + duration.months);
    then.setDate(then.getDate() + duration.days);
    // set time as milliseconds to get fractions working for minutes/hours
    var hoursInMs = duration.hours * 3600 * 1000;
    var minutesInMs = duration.minutes * 60 * 1000;
    then.setMilliseconds(then.getMilliseconds() + duration.seconds * 1000 + hoursInMs + minutesInMs);
    // Special case weeks
    then.setDate(then.getDate() + duration.weeks * 7);
    return then;
};
exports.end = end;
/** Convert ISO8601 duration object to seconds */
var toSeconds = function (durationInput, startDate) {
    if (startDate === void 0) { startDate = new Date(); }
    var duration = Object.assign({}, defaultDuration, durationInput);
    var timestamp = startDate.getTime();
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

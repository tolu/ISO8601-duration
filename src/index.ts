/**
 * @description A module for parsing ISO8601 durations
 */

/**
 * The pattern used for parsing ISO8601 duration (PnYnMnDTnHnMnS).
 * This does not cover the week format PnW.
 */

// PnYnMnDTnHnMnS
const numbers = "\\d+(?:[\\.,]\\d+)?";
const weekPattern = `(${numbers}W)`;
const datePattern = `(${numbers}Y)?(${numbers}M)?(${numbers}D)?`;
const timePattern = `T(${numbers}H)?(${numbers}M)?(${numbers}S)?`;

const iso8601 = `P(?:${weekPattern}|${datePattern}(?:${timePattern})?)`;

export interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const objMap: (keyof Duration)[] = [
  "weeks",
  "years",
  "months",
  "days",
  "hours",
  "minutes",
  "seconds",
];

const defaultDuration: Required<Duration> = Object.freeze({
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
export const pattern = new RegExp(iso8601);

/** Parse PnYnMnDTnHnMnS format to object */
export const parse = (durationString: string): Duration => {
  // Slice away first entry in match-array
  return durationString
    .match(pattern)!
    .slice(1)
    .reduce((prev, next, idx) => {
      prev[objMap[idx]] = parseFloat(next) || 0;
      return prev;
    }, {} as Duration);
};

/** Convert ISO8601 duration object to an end Date. */
export const end = (durationInput: Duration, startDate = new Date()) => {
  const duration = Object.assign({}, defaultDuration, durationInput);

  // Create two equal timestamps, add duration to 'then' and return time difference
  const timestamp = startDate.getTime();
  const then = new Date(timestamp);

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

/** Convert ISO8601 duration object to seconds */
export const toSeconds = (durationInput: Duration, startDate = new Date()) => {
  const duration = Object.assign({}, defaultDuration, durationInput);

  const timestamp = startDate.getTime();
  const now = new Date(timestamp);
  const then = end(duration, now);

  const seconds = (then.getTime() - now.getTime()) / 1000;
  return seconds;
};

export default {
  end,
  toSeconds,
  pattern,
  parse,
};

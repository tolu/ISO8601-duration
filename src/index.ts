/**
 * @description A module for parsing ISO8601 durations
 */

/**
 * The pattern used for parsing ISO8601 duration (PnYnMnWnDTnHnMnS).
 */

// PnYnMnWnDTnHnMnS
const numbers = "\\d+";
const fractionalNumbers = `${numbers}(?:[\\.,]${numbers})?`;
const datePattern = `(${numbers}Y)?(${numbers}M)?(${numbers}W)?(${numbers}D)?`;
const timePattern = `T(${fractionalNumbers}H)?(${fractionalNumbers}M)?(${fractionalNumbers}S)?`;

const iso8601 = `P(?:${datePattern}(?:${timePattern})?)`;

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
  "years",
  "months",
  "weeks",
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
export const pattern: RegExp = new RegExp(iso8601);

/** Parse PnYnMnDTnHnMnS format to object */
export const parse = (durationString: string): Duration => {
  const matches = durationString.replace(/,/g, ".").match(pattern);
  if (!matches) {
    throw new RangeError(`invalid duration: ${durationString}`);
  }
  // Slice away first entry in match-array (the input string)
  const slicedMatches: (string | undefined)[] = matches.slice(1);
  if (slicedMatches.filter((v) => v != null).length === 0) {
    throw new RangeError(`invalid duration: ${durationString}`);
  }
  // Check only one fraction is used
  if (slicedMatches.filter((v) => /\./.test(v || "")).length > 1) {
    throw new RangeError("only the smallest unit can be fractional");
  }

  return slicedMatches.reduce((prev, next, idx) => {
    prev[objMap[idx]] = parseFloat(next || "0") || 0;
    return prev;
  }, {} as Duration);
};

/** Convert ISO8601 duration object to an end Date. */
export const end = (
  durationInput: Duration,
  startDate: Date = new Date(),
): Date => {
  const duration = Object.assign({}, defaultDuration, durationInput);

  // Create two equal timestamps, add duration to 'then' and return time difference
  const timestamp = startDate.getTime();
  const then = new Date(timestamp);

  then.setFullYear(then.getFullYear() + duration.years);
  then.setMonth(then.getMonth() + duration.months);
  then.setDate(then.getDate() + duration.days);
  // set time as milliseconds to get fractions working for minutes/hours
  const hoursInMs = duration.hours * 3600 * 1000;
  const minutesInMs = duration.minutes * 60 * 1000;
  then.setMilliseconds(
    then.getMilliseconds() + duration.seconds * 1000 + hoursInMs + minutesInMs,
  );
  // Special case weeks
  then.setDate(then.getDate() + duration.weeks * 7);

  return then;
};

/** Convert ISO8601 duration object to seconds */
export const toSeconds = (
  durationInput: Duration,
  startDate: Date = new Date(),
): number => {
  const duration = Object.assign({}, defaultDuration, durationInput);

  const timestamp = startDate.getTime();
  const now = new Date(timestamp);
  const then = end(duration, now);

  // Account for timezone offset between start and end date
  const tzStart = startDate.getTimezoneOffset();
  const tzEnd = then.getTimezoneOffset();
  const tzOffsetSeconds = (tzStart - tzEnd) * 60;

  const seconds = (then.getTime() - now.getTime()) / 1000;
  return seconds + tzOffsetSeconds;
};

export default {
  end,
  toSeconds,
  pattern,
  parse,
};

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
  // A fraction is only allowed on the last present (smallest) unit
  const fractionalIdx = slicedMatches.findIndex((v) => /\./.test(v || ""));
  if (fractionalIdx !== -1) {
    const lastPresentIdx = slicedMatches.reduce(
      (acc, v, idx) => (v != null ? idx : acc),
      -1,
    );
    if (fractionalIdx !== lastPresentIdx) {
      throw new RangeError("only the smallest unit can be fractional");
    }
  }

  return slicedMatches.reduce((prev, next, idx) => {
    prev[objMap[idx]] = parseFloat(next || "0") || 0;
    return prev;
  }, {} as Duration);
};

/**
 * The day the date part of a duration ends on, as midnight UTC. The math runs
 * in UTC, where no day has a DST gap that could move the time of day.
 */
const endDay = (duration: Required<Duration>, startDate: Date): Date => {
  // Clamp the day to the last day of the target month, so that e.g.
  // Jan 31 + P1M is Feb 28, not an overflow into March
  const day = new Date(0);
  day.setUTCFullYear(
    startDate.getFullYear() + duration.years,
    startDate.getMonth() + duration.months + 1,
    0,
  );
  day.setUTCDate(
    Math.min(startDate.getDate(), day.getUTCDate()) +
      duration.weeks * 7 +
      duration.days,
  );
  return day;
};

/** Milliseconds in the hours, minutes and seconds of a duration */
const timeMilliseconds = (duration: Required<Duration>): number => {
  // Round at nanosecond level to remove float noise (1.001 * 1000 is
  // 1000.9999999999999), then floor to whole milliseconds like Temporal does
  const seconds =
    duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
  return Math.floor(Math.round(seconds * 1e9) / 1e6);
};

/** Convert ISO8601 duration object to an end Date. */
export const end = (
  durationInput: Duration,
  startDate: Date = new Date(),
): Date => {
  const duration = Object.assign({}, defaultDuration, durationInput);

  // Move to the end day in one step, keeping the local time of day
  const day = endDay(duration, startDate);
  const then = new Date(startDate.getTime());
  then.setFullYear(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate());
  // Hours, minutes and seconds are exact time, like in Temporal: add them to
  // the timestamp, not to the wall clock, so PT24H is 24 hours across DST
  then.setTime(then.getTime() + timeMilliseconds(duration));

  return then;
};

/** Convert ISO8601 duration object to seconds */
export const toSeconds = (
  durationInput: Duration,
  startDate: Date = new Date(),
): number => {
  const duration = Object.assign({}, defaultDuration, durationInput);

  // Count whole days on the calendar, so DST changes on the way do not add or
  // remove an hour (P1D is always 86400 seconds)
  const startDay = new Date(0);
  startDay.setUTCFullYear(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  const days = endDay(duration, startDate).getTime() - startDay.getTime();

  return (days + timeMilliseconds(duration)) / 1000;
};

export default {
  end,
  toSeconds,
  pattern,
  parse,
};

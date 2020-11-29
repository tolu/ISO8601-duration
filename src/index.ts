/**
 * @description A module for parsing ISO8601 durations
 */

/**
 * The pattern used for parsing ISO8601 duration (PnYnMnDTnHnMnS).
 * This does not cover the week format PnW.
 */

export interface Duration {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
export type PartialDuration = Partial<Duration>;

// PnYnMnDTnHnMnS
const numbers = '\\d+(?:[\\.,]\\d+)?'
const weekPattern = `(${numbers}W)`
const datePattern = `(${numbers}Y)?(${numbers}M)?(${numbers}D)?`
const timePattern = `T(${numbers}H)?(${numbers}M)?(${numbers}S)?`

const iso8601 = `P(?:${weekPattern}|${datePattern}(?:${timePattern})?)`
const objMap = ['weeks', 'years', 'months', 'days', 'hours', 'minutes', 'seconds'] as const

/**
 * The ISO8601 regex for matching / testing durations
 */
export const pattern = new RegExp(iso8601)

/**
 * Parse PnYnMnDTnHnMnS format to object
 */
export const parse = (durationString: string): PartialDuration => {
  // Slice away first entry in match-array
  // eslint-disable-next-line
  // @ts-ignore
  return durationString.match(pattern).slice(1).reduce((prev, next, idx) => {
    prev[objMap[idx]] = parseFloat(next) || 0
    return prev
  }, {} as PartialDuration)
}

/**
 * Convert ISO8601 duration object to an end Date.
 */
export const end = (duration: Duration, startDate?: Date): Date => {
  // Create two equal timestamps, add duration to 'then' and return time difference
  const timestamp = (startDate ? startDate.getTime() : Date.now())
  const then = new Date(timestamp)

  then.setFullYear(then.getFullYear() + duration.years)
  then.setMonth(then.getMonth() + duration.months)
  then.setDate(then.getDate() + duration.days)
  then.setHours(then.getHours() + duration.hours)
  then.setMinutes(then.getMinutes() + duration.minutes)
  // Then.setSeconds(then.getSeconds() + duration.seconds);
  then.setMilliseconds(then.getMilliseconds() + (duration.seconds * 1000))
  // Special case weeks
  then.setDate(then.getDate() + (duration.weeks * 7))

  return then
}

/**
 * Convert ISO8601 duration object to seconds
 */
export const toSeconds = (duration: PartialDuration, startDate?: Date): number => {
  const timestamp = (startDate ? startDate.getTime() : Date.now())
  const now = new Date(timestamp)
  const then = end(duration as Duration, now)

  const seconds = (then.getTime() - now.getTime()) / 1000
  return seconds
}

export default {
  end,
  toSeconds,
  pattern,
  parse
}

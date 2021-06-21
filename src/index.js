// @flow
/**
 * @description A module for parsing ISO8601 durations
 */
import type { Duration } from './flow-types'
/**
 * The pattern used for parsing ISO8601 duration (PnYnMnDTnHnMnS).
 * This does not cover the week format PnW.
 */
// PnYnMnDTnHnMnS
const numbers = '\\d+(?:[\\.,]\\d+)?'
const weekPattern = `(${numbers}W)`
const datePattern = `(${numbers}Y)?(${numbers}M)?(${numbers}D)?`
const timePattern = `T(${numbers}H)?(${numbers}M)?(${numbers}S)?`

const iso8601 = `P(?:${weekPattern}|${datePattern}(?:${timePattern})?)`
const objMap = ['weeks', 'years', 'months', 'days', 'hours', 'minutes', 'seconds']

const defaultDuration: Duration = Object.freeze({
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

/**
 * The ISO8601 regex for matching / testing durations
 */
export const pattern: RegExp = new RegExp(iso8601)

/** Parse PnYnMnDTnHnMnS format to Duration
 * @param {string} durationString - PnYnMnDTnHnMnS formatted string
 * @return {Duration} - With a property for each part of the pattern
 */
export const parse = (durationString: string): Duration => {
  // Slice away first entry in match-array
  return durationString.match(pattern)?.slice(1).reduce((prev, next, idx) => {
    prev[objMap[idx]] = parseFloat(next) || 0
    return prev
  }, {}) || { ...defaultDuration }
}

/**
 * Convert ISO8601 duration Duration to an end Date.
 *
 * @param {Duration} duration - The duration instance
 * @param {Date} startDate - The starting Date for calculating the duration
 * @return {Date} - The resulting end Date
 */
export const end = (duration: Duration, startDate: Date): Date => {
  duration = Object.assign({}, defaultDuration, duration)

  // Create two equal timestamps, add duration to 'then' and return time difference
  const timestamp: number = (startDate ? startDate.getTime() : Date.now())
  const then: Date = new Date(timestamp)
  const { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, weeks = 0 } = duration

  then.setFullYear(then.getFullYear() + years)
  then.setMonth(then.getMonth() + months)
  then.setDate(then.getDate() + days)
  then.setHours(then.getHours() + hours)
  then.setMinutes(then.getMinutes() + minutes)
  then.setMilliseconds(then.getMilliseconds() + (seconds * 1000))
  // Special case weeks
  then.setDate(then.getDate() + (weeks * 7))

  return then
}

/**
 * Convert ISO8601 Duration to seconds
 *
 * @param {Duration} duration - The duration instance
 * @param {Date} startDate - The starting point for calculating the duration
 * @return {number}
 */
export const toSeconds = (duration: Duration, startDate?: Date): number => {
  duration = Object.assign({}, defaultDuration, duration)

  const timestamp: number = (startDate ? startDate.getTime() : Date.now())
  const now: Date = new Date(timestamp)
  const then: Date = end(duration, now)

  const seconds: number = (then.getTime() - now.getTime()) / 1000

  return seconds
}

export default {
  end,
  toSeconds,
  pattern,
  parse
}

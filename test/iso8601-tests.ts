/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import test from 'ava'
import { parse, end, toSeconds, pattern } from '../src/index'

test('Parse: correctly parses data-time format', t => {
  const time = parse('P2Y4M6DT14H30M20.42S')
  t.is(time.years, 2)
  t.is(time.months, 4)
  t.is(time.days, 6)
  t.is(time.hours, 14)
  t.is(time.minutes, 30)
  t.is(time.seconds, 20.42)
})

test('Parse: correctly parses weeks format', t => {
  const time = parse('P3W1Y4M6DT14H30M20.42S')

  t.is(time.weeks, 3)
  t.is(time.years, 0)
  t.is(time.months, 0)
  t.is(time.days, 0)
  t.is(time.hours, 0)
  t.is(time.minutes, 0)
  t.is(time.seconds, 0)
})

test('parse: allow any number of decimals', t => {
  const time = parse('PT16.239999S')

  t.is(time.weeks, 0)
  t.is(time.years, 0)
  t.is(time.months, 0)
  t.is(time.days, 0)
  t.is(time.hours, 0)
  t.is(time.minutes, 0)
  t.is(time.seconds, 16.239999)
})

test('end: returns the following day', t => {
  const now = new Date()
  const then = end(parse('P1D') as any, now)
  const expectedThen = new Date(now.getTime() + (86400 * 1000))
  t.is(then.getTime(), expectedThen.getTime())
})

test('end: accepts partial duration', t => {
  const value = end({ minutes: 1 } as any);
  t.false(isNaN(value.getDate()));
})

test('toSeconds: accepts partial duration', t => {
  const value = toSeconds({ minutes: 1 } as any);
  t.is(value, 60);
})

test('toSeconds: returns simple HMS time in total seconds', t => {
  const res = toSeconds(parse('PT1H2M5.512S'))
  const expected = 3600 + (2 * 60) + 5.512
  t.is(res, expected)
})

test('toSeconds: returns calendar time (YMD) diff in seconds', t => {
  const res = toSeconds(parse('P4Y2M8D'))
  const timestamp = Date.now()
  const d = new Date(timestamp)

  d.setFullYear(d.getFullYear() + 4)
  d.setMonth(d.getMonth() + 2)
  d.setDate(d.getDate() + 8)

  const expected = (d.getTime() - (new Date(timestamp)).getTime()) / 1000
  t.is(res, expected)
})

test('toSeconds: return weeks in total seconds', t => {
  const res = toSeconds(parse('P3W'))
  const timestamp = Date.now()
  const d = new Date(timestamp)
  d.setDate(d.getDate() + (7 * 3))
  const expected = (d.getTime() - (new Date(timestamp).getTime())) / 1000
  t.is(res, expected)
})

test('toSeconds: with supplied start date', t => {
  // Arrange
  const firstOfJanuary = new Date(2016, 0, 1)
  const firstOfFebruary = new Date(2016, 1, 1)
  const expectedJanDuration = ((new Date(2016, 1, 2)).getTime() - (new Date(2016, 0, 1)).getTime()) / 1000
  const expectedFebDuration = ((new Date(2016, 2, 2)).getTime() - (new Date(2016, 1, 1)).getTime()) / 1000

  // Act
  const durFromJan = toSeconds(parse('P1M1D'), firstOfJanuary)
  const durFromFeb = toSeconds(parse('P1M1D'), firstOfFebruary)

  // Assert
  t.true(durFromJan > durFromFeb)
  t.is(durFromJan, expectedJanDuration)
  t.is(durFromFeb, expectedFebDuration)
})

test('usage example test', t => {
  // Arrange
  const jsonString = JSON.stringify({
    foo: { duration: 'PT1H30M25S' },
    bar: { duration: 'PT43M58.72S' }
  })
  // Create new regex from pattern and include surrounding double-quotes
  const globalRegex = new RegExp(`\\"${pattern.source}\\"`, 'g')

  // @ts-ignore Act
  const result = JSON.parse(jsonString.replace(globalRegex, m => {
    return toSeconds(parse(m))
  }))

  // Assert
  t.is(result.foo.duration, 3600 + (30 * 60) + 25)
  t.is(result.bar.duration, (43 * 60) + 58.72)
})

test('expose vulnerable time calculation in toSeconds', t => {
  const dur = {
    weeks: 0,
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }

  Array.from({ length: 10000 }).forEach(() => {
    const sec = toSeconds(dur)
    t.is(sec, 0)
  })
})

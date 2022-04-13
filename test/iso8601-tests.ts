import { test } from "uvu";
import * as assert from "uvu/assert";
import { parse, end, toSeconds, pattern } from "../src/index";

import { Temporal } from "@js-temporal/polyfill";

const tryCatch = (cb) => {
  try {
    cb();
  } catch (err) {
    return err;
  }
  return null;
};

// needed for calendar correctness
const relativeDate = new Date();
// ok patterns
[
  "P0D",
  "PT0S",
  "PT0,1S", // commas as separators
  "PT0.5M",
  "PT0.5H",
  "P2W2D", // Temporal allows mixing weeks with other designators
  "PT0.001S",
  "P1DT2H3M4S",
  "P2Y4M6DT14H30M20.42S",
  "P2Y4M2W6DT14H30M20.42S", // With weeks
].forEach((value) => {
  test(`Validate ok duration (${value}) against Temporal.Duration`, () => {
    assert.equal(
      toSeconds(parse(value), relativeDate),
      Temporal.Duration.from(value).total({
        unit: "second",
        relativeTo: relativeDate.toISOString(),
      }),
      `Mismatch for pattern ${value}`
    );
  });
});

[
  "abc",
  "", // invalid duration
  "P", // invalid duration
  "P11", // invalid duration
  "T", // invalid duration
  "PT", // invalid duration
  "P0.5Y", // invalid duration, cant have fractions in year/month/day
  "P0.5M", // invalid duration, cant have fractions in year/month/day
  "P0.5D", // invalid duration, cant have fractions in year/month/day
  "PT0,2H0,1S", // only smallest number can be fractional
].forEach((value) => {
  test(`Validate !ok duration (${value}) against Temporal.Duration`, () => {
    const errExpected = tryCatch(() => Temporal.Duration.from(value));
    assert.not.equal(errExpected, null);
    const errActual = tryCatch(() => parse(value));
    assert.not.equal(
      errActual,
      null,
      `Should have thrown: "${errExpected.toString()}"`
    );
    // Assert
    assert.equal(errActual.message, errExpected.message);
  });
});

test("Parse: correctly parses data-time format", () => {
  const time = parse("P2Y4M6DT14H30M20.42S");
  assert.is(time.years, 2);
  assert.is(time.months, 4);
  assert.is(time.days, 6);
  assert.is(time.hours, 14);
  assert.is(time.minutes, 30);
  assert.is(time.seconds, 20.42);
});

test("parse: allow any number of decimals", () => {
  const time = parse("PT16.239999S");

  assert.is(time.weeks, 0);
  assert.is(time.years, 0);
  assert.is(time.months, 0);
  assert.is(time.days, 0);
  assert.is(time.hours, 0);
  assert.is(time.minutes, 0);
  assert.is(time.seconds, 16.239999);
});

test("end: returns the following day", () => {
  const now = new Date();
  const then = end(parse("P1D"), now);
  const expectedThen = new Date(now.getTime() + 86400 * 1000);
  assert.is(then.getTime(), expectedThen.getTime());
});

test("toSeconds: returns simple HMS time in total seconds", () => {
  const res = toSeconds(parse("PT1H2M5.512S"));
  const expected = 3600 + 2 * 60 + 5.512;
  assert.is(res, expected);
});

test("toSeconds: returns calendar time (YMD) diff in seconds", () => {
  const res = toSeconds(parse("P4Y2M8D"));
  const timestamp = Date.now();
  const d = new Date(timestamp);

  d.setFullYear(d.getFullYear() + 4);
  d.setMonth(d.getMonth() + 2);
  d.setDate(d.getDate() + 8);

  const expected = (d.getTime() - new Date(timestamp).getTime()) / 1000;
  assert.is(res, expected);
});

test("toSeconds: return weeks in total seconds", () => {
  const res = toSeconds(parse("P3W"));
  const timestamp = Date.now();
  const d = new Date(timestamp);
  d.setDate(d.getDate() + 7 * 3);
  const expected = (d.getTime() - new Date(timestamp).getTime()) / 1000;
  assert.is(res, expected);
});

test("toSeconds: with supplied start date", () => {
  // Arrange
  const firstOfJanuary = new Date(2016, 0, 1);
  const firstOfFebruary = new Date(2016, 1, 1);
  const expectedJanDuration =
    (new Date(2016, 1, 2).getTime() - new Date(2016, 0, 1).getTime()) / 1000;
  const expectedFebDuration =
    (new Date(2016, 2, 2).getTime() - new Date(2016, 1, 1).getTime()) / 1000;

  // Act
  const durFromJan = toSeconds(parse("P1M1D"), firstOfJanuary);
  const durFromFeb = toSeconds(parse("P1M1D"), firstOfFebruary);

  // Assert
  assert.ok(durFromJan > durFromFeb);
  assert.is(durFromJan, expectedJanDuration);
  assert.is(durFromFeb, expectedFebDuration);
});

test("usage example test", () => {
  // Arrange
  const jsonString = JSON.stringify({
    foo: { duration: "PT1H30M25S" },
    bar: { duration: "PT43M58.72S" },
  });
  // Create new regex from pattern and include surrounding double-quotes
  const globalRegex = new RegExp(`\\"${pattern.source}\\"`, "g");

  // Act
  const result = JSON.parse(
    // @ts-expect-error
    jsonString.replace(globalRegex, (m) => {
      return toSeconds(parse(m));
    })
  );

  // Assert
  assert.is(result.foo.duration, 3600 + 30 * 60 + 25);
  assert.is(result.bar.duration, 43 * 60 + 58.72);
});

test("expose vulnerable time calculation in toSeconds", () => {
  const dur = {
    weeks: 0,
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  Array.from({ length: 10000 }, () => {
    const sec = toSeconds(dur);
    assert.is(sec, 0);
  });
});

test("optional arguments for time calculation in toSeconds", () => {
  const sec = toSeconds({
    minutes: 3,
  });

  assert.is(sec, 180);
});

test.run();

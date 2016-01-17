import test from 'ava';
import {parse, toSeconds, pattern} from '../src/index.es6';

test('Parse: correctly parses data-time format', t => {
	const time = parse('P2Y4M6DT14H30M20.42S');

	t.same(2, time.years);
	t.same(4, time.months);
	t.same(6, time.days);
	t.same(14, time.hours);
	t.same(30, time.minutes);
	t.same(20.42, time.seconds);
});

test('Parse: correctly parses weeks format', t => {
	const time = parse('P3W1Y4M6DT14H30M20.42S');

	t.same(3, time.weeks);
	t.same(0, time.years);
	t.same(0, time.months);
	t.same(0, time.days);
	t.same(0, time.hours);
	t.same(0, time.minutes);
	t.same(0, time.seconds);
});

test('toSeconds: returns simple HMS time in total seconds', t => {
	const res = toSeconds(parse('PT1H2M5.512S'));
	const expected = 3600 + (2 * 60) + 5.512;
	t.is(res, expected);
});

test('toSeconds: returns calendar time (YMD) diff in seconds', t => {
	const res = toSeconds(parse('P4Y2M8D'));
	const timestamp = Date.now();
	const d = new Date(timestamp);

	d.setFullYear(d.getFullYear() + 4);
	d.setMonth(d.getMonth() + 2);
	d.setDate(d.getDate() + 8);

	const expected = (d.getTime() - (new Date(timestamp)).getTime()) / 1000;
	t.is(res, expected);
});

test('toSeconds: return weeks in total seconds', t => {
	const res = toSeconds(parse('P3W'));
	const timestamp = Date.now();
	const d = new Date(timestamp);
	d.setDate(d.getDate() + (7 * 3));
	const expected = (d.getTime() - (new Date(timestamp).getTime())) / 1000;
	t.ok(res, expected);
});

test('toSeconds: with supplied start date', t => {
	// Arrange
	const firstOfJanuary = new Date(2016, 0, 1);
	const firstOfFebruary = new Date(2016, 1, 1);
	const expectedJanDuration = ((new Date(2016, 1, 2)).getTime() - (new Date(2016, 0, 1)).getTime()) / 1000;
	const expectedFebDuration = ((new Date(2016, 2, 2)).getTime() - (new Date(2016, 1, 1)).getTime()) / 1000;

	// Act
	const durFromJan = toSeconds(parse('P1M1D'), firstOfJanuary);
	const durFromFeb = toSeconds(parse('P1M1D'), firstOfFebruary);

	// Assert
	t.ok(durFromJan > durFromFeb);
	t.same(expectedJanDuration, durFromJan);
	t.same(expectedFebDuration, durFromFeb);
});

test('usage example test', t => {
	// Arrange
	const jsonString = JSON.stringify({
		foo: {duration: 'PT1H30M25S'},
		bar: {duration: 'PT43M58.72S'}
	});
	// Create new regex from pattern and include surrounding double-quotes
	const globalRegex = new RegExp(`\\"${pattern.source}\\"`, 'g');

	// Act
	const result = JSON.parse(jsonString.replace(globalRegex, m => {
		return toSeconds(parse(m));
	}));

	// Assert
	t.same(result.foo.duration, 3600 + (30 * 60) + 25);
	t.same(result.bar.duration, 43 * 60 + 58.72);
});

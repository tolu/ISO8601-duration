import test from 'ava';
import * as duration from '../src/iso8601-duration';

test('Parse: correctly parses data-time format', t => {
	const time = duration.parse('P2Y4M6DT14H30M20.42S');

	t.same(2, time.years);
	t.same(4, time.months);
	t.same(6, time.days);
	t.same(14, time.hours);
	t.same(30, time.minutes);
	t.same(20.42, time.seconds);
});

test('Parse: correctly parses weeks format', t => {
	const time = duration.parse('P3W1Y4M6DT14H30M20.42S');

	t.same(3, time.weeks);
	t.same(0, time.years);
	t.same(0, time.months);
	t.same(0, time.days);
	t.same(0, time.hours);
	t.same(0, time.minutes);
	t.same(0, time.seconds);
});

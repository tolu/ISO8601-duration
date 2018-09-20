import {toSeconds, parse, end, pattern} from '../index';

// Simple typescript compile test, not actually run as a test
const duration = parse('P1Y2M4DT20H44M12.67S');
const seconds = toSeconds(duration);
const endDate = end(duration);
const isIso8601Date = pattern.test('P1Y2M4DT20H44M12.67S');

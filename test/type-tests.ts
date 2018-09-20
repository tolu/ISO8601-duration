import iso8601, {parse, toSeconds, end, pattern} from '../index';

// Simple typescript compile test, not actually run as a test

iso8601.parse('P1Y2M4DT20H44M12.67S');
const duration = parse('P1Y2M4DT20H44M12.67S');
const seconds = toSeconds(duration);
const endDate = end(duration);
const isIso8601Date = pattern.test('P1Y2M4DT20H44M12.67S');

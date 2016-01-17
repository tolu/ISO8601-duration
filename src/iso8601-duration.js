/**
 * @description A module for parsing ISO8601 durations
 */

/**
 * The pattern used for parsing ISO8601 duration (PnYnMnDTnHnMnS).
 * This does not cover the week format PnW.
 */

// PnYnMnDTnHnMnS
const numbers = '\\d+(?:[\\.,]\\d{0,3})?';
const weekPattern = `(${numbers}W)`;
const datePattern = `(${numbers}Y)?(${numbers}M)?(${numbers}D)?`;
const timePattern = `T(${numbers}H)?(${numbers}M)?(${numbers}S)?`;

const iso8601 = `P(?:${weekPattern}|${datePattern}(?:${timePattern})?)`;
const pattern = new RegExp(iso8601);

const objMap = ['weeks', 'years', 'months', 'days', 'hours', 'minutes', 'seconds'];

/** Parse PnYnMnDTnHnMnS format
 * @return {Object} - With a property for each part of the pattern
 */
export const parse = duration => {
	return duration.match(pattern).slice(1).reduce((prev, next, idx) => {
		prev[objMap[idx]] = parseFloat(next) || 0;
		return prev;
	}, {});
};

export default {
	pattern,
	parse
};

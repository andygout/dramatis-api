const YEAR_MIN_VALUE = 0;
const YEAR_MAX_VALUE = 9999;

export const isValidYear = year =>
	(parseInt(year) || year === 0) &&
	(year >= YEAR_MIN_VALUE) &&
	(year <= YEAR_MAX_VALUE);

import { BCE_CE_DATE_STRING_REGEX, CE_DATE_STRING_REGEX } from '../utils/constants.js';

const isValidDate = (dateString, opts = {}) => {
	const dateStringRegex = opts.includeBce ? BCE_CE_DATE_STRING_REGEX : CE_DATE_STRING_REGEX;

	const match = dateString.match(dateStringRegex);

	if (!match) {
		return false;
	}

	const [, yearString, monthString, dayString] = match;

	const yearNumber = Number(yearString);

	const monthNumber = Number(monthString);

	const dayNumber = Number(dayString);

	// No year zero exists for historical years.
	if (yearNumber === 0) {
		return false;
	}

	const date = new Date(0);

	// JavaScript counts months 0-11, ∴ `monthNumber - 1`.
	date.setUTCFullYear(yearNumber, monthNumber - 1, dayNumber);
	date.setUTCHours(0, 0, 0, 0);

	return (
		date.getUTCFullYear() === yearNumber &&
		// JavaScript counts months 0-11, ∴ `monthNumber - 1`.
		date.getUTCMonth() === monthNumber - 1 &&
		date.getUTCDate() === dayNumber
	);
}

export default isValidDate;

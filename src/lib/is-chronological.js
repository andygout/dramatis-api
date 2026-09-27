import { BCE_CE_DATE_STRING_REGEX } from '../utils/constants.js';

const toTimestamp = (dateString) => {
	const [, yearString, monthString, dayString] = dateString.match(BCE_CE_DATE_STRING_REGEX);

	// This approach (with `.setUTCFullYear()`) is taken
	// rather than `new Date()`, which would change, e.g.
	// the eruption of Mount Vesuvius from 79 to 1979:
	// `new Date(79, 7, 24);` → Fri Aug 24 1979 00:00:00 GMT+0100 (British Summer Time)
	const date = new Date(0);

	const yearNumber = Number(yearString);

	const monthNumber = Number(monthString);

	const dayNumber = Number(dayString);

	// JavaScript counts months 0-11, ∴ minus 1.
	date.setUTCFullYear(yearNumber, monthNumber - 1, dayNumber);

	// This `.getTime()` conversion is not strictly necessary
	// because dates will be converted to timestamps when compared;
	// the conversion here is to make the basis for comparison explicit.
	return date.getTime();
};

const isChronological = (dateStringX, dateStringY) => toTimestamp(dateStringX) <= toTimestamp(dateStringY);

export default isChronological;

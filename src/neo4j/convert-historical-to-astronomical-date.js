import { BCE_CE_DATE_STRING_REGEX } from '../utils/constants.js';

// Historical → Astronomical
// 3 BCE → -2
// 2 BCE → -1
// 1 BCE → 0
// 1 CE → 1
// 2 CE → 2
// 3 CE → 3

const convertHistoricalToAstronomicalDate = (historicalDate) => {
	const [, yearString, monthString, dayString] = historicalDate.match(BCE_CE_DATE_STRING_REGEX);

	const isBce = Number(yearString) < 0;

	if (isBce) {
		// Neo4j uses astronomical years (i.e. has a year 0) and so expresses:
		// • 1178 BCE as -1177, ∴ convert -1178 to -1177
		// • 44 BCE as -43, ∴ convert -0044 to -0043
		// • 3 BCE as -2, ∴ convert -0003 to -0002
		// • 2 BCE as -1, ∴ convert -0002 to -0001
		// • 1 BCE as 0, ∴ convert -0001 to 0000
		const year = Number(yearString) + 1;

		let paddedYearString = `${String(Math.abs(year)).padStart(4, '0')}`;

		if (year < 0) {
			paddedYearString = `-${paddedYearString}`;
		}

		const astronomicalDate = `${paddedYearString}-${monthString}-${dayString}`;

		return astronomicalDate;
	} else {
		return historicalDate;
	}
};

export default convertHistoricalToAstronomicalDate;

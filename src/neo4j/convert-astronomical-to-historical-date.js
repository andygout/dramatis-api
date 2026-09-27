// Historical → Astronomical
// 3 BCE → -2
// 2 BCE → -1
// 1 BCE → 0
// 1 CE → 1
// 2 CE → 2
// 3 CE → 3

const convertAstronomicalToHistoricalDate = (astronomicalDate) => {
	const isYearBce = astronomicalDate.year.toNumber() <= 0;

	if (isYearBce) {
		// Neo4j uses astronomical years (i.e. has a year 0) and so expresses:
		// • 1178 BCE as -1177, ∴ convert -1177 to -1178
		// • 44 BCE as -43, ∴ convert -43 to -0044
		// • 3 BCE as -2, ∴ convert -2 to -0003
		// • 2 BCE as -1, ∴ convert -1 to -0002
		// • 1 BCE as 0, ∴ convert 0 to -0001
		const year = astronomicalDate.year.toNumber() - 1;

		const month = astronomicalDate.month.toNumber();

		const day = astronomicalDate.day.toNumber();

		const paddedYearString = `-${String(Math.abs(year)).padStart(4, '0')}`;

		const paddedMonthString = String(month).padStart(2, '0');

		const paddedDayString = String(day).padStart(2, '0');

		const historicalDate = `${paddedYearString}-${paddedMonthString}-${paddedDayString}`;

		return historicalDate;
	} else {
		return astronomicalDate.toString();
	}
};

export default convertAstronomicalToHistoricalDate;

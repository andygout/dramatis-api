import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import convertHistoricalToAstronomicalDate from '../../../src/neo4j/convert-historical-to-astronomical-date.js';

const context = describe;

describe('Convert Historical To Astronomical Date module', () => {
	context('year of historical date is non-existent BCE (Before the Common Era)/CE (Common Era) year', () => {
		// This scenario should not occur: prior validation should reject year minus zero and
		// prevent it from being provided as an argument.
		context('year of historical date is a non-existent BCE/CE year: -0000', () => {
			it('returns the input value', () => {
				const inputValue = '-0000-05-02';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '-0000-05-02');
			});
		});

		// This scenario should not occur: prior validation should reject year zero and
		// prevent it from being provided as an argument.
		context('year of historical date is a non-existent BCE/CE year: 0000', () => {
			it('returns the input value', () => {
				const inputValue = '0000-05-02';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '0000-05-02');
			});
		});
	});

	context('year of historical date is BCE (Before the Common Era)', () => {
		context('year of historical date has no leading zeros and four digits: -1178', () => {
			it('increments date by one year', () => {
				// Return of Odysseus.
				const inputValue = '-1178-04-16';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '-1177-04-16');
			});
		});

		context('year of historical date has one leading zero and three digits: -0551', () => {
			it('increments date by one year', () => {
				// Birth of Confucius.
				const inputValue = '-0551-09-28';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '-0550-09-28');
			});
		});

		context('year of historical date has two leading zeros and two digits: -0044', () => {
			it('increments date by one year', () => {
				// Assassination of Julius Caesar.
				const inputValue = '-0044-03-15';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '-0043-03-15');
			});
		});

		context('year of historical date has three leading zeros and one digit: -0009', () => {
			it('increments date by one year', () => {
				// Consecration of the Altar of Augustan Peace.
				const inputValue = '-0009-01-30';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '-0008-01-30');
			});
		});

		context('year of historical date is the final BCE year: -0001', () => {
			it('increments date by one year', () => {
				const inputValue = '-0001-05-02';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '0000-05-02');
			});
		});
	});

	context('year of historical date is CE (Common Era)', () => {
		context('year of historical date has three leading zeros and one digit: 0009', () => {
			it('returns the input value', () => {
				// // Augustus adopts Tiberius.
				const inputValue = '0004-06-26';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '0004-06-26');
			});
		});

		context('year of historical date has two leading zeros and two digits: 0079', () => {
			it('returns the input value', () => {
				// Mount Vesuvius erupts.
				const inputValue = '0079-08-24';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '0079-08-24');
			});
		});

		context('year of historical date has one leading zero and three digits: 0793', () => {
			it('returns the input value', () => {
				// The Viking Raid on Lindisfarne.
				const inputValue = '0793-06-08';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '0793-06-08');
			});
		});

		context('year of historical date has no leading zeros and four digits: 1972', () => {
			it('returns the input value', () => {
				// Watergate scandal.
				const inputValue = '1972-06-17';

				const result = convertHistoricalToAstronomicalDate(inputValue);

				assert.equal(result, '1972-06-17');
			});
		});
	});
});

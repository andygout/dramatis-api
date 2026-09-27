import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import neo4j from 'neo4j-driver';

import convertAstronomicalToHistoricalDate from '../../../src/neo4j/convert-astronomical-to-historical-date.js';

const context = describe;

describe('Convert Astronomical To Historical Date module', () => {
	context('year of astronomical date is negative', () => {
		context('year of astronomical date is four digits long: -1177', () => {
			it('decrements date by one year and returns in YYYY-MM-DD format', () => {
				// Return of Odysseus.
				const inputValue = new neo4j.types.Date(neo4j.int(-1177), neo4j.int(4), neo4j.int(16));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '-1178-04-16');
			});
		});

		context('year of astronomical date is three digits long: -550', () => {
			it('decrements date by one year and returns in YYYY-MM-DD format', () => {
				// Birth of Confucius.
				const inputValue = new neo4j.types.Date(neo4j.int(-550), neo4j.int(9), neo4j.int(28));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '-0551-09-28');
			});
		});

		context('year of astronomical date is two digits long: -43', () => {
			it('decrements date by one year and returns in YYYY-MM-DD format', () => {
				// Assassination of Julius Caesar.
				const inputValue = new neo4j.types.Date(neo4j.int(-43), neo4j.int(3), neo4j.int(15));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '-0044-03-15');
			});
		});

		context('year of astronomical date is one digit long: -8', () => {
			it('decrements date by one year and returns in YYYY-MM-DD format', () => {
				// Consecration of the Altar of Augustan Peace.
				const inputValue = new neo4j.types.Date(neo4j.int(-8), neo4j.int(1), neo4j.int(30));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '-0009-01-30');
			});
		});
	});

	context('year of astronomical date is neither positive nor negative', () => {
		// This scenario is hypothetical: validation should prevent
		// year minus zero from being inserted into the database.
		context('year of astronomical date is year minus zero: -0', () => {
			it('decrements date by one year and returns in YYYY-MM-DD format', () => {
				const inputValue = new neo4j.types.Date(neo4j.int(-0), neo4j.int(5), neo4j.int(2));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '-0001-05-02');
			});
		});

		context('year of astronomical date is year zero: 0', () => {
			it('decrements date by one year and returns in YYYY-MM-DD format', () => {
				const inputValue = new neo4j.types.Date(neo4j.int(0), neo4j.int(5), neo4j.int(2));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '-0001-05-02');
			});
		});
	});

	context('year of astronomical date is positive', () => {
		context('year of astronomical date is year one: 1', () => {
			it('persists the year value and returns in YYYY-MM-DD format', () => {
				const inputValue = new neo4j.types.Date(neo4j.int(1), neo4j.int(5), neo4j.int(2));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '0001-05-02');
			});
		});

		context('year of astronomical date is one digit long: 9', () => {
			it('persists the year value and returns in YYYY-MM-DD format', () => {
				// Augustus adopts Tiberius.
				const inputValue = new neo4j.types.Date(neo4j.int(4), neo4j.int(6), neo4j.int(26));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '0004-06-26');
			});
		});

		context('year of astronomical date is two digits long: 79', () => {
			it('persists the year value and returns in YYYY-MM-DD format', () => {
				// Mount Vesuvius erupts.
				const inputValue = new neo4j.types.Date(neo4j.int(79), neo4j.int(8), neo4j.int(24));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '0079-08-24');
			});
		});

		context('year of astronomical date is three digits long: 793', () => {
			it('persists the year value and returns in YYYY-MM-DD format', () => {
				// The Viking Raid on Lindisfarne.
				const inputValue = new neo4j.types.Date(neo4j.int(793), neo4j.int(6), neo4j.int(8));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '0793-06-08');
			});
		});

		context('year of astronomical date is four digits long: 1972', () => {
			it('persists the year value and returns in YYYY-MM-DD format', () => {
				// Watergate scandal.
				const inputValue = new neo4j.types.Date(neo4j.int(1972), neo4j.int(6), neo4j.int(17));

				const result = convertAstronomicalToHistoricalDate(inputValue);

				assert.equal(result, '1972-06-17');
			});
		});
	});
});

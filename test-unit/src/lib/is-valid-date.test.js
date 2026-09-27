import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import isValidDate from '../../../src/lib/is-valid-date.js';

const context = describe;

describe('Is Valid Date module', () => {
	context('BCE (Before Common Era) dates are excluded (by omission of `includeBce` option)', () => {
		context('valid date', () => {
			describe('string is a date in YYYY-MM-DD format', () => {
				it('returns true', () => {
					assert.equal(isValidDate('2020-04-16'), true);
				});
			});
		});

		context('invalid date', () => {
			describe('string is empty', () => {
				it('returns false', () => {
					assert.equal(isValidDate(''), false);
				});
			});

			describe('string is not a date', () => {
				it('returns false', () => {
					assert.equal(isValidDate('foobar'), false);
				});
			});

			describe('string is a date in DD-MM-YYYY format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('16-04-2020'), false);
				});
			});

			describe('string is a date in MM-DD-YYYY format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('04-16-2020'), false);
				});
			});

			describe('string is a date in YY-MM-DD format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('20-04-16'), false);
				});
			});

			describe('string is a date in -YYYY-MM-DD format', () => {
				it('returns true', () => {
					assert.equal(isValidDate('-1178-04-16'), false);
				});
			});

			describe('string is a date in -YY-MM-DD format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('-44-03-15'), false);
				});
			});

			describe('string is a date in YYYY-MM-DD format but month and date are invalid', () => {
				it('returns false', () => {
					assert.equal(isValidDate('1962-00-00'), false); // Days and months cannot be zero.
					assert.equal(isValidDate('1962-02-29'), false); // 1962 was not a leap year.
					assert.equal(isValidDate('1962-04-31'), false); // April only has 30 days.
					assert.equal(isValidDate('1962-13-32'), false); // There are only 12 months with a maximum of 31 days.
				});
			});

			describe('string is a date in YYYY-MM-DD format but year is zero', () => {
				it('returns false', () => {
					assert.equal(isValidDate('0000-01-01'), false);
					assert.equal(isValidDate('-0000-01-01'), false);
				});
			});
		});
	});

	context('BCE (Before Common Era) dates are included', () => {
		context('valid date', () => {
			describe('string is a date in YYYY-MM-DD format', () => {
				it('returns true', () => {
					assert.equal(isValidDate('2020-04-16', { includeBce: true }), true);
				});
			});

			describe('string is a date in -YYYY-MM-DD format', () => {
				it('returns true', () => {
					assert.equal(isValidDate('-1178-04-16', { includeBce: true }), true);
				});
			});
		});

		context('invalid date', () => {
			describe('string is empty', () => {
				it('returns false', () => {
					assert.equal(isValidDate('', { includeBce: true }), false);
				});
			});

			describe('string is not a date', () => {
				it('returns false', () => {
					assert.equal(isValidDate('foobar', { includeBce: true }), false);
				});
			});

			describe('string is a date in DD-MM-YYYY format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('16-04-2020', { includeBce: true }), false);
				});
			});

			describe('string is a date in MM-DD-YYYY format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('04-16-2020', { includeBce: true }), false);
				});
			});

			describe('string is a date in YY-MM-DD format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('20-04-16', { includeBce: true }), false);
				});
			});

			describe('string is a date in -YY-MM-DD format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('-44-03-15', { includeBce: true }), false);
				});
			});

			describe('string is a date in YYYY-MM-DD format but month and date are invalid', () => {
				it('returns false', () => {
					assert.equal(isValidDate('1962-00-00', { includeBce: true }), false); // Days and months cannot be zero.
					assert.equal(isValidDate('1962-02-29', { includeBce: true }), false); // 1962 was not a leap year.
					assert.equal(isValidDate('1962-04-31', { includeBce: true }), false); // April only has 30 days.
					assert.equal(isValidDate('1962-13-32', { includeBce: true }), false); // There are only 12 months with a maximum of 31 days.
				});
			});

			describe('string is a date in YYYY-MM-DD format but year is zero', () => {
				it('returns false', () => {
					assert.equal(isValidDate('0000-01-01', { includeBce: true }), false);
					assert.equal(isValidDate('-0000-01-01', { includeBce: true }), false);
				});
			});
		});
	});
});

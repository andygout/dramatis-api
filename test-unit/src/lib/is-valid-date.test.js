import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import isValidDate from '../../../src/lib/is-valid-date.js';

const context = describe;

describe('Is Valid Date module', () => {
	context('BCE (Before Common Era) dates are disallowed (by omission of `allowBce` option)', () => {
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

	context('BCE (Before Common Era) dates are allowed (by presence of `allowBce` option set to `true`)', () => {
		context('valid date', () => {
			describe('string is a date in YYYY-MM-DD format', () => {
				it('returns true', () => {
					assert.equal(isValidDate('2020-04-16', { allowBce: true }), true);
				});
			});

			describe('string is a date in -YYYY-MM-DD format', () => {
				it('returns true', () => {
					assert.equal(isValidDate('-1178-04-16', { allowBce: true }), true);
				});
			});
		});

		context('invalid date', () => {
			describe('string is empty', () => {
				it('returns false', () => {
					assert.equal(isValidDate('', { allowBce: true }), false);
				});
			});

			describe('string is not a date', () => {
				it('returns false', () => {
					assert.equal(isValidDate('foobar', { allowBce: true }), false);
				});
			});

			describe('string is a date in DD-MM-YYYY format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('16-04-2020', { allowBce: true }), false);
				});
			});

			describe('string is a date in MM-DD-YYYY format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('04-16-2020', { allowBce: true }), false);
				});
			});

			describe('string is a date in YY-MM-DD format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('20-04-16', { allowBce: true }), false);
				});
			});

			describe('string is a date in -YY-MM-DD format', () => {
				it('returns false', () => {
					assert.equal(isValidDate('-44-03-15', { allowBce: true }), false);
				});
			});

			describe('string is a date in YYYY-MM-DD format but month and date are invalid', () => {
				it('returns false', () => {
					assert.equal(isValidDate('1962-00-00', { allowBce: true }), false); // Days and months cannot be zero.
					assert.equal(isValidDate('1962-02-29', { allowBce: true }), false); // 1962 was not a leap year.
					assert.equal(isValidDate('1962-04-31', { allowBce: true }), false); // April only has 30 days.
					assert.equal(isValidDate('1962-13-32', { allowBce: true }), false); // There are only 12 months with a maximum of 31 days.
				});
			});

			describe('string is a date in YYYY-MM-DD format but year is zero', () => {
				it('returns false', () => {
					assert.equal(isValidDate('0000-01-01', { allowBce: true }), false);
					assert.equal(isValidDate('-0000-01-01', { allowBce: true }), false);
				});
			});
		});
	});
});

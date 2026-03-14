import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import isValidDate from '../../../src/lib/is-valid-date.js';

describe('Is Valid Date module', () => {
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

	describe('string is a date in YYYY-MM-DD format', () => {
		it('returns true', () => {
			assert.equal(isValidDate('2020-04-16'), true);
		});
	});

	describe('string is a date in MM-DD-YYYY format', () => {
		it('returns true', () => {
			assert.equal(isValidDate('04-16-2020'), true);
		});
	});
});

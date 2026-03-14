import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import isValidYear from '../../../src/lib/is-valid-year.js';

describe('Is Valid Year module', () => {
	describe('year cannot be parsed as integer', () => {
		it('returns false', () => {
			assert.equal(isValidYear('Nineteen Fifty-Nine'), false);
		});
	});

	describe('year is less than 0', () => {
		it('returns false', () => {
			assert.equal(isValidYear(-1), false);
		});
	});

	describe('year is more than 9999', () => {
		it('returns false', () => {
			assert.equal(isValidYear(10000), false);
		});
	});

	describe('year is 0', () => {
		it('returns true', () => {
			assert.equal(isValidYear(0), true);
		});
	});

	describe('year is 9999', () => {
		it('returns true', () => {
			assert.equal(isValidYear(9999), true);
		});
	});
});

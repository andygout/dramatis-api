import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import isValidYear from '../../../src/lib/is-valid-year.js';

const context = describe;

describe('Is Valid Year module', () => {
	context('input value is valid year', () => {
		context('year is 0', () => {
			it('returns true', () => {
				assert.equal(isValidYear(0), true);
			});
		});

		context('year is 9999', () => {
			it('returns true', () => {
				assert.equal(isValidYear(9999), true);
			});
		});
	});

	context('input value is not valid year', () => {
		context('year cannot be parsed as integer', () => {
			it('returns false', () => {
				assert.equal(isValidYear('Nineteen Fifty-Nine'), false);
			});
		});

		context('year is less than 0', () => {
			it('returns false', () => {
				assert.equal(isValidYear(-1), false);
			});
		});

		context('year is more than 9999', () => {
			it('returns false', () => {
				assert.equal(isValidYear(10000), false);
			});
		});
	});
});

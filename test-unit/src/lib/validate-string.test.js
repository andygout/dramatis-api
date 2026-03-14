import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import validateString from '../../../src/lib/validate-string.js';

const STRING_MAX_LENGTH = 1000;
const MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH);
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Validate String module', () => {
	describe('string is empty', () => {
		describe('string is required', () => {
			it('returns error text explaining that value is too short', () => {
				assert.equal(validateString('', { isRequired: true }), 'Value is too short');
			});
		});

		describe('string is not required', () => {
			it('returns undefined', () => {
				assert.equal(validateString('', { isRequired: false }), undefined);
			});
		});
	});

	describe('string is not empty and does not exceed maximum length', () => {
		describe('string is required', () => {
			it('returns undefined', () => {
				assert.equal(validateString(MAX_LENGTH_STRING, { isRequired: true }), undefined);
			});
		});

		describe('string is not required', () => {
			it('returns undefined', () => {
				assert.equal(validateString(MAX_LENGTH_STRING, { isRequired: false }), undefined);
			});
		});
	});

	describe('string exceeds maximum length', () => {
		describe('string is required', () => {
			it('returns error text explaining that value is too long', () => {
				assert.equal(validateString(ABOVE_MAX_LENGTH_STRING, { isRequired: true }), 'Value is too long');
			});
		});

		describe('string is not required', () => {
			it('returns error text explaining that value is too long', () => {
				assert.equal(validateString(ABOVE_MAX_LENGTH_STRING, { isRequired: false }), 'Value is too long');
			});
		});
	});

	describe('given value is null', () => {
		describe('string is required', () => {
			it('returns error text explaining that value is too short', () => {
				assert.equal(validateString(null, { isRequired: true }), 'Value is too short');
			});
		});

		describe('string is not required', () => {
			it('returns undefined', () => {
				assert.equal(validateString(null, { isRequired: false }), undefined);
			});
		});
	});
});

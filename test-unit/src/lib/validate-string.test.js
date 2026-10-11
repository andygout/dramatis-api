import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import validateString from '../../../src/lib/validate-string.js';

const STRING_MAX_LENGTH = 1000;
const MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH);
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

const context = describe;

describe('Validate String module', () => {
	context('string is empty', () => {
		context('string is required', () => {
			it('returns error text explaining that value is too short', () => {
				assert.equal(validateString('', { isRequired: true }), 'Value is too short');
			});
		});

		context('string is not required', () => {
			it('returns undefined', () => {
				assert.equal(validateString('', { isRequired: false }), undefined);
			});
		});
	});

	context('string is not empty and does not exceed maximum length', () => {
		context('string is required', () => {
			it('returns undefined', () => {
				assert.equal(validateString(MAX_LENGTH_STRING, { isRequired: true }), undefined);
			});
		});

		context('string is not required', () => {
			it('returns undefined', () => {
				assert.equal(validateString(MAX_LENGTH_STRING, { isRequired: false }), undefined);
			});
		});
	});

	context('string exceeds maximum length', () => {
		context('string is required', () => {
			it('returns error text explaining that value is too long', () => {
				assert.equal(validateString(ABOVE_MAX_LENGTH_STRING, { isRequired: true }), 'Value is too long');
			});
		});

		context('string is not required', () => {
			it('returns error text explaining that value is too long', () => {
				assert.equal(validateString(ABOVE_MAX_LENGTH_STRING, { isRequired: false }), 'Value is too long');
			});
		});
	});

	context('given value is null', () => {
		context('string is required', () => {
			it('returns error text explaining that value is too short', () => {
				assert.equal(validateString(null, { isRequired: true }), 'Value is too short');
			});
		});

		context('string is not required', () => {
			it('returns undefined', () => {
				assert.equal(validateString(null, { isRequired: false }), undefined);
			});
		});
	});
});

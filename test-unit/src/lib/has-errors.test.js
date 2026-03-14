import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import hasErrors from '../../../src/lib/has-errors.js';

describe('Has Errors module', () => {
	describe('no valid error values present', () => {
		it('returns false if no error values present', () => {
			const instance = { errors: {}, venue: { errors: {} } };

			const result = hasErrors(instance);

			assert.equal(result, false);
		});

		it('returns false if no error properties present', () => {
			const instance = { notErrors: {} };

			const result = hasErrors(instance);

			assert.equal(result, false);
		});

		it('returns false if errors present in form of null value', () => {
			const instance = { errors: null };

			const result = hasErrors(instance);

			assert.equal(result, false);
		});

		it('returns false if errors present in form of array', () => {
			const instance = { errors: ['Value is too short'] };

			const result = hasErrors(instance);

			assert.equal(result, false);
		});
	});

	describe('top level errors present', () => {
		it('returns true', () => {
			const instance = { errors: { name: ['Value is too short'] } };

			const result = hasErrors(instance);

			assert.equal(result, true);
		});
	});

	describe('nested errors present', () => {
		it('returns true', () => {
			const instance = { venue: { errors: { name: ['Value is too short'] } } };

			const result = hasErrors(instance);

			assert.equal(result, true);
		});
	});

	describe('errors present in objects in arrays at top level', () => {
		it('returns true', () => {
			const instance = { cast: [{ errors: { name: ['Value is too short'] } }] };

			const result = hasErrors(instance);

			assert.equal(result, true);
		});
	});
});

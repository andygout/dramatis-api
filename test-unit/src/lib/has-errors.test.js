import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import hasErrors from '../../../src/lib/has-errors.js';

const context = describe;

describe('Has Errors module', () => {
	context('no valid error values present', () => {
		context('no error values present', () => {
			it('returns false', () => {
				const instance = { errors: {}, venue: { errors: {} } };

				const result = hasErrors(instance);

				assert.equal(result, false);
			});
		});

		context('no error properties present', () => {
			it('returns false', () => {
				const instance = { notErrors: {} };

				const result = hasErrors(instance);

				assert.equal(result, false);
			});
		});

		context('errors present in form of null value', () => {
			it('returns false', () => {
				const instance = { errors: null };

				const result = hasErrors(instance);

				assert.equal(result, false);
			});
		});

		context('errors present in form of array', () => {
			it('returns false', () => {
				const instance = { errors: ['Value is too short'] };

				const result = hasErrors(instance);

				assert.equal(result, false);
			});
		});
	});

	context('top level errors present', () => {
		it('returns true', () => {
			const instance = { errors: { name: ['Value is too short'] } };

			const result = hasErrors(instance);

			assert.equal(result, true);
		});
	});

	context('nested errors present', () => {
		it('returns true', () => {
			const instance = { venue: { errors: { name: ['Value is too short'] } } };

			const result = hasErrors(instance);

			assert.equal(result, true);
		});
	});

	context('errors present in objects in arrays at top level', () => {
		it('returns true', () => {
			const instance = { cast: [{ errors: { name: ['Value is too short'] } }] };

			const result = hasErrors(instance);

			assert.equal(result, true);
		});
	});
});

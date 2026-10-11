import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import isObjectWithKeys from '../../../src/lib/is-object-with-keys.js';

const context = describe;

describe('Is Object With Keys module', () => {
	context('input value is object with keys', () => {
		context('input value is object with keys', () => {
			it('returns true', () => {
				assert.equal(isObjectWithKeys({ key: 'value' }), true);
			});
		});
	});

	context('input value is not object with keys', () => {
		context('input value is null (which is type of object)', () => {
			it('returns false', () => {
				assert.equal(isObjectWithKeys(null), false);
			});
		});

		context('input value is empty array (which is type of object)', () => {
			it('returns false', () => {
				assert.equal(isObjectWithKeys([]), false);
			});
		});

		context('input value is populated array (which is type of object)', () => {
			it('returns false', () => {
				assert.equal(isObjectWithKeys([1, 2, 3]), false);
			});
		});

		context('input value is string', () => {
			it('returns false', () => {
				assert.equal(isObjectWithKeys('string'), false);
			});
		});

		context('input value is number', () => {
			it('returns false', () => {
				assert.equal(isObjectWithKeys(123), false);
			});
		});

		context('input value is object without keys', () => {
			it('returns false', () => {
				assert.equal(isObjectWithKeys({}), false);
			});
		});
	});
});

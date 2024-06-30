import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isObjectWithKeys from '../../../src/lib/is-object-with-keys.js';

describe('Is Object With Keys module', () => {

	it('considers object with keys as valid object', () => {

		assert.equal(isObjectWithKeys({ key: 'value' }), true);

	});

	it('will not consider null (which is type of object) as valid object', () => {

		assert.equal(isObjectWithKeys(null), false);

	});

	it('will not consider empty array (which is type of object) as valid object', () => {

		assert.equal(isObjectWithKeys([]), false);

	});

	it('will not consider populated array (which is type of object) as valid object', () => {

		assert.equal(isObjectWithKeys([1, 2, 3]), false);

	});

	it('will not consider string type as valid object', () => {

		assert.equal(isObjectWithKeys('string'), false);

	});

	it('will not consider number type as valid object', () => {

		assert.equal(isObjectWithKeys(123), false);

	});

	it('will not consider empty object (i.e. no keys) as valid object', () => {

		assert.equal(isObjectWithKeys({}), false);

	});

});

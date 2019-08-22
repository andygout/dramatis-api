import { expect } from 'chai';

import { isObject } from '../../../server/lib/is-object';

describe('Is Object module', () => {

	it('considers object with keys as valid object', () => {

		expect(isObject({ key: 'value' })).to.be.true;

	});

	it('will not consider null (which is type of object) as valid object', () => {

		expect(isObject(null)).to.be.false;

	});

	it('will not consider empty array (which is type of object) as valid object', () => {

		expect(isObject([])).to.be.false;

	});

	it('will not consider populated array (which is type of object) as valid object', () => {

		expect(isObject([1, 2, 3])).to.be.false;

	});

	it('will not consider string type as valid object', () => {

		expect(isObject('string')).to.be.false;

	});

	it('will not consider number type as valid object', () => {

		expect(isObject(123)).to.be.false;

	});

	it('will not consider empty object as valid object', () => {

		expect(isObject({})).to.be.false;

	});

});

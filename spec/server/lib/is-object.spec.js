import { expect } from 'chai';

import subject from '../../../server/lib/is-object';

describe('Is Object module', () => {

	it('considers object with keys as valid object', () => {

		expect(subject({ key: 'value' })).to.be.true;

	});

	it('will not consider null (which is type of object) as valid object', () => {

		expect(subject(null)).to.be.false;

	});

	it('will not consider empty array (which is type of object) as valid object', () => {

		expect(subject([])).to.be.false;

	});

	it('will not consider populated array (which is type of object) as valid object', () => {

		expect(subject([1, 2, 3])).to.be.false;

	});

	it('will not consider string type as valid object', () => {

		expect(subject('string')).to.be.false;

	});

	it('will not consider number type as valid object', () => {

		expect(subject(123)).to.be.false;

	});

	it('will not consider empty object as valid object', () => {

		expect(subject({})).to.be.false;

	});

});

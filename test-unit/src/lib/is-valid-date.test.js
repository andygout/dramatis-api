import { expect } from 'chai';

import { isValidDate } from '../../../src/lib/is-valid-date';

describe('Is Valid Date module', () => {

	context('string is empty', () => {

		it('returns false', () => {

			expect(isValidDate('')).to.equal(false);

		});

	});

	context('string is not a date', () => {

		it('returns false', () => {

			expect(isValidDate('foobar')).to.equal(false);

		});

	});

	context('string is a date in DD-MM-YYYY format', () => {

		it('returns false', () => {

			expect(isValidDate('16-04-2020')).to.equal(false);

		});

	});

	context('string is a date in YYYY-MM-DD format', () => {

		it('returns true', () => {

			expect(isValidDate('2020-04-16')).to.equal(true);

		});

	});

	context('string is a date in MM-DD-YYYY format', () => {

		it('returns true', () => {

			expect(isValidDate('04-16-2020')).to.equal(true);

		});

	});

});

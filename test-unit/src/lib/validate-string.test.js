import { expect } from 'chai';

import { validateString } from '../../../src/lib/validate-string';

describe('Validate String module', () => {

	const STRING_MAX_LENGTH = 1000;

	const emptyString = '';
	const maxLengthString = 'a'.repeat(STRING_MAX_LENGTH);
	const aboveMaxLengthString = 'a'.repeat(STRING_MAX_LENGTH + 1);

	context('string is empty', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(emptyString, true)).to.deep.eq(['Name is too short']);

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(emptyString, false)).to.deep.eq([]);

			});

		});

	});

	context('string is not empty and does not exceed maximum length', () => {

		context('string is required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(maxLengthString, true)).to.deep.eq([]);

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(maxLengthString, false)).to.deep.eq([]);

			});

		});

	});

	context('string exceeds maximum length', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(aboveMaxLengthString, true)).to.deep.eq(['Name is too long']);

			});

		});

		context('string is not required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(aboveMaxLengthString, false)).to.deep.eq(['Name is too long']);

			});

		});

	});

	context('given value is null', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(null, true)).to.deep.eq(['Name is too short']);

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(null, false)).to.deep.eq([]);

			});

		});

	});

});

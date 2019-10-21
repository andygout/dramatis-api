import { expect } from 'chai';

import { validateString } from '../../../server/lib/validate-string';

describe('Validate String module', () => {

	const STRING_MAX_LENGTH = 1000;

	const emptyString = '';
	const maxLengthString = 'a'.repeat(STRING_MAX_LENGTH);
	const aboveMaxLengthString = 'a'.repeat(STRING_MAX_LENGTH + 1);

	context('string is empty', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(emptyString, { required: true })).to.deep.eq(['Name is too short']);

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(emptyString)).to.deep.eq([]);

			});

		});

	});

	context('string is not empty and does not exceed maximum length', () => {

		context('string is required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(maxLengthString, { required: true })).to.deep.eq([]);

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(maxLengthString)).to.deep.eq([]);

			});

		});

	});

	context('string exceeds maximum length', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(aboveMaxLengthString, { required: true })).to.deep.eq(['Name is too long']);

			});

		});

		context('string is not required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(aboveMaxLengthString)).to.deep.eq(['Name is too long']);

			});

		});

	});

	context('given value is null', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(null, { required: true })).to.deep.eq(['Name is too short']);

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(null)).to.deep.eq([]);

			});

		});

	});

});

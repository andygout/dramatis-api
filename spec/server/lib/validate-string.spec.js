import { expect } from 'chai';

import constants from '../../../server/config/constants';
import { validateString } from '../../../server/lib/validate-string';

describe('Validate String module', () => {

	const validLengthString = 'a'.repeat(constants.STRING_MIN_LENGTH);
	const subMinLengthString = 'a'.repeat(constants.STRING_MIN_LENGTH - 1);
	const surMaxLengthString = 'a'.repeat(constants.STRING_MAX_LENGTH + 1);

	context('valid data', () => {

		context('string is required', () => {

			it('will not add error to stringErrors array if string is between minimum and maximum', () => {

				expect(validateString(validLengthString, { required: true })).to.deep.eq([]);

			});

		});

		context('string is not required', () => {

			it('will not add error to stringErrors array if string is between minimum and maximum', () => {

				expect(validateString(validLengthString)).to.deep.eq([]);

			});

			it('will not add error to stringErrors array if string is shorter than minimum', () => {

				expect(validateString(subMinLengthString)).to.deep.eq([]);

			});

		});

	});

	context('invalid data', () => {

		context('string is required', () => {

			it('adds error to stringErrors array if string is shorter than minimum', () => {

				expect(validateString(subMinLengthString, { required: true })).to.deep.eq(['Name is too short']);

			});

			it('adds error to stringErrors array if string is longer than maximum', () => {

				expect(validateString(surMaxLengthString, { required: true })).to.deep.eq(['Name is too long']);

			});

		});

		context('string is not required', () => {

			it('adds error to stringErrors array if string is longer than maximum', () => {

				expect(validateString(surMaxLengthString)).to.deep.eq(['Name is too long']);

			});

		});

	});

	context('null data', () => {

		context('string is required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(null, { required: true })).to.deep.eq([]);

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(null)).to.deep.eq([]);

			});

		});

	});

});

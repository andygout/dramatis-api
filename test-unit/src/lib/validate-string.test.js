import { expect } from 'chai';

import { validateString } from '../../../src/lib/validate-string';

describe('Validate String module', () => {

	const STRING_MAX_LENGTH = 1000;
	const MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH);
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	context('string is empty', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString('', { isRequiredString: true })).to.equal('Name is too short');

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString('', { isRequiredString: false })).to.equal(undefined);

			});

		});

	});

	context('string is not empty and does not exceed maximum length', () => {

		context('string is required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(MAX_LENGTH_STRING, { isRequiredString: true })).to.equal(undefined);

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(MAX_LENGTH_STRING, { isRequiredString: false })).to.equal(undefined);

			});

		});

	});

	context('string exceeds maximum length', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(
					validateString(ABOVE_MAX_LENGTH_STRING, { isRequiredString: true })
				).to.equal('Name is too long');

			});

		});

		context('string is not required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(
					validateString(ABOVE_MAX_LENGTH_STRING, { isRequiredString: false })
				).to.equal('Name is too long');

			});

		});

	});

	context('given value is null', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(null, { isRequiredString: true })).to.equal('Name is too short');

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(null, { isRequiredString: false })).to.equal(undefined);

			});

		});

	});

});

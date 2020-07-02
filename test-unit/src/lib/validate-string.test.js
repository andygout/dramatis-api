import { expect } from 'chai';

import { validateString } from '../../../src/lib/validate-string';

describe('Validate String module', () => {

	const STRING_MAX_LENGTH = 1000;
	const EMPTY_STRING = '';
	const MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH);
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	context('string is empty', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(EMPTY_STRING, true)).to.equal('Name is too short');

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(EMPTY_STRING, false)).to.equal(undefined);

			});

		});

	});

	context('string is not empty and does not exceed maximum length', () => {

		context('string is required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(MAX_LENGTH_STRING, true)).to.equal(undefined);

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(MAX_LENGTH_STRING, false)).to.equal(undefined);

			});

		});

	});

	context('string exceeds maximum length', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(ABOVE_MAX_LENGTH_STRING, true)).to.equal('Name is too long');

			});

		});

		context('string is not required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(ABOVE_MAX_LENGTH_STRING, false)).to.equal('Name is too long');

			});

		});

	});

	context('given value is null', () => {

		context('string is required', () => {

			it('adds error to and returns stringErrors array', () => {

				expect(validateString(null, true)).to.equal('Name is too short');

			});

		});

		context('string is not required', () => {

			it('returns empty stringErrors array', () => {

				expect(validateString(null, false)).to.equal(undefined);

			});

		});

	});

});

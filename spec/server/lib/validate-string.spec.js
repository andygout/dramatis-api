const expect = require('chai').expect;

const constants = require('../../../dist/config/constants');

const validLengthString = `${'a'.repeat(constants.STRING_MIN_LENGTH)}`;
const subMinLengthString = `${'a'.repeat(constants.STRING_MIN_LENGTH - 1)}`;
const surMaxLengthString = `${'a'.repeat(constants.STRING_MAX_LENGTH + 1)}`;

const subject = require('../../../dist/lib/validate-string');

describe('Validate String module', () => {

	context('valid data', () => {

		context('string is required', () => {

			it('will not add error to stringErrors array if string is between minimum and maximum', () => {

				expect(subject(validLengthString, { required: true })).to.deep.eq([]);

			});

		});

		context('string is not required', () => {

			it('will not add error to stringErrors array if string is between minimum and maximum', () => {

				expect(subject(validLengthString)).to.deep.eq([]);

			});

			it('will not add error to stringErrors array if string is shorter than minimum', () => {

				expect(subject(subMinLengthString)).to.deep.eq([]);

			});

		});

	});

	context('invalid data', () => {

		context('string is required', () => {

			it('will add error to stringErrors array if string is shorter than minimum', () => {

				expect(subject(subMinLengthString, { required: true })).to.deep.eq(['Name is too short']);

			});

			it('will add error to stringErrors array if string is longer than maximum', () => {

				expect(subject(surMaxLengthString, { required: true })).to.deep.eq(['Name is too long']);

			});

		});

		context('string is not required', () => {

			it('will add error to stringErrors array if string is longer than maximum', () => {

				expect(subject(surMaxLengthString)).to.deep.eq(['Name is too long']);

			});

		});

	});

	context('null data', () => {

		context('string is required', () => {

			it('will return empty stringErrors array', () => {

				expect(subject(null, { required: true })).to.deep.eq([]);

			});

		});

		context('string is not required', () => {

			it('will return empty stringErrors array', () => {

				expect(subject(null)).to.deep.eq([]);

			});

		});

	});

});

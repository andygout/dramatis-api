import { expect } from 'chai';

import { capitalise, pluralise } from '../../../src/lib/strings';

describe('Strings module', () => {

	describe('Capitalise function', () => {

		context('Input string is lowercase', () => {

			it('returns string with initial letter as capital', () => {

				expect(capitalise('string')).to.equal('String');

			});

		});

		context('Input string is uppercase', () => {

			it('returns string with initial letter as capital', () => {

				expect(capitalise('STRING')).to.equal('String');

			});

		});

	});

	describe('Pluralise function', () => {

		context('Model has regular plural noun', () => {

			it('returns singular noun with appended \'s\'', () => {

				expect(pluralise('production')).to.equal('productions');

			});

		});

		context('Model has irregular plural noun', () => {

			it('returns specific plural noun', () => {

				expect(pluralise('person')).to.equal('people');

			});

		});

	});

});

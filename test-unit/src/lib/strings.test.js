import { expect } from 'chai';

import { capitalise, pluralise } from '../../../src/lib/strings';

describe('Strings module', () => {

	describe('capitalise function', () => {

		context('input string is lowercase', () => {

			it('returns string with initial letter as capital', () => {

				expect(capitalise('string')).to.equal('String');

			});

		});

		context('input string is uppercase', () => {

			it('returns string with initial letter as capital', () => {

				expect(capitalise('STRING')).to.equal('String');

			});

		});

	});

	describe('pluralise function', () => {

		context('model has regular plural noun', () => {

			it('returns singular noun with appended \'s\'', () => {

				expect(pluralise('production')).to.equal('productions');

			});

		});

		context('model has irregular plural noun', () => {

			it('returns specific plural noun', () => {

				const nouns = [
					{ singular: 'person', plural: 'people' },
					{ singular: 'company', plural: 'companies' }
				];

				nouns.forEach(noun => {

					expect(pluralise(noun.singular)).to.equal(noun.plural);

				});

			});

		});

	});

});

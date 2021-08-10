import { expect } from 'chai';

import { pascalCasify, pluralise } from '../../../src/lib/strings';

describe('Strings module', () => {

	describe('pascalCasify function', () => {

		context('input string is lowercase', () => {

			it('returns string with initial letter as capital', () => {

				expect(pascalCasify('foo')).to.equal('Foo');

			});

		});

		context('input string is camel case', () => {

			it('returns string with initial letter as capital', () => {

				expect(pascalCasify('fooBar')).to.equal('FooBar');

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
					{ singular: 'awardCeremony', plural: 'awardCeremonies' },
					{ singular: 'company', plural: 'companies' },
					{ singular: 'person', plural: 'people' }
				];

				nouns.forEach(noun => {

					expect(pluralise(noun.singular)).to.equal(noun.plural);

				});

			});

		});

	});

});

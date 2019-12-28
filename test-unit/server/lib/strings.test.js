import { expect } from 'chai';

import { capitalise, pluralise } from '../../../server/lib/strings';

describe('Strings module', () => {

	describe('Capitalise function', () => {

		it('returns string with initial letter as capital', () => {

			expect(capitalise('string')).to.eq('String');

		});

	});

	describe('Pluralise function', () => {

		context('Model is regular plural noun', () => {

			it('returns singular noun with appended \'s\'', () => {

				expect(pluralise('production')).to.eq('productions');

			});

		});

		context('Model is irregular plural noun', () => {

			it('returns specific plural noun', () => {

				expect(pluralise('person')).to.eq('people');

			});

		});

	});

});

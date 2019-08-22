import { expect } from 'chai';

import { pluralise } from '../../../server/lib/strings';

describe('Pluralise module', () => {

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

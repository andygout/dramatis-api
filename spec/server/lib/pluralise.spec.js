const expect = require('chai').expect;

const subject = require('../../../dist/lib/pluralise');

describe('Pluralise module', () => {

	context('Model is regular plural noun', () => {

		it('will return singular noun with appended \'s\'', () => {

			expect(subject('production')).to.eq('productions');

		});

	});

	context('Model is irregular plural noun', () => {

		it('will return specific plural noun', () => {

			expect(subject('person')).to.eq('people');

		});

	});

});

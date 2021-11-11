import { expect } from 'chai';

import { AwardCeremonyCategory, Nomination } from '../../../src/models';

describe('AwardCeremonyCategory model', () => {

	describe('constructor method', () => {

		describe('nominations property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = new AwardCeremonyCategory({});
				expect(instance.nominations).to.deep.equal([]);

			});

			it('assigns array of nominations if included in props', () => {

				const props = {
					nominations: [
						{},
						{},
						{}
					]
				};
				const instance = new AwardCeremonyCategory(props);
				expect(instance.nominations.length).to.equal(3);
				expect(instance.nominations[0] instanceof Nomination).to.be.true;
				expect(instance.nominations[1] instanceof Nomination).to.be.true;
				expect(instance.nominations[2] instanceof Nomination).to.be.true;

			});

		});

	});

});

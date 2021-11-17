import { expect } from 'chai';
import { assert, spy } from 'sinon';

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

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', () => {

			const props = {
				name: '2020',
				nominations: [{}]
			};
			const instance = new AwardCeremonyCategory(props);
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			spy(instance, 'validateNamePresenceIfNamedChildren');
			spy(instance.nominations[0], 'runInputValidations');
			instance.runInputValidations({ isDuplicate: false });
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				instance.validateNamePresenceIfNamedChildren,
				instance.nominations[0].runInputValidations
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.validateUniquenessInGroup.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(instance.validateNamePresenceIfNamedChildren.calledOnce).to.be.true;
			expect(instance.validateNamePresenceIfNamedChildren.calledWithExactly([])).to.be.true;
			expect(instance.nominations[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.nominations[0].runInputValidations.calledWithExactly()).to.be.true;

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated nominations\' runDatabaseValidations method', async () => {

			const props = {
				nominations: [{}]
			};
			const instance = new AwardCeremonyCategory(props);
			spy(instance.nominations[0], 'runDatabaseValidations');
			await instance.runDatabaseValidations();
			expect(instance.nominations[0].runDatabaseValidations.calledOnce).to.be.true;
			expect(instance.nominations[0].runDatabaseValidations.calledWithExactly()).to.be.true;

		});

	});

});

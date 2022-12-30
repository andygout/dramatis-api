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
				name: 'Best New Play',
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
			assert.calledOnce(instance.validateName);
			assert.calledWithExactly(instance.validateName, { isRequired: false });
			assert.calledOnce(instance.validateUniquenessInGroup);
			assert.calledWithExactly(instance.validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnce(instance.validateNamePresenceIfNamedChildren);
			assert.calledWithExactly(instance.validateNamePresenceIfNamedChildren, []);
			assert.calledOnce(instance.nominations[0].runInputValidations);
			assert.calledWithExactly(instance.nominations[0].runInputValidations);

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
			assert.calledOnce(instance.nominations[0].runDatabaseValidations);
			assert.calledWithExactly(instance.nominations[0].runDatabaseValidations);

		});

	});

});

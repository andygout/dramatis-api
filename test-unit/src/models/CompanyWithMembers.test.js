import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Person } from '../../../src/models/index.js';

describe('CompanyWithMembers model', () => {

	let stubs;

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateEntityInfoModule: {
				isEntityInArray: stub().returns(false)
			},
			models: {
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		esmock(
			'../../../src/models/CompanyWithMembers.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-entity-info': stubs.getDuplicateEntityInfoModule,
				'../../../src/models/index.js': stubs.models
			}
		);

	describe('constructor method', () => {

		describe('members property', () => {

			it('assigns empty array if absent from props', async () => {

				const CompanyWithMembers = await createSubject();
				const instance = new CompanyWithMembers({ name: 'Autograph' });
				expect(instance.members).to.deep.equal([]);

			});

			it('assigns array of members if included in props, retaining those with empty or whitespace-only string names', async () => {

				const CompanyWithMembers = await createSubject();
				const instance = new CompanyWithMembers({
					name: 'Autograph',
					members: [
						{
							name: 'Andrew Bruce'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});
				expect(instance.members.length).to.equal(3);
				expect(instance.members[0] instanceof Person).to.be.true;
				expect(instance.members[1] instanceof Person).to.be.true;
				expect(instance.members[2] instanceof Person).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

			const CompanyWithMembers = await createSubject();
			const instance = new CompanyWithMembers({
				name: 'Fiery Angel',
				members: [
					{
						name: 'Edward Snape'
					}
				]
			});
			spy(instance, 'validateNamePresenceIfNamedChildren');
			instance.runInputValidations({ duplicateEntities: [] });
			assert.callOrder(
				instance.validateNamePresenceIfNamedChildren,
				instance.members[0].validateName,
				instance.members[0].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.members[0].validateUniquenessInGroup
			);
			assert.calledOnceWithExactly(instance.validateNamePresenceIfNamedChildren, instance.members);
			assert.calledOnceWithExactly(instance.members[0].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.members[0].validateDifferentiator);
			assert.calledOnceWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.members[0], []
			);
			assert.calledOnceWithExactly(instance.members[0].validateUniquenessInGroup, { isDuplicate: false });

		});

	});

});

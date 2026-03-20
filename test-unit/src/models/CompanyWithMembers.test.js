import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

import { Person } from '../../../src/models/index.js';

describe('CompanyWithMembers model', () => {
	let stubs;
	let CompanyWithMembers;

	const PersonStub = function () {
		return createStubInstance(Person);
	};

	beforeEach(async () => {
		stubs = {
			getDuplicateEntityInfoModule: {
				isEntityInArray: stub().returns(false)
			},
			models: {
				Person: PersonStub
			}
		};

		CompanyWithMembers = await esmock(
			'../../../src/models/CompanyWithMembers.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-entity-info': stubs.getDuplicateEntityInfoModule,
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		describe('members property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new CompanyWithMembers({ name: 'Autograph' });

				assert.deepEqual(instance.members, []);
			});

			it('assigns array of members if included in props, retaining those with empty or whitespace-only string names', async () => {
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

				assert.equal(instance.members.length, 3);
				assert.equal(instance.members[0] instanceof Person, true);
				assert.equal(instance.members[1] instanceof Person, true);
				assert.equal(instance.members[2] instanceof Person, true);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async () => {
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

			sinonAssert.callOrder(
				instance.validateNamePresenceIfNamedChildren,
				instance.members[0].validateName,
				instance.members[0].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.members[0].validateUniquenessInGroup
			);
			sinonAssert.calledOnceWithExactly(instance.validateNamePresenceIfNamedChildren, instance.members);
			sinonAssert.calledOnceWithExactly(instance.members[0].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.members[0].validateDifferentiator);
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.members[0],
				[]
			);
			sinonAssert.calledOnceWithExactly(instance.members[0].validateUniquenessInGroup, { isDuplicate: false });
		});
	});
});

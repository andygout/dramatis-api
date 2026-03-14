import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

import { CompanyWithMembers, Person } from '../../../src/models/index.js';

describe('ProductionTeamCredit model', () => {
	let stubs;
	let ProductionTeamCredit;

	const CompanyWithMembersStub = function () {
		return createStubInstance(CompanyWithMembers);
	};

	const PersonStub = function () {
		return createStubInstance(Person);
	};

	beforeEach(async () => {
		stubs = {
			getDuplicateEntityInfoModule: {
				getDuplicateEntities: stub().returns('getDuplicateEntities response'),
				isEntityInArray: stub().returns(false)
			},
			models: {
				CompanyWithMembers: CompanyWithMembersStub,
				Person: PersonStub
			}
		};

		ProductionTeamCredit = await esmock(
			'../../../src/models/ProductionTeamCredit.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-entity-info.js': stubs.getDuplicateEntityInfoModule,
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		describe('entities property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new ProductionTeamCredit({ name: 'Sound Designers' });

				assert.deepEqual(instance.entities, []);
			});

			it('assigns array of entities (people, companies) if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', async () => {
				const instance = new ProductionTeamCredit({
					name: 'Assistant Stage Managers',
					entities: [
						{
							name: 'Sara Gunter'
						},
						{
							model: 'COMPANY',
							name: 'Assistant Stage Managers Ltd'
						},
						{
							name: ''
						},
						{
							model: 'COMPANY',
							name: ''
						},
						{
							name: ' '
						},
						{
							model: 'COMPANY',
							name: ' '
						}
					]
				});

				assert.equal(instance.entities.length, 6);
				assert.ok(instance.entities[0] instanceof Person);
				assert.ok(instance.entities[1] instanceof CompanyWithMembers);
				assert.ok(instance.entities[2] instanceof Person);
				assert.ok(instance.entities[3] instanceof CompanyWithMembers);
				assert.ok(instance.entities[4] instanceof Person);
				assert.ok(instance.entities[5] instanceof CompanyWithMembers);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async () => {
			const instance = new ProductionTeamCredit({
				name: 'Assistant Stage Managers',
				entities: [
					{
						name: 'Sara Gunter'
					},
					{
						model: 'COMPANY',
						name: 'Assistant Stage Managers Ltd'
					}
				]
			});

			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			spy(instance, 'validateNamePresenceIfNamedChildren');

			instance.runInputValidations({ isDuplicate: false });

			sinonAssert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				instance.validateNamePresenceIfNamedChildren,
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities[0].validateName,
				instance.entities[0].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[0].validateUniquenessInGroup,
				instance.entities[1].validateName,
				instance.entities[1].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[1].validateUniquenessInGroup,
				instance.entities[1].runInputValidations
			);
			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(instance.validateNamePresenceIfNamedChildren, instance.entities);
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities
			);
			sinonAssert.calledOnceWithExactly(instance.entities[0].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.entities[0].validateDifferentiator);
			sinonAssert.calledTwice(stubs.getDuplicateEntityInfoModule.isEntityInArray);
			sinonAssert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray.firstCall,
				instance.entities[0],
				'getDuplicateEntities response'
			);
			sinonAssert.calledOnceWithExactly(instance.entities[0].validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(instance.entities[1].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.entities[1].validateDifferentiator);
			sinonAssert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray.secondCall,
				instance.entities[1],
				'getDuplicateEntities response'
			);
			sinonAssert.calledOnceWithExactly(instance.entities[1].validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(instance.entities[1].runInputValidations, {
				duplicateEntities: 'getDuplicateEntities response'
			});
		});
	});
});

import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { CompanyWithMembers, Person } from '../../../src/models/index.js';

describe('ProductionTeamCredit model', () => {
	let stubs;
	let ProductionTeamCredit;

	const CompanyWithMembersStub = function () {
		return new CompanyWithMembers();
	};

	const PersonStub = function () {
		return new Person();
	};

	beforeEach(async (test) => {
		stubs = {
			getDuplicateEntityInfoModule: {
				getDuplicateEntities: test.mock.fn(() => 'getDuplicateEntities response'),
				isEntityInArray: test.mock.fn(() => false)
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
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
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
			const callOrder = [];

			const originalValidateName = instance.validateName;
			const originalValidateUniquenessInGroup = instance.validateUniquenessInGroup;
			const originalValidateNamePresenceIfNamedChildren = instance.validateNamePresenceIfNamedChildren;
			const originalEntity0ValidateName = instance.entities[0].validateName;
			const originalEntity0ValidateDifferentiator = instance.entities[0].validateDifferentiator;
			const originalEntity0ValidateUniquenessInGroup = instance.entities[0].validateUniquenessInGroup;
			const originalEntity1ValidateName = instance.entities[1].validateName;
			const originalEntity1ValidateDifferentiator = instance.entities[1].validateDifferentiator;
			const originalEntity1ValidateUniquenessInGroup = instance.entities[1].validateUniquenessInGroup;
			const originalEntity1RunInputValidations = instance.entities[1].runInputValidations;

			test.mock.method(instance, 'validateName', function (...args) {
				callOrder.push('instance.validateName');

				return originalValidateName.apply(this, args);
			});
			test.mock.method(instance, 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.validateUniquenessInGroup');

				return originalValidateUniquenessInGroup.apply(this, args);
			});
			test.mock.method(instance, 'validateNamePresenceIfNamedChildren', function (...args) {
				callOrder.push('instance.validateNamePresenceIfNamedChildren');

				return originalValidateNamePresenceIfNamedChildren.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateEntityInfoModule, 'getDuplicateEntities', function (...args) {
				callOrder.push('stubs.getDuplicateEntityInfoModule.getDuplicateEntities');

				return 'getDuplicateEntities response';
			});
			test.mock.method(instance.entities[0], 'validateName', function (...args) {
				callOrder.push('instance.entities[0].validateName');

				return originalEntity0ValidateName.apply(this, args);
			});
			test.mock.method(instance.entities[0], 'validateDifferentiator', function (...args) {
				callOrder.push('instance.entities[0].validateDifferentiator');

				return originalEntity0ValidateDifferentiator.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateEntityInfoModule, 'isEntityInArray', function (...args) {
				callOrder.push('stubs.getDuplicateEntityInfoModule.isEntityInArray');

				return false;
			});
			test.mock.method(instance.entities[0], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.entities[0].validateUniquenessInGroup');

				return originalEntity0ValidateUniquenessInGroup.apply(this, args);
			});
			test.mock.method(instance.entities[1], 'validateName', function (...args) {
				callOrder.push('instance.entities[1].validateName');

				return originalEntity1ValidateName.apply(this, args);
			});
			test.mock.method(instance.entities[1], 'validateDifferentiator', function (...args) {
				callOrder.push('instance.entities[1].validateDifferentiator');

				return originalEntity1ValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance.entities[1], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.entities[1].validateUniquenessInGroup');

				return originalEntity1ValidateUniquenessInGroup.apply(this, args);
			});
			test.mock.method(instance.entities[1], 'runInputValidations', function (...args) {
				callOrder.push('instance.entities[1].runInputValidations');

				return originalEntity1RunInputValidations.apply(this, args);
			});

			instance.runInputValidations({ isDuplicate: false });

			assert.deepStrictEqual(callOrder, [
				'instance.validateName',
				'instance.validateUniquenessInGroup',
				'instance.validateNamePresenceIfNamedChildren',
				'stubs.getDuplicateEntityInfoModule.getDuplicateEntities',
				'instance.entities[0].validateName',
				'instance.entities[0].validateDifferentiator',
				'stubs.getDuplicateEntityInfoModule.isEntityInArray',
				'instance.entities[0].validateUniquenessInGroup',
				'instance.entities[1].validateName',
				'instance.entities[1].validateDifferentiator',
				'stubs.getDuplicateEntityInfoModule.isEntityInArray',
				'instance.entities[1].validateUniquenessInGroup',
				'instance.entities[1].runInputValidations'
			]);
			assert.strictEqual(instance.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
			assert.strictEqual(instance.validateNamePresenceIfNamedChildren.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateNamePresenceIfNamedChildren.mock.calls[0].arguments, [instance.entities]);
			assert.strictEqual(stubs.getDuplicateEntityInfoModule.getDuplicateEntities.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.getDuplicateEntityInfoModule.getDuplicateEntities.mock.calls[0].arguments, [
				instance.entities
			]);
			assert.strictEqual(instance.entities[0].validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[0].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.entities[0].validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[0].validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(stubs.getDuplicateEntityInfoModule.isEntityInArray.mock.calls.length, 2);
			assert.deepStrictEqual(stubs.getDuplicateEntityInfoModule.isEntityInArray.mock.calls[0].arguments, [
				instance.entities[0],
				'getDuplicateEntities response'
			]);
			assert.strictEqual(instance.entities[0].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[0].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
			assert.strictEqual(instance.entities[1].validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[1].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.entities[1].validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[1].validateDifferentiator.mock.calls[0].arguments, []);
			assert.deepStrictEqual(stubs.getDuplicateEntityInfoModule.isEntityInArray.mock.calls[1].arguments, [
				instance.entities[1],
				'getDuplicateEntities response'
			]);
			assert.strictEqual(instance.entities[1].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[1].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
			assert.strictEqual(instance.entities[1].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[1].runInputValidations.mock.calls[0].arguments, [
				{
					duplicateEntities: 'getDuplicateEntities response'
				}
			]);
		});
	});
});

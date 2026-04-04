import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { Person } from '../../../src/models/index.js';

describe('CompanyWithMembers model', () => {
	let stubs;
	let CompanyWithMembers;

	const PersonStub = function () {
		return new Person();
	};

	beforeEach(async (test) => {
		stubs = {
			getDuplicateEntityInfoModule: {
				isEntityInArray: test.mock.fn(() => false)
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
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
			const instance = new CompanyWithMembers({
				name: 'Fiery Angel',
				members: [
					{
						name: 'Edward Snape'
					}
				]
			});
			const callOrder = [];

			const originalValidateNamePresenceIfNamedChildren = instance.validateNamePresenceIfNamedChildren;
			const originalValidateName = instance.members[0].validateName;
			const originalValidateDifferentiator = instance.members[0].validateDifferentiator;
			const originalValidateUniquenessInGroup = instance.members[0].validateUniquenessInGroup;

			test.mock.method(instance, 'validateNamePresenceIfNamedChildren', function (...args) {
				callOrder.push('instance.validateNamePresenceIfNamedChildren');

				return originalValidateNamePresenceIfNamedChildren.apply(this, args);
			});
			test.mock.method(instance.members[0], 'validateName', function (...args) {
				callOrder.push('instance.members[0].validateName');

				return originalValidateName.apply(this, args);
			});
			test.mock.method(instance.members[0], 'validateDifferentiator', function (...args) {
				callOrder.push('instance.members[0].validateDifferentiator');

				return originalValidateDifferentiator.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateEntityInfoModule, 'isEntityInArray', function (...args) {
				callOrder.push('stubs.getDuplicateEntityInfoModule.isEntityInArray');

				return false;
			});
			test.mock.method(instance.members[0], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.members[0].validateUniquenessInGroup');

				return originalValidateUniquenessInGroup.apply(this, args);
			});

			instance.runInputValidations({ duplicateEntities: [] });

			assert.deepStrictEqual(callOrder, [
				'instance.validateNamePresenceIfNamedChildren',
				'instance.members[0].validateName',
				'instance.members[0].validateDifferentiator',
				'stubs.getDuplicateEntityInfoModule.isEntityInArray',
				'instance.members[0].validateUniquenessInGroup'
			]);
			assert.strictEqual(instance.validateNamePresenceIfNamedChildren.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateNamePresenceIfNamedChildren.mock.calls[0].arguments, [instance.members]);
			assert.strictEqual(instance.members[0].validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.members[0].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.members[0].validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.members[0].validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(stubs.getDuplicateEntityInfoModule.isEntityInArray.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.getDuplicateEntityInfoModule.isEntityInArray.mock.calls[0].arguments, [
				instance.members[0],
				[]
			]);
			assert.strictEqual(instance.members[0].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.members[0].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
		});
	});
});

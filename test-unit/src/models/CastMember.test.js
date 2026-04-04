import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { Role } from '../../../src/models/index.js';

describe('CastMember model', () => {
	let stubs;
	let CastMember;

	const RoleStub = function () {
		return new Role();
	};

	beforeEach(async (test) => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateRoleIndices: test.mock.fn(() => [])
			},
			models: {
				Role: RoleStub
			}
		};

		CastMember = await esmock(
			'../../../src/models/CastMember.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	describe('constructor method', () => {
		describe('roles property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new CastMember({ name: 'Ian McKellen' });

				assert.deepEqual(instance.roles, []);
			});

			it('assigns array of role instances, retaining those with empty or whitespace-only string names', async () => {
				const instance = new CastMember({
					name: 'Ian McKellen',
					roles: [
						{
							name: 'King Lear'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});

				assert.equal(instance.roles.length, 3);
				assert.equal(instance.roles[0] instanceof Role, true);
				assert.equal(instance.roles[1] instanceof Role, true);
				assert.equal(instance.roles[2] instanceof Role, true);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
			const instance = new CastMember({
				name: 'Ian McKellen',
				roles: [
					{
						name: 'King Lear'
					}
				]
			});
			const callOrder = [];

			const originalValidateName = instance.validateName;
			const originalValidateDifferentiator = instance.validateDifferentiator;
			const originalValidateUniquenessInGroup = instance.validateUniquenessInGroup;
			const originalValidateNamePresenceIfNamedChildren = instance.validateNamePresenceIfNamedChildren;
			const originalRoleValidateName = instance.roles[0].validateName;
			const originalRoleValidateCharacterName = instance.roles[0].validateCharacterName;
			const originalRoleValidateQualifier = instance.roles[0].validateQualifier;
			const originalRoleValidateRoleNameCharacterNameDisparity =
				instance.roles[0].validateRoleNameCharacterNameDisparity;
			const originalRoleValidateUniquenessInGroup = instance.roles[0].validateUniquenessInGroup;

			test.mock.method(instance, 'validateName', function (...args) {
				callOrder.push('instance.validateName');

				return originalValidateName.apply(this, args);
			});
			test.mock.method(instance, 'validateDifferentiator', function (...args) {
				callOrder.push('instance.validateDifferentiator');

				return originalValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance, 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.validateUniquenessInGroup');

				return originalValidateUniquenessInGroup.apply(this, args);
			});
			test.mock.method(instance, 'validateNamePresenceIfNamedChildren', function (...args) {
				callOrder.push('instance.validateNamePresenceIfNamedChildren');

				return originalValidateNamePresenceIfNamedChildren.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateRoleIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateRoleIndices');

				return [];
			});
			test.mock.method(instance.roles[0], 'validateName', function (...args) {
				callOrder.push('instance.roles[0].validateName');

				return originalRoleValidateName.apply(this, args);
			});
			test.mock.method(instance.roles[0], 'validateCharacterName', function (...args) {
				callOrder.push('instance.roles[0].validateCharacterName');

				return originalRoleValidateCharacterName.apply(this, args);
			});
			test.mock.method(instance.roles[0], 'validateQualifier', function (...args) {
				callOrder.push('instance.roles[0].validateQualifier');

				return originalRoleValidateQualifier.apply(this, args);
			});
			test.mock.method(instance.roles[0], 'validateRoleNameCharacterNameDisparity', function (...args) {
				callOrder.push('instance.roles[0].validateRoleNameCharacterNameDisparity');

				return originalRoleValidateRoleNameCharacterNameDisparity.apply(this, args);
			});
			test.mock.method(instance.roles[0], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.roles[0].validateUniquenessInGroup');

				return originalRoleValidateUniquenessInGroup.apply(this, args);
			});

			instance.runInputValidations({ isDuplicate: false });

			assert.deepStrictEqual(callOrder, [
				'instance.validateName',
				'instance.validateDifferentiator',
				'instance.validateUniquenessInGroup',
				'instance.validateNamePresenceIfNamedChildren',
				'stubs.getDuplicateIndicesModule.getDuplicateRoleIndices',
				'instance.roles[0].validateName',
				'instance.roles[0].validateCharacterName',
				'instance.roles[0].validateQualifier',
				'instance.roles[0].validateRoleNameCharacterNameDisparity',
				'instance.roles[0].validateUniquenessInGroup'
			]);
			assert.strictEqual(instance.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(instance.validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
			assert.strictEqual(instance.validateNamePresenceIfNamedChildren.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateNamePresenceIfNamedChildren.mock.calls[0].arguments, [instance.roles]);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateRoleIndices.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.getDuplicateIndicesModule.getDuplicateRoleIndices.mock.calls[0].arguments, [instance.roles]);
			assert.strictEqual(instance.roles[0].validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.roles[0].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.roles[0].validateCharacterName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.roles[0].validateCharacterName.mock.calls[0].arguments, []);
			assert.strictEqual(instance.roles[0].validateQualifier.mock.calls.length, 1);
			assert.deepStrictEqual(instance.roles[0].validateQualifier.mock.calls[0].arguments, []);
			assert.strictEqual(instance.roles[0].validateRoleNameCharacterNameDisparity.mock.calls.length, 1);
			assert.deepStrictEqual(instance.roles[0].validateRoleNameCharacterNameDisparity.mock.calls[0].arguments, []);
			assert.strictEqual(instance.roles[0].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.roles[0].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
		});
	});
});

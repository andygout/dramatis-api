import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

import { Role } from '../../../src/models/index.js';

describe('CastMember model', () => {
	let stubs;
	let CastMember;

	const RoleStub = function () {
		return createStubInstance(Role);
	};

	beforeEach(async () => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateRoleIndices: stub().returns([])
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

	afterEach(() => {
		restore();
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
		it("calls instance's validate methods and associated models' validate methods", async () => {
			const instance = new CastMember({
				name: 'Ian McKellen',
				roles: [
					{
						name: 'King Lear'
					}
				]
			});

			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			spy(instance, 'validateUniquenessInGroup');
			spy(instance, 'validateNamePresenceIfNamedChildren');

			instance.runInputValidations({ isDuplicate: false });

			sinonAssert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				instance.validateUniquenessInGroup,
				instance.validateNamePresenceIfNamedChildren,
				stubs.getDuplicateIndicesModule.getDuplicateRoleIndices,
				instance.roles[0].validateName,
				instance.roles[0].validateCharacterName,
				instance.roles[0].validateQualifier,
				instance.roles[0].validateRoleNameCharacterNameDisparity,
				instance.roles[0].validateUniquenessInGroup
			);
			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(instance.validateNamePresenceIfNamedChildren, instance.roles);
			sinonAssert.calledOnceWithExactly(stubs.getDuplicateIndicesModule.getDuplicateRoleIndices, instance.roles);
			sinonAssert.calledOnceWithExactly(instance.roles[0].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.roles[0].validateCharacterName);
			sinonAssert.calledOnceWithExactly(instance.roles[0].validateQualifier);
			sinonAssert.calledOnceWithExactly(instance.roles[0].validateRoleNameCharacterNameDisparity);
			sinonAssert.calledOnceWithExactly(instance.roles[0].validateUniquenessInGroup, { isDuplicate: false });
		});
	});
});

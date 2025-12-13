import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, restore, spy, stub } from 'sinon';

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

				expect(instance.roles).to.deep.equal([]);

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

				expect(instance.roles.length).to.equal(3);
				expect(instance.roles[0] instanceof Role).to.be.true;
				expect(instance.roles[1] instanceof Role).to.be.true;
				expect(instance.roles[2] instanceof Role).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

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

			assert.callOrder(
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
			assert.calledOnceWithExactly(instance.validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.validateDifferentiator);
			assert.calledOnceWithExactly(instance.validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnceWithExactly(instance.validateNamePresenceIfNamedChildren, instance.roles);
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateRoleIndices,
				instance.roles
			);
			assert.calledOnceWithExactly(instance.roles[0].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.roles[0].validateCharacterName);
			assert.calledOnceWithExactly(instance.roles[0].validateQualifier);
			assert.calledOnceWithExactly(instance.roles[0].validateRoleNameCharacterNameDisparity);
			assert.calledOnceWithExactly(instance.roles[0].validateUniquenessInGroup, { isDuplicate: false });

		});

	});

});

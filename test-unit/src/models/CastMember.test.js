import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Role } from '../../../src/models';

describe('CastMember model', () => {

	let stubs;

	const RoleStub = function () {

		return createStubInstance(Role);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateRoleIndices: stub().returns([])
			},
			models: {
				Role: RoleStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/CastMember', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const CastMember = createSubject();

		return new CastMember(props);

	};

	describe('constructor method', () => {

		describe('roles property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'Ian McKellen' });
				expect(instance.roles).to.deep.equal([]);

			});

			it('assigns array of role instances, retaining those with empty or whitespace-only string names', () => {

				const props = {
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
				};
				const instance = createInstance(props);
				expect(instance.roles.length).to.equal(3);
				expect(instance.roles[0] instanceof Role).to.be.true;
				expect(instance.roles[1] instanceof Role).to.be.true;
				expect(instance.roles[2] instanceof Role).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', () => {

			const props = {
				name: 'Ian McKellen',
				roles: [
					{
						name: 'King Lear'
					}
				]
			};
			const instance = createInstance(props);
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
			assert.calledOnce(instance.validateName);
			assert.calledWithExactly(instance.validateName, { isRequired: false });
			assert.calledOnce(instance.validateDifferentiator);
			assert.calledWithExactly(instance.validateDifferentiator);
			assert.calledOnce(instance.validateUniquenessInGroup);
			assert.calledWithExactly(instance.validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnce(instance.validateNamePresenceIfNamedChildren);
			assert.calledWithExactly(instance.validateNamePresenceIfNamedChildren, instance.roles);
			assert.calledOnce(stubs.getDuplicateIndicesModule.getDuplicateRoleIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateRoleIndices,
				instance.roles
			);
			assert.calledOnce(instance.roles[0].validateName);
			assert.calledWithExactly(instance.roles[0].validateName, { isRequired: false });
			assert.calledOnce(instance.roles[0].validateCharacterName);
			assert.calledWithExactly(instance.roles[0].validateCharacterName);
			assert.calledOnce(instance.roles[0].validateQualifier);
			assert.calledWithExactly(instance.roles[0].validateQualifier);
			assert.calledOnce(instance.roles[0].validateRoleNameCharacterNameDisparity);
			assert.calledWithExactly(instance.roles[0].validateRoleNameCharacterNameDisparity);
			assert.calledOnce(instance.roles[0].validateUniquenessInGroup);
			assert.calledWithExactly(instance.roles[0].validateUniquenessInGroup, { isDuplicate: false });

		});

	});

});

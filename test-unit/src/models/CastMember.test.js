import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Role } from '../../../src/models';

describe('Cast Member model', () => {

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

		it('calls instance validate method and associated models\' validate methods', () => {

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
			spy(instance, 'validateNamePresenceIfRoles');
			instance.runInputValidations({ isDuplicate: false });
			assert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				instance.validateUniquenessInGroup,
				instance.validateNamePresenceIfRoles,
				stubs.getDuplicateIndicesModule.getDuplicateRoleIndices,
				instance.roles[0].validateName,
				instance.roles[0].validateCharacterName,
				instance.roles[0].validateQualifier,
				instance.roles[0].validateRoleNameCharacterNameDisparity,
				instance.roles[0].validateUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.validateUniquenessInGroup.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(instance.validateNamePresenceIfRoles.calledOnce).to.be.true;
			expect(instance.validateNamePresenceIfRoles.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateRoleIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateRoleIndices.calledWithExactly(
				instance.roles
			)).to.be.true;
			expect(instance.roles[0].validateName.calledOnce).to.be.true;
			expect(instance.roles[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.roles[0].validateCharacterName.calledOnce).to.be.true;
			expect(instance.roles[0].validateCharacterName.calledWithExactly()).to.be.true;
			expect(instance.roles[0].validateQualifier.calledOnce).to.be.true;
			expect(instance.roles[0].validateQualifier.calledWithExactly()).to.be.true;
			expect(instance.roles[0].validateRoleNameCharacterNameDisparity.calledOnce).to.be.true;
			expect(instance.roles[0].validateRoleNameCharacterNameDisparity.calledWithExactly()).to.be.true;
			expect(instance.roles[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.roles[0].validateUniquenessInGroup.calledWithExactly({ isDuplicate: false })).to.be.true;

		});

	});

	describe('validateNamePresenceIfRoles method', () => {

		beforeEach(() => {

			stubs.models.Role = function (props) {

				this.name = props.name;

			};

		});

		context('valid data', () => {

			context('cast member does not have name nor any roles with names', () => {

				it('will not add properties to errors property', () => {

					const instance = createInstance({ name: '', roles: [{ name: '' }] });
					spy(instance, 'addPropertyError');
					instance.validateNamePresenceIfRoles();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('cast member has a name and no roles with names', () => {

				it('will not add properties to errors property', () => {

					const instance = createInstance({ name: 'Ian McKellen', roles: [{ name: '' }] });
					spy(instance, 'addPropertyError');
					instance.validateNamePresenceIfRoles();
					expect(instance.addPropertyError.notCalled).to.be.true;
				});

			});

			context('cast member has a name and roles with names', () => {

				it('will not add properties to errors property', () => {

					const instance = createInstance({ name: 'Ian McKellen', roles: [{ name: 'King Lear' }] });
					spy(instance, 'addPropertyError');
					instance.validateNamePresenceIfRoles();
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = createInstance({ name: '', roles: [{ name: 'King Lear' }] });
				spy(instance, 'addPropertyError');
				instance.validateNamePresenceIfRoles();
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'name',
					'Name is required if cast member has named roles'
				)).to.be.true;

			});

		});

	});

});

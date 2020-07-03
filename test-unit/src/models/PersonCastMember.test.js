import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Role } from '../../../src/models';

describe('Person Cast Member model', () => {

	let stubs;
	let instance;

	const RoleStub = function () {

		return createStubInstance(Role);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateNameIndicesModule: {
				getDuplicateNameIndices: stub().returns([])
			},
			models: {
				Role: RoleStub
			}
		};

		instance = createInstance();

	});

	const createSubject = () =>
		proxyquire('../../../src/models/PersonCastMember', {
			'../lib/get-duplicate-name-indices': stubs.getDuplicateNameIndicesModule,
			'.': stubs.models
		}).default;

	const createInstance = (props = { name: 'Ian McKellen', roles: [{ name: 'King Lear' }] }) => {

		const PersonCastMember = createSubject();

		return new PersonCastMember(props);

	};

	describe('constructor method', () => {

		describe('roles property', () => {

			it('assigns empty array if absent from props', () => {

				instance = createInstance({ name: 'Ian McKellen' });
				expect(instance.roles).to.deep.eq([]);

			});

			it('assigns array of roles if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Ian McKellen',
					roles: [
						{ name: 'King Lear' },
						{ name: '' },
						{ name: ' ' }
					]
				};
				instance = createInstance(props);
				expect(instance.roles.length).to.equal(3);
				expect(instance.roles[0] instanceof Role).to.be.true;
				expect(instance.roles[1] instanceof Role).to.be.true;
				expect(instance.roles[2] instanceof Role).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			spy(instance, 'validateName');
			spy(instance, 'validateNameUniquenessInGroup');
			instance.runInputValidations({ hasDuplicateName: false });
			assert.callOrder(
				instance.validateName.withArgs({ requiresName: false }),
				instance.validateNameUniquenessInGroup.withArgs({ hasDuplicateName: false }),
				stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.withArgs(instance.roles),
				instance.roles[0].validateName.withArgs({ requiresName: false }),
				instance.roles[0].validateCharacterName.withArgs({ requiresCharacterName: false }),
				instance.roles[0].validateNameUniquenessInGroup.withArgs({ hasDuplicateName: false })
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateNameUniquenessInGroup.calledOnce).to.be.true;
			expect(stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.calledOnce).to.be.true;
			expect(instance.roles[0].validateName.calledOnce).to.be.true;
			expect(instance.roles[0].validateCharacterName.calledOnce).to.be.true;
			expect(instance.roles[0].validateNameUniquenessInGroup.calledOnce).to.be.true;

		});

	});

});

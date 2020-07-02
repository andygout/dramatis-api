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

	describe('runValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			spy(instance, 'validateGroupItem');
			instance.runValidations({ hasDuplicateName: false });
			assert.callOrder(
				instance.validateGroupItem.withArgs({ hasDuplicateName: false, requiresName: false }),
				stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.withArgs(instance.roles),
				instance.roles[0].validateGroupItem.withArgs({ hasDuplicateName: false, requiresName: false }),
				instance.roles[0].validateCharacterName.withArgs({ requiresCharacterName: false })
			);
			expect(instance.validateGroupItem.calledOnce).to.be.true;
			expect(stubs.getDuplicateNameIndicesModule.getDuplicateNameIndices.calledOnce).to.be.true;
			expect(instance.roles[0].validateGroupItem.calledOnce).to.be.true;
			expect(instance.roles[0].validateCharacterName.calledOnce).to.be.true;

		});

	});

});

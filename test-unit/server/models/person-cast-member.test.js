import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Role from '../../../server/models/role';

describe('Person Cast Member model', () => {

	let stubs;
	let instance;

	const RoleStub = function () {

		return sinon.createStubInstance(Role);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateNameIndicesModule: {
				getDuplicateNameIndices: sinon.stub().returns([])
			},
			Role: RoleStub
		};

		instance = createInstance();

	});

	const createSubject = () =>
		proxyquire('../../../server/models/person-cast-member', {
			'../lib/get-duplicate-name-indices': stubs.getDuplicateNameIndicesModule,
			'./role': stubs.Role
		});

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
				expect(instance.roles.length).to.eq(3);
				expect(instance.roles[0].constructor.name).to.eq('Role');
				expect(instance.roles[1].constructor.name).to.eq('Role');
				expect(instance.roles[2].constructor.name).to.eq('Role');

			});

		});

	});

	describe('runValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			sinon.spy(instance, 'validateGroupItem');
			instance.runValidations({ hasDuplicateName: false });
			sinon.assert.callOrder(
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

import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Role from '../../../server/models/role';

let stubs;
let instance;

const RoleStub = function () {

	return sinon.createStubInstance(Role);

};

beforeEach(() => {

	stubs = {
		Role: RoleStub
	};

	instance = createInstance();

});

const createSubject = () =>
	proxyquire('../../../server/models/person', {
		'./role': stubs.Role
	});

const createInstance = (props = { name: 'Ian McKellen' }) => {

	const subject = createSubject();

	return new subject(props);

};

describe('Person model', () => {

	describe('constructor method', () => {

		describe('roles property', () => {

			it('will assign as empty array if not included in props', () => {

				expect(instance.roles).to.deep.eq([]);

			});

			it('will assign as array of roles if included in props, filtering out those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Ian McKellen',
					roles: [
						{ name: 'King Lear' },
						{ name: '' },
						{ name: ' ' }
					]
				};
				instance = createInstance(props);
				expect(instance.roles.length).to.eq(1);
				expect(instance.roles[0].constructor.name).to.eq('Role');

			});

		});

	});

});

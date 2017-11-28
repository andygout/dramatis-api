import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import Role from '../../../server/models/role';

import dbQueryFixture from '../../fixtures/db-query';

let stubs;
let instance;

const RoleStub = function () {

	return sinon.createStubInstance(Role);

};

beforeEach(() => {

	stubs = {
		cypherQueriesShared: {
			getDeleteQuery: sinon.stub().returns('getDeleteQuery response')
		},
		dbQuery: sinon.stub().resolves(dbQueryFixture),
		Role: RoleStub
	};

	instance = createInstance();

});

const createSubject = () =>
	proxyquire('../../../server/models/person', {
		'../database/cypher-queries/shared': stubs.cypherQueriesShared,
		'../database/db-query': stubs.dbQuery,
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

			it('will assign as array of roles if included in props, filtering out those with empty string names', () => {

				const props = { name: 'Ian McKellen', roles: [{ name: 'King Lear' }, { name: '' }] };
				instance = createInstance(props);
				expect(instance.roles.length).to.eq(1);
				expect(instance.roles[0].constructor.name).to.eq('Role');

			});

		});

	});

	describe('delete method', () => {

		it('will delete', done => {

			instance.delete().then(result => {
				expect(stubs.cypherQueriesShared.getDeleteQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getDeleteQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);
				done();
			});

		});

	});

});

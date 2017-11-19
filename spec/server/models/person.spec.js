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
		dbQuery: sinon.stub().resolves(dbQueryFixture),
		cypherQueriesShared: {
			getDeleteQuery: sinon.stub().returns('getDeleteQuery response')
		},
		Base: {
			dbQuery: sinon.stub().resolves(dbQueryFixture),
			cypherQueriesShared: {
				getValidateUpdateQuery: sinon.stub().returns('getValidateUpdateQuery response'),
				getEditQuery: sinon.stub().returns('getEditQuery response'),
				getUpdateQuery: sinon.stub().returns('getUpdateQuery response'),
				getShowQueries: {
					person: sinon.stub().returns('getShowQuery response')
				}
			},
			trimStrings: sinon.stub(),
			validateString: sinon.stub().returns([]),
			verifyErrorPresence: sinon.stub().returns(false)
		},
		Role: RoleStub
	};

	instance = createInstance();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/person', {
		'../database/cypher-queries/shared': stubs.cypherQueriesShared,
		'../database/db-query': stubOverrides.dbQuery || stubs.dbQuery,
		'./base': proxyquire('../../../server/models/base', {
			'../database/cypher-queries/shared': stubs.Base.cypherQueriesShared,
			'../database/db-query': stubOverrides.Base && stubOverrides.Base.dbQuery || stubs.Base.dbQuery,
			'../lib/trim-strings': stubs.Base.trimStrings,
			'../lib/validate-string': stubs.Base.validateString,
			'../lib/verify-error-presence': stubOverrides.Base && stubOverrides.Base.verifyErrorPresence || stubs.Base.verifyErrorPresence
		}),
		'./role': stubs.Role
	});

const createInstance = (stubOverrides = {}, props = { name: 'Ian McKellen' }) => {

	const subject = createSubject(stubOverrides);

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
				instance = createInstance({}, props);
				expect(instance.roles.length).to.eq(1);
				expect(instance.roles[0].constructor.name).to.eq('Role');

			});

		});

	});

	describe('validateUpdateInDb method', () => {

		it('will validate update in database', done => {

			instance.validateUpdateInDb().then(() => {
				expect(stubs.Base.cypherQueriesShared.getValidateUpdateQuery.calledOnce).to.be.true;
				expect(stubs.Base.cypherQueriesShared.getValidateUpdateQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.Base.dbQuery.calledOnce).to.be.true;
				expect(stubs.Base.dbQuery.calledWithExactly(
					{ query: 'getValidateUpdateQuery response', params: instance }
				)).to.be.true;
				done();
			});

		});

		context('valid data (results returned that indicate name does not already exist)', () => {

			it('will not add properties to errors property', done => {

				instance = createInstance({ Base: { dbQuery: sinon.stub().resolves({ instanceCount: 0 }) } });
				instance.validateUpdateInDb().then(() => {
					expect(instance.errors).not.to.have.property('name');
					expect(instance.errors).to.deep.eq({});
					done();
				});

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('will add properties that are arrays to errors property', done => {

				instance = createInstance({ Base: { dbQuery: sinon.stub().resolves({ instanceCount: 1 }) } });
				instance.validateUpdateInDb().then(() => {
					expect(instance.errors)
						.to.have.property('name')
						.that.is.an('array')
						.that.deep.eq(['Name already exists']);
					done();
				});

			});

		});

	});

	describe('edit method', () => {

		it('will get edit data', done => {

			instance.edit().then(result => {
				expect(stubs.Base.cypherQueriesShared.getEditQuery.calledOnce).to.be.true;
				expect(stubs.Base.cypherQueriesShared.getEditQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.Base.dbQuery.calledOnce).to.be.true;
				expect(stubs.Base.dbQuery.calledWithExactly(
					{ query: 'getEditQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);
				done();
			});

		});

	});

	describe('update method', () => {

		context('valid data', () => {

			it('will update', done => {

				sinon.spy(instance, 'validate');
				sinon.spy(instance, 'validateUpdateInDb');
				instance.update().then(result => {
					sinon.assert.callOrder(
						instance.validate.withArgs({ required: true }),
						stubs.Base.verifyErrorPresence.withArgs(instance),
						instance.validateUpdateInDb.withArgs(),
						stubs.Base.cypherQueriesShared.getValidateUpdateQuery.withArgs(instance.model),
						stubs.Base.dbQuery.withArgs({ query: 'getValidateUpdateQuery response', params: instance }),
						stubs.Base.verifyErrorPresence.withArgs(instance),
						stubs.Base.cypherQueriesShared.getUpdateQuery.withArgs(instance.model),
						stubs.Base.dbQuery.withArgs({ query: 'getUpdateQuery response', params: instance })
					);
					expect(instance.validate.calledOnce).to.be.true;
					expect(stubs.Base.verifyErrorPresence.calledTwice).to.be.true;
					expect(instance.validateUpdateInDb.calledOnce).to.be.true;
					expect(stubs.Base.cypherQueriesShared.getValidateUpdateQuery.calledOnce).to.be.true;
					expect(stubs.Base.dbQuery.calledTwice).to.be.true;
					expect(stubs.Base.cypherQueriesShared.getUpdateQuery.calledOnce).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

		});

		context('invalid data', () => {

			context('initial validation errors caused by submitted values', () => {

				it('will return instance without updating', done => {

					const verifyErrorPresenceStub = sinon.stub().returns(true);
					instance = createInstance({ Base: { verifyErrorPresence: verifyErrorPresenceStub } });
					sinon.spy(instance, 'validate');
					sinon.spy(instance, 'validateUpdateInDb');
					instance.update().then(result => {
						expect(instance.validate.calledBefore(verifyErrorPresenceStub)).to.be.true;
						expect(instance.validate.calledOnce).to.be.true;
						expect(instance.validate.calledWithExactly({ required: true })).to.be.true;
						expect(verifyErrorPresenceStub.calledOnce).to.be.true;
						expect(verifyErrorPresenceStub.calledWithExactly(instance)).to.be.true;
						expect(instance.validateUpdateInDb.notCalled).to.be.true;
						expect(stubs.Base.cypherQueriesShared.getValidateUpdateQuery.notCalled).to.be.true;
						expect(stubs.Base.dbQuery.notCalled).to.be.true;
						expect(stubs.Base.cypherQueriesShared.getUpdateQuery.notCalled).to.be.true;
						expect(result).to.deep.eq({ person: instance });
						done();
					});

				});

			});

			context('secondary validation errors caused by database checks', () => {

				it('will return instance without updating', done => {

					const verifyErrorPresenceStub = sinon.stub();
					verifyErrorPresenceStub.onFirstCall().returns(false).onSecondCall().returns(true);
					instance = createInstance({ Base: { verifyErrorPresence: verifyErrorPresenceStub } });
					sinon.spy(instance, 'validate');
					sinon.spy(instance, 'validateUpdateInDb');
					instance.update().then(result => {
						sinon.assert.callOrder(
							instance.validate.withArgs({ required: true }),
							verifyErrorPresenceStub.withArgs(instance),
							instance.validateUpdateInDb.withArgs(),
							stubs.Base.cypherQueriesShared.getValidateUpdateQuery.withArgs(instance.model),
							stubs.Base.dbQuery.withArgs({ query: 'getValidateUpdateQuery response', params: instance }),
							verifyErrorPresenceStub.withArgs(instance)
						);
						expect(instance.validate.calledOnce).to.be.true;
						expect(verifyErrorPresenceStub.calledTwice).to.be.true;
						expect(instance.validateUpdateInDb.calledOnce).to.be.true;
						expect(stubs.Base.cypherQueriesShared.getValidateUpdateQuery.calledOnce).to.be.true;
						expect(stubs.Base.dbQuery.calledOnce).to.be.true;
						expect(stubs.Base.cypherQueriesShared.getUpdateQuery.notCalled).to.be.true;
						expect(result).to.deep.eq({ person: instance });
						done();
					});

				});

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

	describe('show method', () => {

		it('will get show data', done => {

			instance.show().then(result => {
				expect(stubs.Base.cypherQueriesShared.getShowQueries.person.calledOnce).to.be.true;
				expect(stubs.Base.cypherQueriesShared.getShowQueries.person.calledWithExactly()).to.be.true;
				expect(stubs.Base.dbQuery.calledOnce).to.be.true;
				expect(stubs.Base.dbQuery.calledWithExactly(
					{ query: 'getShowQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);
				done();
			});

		});

	});

});

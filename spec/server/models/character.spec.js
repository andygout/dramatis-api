import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import dbQueryFixture from '../../fixtures/db-query';

let stubs;
let instance;

beforeEach(() => {

	stubs = {
		cypherQueriesShared: {
			getDeleteQuery: sinon.stub().returns('getDeleteQuery response')
		},
		dbQuery: sinon.stub().resolves(dbQueryFixture),
		Base: {
			cypherQueriesShared: {
				getValidateQuery: sinon.stub().returns('getValidateQuery response'),
				getCreateQuery: sinon.stub().returns('getCreateQuery response'),
				getEditQuery: sinon.stub().returns('getEditQuery response'),
				getUpdateQuery: sinon.stub().returns('getUpdateQuery response'),
				getShowQueries: {
					character: sinon.stub().returns('getShowQuery response')
				}
			},
			dbQuery: sinon.stub().resolves(dbQueryFixture),
			prepareAsParams: sinon.stub().returns('prepareAsParams response'),
			trimStrings: sinon.stub(),
			validateString: sinon.stub().returns([]),
			verifyErrorPresence: sinon.stub().returns(false)
		}
	};

	instance = createInstance();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/character', {
		'../database/cypher-queries/shared': stubs.cypherQueriesShared,
		'../database/db-query': stubOverrides.dbQuery || stubs.dbQuery,
		'./base': proxyquire('../../../server/models/base', {
			'../database/cypher-queries/shared': stubs.Base.cypherQueriesShared,
			'../database/db-query': stubOverrides.Base && stubOverrides.Base.dbQuery || stubs.Base.dbQuery,
			'../lib/prepare-as-params': stubs.Base.prepareAsParams,
			'../lib/trim-strings': stubs.Base.trimStrings,
			'../lib/validate-string': stubs.Base.validateString,
			'../lib/verify-error-presence': stubOverrides.Base && stubOverrides.Base.verifyErrorPresence || stubs.Base.verifyErrorPresence
		})
	});

const createInstance = (stubOverrides = {}) => {

	const subject = createSubject(stubOverrides);

	return new subject({ name: 'Hamlet' });

};

describe('Character model', () => {

	describe('validateInDb method', () => {

		it('will validate update in database', done => {

			instance.validateInDb().then(() => {
				expect(stubs.Base.cypherQueriesShared.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.Base.cypherQueriesShared.getValidateQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.Base.dbQuery.calledOnce).to.be.true;
				expect(stubs.Base.dbQuery.calledWithExactly(
					{ query: 'getValidateQuery response', params: instance }
				)).to.be.true;
				done();
			});

		});

		context('valid data (results returned that indicate name does not already exist)', () => {

			it('will not add properties to errors property', done => {

				instance = createInstance({ Base: { dbQuery: sinon.stub().resolves({ instanceCount: 0 }) } });
				instance.validateInDb().then(() => {
					expect(instance.errors).not.to.have.property('name');
					expect(instance.errors).to.deep.eq({});
					done();
				});

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('will add properties that are arrays to errors property', done => {

				instance = createInstance({ Base: { dbQuery: sinon.stub().resolves({ instanceCount: 1 }) } });
				instance.validateInDb().then(() => {
					expect(instance.errors)
						.to.have.property('name')
						.that.is.an('array')
						.that.deep.eq(['Name already exists']);
					done();
				});

			});

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('will create', done => {

				sinon.spy(instance, 'validate');
				sinon.spy(instance, 'validateInDb');
				instance.createUpdate(stubs.Base.cypherQueriesShared.getCreateQuery).then(result => {
					sinon.assert.callOrder(
						instance.validate.withArgs({ required: true }),
						stubs.Base.verifyErrorPresence.withArgs(instance),
						instance.validateInDb.withArgs(),
						stubs.Base.cypherQueriesShared.getValidateQuery.withArgs(instance.model),
						stubs.Base.dbQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
						stubs.Base.verifyErrorPresence.withArgs(instance),
						stubs.Base.cypherQueriesShared.getCreateQuery.withArgs(instance.model),
						stubs.Base.prepareAsParams.withArgs(instance),
						stubs.Base.dbQuery.withArgs(
							{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
						)
					);
					expect(instance.validate.calledOnce).to.be.true;
					expect(stubs.Base.verifyErrorPresence.calledTwice).to.be.true;
					expect(instance.validateInDb.calledOnce).to.be.true;
					expect(stubs.Base.cypherQueriesShared.getValidateQuery.calledOnce).to.be.true;
					expect(stubs.Base.dbQuery.calledTwice).to.be.true;
					expect(stubs.Base.cypherQueriesShared.getCreateQuery.calledOnce).to.be.true;
					expect(stubs.Base.prepareAsParams.calledOnce).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

			it('will update', done => {

				sinon.spy(instance, 'validate');
				sinon.spy(instance, 'validateInDb');
				instance.createUpdate(stubs.Base.cypherQueriesShared.getUpdateQuery).then(result => {
					sinon.assert.callOrder(
						instance.validate.withArgs({ required: true }),
						stubs.Base.verifyErrorPresence.withArgs(instance),
						instance.validateInDb.withArgs(),
						stubs.Base.cypherQueriesShared.getValidateQuery.withArgs(instance.model),
						stubs.Base.dbQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
						stubs.Base.verifyErrorPresence.withArgs(instance),
						stubs.Base.cypherQueriesShared.getUpdateQuery.withArgs(instance.model),
						stubs.Base.prepareAsParams.withArgs(instance),
						stubs.Base.dbQuery.withArgs(
							{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
						)
					);
					expect(instance.validate.calledOnce).to.be.true;
					expect(stubs.Base.verifyErrorPresence.calledTwice).to.be.true;
					expect(instance.validateInDb.calledOnce).to.be.true;
					expect(stubs.Base.cypherQueriesShared.getValidateQuery.calledOnce).to.be.true;
					expect(stubs.Base.dbQuery.calledTwice).to.be.true;
					expect(stubs.Base.cypherQueriesShared.getUpdateQuery.calledOnce).to.be.true;
					expect(stubs.Base.prepareAsParams.calledOnce).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

		});

		context('invalid data', () => {

			context('initial validation errors caused by submitted values', () => {

				it('will return instance without creating/updating', done => {

					const verifyErrorPresenceStub = sinon.stub().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance = createInstance({ Base: { verifyErrorPresence: verifyErrorPresenceStub } });
					sinon.spy(instance, 'validate');
					sinon.spy(instance, 'validateInDb');
					instance.createUpdate(getCreateUpdateQueryStub).then(result => {
						expect(instance.validate.calledBefore(verifyErrorPresenceStub)).to.be.true;
						expect(instance.validate.calledOnce).to.be.true;
						expect(instance.validate.calledWithExactly({ required: true })).to.be.true;
						expect(verifyErrorPresenceStub.calledOnce).to.be.true;
						expect(verifyErrorPresenceStub.calledWithExactly(instance)).to.be.true;
						expect(instance.validateInDb.notCalled).to.be.true;
						expect(stubs.Base.cypherQueriesShared.getValidateQuery.notCalled).to.be.true;
						expect(stubs.Base.dbQuery.notCalled).to.be.true;
						expect(getCreateUpdateQueryStub.notCalled).to.be.true;
						expect(stubs.Base.prepareAsParams.notCalled).to.be.true;
						expect(result).to.deep.eq({ character: instance });
						done();
					});

				});

			});

			context('secondary validation errors caused by database checks', () => {

				it('will return instance without creating/updating', done => {

					const verifyErrorPresenceStub = sinon.stub();
					verifyErrorPresenceStub.onFirstCall().returns(false).onSecondCall().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance = createInstance({ Base: { verifyErrorPresence: verifyErrorPresenceStub } });
					sinon.spy(instance, 'validate');
					sinon.spy(instance, 'validateInDb');
					instance.createUpdate(getCreateUpdateQueryStub).then(result => {
						sinon.assert.callOrder(
							instance.validate.withArgs({ required: true }),
							verifyErrorPresenceStub.withArgs(instance),
							instance.validateInDb.withArgs(),
							stubs.Base.cypherQueriesShared.getValidateQuery.withArgs(instance.model),
							stubs.Base.dbQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
							verifyErrorPresenceStub.withArgs(instance)
						);
						expect(instance.validate.calledOnce).to.be.true;
						expect(verifyErrorPresenceStub.calledTwice).to.be.true;
						expect(instance.validateInDb.calledOnce).to.be.true;
						expect(stubs.Base.cypherQueriesShared.getValidateQuery.calledOnce).to.be.true;
						expect(stubs.Base.dbQuery.calledOnce).to.be.true;
						expect(getCreateUpdateQueryStub.notCalled).to.be.true;
						expect(stubs.Base.prepareAsParams.notCalled).to.be.true;
						expect(result).to.deep.eq({ character: instance });
						done();
					});

				});

			});

		});

	});

	describe('create method', () => {

		it('will call createUpdate method', done => {

			sinon.spy(instance, 'createUpdate');
			instance.create(stubs.Base.cypherQueriesShared.getCreateQuery).then(() => {
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.Base.cypherQueriesShared.getCreateQuery)).to.be.true;
				done();
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

		it('will call createUpdate method', done => {

			sinon.spy(instance, 'createUpdate');
			instance.update(stubs.Base.cypherQueriesShared.getUpdateQuery).then(() => {
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.Base.cypherQueriesShared.getUpdateQuery)).to.be.true;
				done();
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
				expect(stubs.Base.cypherQueriesShared.getShowQueries.character.calledOnce).to.be.true;
				expect(stubs.Base.cypherQueriesShared.getShowQueries.character.calledWithExactly()).to.be.true;
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

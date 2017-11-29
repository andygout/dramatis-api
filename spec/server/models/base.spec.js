import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import dbQueryFixture from '../../fixtures/db-query';

let stubs;
let instance;

beforeEach(() => {

	stubs = {
		cypherQueriesShared: {
			getValidateQuery: sinon.stub().returns('getValidateQuery response'),
			getCreateQuery: sinon.stub().returns('getCreateQuery response'),
			getCreateQueries: {
				production: sinon.stub()
			},
			getEditQuery: sinon.stub().returns('getEditQuery response'),
			getEditQueries: {
				production: sinon.stub().returns('getEditProductionQuery response')
			},
			getUpdateQuery: sinon.stub().returns('getUpdateQuery response'),
			getUpdateQueries: {
				production: sinon.stub()
			},
			getDeleteQuery: sinon.stub().returns('getDeleteQuery response'),
			getDeleteQueries: {
				production: sinon.stub().returns('getDeleteProductionQuery response')
			},
			getShowQueries: {
				theatre: sinon.stub().returns('getShowTheatreQuery response')
			},
			getListQuery: sinon.stub().returns('getListQuery response')
		},
		dbQuery: sinon.stub().resolves(dbQueryFixture),
		prepareAsParams: sinon.stub().returns('prepareAsParams response'),
		trimStrings: sinon.stub(),
		validateString: sinon.stub().returns([]),
		verifyErrorPresence: sinon.stub().returns(false)
	};

	instance = createInstance();

	instance.model = 'theatre';

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/base', {
		'../database/cypher-queries/shared': stubs.cypherQueriesShared,
		'../database/db-query': stubOverrides.dbQuery || stubs.dbQuery,
		'../lib/prepare-as-params': stubs.prepareAsParams,
		'../lib/trim-strings': stubs.trimStrings,
		'../lib/validate-string': stubOverrides.validateString || stubs.validateString,
		'../lib/verify-error-presence': stubOverrides.verifyErrorPresence || stubs.verifyErrorPresence
	});

const createInstance = (stubOverrides = {}) => {

	const subject = createSubject(stubOverrides);

	return new subject({ name: 'Foobar' });

};

describe('Base model', () => {

	describe('validate method', () => {

		it('will trim strings before validating name', () => {

			instance.validate();
			expect(stubs.trimStrings.calledBefore(stubs.validateString)).to.be.true;
			expect(stubs.trimStrings.calledOnce).to.be.true;
			expect(stubs.trimStrings.calledWithExactly(instance)).to.be.true;
			expect(stubs.validateString.calledOnce).to.be.true;
			expect(stubs.validateString.calledWithExactly(instance.name, {})).to.be.true;

		});

		context('valid data', () => {

			it('will not add properties to errors property', () => {

				instance.validate();
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data', () => {

			it('will add properties that are arrays to errors property', () => {

				instance = createInstance({ validateString: sinon.stub().returns(['Name is too short']) });
				instance.validate();
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name is too short']);

			});

		});

	});

	describe('validateInDb method', () => {

		it('will validate update in database', done => {

			instance.validateInDb().then(() => {
				expect(stubs.cypherQueriesShared.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getValidateQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getValidateQuery response', params: instance }
				)).to.be.true;
				done();
			});

		});

		context('valid data (results returned that indicate name does not already exist)', () => {

			it('will not add properties to errors property', done => {

				instance = createInstance({ dbQuery: sinon.stub().resolves({ instanceCount: 0 }) });
				instance.validateInDb().then(() => {
					expect(instance.errors).not.to.have.property('name');
					expect(instance.errors).to.deep.eq({});
					done();
				});

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('will add properties that are arrays to errors property', done => {

				instance = createInstance({ dbQuery: sinon.stub().resolves({ instanceCount: 1 }) });
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
				instance.createUpdate(stubs.cypherQueriesShared.getCreateQuery).then(result => {
					sinon.assert.callOrder(
						instance.validate.withArgs({ required: true }),
						stubs.verifyErrorPresence.withArgs(instance),
						instance.validateInDb.withArgs(),
						stubs.cypherQueriesShared.getValidateQuery.withArgs(instance.model),
						stubs.dbQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
						stubs.verifyErrorPresence.withArgs(instance),
						stubs.cypherQueriesShared.getCreateQuery.withArgs(instance.model),
						stubs.prepareAsParams.withArgs(instance),
						stubs.dbQuery.withArgs(
							{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
						)
					);
					expect(instance.validate.calledOnce).to.be.true;
					expect(stubs.verifyErrorPresence.calledTwice).to.be.true;
					expect(instance.validateInDb.calledOnce).to.be.true;
					expect(stubs.cypherQueriesShared.getValidateQuery.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledTwice).to.be.true;
					expect(stubs.cypherQueriesShared.getCreateQuery.calledOnce).to.be.true;
					expect(stubs.prepareAsParams.calledOnce).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

			it('will update', done => {

				sinon.spy(instance, 'validate');
				sinon.spy(instance, 'validateInDb');
				instance.createUpdate(stubs.cypherQueriesShared.getUpdateQuery).then(result => {
					sinon.assert.callOrder(
						instance.validate.withArgs({ required: true }),
						stubs.verifyErrorPresence.withArgs(instance),
						instance.validateInDb.withArgs(),
						stubs.cypherQueriesShared.getValidateQuery.withArgs(instance.model),
						stubs.dbQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
						stubs.verifyErrorPresence.withArgs(instance),
						stubs.cypherQueriesShared.getUpdateQuery.withArgs(instance.model),
						stubs.prepareAsParams.withArgs(instance),
						stubs.dbQuery.withArgs(
							{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
						)
					);
					expect(instance.validate.calledOnce).to.be.true;
					expect(stubs.verifyErrorPresence.calledTwice).to.be.true;
					expect(instance.validateInDb.calledOnce).to.be.true;
					expect(stubs.cypherQueriesShared.getValidateQuery.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledTwice).to.be.true;
					expect(stubs.cypherQueriesShared.getUpdateQuery.calledOnce).to.be.true;
					expect(stubs.prepareAsParams.calledOnce).to.be.true;
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
					instance = createInstance({ verifyErrorPresence: verifyErrorPresenceStub });
					instance.model = 'theatre';
					sinon.spy(instance, 'validate');
					sinon.spy(instance, 'validateInDb');
					instance.createUpdate(getCreateUpdateQueryStub).then(result => {
						expect(instance.validate.calledBefore(verifyErrorPresenceStub)).to.be.true;
						expect(instance.validate.calledOnce).to.be.true;
						expect(instance.validate.calledWithExactly({ required: true })).to.be.true;
						expect(verifyErrorPresenceStub.calledOnce).to.be.true;
						expect(verifyErrorPresenceStub.calledWithExactly(instance)).to.be.true;
						expect(instance.validateInDb.notCalled).to.be.true;
						expect(stubs.cypherQueriesShared.getValidateQuery.notCalled).to.be.true;
						expect(stubs.dbQuery.notCalled).to.be.true;
						expect(getCreateUpdateQueryStub.notCalled).to.be.true;
						expect(stubs.prepareAsParams.notCalled).to.be.true;
						expect(result).to.deep.eq({ theatre: instance });
						done();
					});

				});

			});

			context('secondary validation errors caused by database checks', () => {

				it('will return instance without creating/updating', done => {

					const verifyErrorPresenceStub = sinon.stub();
					verifyErrorPresenceStub.onFirstCall().returns(false).onSecondCall().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance = createInstance({ verifyErrorPresence: verifyErrorPresenceStub });
					instance.model = 'theatre';
					sinon.spy(instance, 'validate');
					sinon.spy(instance, 'validateInDb');
					instance.createUpdate(getCreateUpdateQueryStub).then(result => {
						sinon.assert.callOrder(
							instance.validate.withArgs({ required: true }),
							verifyErrorPresenceStub.withArgs(instance),
							instance.validateInDb.withArgs(),
							stubs.cypherQueriesShared.getValidateQuery.withArgs(instance.model),
							stubs.dbQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
							verifyErrorPresenceStub.withArgs(instance)
						);
						expect(instance.validate.calledOnce).to.be.true;
						expect(verifyErrorPresenceStub.calledTwice).to.be.true;
						expect(instance.validateInDb.calledOnce).to.be.true;
						expect(stubs.cypherQueriesShared.getValidateQuery.calledOnce).to.be.true;
						expect(stubs.dbQuery.calledOnce).to.be.true;
						expect(getCreateUpdateQueryStub.notCalled).to.be.true;
						expect(stubs.prepareAsParams.notCalled).to.be.true;
						expect(result).to.deep.eq({ theatre: instance });
						done();
					});

				});

			});

		});

	});

	describe('create method', () => {

		context('instance requires a model-specific query', () => {

			it('will call createUpdate method with function to get model-specific create query as argument', done => {

				instance.model = 'production';
				sinon.spy(instance, 'createUpdate');
				instance.create().then(() => {
					expect(instance.createUpdate.calledOnce).to.be.true;
					expect(instance.createUpdate.calledWithExactly(
						stubs.cypherQueriesShared.getCreateQueries[instance.model]
					)).to.be.true;
					done();
				});

			});

		});

		context('instance can use shared query', () => {

			it('will call createUpdate method with function to get shared create query as argument', done => {

				sinon.spy(instance, 'createUpdate');
				instance.create().then(() => {
					expect(instance.createUpdate.calledOnce).to.be.true;
					expect(instance.createUpdate.calledWithExactly(stubs.cypherQueriesShared.getCreateQuery)).to.be.true;
					done();
				});

			});

		});

	});

	describe('edit method', () => {

		context('instance requires a model-specific query', () => {

			it('will get edit data using model-specific query', done => {

				instance.model = 'production';
				instance.edit().then(result => {
					expect(stubs.cypherQueriesShared.getEditQueries[instance.model].calledOnce).to.be.true;
					expect(stubs.cypherQueriesShared.getEditQueries[instance.model].calledWithExactly()).to.be.true;
					expect(stubs.cypherQueriesShared.getEditQuery.notCalled).to.be.true;
					expect(stubs.dbQuery.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledWithExactly(
						{ query: 'getEditProductionQuery response', params: instance }
					)).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

		});

		context('instance can use shared query', () => {

			it('will get edit data using shared query', done => {

				instance.edit().then(result => {
					expect(stubs.cypherQueriesShared.getEditQuery.calledOnce).to.be.true;
					expect(stubs.cypherQueriesShared.getEditQuery.calledWithExactly(instance.model)).to.be.true;
					expect(stubs.cypherQueriesShared.getEditQueries.production.notCalled).to.be.true;
					expect(stubs.dbQuery.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledWithExactly(
						{ query: 'getEditQuery response', params: instance }
					)).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

		});

	});

	describe('update method', () => {

		context('instance requires a model-specific query', () => {

			it('will call createUpdate method with function to get model-specific update query as argument', done => {

				instance.model = 'production';
				sinon.spy(instance, 'createUpdate');
				instance.update().then(() => {
					expect(instance.createUpdate.calledOnce).to.be.true;
					expect(instance.createUpdate.calledWithExactly(
						stubs.cypherQueriesShared.getUpdateQueries[instance.model]
					)).to.be.true;
					done();
				});

			});

		});

		context('instance can use shared query', () => {

			it('will call createUpdate method with function to get shared update query as argument', done => {

				sinon.spy(instance, 'createUpdate');
				instance.update().then(() => {
					expect(instance.createUpdate.calledOnce).to.be.true;
					expect(instance.createUpdate.calledWithExactly(stubs.cypherQueriesShared.getUpdateQuery)).to.be.true;
					done();
				});

			});

		});

	});

	describe('delete method', () => {

		context('instance requires a model-specific query', () => {

			it('will delete using model-specific query', done => {

				instance.model = 'production';
				instance.delete().then(result => {
					expect(stubs.cypherQueriesShared.getDeleteQueries[instance.model].calledOnce).to.be.true;
					expect(stubs.cypherQueriesShared.getDeleteQueries[instance.model].calledWithExactly()).to.be.true;
					expect(stubs.cypherQueriesShared.getDeleteQuery.notCalled).to.be.true;
					expect(stubs.dbQuery.calledOnce).to.be.true;
					expect(stubs.dbQuery.calledWithExactly(
						{ query: 'getDeleteProductionQuery response', params: instance }
					)).to.be.true;
					expect(result).to.deep.eq(dbQueryFixture);
					done();
				});

			});

		});

		context('instance can use shared query', () => {

			it('will delete using shared query', done => {

				instance.delete().then(result => {
					expect(stubs.cypherQueriesShared.getDeleteQuery.calledOnce).to.be.true;
					expect(stubs.cypherQueriesShared.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
					expect(stubs.cypherQueriesShared.getDeleteQueries.production.notCalled).to.be.true;
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

	describe('show method', () => {

		it('will get show data', done => {

			instance.show().then(result => {
				expect(stubs.cypherQueriesShared.getShowQueries.theatre.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getShowQueries.theatre.calledWithExactly()).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getShowTheatreQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);
				done();
			});

		});

	});

	describe('list method', () => {

		it('will get list data', done => {

			const subject = createSubject();
			subject.list('model').then(result => {
				expect(stubs.cypherQueriesShared.getListQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getListQuery.calledWithExactly('model')).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly({ query: 'getListQuery response' })).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);
				done();
			});

		});

	});

});

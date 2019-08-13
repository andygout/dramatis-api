import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import dbQueryFixture from '../../fixtures/db-query';

let stubs;
let instance;

beforeEach(() => {

	stubs = {
		cypherQueriesModelSpecific: {
			getCreateQueries: {
				production: sinon.stub()
			},
			getEditQueries: {
				production: sinon.stub().returns('getEditProductionQuery response')
			},
			getUpdateQueries: {
				production: sinon.stub()
			},
			getDeleteQueries: {
				production: sinon.stub().returns('getDeleteProductionQuery response')
			},
			getShowQueries: {
				theatre: sinon.stub().returns('getShowTheatreQuery response')
			}
		},
		cypherQueriesShared: {
			getValidateQuery: sinon.stub().returns('getValidateQuery response'),
			getCreateQuery: sinon.stub().returns('getCreateQuery response'),
			getEditQuery: sinon.stub().returns('getEditQuery response'),
			getUpdateQuery: sinon.stub().returns('getUpdateQuery response'),
			getDeleteQuery: sinon.stub().returns('getDeleteQuery response'),
			getListQuery: sinon.stub().returns('getListQuery response')
		},
		dbQuery: sinon.stub().resolves(dbQueryFixture),
		prepareAsParams: sinon.stub().returns('prepareAsParams response'),
		validateString: sinon.stub().returns([]),
		verifyErrorPresence: sinon.stub().returns(false)
	};

	instance = createInstance();

	instance.model = 'theatre';

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/base', {
		'../database/cypher-queries/model-query-maps': stubs.cypherQueriesModelSpecific,
		'../database/cypher-queries/shared': stubs.cypherQueriesShared,
		'../database/db-query': stubOverrides.dbQuery || stubs.dbQuery,
		'../lib/prepare-as-params': stubs.prepareAsParams,
		'../lib/validate-string': stubOverrides.validateString || stubs.validateString,
		'../lib/verify-error-presence': stubOverrides.verifyErrorPresence || stubs.verifyErrorPresence
	});

const createInstance = (stubOverrides = {}, props = { name: 'Foobar' }) => {

	const subject = createSubject(stubOverrides);

	return new subject(props);

};

describe('Base model', () => {

	describe('constructor method', () => {

		describe('name property', () => {

			it('will assign as empty string if not included in props', () => {

				instance = createInstance({}, {});
				expect(instance.name).to.eq('');

			});

			it('will trim', () => {

				instance = createInstance({}, { name: ' Barfoo ' });
				expect(instance.name).to.eq('Barfoo');

			});

		});

	});

	describe('validate method', () => {

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

		it('will validate update in database', async () => {

			await instance.validateInDb();
			expect(stubs.cypherQueriesShared.getValidateQuery.calledOnce).to.be.true;
			expect(stubs.cypherQueriesShared.getValidateQuery.calledWithExactly(
				instance.model, instance.uuid
			)).to.be.true;
			expect(stubs.dbQuery.calledOnce).to.be.true;
			expect(stubs.dbQuery.calledWithExactly(
				{ query: 'getValidateQuery response', params: instance }
			)).to.be.true;

		});

		context('valid data (results returned that indicate name does not already exist)', () => {

			it('will not add properties to errors property', async () => {

				instance = createInstance({ dbQuery: sinon.stub().resolves({ instanceCount: 0 }) });
				await instance.validateInDb();
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('will add properties that are arrays to errors property', async () => {

				instance = createInstance({ dbQuery: sinon.stub().resolves({ instanceCount: 1 }) });
				await instance.validateInDb();
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name already exists']);

			});

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('will create', async () => {

				sinon.spy(instance, 'validate');
				sinon.spy(instance, 'validateInDb');
				const result = await instance.createUpdate(stubs.cypherQueriesShared.getCreateQuery)
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

			});

			it('will update', async () => {

				sinon.spy(instance, 'validate');
				sinon.spy(instance, 'validateInDb');
				const result = await instance.createUpdate(stubs.cypherQueriesShared.getUpdateQuery);
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

			});

		});

		context('invalid data', () => {

			context('initial validation errors caused by submitted values', () => {

				it('will return instance without creating/updating', async () => {

					const verifyErrorPresenceStub = sinon.stub().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance = createInstance({ verifyErrorPresence: verifyErrorPresenceStub });
					instance.model = 'theatre';
					sinon.spy(instance, 'validate');
					sinon.spy(instance, 'validateInDb');
					const result = await instance.createUpdate(getCreateUpdateQueryStub);
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
					expect(result).to.deep.eq(instance);

				});

			});

			context('secondary validation errors caused by database checks', () => {

				it('will return instance without creating/updating', async () => {

					const verifyErrorPresenceStub = sinon.stub();
					verifyErrorPresenceStub.onFirstCall().returns(false).onSecondCall().returns(true);
					const getCreateUpdateQueryStub = sinon.stub();
					instance = createInstance({ verifyErrorPresence: verifyErrorPresenceStub });
					instance.model = 'theatre';
					sinon.spy(instance, 'validate');
					sinon.spy(instance, 'validateInDb');
					const result = await instance.createUpdate(getCreateUpdateQueryStub);
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
					expect(result).to.deep.eq(instance);

				});

			});

		});

	});

	describe('create method', () => {

		context('instance requires a model-specific query', () => {

			it('will call createUpdate method with function to get model-specific create query as argument', async () => {

				instance.model = 'production';
				sinon.spy(instance, 'createUpdate');
				await instance.create();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(
					stubs.cypherQueriesModelSpecific.getCreateQueries[instance.model]
				)).to.be.true;

			});

		});

		context('instance can use shared query', () => {

			it('will call createUpdate method with function to get shared create query as argument', async () => {

				sinon.spy(instance, 'createUpdate');
				await instance.create();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.cypherQueriesShared.getCreateQuery)).to.be.true;

			});

		});

	});

	describe('edit method', () => {

		context('instance requires a model-specific query', () => {

			it('will get edit data using model-specific query', async () => {

				instance.model = 'production';
				const result = await instance.edit();
				expect(stubs.cypherQueriesModelSpecific.getEditQueries[instance.model].calledOnce).to.be.true;
				expect(stubs.cypherQueriesModelSpecific.getEditQueries[instance.model].calledWithExactly()).to.be.true;
				expect(stubs.cypherQueriesShared.getEditQuery.notCalled).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getEditProductionQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);

			});

		});

		context('instance can use shared query', () => {

			it('will get edit data using shared query', async () => {

				const result = await instance.edit();
				expect(stubs.cypherQueriesShared.getEditQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getEditQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.cypherQueriesModelSpecific.getEditQueries.production.notCalled).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getEditQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);

			});

		});

	});

	describe('update method', () => {

		context('instance requires a model-specific query', () => {

			it('will call createUpdate method with function to get model-specific update query as argument', async () => {

				instance.model = 'production';
				sinon.spy(instance, 'createUpdate');
				await instance.update();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(
					stubs.cypherQueriesModelSpecific.getUpdateQueries[instance.model]
				)).to.be.true;

			});

		});

		context('instance can use shared query', () => {

			it('will call createUpdate method with function to get shared update query as argument', async () => {

				sinon.spy(instance, 'createUpdate');
				await instance.update();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.cypherQueriesShared.getUpdateQuery)).to.be.true;

			});

		});

	});

	describe('delete method', () => {

		context('instance requires a model-specific query', () => {

			it('will delete using model-specific query', async () => {

				instance.model = 'production';
				const result = await instance.delete();
				expect(stubs.cypherQueriesModelSpecific.getDeleteQueries[instance.model].calledOnce).to.be.true;
				expect(stubs.cypherQueriesModelSpecific.getDeleteQueries[instance.model].calledWithExactly()).to.be.true;
				expect(stubs.cypherQueriesShared.getDeleteQuery.notCalled).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getDeleteProductionQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);

			});

		});

		context('instance can use shared query', () => {

			it('will delete using shared query', async () => {

				const result = await instance.delete();
				expect(stubs.cypherQueriesShared.getDeleteQuery.calledOnce).to.be.true;
				expect(stubs.cypherQueriesShared.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.cypherQueriesModelSpecific.getDeleteQueries.production.notCalled).to.be.true;
				expect(stubs.dbQuery.calledOnce).to.be.true;
				expect(stubs.dbQuery.calledWithExactly(
					{ query: 'getDeleteQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(dbQueryFixture);

			});

		});

	});

	describe('show method', () => {

		it('will get show data', async () => {

			const result = await instance.show();
			expect(stubs.cypherQueriesModelSpecific.getShowQueries.theatre.calledOnce).to.be.true;
			expect(stubs.cypherQueriesModelSpecific.getShowQueries.theatre.calledWithExactly()).to.be.true;
			expect(stubs.dbQuery.calledOnce).to.be.true;
			expect(stubs.dbQuery.calledWithExactly(
				{ query: 'getShowTheatreQuery response', params: instance }
			)).to.be.true;
			expect(result).to.deep.eq(dbQueryFixture);

		});

	});

	describe('list method', () => {

		it('will get list data', async () => {

			const subject = createSubject();
			const result = await subject.list('model');
			expect(stubs.cypherQueriesShared.getListQuery.calledOnce).to.be.true;
			expect(stubs.cypherQueriesShared.getListQuery.calledWithExactly('model')).to.be.true;
			expect(stubs.dbQuery.calledOnce).to.be.true;
			expect(stubs.dbQuery.calledWithExactly(
				{ query: 'getListQuery response' }, { isReqdResult: false, returnArray: true }
			)).to.be.true;
			expect(result).to.deep.eq(dbQueryFixture);

		});

	});

});

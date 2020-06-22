import { expect } from 'chai';
import { assert, createSandbox, spy, stub } from 'sinon';

import * as hasErrorsModule from '../../../src/lib/has-errors';
import * as prepareAsParamsModule from '../../../src/lib/prepare-as-params';
import * as validateStringModule from '../../../src/lib/validate-string';
import Base from '../../../src/models/Base';
import * as cypherQueries from '../../../src/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../src/neo4j/query';
import neo4jQueryFixture from '../../fixtures/neo4j-query';

describe('Base model', () => {

	let stubs;
	let instance;

	const EMPTY_STRING = '';
	const STRING_MAX_LENGTH = 1000;
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			prepareAsParams: sandbox.stub(prepareAsParamsModule, 'prepareAsParams').returns('prepareAsParams response'),
			validateString: sandbox.stub(validateStringModule, 'validateString').returns([]),
			hasErrors: sandbox.stub(hasErrorsModule, 'hasErrors').returns(false),
			getCreateQueries: {
				production:
					sandbox.stub(cypherQueries.getCreateQueries, 'production')
			},
			getEditQueries: {
				production:
					sandbox.stub(cypherQueries.getEditQueries, 'production')
						.returns('getEditProductionQuery response')
			},
			getUpdateQueries: {
				production: sandbox.stub(cypherQueries.getUpdateQueries, 'production')
			},
			getDeleteQueries: {
				production:
					sandbox.stub(cypherQueries.getDeleteQueries, 'production')
						.returns('getDeleteProductionQuery response')
			},
			getShowQueries: {
				theatre:
					sandbox.stub(cypherQueries.getShowQueries, 'theatre')
						.returns('getShowTheatreQuery response')
			},
			sharedQueries: {
				getValidateQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getValidateQuery').returns('getValidateQuery response'),
				getCreateQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getCreateQuery').returns('getCreateQuery response'),
				getEditQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getEditQuery').returns('getEditQuery response'),
				getUpdateQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getUpdateQuery').returns('getUpdateQuery response'),
				getDeleteQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getDeleteQuery').returns('getDeleteQuery response'),
				getListQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getListQuery').returns('getListQuery response')
			},
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryFixture)
		};

		stubs.validateString.withArgs(EMPTY_STRING).returns(['Name is too short']);
		stubs.validateString.withArgs(ABOVE_MAX_LENGTH_STRING).returns(['Name is too long']);

		instance = new Base({ name: 'Foobar' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('name property', () => {

			it('assigns empty string if absent from props', () => {

				instance = new Base({});
				expect(instance.name).to.eq('');

			});

			it('assigns given value', () => {

				instance = new Base({ name: 'Barfoo' });
				expect(instance.name).to.eq('Barfoo');

			});

			it('trims given value before assigning', () => {

				instance = new Base({ name: ' Barfoo ' });
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

			it('adds properties whose values are arrays to errors property', () => {

				instance = new Base({ name: EMPTY_STRING });
				instance.validate();
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name is too short']);

			});

		});

	});

	describe('validateGroupItem method', () => {

		context('valid data', () => {

			it('will not add properties to errors property', () => {

				spy(instance, 'validate');
				const opts = {};
				instance.validateGroupItem(opts);
				expect(instance.validate.calledOnce).to.be.true;
				expect((instance.validate.getCall(0)).calledWith(opts)).to.be.true;
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data', () => {

			context('invalid data in group context', () => {

				it('adds properties whose values are arrays to errors property', () => {

					spy(instance, 'validate');
					const opts = { hasDuplicateName: true };
					instance.validateGroupItem(opts);
					expect(instance.validate.calledOnce).to.be.true;
					expect((instance.validate.getCall(0)).calledWith(opts)).to.be.true;
					expect(instance.errors)
						.to.have.property('name')
						.that.is.an('array')
						.that.deep.eq(['Name has been duplicated in this group']);

				});

			});

			context('invalid data on individual basis and in group context', () => {

				it('adds properties whose values are arrays (containing multiple items) to errors property', () => {

					instance = new Base({ name: ABOVE_MAX_LENGTH_STRING });
					spy(instance, 'validate');
					const opts = { hasDuplicateName: true };
					instance.validateGroupItem(opts);
					expect(instance.validate.calledOnce).to.be.true;
					expect((instance.validate.getCall(0)).calledWith(opts)).to.be.true;
					expect(instance.errors)
						.to.have.property('name')
						.that.is.an('array')
						.that.deep.eq([
							'Name is too long',
							'Name has been duplicated in this group'
						]);

				});

			});

		});

	});

	describe('validateInDb method', () => {

		it('validates update in database', async () => {

			await instance.validateInDb();
			expect(stubs.sharedQueries.getValidateQuery.calledOnce).to.be.true;
			expect(stubs.sharedQueries.getValidateQuery.calledWithExactly(
				instance.model, instance.uuid
			)).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getValidateQuery response', params: instance }
			)).to.be.true;

		});

		context('valid data (results returned that indicate name does not already exist)', () => {

			it('will not add properties to errors property', async () => {

				stubs.neo4jQuery.resolves({ instanceCount: 0 });
				await instance.validateInDb();
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('adds properties that are arrays to errors property', async () => {

				stubs.neo4jQuery.resolves({ instanceCount: 1 });
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

			it('creates', async () => {

				spy(instance, 'validate');
				spy(instance, 'validateInDb');
				const result = await instance.createUpdate(stubs.sharedQueries.getCreateQuery)
				assert.callOrder(
					instance.validate.withArgs({ requiresName: true }),
					stubs.hasErrors.withArgs(instance),
					instance.validateInDb.withArgs(),
					stubs.sharedQueries.getValidateQuery.withArgs(instance.model),
					stubs.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
					stubs.hasErrors.withArgs(instance),
					stubs.sharedQueries.getCreateQuery.withArgs(instance.model),
					stubs.prepareAsParams.withArgs(instance),
					stubs.neo4jQuery.withArgs(
						{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.validate.calledOnce).to.be.true;
				expect(stubs.hasErrors.calledTwice).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.sharedQueries.getCreateQuery.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

			it('updates', async () => {

				spy(instance, 'validate');
				spy(instance, 'validateInDb');
				const result = await instance.createUpdate(stubs.sharedQueries.getUpdateQuery);
				assert.callOrder(
					instance.validate.withArgs({ requiresName: true }),
					stubs.hasErrors.withArgs(instance),
					instance.validateInDb.withArgs(),
					stubs.sharedQueries.getValidateQuery.withArgs(instance.model),
					stubs.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
					stubs.hasErrors.withArgs(instance),
					stubs.sharedQueries.getUpdateQuery.withArgs(instance.model),
					stubs.prepareAsParams.withArgs(instance),
					stubs.neo4jQuery.withArgs(
						{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.validate.calledOnce).to.be.true;
				expect(stubs.hasErrors.calledTwice).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.sharedQueries.getUpdateQuery.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

		});

		context('invalid data', () => {

			context('initial validation errors caused by submitted values', () => {

				it('returns instance without creating/updating', async () => {

					stubs.hasErrors.returns(true);
					const getCreateUpdateQueryStub = stub();
					instance.model = 'theatre';
					spy(instance, 'validate');
					spy(instance, 'validateInDb');
					const result = await instance.createUpdate(getCreateUpdateQueryStub);
					expect(instance.validate.calledBefore(stubs.hasErrors)).to.be.true;
					expect(instance.validate.calledOnce).to.be.true;
					expect(instance.validate.calledWithExactly({ requiresName: true })).to.be.true;
					expect(stubs.hasErrors.calledOnce).to.be.true;
					expect(stubs.hasErrors.calledWithExactly(instance)).to.be.true;
					expect(instance.validateInDb.notCalled).to.be.true;
					expect(stubs.sharedQueries.getValidateQuery.notCalled).to.be.true;
					expect(stubs.neo4jQuery.notCalled).to.be.true;
					expect(getCreateUpdateQueryStub.notCalled).to.be.true;
					expect(stubs.prepareAsParams.notCalled).to.be.true;
					expect(result).to.deep.eq(instance);

				});

			});

			context('secondary validation errors caused by database checks', () => {

				it('returns instance without creating/updating', async () => {

					stubs.hasErrors.onFirstCall().returns(false).onSecondCall().returns(true);
					const getCreateUpdateQueryStub = stub();
					instance.model = 'theatre';
					spy(instance, 'validate');
					spy(instance, 'validateInDb');
					const result = await instance.createUpdate(getCreateUpdateQueryStub);
					assert.callOrder(
						instance.validate.withArgs({ requiresName: true }),
						stubs.hasErrors.withArgs(instance),
						instance.validateInDb.withArgs(),
						stubs.sharedQueries.getValidateQuery.withArgs(instance.model),
						stubs.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
						stubs.hasErrors.withArgs(instance)
					);
					expect(instance.validate.calledOnce).to.be.true;
					expect(stubs.hasErrors.calledTwice).to.be.true;
					expect(instance.validateInDb.calledOnce).to.be.true;
					expect(stubs.sharedQueries.getValidateQuery.calledOnce).to.be.true;
					expect(stubs.neo4jQuery.calledOnce).to.be.true;
					expect(getCreateUpdateQueryStub.notCalled).to.be.true;
					expect(stubs.prepareAsParams.notCalled).to.be.true;
					expect(result).to.deep.eq(instance);

				});

			});

		});

	});

	describe('create method', () => {

		context('instance requires a model-specific query', () => {

			it('calls createUpdate method with function to get model-specific create query as argument', async () => {

				instance.model = 'production';
				spy(instance, 'createUpdate');
				await instance.create();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.getCreateQueries[instance.model])).to.be.true;

			});

		});

		context('instance can use shared query', () => {

			it('calls createUpdate method with function to get shared create query as argument', async () => {

				spy(instance, 'createUpdate');
				await instance.create();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.sharedQueries.getCreateQuery)).to.be.true;

			});

		});

	});

	describe('edit method', () => {

		context('instance requires a model-specific query', () => {

			it('gets edit data using model-specific query', async () => {

				instance.model = 'production';
				const result = await instance.edit();
				expect(stubs.getEditQueries[instance.model].calledOnce).to.be.true;
				expect(stubs.getEditQueries[instance.model].calledWithExactly()).to.be.true;
				expect(stubs.sharedQueries.getEditQuery.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getEditProductionQuery response', params: instance }
				)).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

		});

		context('instance can use shared query', () => {

			it('gets edit data using shared query', async () => {

				const result = await instance.edit();
				expect(stubs.sharedQueries.getEditQuery.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getEditQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.getEditQueries.production.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getEditQuery response', params: instance }
				)).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

		});

	});

	describe('update method', () => {

		context('instance requires a model-specific query', () => {

			it('calls createUpdate method with function to get model-specific update query as argument', async () => {

				instance.model = 'production';
				spy(instance, 'createUpdate');
				await instance.update();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.getUpdateQueries[instance.model])).to.be.true;

			});

		});

		context('instance can use shared query', () => {

			it('calls createUpdate method with function to get shared update query as argument', async () => {

				spy(instance, 'createUpdate');
				await instance.update();
				expect(instance.createUpdate.calledOnce).to.be.true;
				expect(instance.createUpdate.calledWithExactly(stubs.sharedQueries.getUpdateQuery)).to.be.true;

			});

		});

	});

	describe('delete method', () => {

		context('instance requires a model-specific query', () => {

			it('deletes using model-specific query', async () => {

				instance.model = 'production';
				const result = await instance.delete();
				expect(stubs.getDeleteQueries[instance.model].calledOnce).to.be.true;
				expect(stubs.getDeleteQueries[instance.model].calledWithExactly()).to.be.true;
				expect(stubs.sharedQueries.getDeleteQuery.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getDeleteProductionQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

		context('instance can use shared query', () => {

			it('deletes using shared query', async () => {

				const result = await instance.delete();
				expect(stubs.sharedQueries.getDeleteQuery.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.getDeleteQueries.production.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getDeleteQuery response', params: instance }
				)).to.be.true;
				expect(result).to.deep.eq(neo4jQueryFixture);

			});

		});

	});

	describe('show method', () => {

		it('gets show data', async () => {

			instance.model = 'theatre';
			const result = await instance.show();
			expect(stubs.getShowQueries.theatre.calledOnce).to.be.true;
			expect(stubs.getShowQueries.theatre.calledWithExactly()).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getShowTheatreQuery response', params: instance }
			)).to.be.true;
			expect(result).to.deep.eq(neo4jQueryFixture);

		});

	});

	describe('list method', () => {

		it('gets list data', async () => {

			const result = await Base.list('model');
			expect(stubs.sharedQueries.getListQuery.calledOnce).to.be.true;
			expect(stubs.sharedQueries.getListQuery.calledWithExactly('model')).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getListQuery response' }, { isOptionalResult: true, isArrayResult: true }
			)).to.be.true;
			expect(result).to.deep.eq(neo4jQueryFixture);

		});

	});

});

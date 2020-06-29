import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { assert, createSandbox, spy, stub } from 'sinon';

import * as hasErrorsModule from '../../../src/lib/has-errors';
import * as prepareAsParamsModule from '../../../src/lib/prepare-as-params';
import * as validateStringModule from '../../../src/lib/validate-string';
import Base from '../../../src/models/Base';
import * as cypherQueries from '../../../src/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../src/neo4j/query';
import neo4jQueryFixture from '../../fixtures/neo4j-query';

describe('Base model', () => {

	const expect = chai.expect;
	chai.use(chaiAsPromised);

	let stubs;
	let instance;

	const EMPTY_STRING = '';
	const STRING_MAX_LENGTH = 1000;
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			prepareAsParams: sandbox.stub(prepareAsParamsModule, 'prepareAsParams').returns('prepareAsParams response'),
			validateString: sandbox.stub(validateStringModule, 'validateString').returns(undefined),
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
				getExistenceQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getExistenceQuery').returns('getExistenceQuery response'),
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

		stubs.validateString.withArgs(EMPTY_STRING).returns('Name is too short');
		stubs.validateString.withArgs(ABOVE_MAX_LENGTH_STRING).returns('Name is too long');

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

			it('will not call addPropertyError method', () => {

				spy(instance, 'addPropertyError');
				instance.validate();
				expect(stubs.validateString.calledOnce).to.be.true;
				expect(stubs.validateString.calledWithExactly(instance.name, false)).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data', () => {

			it('will call addPropertyError method', () => {

				instance = new Base({ name: EMPTY_STRING });
				spy(instance, 'addPropertyError');
				instance.validate();
				expect(stubs.validateString.calledOnce).to.be.true;
				expect(stubs.validateString.calledWithExactly(instance.name, false)).to.be.true;
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly('name', 'Name is too short')).to.be.true;

			});

		});

	});

	describe('validateGroupItem method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', () => {

				spy(instance, 'validate');
				spy(instance, 'addPropertyError');
				const opts = {};
				instance.validateGroupItem(opts);
				expect(instance.validate.calledOnce).to.be.true;
				expect(instance.validate.calledWithExactly(opts)).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data', () => {

			context('invalid data in group context', () => {

				it('will call addPropertyError method with group context error text', () => {

					spy(instance, 'validate');
					spy(instance, 'addPropertyError');
					const opts = { hasDuplicateName: true };
					instance.validateGroupItem(opts);
					expect(instance.validate.calledOnce).to.be.true;
					expect(instance.validate.calledWithExactly(opts)).to.be.true;
					expect(instance.addPropertyError.calledOnce).to.be.true;
					expect(instance.addPropertyError.calledWithExactly(
						'name', 'Name has been duplicated in this group'
					)).to.be.true;

				});

			});

			context('invalid data on individual basis and in group context', () => {

				it('will call addPropertyError method with both individual basis and group context error text', () => {

					instance = new Base({ name: ABOVE_MAX_LENGTH_STRING });
					spy(instance, 'validate');
					spy(instance, 'addPropertyError');
					const opts = { hasDuplicateName: true };
					instance.validateGroupItem(opts);
					expect(instance.validate.calledOnce).to.be.true;
					expect(instance.validate.calledWithExactly(opts)).to.be.true;
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect((instance.addPropertyError.getCall(0)).calledWithExactly(
						'name', 'Name is too long'
					)).to.be.true;
					expect((instance.addPropertyError.getCall(1)).calledWithExactly(
						'name', 'Name has been duplicated in this group'
					)).to.be.true;

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

			it('will not call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({ instanceCount: 0 });
				spy(instance, 'addPropertyError');
				await instance.validateInDb();
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({ instanceCount: 1 });
				spy(instance, 'addPropertyError');
				await instance.validateInDb();
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly('name', 'Name already exists')).to.be.true;

			});

		});

	});

	describe('addPropertyError method', () => {

		context('property exists on errors object', () => {

			it('merges error into existing array', async () => {

				instance.errors.name = ['Name is too long'];
				instance.addPropertyError('name', 'Name has been duplicated in this group');
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name is too long', 'Name has been duplicated in this group']);

			});

		});

		context('property does not exist on errors object', () => {

			it('adds new property to errors object and assigns a value of an array containing error text', async () => {

				instance.errors.name = ['Name has been duplicated in this group'];
				instance.addPropertyError('characterName', 'Name is too long');
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name has been duplicated in this group']);
				expect(instance.errors)
					.to.have.property('characterName')
					.that.is.an('array')
					.that.deep.eq(['Name is too long']);

			});

		});

	});

	describe('confirmExistenceInDb method', () => {

		it('confirms existence of instance in database', async () => {

			stubs.neo4jQuery.resolves({ exists: true });
			await instance.confirmExistenceInDb();
			expect(stubs.sharedQueries.getExistenceQuery.calledOnce).to.be.true;
			expect(stubs.sharedQueries.getExistenceQuery.calledWithExactly(instance.model)).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getExistenceQuery response', params: instance }
			)).to.be.true;

		});

		context('instance does not exist', () => {

			it('will throw Not Found error', async () => {

				stubs.neo4jQuery.resolves({ exists: false });

				await expect(instance.confirmExistenceInDb()).to.be.rejectedWith(Error, 'Not Found');

			});

		});

		context('instance exists', () => {

			it('will not throw Not Found error', async () => {

				stubs.neo4jQuery.resolves({ exists: true });

				await expect(instance.confirmExistenceInDb()).to.not.be.rejectedWith(Error, 'Not Found');

			});

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('creates', async () => {

				spy(instance, 'validate');
				spy(instance, 'validateInDb');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(stubs.sharedQueries.getCreateQuery)
				assert.callOrder(
					instance.validate.withArgs({ requiresName: true }),
					instance.validateInDb.withArgs(),
					stubs.sharedQueries.getValidateQuery.withArgs(instance.model, instance.uuid),
					stubs.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
					instance.setErrorStatus.withArgs(),
					stubs.hasErrors.withArgs(instance),
					stubs.sharedQueries.getCreateQuery.withArgs(instance.model),
					stubs.prepareAsParams.withArgs(instance),
					stubs.neo4jQuery.withArgs(
						{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.validate.calledOnce).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(stubs.hasErrors.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getCreateQuery.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

			it('updates', async () => {

				spy(instance, 'validate');
				spy(instance, 'validateInDb');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(stubs.sharedQueries.getUpdateQuery);
				assert.callOrder(
					instance.validate.withArgs({ requiresName: true }),
					instance.validateInDb.withArgs(),
					stubs.sharedQueries.getValidateQuery.withArgs(instance.model, instance.uuid),
					stubs.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
					instance.setErrorStatus.withArgs(),
					stubs.hasErrors.withArgs(instance),
					stubs.sharedQueries.getUpdateQuery.withArgs(instance.model),
					stubs.prepareAsParams.withArgs(instance),
					stubs.neo4jQuery.withArgs(
						{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
					)
				);
				expect(instance.validate.calledOnce).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(stubs.hasErrors.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getUpdateQuery.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

		});

		context('invalid data', () => {

			it('returns instance without creating/updating', async () => {

				stubs.hasErrors.returns(true);
				const getCreateUpdateQueryStub = stub();
				instance.model = 'theatre';
				spy(instance, 'validate');
				spy(instance, 'validateInDb');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getCreateUpdateQueryStub);
				assert.callOrder(
					instance.validate.withArgs({ requiresName: true }),
					instance.validateInDb.withArgs(),
					stubs.sharedQueries.getValidateQuery.withArgs(instance.model, instance.uuid),
					stubs.neo4jQuery.withArgs({ query: 'getValidateQuery response', params: instance }),
					instance.setErrorStatus.withArgs(),
					stubs.hasErrors.withArgs(instance)
				);
				expect(instance.validate.calledOnce).to.be.true;
				expect(instance.validateInDb.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getValidateQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(stubs.hasErrors.calledOnce).to.be.true;
				expect(getCreateUpdateQueryStub.notCalled).to.be.true;
				expect(stubs.prepareAsParams.notCalled).to.be.true;
				expect(result).to.deep.eq(instance);

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

		context('instance does not exist', () => {

			it('will throw Not Found error', async () => {

				stubs.neo4jQuery.resolves({ exists: false });
				spy(instance, 'confirmExistenceInDb');
				spy(instance, 'createUpdate');

				await expect(instance.update()).to.be.rejectedWith(Error, 'Not Found');

				expect(instance.confirmExistenceInDb.calledOnce).to.be.true;
				expect(instance.confirmExistenceInDb.calledWithExactly()).to.be.true;
				expect(instance.createUpdate.called).to.be.false;

			});

		});

		context('instance exists', () => {

			context('instance requires a model-specific query', () => {

				it('calls createUpdate method with function to get model-specific update query as argument', async () => {

					stubs.neo4jQuery.resolves({ exists: true });
					instance.model = 'production';
					spy(instance, 'confirmExistenceInDb');
					spy(instance, 'createUpdate');
					await instance.update();
					expect(instance.confirmExistenceInDb.calledOnce).to.be.true;
					expect(instance.confirmExistenceInDb.calledWithExactly()).to.be.true;
					expect(instance.createUpdate.calledOnce).to.be.true;
					expect(instance.createUpdate.calledWithExactly(stubs.getUpdateQueries[instance.model])).to.be.true;

				});

			});

			context('instance can use shared query', () => {

				it('calls createUpdate method with function to get shared update query as argument', async () => {

					stubs.neo4jQuery.resolves({ exists: true });
					spy(instance, 'confirmExistenceInDb');
					spy(instance, 'createUpdate');
					await instance.update();
					expect(instance.confirmExistenceInDb.calledOnce).to.be.true;
					expect(instance.confirmExistenceInDb.calledWithExactly()).to.be.true;
					expect(instance.createUpdate.calledOnce).to.be.true;
					expect(instance.createUpdate.calledWithExactly(stubs.sharedQueries.getUpdateQuery)).to.be.true;

				});

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

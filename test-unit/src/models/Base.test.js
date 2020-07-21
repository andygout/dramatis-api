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
					sandbox.stub(cypherQueries.sharedQueries, 'getExistenceQuery')
						.returns('getExistenceQuery response'),
				getDuplicateNameCountQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getDuplicateNameCountQuery')
						.returns('getDuplicateNameCountQuery response'),
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

		stubs.validateString.withArgs(EMPTY_STRING, { isRequiredString: true }).returns('Name is too short');
		stubs.validateString.withArgs(ABOVE_MAX_LENGTH_STRING, { isRequiredString: false }).returns('Name is too long');

		instance = new Base({ name: 'Foobar' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('name property', () => {

			it('assigns empty string if absent from props', () => {

				instance = new Base({});
				expect(instance.name).to.equal('');

			});

			it('assigns given value', () => {

				instance = new Base({ name: 'Barfoo' });
				expect(instance.name).to.equal('Barfoo');

			});

			it('trims given value before assigning', () => {

				instance = new Base({ name: ' Barfoo ' });
				expect(instance.name).to.equal('Barfoo');

			});

		});

	});

	describe('runInputValidations method', () => {

		it('will call validateName method', () => {

			spy(instance, 'validateName');
			instance.runInputValidations();
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ requiresName: true })).to.be.true;

		});

	});

	describe('validateName method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', () => {

				spy(instance, 'addPropertyError');
				instance.validateName({ requiresName: false });
				expect(stubs.validateString.calledOnce).to.be.true;
				expect(stubs.validateString.calledWithExactly(instance.name, { isRequiredString: false })).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data', () => {

			it('will call addPropertyError method', () => {

				instance = new Base({ name: EMPTY_STRING });
				spy(instance, 'addPropertyError');
				instance.validateName({ requiresName: true });
				assert.callOrder(
					stubs.validateString,
					instance.addPropertyError
				);
				expect(stubs.validateString.calledOnce).to.be.true;
				expect(stubs.validateString.calledWithExactly(instance.name, { isRequiredString: true })).to.be.true;
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly('name', 'Name is too short')).to.be.true;

			});

		});

	});

	describe('validateNameUniquenessInGroup method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', () => {

				spy(instance, 'addPropertyError');
				const opts = { hasDuplicateName: false };
				instance.validateNameUniquenessInGroup(opts);
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data', () => {

			it('will call addPropertyError method with group context error text', () => {

				spy(instance, 'addPropertyError');
				const opts = { hasDuplicateName: true };
				instance.validateNameUniquenessInGroup(opts);
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'name', 'Name has been duplicated in this group'
				)).to.be.true;

			});

		});

	});

	describe('runDatabaseValidations method', () => {

		it('will call validateNameUniquenessInDatabase method', () => {

			spy(instance, 'validateNameUniquenessInDatabase');
			instance.runDatabaseValidations();
			expect(instance.validateNameUniquenessInDatabase.calledOnce).to.be.true;
			expect(instance.validateNameUniquenessInDatabase.calledWithExactly()).to.be.true;

		});

	});

	describe('validateNameUniquenessInDatabase method', () => {

		context('valid data (results returned that indicate name does not already exist)', () => {

			it('will not call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({ instanceCount: 0 });
				spy(instance, 'addPropertyError');
				await instance.validateNameUniquenessInDatabase();
				assert.callOrder(
					stubs.sharedQueries.getDuplicateNameCountQuery,
					stubs.neo4jQuery
				);
				expect(stubs.sharedQueries.getDuplicateNameCountQuery.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getDuplicateNameCountQuery.calledWithExactly(
					instance.model, instance.uuid
				)).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getDuplicateNameCountQuery response', params: instance }
				)).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQuery.resolves({ instanceCount: 1 });
				spy(instance, 'addPropertyError');
				await instance.validateNameUniquenessInDatabase();
				assert.callOrder(
					stubs.sharedQueries.getDuplicateNameCountQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				expect(stubs.sharedQueries.getDuplicateNameCountQuery.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getDuplicateNameCountQuery.calledWithExactly(
					instance.model, instance.uuid
				)).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getDuplicateNameCountQuery response', params: instance }
				)).to.be.true;
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

	describe('setErrorStatus method', () => {

		it('will call hasErrors function and assign its return value to the instance\'s hasErrors property', () => {

			instance.setErrorStatus();
			expect(stubs.hasErrors.calledOnce).to.be.true;
			expect(stubs.hasErrors.calledWithExactly(instance)).to.be.true;
			expect(instance.hasErrors).to.be.false;

		});

	});

	describe('confirmExistenceInDatabase method', () => {

		it('confirms existence of instance in database', async () => {

			stubs.neo4jQuery.resolves({ exists: true });
			await instance.confirmExistenceInDatabase();
			assert.callOrder(
				stubs.sharedQueries.getExistenceQuery,
				stubs.neo4jQuery
			);
			expect(stubs.sharedQueries.getExistenceQuery.calledOnce).to.be.true;
			expect(stubs.sharedQueries.getExistenceQuery.calledWithExactly(instance.model)).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getExistenceQuery response', params: instance }
			)).to.be.true;

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('creates', async () => {

				spy(instance, 'runInputValidations');
				spy(instance, 'runDatabaseValidations');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(stubs.sharedQueries.getCreateQuery);
				assert.callOrder(
					instance.runInputValidations,
					instance.runDatabaseValidations,
					instance.setErrorStatus,
					stubs.sharedQueries.getCreateQuery,
					stubs.prepareAsParams,
					stubs.neo4jQuery
				);
				expect(instance.runInputValidations.calledOnce).to.be.true;
				expect(instance.runInputValidations.calledWithExactly()).to.be.true;
				expect(instance.runDatabaseValidations.calledOnce).to.be.true;
				expect(instance.runDatabaseValidations.calledWithExactly()).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
				expect(stubs.sharedQueries.getCreateQuery.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getCreateQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledWithExactly(instance)).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.neo4jQuery.firstCall.calledWithExactly(
					{ query: 'getDuplicateNameCountQuery response', params: instance }
				)).to.be.true;
				expect(stubs.neo4jQuery.secondCall.calledWithExactly(
					{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
				)).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

			it('updates', async () => {

				spy(instance, 'runInputValidations');
				spy(instance, 'runDatabaseValidations');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(stubs.sharedQueries.getUpdateQuery);
				assert.callOrder(
					instance.runInputValidations,
					instance.runDatabaseValidations,
					instance.setErrorStatus,
					stubs.sharedQueries.getUpdateQuery,
					stubs.prepareAsParams,
					stubs.neo4jQuery
				);
				expect(instance.runInputValidations.calledOnce).to.be.true;
				expect(instance.runInputValidations.calledWithExactly()).to.be.true;
				expect(instance.runDatabaseValidations.calledOnce).to.be.true;
				expect(instance.runDatabaseValidations.calledWithExactly()).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
				expect(stubs.sharedQueries.getUpdateQuery.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getUpdateQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledWithExactly(instance)).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.neo4jQuery.firstCall.calledWithExactly(
					{ query: 'getDuplicateNameCountQuery response', params: instance }
				)).to.be.true;
				expect(stubs.neo4jQuery.secondCall.calledWithExactly(
					{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
				)).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

		});

		context('invalid data', () => {

			it('returns instance without creating/updating', async () => {

				stubs.hasErrors.returns(true);
				const getCreateUpdateQueryStub = stub();
				instance.model = 'theatre';
				spy(instance, 'runInputValidations');
				spy(instance, 'runDatabaseValidations');
				spy(instance, 'setErrorStatus');
				const result = await instance.createUpdate(getCreateUpdateQueryStub);
				assert.callOrder(
					instance.runInputValidations,
					instance.runDatabaseValidations,
					instance.setErrorStatus
				);
				expect(instance.runInputValidations.calledOnce).to.be.true;
				expect(instance.runInputValidations.calledWithExactly()).to.be.true;
				expect(instance.runDatabaseValidations.calledOnce).to.be.true;
				expect(instance.runDatabaseValidations.calledWithExactly()).to.be.true;
				expect(instance.setErrorStatus.calledOnce).to.be.true;
				expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
				expect(getCreateUpdateQueryStub.notCalled).to.be.true;
				expect(stubs.prepareAsParams.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getDuplicateNameCountQuery response', params: instance }
				)).to.be.true;
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

		context('instance exists', () => {

			context('instance requires a model-specific query', () => {

				it('calls createUpdate method with function to get model-specific update query as argument', async () => {

					instance.model = 'production';
					spy(instance, 'confirmExistenceInDatabase');
					spy(instance, 'createUpdate');
					await instance.update();
					expect(instance.confirmExistenceInDatabase.calledOnce).to.be.true;
					expect(instance.confirmExistenceInDatabase.calledWithExactly()).to.be.true;
					expect(instance.createUpdate.calledOnce).to.be.true;
					expect(instance.createUpdate.calledWithExactly(stubs.getUpdateQueries[instance.model])).to.be.true;

				});

			});

			context('instance can use shared query', () => {

				it('calls createUpdate method with function to get shared update query as argument', async () => {

					spy(instance, 'confirmExistenceInDatabase');
					spy(instance, 'createUpdate');
					await instance.update();
					expect(instance.confirmExistenceInDatabase.calledOnce).to.be.true;
					expect(instance.confirmExistenceInDatabase.calledWithExactly()).to.be.true;
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

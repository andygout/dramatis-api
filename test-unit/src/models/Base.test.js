import { expect } from 'chai';
import { assert, createSandbox, spy, stub } from 'sinon';

import * as hasErrorsModule from '../../../src/lib/has-errors';
import * as prepareAsParamsModule from '../../../src/lib/prepare-as-params';
import * as validateStringModule from '../../../src/lib/validate-string';
import Base from '../../../src/models/Base';
import * as cypherQueries from '../../../src/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../src/neo4j/query';

describe('Base model', () => {

	let stubs;
	let instance;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

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
			getShowQueries: {
				theatre:
					sandbox.stub(cypherQueries.getShowQueries, 'theatre')
						.returns('getShowTheatreQuery response')
			},
			sharedQueries: {
				getExistenceQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getExistenceQuery')
						.returns('getExistenceQuery response'),
				getDuplicateRecordCountQuery:
					sandbox.stub(cypherQueries.sharedQueries, 'getDuplicateRecordCountQuery')
						.returns('getDuplicateRecordCountQuery response'),
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
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryMockResponse)
		};

		stubs.validateString.withArgs('', { isRequired: true }).returns('Value is too short');
		stubs.validateString.withArgs(ABOVE_MAX_LENGTH_STRING, { isRequired: false }).returns('Value is too long');

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

			it('assigns empty string if included in props but value is empty string', () => {

				instance = new Base({ name: '' });
				expect(instance.name).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				instance = new Base({ name: ' ' });
				expect(instance.name).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				instance = new Base({ name: 'Barfoo' });
				expect(instance.name).to.equal('Barfoo');

			});

			it('trims value before assigning', () => {

				instance = new Base({ name: ' Barfoo ' });
				expect(instance.name).to.equal('Barfoo');

			});

		});

	});

	describe('hasDifferentiatorProperty method', () => {

		context('instance has differentiator property', () => {

			it('returns true', () => {

				instance.differentiator = '';
				const result = instance.hasDifferentiatorProperty();
				expect(result).to.be.true;

			});

		});

		context('instance does not have differentiator property', () => {

			it('returns false', () => {

				const result = instance.hasDifferentiatorProperty();
				expect(result).to.be.false;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('will call validateName method', () => {

			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			instance.runInputValidations();
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.validateDifferentiator.calledWithExactly()).to.be.true;

		});

	});

	describe('validateName method', () => {

		it('will call validateStringForProperty method', () => {

			spy(instance, 'validateStringForProperty');
			instance.validateName({ isRequired: false });
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly('name', { isRequired: false })).to.be.true;

		});

	});

	describe('validateDifferentiator method', () => {

		it('will call validateStringForProperty method', () => {

			spy(instance, 'validateStringForProperty');
			instance.validateDifferentiator();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly(
				'differentiator', { isRequired: false })
			).to.be.true;

		});

	});

	describe('validateQualifier method', () => {

		it('will call validateStringForProperty method', () => {

			spy(instance, 'validateStringForProperty');
			instance.validateQualifier();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly('qualifier', { isRequired: false })).to.be.true;

		});

	});

	describe('validateStringForProperty method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', () => {

				spy(instance, 'addPropertyError');
				instance.validateStringForProperty('name', { isRequired: false });
				expect(stubs.validateString.calledOnce).to.be.true;
				expect(stubs.validateString.calledWithExactly(instance.name, { isRequired: false })).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data', () => {

			it('will call addPropertyError method', () => {

				instance = new Base({ name: '' });
				spy(instance, 'addPropertyError');
				instance.validateStringForProperty('name', { isRequired: true });
				assert.callOrder(
					stubs.validateString,
					instance.addPropertyError
				);
				expect(stubs.validateString.calledOnce).to.be.true;
				expect(stubs.validateString.calledWithExactly(instance.name, { isRequired: true })).to.be.true;
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly('name', 'Value is too short')).to.be.true;

			});

		});

	});

	describe('validateUniquenessInGroup method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', () => {

				spy(instance, 'addPropertyError');
				const opts = { isDuplicate: false };
				instance.validateUniquenessInGroup(opts);
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data', () => {

			context('instance does not have differentiator, characterDifferentiator, qualifier, or group property', () => {

				it('will call addPropertyError method with group context error text for name property only', () => {

					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledOnce).to.be.true;
					expect(instance.addPropertyError.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has differentiator property', () => {

				it('will call addPropertyError method with group context error text for name and differentiator properties', () => {

					instance.differentiator = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'differentiator', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has characterDifferentiator property', () => {

				it('will call addPropertyError method with group context error text for name and differentiator properties', () => {

					instance.characterDifferentiator = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'characterDifferentiator', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has qualifier property', () => {

				it('will call addPropertyError method with group context error text for name and qualifier properties', () => {

					instance.qualifier = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'qualifier', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has group property', () => {

				it('will call addPropertyError method with group context error text for name and group properties', () => {

					instance.group = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'group', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has differentiator, characterDifferentiator, qualifier, and group property', () => {

				it('will call addPropertyError method with group context error text for name, differentiator, qualifier, and group properties', () => {

					instance.differentiator = '';
					instance.characterDifferentiator = '';
					instance.qualifier = '';
					instance.group = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.callCount).to.equal(5);
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'differentiator', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.thirdCall.calledWithExactly(
						'characterDifferentiator', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(3).calledWithExactly(
						'qualifier', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(4).calledWithExactly(
						'group', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

		});

	});

	describe('runDatabaseValidations method', () => {

		it('will call validateUniquenessInDatabase method', () => {

			spy(instance, 'validateUniquenessInDatabase');
			instance.runDatabaseValidations();
			expect(instance.validateUniquenessInDatabase.calledOnce).to.be.true;
			expect(instance.validateUniquenessInDatabase.calledWithExactly()).to.be.true;

		});

	});

	describe('validateUniquenessInDatabase method', () => {

		context('valid data (results returned that indicate name does not already exist)', () => {

			it('will not call addPropertyError method', async () => {

				stubs.prepareAsParams.returns({
					uuid: 'UUID_VALUE',
					name: 'NAME_VALUE',
					differentiator: 'DIFFERENTIATOR_VALUE'
				});
				stubs.neo4jQuery.resolves({ instanceCount: 0 });
				spy(instance, 'addPropertyError');
				await instance.validateUniquenessInDatabase();
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.sharedQueries.getDuplicateRecordCountQuery,
					stubs.neo4jQuery
				);
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledWithExactly(instance)).to.be.true;
				expect(stubs.sharedQueries.getDuplicateRecordCountQuery.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getDuplicateRecordCountQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{
						query: 'getDuplicateRecordCountQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE'
						}
					}
				)).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('will call addPropertyError method', async () => {

				stubs.prepareAsParams.returns({
					uuid: 'UUID_VALUE',
					name: 'NAME_VALUE',
					differentiator: 'DIFFERENTIATOR_VALUE'
				});
				stubs.neo4jQuery.resolves({ instanceCount: 1 });
				spy(instance, 'addPropertyError');
				await instance.validateUniquenessInDatabase();
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.sharedQueries.getDuplicateRecordCountQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledWithExactly(instance)).to.be.true;
				expect(stubs.sharedQueries.getDuplicateRecordCountQuery.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getDuplicateRecordCountQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{
						query: 'getDuplicateRecordCountQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE'
						}
					}
				)).to.be.true;
				expect(instance.addPropertyError.calledTwice).to.be.true;
				expect(instance.addPropertyError.firstCall.calledWithExactly(
					'name', 'Name and differentiator combination already exists'
				)).to.be.true;
				expect(instance.addPropertyError.secondCall.calledWithExactly(
					'differentiator', 'Name and differentiator combination already exists'
				)).to.be.true;

			});

		});

	});

	describe('addPropertyError method', () => {

		context('property exists on errors object', () => {

			it('merges error into existing array', async () => {

				instance.errors.name = ['Value is too long'];
				instance.addPropertyError('name', 'Name has been duplicated in this group');
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Value is too long', 'Name has been duplicated in this group']);

			});

		});

		context('property does not exist on errors object', () => {

			it('adds new property to errors object and assigns a value of an array containing error text', async () => {

				instance.errors.name = ['Name has been duplicated in this group'];
				instance.addPropertyError('characterName', 'Value is too long');
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name has been duplicated in this group']);
				expect(instance.errors)
					.to.have.property('characterName')
					.that.is.an('array')
					.that.deep.eq(['Value is too long']);

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
				{ query: 'getExistenceQuery response', params: { uuid: instance.uuid } }
			)).to.be.true;

		});

	});

	describe('createUpdate method', () => {

		context('valid data', () => {

			it('creates', async () => {

				stubs.prepareAsParams
					.onFirstCall().returns({
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					})
					.onSecondCall().returns('prepareAsParams response');
				spy(instance, 'runInputValidations');
				spy(instance, 'runDatabaseValidations');
				spy(instance, 'setErrorStatus');
				spy(instance, 'constructor');
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
				expect(stubs.prepareAsParams.calledTwice).to.be.true;
				expect(stubs.prepareAsParams.firstCall.calledWithExactly(instance)).to.be.true;
				expect(stubs.prepareAsParams.secondCall.calledWithExactly(instance)).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.neo4jQuery.firstCall.calledWithExactly(
					{
						query: 'getDuplicateRecordCountQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE'
						}
					}
				)).to.be.true;
				expect(stubs.neo4jQuery.secondCall.calledWithExactly(
					{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
				)).to.be.true;
				expect(instance.constructor.calledOnce).to.be.true;
				expect(instance.constructor.calledWithExactly(neo4jQueryMockResponse)).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

			it('updates', async () => {

				stubs.prepareAsParams
					.onFirstCall().returns({
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					})
					.onSecondCall().returns('prepareAsParams response');
				spy(instance, 'runInputValidations');
				spy(instance, 'runDatabaseValidations');
				spy(instance, 'setErrorStatus');
				spy(instance, 'constructor');
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
				expect(stubs.prepareAsParams.calledTwice).to.be.true;
				expect(stubs.prepareAsParams.firstCall.calledWithExactly(instance)).to.be.true;
				expect(stubs.prepareAsParams.secondCall.calledWithExactly(instance)).to.be.true;
				expect(stubs.neo4jQuery.calledTwice).to.be.true;
				expect(stubs.neo4jQuery.firstCall.calledWithExactly(
					{
						query: 'getDuplicateRecordCountQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE'
						}
					}
				)).to.be.true;
				expect(stubs.neo4jQuery.secondCall.calledWithExactly(
					{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
				)).to.be.true;
				expect(instance.constructor.calledOnce).to.be.true;
				expect(instance.constructor.calledWithExactly(neo4jQueryMockResponse)).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

		});

		context('invalid data', () => {

			it('returns instance without creating/updating', async () => {

				stubs.prepareAsParams
					.onFirstCall().returns({
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					});
				stubs.hasErrors.returns(true);
				const getCreateUpdateQueryStub = stub();
				instance.model = 'theatre';
				spy(instance, 'runInputValidations');
				spy(instance, 'runDatabaseValidations');
				spy(instance, 'setErrorStatus');
				spy(instance, 'constructor');
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
				expect(stubs.prepareAsParams.calledOnce).to.be.true;
				expect(stubs.prepareAsParams.calledWithExactly(instance)).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{
						query: 'getDuplicateRecordCountQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE'
						}
					}
				)).to.be.true;
				expect(instance.constructor.notCalled).to.be.true;
				expect(result).to.deep.equal(instance);
				expect(result).to.deep.equal({
					model: 'theatre',
					name: 'Foobar',
					errors: {},
					hasErrors: true
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
				spy(instance, 'constructor');
				const result = await instance.edit();
				expect(stubs.getEditQueries[instance.model].calledOnce).to.be.true;
				expect(stubs.getEditQueries[instance.model].calledWithExactly()).to.be.true;
				expect(stubs.sharedQueries.getEditQuery.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getEditProductionQuery response', params: { uuid: instance.uuid } }
				)).to.be.true;
				expect(instance.constructor.calledOnce).to.be.true;
				expect(instance.constructor.calledWithExactly(neo4jQueryMockResponse)).to.be.true;
				expect(result instanceof Base).to.be.true;

			});

		});

		context('instance can use shared query', () => {

			it('gets edit data using shared query', async () => {

				spy(instance, 'constructor');
				const result = await instance.edit();
				expect(stubs.sharedQueries.getEditQuery.calledOnce).to.be.true;
				expect(stubs.sharedQueries.getEditQuery.calledWithExactly(instance.model)).to.be.true;
				expect(stubs.getEditQueries.production.notCalled).to.be.true;
				expect(stubs.neo4jQuery.calledOnce).to.be.true;
				expect(stubs.neo4jQuery.calledWithExactly(
					{ query: 'getEditQuery response', params: { uuid: instance.uuid } }
				)).to.be.true;
				expect(instance.constructor.calledOnce).to.be.true;
				expect(instance.constructor.calledWithExactly(neo4jQueryMockResponse)).to.be.true;
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

		context('instance has no associations', () => {

			context('instance has differentiator property', () => {

				it('deletes instance and returns object with its model and name properties', async () => {

					stubs.neo4jQuery.resolves({
						model: 'theatre',
						name: 'Almeida Theatre',
						differentiator: null,
						isDeleted: true,
						associatedModels: []
					});
					instance.differentiator = '';
					spy(instance, 'constructor');
					spy(instance, 'addPropertyError');
					spy(instance, 'setErrorStatus');
					const result = await instance.delete();
					assert.callOrder(
						stubs.sharedQueries.getDeleteQuery,
						stubs.neo4jQuery
					);
					expect(stubs.sharedQueries.getDeleteQuery.calledOnce).to.be.true;
					expect(stubs.sharedQueries.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
					expect(stubs.neo4jQuery.calledOnce).to.be.true;
					expect(stubs.neo4jQuery.calledWithExactly(
						{ query: 'getDeleteQuery response', params: { uuid: instance.uuid } }
					)).to.be.true;
					expect(instance.constructor.calledOnce).to.be.true;
					expect(instance.constructor.calledWithExactly(
						{ model: 'theatre', name: 'Almeida Theatre', differentiator: null }
					)).to.be.true;
					expect(instance.addPropertyError.notCalled).to.be.true;
					expect(instance.setErrorStatus.notCalled).to.be.true;
					expect(result instanceof Base).to.be.true;

				});

			});

			context('instance does not have differentiator property', () => {

				it('deletes instance and returns object with its model and name properties', async () => {

					stubs.neo4jQuery.resolves({
						model: 'production',
						name: 'Hamlet',
						differentiator: null,
						isDeleted: true,
						associatedModels: []
					});
					spy(instance, 'constructor');
					spy(instance, 'addPropertyError');
					spy(instance, 'setErrorStatus');
					const result = await instance.delete();
					assert.callOrder(
						stubs.sharedQueries.getDeleteQuery,
						stubs.neo4jQuery
					);
					expect(stubs.sharedQueries.getDeleteQuery.calledOnce).to.be.true;
					expect(stubs.sharedQueries.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
					expect(stubs.neo4jQuery.calledOnce).to.be.true;
					expect(stubs.neo4jQuery.calledWithExactly(
						{ query: 'getDeleteQuery response', params: { uuid: instance.uuid } }
					)).to.be.true;
					expect(instance.constructor.calledOnce).to.be.true;
					expect(instance.constructor.calledWithExactly(
						{ model: 'production', name: 'Hamlet' }
					)).to.be.true;
					expect(instance.addPropertyError.notCalled).to.be.true;
					expect(instance.setErrorStatus.notCalled).to.be.true;
					expect(result instanceof Base).to.be.true;

				});

			});

		});

		context('instance has associations', () => {

			context('instance has differentiator property', () => {

				it('returns instance without deleting', async () => {

					stubs.neo4jQuery.resolves({
						model: 'theatre',
						name: 'Almeida Theatre',
						differentiator: null,
						isDeleted: false,
						associatedModels: ['Production']
					});
					instance.differentiator = '';
					spy(instance, 'constructor');
					spy(instance, 'addPropertyError');
					spy(instance, 'setErrorStatus');
					const result = await instance.delete();
					assert.callOrder(
						stubs.sharedQueries.getDeleteQuery,
						stubs.neo4jQuery
					);
					expect(stubs.sharedQueries.getDeleteQuery.calledOnce).to.be.true;
					expect(stubs.sharedQueries.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
					expect(stubs.neo4jQuery.calledOnce).to.be.true;
					expect(stubs.neo4jQuery.calledWithExactly(
						{ query: 'getDeleteQuery response', params: { uuid: instance.uuid } }
					)).to.be.true;
					expect(instance.constructor.notCalled).to.be.true;
					expect(instance.addPropertyError.calledOnce).to.be.true;
					expect(instance.addPropertyError.calledWithExactly('associations', 'Production')).to.be.true;
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
					expect(result).to.deep.equal(instance);
					expect(result).to.deep.equal({
						name: 'Almeida Theatre',
						errors: {
							associations: [
								'Production'
							]
						},
						differentiator: null,
						hasErrors: false
					});

				});

			});

			context('instance does not have differentiator property', () => {

				it('returns instance without deleting', async () => {

					stubs.neo4jQuery.resolves({
						model: 'production',
						name: 'Hamlet',
						differentiator: null,
						isDeleted: false,
						associatedModels: ['Theatre']
					});
					spy(instance, 'constructor');
					spy(instance, 'addPropertyError');
					spy(instance, 'setErrorStatus');
					const result = await instance.delete();
					assert.callOrder(
						stubs.sharedQueries.getDeleteQuery,
						stubs.neo4jQuery
					);
					expect(stubs.sharedQueries.getDeleteQuery.calledOnce).to.be.true;
					expect(stubs.sharedQueries.getDeleteQuery.calledWithExactly(instance.model)).to.be.true;
					expect(stubs.neo4jQuery.calledOnce).to.be.true;
					expect(stubs.neo4jQuery.calledWithExactly(
						{ query: 'getDeleteQuery response', params: { uuid: instance.uuid } }
					)).to.be.true;
					expect(instance.constructor.notCalled).to.be.true;
					expect(instance.addPropertyError.calledOnce).to.be.true;
					expect(instance.addPropertyError.calledWithExactly('associations', 'Theatre')).to.be.true;
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
					expect(result).to.deep.equal(instance);
					expect(result).to.deep.equal({
						name: 'Hamlet',
						errors: {
							associations: [
								'Theatre'
							]
						},
						hasErrors: false
					});

				});

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
				{ query: 'getShowTheatreQuery response', params: { uuid: instance.uuid } }
			)).to.be.true;
			expect(result).to.deep.equal(neo4jQueryMockResponse);

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
			expect(result).to.deep.equal(neo4jQueryMockResponse);

		});

	});

});

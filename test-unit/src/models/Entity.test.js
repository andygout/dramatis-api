import { expect } from 'chai';
import { assert, createSandbox, spy, stub } from 'sinon';

import * as hasErrorsModule from '../../../src/lib/has-errors';
import * as prepareAsParamsModule from '../../../src/lib/prepare-as-params';
import Entity from '../../../src/models/Entity';
import { Production } from '../../../src/models';
import * as cypherQueries from '../../../src/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../src/neo4j/query';

describe('Entity model', () => {

	let stubs;
	let instance;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			prepareAsParams: sandbox.stub(prepareAsParamsModule, 'prepareAsParams').returns('prepareAsParams response'),
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
				venue:
					sandbox.stub(cypherQueries.getShowQueries, 'venue')
						.returns('getShowVenueQuery response')
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

		instance = new Entity({ name: 'Foobar' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('differentiator property', () => {

			context('model is not production', () => {

				it('assigns empty string if absent from props', () => {

					const instance = new Entity({ name: 'Foobar' });
					expect(instance.differentiator).to.equal('');

				});

				it('assigns empty string if included in props but value is empty string', () => {

					const instance = new Entity({ name: 'Foobar', differentiator: '' });
					expect(instance.differentiator).to.equal('');

				});

				it('assigns empty string if included in props but value is whitespace-only string', () => {

					const instance = new Entity({ name: 'Foobar', differentiator: ' ' });
					expect(instance.differentiator).to.equal('');

				});

				it('assigns value if included in props and value is string with length', () => {

					const instance = new Entity({ name: 'Foobar', differentiator: '1' });
					expect(instance.differentiator).to.equal('1');

				});

				it('trims value before assigning', () => {

					const instance = new Entity({ name: 'Foobar', differentiator: ' 1 ' });
					expect(instance.differentiator).to.equal('1');

				});

			});

			context('model is production', () => {

				it('does not assign differentiator property (because when productions are created they are treated as unique)', () => {

					const instance = new Production({ name: 'Foobar', differentiator: '1' });
					expect(instance).to.not.have.property('differentiator');

				});

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

				const instance = new Production({ name: 'Foobar', differentiator: '1' });
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

	describe('validateNoAssociationWithSelf method', () => {

		context('valid data', () => {

			context('association has name value of empty string', () => {

				it('will not add properties to errors property', () => {

					const instance = new Entity({ name: 'National Theatre' });
					instance.differentiator = '';
					spy(instance, 'addPropertyError');
					instance.validateNoAssociationWithSelf('', '');
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('association name and differentiator combination different to instance name and differentiator combination', () => {

				it('will not add properties to errors property', () => {

					const instance = new Entity({ name: 'Olivier Theatre' });
					instance.differentiator = '';
					spy(instance, 'addPropertyError');
					instance.validateNoAssociationWithSelf('National Theatre', '');
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new Entity({ name: 'National Theatre' });
				instance.differentiator = '';
				spy(instance, 'addPropertyError');
				instance.validateNoAssociationWithSelf('National Theatre', '');
				expect(instance.addPropertyError.calledTwice).to.be.true;
				expect(instance.addPropertyError.firstCall.calledWithExactly(
					'name',
					'Instance cannot form association with itself'
				)).to.be.true;
				expect(instance.addPropertyError.secondCall.calledWithExactly(
					'differentiator',
					'Instance cannot form association with itself'
				)).to.be.true;

			});

		});

	});

	describe('runDatabaseValidations method', () => {

		context('model is not production', () => {

			it('will call validateUniquenessInDatabase method', () => {

				spy(instance, 'validateUniquenessInDatabase');
				instance.runDatabaseValidations();
				expect(instance.validateUniquenessInDatabase.calledOnce).to.be.true;
				expect(instance.validateUniquenessInDatabase.calledWithExactly()).to.be.true;

			});

		});

		context('model is production', () => {

			it('will return without calling validateUniquenessInDatabase method (because when productions are created they are treated as unique)', () => {

				const instance = new Production();
				spy(instance, 'validateUniquenessInDatabase');
				instance.runDatabaseValidations();
				expect(instance.validateUniquenessInDatabase.notCalled).to.be.true;

			});

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
				expect(result instanceof Entity).to.be.true;

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
				expect(result instanceof Entity).to.be.true;

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
				instance.model = 'venue';
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
					model: 'venue',
					uuid: undefined,
					name: 'Foobar',
					differentiator: '',
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
				expect(result instanceof Entity).to.be.true;

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
				expect(result instanceof Entity).to.be.true;

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

				it('deletes instance and returns newly instantiated instance with assigned name and differentiator properties', async () => {

					stubs.neo4jQuery.resolves({
						model: 'venue',
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
						{ name: 'Almeida Theatre', differentiator: null }
					)).to.be.true;
					expect(instance.addPropertyError.notCalled).to.be.true;
					expect(instance.setErrorStatus.notCalled).to.be.true;
					expect(result instanceof Entity).to.be.true;
					expect(result).to.deep.equal({
						uuid: undefined,
						name: 'Almeida Theatre',
						differentiator: '',
						errors: {}
					});

				});

			});

			context('instance does not have differentiator property', () => {

				it('deletes instance and returns newly instantiated instance with assigned name property', async () => {

					const instance = new Production();
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
					expect(instance.constructor.calledWithExactly({ name: 'Hamlet' })).to.be.true;
					expect(instance.addPropertyError.notCalled).to.be.true;
					expect(instance.setErrorStatus.notCalled).to.be.true;
					expect(result instanceof Production).to.be.true;
					expect(result).to.deep.equal({
						uuid: undefined,
						name: 'Hamlet',
						startDate: '',
						pressDate: '',
						endDate: '',
						errors: {},
						material: {
							uuid: undefined,
							name: '',
							differentiator	: '',
							errors: {}
						},
						venue: {
							uuid: undefined,
							name: '',
							differentiator: '',
							errors: {}
						},
						producerCredits: [],
						cast: [],
						creativeCredits: [],
						crewCredits: []
					});

				});

			});

		});

		context('instance has associations', () => {

			context('instance has differentiator property', () => {

				it('returns instance without deleting', async () => {

					stubs.hasErrors.returns(true);
					stubs.neo4jQuery.resolves({
						model: 'venue',
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
						uuid: undefined,
						name: 'Almeida Theatre',
						differentiator: null,
						hasErrors: true,
						errors: {
							associations: [
								'Production'
							]
						}
					});

				});

			});

			context('instance does not have differentiator property', () => {

				it('returns instance without deleting', async () => {

					const instance = new Production({ name: 'Foobar' });
					stubs.hasErrors.returns(true);
					stubs.neo4jQuery.resolves({
						model: 'production',
						name: 'Hamlet',
						differentiator: null,
						isDeleted: false,
						associatedModels: ['Venue']
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
					expect(instance.addPropertyError.calledWithExactly('associations', 'Venue')).to.be.true;
					expect(instance.setErrorStatus.calledOnce).to.be.true;
					expect(instance.setErrorStatus.calledWithExactly()).to.be.true;
					expect(result).to.deep.equal(instance);
					expect(result).to.deep.equal({
						uuid: undefined,
						name: 'Hamlet',
						startDate: '',
						pressDate: '',
						endDate: '',
						hasErrors: true,
						errors: {
							associations: [
								'Venue'
							]
						},
						material: {
							uuid: undefined,
							name: '',
							differentiator	: '',
							errors: {}
						},
						venue: {
							uuid: undefined,
							name: '',
							differentiator: '',
							errors: {}
						},
						producerCredits: [],
						cast: [],
						creativeCredits: [],
						crewCredits: []
					});

				});

			});

		});

	});

	describe('show method', () => {

		it('gets show data', async () => {

			instance.model = 'venue';
			const result = await instance.show();
			expect(stubs.getShowQueries.venue.calledOnce).to.be.true;
			expect(stubs.getShowQueries.venue.calledWithExactly()).to.be.true;
			expect(stubs.neo4jQuery.calledOnce).to.be.true;
			expect(stubs.neo4jQuery.calledWithExactly(
				{ query: 'getShowVenueQuery response', params: { uuid: instance.uuid } }
			)).to.be.true;
			expect(result).to.deep.equal(neo4jQueryMockResponse);

		});

	});

	describe('list method', () => {

		it('gets list data', async () => {

			const result = await Entity.list('model');
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

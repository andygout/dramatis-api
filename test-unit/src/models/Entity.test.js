import { expect } from 'chai';
import { assert, createSandbox, spy, stub } from 'sinon';

import * as hasErrorsModule from '../../../src/lib/has-errors';
import * as prepareAsParamsModule from '../../../src/lib/prepare-as-params';
import * as stringsModule from '../../../src/lib/strings';
import Entity from '../../../src/models/Entity';
import { AwardCeremony, Person, Production, ProductionIdentifier } from '../../../src/models';
import * as cypherQueries from '../../../src/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../src/neo4j/query';

let stubs;
let instance;

const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

const sandbox = createSandbox();

describe('Entity model', () => {

	beforeEach(() => {

		stubs = {
			hasErrors: sandbox.stub(hasErrorsModule, 'hasErrors').returns(false),
			prepareAsParams: sandbox.stub(prepareAsParamsModule, 'prepareAsParams').returns('prepareAsParams response'),
			getTrimmedOrEmptyString:
				sandbox.stub(stringsModule, 'getTrimmedOrEmptyString').callsFake(arg => arg?.trim() || ''),
			getCreateQueries: {
				PRODUCTION:
					sandbox.stub(cypherQueries.getCreateQueries, 'PRODUCTION')
			},
			getEditQueries: {
				PRODUCTION:
					sandbox.stub(cypherQueries.getEditQueries, 'PRODUCTION')
						.returns('getEditProductionQuery response')
			},
			getUpdateQueries: {
				PRODUCTION: sandbox.stub(cypherQueries.getUpdateQueries, 'PRODUCTION')
			},
			getShowQueries: {
				PRODUCTION:
					sandbox.stub(cypherQueries.getShowQueries, 'PRODUCTION')
						.returns(['showProductionQuery', 'showProductionAwardsQuery']),
				VENUE:
					sandbox.stub(cypherQueries.getShowQueries, 'VENUE')
						.returns(['showVenueQuery'])
			},
			sharedQueries: {
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
			validationQueries: {
				getExistenceCheckQuery:
					sandbox.stub(cypherQueries.validationQueries, 'getExistenceCheckQuery')
						.returns('getExistenceCheckQuery response'),
				getDuplicateRecordCheckQuery:
					sandbox.stub(cypherQueries.validationQueries, 'getDuplicateRecordCheckQuery')
						.returns('getDuplicateRecordCheckQuery response')
			},
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(neo4jQueryMockResponse)
		};

		instance = new Entity({ name: 'Foobar', differentiator: '1' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('uuid property', () => {

			it('assigns value', () => {

				const instance = new Entity({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
				expect(instance.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

		});

		it('calls getTrimmedOrEmptyString to get values to assign to properties', () => {

			expect(stubs.getTrimmedOrEmptyString.callCount).to.equal(2);

		});

		describe('differentiator property', () => {

			context('model is not exempt', () => {

				it('assigns return value from getTrimmedOrEmptyString called with props value', () => {

					assert.calledWithExactly(stubs.getTrimmedOrEmptyString.secondCall, '1');
					expect(instance.differentiator).to.equal('1');

				});

			});

			context('model is exempt', () => {

				context('model is AwardCeremony', () => {

					it('does not assign differentiator property', () => {

						const instance = new AwardCeremony({ name: '2020', differentiator: '1' });
						expect(instance).to.not.have.property('differentiator');

					});

				});

				context('model is Production', () => {

					it('does not assign differentiator property', () => {

						const instance = new Production({ name: 'Hamlet', differentiator: '1' });
						expect(instance).to.not.have.property('differentiator');

					});

				});

				context('model is ProductionIdentifier', () => {

					it('does not assign differentiator property', () => {

						const instance = new ProductionIdentifier({
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							differentiator: '1'
						});
						expect(instance).to.not.have.property('differentiator');

					});

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

		it('calls instance\'s validate methods', () => {

			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			instance.runInputValidations();
			assert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			assert.calledOnceWithExactly(instance.validateDifferentiator);

		});

	});

	describe('validateDifferentiator method', () => {

		it('will call validateStringForProperty method', () => {

			spy(instance, 'validateStringForProperty');
			instance.validateDifferentiator();
			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'differentiator', { isRequired: false }
			);

		});

	});

	describe('validateSubtitle method', () => {

		it('will call validateStringForProperty method', () => {

			spy(instance, 'validateStringForProperty');
			instance.validateSubtitle();
			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'subtitle', { isRequired: false }
			);

		});

	});

	describe('validateNoAssociationWithSelf method', () => {

		context('valid data', () => {

			context('name and differentiator comparison', () => {

				context('association has name value of empty string', () => {

					it('will not add properties to errors property', () => {

						const instance = new Entity({ name: 'National Theatre' });
						instance.differentiator = '';
						spy(instance, 'addPropertyError');
						instance.validateNoAssociationWithSelf({ name: '', differentiator: '' });
						assert.notCalled(instance.addPropertyError);

					});

				});

				context('association name and differentiator combination different to instance name and differentiator combination', () => {

					it('will not add properties to errors property', () => {

						const instance = new Entity({ name: 'Olivier Theatre' });
						instance.differentiator = '';
						spy(instance, 'addPropertyError');
						instance.validateNoAssociationWithSelf({ name: 'National Theatre', differentiator: '' });
						assert.notCalled(instance.addPropertyError);

					});

				});

				context('instance and association have empty name and differentiator values', () => {

					it('will not add properties to errors property', () => {

						const instance = new Entity({ name: '', differentiator: '' });
						instance.differentiator = '';
						spy(instance, 'addPropertyError');
						instance.validateNoAssociationWithSelf({ name: '', differentiator: '' });
						assert.notCalled(instance.addPropertyError);

					});

				});

				context('instance and association have matching non-empty differentiator value but empty name value', () => {

					it('will not add properties to errors property', () => {

						const instance = new Entity({ name: '', differentiator: '1' });
						instance.differentiator = '';
						spy(instance, 'addPropertyError');
						instance.validateNoAssociationWithSelf({ name: '', differentiator: '1' });
						assert.notCalled(instance.addPropertyError);

					});

				});

			});

			context('uuid comparison', () => {

				context('association has not yet been assigned uuid value', () => {

					it('will not add properties to errors property', () => {

						const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
						spy(instance, 'addPropertyError');
						instance.validateNoAssociationWithSelf({ uuid: undefined });
						assert.notCalled(instance.addPropertyError);

					});

				});

				context('association uuid different to instance uuid', () => {

					it('will not add properties to errors property', () => {

						const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
						spy(instance, 'addPropertyError');
						instance.validateNoAssociationWithSelf({ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' });
						assert.notCalled(instance.addPropertyError);

					});

				});

			});

		});

		context('invalid data', () => {

			context('name and differentiator comparison', () => {

				it('adds properties whose values are arrays to errors property', () => {

					const instance = new Entity({ name: 'National Theatre' });
					instance.differentiator = '';
					spy(instance, 'addPropertyError');
					instance.validateNoAssociationWithSelf({ name: 'National Theatre', differentiator: '' });
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'Instance cannot form association with itself'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'differentiator', 'Instance cannot form association with itself'
					);

				});

			});

			context('uuid comparison', () => {

				it('adds properties whose values are arrays to errors property', () => {

					const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
					spy(instance, 'addPropertyError');
					instance.validateNoAssociationWithSelf({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
					assert.calledOnceWithExactly(
						instance.addPropertyError,
						'uuid', 'Instance cannot form association with itself'
					);

				});

			});

		});

	});

	describe('runDatabaseValidations method', () => {

		context('model is not exempt', () => {

			it('will call validateUniquenessInDatabase method', async () => {

				spy(instance, 'validateUniquenessInDatabase');
				await instance.runDatabaseValidations();
				assert.calledOnceWithExactly(instance.validateUniquenessInDatabase);

			});

		});

		context('model is exempt', () => {

			it('will return without calling validateUniquenessInDatabase method (because when productions are created they are treated as unique)', async () => {

				const instance = new Production();
				spy(instance, 'validateUniquenessInDatabase');
				await instance.runDatabaseValidations();
				assert.notCalled(instance.validateUniquenessInDatabase);

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
				stubs.neo4jQuery.resolves({ isDuplicateRecord: false });
				spy(instance, 'addPropertyError');
				await instance.validateUniquenessInDatabase();
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.validationQueries.getDuplicateRecordCheckQuery,
					stubs.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.validationQueries.getDuplicateRecordCheckQuery, instance.model);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getDuplicateRecordCheckQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE'
						}
					}
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data (results returned that indicate name already exists)', () => {

			it('will call addPropertyError method', async () => {

				stubs.prepareAsParams.returns({
					uuid: 'UUID_VALUE',
					name: 'NAME_VALUE',
					differentiator: 'DIFFERENTIATOR_VALUE'
				});
				stubs.neo4jQuery.resolves({ isDuplicateRecord: true });
				spy(instance, 'addPropertyError');
				await instance.validateUniquenessInDatabase();
				assert.callOrder(
					stubs.prepareAsParams,
					stubs.validationQueries.getDuplicateRecordCheckQuery,
					stubs.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.validationQueries.getDuplicateRecordCheckQuery, instance.model);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getDuplicateRecordCheckQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Name and differentiator combination already exists'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Name and differentiator combination already exists'
				);

			});

		});

	});

	describe('setErrorStatus method', () => {

		it('will call hasErrors function and assign its return value to the instance\'s hasErrors property', () => {

			instance.setErrorStatus();
			assert.calledOnceWithExactly(stubs.hasErrors, instance);
			expect(instance.hasErrors).to.be.false;

		});

	});

	describe('confirmExistenceInDatabase method', () => {

		context('opts argument is not provided', () => {

			it('confirms existence of instance in database using model value of instance', async () => {

				const instance = new Person({ name: 'Antony Sher' });
				stubs.neo4jQuery.resolves({ isExistent: true });
				await instance.confirmExistenceInDatabase();
				assert.callOrder(
					stubs.validationQueries.getExistenceCheckQuery,
					stubs.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.validationQueries.getExistenceCheckQuery, instance.model);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{ query: 'getExistenceCheckQuery response', params: { uuid: instance.uuid } }
				);

			});

		});

		context('model value is provided in opts argument', () => {

			it('confirms existence of instance in database using provided model value', async () => {

				const model = 'PRODUCTION';
				stubs.neo4jQuery.resolves({ isExistent: true });
				await instance.confirmExistenceInDatabase({ model });
				assert.callOrder(
					stubs.validationQueries.getExistenceCheckQuery,
					stubs.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.validationQueries.getExistenceCheckQuery, model);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{ query: 'getExistenceCheckQuery response', params: { uuid: instance.uuid } }
				);

			});

		});

		context('instance is found in database', () => {

			it('returns the isExistent value from the database response', async () => {

				const model = 'PRODUCTION';
				stubs.neo4jQuery.resolves({ isExistent: true });
				const result = await instance.confirmExistenceInDatabase({ model });
				expect(result).to.equal(true);

			});

		});

		context('instance is not found in database', () => {

			it('returns the isExistent value from the database response', async () => {

				const model = 'PRODUCTION';
				stubs.neo4jQuery.resolves({ isExistent: false });
				const result = await instance.confirmExistenceInDatabase({ model });
				expect(result).to.equal(false);

			});

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
				assert.calledOnceWithExactly(instance.runInputValidations);
				assert.calledOnceWithExactly(instance.runDatabaseValidations);
				assert.calledOnceWithExactly(instance.setErrorStatus);
				assert.calledOnceWithExactly(stubs.sharedQueries.getCreateQuery, instance.model);
				assert.calledTwice(stubs.prepareAsParams);
				assert.calledWithExactly(stubs.prepareAsParams.firstCall, instance);
				assert.calledWithExactly(stubs.prepareAsParams.secondCall, instance);
				assert.calledTwice(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery.firstCall,
					{
						query: 'getDuplicateRecordCheckQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE'
						}
					}
				);
				assert.calledWithExactly(
					stubs.neo4jQuery.secondCall,
					{ query: 'getCreateQuery response', params: 'prepareAsParams response' }
				);
				assert.calledOnceWithExactly(instance.constructor, neo4jQueryMockResponse);
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
				assert.calledOnceWithExactly(instance.runInputValidations);
				assert.calledOnceWithExactly(instance.runDatabaseValidations);
				assert.calledOnceWithExactly(instance.setErrorStatus);
				assert.calledOnceWithExactly(stubs.sharedQueries.getUpdateQuery, instance.model);
				assert.calledTwice(stubs.prepareAsParams);
				assert.calledWithExactly(stubs.prepareAsParams.firstCall, instance);
				assert.calledWithExactly(stubs.prepareAsParams.secondCall, instance);
				assert.calledTwice(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery.firstCall,
					{
						query: 'getDuplicateRecordCheckQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE'
						}
					}
				);
				assert.calledWithExactly(
					stubs.neo4jQuery.secondCall,
					{ query: 'getUpdateQuery response', params: 'prepareAsParams response' }
				);
				assert.calledOnceWithExactly(instance.constructor, neo4jQueryMockResponse);
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
				instance.model = 'VENUE';
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
				assert.calledOnceWithExactly(instance.runInputValidations);
				assert.calledOnceWithExactly(instance.runDatabaseValidations);
				assert.calledOnceWithExactly(instance.setErrorStatus);
				assert.notCalled(getCreateUpdateQueryStub);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{
						query: 'getDuplicateRecordCheckQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE'
						}
					}
				);
				assert.notCalled(instance.constructor);
				expect(result).to.deep.equal(instance);
				expect(result).to.deep.equal({
					model: 'VENUE',
					uuid: undefined,
					name: 'Foobar',
					differentiator: '1',
					errors: {},
					hasErrors: true
				});

			});

		});

	});

	describe('create method', () => {

		context('instance requires a model-specific query', () => {

			it('calls createUpdate method with function to get model-specific create query as argument', async () => {

				instance.model = 'PRODUCTION';
				spy(instance, 'createUpdate');
				await instance.create();
				assert.calledOnceWithExactly(instance.createUpdate, stubs.getCreateQueries[instance.model]);

			});

		});

		context('instance can use shared query', () => {

			it('calls createUpdate method with function to get shared create query as argument', async () => {

				spy(instance, 'createUpdate');
				await instance.create();
				assert.calledOnceWithExactly(instance.createUpdate, stubs.sharedQueries.getCreateQuery);

			});

		});

	});

	describe('edit method', () => {

		context('instance requires a model-specific query', () => {

			it('gets edit data using model-specific query', async () => {

				instance.model = 'PRODUCTION';
				spy(instance, 'constructor');
				const result = await instance.edit();
				assert.calledOnceWithExactly(stubs.getEditQueries[instance.model]);
				assert.notCalled(stubs.sharedQueries.getEditQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{ query: 'getEditProductionQuery response', params: { uuid: instance.uuid } }
				);
				assert.calledOnceWithExactly(instance.constructor, neo4jQueryMockResponse);
				expect(result instanceof Entity).to.be.true;

			});

		});

		context('instance can use shared query', () => {

			it('gets edit data using shared query', async () => {

				spy(instance, 'constructor');
				const result = await instance.edit();
				assert.calledOnceWithExactly(stubs.sharedQueries.getEditQuery, instance.model);
				assert.notCalled(stubs.getEditQueries.PRODUCTION);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{ query: 'getEditQuery response', params: { uuid: instance.uuid } }
				);
				assert.calledOnceWithExactly(instance.constructor, neo4jQueryMockResponse);
				expect(result instanceof Entity).to.be.true;

			});

		});

	});

	describe('update method', () => {

		context('instance does not exist', () => {

			it('throws a Not Found error and does not call the createUpdate method', async () => {

				instance.model = 'PRODUCTION';
				stub(instance, 'confirmExistenceInDatabase').returns(false);
				spy(instance, 'createUpdate');
				try {
					await instance.update();
				} catch (error) {
					expect(error.message).to.equal('Not Found');
					assert.calledOnceWithExactly(instance.confirmExistenceInDatabase);
					assert.notCalled(instance.createUpdate);
				}

			});

		});

		context('instance exists', () => {

			context('instance requires a model-specific query', () => {

				it('calls createUpdate method with function to get model-specific update query as argument', async () => {

					instance.model = 'PRODUCTION';
					stub(instance, 'confirmExistenceInDatabase').returns(true);
					spy(instance, 'createUpdate');
					await instance.update();
					assert.calledOnceWithExactly(instance.confirmExistenceInDatabase);
					assert.calledOnceWithExactly(instance.createUpdate, stubs.getUpdateQueries[instance.model]);

				});

			});

			context('instance can use shared query', () => {

				it('calls createUpdate method with function to get shared update query as argument', async () => {

					stub(instance, 'confirmExistenceInDatabase').returns(true);
					spy(instance, 'createUpdate');
					await instance.update();
					assert.calledOnceWithExactly(instance.confirmExistenceInDatabase);
					assert.calledOnceWithExactly(instance.createUpdate, stubs.sharedQueries.getUpdateQuery);

				});

			});

		});

	});

	describe('delete method', () => {

		context('instance has no associations', () => {

			context('instance has differentiator property', () => {

				it('deletes instance and returns newly instantiated instance with assigned name and differentiator properties', async () => {

					stubs.neo4jQuery.resolves({
						model: 'VENUE',
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
					assert.calledOnceWithExactly(stubs.sharedQueries.getDeleteQuery, instance.model);
					assert.calledOnceWithExactly(
						stubs.neo4jQuery,
						{ query: 'getDeleteQuery response', params: { uuid: instance.uuid } }
					);
					assert.calledOnceWithExactly(
						instance.constructor,
						{ name: 'Almeida Theatre', differentiator: null }
					);
					assert.notCalled(instance.addPropertyError);
					assert.notCalled(instance.setErrorStatus);
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
						model: 'PRODUCTION',
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
					assert.calledOnceWithExactly(stubs.sharedQueries.getDeleteQuery, instance.model);
					assert.calledOnceWithExactly(
						stubs.neo4jQuery,
						{ query: 'getDeleteQuery response', params: { uuid: instance.uuid } }
					);
					assert.calledOnceWithExactly(instance.constructor, { name: 'Hamlet' });
					assert.notCalled(instance.addPropertyError);
					assert.notCalled(instance.setErrorStatus);
					expect(result instanceof Production).to.be.true;
					expect(result).to.deep.equal({
						uuid: undefined,
						name: 'Hamlet',
						subtitle: '',
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
						season: {
							uuid: undefined,
							name: '',
							differentiator: '',
							errors: {}
						},
						festival: {
							uuid: undefined,
							name: '',
							differentiator: '',
							errors: {}
						},
						subProductions: [],
						producerCredits: [],
						cast: [],
						creativeCredits: [],
						crewCredits: [],
						reviews: []
					});

				});

			});

		});

		context('instance has associations', () => {

			context('instance has differentiator property', () => {

				it('returns instance without deleting', async () => {

					stubs.hasErrors.returns(true);
					stubs.neo4jQuery.resolves({
						model: 'VENUE',
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
					assert.calledOnceWithExactly(stubs.sharedQueries.getDeleteQuery, instance.model);
					assert.calledOnceWithExactly(
						stubs.neo4jQuery,
						{ query: 'getDeleteQuery response', params: { uuid: instance.uuid } }
					);
					assert.notCalled(instance.constructor);
					assert.calledOnceWithExactly(
						instance.addPropertyError,
						'associations', 'Production'
					);
					assert.calledOnceWithExactly(instance.setErrorStatus);
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
						model: 'PRODUCTION',
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
					assert.calledOnceWithExactly(stubs.sharedQueries.getDeleteQuery, instance.model);
					assert.calledOnceWithExactly(
						stubs.neo4jQuery,
						{ query: 'getDeleteQuery response', params: { uuid: instance.uuid } }
					);
					assert.notCalled(instance.constructor);
					assert.calledOnceWithExactly(
						instance.addPropertyError,
						'associations', 'Venue'
					);
					assert.calledOnceWithExactly(instance.setErrorStatus);
					expect(result).to.deep.equal(instance);
					expect(result).to.deep.equal({
						uuid: undefined,
						name: 'Hamlet',
						subtitle: '',
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
						season: {
							uuid: undefined,
							name: '',
							differentiator: '',
							errors: {}
						},
						festival: {
							uuid: undefined,
							name: '',
							differentiator: '',
							errors: {}
						},
						subProductions: [],
						producerCredits: [],
						cast: [],
						creativeCredits: [],
						crewCredits: [],
						reviews: []
					});

				});

			});

		});

	});

	describe('show method', () => {

		context('model requires single show query', () => {

			it('gets show data', async () => {

				instance.model = 'VENUE';
				const result = await instance.show();
				assert.calledOnceWithExactly(stubs.getShowQueries.VENUE);
				assert.calledOnceWithExactly(
					stubs.neo4jQuery,
					{ query: 'showVenueQuery', params: { uuid: instance.uuid } }
				);
				expect(result).to.deep.equal(neo4jQueryMockResponse);

			});

		});

		context('model requires multiple show queries', () => {

			it('gets show data', async () => {

				instance.model = 'PRODUCTION';
				const result = await instance.show();
				assert.calledOnceWithExactly(stubs.getShowQueries.PRODUCTION);
				assert.calledTwice(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery.firstCall,
					{ query: 'showProductionQuery', params: { uuid: instance.uuid } }
				);
				assert.calledWithExactly(
					stubs.neo4jQuery.secondCall,
					{ query: 'showProductionAwardsQuery', params: { uuid: instance.uuid } }
				);
				expect(result).to.deep.equal(neo4jQueryMockResponse);

			});

		});

	});

	describe('list method', () => {

		it('gets list data', async () => {

			const result = await Entity.list('model');
			assert.calledOnceWithExactly(stubs.sharedQueries.getListQuery, 'model');
			assert.calledOnceWithExactly(
				stubs.neo4jQuery,
				{ query: 'getListQuery response' }, { isOptionalResult: true, isArrayResult: true }
			);
			expect(result).to.deep.equal(neo4jQueryMockResponse);

		});

	});

});

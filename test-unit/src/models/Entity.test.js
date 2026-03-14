import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, spy, stub } from 'sinon';

import { toPlainObject } from '../../../test-helpers/index.js';

const context = describe;

describe('Entity model', () => {
	let stubs;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(() => {
		stubs = {
			hasErrors: stub().returns(false),
			prepareAsParams: stub().returns('prepareAsParams response'),
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
			},
			cypherQueriesModule: {
				getCreateQueries: {
					PRODUCTION: stub()
				},
				getEditQueries: {
					PRODUCTION: stub().returns('getEditProductionQuery response')
				},
				getUpdateQueries: {
					PRODUCTION: stub()
				},
				getShowQueries: {
					PRODUCTION: stub().returns(['showProductionQuery', 'showProductionAwardsQuery']),
					VENUE: stub().returns(['showVenueQuery'])
				},
				sharedQueries: {
					getCreateQuery: stub().returns('getCreateQuery response'),
					getEditQuery: stub().returns('getEditQuery response'),
					getUpdateQuery: stub().returns('getUpdateQuery response'),
					getDeleteQuery: stub().returns('getDeleteQuery response'),
					getListQuery: stub().returns('getListQuery response')
				},
				validationQueries: {
					getExistenceCheckQuery: stub().returns('getExistenceCheckQuery response'),
					getDuplicateRecordCheckQuery: stub().returns('getDuplicateRecordCheckQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: stub().resolves(neo4jQueryMockResponse)
			}
		};
	});

	afterEach(() => {
		restore();
	});

	const createSubject = (model = 'Entity') =>
		esmock(
			`../../../src/models/${model}.js`,
			{},
			// globalmocks: mock definitions imported everywhere
			// Required for when instances of class extensions of the Entity class are tested.
			{
				'../../../src/lib/has-errors.js': stubs.hasErrors,
				'../../../src/lib/prepare-as-params.js': stubs.prepareAsParams,
				'../../../src/lib/strings.js': stubs.stringsModule,
				'../../../src/neo4j/cypher-queries/index.js': stubs.cypherQueriesModule,
				'../../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);

	describe('constructor method', () => {
		describe('uuid property', () => {
			it('assigns value', async () => {
				const Entity = await createSubject();

				const instance = new Entity({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				assert.equal(instance.uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
			});
		});

		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			const Entity = await createSubject();

			new Entity({ differentiator: '1' });

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.callCount, 2);
		});

		describe('differentiator property', () => {
			context('model is not exempt', () => {
				it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
					const Entity = await createSubject();

					const instance = new Entity({ differentiator: '1' });

					sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.secondCall, '1');
					assert.equal(instance.differentiator, '1');
				});
			});

			context('model is exempt', () => {
				context('model is AwardCeremony', () => {
					it('does not assign differentiator property', async () => {
						const AwardCeremony = await createSubject('AwardCeremony');

						const instance = new AwardCeremony({ differentiator: '1' });

						assert.equal(Object.prototype.hasOwnProperty.call(instance, 'differentiator'), false);
					});
				});

				context('model is Production', () => {
					it('does not assign differentiator property', async () => {
						const Production = await createSubject('Production');

						const instance = new Production({ differentiator: '1' });

						assert.equal(Object.prototype.hasOwnProperty.call(instance, 'differentiator'), false);
					});
				});

				context('model is ProductionIdentifier', () => {
					it('does not assign differentiator property', async () => {
						const ProductionIdentifier = await createSubject('ProductionIdentifier');

						const instance = new ProductionIdentifier({
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							differentiator: '1'
						});

						assert.equal(Object.prototype.hasOwnProperty.call(instance, 'differentiator'), false);
					});
				});
			});
		});
	});

	describe('hasDifferentiatorProperty method', () => {
		context('instance has differentiator property', () => {
			it('returns true', async () => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				instance.differentiator = '';

				const result = instance.hasDifferentiatorProperty();

				assert.equal(result, true);
			});
		});

		context('instance does not have differentiator property', () => {
			it('returns false', async () => {
				const Production = await createSubject('Production');

				const instance = new Production({ name: 'Foobar', differentiator: '1' });

				const result = instance.hasDifferentiatorProperty();

				assert.equal(result, false);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods", async () => {
			const Entity = await createSubject();

			const instance = new Entity({ name: 'Foobar', differentiator: '1' });

			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');

			instance.runInputValidations();

			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			sinonAssert.calledOnceWithExactly(instance.validateDifferentiator);
		});
	});

	describe('validateDifferentiator method', () => {
		it('will call validateStringForProperty method', async () => {
			const Entity = await createSubject();

			const instance = new Entity({ name: 'Foobar', differentiator: '1' });

			spy(instance, 'validateStringForProperty');

			instance.validateDifferentiator();

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'differentiator', {
				isRequired: false
			});
		});
	});

	describe('validateSubtitle method', () => {
		it('will call validateStringForProperty method', async () => {
			const Entity = await createSubject();

			const instance = new Entity({ name: 'Foobar', differentiator: '1' });

			spy(instance, 'validateStringForProperty');

			instance.validateSubtitle();

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'subtitle', { isRequired: false });
		});
	});

	describe('validateNoAssociationWithSelf method', () => {
		context('valid data', () => {
			context('name and differentiator comparison', () => {
				context('association has name value of empty string', () => {
					it('will not add properties to errors property', async () => {
						const Entity = await createSubject();

						const instance = new Entity({ name: 'National Theatre' });

						instance.differentiator = '';

						spy(instance, 'addPropertyError');

						instance.validateNoAssociationWithSelf({ name: '', differentiator: '' });

						sinonAssert.notCalled(instance.addPropertyError);
					});
				});

				context(
					'association name and differentiator combination different to instance name and differentiator combination',
					() => {
						it('will not add properties to errors property', async () => {
							const Entity = await createSubject();

							const instance = new Entity({ name: 'Olivier Theatre' });

							instance.differentiator = '';

							spy(instance, 'addPropertyError');

							instance.validateNoAssociationWithSelf({ name: 'National Theatre', differentiator: '' });

							sinonAssert.notCalled(instance.addPropertyError);
						});
					}
				);

				context('instance and association have empty name and differentiator values', () => {
					it('will not add properties to errors property', async () => {
						const Entity = await createSubject();

						const instance = new Entity({ name: '', differentiator: '' });

						instance.differentiator = '';

						spy(instance, 'addPropertyError');

						instance.validateNoAssociationWithSelf({ name: '', differentiator: '' });

						sinonAssert.notCalled(instance.addPropertyError);
					});
				});

				context(
					'instance and association have matching non-empty differentiator value but empty name value',
					() => {
						it('will not add properties to errors property', async () => {
							const Entity = await createSubject();

							const instance = new Entity({ name: '', differentiator: '1' });

							instance.differentiator = '';

							spy(instance, 'addPropertyError');

							instance.validateNoAssociationWithSelf({ name: '', differentiator: '1' });

							sinonAssert.notCalled(instance.addPropertyError);
						});
					}
				);
			});

			context('uuid comparison', () => {
				context('association has not yet been assigned uuid value', () => {
					it('will not add properties to errors property', async () => {
						const ProductionIdentifier = await createSubject('ProductionIdentifier');

						const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

						spy(instance, 'addPropertyError');

						instance.validateNoAssociationWithSelf({ uuid: undefined });

						sinonAssert.notCalled(instance.addPropertyError);
					});
				});

				context('association uuid different to instance uuid', () => {
					it('will not add properties to errors property', async () => {
						const ProductionIdentifier = await createSubject('ProductionIdentifier');

						const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

						spy(instance, 'addPropertyError');

						instance.validateNoAssociationWithSelf({ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' });

						sinonAssert.notCalled(instance.addPropertyError);
					});
				});
			});
		});

		context('invalid data', () => {
			context('name and differentiator comparison', () => {
				it('adds properties whose values are arrays to errors property', async () => {
					const Entity = await createSubject();

					const instance = new Entity({ name: 'National Theatre' });

					instance.differentiator = '';

					spy(instance, 'addPropertyError');

					instance.validateNoAssociationWithSelf({ name: 'National Theatre', differentiator: '' });

					sinonAssert.calledTwice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name',
						'Instance cannot form association with itself'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'differentiator',
						'Instance cannot form association with itself'
					);
				});
			});

			context('uuid comparison', () => {
				it('adds properties whose values are arrays to errors property', async () => {
					const ProductionIdentifier = await createSubject('ProductionIdentifier');

					const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

					spy(instance, 'addPropertyError');

					instance.validateNoAssociationWithSelf({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'uuid',
						'Instance cannot form association with itself'
					);
				});
			});
		});
	});

	describe('runDatabaseValidations method', () => {
		context('model is not exempt', () => {
			it('will call validateUniquenessInDatabase method', async () => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				spy(instance, 'validateUniquenessInDatabase');

				await instance.runDatabaseValidations();

				sinonAssert.calledOnceWithExactly(instance.validateUniquenessInDatabase);
			});
		});

		context('model is exempt', () => {
			it('will return without calling validateUniquenessInDatabase method (because when productions are created they are treated as unique)', async () => {
				const Production = await createSubject('Production');

				const instance = new Production();

				spy(instance, 'validateUniquenessInDatabase');

				await instance.runDatabaseValidations();

				sinonAssert.notCalled(instance.validateUniquenessInDatabase);
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
				stubs.neo4jQueryModule.neo4jQuery.resolves({ isDuplicateRecord: false });

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.validateUniquenessInDatabase();

				sinonAssert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getDuplicateRecordCheckQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(
					stubs.cypherQueriesModule.validationQueries.getDuplicateRecordCheckQuery,
					instance.model
				);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getDuplicateRecordCheckQuery response',
					params: {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					}
				});
				sinonAssert.notCalled(instance.addPropertyError);
			});
		});

		context('invalid data (results returned that indicate name already exists)', () => {
			it('will call addPropertyError method', async () => {
				stubs.prepareAsParams.returns({
					uuid: 'UUID_VALUE',
					name: 'NAME_VALUE',
					differentiator: 'DIFFERENTIATOR_VALUE'
				});
				stubs.neo4jQueryModule.neo4jQuery.resolves({ isDuplicateRecord: true });

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.validateUniquenessInDatabase();

				sinonAssert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getDuplicateRecordCheckQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(
					stubs.cypherQueriesModule.validationQueries.getDuplicateRecordCheckQuery,
					instance.model
				);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getDuplicateRecordCheckQuery response',
					params: {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					}
				});
				sinonAssert.calledTwice(instance.addPropertyError);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name',
					'Name and differentiator combination already exists'
				);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator',
					'Name and differentiator combination already exists'
				);
			});
		});
	});

	describe('setErrorStatus method', () => {
		it("will call hasErrors function and assign its return value to the instance's hasErrors property", async () => {
			const Entity = await createSubject();

			const instance = new Entity({ name: 'Foobar', differentiator: '1' });

			instance.setErrorStatus();

			sinonAssert.calledOnceWithExactly(stubs.hasErrors, instance);

			assert.equal(instance.hasErrors, false);
		});
	});

	describe('confirmExistenceInDatabase method', () => {
		context('opts argument is not provided', () => {
			it('confirms existence of instance in database using model value of instance', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({ isExistent: true });

				const Person = await createSubject('Person');

				const instance = new Person({ name: 'Antony Sher' });

				await instance.confirmExistenceInDatabase();

				sinonAssert.callOrder(
					stubs.cypherQueriesModule.validationQueries.getExistenceCheckQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				sinonAssert.calledOnceWithExactly(
					stubs.cypherQueriesModule.validationQueries.getExistenceCheckQuery,
					instance.model
				);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getExistenceCheckQuery response',
					params: { uuid: instance.uuid }
				});
			});
		});

		context('model value is provided in opts argument', () => {
			it('confirms existence of instance in database using provided model value', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({ isExistent: true });

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				const model = 'PRODUCTION';

				await instance.confirmExistenceInDatabase({ model });

				sinonAssert.callOrder(
					stubs.cypherQueriesModule.validationQueries.getExistenceCheckQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				sinonAssert.calledOnceWithExactly(
					stubs.cypherQueriesModule.validationQueries.getExistenceCheckQuery,
					model
				);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getExistenceCheckQuery response',
					params: { uuid: instance.uuid }
				});
			});
		});

		context('instance is found in database', () => {
			it('returns the isExistent value from the database response', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({ isExistent: true });

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				const model = 'PRODUCTION';

				const result = await instance.confirmExistenceInDatabase({ model });

				assert.equal(result, true);
			});
		});

		context('instance is not found in database', () => {
			it('returns the isExistent value from the database response', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({ isExistent: false });

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				const model = 'PRODUCTION';

				const result = await instance.confirmExistenceInDatabase({ model });

				assert.equal(result, false);
			});
		});
	});

	describe('createUpdate method', () => {
		context('valid data', () => {
			it('creates', async () => {
				stubs.prepareAsParams
					.onFirstCall()
					.returns({
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					})
					.onSecondCall()
					.returns('prepareAsParams response');

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				spy(instance, 'runInputValidations');
				spy(instance, 'runDatabaseValidations');
				spy(instance, 'setErrorStatus');
				spy(instance, 'constructor');

				const result = await instance.createUpdate(stubs.cypherQueriesModule.sharedQueries.getCreateQuery);

				sinonAssert.callOrder(
					instance.runInputValidations,
					instance.runDatabaseValidations,
					instance.setErrorStatus,
					stubs.cypherQueriesModule.sharedQueries.getCreateQuery,
					stubs.prepareAsParams,
					stubs.neo4jQueryModule.neo4jQuery
				);
				sinonAssert.calledOnceWithExactly(instance.runInputValidations);
				sinonAssert.calledOnceWithExactly(instance.runDatabaseValidations);
				sinonAssert.calledOnceWithExactly(instance.setErrorStatus);
				sinonAssert.calledOnceWithExactly(
					stubs.cypherQueriesModule.sharedQueries.getCreateQuery,
					instance.model
				);
				sinonAssert.calledTwice(stubs.prepareAsParams);
				sinonAssert.calledWithExactly(stubs.prepareAsParams.firstCall, instance);
				sinonAssert.calledWithExactly(stubs.prepareAsParams.secondCall, instance);
				sinonAssert.calledTwice(stubs.neo4jQueryModule.neo4jQuery);
				sinonAssert.calledWithExactly(stubs.neo4jQueryModule.neo4jQuery.firstCall, {
					query: 'getDuplicateRecordCheckQuery response',
					params: {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					}
				});
				sinonAssert.calledWithExactly(stubs.neo4jQueryModule.neo4jQuery.secondCall, {
					query: 'getCreateQuery response',
					params: 'prepareAsParams response'
				});
				sinonAssert.calledOnceWithExactly(instance.constructor, neo4jQueryMockResponse);
				assert.equal(result instanceof Entity, true);
			});

			it('updates', async () => {
				stubs.prepareAsParams
					.onFirstCall()
					.returns({
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					})
					.onSecondCall()
					.returns('prepareAsParams response');

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				spy(instance, 'runInputValidations');
				spy(instance, 'runDatabaseValidations');
				spy(instance, 'setErrorStatus');
				spy(instance, 'constructor');
				const result = await instance.createUpdate(stubs.cypherQueriesModule.sharedQueries.getUpdateQuery);

				sinonAssert.callOrder(
					instance.runInputValidations,
					instance.runDatabaseValidations,
					instance.setErrorStatus,
					stubs.cypherQueriesModule.sharedQueries.getUpdateQuery,
					stubs.prepareAsParams,
					stubs.neo4jQueryModule.neo4jQuery
				);
				sinonAssert.calledOnceWithExactly(instance.runInputValidations);
				sinonAssert.calledOnceWithExactly(instance.runDatabaseValidations);
				sinonAssert.calledOnceWithExactly(instance.setErrorStatus);
				sinonAssert.calledOnceWithExactly(
					stubs.cypherQueriesModule.sharedQueries.getUpdateQuery,
					instance.model
				);
				sinonAssert.calledTwice(stubs.prepareAsParams);
				sinonAssert.calledWithExactly(stubs.prepareAsParams.firstCall, instance);
				sinonAssert.calledWithExactly(stubs.prepareAsParams.secondCall, instance);
				sinonAssert.calledTwice(stubs.neo4jQueryModule.neo4jQuery);
				sinonAssert.calledWithExactly(stubs.neo4jQueryModule.neo4jQuery.firstCall, {
					query: 'getDuplicateRecordCheckQuery response',
					params: {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					}
				});
				sinonAssert.calledWithExactly(stubs.neo4jQueryModule.neo4jQuery.secondCall, {
					query: 'getUpdateQuery response',
					params: 'prepareAsParams response'
				});
				sinonAssert.calledOnceWithExactly(instance.constructor, neo4jQueryMockResponse);
				assert.equal(result instanceof Entity, true);
			});
		});

		context('invalid data', () => {
			it('returns instance without creating/updating', async () => {
				stubs.prepareAsParams.onFirstCall().returns({
					uuid: 'UUID_VALUE',
					name: 'NAME_VALUE',
					differentiator: 'DIFFERENTIATOR_VALUE'
				});
				stubs.hasErrors.returns(true);

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				const getCreateUpdateQueryStub = stub();

				instance.model = 'VENUE';

				spy(instance, 'runInputValidations');
				spy(instance, 'runDatabaseValidations');
				spy(instance, 'setErrorStatus');
				spy(instance, 'constructor');

				const result = await instance.createUpdate(getCreateUpdateQueryStub);

				sinonAssert.callOrder(
					instance.runInputValidations,
					instance.runDatabaseValidations,
					instance.setErrorStatus
				);
				sinonAssert.calledOnceWithExactly(instance.runInputValidations);
				sinonAssert.calledOnceWithExactly(instance.runDatabaseValidations);
				sinonAssert.calledOnceWithExactly(instance.setErrorStatus);
				sinonAssert.notCalled(getCreateUpdateQueryStub);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getDuplicateRecordCheckQuery response',
					params: {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					}
				});
				sinonAssert.notCalled(instance.constructor);
				assert.deepEqual(result, instance);
				assert.deepEqual(toPlainObject(result), {
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
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				instance.model = 'PRODUCTION';

				spy(instance, 'createUpdate');

				await instance.create();

				sinonAssert.calledOnceWithExactly(
					instance.createUpdate,
					stubs.cypherQueriesModule.getCreateQueries[instance.model]
				);
			});
		});

		context('instance can use shared query', () => {
			it('calls createUpdate method with function to get shared create query as argument', async () => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				spy(instance, 'createUpdate');

				await instance.create();

				sinonAssert.calledOnceWithExactly(
					instance.createUpdate,
					stubs.cypherQueriesModule.sharedQueries.getCreateQuery
				);
			});
		});
	});

	describe('edit method', () => {
		context('instance requires a model-specific query', () => {
			it('gets edit data using model-specific query', async () => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				instance.model = 'PRODUCTION';

				spy(instance, 'constructor');

				const result = await instance.edit();

				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.getEditQueries[instance.model]);
				sinonAssert.notCalled(stubs.cypherQueriesModule.sharedQueries.getEditQuery);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getEditProductionQuery response',
					params: { uuid: instance.uuid }
				});
				sinonAssert.calledOnceWithExactly(instance.constructor, neo4jQueryMockResponse);
				assert.equal(result instanceof Entity, true);
			});
		});

		context('instance can use shared query', () => {
			it('gets edit data using shared query', async () => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				spy(instance, 'constructor');

				const result = await instance.edit();

				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.sharedQueries.getEditQuery, instance.model);
				sinonAssert.notCalled(stubs.cypherQueriesModule.getEditQueries.PRODUCTION);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getEditQuery response',
					params: { uuid: instance.uuid }
				});
				sinonAssert.calledOnceWithExactly(instance.constructor, neo4jQueryMockResponse);
				assert.equal(result instanceof Entity, true);
			});
		});
	});

	describe('update method', () => {
		context('instance does not exist', () => {
			it('throws a Not Found error and does not call the createUpdate method', async () => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				instance.model = 'PRODUCTION';

				stub(instance, 'confirmExistenceInDatabase').returns(false);

				spy(instance, 'createUpdate');

				try {
					await instance.update();
				} catch (error) {
					assert.equal(error.message, 'Not Found');
					sinonAssert.calledOnceWithExactly(instance.confirmExistenceInDatabase);
					sinonAssert.notCalled(instance.createUpdate);
				}
			});
		});

		context('instance exists', () => {
			context('instance requires a model-specific query', () => {
				it('calls createUpdate method with function to get model-specific update query as argument', async () => {
					const Entity = await createSubject();

					const instance = new Entity({ name: 'Foobar', differentiator: '1' });

					instance.model = 'PRODUCTION';

					stub(instance, 'confirmExistenceInDatabase').returns(true);

					spy(instance, 'createUpdate');

					await instance.update();

					sinonAssert.calledOnceWithExactly(instance.confirmExistenceInDatabase);
					sinonAssert.calledOnceWithExactly(
						instance.createUpdate,
						stubs.cypherQueriesModule.getUpdateQueries[instance.model]
					);
				});
			});

			context('instance can use shared query', () => {
				it('calls createUpdate method with function to get shared update query as argument', async () => {
					const Entity = await createSubject();

					const instance = new Entity({ name: 'Foobar', differentiator: '1' });

					stub(instance, 'confirmExistenceInDatabase').returns(true);

					spy(instance, 'createUpdate');

					await instance.update();

					sinonAssert.calledOnceWithExactly(instance.confirmExistenceInDatabase);
					sinonAssert.calledOnceWithExactly(
						instance.createUpdate,
						stubs.cypherQueriesModule.sharedQueries.getUpdateQuery
					);
				});
			});
		});
	});

	describe('delete method', () => {
		context('instance has no associations', () => {
			context('instance has differentiator property', () => {
				it('deletes instance and returns newly instantiated instance with assigned name and differentiator properties', async () => {
					stubs.neo4jQueryModule.neo4jQuery.resolves({
						model: 'VENUE',
						name: 'Almeida Theatre',
						differentiator: null,
						isDeleted: true,
						associatedModels: []
					});

					const Entity = await createSubject();

					const instance = new Entity({ name: 'Foobar', differentiator: '1' });

					instance.differentiator = '';

					spy(instance, 'constructor');
					spy(instance, 'addPropertyError');
					spy(instance, 'setErrorStatus');

					const result = await instance.delete();

					sinonAssert.callOrder(
						stubs.cypherQueriesModule.sharedQueries.getDeleteQuery,
						stubs.neo4jQueryModule.neo4jQuery
					);
					sinonAssert.calledOnceWithExactly(
						stubs.cypherQueriesModule.sharedQueries.getDeleteQuery,
						instance.model
					);
					sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
						query: 'getDeleteQuery response',
						params: { uuid: instance.uuid }
					});
					sinonAssert.calledOnceWithExactly(instance.constructor, {
						name: 'Almeida Theatre',
						differentiator: null
					});
					sinonAssert.notCalled(instance.addPropertyError);
					sinonAssert.notCalled(instance.setErrorStatus);
					assert.equal(result instanceof Entity, true);
					assert.deepEqual(toPlainObject(result), {
						uuid: undefined,
						name: 'Almeida Theatre',
						differentiator: '',
						errors: {}
					});
				});
			});

			context('instance does not have differentiator property', () => {
				it('deletes instance and returns newly instantiated instance with assigned name property', async () => {
					stubs.neo4jQueryModule.neo4jQuery.resolves({
						model: 'PRODUCTION',
						name: 'Hamlet',
						differentiator: null,
						isDeleted: true,
						associatedModels: []
					});

					const Production = await createSubject('Production');

					const instance = new Production();

					spy(instance, 'constructor');
					spy(instance, 'addPropertyError');
					spy(instance, 'setErrorStatus');

					const result = await instance.delete();

					sinonAssert.callOrder(
						stubs.cypherQueriesModule.sharedQueries.getDeleteQuery,
						stubs.neo4jQueryModule.neo4jQuery
					);
					sinonAssert.calledOnceWithExactly(
						stubs.cypherQueriesModule.sharedQueries.getDeleteQuery,
						instance.model
					);
					sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
						query: 'getDeleteQuery response',
						params: { uuid: instance.uuid }
					});
					sinonAssert.calledOnceWithExactly(instance.constructor, { name: 'Hamlet' });
					sinonAssert.notCalled(instance.addPropertyError);
					sinonAssert.notCalled(instance.setErrorStatus);
					assert.equal(result instanceof Production, true);
					assert.deepEqual(toPlainObject(result), {
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
							differentiator: '',
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
					stubs.neo4jQueryModule.neo4jQuery.resolves({
						model: 'VENUE',
						name: 'Almeida Theatre',
						differentiator: null,
						isDeleted: false,
						associatedModels: ['Production']
					});

					const Entity = await createSubject();

					const instance = new Entity({ name: 'Foobar', differentiator: '1' });

					instance.differentiator = '';

					spy(instance, 'constructor');
					spy(instance, 'addPropertyError');
					spy(instance, 'setErrorStatus');

					const result = await instance.delete();

					sinonAssert.callOrder(
						stubs.cypherQueriesModule.sharedQueries.getDeleteQuery,
						stubs.neo4jQueryModule.neo4jQuery
					);
					sinonAssert.calledOnceWithExactly(
						stubs.cypherQueriesModule.sharedQueries.getDeleteQuery,
						instance.model
					);
					sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
						query: 'getDeleteQuery response',
						params: { uuid: instance.uuid }
					});
					sinonAssert.notCalled(instance.constructor);
					sinonAssert.calledOnceWithExactly(instance.addPropertyError, 'associations', 'Production');
					sinonAssert.calledOnceWithExactly(instance.setErrorStatus);
					assert.deepEqual(result, instance);
					assert.deepEqual(toPlainObject(result), {
						uuid: undefined,
						name: 'Almeida Theatre',
						differentiator: null,
						hasErrors: true,
						errors: {
							associations: ['Production']
						}
					});
				});
			});

			context('instance does not have differentiator property', () => {
				it('returns instance without deleting', async () => {
					stubs.hasErrors.returns(true);
					stubs.neo4jQueryModule.neo4jQuery.resolves({
						model: 'PRODUCTION',
						name: 'Hamlet',
						differentiator: null,
						isDeleted: false,
						associatedModels: ['Venue']
					});

					const Production = await createSubject('Production');

					const instance = new Production({ name: 'Foobar' });

					spy(instance, 'constructor');
					spy(instance, 'addPropertyError');
					spy(instance, 'setErrorStatus');

					const result = await instance.delete();

					sinonAssert.callOrder(
						stubs.cypherQueriesModule.sharedQueries.getDeleteQuery,
						stubs.neo4jQueryModule.neo4jQuery
					);
					sinonAssert.calledOnceWithExactly(
						stubs.cypherQueriesModule.sharedQueries.getDeleteQuery,
						instance.model
					);
					sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
						query: 'getDeleteQuery response',
						params: { uuid: instance.uuid }
					});
					sinonAssert.notCalled(instance.constructor);
					sinonAssert.calledOnceWithExactly(instance.addPropertyError, 'associations', 'Venue');
					sinonAssert.calledOnceWithExactly(instance.setErrorStatus);
					assert.deepEqual(result, instance);
					assert.deepEqual(toPlainObject(result), {
						uuid: undefined,
						name: 'Hamlet',
						subtitle: '',
						startDate: '',
						pressDate: '',
						endDate: '',
						hasErrors: true,
						errors: {
							associations: ['Venue']
						},
						material: {
							uuid: undefined,
							name: '',
							differentiator: '',
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
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				instance.model = 'VENUE';

				const result = await instance.show();

				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.getShowQueries.VENUE);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'showVenueQuery',
					params: { uuid: instance.uuid }
				});
				assert.deepEqual(result, neo4jQueryMockResponse);
			});
		});

		context('model requires multiple show queries', () => {
			it('gets show data', async () => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				instance.model = 'PRODUCTION';

				const result = await instance.show();

				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.getShowQueries.PRODUCTION);
				sinonAssert.calledTwice(stubs.neo4jQueryModule.neo4jQuery);
				sinonAssert.calledWithExactly(stubs.neo4jQueryModule.neo4jQuery.firstCall, {
					query: 'showProductionQuery',
					params: { uuid: instance.uuid }
				});
				sinonAssert.calledWithExactly(stubs.neo4jQueryModule.neo4jQuery.secondCall, {
					query: 'showProductionAwardsQuery',
					params: { uuid: instance.uuid }
				});
				assert.deepEqual(result, neo4jQueryMockResponse);
			});
		});
	});

	describe('list method', () => {
		it('gets list data', async () => {
			const Entity = await createSubject();

			const result = await Entity.list('model');

			sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.sharedQueries.getListQuery, 'model');
			sinonAssert.calledOnceWithExactly(
				stubs.neo4jQueryModule.neo4jQuery,
				{ query: 'getListQuery response' },
				{ isOptionalResult: true, isArrayResult: true }
			);
			assert.deepEqual(result, neo4jQueryMockResponse);
		});
	});
});

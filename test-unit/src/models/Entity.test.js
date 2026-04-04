import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { toPlainObject } from '../../../test-helpers/index.js';

const context = describe;

describe('Entity model', () => {
	let stubs;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach((test) => {
		stubs = {
			hasErrors: test.mock.fn(() => false),
			prepareAsParams: test.mock.fn(() => 'prepareAsParams response'),
			stringsModule: {
				getTrimmedOrEmptyString: test.mock.fn((arg) => arg?.trim() || '')
			},
			cypherQueriesModule: {
				getCreateQueries: {
					PRODUCTION: test.mock.fn()
				},
				getEditQueries: {
					PRODUCTION: test.mock.fn(() => 'getEditProductionQuery response')
				},
				getUpdateQueries: {
					PRODUCTION: test.mock.fn()
				},
				getShowQueries: {
					PRODUCTION: test.mock.fn(() => ['showProductionQuery', 'showProductionAwardsQuery']),
					VENUE: test.mock.fn(() => ['showVenueQuery'])
				},
				sharedQueries: {
					getCreateQuery: test.mock.fn(() => 'getCreateQuery response'),
					getEditQuery: test.mock.fn(() => 'getEditQuery response'),
					getUpdateQuery: test.mock.fn(() => 'getUpdateQuery response'),
					getDeleteQuery: test.mock.fn(() => 'getDeleteQuery response'),
					getListQuery: test.mock.fn(() => 'getListQuery response')
				},
				validationQueries: {
					getExistenceCheckQuery: test.mock.fn(() => 'getExistenceCheckQuery response'),
					getDuplicateRecordCheckQuery: test.mock.fn(() => 'getDuplicateRecordCheckQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: test.mock.fn(async () => neo4jQueryMockResponse)
			}
		};
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

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls.length, 2);
		});

		describe('differentiator property', () => {
			context('model is not exempt', () => {
				it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
					const Entity = await createSubject();

					const instance = new Entity({ differentiator: '1' });

					assert.deepStrictEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[1].arguments, ['1']);
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
		it("calls instance's validate methods", async (test) => {
			const Entity = await createSubject();

			const instance = new Entity({ name: 'Foobar', differentiator: '1' });

			const originalValidateName = instance.validateName;
			const originalValidateDifferentiator = instance.validateDifferentiator;

			test.mock.method(instance, 'validateName', function (...args) {
				return originalValidateName.apply(this, args);
			});
			test.mock.method(instance, 'validateDifferentiator', function (...args) {
				return originalValidateDifferentiator.apply(this, args);
			});

			instance.runInputValidations();

			assert.strictEqual(instance.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: true }]);
			assert.strictEqual(instance.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateDifferentiator.mock.calls[0].arguments, []);
		});
	});

	describe('validateDifferentiator method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const Entity = await createSubject();

			const instance = new Entity({ name: 'Foobar', differentiator: '1' });

			test.mock.method(instance, 'validateStringForProperty', () => undefined);

			instance.validateDifferentiator();

			assert.strictEqual(instance.validateStringForProperty.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateStringForProperty.mock.calls[0].arguments, ['differentiator', {
				isRequired: false
			}]);
		});
	});

	describe('validateSubtitle method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const Entity = await createSubject();

			const instance = new Entity({ name: 'Foobar', differentiator: '1' });

			test.mock.method(instance, 'validateStringForProperty', () => undefined);

			instance.validateSubtitle();

			assert.strictEqual(instance.validateStringForProperty.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateStringForProperty.mock.calls[0].arguments, ['subtitle', { isRequired: false }]);
		});
	});

	describe('validateNoAssociationWithSelf method', () => {
		context('valid data', () => {
			context('name and differentiator comparison', () => {
				context('association has name value of empty string', () => {
					it('will not add properties to errors property', async (test) => {
						const Entity = await createSubject();

						const instance = new Entity({ name: 'National Theatre' });

						instance.differentiator = '';

						test.mock.method(instance, 'addPropertyError', () => undefined);

						instance.validateNoAssociationWithSelf({ name: '', differentiator: '' });

						assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
					});
				});

				context(
					'association name and differentiator combination different to instance name and differentiator combination',
					() => {
						it('will not add properties to errors property', async (test) => {
							const Entity = await createSubject();

							const instance = new Entity({ name: 'Olivier Theatre' });

							instance.differentiator = '';

							test.mock.method(instance, 'addPropertyError', () => undefined);

							instance.validateNoAssociationWithSelf({ name: 'National Theatre', differentiator: '' });

							assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
						});
					}
				);

				context('instance and association have empty name and differentiator values', () => {
					it('will not add properties to errors property', async (test) => {
						const Entity = await createSubject();

						const instance = new Entity({ name: '', differentiator: '' });

						instance.differentiator = '';

						test.mock.method(instance, 'addPropertyError', () => undefined);

						instance.validateNoAssociationWithSelf({ name: '', differentiator: '' });

						assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
					});
				});

				context(
					'instance and association have matching non-empty differentiator value but empty name value',
					() => {
						it('will not add properties to errors property', async (test) => {
							const Entity = await createSubject();

							const instance = new Entity({ name: '', differentiator: '1' });

							instance.differentiator = '';

							test.mock.method(instance, 'addPropertyError', () => undefined);

							instance.validateNoAssociationWithSelf({ name: '', differentiator: '1' });

							assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
						});
					}
				);
			});

			context('uuid comparison', () => {
				context('association has not yet been assigned uuid value', () => {
					it('will not add properties to errors property', async (test) => {
						const ProductionIdentifier = await createSubject('ProductionIdentifier');

						const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

						test.mock.method(instance, 'addPropertyError', () => undefined);

						instance.validateNoAssociationWithSelf({ uuid: undefined });

						assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
					});
				});

				context('association uuid different to instance uuid', () => {
					it('will not add properties to errors property', async (test) => {
						const ProductionIdentifier = await createSubject('ProductionIdentifier');

						const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

						test.mock.method(instance, 'addPropertyError', () => undefined);

						instance.validateNoAssociationWithSelf({ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' });

						assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
					});
				});
			});
		});

		context('invalid data', () => {
			context('name and differentiator comparison', () => {
				it('adds properties whose values are arrays to errors property', async (test) => {
					const Entity = await createSubject();

					const instance = new Entity({ name: 'National Theatre' });

					instance.differentiator = '';

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateNoAssociationWithSelf({ name: 'National Theatre', differentiator: '' });

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'name',
						'Instance cannot form association with itself'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
						'differentiator',
						'Instance cannot form association with itself'
					]);
				});
			});

			context('uuid comparison', () => {
				it('adds properties whose values are arrays to errors property', async (test) => {
					const ProductionIdentifier = await createSubject('ProductionIdentifier');

					const instance = new ProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateNoAssociationWithSelf({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'uuid',
						'Instance cannot form association with itself'
					]);
				});
			});
		});
	});

	describe('runDatabaseValidations method', () => {
		context('model is not exempt', () => {
			it('will call validateUniquenessInDatabase method', async (test) => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				const originalValidateUniquenessInDatabase = instance.validateUniquenessInDatabase;
				test.mock.method(instance, 'validateUniquenessInDatabase', function (...args) {
					return originalValidateUniquenessInDatabase.apply(this, args);
				});

				await instance.runDatabaseValidations();

				assert.strictEqual(instance.validateUniquenessInDatabase.mock.calls.length, 1);
				assert.deepStrictEqual(instance.validateUniquenessInDatabase.mock.calls[0].arguments, []);
			});
		});

		context('model is exempt', () => {
			it('will return without calling validateUniquenessInDatabase method (because when productions are created they are treated as unique)', async (test) => {
				const Production = await createSubject('Production');

				const instance = new Production();

				test.mock.method(instance, 'validateUniquenessInDatabase', () => undefined);

				await instance.runDatabaseValidations();

				assert.strictEqual(instance.validateUniquenessInDatabase.mock.calls.length, 0);
			});
		});
	});

	describe('validateUniquenessInDatabase method', () => {
		context('valid data (results returned that indicate name does not already exist)', () => {
			it('will not call addPropertyError method', async (test) => {
				stubs.prepareAsParams = test.mock.fn(() => ({
					uuid: 'UUID_VALUE',
					name: 'NAME_VALUE',
					differentiator: 'DIFFERENTIATOR_VALUE'
				}));
				stubs.neo4jQueryModule.neo4jQuery = test.mock.fn(async () => ({ isDuplicateRecord: false }));

				const Entity = await createSubject();
				const instance = new Entity({ name: 'Foobar', differentiator: '1' });
				const callOrder = [];

				test.mock.method(stubs, 'prepareAsParams', function (...args) {
					callOrder.push('prepareAsParams');

					return {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					};
				});
				test.mock.method(
					stubs.cypherQueriesModule.validationQueries,
					'getDuplicateRecordCheckQuery',
					function (...args) {
						callOrder.push('getDuplicateRecordCheckQuery');

						return 'getDuplicateRecordCheckQuery response';
					}
				);
				test.mock.method(stubs.neo4jQueryModule, 'neo4jQuery', async function (...args) {
					callOrder.push('neo4jQuery');

					return { isDuplicateRecord: false };
				});
				test.mock.method(instance, 'addPropertyError', () => undefined);

				await instance.validateUniquenessInDatabase();

				assert.deepStrictEqual(callOrder, [
					'prepareAsParams',
					'getDuplicateRecordCheckQuery',
					'neo4jQuery'
				]);
				assert.strictEqual(stubs.prepareAsParams.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.strictEqual(stubs.cypherQueriesModule.validationQueries.getDuplicateRecordCheckQuery.mock.calls.length, 1);
				assert.deepStrictEqual(
					stubs.cypherQueriesModule.validationQueries.getDuplicateRecordCheckQuery.mock.calls[0].arguments,
					[instance.model]
				);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getDuplicateRecordCheckQuery response',
					params: {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					}
				}]);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
			});
		});

		context('invalid data (results returned that indicate name already exists)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.prepareAsParams = test.mock.fn(() => ({
					uuid: 'UUID_VALUE',
					name: 'NAME_VALUE',
					differentiator: 'DIFFERENTIATOR_VALUE'
				}));
				stubs.neo4jQueryModule.neo4jQuery = test.mock.fn(async () => ({ isDuplicateRecord: true }));

				const Entity = await createSubject();
				const instance = new Entity({ name: 'Foobar', differentiator: '1' });
				const callOrder = [];
				const originalAddPropertyError = instance.addPropertyError;

				test.mock.method(stubs, 'prepareAsParams', function (...args) {
					callOrder.push('prepareAsParams');

					return {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					};
				});
				test.mock.method(
					stubs.cypherQueriesModule.validationQueries,
					'getDuplicateRecordCheckQuery',
					function (...args) {
						callOrder.push('getDuplicateRecordCheckQuery');

						return 'getDuplicateRecordCheckQuery response';
					}
				);
				test.mock.method(stubs.neo4jQueryModule, 'neo4jQuery', async function (...args) {
					callOrder.push('neo4jQuery');

					return { isDuplicateRecord: true };
				});
				test.mock.method(instance, 'addPropertyError', function (...args) {
					callOrder.push('addPropertyError');

					return originalAddPropertyError.apply(this, args);
				});

				await instance.validateUniquenessInDatabase();

				assert.deepStrictEqual(callOrder, [
					'prepareAsParams',
					'getDuplicateRecordCheckQuery',
					'neo4jQuery',
					'addPropertyError',
					'addPropertyError'
				]);
				assert.strictEqual(stubs.prepareAsParams.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.strictEqual(stubs.cypherQueriesModule.validationQueries.getDuplicateRecordCheckQuery.mock.calls.length, 1);
				assert.deepStrictEqual(
					stubs.cypherQueriesModule.validationQueries.getDuplicateRecordCheckQuery.mock.calls[0].arguments,
					[instance.model]
				);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getDuplicateRecordCheckQuery response',
					params: {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					}
				}]);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
				assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
					'name',
					'Name and differentiator combination already exists'
				]);
				assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
					'differentiator',
					'Name and differentiator combination already exists'
				]);
			});
		});
	});

	describe('setErrorStatus method', () => {
		it("will call hasErrors function and assign its return value to the instance's hasErrors property", async () => {
			const Entity = await createSubject();

			const instance = new Entity({ name: 'Foobar', differentiator: '1' });

			instance.setErrorStatus();

			assert.strictEqual(stubs.hasErrors.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.hasErrors.mock.calls[0].arguments, [instance]);

			assert.equal(instance.hasErrors, false);
		});
	});

	describe('confirmExistenceInDatabase method', () => {
		context('opts argument is not provided', () => {
			it('confirms existence of instance in database using model value of instance', async () => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({ isExistent: true }));

				const Person = await createSubject('Person');

				const instance = new Person({ name: 'Antony Sher' });

				await instance.confirmExistenceInDatabase();

				assert.strictEqual(stubs.cypherQueriesModule.validationQueries.getExistenceCheckQuery.mock.calls.length, 1);
				assert.deepStrictEqual(
					stubs.cypherQueriesModule.validationQueries.getExistenceCheckQuery.mock.calls[0].arguments,
					[instance.model]
				);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getExistenceCheckQuery response',
					params: { uuid: instance.uuid }
				}]);
			});
		});

		context('model value is provided in opts argument', () => {
			it('confirms existence of instance in database using provided model value', async () => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({ isExistent: true }));

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				const model = 'PRODUCTION';

				await instance.confirmExistenceInDatabase({ model });

				assert.strictEqual(stubs.cypherQueriesModule.validationQueries.getExistenceCheckQuery.mock.calls.length, 1);
				assert.deepStrictEqual(
					stubs.cypherQueriesModule.validationQueries.getExistenceCheckQuery.mock.calls[0].arguments,
					[model]
				);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getExistenceCheckQuery response',
					params: { uuid: instance.uuid }
				}]);
			});
		});

		context('instance is found in database', () => {
			it('returns the isExistent value from the database response', async () => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({ isExistent: true }));

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				const model = 'PRODUCTION';

				const result = await instance.confirmExistenceInDatabase({ model });

				assert.equal(result, true);
			});
		});

		context('instance is not found in database', () => {
			it('returns the isExistent value from the database response', async () => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({ isExistent: false }));

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
			it('creates', async (test) => {
				const prepareAsParamsResults = [
					{
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					},
					'prepareAsParams response'
				];
				stubs.prepareAsParams = test.mock.fn(() => prepareAsParamsResults.shift());

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });
				const originalRunInputValidations = instance.runInputValidations;
				const originalRunDatabaseValidations = instance.runDatabaseValidations;
				const originalSetErrorStatus = instance.setErrorStatus;
				const originalConstructor = instance.constructor;

				test.mock.method(instance, 'runInputValidations', function (...args) {
					return originalRunInputValidations.apply(this, args);
				});
				test.mock.method(instance, 'runDatabaseValidations', async function (...args) {
					return originalRunDatabaseValidations.apply(this, args);
				});
				test.mock.method(instance, 'setErrorStatus', function (...args) {
					return originalSetErrorStatus.apply(this, args);
				});
				test.mock.method(instance, 'constructor', function (...args) {
					return originalConstructor.apply(this, args);
				});

				const result = await instance.createUpdate(stubs.cypherQueriesModule.sharedQueries.getCreateQuery);

				assert.strictEqual(instance.runInputValidations.mock.calls.length, 1);
				assert.deepStrictEqual(instance.runInputValidations.mock.calls[0].arguments, []);
				assert.strictEqual(instance.runDatabaseValidations.mock.calls.length, 1);
				assert.deepStrictEqual(instance.runDatabaseValidations.mock.calls[0].arguments, []);
				assert.strictEqual(instance.setErrorStatus.mock.calls.length, 1);
				assert.deepStrictEqual(instance.setErrorStatus.mock.calls[0].arguments, []);
				assert.strictEqual(stubs.cypherQueriesModule.sharedQueries.getCreateQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.cypherQueriesModule.sharedQueries.getCreateQuery.mock.calls[0].arguments, [
					instance.model
				]);
				assert.strictEqual(stubs.prepareAsParams.mock.calls.length, 2);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[1].arguments, [instance]);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 2);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getDuplicateRecordCheckQuery response',
					params: {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					}
				}]);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[1].arguments, [{
					query: 'getCreateQuery response',
					params: 'prepareAsParams response'
				}]);
				assert.strictEqual(instance.constructor.mock.calls.length, 1);
				assert.deepStrictEqual(instance.constructor.mock.calls[0].arguments, [neo4jQueryMockResponse]);
				assert.equal(result instanceof Entity, true);
			});

			it('updates', async (test) => {
				const prepareAsParamsResults = [
					{
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					},
					'prepareAsParams response'
				];
				stubs.prepareAsParams = test.mock.fn(() => prepareAsParamsResults.shift());

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });
				const originalRunInputValidations = instance.runInputValidations;
				const originalRunDatabaseValidations = instance.runDatabaseValidations;
				const originalSetErrorStatus = instance.setErrorStatus;
				const originalConstructor = instance.constructor;

				test.mock.method(instance, 'runInputValidations', function (...args) {
					return originalRunInputValidations.apply(this, args);
				});
				test.mock.method(instance, 'runDatabaseValidations', async function (...args) {
					return originalRunDatabaseValidations.apply(this, args);
				});
				test.mock.method(instance, 'setErrorStatus', function (...args) {
					return originalSetErrorStatus.apply(this, args);
				});
				test.mock.method(instance, 'constructor', function (...args) {
					return originalConstructor.apply(this, args);
				});

				const result = await instance.createUpdate(stubs.cypherQueriesModule.sharedQueries.getUpdateQuery);

				assert.strictEqual(instance.runInputValidations.mock.calls.length, 1);
				assert.deepStrictEqual(instance.runInputValidations.mock.calls[0].arguments, []);
				assert.strictEqual(instance.runDatabaseValidations.mock.calls.length, 1);
				assert.deepStrictEqual(instance.runDatabaseValidations.mock.calls[0].arguments, []);
				assert.strictEqual(instance.setErrorStatus.mock.calls.length, 1);
				assert.deepStrictEqual(instance.setErrorStatus.mock.calls[0].arguments, []);
				assert.strictEqual(stubs.cypherQueriesModule.sharedQueries.getUpdateQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.cypherQueriesModule.sharedQueries.getUpdateQuery.mock.calls[0].arguments, [
					instance.model
				]);
				assert.strictEqual(stubs.prepareAsParams.mock.calls.length, 2);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[1].arguments, [instance]);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 2);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getDuplicateRecordCheckQuery response',
					params: {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					}
				}]);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[1].arguments, [{
					query: 'getUpdateQuery response',
					params: 'prepareAsParams response'
				}]);
				assert.strictEqual(instance.constructor.mock.calls.length, 1);
				assert.deepStrictEqual(instance.constructor.mock.calls[0].arguments, [neo4jQueryMockResponse]);
				assert.equal(result instanceof Entity, true);
			});
		});

		context('invalid data', () => {
			it('returns instance without creating/updating', async (test) => {
				stubs.prepareAsParams = test.mock.fn(() => ({
					uuid: 'UUID_VALUE',
					name: 'NAME_VALUE',
					differentiator: 'DIFFERENTIATOR_VALUE'
				}));
				stubs.hasErrors = test.mock.fn(() => true);

				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				const getCreateUpdateQueryStub = test.mock.fn();

				instance.model = 'VENUE';

				const originalRunInputValidations = instance.runInputValidations;
				const originalRunDatabaseValidations = instance.runDatabaseValidations;
				const originalSetErrorStatus = instance.setErrorStatus;

				test.mock.method(instance, 'runInputValidations', function (...args) {
					return originalRunInputValidations.apply(this, args);
				});
				test.mock.method(instance, 'runDatabaseValidations', async function (...args) {
					return originalRunDatabaseValidations.apply(this, args);
				});
				test.mock.method(instance, 'setErrorStatus', function (...args) {
					return originalSetErrorStatus.apply(this, args);
				});
				test.mock.method(instance, 'constructor', () => undefined);

				const result = await instance.createUpdate(getCreateUpdateQueryStub);

				assert.strictEqual(instance.runInputValidations.mock.calls.length, 1);
				assert.deepStrictEqual(instance.runInputValidations.mock.calls[0].arguments, []);
				assert.strictEqual(instance.runDatabaseValidations.mock.calls.length, 1);
				assert.deepStrictEqual(instance.runDatabaseValidations.mock.calls[0].arguments, []);
				assert.strictEqual(instance.setErrorStatus.mock.calls.length, 1);
				assert.deepStrictEqual(instance.setErrorStatus.mock.calls[0].arguments, []);
				assert.strictEqual(getCreateUpdateQueryStub.mock.calls.length, 0);
				assert.strictEqual(stubs.prepareAsParams.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getDuplicateRecordCheckQuery response',
					params: {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE'
					}
				}]);
				assert.strictEqual(instance.constructor.mock.calls.length, 0);
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
			it('calls createUpdate method with function to get model-specific create query as argument', async (test) => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				instance.model = 'PRODUCTION';

				test.mock.method(instance, 'createUpdate', async () => undefined);

				await instance.create();

				assert.strictEqual(instance.createUpdate.mock.calls.length, 1);
				assert.deepStrictEqual(instance.createUpdate.mock.calls[0].arguments, [
					stubs.cypherQueriesModule.getCreateQueries[instance.model]
				]);
			});
		});

		context('instance can use shared query', () => {
			it('calls createUpdate method with function to get shared create query as argument', async (test) => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				test.mock.method(instance, 'createUpdate', async () => undefined);

				await instance.create();

				assert.strictEqual(instance.createUpdate.mock.calls.length, 1);
				assert.deepStrictEqual(instance.createUpdate.mock.calls[0].arguments, [
					stubs.cypherQueriesModule.sharedQueries.getCreateQuery
				]);
			});
		});
	});

	describe('edit method', () => {
		context('instance requires a model-specific query', () => {
			it('gets edit data using model-specific query', async (test) => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				instance.model = 'PRODUCTION';

				const originalConstructor = instance.constructor;
				test.mock.method(instance, 'constructor', function (...args) {
					return originalConstructor.apply(this, args);
				});

				const result = await instance.edit();

				assert.strictEqual(stubs.cypherQueriesModule.getEditQueries[instance.model].mock.calls.length, 1);
				assert.deepStrictEqual(stubs.cypherQueriesModule.getEditQueries[instance.model].mock.calls[0].arguments, []);
				assert.strictEqual(stubs.cypherQueriesModule.sharedQueries.getEditQuery.mock.calls.length, 0);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getEditProductionQuery response',
					params: { uuid: instance.uuid }
				}]);
				assert.strictEqual(instance.constructor.mock.calls.length, 1);
				assert.deepStrictEqual(instance.constructor.mock.calls[0].arguments, [neo4jQueryMockResponse]);
				assert.equal(result instanceof Entity, true);
			});
		});

		context('instance can use shared query', () => {
			it('gets edit data using shared query', async (test) => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				const originalConstructor = instance.constructor;
				test.mock.method(instance, 'constructor', function (...args) {
					return originalConstructor.apply(this, args);
				});

				const result = await instance.edit();

				assert.strictEqual(stubs.cypherQueriesModule.sharedQueries.getEditQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.cypherQueriesModule.sharedQueries.getEditQuery.mock.calls[0].arguments, [instance.model]);
				assert.strictEqual(stubs.cypherQueriesModule.getEditQueries.PRODUCTION.mock.calls.length, 0);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getEditQuery response',
					params: { uuid: instance.uuid }
				}]);
				assert.strictEqual(instance.constructor.mock.calls.length, 1);
				assert.deepStrictEqual(instance.constructor.mock.calls[0].arguments, [neo4jQueryMockResponse]);
				assert.equal(result instanceof Entity, true);
			});
		});
	});

	describe('update method', () => {
		context('instance does not exist', () => {
			it('throws a Not Found error and does not call the createUpdate method', async (test) => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				instance.model = 'PRODUCTION';

				test.mock.method(instance, 'confirmExistenceInDatabase', () => false);
				test.mock.method(instance, 'createUpdate', async () => undefined);

				try {
					await instance.update();
				} catch (error) {
					assert.equal(error.message, 'Not Found');
					assert.strictEqual(instance.confirmExistenceInDatabase.mock.calls.length, 1);
					assert.deepStrictEqual(instance.confirmExistenceInDatabase.mock.calls[0].arguments, []);
					assert.strictEqual(instance.createUpdate.mock.calls.length, 0);
				}
			});
		});

		context('instance exists', () => {
			context('instance requires a model-specific query', () => {
				it('calls createUpdate method with function to get model-specific update query as argument', async (test) => {
					const Entity = await createSubject();

					const instance = new Entity({ name: 'Foobar', differentiator: '1' });

					instance.model = 'PRODUCTION';

					test.mock.method(instance, 'confirmExistenceInDatabase', () => true);
					test.mock.method(instance, 'createUpdate', async () => undefined);

					await instance.update();

					assert.strictEqual(instance.confirmExistenceInDatabase.mock.calls.length, 1);
					assert.deepStrictEqual(instance.confirmExistenceInDatabase.mock.calls[0].arguments, []);
					assert.strictEqual(instance.createUpdate.mock.calls.length, 1);
					assert.deepStrictEqual(instance.createUpdate.mock.calls[0].arguments, [
						stubs.cypherQueriesModule.getUpdateQueries[instance.model]
					]);
				});
			});

			context('instance can use shared query', () => {
				it('calls createUpdate method with function to get shared update query as argument', async (test) => {
					const Entity = await createSubject();

					const instance = new Entity({ name: 'Foobar', differentiator: '1' });

					test.mock.method(instance, 'confirmExistenceInDatabase', () => true);
					test.mock.method(instance, 'createUpdate', async () => undefined);

					await instance.update();

					assert.strictEqual(instance.confirmExistenceInDatabase.mock.calls.length, 1);
					assert.deepStrictEqual(instance.confirmExistenceInDatabase.mock.calls[0].arguments, []);
					assert.strictEqual(instance.createUpdate.mock.calls.length, 1);
					assert.deepStrictEqual(instance.createUpdate.mock.calls[0].arguments, [
						stubs.cypherQueriesModule.sharedQueries.getUpdateQuery
					]);
				});
			});
		});
	});

	describe('delete method', () => {
		context('instance has no associations', () => {
			context('instance has differentiator property', () => {
				it('deletes instance and returns newly instantiated instance with assigned name and differentiator properties', async (test) => {
					stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
						model: 'VENUE',
						name: 'Almeida Theatre',
						differentiator: null,
						isDeleted: true,
						associatedModels: []
					}));

					const Entity = await createSubject();

					const instance = new Entity({ name: 'Foobar', differentiator: '1' });

					instance.differentiator = '';

					const originalConstructor = instance.constructor;
					test.mock.method(instance, 'constructor', function (...args) {
						return originalConstructor.apply(this, args);
					});
					test.mock.method(instance, 'addPropertyError', () => undefined);
					test.mock.method(instance, 'setErrorStatus', () => undefined);

					const result = await instance.delete();

					assert.strictEqual(stubs.cypherQueriesModule.sharedQueries.getDeleteQuery.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.cypherQueriesModule.sharedQueries.getDeleteQuery.mock.calls[0].arguments, [
						instance.model
					]);
					assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
						query: 'getDeleteQuery response',
						params: { uuid: instance.uuid }
					}]);
					assert.strictEqual(instance.constructor.mock.calls.length, 1);
					assert.deepStrictEqual(instance.constructor.mock.calls[0].arguments, [{
						name: 'Almeida Theatre',
						differentiator: null
					}]);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
					assert.strictEqual(instance.setErrorStatus.mock.calls.length, 0);
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
				it('deletes instance and returns newly instantiated instance with assigned name property', async (test) => {
					stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
						model: 'PRODUCTION',
						name: 'Hamlet',
						differentiator: null,
						isDeleted: true,
						associatedModels: []
					}));

					const Production = await createSubject('Production');

					const instance = new Production();

					const originalConstructor = instance.constructor;
					test.mock.method(instance, 'constructor', function (...args) {
						return originalConstructor.apply(this, args);
					});
					test.mock.method(instance, 'addPropertyError', () => undefined);
					test.mock.method(instance, 'setErrorStatus', () => undefined);

					const result = await instance.delete();

					assert.strictEqual(stubs.cypherQueriesModule.sharedQueries.getDeleteQuery.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.cypherQueriesModule.sharedQueries.getDeleteQuery.mock.calls[0].arguments, [
						instance.model
					]);
					assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
						query: 'getDeleteQuery response',
						params: { uuid: instance.uuid }
					}]);
					assert.strictEqual(instance.constructor.mock.calls.length, 1);
					assert.deepStrictEqual(instance.constructor.mock.calls[0].arguments, [{ name: 'Hamlet' }]);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
					assert.strictEqual(instance.setErrorStatus.mock.calls.length, 0);
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
				it('returns instance without deleting', async (test) => {
					stubs.hasErrors.mock.mockImplementation(() => true);
					stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
						model: 'VENUE',
						name: 'Almeida Theatre',
						differentiator: null,
						isDeleted: false,
						associatedModels: ['Production']
					}));

					const Entity = await createSubject();

					const instance = new Entity({ name: 'Foobar', differentiator: '1' });

					instance.differentiator = '';

					test.mock.method(instance, 'constructor', () => undefined);
					const originalAddPropertyError = instance.addPropertyError;
					const originalSetErrorStatus = instance.setErrorStatus;
					test.mock.method(instance, 'addPropertyError', function (...args) {
						return originalAddPropertyError.apply(this, args);
					});
					test.mock.method(instance, 'setErrorStatus', function (...args) {
						return originalSetErrorStatus.apply(this, args);
					});

					const result = await instance.delete();

					assert.strictEqual(stubs.cypherQueriesModule.sharedQueries.getDeleteQuery.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.cypherQueriesModule.sharedQueries.getDeleteQuery.mock.calls[0].arguments, [
						instance.model
					]);
					assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
						query: 'getDeleteQuery response',
						params: { uuid: instance.uuid }
					}]);
					assert.strictEqual(instance.constructor.mock.calls.length, 0);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, ['associations', 'Production']);
					assert.strictEqual(instance.setErrorStatus.mock.calls.length, 1);
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
				it('returns instance without deleting', async (test) => {
					stubs.hasErrors.mock.mockImplementation(() => true);
					stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
						model: 'PRODUCTION',
						name: 'Hamlet',
						differentiator: null,
						isDeleted: false,
						associatedModels: ['Venue']
					}));

					const Production = await createSubject('Production');

					const instance = new Production({ name: 'Foobar' });

					test.mock.method(instance, 'constructor', () => undefined);
					const originalAddPropertyError = instance.addPropertyError;
					const originalSetErrorStatus = instance.setErrorStatus;
					test.mock.method(instance, 'addPropertyError', function (...args) {
						return originalAddPropertyError.apply(this, args);
					});
					test.mock.method(instance, 'setErrorStatus', function (...args) {
						return originalSetErrorStatus.apply(this, args);
					});

					const result = await instance.delete();

					assert.strictEqual(stubs.cypherQueriesModule.sharedQueries.getDeleteQuery.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.cypherQueriesModule.sharedQueries.getDeleteQuery.mock.calls[0].arguments, [
						instance.model
					]);
					assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
						query: 'getDeleteQuery response',
						params: { uuid: instance.uuid }
					}]);
					assert.strictEqual(instance.constructor.mock.calls.length, 0);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, ['associations', 'Venue']);
					assert.strictEqual(instance.setErrorStatus.mock.calls.length, 1);
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

				assert.strictEqual(stubs.cypherQueriesModule.getShowQueries.VENUE.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.cypherQueriesModule.getShowQueries.VENUE.mock.calls[0].arguments, []);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'showVenueQuery',
					params: { uuid: instance.uuid }
				}]);
				assert.deepEqual(result, neo4jQueryMockResponse);
			});
		});

		context('model requires multiple show queries', () => {
			it('gets show data', async () => {
				const Entity = await createSubject();

				const instance = new Entity({ name: 'Foobar', differentiator: '1' });

				instance.model = 'PRODUCTION';

				const result = await instance.show();

				assert.strictEqual(stubs.cypherQueriesModule.getShowQueries.PRODUCTION.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.cypherQueriesModule.getShowQueries.PRODUCTION.mock.calls[0].arguments, []);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 2);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'showProductionQuery',
					params: { uuid: instance.uuid }
				}]);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[1].arguments, [{
					query: 'showProductionAwardsQuery',
					params: { uuid: instance.uuid }
				}]);
				assert.deepEqual(result, neo4jQueryMockResponse);
			});
		});
	});

	describe('list method', () => {
		it('gets list data', async () => {
			const Entity = await createSubject();

			const result = await Entity.list('model');

			assert.strictEqual(stubs.cypherQueriesModule.sharedQueries.getListQuery.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.cypherQueriesModule.sharedQueries.getListQuery.mock.calls[0].arguments, ['model']);
			assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
			assert.deepStrictEqual(
				stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments,
				[
					{ query: 'getListQuery response' },
					{ isOptionalResult: true, isArrayResult: true }
				]
			);
			assert.deepEqual(result, neo4jQueryMockResponse);
		});
	});
});

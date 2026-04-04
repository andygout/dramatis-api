import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { Award, AwardCeremonyCategory } from '../../../src/models/index.js';

describe('AwardCeremony model', () => {
	let stubs;
	let AwardCeremony;

	const AwardStub = function () {
		return new Award();
	};

	const AwardCeremonyCategoryStub = function () {
		return new AwardCeremonyCategory();
	};

	beforeEach(async (test) => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: test.mock.fn(() => [])
			},
			prepareAsParams: test.mock.fn(() => ({
				uuid: 'UUID_VALUE',
				name: 'NAME_VALUE',
				award: {
					name: 'AWARD_UUID_VALUE',
					differentiator: 'AWARD_DIFFERENTIATOR_VALUE'
				}
			})),
			models: {
				Award: AwardStub,
				AwardCeremonyCategory: AwardCeremonyCategoryStub
			},
			cypherQueriesModule: {
				validationQueries: {
					getAwardContextualDuplicateRecordCheckQuery: test.mock.fn(
						() => 'getAwardContextualDuplicateRecordCheckQuery response'
					)
				}
			},
			neo4jQueryModule: {
				neo4jQuery: test.mock.fn(async () => ({ neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' }))
			}
		};

		AwardCeremony = await esmock(
			'../../../src/models/AwardCeremony.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/lib/prepare-as-params.js': stubs.prepareAsParams,
				'../../../src/models/index.js': stubs.models,
				'../../../src/neo4j/cypher-queries/index.js': stubs.cypherQueriesModule,
				'../../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);
	});

	describe('constructor method', () => {
		describe('award property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new AwardCeremony({ name: '2020' });

				assert.equal(instance.award instanceof Award, true);
			});

			it('assigns instance if included in props', async () => {
				const instance = new AwardCeremony({
					name: '2020',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

				assert.equal(instance.award instanceof Award, true);
			});
		});

		describe('categories property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new AwardCeremony({ name: '2020' });

				assert.deepEqual(instance.categories, []);
			});

			it('assigns array of category instances, retaining those with empty or whitespace-only string names', async () => {
				const instance = new AwardCeremony({
					name: '2020',
					categories: [
						{
							name: 'Best New Play'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});

				assert.equal(instance.categories.length, 3);
				assert.equal(instance.categories[0] instanceof AwardCeremonyCategory, true);
				assert.equal(instance.categories[1] instanceof AwardCeremonyCategory, true);
				assert.equal(instance.categories[2] instanceof AwardCeremonyCategory, true);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
			const instance = new AwardCeremony({
				name: '2020',
				categories: [
					{
						name: 'Best New Play'
					}
				]
			});

			const callOrder = [];
			const originalValidateName = instance.validateName;
			const originalAwardValidateName = instance.award.validateName;
			const originalAwardValidateDifferentiator = instance.award.validateDifferentiator;
			const originalRunInputValidations = instance.categories[0].runInputValidations;

			test.mock.method(instance, 'validateName', function (...args) {
				callOrder.push('instance.validateName');

				return originalValidateName.apply(this, args);
			});
			test.mock.method(instance.award, 'validateName', function (...args) {
				callOrder.push('instance.award.validateName');

				return originalAwardValidateName.apply(this, args);
			});
			test.mock.method(instance.award, 'validateDifferentiator', function (...args) {
				callOrder.push('instance.award.validateDifferentiator');

				return originalAwardValidateDifferentiator.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateBaseInstanceIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices');

				return [];
			});
			test.mock.method(instance.categories[0], 'runInputValidations', function (...args) {
				callOrder.push('instance.categories[0].runInputValidations');

				return originalRunInputValidations.apply(this, args);
			});

			instance.runInputValidations();

			assert.deepStrictEqual(callOrder, [
				'instance.validateName',
				'instance.award.validateName',
				'instance.award.validateDifferentiator',
				'stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices',
				'instance.categories[0].runInputValidations'
			]);
			assert.strictEqual(instance.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: true }]);
			assert.strictEqual(instance.award.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.award.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.award.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.award.validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.mock.calls.length, 1);
			assert.deepStrictEqual(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.mock.calls[0].arguments,
				[instance.categories]
			);
			assert.strictEqual(instance.categories[0].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.categories[0].runInputValidations.mock.calls[0].arguments, [{ isDuplicate: false }]);
		});
	});

	describe('runDatabaseValidations method', () => {
		it("calls instance's validateAwardContextualUniquenessInDatabase method and associated categories' runDatabaseValidations method", async (test) => {
			const instance = new AwardCeremony({
				name: '2020',
				categories: [
					{
						name: 'Best New Play'
					}
				]
			});

			const originalValidateAwardContextualUniquenessInDatabase =
				instance.validateAwardContextualUniquenessInDatabase;
			const originalRunDatabaseValidations = instance.categories[0].runDatabaseValidations;

			test.mock.method(instance, 'validateAwardContextualUniquenessInDatabase', function (...args) {
				return originalValidateAwardContextualUniquenessInDatabase.apply(this, args);
			});
			test.mock.method(instance.categories[0], 'runDatabaseValidations', function (...args) {
				return originalRunDatabaseValidations.apply(this, args);
			});

			await instance.runDatabaseValidations();

			assert.strictEqual(instance.validateAwardContextualUniquenessInDatabase.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateAwardContextualUniquenessInDatabase.mock.calls[0].arguments, []);
			assert.strictEqual(instance.categories[0].runDatabaseValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.categories[0].runDatabaseValidations.mock.calls[0].arguments, []);
		});
	});

	describe('validateAwardContextualUniquenessInDatabase method', () => {
		describe('valid data (results returned that indicate name does not already exist for given award)', () => {
			it('will not call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery = test.mock.fn(async () => ({ isDuplicateRecord: false }));

				const instance = new AwardCeremony();
				const callOrder = [];

				test.mock.method(stubs, 'prepareAsParams', function (...args) {
					callOrder.push('stubs.prepareAsParams');

					return {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						award: {
							name: 'AWARD_UUID_VALUE',
							differentiator: 'AWARD_DIFFERENTIATOR_VALUE'
						}
					};
				});
				test.mock.method(
					stubs.cypherQueriesModule.validationQueries,
					'getAwardContextualDuplicateRecordCheckQuery',
					function (...args) {
						callOrder.push('stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery');

						return 'getAwardContextualDuplicateRecordCheckQuery response';
					}
				);
				test.mock.method(stubs.neo4jQueryModule, 'neo4jQuery', async function (...args) {
					callOrder.push('stubs.neo4jQueryModule.neo4jQuery');

					return { isDuplicateRecord: false };
				});
				test.mock.method(instance, 'addPropertyError', function (...args) {
					return undefined;
				});
				test.mock.method(instance.award, 'addPropertyError', function (...args) {
					return undefined;
				});

				await instance.validateAwardContextualUniquenessInDatabase();

				assert.deepStrictEqual(callOrder, [
					'stubs.prepareAsParams',
					'stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery',
					'stubs.neo4jQueryModule.neo4jQuery'
				]);
				assert.strictEqual(stubs.prepareAsParams.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.strictEqual(
					stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery.mock.calls.length,
					1
				);
				assert.deepStrictEqual(
					stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery.mock.calls[0]
						.arguments,
					[]
				);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [
					{
						query: 'getAwardContextualDuplicateRecordCheckQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							award: {
								name: 'AWARD_UUID_VALUE',
								differentiator: 'AWARD_DIFFERENTIATOR_VALUE'
							}
						}
					}
				]);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				assert.strictEqual(instance.award.addPropertyError.mock.calls.length, 0);
			});
		});

		describe('invalid data (results returned that indicate name already exists  for given award)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery = test.mock.fn(async () => ({ isDuplicateRecord: true }));

				const instance = new AwardCeremony();
				const callOrder = [];

				test.mock.method(stubs, 'prepareAsParams', function (...args) {
					callOrder.push('stubs.prepareAsParams');

					return {
						uuid: 'UUID_VALUE',
						name: 'NAME_VALUE',
						award: {
							name: 'AWARD_UUID_VALUE',
							differentiator: 'AWARD_DIFFERENTIATOR_VALUE'
						}
					};
				});
				test.mock.method(
					stubs.cypherQueriesModule.validationQueries,
					'getAwardContextualDuplicateRecordCheckQuery',
					function (...args) {
						callOrder.push('stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery');

						return 'getAwardContextualDuplicateRecordCheckQuery response';
					}
				);
				test.mock.method(stubs.neo4jQueryModule, 'neo4jQuery', async function (...args) {
					callOrder.push('stubs.neo4jQueryModule.neo4jQuery');

					return { isDuplicateRecord: true };
				});
				const originalAddPropertyError = instance.addPropertyError;
				test.mock.method(instance, 'addPropertyError', function (...args) {
					callOrder.push('instance.addPropertyError');

					return originalAddPropertyError.apply(this, args);
				});
				test.mock.method(instance.award, 'addPropertyError', function (...args) {
					return undefined;
				});

				await instance.validateAwardContextualUniquenessInDatabase();

				assert.deepStrictEqual(callOrder, [
					'stubs.prepareAsParams',
					'stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery',
					'stubs.neo4jQueryModule.neo4jQuery',
					'instance.addPropertyError'
				]);
				assert.strictEqual(stubs.prepareAsParams.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.strictEqual(
					stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery.mock.calls.length,
					1
				);
				assert.deepStrictEqual(
					stubs.cypherQueriesModule.validationQueries.getAwardContextualDuplicateRecordCheckQuery.mock.calls[0]
						.arguments,
					[]
				);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [
					{
						query: 'getAwardContextualDuplicateRecordCheckQuery response',
						params: {
							uuid: 'UUID_VALUE',
							name: 'NAME_VALUE',
							award: {
								name: 'AWARD_UUID_VALUE',
								differentiator: 'AWARD_DIFFERENTIATOR_VALUE'
							}
						}
					}
				]);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
				assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
					'name',
					'Award ceremony already exists for given award'
				]);
				assert.strictEqual(instance.award.addPropertyError.mock.calls.length, 2);
				assert.deepStrictEqual(instance.award.addPropertyError.mock.calls[0].arguments, [
					'name',
					'Award ceremony already exists for given award'
				]);
				assert.deepStrictEqual(instance.award.addPropertyError.mock.calls[1].arguments, [
					'differentiator',
					'Award ceremony already exists for given award'
				]);
			});
		});
	});
});

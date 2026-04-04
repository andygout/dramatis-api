import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

const context = describe;

describe('OriginalVersionMaterial model', () => {
	let stubs;
	let OriginalVersionMaterial;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(async (test) => {
		stubs = {
			prepareAsParams: test.mock.fn(() => ({ name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' })),
			cypherQueriesModule: {
				validationQueries: {
					getOriginalVersionMaterialChecksQuery: test.mock.fn(
						() => 'getOriginalVersionMaterialChecksQuery response'
					)
				}
			},
			neo4jQueryModule: {
				neo4jQuery: test.mock.fn(async () => neo4jQueryMockResponse)
			}
		};

		OriginalVersionMaterial = await esmock(
			'../../../src/models/OriginalVersionMaterial.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/prepare-as-params.js': stubs.prepareAsParams,
				'../../../src/neo4j/cypher-queries/index.js': stubs.cypherQueriesModule,
				'../../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);
	});

	describe('runDatabaseValidations method', () => {
		context('valid data', () => {
			it('will not call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery = test.mock.fn(async () => ({
					isSubsequentVersionMaterialOfSubjectMaterial: false
				}));

				const instance = new OriginalVersionMaterial({ name: 'NAME_VALUE', differentiator: '1' });
				const callOrder = [];

				test.mock.method(stubs, 'prepareAsParams', function (...args) {
					callOrder.push('stubs.prepareAsParams');

					return { name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' };
				});
				test.mock.method(
					stubs.cypherQueriesModule.validationQueries,
					'getOriginalVersionMaterialChecksQuery',
					function (...args) {
						callOrder.push('stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery');

						return 'getOriginalVersionMaterialChecksQuery response';
					}
				);
				test.mock.method(stubs.neo4jQueryModule, 'neo4jQuery', async function (...args) {
					callOrder.push('stubs.neo4jQueryModule.neo4jQuery');

					return {
						isSubsequentVersionMaterialOfSubjectMaterial: false
					};
				});
				test.mock.method(instance, 'addPropertyError', () => undefined);

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.deepStrictEqual(callOrder, [
					'stubs.prepareAsParams',
					'stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery',
					'stubs.neo4jQueryModule.neo4jQuery'
				]);
				assert.strictEqual(stubs.prepareAsParams.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.strictEqual(
					stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery.mock.calls.length,
					1
				);
				assert.deepStrictEqual(
					stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery.mock.calls[0]
						.arguments,
					[]
				);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [
					{
						query: 'getOriginalVersionMaterialChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				]);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
			});
		});

		context("invalid data (instance is the subject material's subsequent version material)", () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery = test.mock.fn(async () => ({
					isSubsequentVersionMaterialOfSubjectMaterial: true
				}));

				const instance = new OriginalVersionMaterial({ name: 'NAME_VALUE', differentiator: '1' });
				const callOrder = [];

				test.mock.method(stubs, 'prepareAsParams', function (...args) {
					callOrder.push('stubs.prepareAsParams');

					return { name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' };
				});
				test.mock.method(
					stubs.cypherQueriesModule.validationQueries,
					'getOriginalVersionMaterialChecksQuery',
					function (...args) {
						callOrder.push('stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery');

						return 'getOriginalVersionMaterialChecksQuery response';
					}
				);
				test.mock.method(stubs.neo4jQueryModule, 'neo4jQuery', async function (...args) {
					callOrder.push('stubs.neo4jQueryModule.neo4jQuery');

					return {
						isSubsequentVersionMaterialOfSubjectMaterial: true
					};
				});
				test.mock.method(instance, 'addPropertyError', function (...args) {
					callOrder.push('instance.addPropertyError');

					return undefined;
				});

				await instance.runDatabaseValidations({ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				assert.deepStrictEqual(callOrder, [
					'stubs.prepareAsParams',
					'stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery',
					'stubs.neo4jQueryModule.neo4jQuery',
					'instance.addPropertyError',
					'instance.addPropertyError'
				]);
				assert.strictEqual(stubs.prepareAsParams.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.strictEqual(
					stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery.mock.calls.length,
					1
				);
				assert.deepStrictEqual(
					stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery.mock.calls[0]
						.arguments,
					[]
				);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [
					{
						query: 'getOriginalVersionMaterialChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				]);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
				assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
					'name',
					"Material with these attributes is this material's subsequent version material"
				]);
				assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
					'differentiator',
					"Material with these attributes is this material's subsequent version material"
				]);
			});
		});
	});
});

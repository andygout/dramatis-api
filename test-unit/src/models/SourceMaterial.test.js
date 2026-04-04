import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

const context = describe;

describe('SourceMaterial model', () => {
	let stubs;
	let SourceMaterial;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(async (test) => {
		stubs = {
			prepareAsParams: test.mock.fn(() => ({ name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' })),
			cypherQueriesModule: {
				validationQueries: {
					getSourceMaterialChecksQuery: test.mock.fn(() => 'getSourceMaterialChecksQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: test.mock.fn(async () => neo4jQueryMockResponse)
			}
		};

		SourceMaterial = await esmock(
			'../../../src/models/SourceMaterial.js',
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
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isSourcingMaterialOfSubjectMaterial: false
				}));

				const instance = new SourceMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.deepEqual(
					[
						stubs.prepareAsParams.mock.calls[0].arguments,
						stubs.cypherQueriesModule.validationQueries.getSourceMaterialChecksQuery.mock.calls[0].arguments,
						stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments
					],
					[
						[instance],
						[],
						[{
							query: 'getSourceMaterialChecksQuery response',
							params: {
								name: 'NAME_VALUE',
								differentiator: 'DIFFERENTIATOR_VALUE',
								subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
							}
						}]
					]
				);
				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSourceMaterialChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSourceMaterialChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSourceMaterialChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 0);
			});
		});

		context("invalid data (instance is the subject material's sourcing material)", () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isSourcingMaterialOfSubjectMaterial: true
				}));

				const instance = new SourceMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				assert.deepEqual(
					[
						stubs.prepareAsParams.mock.calls[0].arguments,
						stubs.cypherQueriesModule.validationQueries.getSourceMaterialChecksQuery.mock.calls[0].arguments,
						stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments,
						instance.addPropertyError.mock.calls[0].arguments
					],
					[
						[instance],
						[],
						[{
							query: 'getSourceMaterialChecksQuery response',
							params: {
								name: 'NAME_VALUE',
								differentiator: 'DIFFERENTIATOR_VALUE',
								subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
							}
						}],
						[
							'name',
							"Material with these attributes is this material's sourcing material"
						]
					]
				);
				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSourceMaterialChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSourceMaterialChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSourceMaterialChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 2);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'name',
						"Material with these attributes is this material's sourcing material"
					]
				);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[1].arguments,
					[
						'differentiator',
						"Material with these attributes is this material's sourcing material"
					]
				);
			});
		});
	});
});

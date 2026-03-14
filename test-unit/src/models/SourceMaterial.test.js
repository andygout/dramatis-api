import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, spy, stub } from 'sinon';

const context = describe;

describe('SourceMaterial model', () => {
	let stubs;
	let SourceMaterial;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(async () => {
		stubs = {
			prepareAsParams: stub().returns({ name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' }),
			cypherQueriesModule: {
				validationQueries: {
					getSourceMaterialChecksQuery: stub().returns('getSourceMaterialChecksQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: stub().resolves(neo4jQueryMockResponse)
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

	afterEach(() => {
		restore();
	});

	describe('runDatabaseValidations method', () => {
		context('valid data', () => {
			it('will not call addPropertyError method', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isSourcingMaterialOfSubjectMaterial: false
				});

				const instance = new SourceMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				sinonAssert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSourceMaterialChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(
					stubs.cypherQueriesModule.validationQueries.getSourceMaterialChecksQuery
				);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getSourceMaterialChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				});
				sinonAssert.notCalled(instance.addPropertyError);
			});
		});

		context("invalid data (instance is the subject material's sourcing material)", () => {
			it('will call addPropertyError method', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isSourcingMaterialOfSubjectMaterial: true
				});

				const instance = new SourceMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				sinonAssert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSourceMaterialChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(
					stubs.cypherQueriesModule.validationQueries.getSourceMaterialChecksQuery
				);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getSourceMaterialChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				});
				sinonAssert.calledTwice(instance.addPropertyError);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name',
					"Material with these attributes is this material's sourcing material"
				);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator',
					"Material with these attributes is this material's sourcing material"
				);
			});
		});
	});
});

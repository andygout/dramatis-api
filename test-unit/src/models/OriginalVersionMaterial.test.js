import esmock from 'esmock';
import { assert, restore, spy, stub } from 'sinon';

describe('OriginalVersionMaterial model', () => {

	let stubs;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(() => {

		stubs = {
			prepareAsParamsModule: {
				prepareAsParams: stub().returns({ name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' })
			},
			cypherQueriesModule: {
				validationQueries: {
					getOriginalVersionMaterialChecksQuery:
						stub().returns('getOriginalVersionMaterialChecksQuery response')
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

	const createSubject = () =>
		esmock(
			'../../../src/models/OriginalVersionMaterial.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/prepare-as-params.js': stubs.prepareAsParamsModule,
				'../../../src/neo4j/cypher-queries/index.js': stubs.cypherQueriesModule,
				'../../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);

	describe('runDatabaseValidations method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isSubsequentVersionMaterialOfSubjectMaterial: false
				});

				const OriginalVersionMaterial = await createSubject();

				const instance = new OriginalVersionMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.callOrder(
					stubs.prepareAsParamsModule.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.prepareAsParamsModule.prepareAsParams, instance);
				assert.calledOnceWithExactly(
					stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery
				);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getOriginalVersionMaterialChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data (instance is the subject material\'s subsequent version material)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isSubsequentVersionMaterialOfSubjectMaterial: true
				});

				const OriginalVersionMaterial = await createSubject();

				const instance = new OriginalVersionMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				assert.callOrder(
					stubs.prepareAsParamsModule.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParamsModule.prepareAsParams, instance);
				assert.calledOnceWithExactly(
					stubs.cypherQueriesModule.validationQueries.getOriginalVersionMaterialChecksQuery
				);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getOriginalVersionMaterialChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Material with these attributes is this material\'s subsequent version material'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Material with these attributes is this material\'s subsequent version material'
				);

			});

		});

	});

});

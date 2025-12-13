import esmock from 'esmock';
import { assert, restore, spy, stub } from 'sinon';

describe('SubMaterial model', () => {

	let stubs;
	let SubMaterial;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(async () => {

		stubs = {
			prepareAsParams: stub().returns({ name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' }),
			cypherQueriesModule: {
				validationQueries: {
					getSubMaterialChecksQuery: stub().returns('getSubMaterialChecksQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: stub().resolves(neo4jQueryMockResponse)
			}
		};

		SubMaterial = await esmock(
			'../../../src/models/SubMaterial.js',
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
					isAssignedToSurMaterial: false,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: false
				});

				const instance = new SubMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubMaterialChecksQuery response',
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

		context('invalid data (instance is already assigned to another sur-material)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isAssignedToSurMaterial: true,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: false
				});

				const instance = new SubMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubMaterialChecksQuery response',
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
					'name', 'Material with these attributes is already assigned to another sur-material'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Material with these attributes is already assigned to another sur-material'
				);

			});

		});

		context('invalid data (instance is the sur-most material of a three-tiered material collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: true,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: false
				});

				const instance = new SubMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubMaterialChecksQuery response',
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
					'name', 'Material with these attributes is the sur-most material of a three-tiered material collection'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Material with these attributes is the sur-most material of a three-tiered material collection'
				);

			});

		});

		context('invalid data (instance is the subject material\'s sur-material)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: true,
					isSubjectMaterialASubSubMaterial: false
				});

				const instance = new SubMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubMaterialChecksQuery response',
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
					'name', 'Material with these attributes is this material\'s sur-material'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Material with these attributes is this material\'s sur-material'
				);

			});

		});

		context('invalid data (instance cannot be assigned to a three-tiered material collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isAssignedToSurMaterial: false,
					isSurSurMaterial: false,
					isSurMaterialOfSubjectMaterial: false,
					isSubjectMaterialASubSubMaterial: true
				});

				const instance = new SubMaterial({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubMaterialChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubMaterialChecksQuery response',
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
					'name', 'Sub-material cannot be assigned to a three-tiered material collection'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Sub-material cannot be assigned to a three-tiered material collection'
				);

			});

		});

	});

});

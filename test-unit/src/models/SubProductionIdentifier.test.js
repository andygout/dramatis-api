import esmock from 'esmock';
import { assert, spy, stub } from 'sinon';

describe('SubProductionIdentifier model', () => {

	let stubs;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(() => {

		stubs = {
			cypherQueriesModule: {
				validationQueries: {
					getSubProductionChecksQuery: stub().returns('getSubProductionChecksQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: stub().resolves(neo4jQueryMockResponse)
			}
		};

	});

	const createSubject = () =>
		esmock(
			'../../../src/models/SubProductionIdentifier.js',
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
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});

				const SubProductionIdentifier = await createSubject();

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.callOrder(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data (instance does not exist)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isExistent: false,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});

				const SubProductionIdentifier = await createSubject();

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.callOrder(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID does not exist'
				);

			});

		});

		context('invalid data (instance is already assigned to another sur-production)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isExistent: true,
					isAssignedToSurProduction: true,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});

				const SubProductionIdentifier = await createSubject();

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.callOrder(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID is already assigned to another sur-production'
				);

			});

		});

		context('invalid data (instance is the sur-most production of a three-tiered production collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: true,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				});

				const SubProductionIdentifier = await createSubject();

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.callOrder(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID is the sur-most production of a three-tiered production collection'
				);

			});

		});

		context('invalid data (instance is the subject production\'s sur-production)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: true,
					isSubjectProductionASubSubProduction: false
				});

				const SubProductionIdentifier = await createSubject();

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.callOrder(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Production with this UUID is this production\'s sur-production'
				);

			});

		});

		context('invalid data (instance cannot be assigned to a three-tiered production collection)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: true
				});

				const SubProductionIdentifier = await createSubject();

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.callOrder(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubProductionChecksQuery response',
						params: {
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
						}
					}
				);
				assert.calledOnceWithExactly(
					instance.addPropertyError,
					'uuid', 'Sub-production cannot be assigned to a three-tiered production collection'
				);

			});

		});

	});

});

import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

const context = describe;

describe('SubProductionIdentifier model', () => {
	let stubs;
	let SubProductionIdentifier;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(async (test) => {
		stubs = {
			cypherQueriesModule: {
				validationQueries: {
					getSubProductionChecksQuery: test.mock.fn(() => 'getSubProductionChecksQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: test.mock.fn(async () => neo4jQueryMockResponse)
			}
		};

		SubProductionIdentifier = await esmock(
			'../../../src/models/SubProductionIdentifier.js',
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
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				}));

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubProductionChecksQuery response',
					params: {
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
						subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 0);
			});
		});

		context('invalid data (instance does not exist)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isExistent: false,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				}));

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubProductionChecksQuery response',
					params: {
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
						subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 1);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'uuid',
						'Production with this UUID does not exist'
					]
				);
			});
		});

		context('invalid data (instance is already assigned to another sur-production)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isExistent: true,
					isAssignedToSurProduction: true,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				}));

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubProductionChecksQuery response',
					params: {
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
						subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 1);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'uuid',
						'Production with this UUID is already assigned to another sur-production'
					]
				);
			});
		});

		context('invalid data (instance is the sur-most production of a three-tiered production collection)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: true,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: false
				}));

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubProductionChecksQuery response',
					params: {
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
						subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 1);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'uuid',
						'Production with this UUID is the sur-most production of a three-tiered production collection'
					]
				);
			});
		});

		context("invalid data (instance is the subject production's sur-production)", () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: true,
					isSubjectProductionASubSubProduction: false
				}));

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubProductionChecksQuery response',
					params: {
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
						subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 1);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'uuid',
						"Production with this UUID is this production's sur-production"
					]
				);
			});
		});

		context('invalid data (instance cannot be assigned to a three-tiered production collection)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isExistent: true,
					isAssignedToSurProduction: false,
					isSurSurProduction: false,
					isSurProductionOfSubjectProduction: false,
					isSubjectProductionASubSubProduction: true
				}));

				const instance = new SubProductionIdentifier({ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
				});

				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.callCount(), 1);
				assert.deepEqual(
					stubs.cypherQueriesModule.validationQueries.getSubProductionChecksQuery.mock.calls[0].arguments,
					[]
				);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubProductionChecksQuery response',
					params: {
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
						subjectProductionUuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 1);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'uuid',
						'Sub-production cannot be assigned to a three-tiered production collection'
					]
				);
			});
		});
	});
});

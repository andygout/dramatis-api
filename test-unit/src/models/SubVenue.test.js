import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

const context = describe;

describe('SubVenue model', () => {
	let stubs;
	let SubVenue;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(async (test) => {
		stubs = {
			prepareAsParams: test.mock.fn(() => ({ name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' })),
			cypherQueriesModule: {
				validationQueries: {
					getSubVenueChecksQuery: test.mock.fn(() => 'getSubVenueChecksQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: test.mock.fn(async () => neo4jQueryMockResponse)
			}
		};

		SubVenue = await esmock(
			'../../../src/models/SubVenue.js',
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
					isAssignedToSurVenue: false,
					isSurVenue: false,
					isSubjectVenueASubVenue: false
				}));

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery.mock.calls[0].arguments, []);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubVenueChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 0);
			});
		});

		context('invalid data (instance is already assigned to another sur-venue)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isAssignedToSurVenue: true,
					isSurVenue: false,
					isSubjectVenueASubVenue: false
				}));

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery.mock.calls[0].arguments, []);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubVenueChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 2);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'name',
						'Venue with these attributes is already assigned to another sur-venue'
					]
				);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[1].arguments,
					[
						'differentiator',
						'Venue with these attributes is already assigned to another sur-venue'
					]
				);
			});
		});

		context('invalid data (instance is the sur-most venue of a two-tiered venue collection)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isAssignedToSurVenue: false,
					isSurVenue: true,
					isSubjectVenueASubVenue: false
				}));

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery.mock.calls[0].arguments, []);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubVenueChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 2);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'name',
						'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
					]
				);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[1].arguments,
					[
						'differentiator',
						'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
					]
				);
			});
		});

		context('invalid data (instance cannot be assigned to a two-tiered venue collection)', () => {
			it('will call addPropertyError method', async (test) => {
				stubs.neo4jQueryModule.neo4jQuery.mock.mockImplementation(async () => ({
					isAssignedToSurVenue: false,
					isSurVenue: false,
					isSubjectVenueASubVenue: true
				}));

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				test.mock.method(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.equal(stubs.prepareAsParams.mock.callCount(), 1);
				assert.deepEqual(stubs.prepareAsParams.mock.calls[0].arguments, [instance]);
				assert.equal(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery.mock.calls[0].arguments, []);
				assert.equal(stubs.neo4jQueryModule.neo4jQuery.mock.callCount(), 1);
				assert.deepEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [{
					query: 'getSubVenueChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				}]);
				assert.equal(instance.addPropertyError.mock.callCount(), 2);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'name',
						'Sub-venue cannot be assigned to a two-tiered venue collection'
					]
				);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[1].arguments,
					[
						'differentiator',
						'Sub-venue cannot be assigned to a two-tiered venue collection'
					]
				);
			});
		});
	});
});

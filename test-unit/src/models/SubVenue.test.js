import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, spy, stub } from 'sinon';

const context = describe;

describe('SubVenue model', () => {
	let stubs;
	let SubVenue;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(async () => {
		stubs = {
			prepareAsParams: stub().returns({ name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' }),
			cypherQueriesModule: {
				validationQueries: {
					getSubVenueChecksQuery: stub().returns('getSubVenueChecksQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: stub().resolves(neo4jQueryMockResponse)
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

	afterEach(() => {
		restore();
	});

	describe('runDatabaseValidations method', () => {
		context('valid data', () => {
			it('will not call addPropertyError method', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isAssignedToSurVenue: false,
					isSurVenue: false,
					isSubjectVenueASubVenue: false
				});

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				sinonAssert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getSubVenueChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				});
				sinonAssert.notCalled(instance.addPropertyError);
			});
		});

		context('invalid data (instance is already assigned to another sur-venue)', () => {
			it('will call addPropertyError method', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isAssignedToSurVenue: true,
					isSurVenue: false,
					isSubjectVenueASubVenue: false
				});

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				sinonAssert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getSubVenueChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				});
				sinonAssert.calledTwice(instance.addPropertyError);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name',
					'Venue with these attributes is already assigned to another sur-venue'
				);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator',
					'Venue with these attributes is already assigned to another sur-venue'
				);
			});
		});

		context('invalid data (instance is the sur-most venue of a two-tiered venue collection)', () => {
			it('will call addPropertyError method', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isAssignedToSurVenue: false,
					isSurVenue: true,
					isSubjectVenueASubVenue: false
				});

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				sinonAssert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getSubVenueChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				});
				sinonAssert.calledTwice(instance.addPropertyError);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name',
					'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
				);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator',
					'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
				);
			});
		});

		context('invalid data (instance cannot be assigned to a two-tiered venue collection)', () => {
			it('will call addPropertyError method', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isAssignedToSurVenue: false,
					isSurVenue: false,
					isSubjectVenueASubVenue: true
				});

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				sinonAssert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getSubVenueChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				});
				sinonAssert.calledTwice(instance.addPropertyError);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name',
					'Sub-venue cannot be assigned to a two-tiered venue collection'
				);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator',
					'Sub-venue cannot be assigned to a two-tiered venue collection'
				);
			});
		});
	});
});

import esmock from 'esmock';
import { assert, restore, spy, stub } from 'sinon';

describe('SubVenue model', () => {

	let stubs;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(() => {

		stubs = {
			prepareAsParamsModule: {
				prepareAsParams: stub().returns({ name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' })
			},
			cypherQueriesModule: {
				validationQueries: {
					getSubVenueChecksQuery: stub().returns('getSubVenueChecksQuery response')
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
			'../../../src/models/SubVenue.js',
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
					isAssignedToSurVenue: false,
					isSurVenue: false,
					isSubjectVenueASubVenue: false
				});

				const SubVenue = await createSubject();

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.callOrder(
					stubs.prepareAsParamsModule.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				assert.calledOnceWithExactly(stubs.prepareAsParamsModule.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubVenueChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data (instance is already assigned to another sur-venue)', () => {

			it('will call addPropertyError method', async () => {

				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isAssignedToSurVenue: true,
					isSurVenue: false,
					isSubjectVenueASubVenue: false
				});

				const SubVenue = await createSubject();

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.callOrder(
					stubs.prepareAsParamsModule.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParamsModule.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubVenueChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Venue with these attributes is already assigned to another sur-venue'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Venue with these attributes is already assigned to another sur-venue'
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

				const SubVenue = await createSubject();

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.callOrder(
					stubs.prepareAsParamsModule.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParamsModule.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubVenueChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Venue with these attributes is the sur-most venue of a two-tiered venue collection'
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

				const SubVenue = await createSubject();

				const instance = new SubVenue({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				assert.callOrder(
					stubs.prepareAsParamsModule.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				assert.calledOnceWithExactly(stubs.prepareAsParamsModule.prepareAsParams, instance);
				assert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSubVenueChecksQuery);
				assert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSubVenueChecksQuery response',
						params: {
							name: 'NAME_VALUE',
							differentiator: 'DIFFERENTIATOR_VALUE',
							subjectVenueUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						}
					}
				);
				assert.calledTwice(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name', 'Sub-venue cannot be assigned to a two-tiered venue collection'
				);
				assert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator', 'Sub-venue cannot be assigned to a two-tiered venue collection'
				);

			});

		});

	});

});

import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, spy, stub } from 'sinon';

const context = describe;

describe('SurPlace model', () => {
	let stubs;
	let SurPlace;

	const neo4jQueryMockResponse = { neo4jQueryMockResponseProperty: 'neo4jQueryMockResponseValue' };

	beforeEach(async () => {
		stubs = {
			prepareAsParams: stub().returns({ name: 'NAME_VALUE', differentiator: 'DIFFERENTIATOR_VALUE' }),
			cypherQueriesModule: {
				validationQueries: {
					getSurPlaceChecksQuery: stub().returns('getSurPlaceChecksQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: stub().resolves(neo4jQueryMockResponse)
			}
		};

		SurPlace = await esmock(
			'../../../src/models/SurPlace.js',
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
					isSubPlaceOfSubjectPlace: false
				});

				const instance = new SurPlace({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectPlaceUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				sinonAssert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSurPlaceChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery
				);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSurPlaceChecksQuery);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getSurPlaceChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectPlaceUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				});
				sinonAssert.notCalled(instance.addPropertyError);
			});
		});

		context('invalid data (sur-place is a descendent of instance)', () => {
			it('calls addPropertyError method', async () => {
				stubs.neo4jQueryModule.neo4jQuery.resolves({
					isSubPlaceOfSubjectPlace: true
				});

				const instance = new SurPlace({ name: 'NAME_VALUE', differentiator: '1' });

				spy(instance, 'addPropertyError');

				await instance.runDatabaseValidations({
					subjectPlaceUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				});

				sinonAssert.callOrder(
					stubs.prepareAsParams,
					stubs.cypherQueriesModule.validationQueries.getSurPlaceChecksQuery,
					stubs.neo4jQueryModule.neo4jQuery,
					instance.addPropertyError
				);
				sinonAssert.calledOnceWithExactly(stubs.prepareAsParams, instance);
				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.validationQueries.getSurPlaceChecksQuery);
				sinonAssert.calledOnceWithExactly(stubs.neo4jQueryModule.neo4jQuery, {
					query: 'getSurPlaceChecksQuery response',
					params: {
						name: 'NAME_VALUE',
						differentiator: 'DIFFERENTIATOR_VALUE',
						subjectPlaceUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				});
				sinonAssert.calledTwice(instance.addPropertyError);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.firstCall,
					'name',
					'Place with these attributes is a descendent of this place'
				);
				sinonAssert.calledWithExactly(
					instance.addPropertyError.secondCall,
					'differentiator',
					'Place with these attributes is a descendent of this place'
				);
			});
		});
	});
});

import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import httpMocks from 'node-mocks-http';
import { assert as sinonAssert, restore, stub } from 'sinon';

const context = describe;

describe('Search controller', () => {
	let stubs;
	let searchController;

	beforeEach(async () => {
		stubs = {
			sendJsonResponse: stub().returns('sendJsonResponse response'),
			cypherQueriesModule: {
				searchQueries: {
					getSearchQuery: stub().returns('getSearchQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: stub().returns(['foo bar'])
			},
			request: httpMocks.createRequest({ query: { searchTerm: 'foo' } }),
			response: httpMocks.createResponse(),
			next: stub()
		};

		searchController = await esmock('../../../src/controllers/search.js', {
			'../../../src/lib/send-json-response.js': stubs.sendJsonResponse,
			'../../../src/neo4j/cypher-queries/index.js': stubs.cypherQueriesModule,
			'../../../src/neo4j/query.js': stubs.neo4jQueryModule
		});
	});

	afterEach(() => {
		restore();
	});

	context('searchTerm is not present in request.query', () => {
		it('calls sendJsonResponse with the response object and an empty array; does not call neo4jQuery', async () => {
			const request = httpMocks.createRequest();
			const result = await searchController(request, stubs.response, stubs.next);

			sinonAssert.calledOnceWithExactly(stubs.sendJsonResponse, stubs.response, []);
			assert.strictEqual(result, 'sendJsonResponse response');
			sinonAssert.notCalled(stubs.neo4jQueryModule.neo4jQuery);
			sinonAssert.notCalled(stubs.cypherQueriesModule.searchQueries.getSearchQuery);
			sinonAssert.notCalled(stubs.next);
		});
	});

	context('searchTerm is present in request.query and is an empty string', () => {
		it('calls sendJsonResponse with the response object and an empty array; does not call neo4jQuery', async () => {
			const request = httpMocks.createRequest({ query: { searchTerm: '' } });
			const result = await searchController(request, stubs.response, stubs.next);

			sinonAssert.calledOnceWithExactly(stubs.sendJsonResponse, stubs.response, []);
			assert.strictEqual(result, 'sendJsonResponse response');
			sinonAssert.notCalled(stubs.neo4jQueryModule.neo4jQuery);
			sinonAssert.notCalled(stubs.cypherQueriesModule.searchQueries.getSearchQuery);
			sinonAssert.notCalled(stubs.next);
		});
	});

	context('searchTerm is present in request.query and is a non-empty string', () => {
		context('neo4jQuery responds as expected', () => {
			it('calls getSearchQuery, neo4jQuery, then sendJsonResponse with the response object and the neo4jQuery response', async () => {
				const result = await searchController(stubs.request, stubs.response, stubs.next);

				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.searchQueries.getSearchQuery);
				sinonAssert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSearchQuery response',
						params: {
							searchTerm: 'foo'
						}
					},
					{
						isOptionalResult: true,
						isArrayResult: true
					}
				);
				sinonAssert.calledOnceWithExactly(stubs.sendJsonResponse, stubs.response, ['foo bar']);
				assert.strictEqual(result, 'sendJsonResponse response');
				sinonAssert.notCalled(stubs.next);
			});
		});

		context('neo4jQuery throws an error', () => {
			it('calls getSearchQuery, neo4jQuery, then next with the error object', async () => {
				const neo4jQueryError = new Error('neo4jQuery error');
				stubs.neo4jQueryModule.neo4jQuery.rejects(neo4jQueryError);

				await searchController(stubs.request, stubs.response, stubs.next);

				sinonAssert.calledOnceWithExactly(stubs.cypherQueriesModule.searchQueries.getSearchQuery);
				sinonAssert.calledOnceWithExactly(
					stubs.neo4jQueryModule.neo4jQuery,
					{
						query: 'getSearchQuery response',
						params: {
							searchTerm: 'foo'
						}
					},
					{
						isOptionalResult: true,
						isArrayResult: true
					}
				);
				sinonAssert.notCalled(stubs.sendJsonResponse);
				sinonAssert.calledOnceWithExactly(stubs.next, neo4jQueryError);
			});
		});
	});
});

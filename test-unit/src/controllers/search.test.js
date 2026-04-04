import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import httpMocks from 'node-mocks-http';

const context = describe;

describe('Search controller', () => {
	let stubs;
	let searchController;
	let neo4jQueryError;

	beforeEach(async (test) => {
		neo4jQueryError = null;

		stubs = {
			sendJsonResponse: test.mock.fn(() => 'sendJsonResponse response'),
			cypherQueriesModule: {
				searchQueries: {
					getSearchQuery: test.mock.fn(() => 'getSearchQuery response')
				}
			},
			neo4jQueryModule: {
				neo4jQuery: test.mock.fn(async () => {
					if (neo4jQueryError) {
						throw neo4jQueryError;
					}

					return ['foo bar'];
				})
			},
			request: httpMocks.createRequest({ query: { searchTerm: 'foo' } }),
			response: httpMocks.createResponse(),
			next: test.mock.fn()
		};

		searchController = await esmock('../../../src/controllers/search.js', {
			'../../../src/lib/send-json-response.js': stubs.sendJsonResponse,
			'../../../src/neo4j/cypher-queries/index.js': stubs.cypherQueriesModule,
			'../../../src/neo4j/query.js': stubs.neo4jQueryModule
		});
	});

	context('searchTerm is not present in request.query', () => {
		it('calls sendJsonResponse with the response object and an empty array; does not call neo4jQuery', async () => {
			const request = httpMocks.createRequest();
			const result = await searchController(request, stubs.response, stubs.next);

			assert.strictEqual(stubs.sendJsonResponse.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.sendJsonResponse.mock.calls[0].arguments, [stubs.response, []]);
			assert.strictEqual(result, 'sendJsonResponse response');
			assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 0);
			assert.strictEqual(stubs.cypherQueriesModule.searchQueries.getSearchQuery.mock.calls.length, 0);
			assert.strictEqual(stubs.next.mock.calls.length, 0);
		});
	});

	context('searchTerm is present in request.query and is an empty string', () => {
		it('calls sendJsonResponse with the response object and an empty array; does not call neo4jQuery', async () => {
			const request = httpMocks.createRequest({ query: { searchTerm: '' } });
			const result = await searchController(request, stubs.response, stubs.next);

			assert.strictEqual(stubs.sendJsonResponse.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.sendJsonResponse.mock.calls[0].arguments, [stubs.response, []]);
			assert.strictEqual(result, 'sendJsonResponse response');
			assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 0);
			assert.strictEqual(stubs.cypherQueriesModule.searchQueries.getSearchQuery.mock.calls.length, 0);
			assert.strictEqual(stubs.next.mock.calls.length, 0);
		});
	});

	context('searchTerm is present in request.query and is a non-empty string', () => {
		context('neo4jQuery responds as expected', () => {
			it('calls getSearchQuery, neo4jQuery, then sendJsonResponse with the response object and the neo4jQuery response', async () => {
				const result = await searchController(stubs.request, stubs.response, stubs.next);

				assert.strictEqual(stubs.cypherQueriesModule.searchQueries.getSearchQuery.mock.calls.length, 1);
				assert.deepStrictEqual(
					stubs.cypherQueriesModule.searchQueries.getSearchQuery.mock.calls[0].arguments,
					[]
				);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [
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
				]);
				assert.strictEqual(stubs.sendJsonResponse.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.sendJsonResponse.mock.calls[0].arguments, [stubs.response, ['foo bar']]);
				assert.strictEqual(result, 'sendJsonResponse response');
				assert.strictEqual(stubs.next.mock.calls.length, 0);
			});
		});

		context('neo4jQuery throws an error', () => {
			it('calls getSearchQuery, neo4jQuery, then next with the error object', async () => {
				neo4jQueryError = new Error('neo4jQuery error');

				await searchController(stubs.request, stubs.response, stubs.next);

				assert.strictEqual(stubs.cypherQueriesModule.searchQueries.getSearchQuery.mock.calls.length, 1);
				assert.deepStrictEqual(
					stubs.cypherQueriesModule.searchQueries.getSearchQuery.mock.calls[0].arguments,
					[]
				);
				assert.strictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.neo4jQueryModule.neo4jQuery.mock.calls[0].arguments, [
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
				]);
				assert.strictEqual(stubs.sendJsonResponse.mock.calls.length, 0);
				assert.strictEqual(stubs.next.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.next.mock.calls[0].arguments, [neo4jQueryError]);
			});
		});
	});
});

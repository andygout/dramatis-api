import { expect } from 'chai';
import httpMocks from 'node-mocks-http';
import { assert, createSandbox } from 'sinon';

import searchController from '../../../src/controllers/search';
import * as sendJsonResponseModule from '../../../src/lib/send-json-response';
import * as cypherQueries from '../../../src/neo4j/cypher-queries';
import * as neo4jQueryModule from '../../../src/neo4j/query';

describe('Search controller', () => {

	let stubs;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			sendJsonResponse:
				sandbox.stub(sendJsonResponseModule, 'sendJsonResponse').returns('sendJsonResponse response'),
			getSearchQuery:
				sandbox.stub(cypherQueries.searchQueries, 'getSearchQuery').returns('getSearchQuery response'),
			neo4jQuery: sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves(['foo bar']),
			request: httpMocks.createRequest({ query: { searchTerm: 'foo' } }),
			response: httpMocks.createResponse(),
			next: sandbox.stub()
		};

	});

	afterEach(() => {

		sandbox.restore();

	});

	context('searchTerm is not present in request.query', () => {

		it('calls sendJsonResponse with the response object and an empty array; does not call neo4jQuery', async () => {

			const request = httpMocks.createRequest();
			const result = await searchController(request, stubs.response, stubs.next);
			assert.calledOnce(stubs.sendJsonResponse);
			assert.calledWithExactly(
				stubs.sendJsonResponse,
				stubs.response, []
			);
			expect(result).to.equal('sendJsonResponse response');
			assert.notCalled(stubs.neo4jQuery);
			assert.notCalled(stubs.getSearchQuery);
			assert.notCalled(stubs.next);

		});

	});

	context('searchTerm is present in request.query and is an empty string', () => {

		it('calls sendJsonResponse with the response object and an empty array; does not call neo4jQuery', async () => {

			const request = httpMocks.createRequest({ query: { searchTerm: '' } });
			const result = await searchController(request, stubs.response, stubs.next);
			assert.calledOnce(stubs.sendJsonResponse);
			assert.calledWithExactly(
				stubs.sendJsonResponse,
				stubs.response, []
			);
			expect(result).to.equal('sendJsonResponse response');
			assert.notCalled(stubs.neo4jQuery);
			assert.notCalled(stubs.getSearchQuery);
			assert.notCalled(stubs.next);

		});

	});

	context('searchTerm is present in request.query and is a non-empty string', () => {

		context('neo4jQuery responds as expected', () => {

			it('calls getSearchQuery, neo4jQuery, then sendJsonResponse with the response object and the neo4jQuery response', async () => {

				const result = await searchController(stubs.request, stubs.response, stubs.next);
				assert.calledOnce(stubs.getSearchQuery);
				assert.calledWithExactly(stubs.getSearchQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
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
				assert.calledOnce(stubs.sendJsonResponse);
				assert.calledWithExactly(
					stubs.sendJsonResponse,
					stubs.response, ['foo bar']
				);
				expect(result).to.equal('sendJsonResponse response');
				assert.notCalled(stubs.next);

			});

		});

		context('neo4jQuery throws an error', () => {

			it('calls getSearchQuery, neo4jQuery, then next with the error object', async () => {

				const neo4jQueryError = new Error('neo4jQuery error');
				stubs.neo4jQuery.rejects(neo4jQueryError);
				
				await searchController(stubs.request, stubs.response, stubs.next);
				assert.calledOnce(stubs.getSearchQuery);
				assert.calledWithExactly(stubs.getSearchQuery);
				assert.calledOnce(stubs.neo4jQuery);
				assert.calledWithExactly(
					stubs.neo4jQuery,
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
				assert.notCalled(stubs.sendJsonResponse);
				assert.calledOnce(stubs.next);
				assert.calledWithExactly(stubs.next, neo4jQueryError);

			});

		});

	});

});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import httpMocks from 'node-mocks-http';

import sendJsonResponse from '../../../src/lib/send-json-response.js';

describe('Send JSON Response module', () => {
	it('renders form page with requisite data', () => {
		const response = httpMocks.createResponse();

		sendJsonResponse(response, { instanceProperty: 'instanceValue' });

		assert.equal(response.statusCode, 200);
		assert.deepEqual(response._getHeaders(), { 'content-type': 'application/json' }); // eslint-disable-line no-underscore-dangle
		assert.equal(response._getData(), '{"instanceProperty":"instanceValue"}'); // eslint-disable-line no-underscore-dangle
	});
});

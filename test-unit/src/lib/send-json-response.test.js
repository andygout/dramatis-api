import { expect } from 'chai';
import httpMocks from 'node-mocks-http';

import { sendJsonResponse } from '../../../src/lib/send-json-response';

describe('Send JSON Response module', () => {

	it('renders form page with requisite data', () => {

		const response = httpMocks.createResponse();
		sendJsonResponse(response, { instanceProperty: 'instanceValue' });
		expect(response.statusCode).to.equal(200);
		expect(response._getHeaders()).to.deep.eq({ 'content-type': 'application/json' });
		expect(response._getData()).to.equal('{"instanceProperty":"instanceValue"}');

	});

});

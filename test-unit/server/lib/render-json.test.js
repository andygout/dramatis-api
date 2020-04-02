import { expect } from 'chai';
import httpMocks from 'node-mocks-http';

import { renderJson } from '../../../server/lib/render-json';

describe('Render JSON module', () => {

	it('renders form page with requisite data', () => {

		const response = httpMocks.createResponse();
		renderJson(response, { instanceProperty: 'instanceValue' });
		expect(response.statusCode).to.eq(200);
		expect(response._getHeaders()).to.deep.eq({ 'content-type': 'application/json' });
		expect(response._getData()).to.eq('{"instanceProperty":"instanceValue"}');

	});

});

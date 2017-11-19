import { expect } from 'chai';
import httpMocks from 'node-mocks-http';

import subject from '../../../server/lib/render-json';

describe('Render JSON module', () => {

	it('will render form page with requisite data', () => {

		const res = httpMocks.createResponse();
		subject(res, { instanceProperty: 'instanceValue' });
		expect(res.statusCode).to.eq(200);
		expect(res._getHeaders()).to.deep.eq({ 'Content-Type': 'application/json' });
		expect(res._getData()).to.eq('{"instanceProperty":"instanceValue"}');

	});

});

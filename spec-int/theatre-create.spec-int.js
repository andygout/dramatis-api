import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server/app';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Create Theatre API endpoint', () => {

	it('creates theatre', async () => {

		const response = await chai.request(app)
			.post('/theatres')
			.send({ name: 'National Theatre' })

		expect(response).to.have.status(200);
		expect(response.body).to.have.property('model').that.equals('theatre');
		expect(response.body).to.have.property('name').that.equals('National Theatre');
		expect(response.body).to.have.property('uuid');

	});

});

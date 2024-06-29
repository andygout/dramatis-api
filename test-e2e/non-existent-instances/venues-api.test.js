import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';

chai.use(chaiHttp);

describe('Non-existent instances: Venues API', () => {

	before(async () => {

		await purgeDatabase();

	});

	describe('requests for instances that do not exist in database', () => {

		const NON_EXISTENT_VENUE_UUID = 'foobar';

		describe('GET edit endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/venues/${NON_EXISTENT_VENUE_UUID}/edit`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('PUT update endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.put(`/venues/${NON_EXISTENT_VENUE_UUID}`)
					.send({ name: 'Almeida Theatre' });

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('GET show endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/venues/${NON_EXISTENT_VENUE_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('DELETE delete endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.delete(`/venues/${NON_EXISTENT_VENUE_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

	});

});

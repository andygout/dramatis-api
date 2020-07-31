import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Non-existent instances: Productions API', () => {

	chai.use(chaiHttp);

	before(async () => {

		await purgeDatabase();

	});

	describe('requests for instances that do not exist in database', () => {

		const NON_EXISTENT_PRODUCTION_UUID = 'foobar';

		describe('GET edit endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/productions/${NON_EXISTENT_PRODUCTION_UUID}/edit`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('PUT update endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.put(`/productions/${NON_EXISTENT_PRODUCTION_UUID}`)
					.send({
						name: 'The Tempest',
						theatre: {
							name: 'Novello Theatre'
						}
					});

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('GET show endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/productions/${NON_EXISTENT_PRODUCTION_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('DELETE delete endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.delete(`/productions/${NON_EXISTENT_PRODUCTION_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

	});

});

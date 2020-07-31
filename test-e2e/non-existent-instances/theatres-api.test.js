import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Non-existent instances: Theatres API', () => {

	chai.use(chaiHttp);

	before(async () => {

		await purgeDatabase();

	});

	describe('requests for instances that do not exist in database', () => {

		const NON_EXISTENT_THEATRE_UUID = 'foobar';

		describe('GET edit endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/theatres/${NON_EXISTENT_THEATRE_UUID}/edit`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('PUT update endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.put(`/theatres/${NON_EXISTENT_THEATRE_UUID}`)
					.send({ name: 'Almeida Theatre' });

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('GET show endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/theatres/${NON_EXISTENT_THEATRE_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('DELETE delete endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.delete(`/theatres/${NON_EXISTENT_THEATRE_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

	});

});

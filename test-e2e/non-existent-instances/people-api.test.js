import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';

import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';

const { expect } = chai;

chai.use(chaiHttp);

describe('Non-existent instances: People API', () => {

	before(async () => {

		await purgeDatabase();

	});

	describe('requests for instances that do not exist in database', () => {

		const NON_EXISTENT_PERSON_UUID = 'foobar';

		describe('GET edit endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await request.execute(app)
					.get(`/people/${NON_EXISTENT_PERSON_UUID}/edit`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('PUT update endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await request.execute(app)
					.put(`/people/${NON_EXISTENT_PERSON_UUID}`)
					.send({ name: 'Patrick Stewart' });

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('GET show endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await request.execute(app)
					.get(`/people/${NON_EXISTENT_PERSON_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('DELETE delete endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await request.execute(app)
					.delete(`/people/${NON_EXISTENT_PERSON_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

	});

});

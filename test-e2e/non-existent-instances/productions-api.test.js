import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('Non-existent instances: Productions API', () => {
	before(async () => {
		await purgeDatabase();
	});

	describe('requests for instances that do not exist in database', () => {
		const NON_EXISTENT_PRODUCTION_UUID = 'foobar';

		describe('GET edit endpoint', () => {
			it('responds with 404 Not Found error', async () => {
				const response = await request(app).get(`/productions/${NON_EXISTENT_PRODUCTION_UUID}/edit`);

				assert.equal(response.status, 404);
				assert.equal(response.text, 'Not Found');
			});
		});

		describe('PUT update endpoint', () => {
			it('responds with 404 Not Found error', async () => {
				const response = await request(app).put(`/productions/${NON_EXISTENT_PRODUCTION_UUID}`).send({
					name: 'The Tempest'
				});

				assert.equal(response.status, 404);
				assert.equal(response.text, 'Not Found');
			});
		});

		describe('GET show endpoint', () => {
			it('responds with 404 Not Found error', async () => {
				const response = await request(app).get(`/productions/${NON_EXISTENT_PRODUCTION_UUID}`);

				assert.equal(response.status, 404);
				assert.equal(response.text, 'Not Found');
			});
		});

		describe('DELETE delete endpoint', () => {
			it('responds with 404 Not Found error', async () => {
				const response = await request(app).delete(`/productions/${NON_EXISTENT_PRODUCTION_UUID}`);

				assert.equal(response.status, 404);
				assert.equal(response.text, 'Not Found');
			});
		});
	});
});

import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('Non-existent instances: Award ceremonies API', () => {
	before(async () => {
		await purgeDatabase();
	});

	describe('requests for instances that do not exist in database', () => {
		const NON_EXISTENT_AWARD_CEREMONY_UUID = 'foobar';

		describe('GET edit endpoint', () => {
			it('responds with 404 Not Found error', async () => {
				const response = await request(app).get(`/award-ceremonies/${NON_EXISTENT_AWARD_CEREMONY_UUID}/edit`);

				assert.equal(response.status, 404);
				assert.equal(response.text, 'Not Found');
			});
		});

		describe('PUT update endpoint', () => {
			it('responds with 404 Not Found error', async () => {
				const response = await request(app)
					.put(`/award-ceremonies/${NON_EXISTENT_AWARD_CEREMONY_UUID}`)
					.send({ name: '2020' });

				assert.equal(response.status, 404);
				assert.equal(response.text, 'Not Found');
			});
		});

		describe('GET show endpoint', () => {
			it('responds with 404 Not Found error', async () => {
				const response = await request(app).get(`/award-ceremonies/${NON_EXISTENT_AWARD_CEREMONY_UUID}`);

				assert.equal(response.status, 404);
				assert.equal(response.text, 'Not Found');
			});
		});

		describe('DELETE delete endpoint', () => {
			it('responds with 404 Not Found error', async () => {
				const response = await request(app).delete(`/award-ceremonies/${NON_EXISTENT_AWARD_CEREMONY_UUID}`);

				assert.equal(response.status, 404);
				assert.equal(response.text, 'Not Found');
			});
		});
	});
});

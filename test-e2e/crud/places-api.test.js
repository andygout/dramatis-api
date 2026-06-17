import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('CRUD (Create, Read, Update, Delete): Places API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new place', async () => {
			const response = await request(app).get('/places/new');

			const expectedResponseBody = {
				model: 'PLACE',
				name: '',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD', () => {
		const PLACE_UUID = 'KNIGHTSBRIDGE_PLACE_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 0);

			const response = await request(app).post('/places').send({
				name: 'Knightsbridge'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 1);
		});

		it('gets data required to edit specific place', async () => {
			const response = await request(app).get(`/places/${PLACE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app).put(`/places/${PLACE_UUID}`).send({
				name: '1963'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: '1963',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 1);
		});

		it('shows place', async () => {
			const response = await request(app).get(`/places/${PLACE_UUID}`);

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: '1963',
				differentiator: null
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app).delete(`/places/${PLACE_UUID}`);

			const expectedResponseBody = {
				model: 'PLACE',
				name: '1963',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 0);
		});
	});

	describe('GET list endpoint', () => {
		const DERBYSHIRE_PLACE_UUID = 'DERBYSHIRE_PLACE_UUID';
		const KNIGHTSBRIDGE_PLACE_UUID = 'KNIGHTSBRIDGE_PLACE_UUID';
		const CONSTANTINOPLE_PLACE_UUID = 'CONSTANTINOPLE_PLACE_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/places').send({
				name: 'Derbyshire'
			});

			await request(app).post('/places').send({
				name: 'Knightsbridge'
			});

			await request(app).post('/places').send({
				name: 'Constantinople'
			});
		});

		it('lists all places ordered by name', async () => {
			const response = await request(app).get('/places');

			const expectedResponseBody = [
				{
					model: 'PLACE',
					uuid: CONSTANTINOPLE_PLACE_UUID,
					name: 'Constantinople'
				},
				{
					model: 'PLACE',
					uuid: DERBYSHIRE_PLACE_UUID,
					name: 'Derbyshire'
				},
				{
					model: 'PLACE',
					uuid: KNIGHTSBRIDGE_PLACE_UUID,
					name: 'Knightsbridge'
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

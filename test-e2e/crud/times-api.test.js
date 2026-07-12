import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('CRUD (Create, Read, Update, Delete): Times API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new time', async () => {
			const response = await request(app).get('/times/new');

			const expectedResponseBody = {
				model: 'TIME',
				name: '',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD', () => {
		const TIME_UUID = '1962_TIME_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates time', async () => {
			assert.equal(await countNodesWithLabel('Time'), 0);

			const response = await request(app).post('/times').send({
				name: '1962'
			});

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1962',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Time'), 1);
		});

		it('gets data required to edit specific time', async () => {
			const response = await request(app).get(`/times/${TIME_UUID}/edit`);

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1962',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates time', async () => {
			assert.equal(await countNodesWithLabel('Time'), 1);

			const response = await request(app).put(`/times/${TIME_UUID}`).send({
				name: '1963'
			});

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1963',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Time'), 1);
		});

		it('shows time', async () => {
			const response = await request(app).get(`/times/${TIME_UUID}`);

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1963',
				differentiator: null,
				materials: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes time', async () => {
			assert.equal(await countNodesWithLabel('Time'), 1);

			const response = await request(app).delete(`/times/${TIME_UUID}`);

			const expectedResponseBody = {
				model: 'TIME',
				name: '1963',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Time'), 0);
		});
	});

	describe('GET list endpoint', () => {
		const EIGHTEEN_ZERO_NINE_TIME_UUID = '1809_TIME_UUID';
		const NINETEEN_SIXTY_TWO_TIME_UUID = '1962_TIME_UUID';
		const THREE_HUNDRED_AND_FIFTY_ONE_TIME_UUID = '351_TIME_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/times').send({
				name: '351'
			});

			await request(app).post('/times').send({
				name: '1809'
			});

			await request(app).post('/times').send({
				name: '1962'
			});
		});

		it('lists all times ordered by name', async () => {
			const response = await request(app).get('/times');

			const expectedResponseBody = [
				{
					model: 'TIME',
					uuid: EIGHTEEN_ZERO_NINE_TIME_UUID,
					name: '1809'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_TWO_TIME_UUID,
					name: '1962'
				},
				{
					model: 'TIME',
					uuid: THREE_HUNDRED_AND_FIFTY_ONE_TIME_UUID,
					name: '351'
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

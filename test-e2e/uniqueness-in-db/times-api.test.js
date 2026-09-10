import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

const TIME_1_UUID = '2';
const TIME_2_UUID = '5';

describe('Uniqueness in database: Times API', () => {
	before(async () => {
		stubUuidCounterClient.setValueToZero();

		await purgeDatabase();
	});

	after(() => {
		stubUuidCounterClient.setValueToUndefined();
	});

	it('creates time without differentiator', async () => {
		assert.equal(await countNodesWithLabel('Time'), 0);

		const response = await request(app).post('/times').send({
			name: 'Renaissance'
		});

		const expectedResponseBody = {
			model: 'TIME',
			uuid: TIME_1_UUID,
			name: 'Renaissance',
			differentiator: '',
			fromDate: '',
			toDate: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Time'), 1);
	});

	it('responds with errors if trying to create existing time that does also not have differentiator', async () => {
		assert.equal(await countNodesWithLabel('Time'), 1);

		const response = await request(app).post('/times').send({
			name: 'Renaissance'
		});

		const expectedResponseBody = {
			model: 'TIME',
			name: 'Renaissance',
			differentiator: '',
			fromDate: '',
			toDate: '',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Time'), 1);
	});

	it('creates time with same name as existing time but uses a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Time'), 1);

		const response = await request(app).post('/times').send({
			name: 'Renaissance',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'TIME',
			uuid: TIME_2_UUID,
			name: 'Renaissance',
			differentiator: '1',
			fromDate: '',
			toDate: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Time'), 2);
	});

	it('responds with errors if trying to update time to one with same name and differentiator combination', async () => {
		assert.equal(await countNodesWithLabel('Time'), 2);

		const response = await request(app).put(`/times/${TIME_1_UUID}`).send({
			name: 'Renaissance',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'TIME',
			uuid: TIME_1_UUID,
			name: 'Renaissance',
			differentiator: '1',
			fromDate: '',
			toDate: '',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Time'), 2);
	});

	it('updates time with same name as existing time but uses a different differentiator', async () => {
		assert.equal(await countNodesWithLabel('Time'), 2);

		const response = await request(app).put(`/times/${TIME_1_UUID}`).send({
			name: 'Renaissance',
			differentiator: '2'
		});

		const expectedResponseBody = {
			model: 'TIME',
			uuid: TIME_1_UUID,
			name: 'Renaissance',
			differentiator: '2',
			fromDate: '',
			toDate: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Time'), 2);
	});

	it('updates time with same name as existing time but without a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Time'), 2);

		const response = await request(app).put(`/times/${TIME_2_UUID}`).send({
			name: 'Renaissance'
		});

		const expectedResponseBody = {
			model: 'TIME',
			uuid: TIME_2_UUID,
			name: 'Renaissance',
			differentiator: '',
			fromDate: '',
			toDate: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Time'), 2);
	});
});

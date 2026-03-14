import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';

const CHARACTER_1_UUID = '2';
const CHARACTER_2_UUID = '5';

describe('Uniqueness in database: Characters API', () => {
	before(async () => {
		stubUuidCounterClient.setValueToZero();

		await purgeDatabase();
	});

	after(() => {
		stubUuidCounterClient.setValueToUndefined();
	});

	it('creates character without differentiator', async () => {
		assert.equal(await countNodesWithLabel('Character'), 0);

		const response = await request(app).post('/characters').send({
			name: 'Demetrius'
		});

		const expectedResponseBody = {
			model: 'CHARACTER',
			uuid: CHARACTER_1_UUID,
			name: 'Demetrius',
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Character'), 1);
	});

	it('responds with errors if trying to create existing character that does also not have differentiator', async () => {
		assert.equal(await countNodesWithLabel('Character'), 1);

		const response = await request(app).post('/characters').send({
			name: 'Demetrius'
		});

		const expectedResponseBody = {
			model: 'CHARACTER',
			name: 'Demetrius',
			differentiator: '',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Character'), 1);
	});

	it('creates character with same name as existing character but uses a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Character'), 1);

		const response = await request(app).post('/characters').send({
			name: 'Demetrius',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'CHARACTER',
			uuid: CHARACTER_2_UUID,
			name: 'Demetrius',
			differentiator: '1',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Character'), 2);
	});

	it('responds with errors if trying to update character to one with same name and differentiator combination', async () => {
		assert.equal(await countNodesWithLabel('Character'), 2);

		const response = await request(app).put(`/characters/${CHARACTER_1_UUID}`).send({
			name: 'Demetrius',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'CHARACTER',
			uuid: CHARACTER_1_UUID,
			name: 'Demetrius',
			differentiator: '1',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Character'), 2);
	});

	it('updates character with same name as existing character but uses a different differentiator', async () => {
		assert.equal(await countNodesWithLabel('Character'), 2);

		const response = await request(app).put(`/characters/${CHARACTER_1_UUID}`).send({
			name: 'Demetrius',
			differentiator: '2'
		});

		const expectedResponseBody = {
			model: 'CHARACTER',
			uuid: CHARACTER_1_UUID,
			name: 'Demetrius',
			differentiator: '2',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Character'), 2);
	});

	it('updates character with same name as existing character but without a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Character'), 2);

		const response = await request(app).put(`/characters/${CHARACTER_2_UUID}`).send({
			name: 'Demetrius'
		});

		const expectedResponseBody = {
			model: 'CHARACTER',
			uuid: CHARACTER_2_UUID,
			name: 'Demetrius',
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Character'), 2);
	});
});

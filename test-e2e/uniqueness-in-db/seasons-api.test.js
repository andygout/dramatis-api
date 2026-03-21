import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

const SEASON_1_UUID = '2';
const SEASON_2_UUID = '5';

describe('Uniqueness in database: Seasons API', () => {
	before(async () => {
		stubUuidCounterClient.setValueToZero();

		await purgeDatabase();
	});

	after(() => {
		stubUuidCounterClient.setValueToUndefined();
	});

	it('creates season without differentiator', async () => {
		assert.equal(await countNodesWithLabel('Season'), 0);

		const response = await request(app).post('/seasons').send({
			name: 'Donmar in the West End'
		});

		const expectedResponseBody = {
			model: 'SEASON',
			uuid: SEASON_1_UUID,
			name: 'Donmar in the West End',
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Season'), 1);
	});

	it('responds with errors if trying to create existing season that does also not have differentiator', async () => {
		assert.equal(await countNodesWithLabel('Season'), 1);

		const response = await request(app).post('/seasons').send({
			name: 'Donmar in the West End'
		});

		const expectedResponseBody = {
			model: 'SEASON',
			name: 'Donmar in the West End',
			differentiator: '',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Season'), 1);
	});

	it('creates season with same name as existing season but uses a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Season'), 1);

		const response = await request(app).post('/seasons').send({
			name: 'Donmar in the West End',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'SEASON',
			uuid: SEASON_2_UUID,
			name: 'Donmar in the West End',
			differentiator: '1',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Season'), 2);
	});

	it('responds with errors if trying to update season to one with same name and differentiator combination', async () => {
		assert.equal(await countNodesWithLabel('Season'), 2);

		const response = await request(app).put(`/seasons/${SEASON_1_UUID}`).send({
			name: 'Donmar in the West End',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'SEASON',
			uuid: SEASON_1_UUID,
			name: 'Donmar in the West End',
			differentiator: '1',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Season'), 2);
	});

	it('updates season with same name as existing season but uses a different differentiator', async () => {
		assert.equal(await countNodesWithLabel('Season'), 2);

		const response = await request(app).put(`/seasons/${SEASON_1_UUID}`).send({
			name: 'Donmar in the West End',
			differentiator: '2'
		});

		const expectedResponseBody = {
			model: 'SEASON',
			uuid: SEASON_1_UUID,
			name: 'Donmar in the West End',
			differentiator: '2',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Season'), 2);
	});

	it('updates season with same name as existing season but without a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Season'), 2);

		const response = await request(app).put(`/seasons/${SEASON_2_UUID}`).send({
			name: 'Donmar in the West End'
		});

		const expectedResponseBody = {
			model: 'SEASON',
			uuid: SEASON_2_UUID,
			name: 'Donmar in the West End',
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Season'), 2);
	});
});

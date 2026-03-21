import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

const AWARD_1_UUID = '2';
const AWARD_2_UUID = '5';

describe('Uniqueness in database: Awards API', () => {
	before(async () => {
		stubUuidCounterClient.setValueToZero();

		await purgeDatabase();
	});

	after(() => {
		stubUuidCounterClient.setValueToUndefined();
	});

	it('creates award without differentiator', async () => {
		assert.equal(await countNodesWithLabel('Award'), 0);

		const response = await request(app).post('/awards').send({
			name: "Critics' Circle Theatre Awards"
		});

		const expectedResponseBody = {
			model: 'AWARD',
			uuid: AWARD_1_UUID,
			name: "Critics' Circle Theatre Awards",
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Award'), 1);
	});

	it('responds with errors if trying to create existing award that does also not have differentiator', async () => {
		assert.equal(await countNodesWithLabel('Award'), 1);

		const response = await request(app).post('/awards').send({
			name: "Critics' Circle Theatre Awards"
		});

		const expectedResponseBody = {
			model: 'AWARD',
			name: "Critics' Circle Theatre Awards",
			differentiator: '',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Award'), 1);
	});

	it('creates award with same name as existing award but uses a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Award'), 1);

		const response = await request(app).post('/awards').send({
			name: "Critics' Circle Theatre Awards",
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'AWARD',
			uuid: AWARD_2_UUID,
			name: "Critics' Circle Theatre Awards",
			differentiator: '1',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Award'), 2);
	});

	it('responds with errors if trying to update award to one with same name and differentiator combination', async () => {
		assert.equal(await countNodesWithLabel('Award'), 2);

		const response = await request(app).put(`/awards/${AWARD_1_UUID}`).send({
			name: "Critics' Circle Theatre Awards",
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'AWARD',
			uuid: AWARD_1_UUID,
			name: "Critics' Circle Theatre Awards",
			differentiator: '1',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Award'), 2);
	});

	it('updates award with same name as existing award but uses a different differentiator', async () => {
		assert.equal(await countNodesWithLabel('Award'), 2);

		const response = await request(app).put(`/awards/${AWARD_1_UUID}`).send({
			name: "Critics' Circle Theatre Awards",
			differentiator: '2'
		});

		const expectedResponseBody = {
			model: 'AWARD',
			uuid: AWARD_1_UUID,
			name: "Critics' Circle Theatre Awards",
			differentiator: '2',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Award'), 2);
	});

	it('updates award with same name as existing award but without a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Award'), 2);

		const response = await request(app).put(`/awards/${AWARD_2_UUID}`).send({
			name: "Critics' Circle Theatre Awards"
		});

		const expectedResponseBody = {
			model: 'AWARD',
			uuid: AWARD_2_UUID,
			name: "Critics' Circle Theatre Awards",
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Award'), 2);
	});
});

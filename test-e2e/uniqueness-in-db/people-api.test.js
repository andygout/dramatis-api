import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

const PERSON_1_UUID = '2';
const PERSON_2_UUID = '5';

describe('Uniqueness in database: People API', () => {
	before(async () => {
		stubUuidCounterClient.setValueToZero();

		await purgeDatabase();
	});

	after(() => {
		stubUuidCounterClient.setValueToUndefined();
	});

	it('creates person without differentiator', async () => {
		assert.equal(await countNodesWithLabel('Person'), 0);

		const response = await request(app).post('/people').send({
			name: 'Paul Higgins'
		});

		const expectedResponseBody = {
			model: 'PERSON',
			uuid: PERSON_1_UUID,
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Person'), 1);
	});

	it('responds with errors if trying to create existing person that does also not have differentiator', async () => {
		assert.equal(await countNodesWithLabel('Person'), 1);

		const response = await request(app).post('/people').send({
			name: 'Paul Higgins'
		});

		const expectedResponseBody = {
			model: 'PERSON',
			name: 'Paul Higgins',
			differentiator: '',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Person'), 1);
	});

	it('creates person with same name as existing person but uses a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Person'), 1);

		const response = await request(app).post('/people').send({
			name: 'Paul Higgins',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'PERSON',
			uuid: PERSON_2_UUID,
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Person'), 2);
	});

	it('responds with errors if trying to update person to one with same name and differentiator combination', async () => {
		assert.equal(await countNodesWithLabel('Person'), 2);

		const response = await request(app).put(`/people/${PERSON_1_UUID}`).send({
			name: 'Paul Higgins',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'PERSON',
			uuid: PERSON_1_UUID,
			name: 'Paul Higgins',
			differentiator: '1',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Person'), 2);
	});

	it('updates person with same name as existing person but uses a different differentiator', async () => {
		assert.equal(await countNodesWithLabel('Person'), 2);

		const response = await request(app).put(`/people/${PERSON_1_UUID}`).send({
			name: 'Paul Higgins',
			differentiator: '2'
		});

		const expectedResponseBody = {
			model: 'PERSON',
			uuid: PERSON_1_UUID,
			name: 'Paul Higgins',
			differentiator: '2',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Person'), 2);
	});

	it('updates person with same name as existing person but without a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Person'), 2);

		const response = await request(app).put(`/people/${PERSON_2_UUID}`).send({
			name: 'Paul Higgins'
		});

		const expectedResponseBody = {
			model: 'PERSON',
			uuid: PERSON_2_UUID,
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Person'), 2);
	});
});

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

const LOCALE_1_UUID = '2';
const LOCALE_2_UUID = '5';

describe('Uniqueness in database: Locales API', () => {
	before(async () => {
		stubUuidCounterClient.setValueToZero();

		await purgeDatabase();
	});

	after(() => {
		stubUuidCounterClient.setValueToUndefined();
	});

	it('creates locale without differentiator', async () => {
		assert.equal(await countNodesWithLabel('Locale'), 0);

		const response = await request(app).post('/locales').send({
			name: 'Bank'
		});

		const expectedResponseBody = {
			model: 'LOCALE',
			uuid: LOCALE_1_UUID,
			name: 'Bank',
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Locale'), 1);
	});

	it('responds with errors if trying to create existing locale that does also not have differentiator', async () => {
		assert.equal(await countNodesWithLabel('Locale'), 1);

		const response = await request(app).post('/locales').send({
			name: 'Bank'
		});

		const expectedResponseBody = {
			model: 'LOCALE',
			name: 'Bank',
			differentiator: '',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Locale'), 1);
	});

	it('creates locale with same name as existing locale but uses a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Locale'), 1);

		const response = await request(app).post('/locales').send({
			name: 'Bank',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'LOCALE',
			uuid: LOCALE_2_UUID,
			name: 'Bank',
			differentiator: '1',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Locale'), 2);
	});

	it('responds with errors if trying to update locale to one with same name and differentiator combination', async () => {
		assert.equal(await countNodesWithLabel('Locale'), 2);

		const response = await request(app).put(`/locales/${LOCALE_1_UUID}`).send({
			name: 'Bank',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'LOCALE',
			uuid: LOCALE_1_UUID,
			name: 'Bank',
			differentiator: '1',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Locale'), 2);
	});

	it('updates locale with same name as existing locale but uses a different differentiator', async () => {
		assert.equal(await countNodesWithLabel('Locale'), 2);

		const response = await request(app).put(`/locales/${LOCALE_1_UUID}`).send({
			name: 'Bank',
			differentiator: '2'
		});

		const expectedResponseBody = {
			model: 'LOCALE',
			uuid: LOCALE_1_UUID,
			name: 'Bank',
			differentiator: '2',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Locale'), 2);
	});

	it('updates locale with same name as existing locale but without a differentiator', async () => {
		assert.equal(await countNodesWithLabel('Locale'), 2);

		const response = await request(app).put(`/locales/${LOCALE_2_UUID}`).send({
			name: 'Bank'
		});

		const expectedResponseBody = {
			model: 'LOCALE',
			uuid: LOCALE_2_UUID,
			name: 'Bank',
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('Locale'), 2);
	});
});

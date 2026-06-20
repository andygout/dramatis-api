import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('CRUD (Create, Read, Update, Delete): Locales API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new locale', async () => {
			const response = await request(app).get('/locales/new');

			const expectedResponseBody = {
				model: 'LOCALE',
				name: '',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD', () => {
		const LOCALE_UUID = 'HILLSIDE_LOCALE_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates locale', async () => {
			assert.equal(await countNodesWithLabel('Locale'), 0);

			const response = await request(app).post('/locales').send({
				name: 'Hillside'
			});

			const expectedResponseBody = {
				model: 'LOCALE',
				uuid: LOCALE_UUID,
				name: 'Hillside',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Locale'), 1);
		});

		it('gets data required to edit specific locale', async () => {
			const response = await request(app).get(`/locales/${LOCALE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'LOCALE',
				uuid: LOCALE_UUID,
				name: 'Hillside',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates locale', async () => {
			assert.equal(await countNodesWithLabel('Locale'), 1);

			const response = await request(app).put(`/locales/${LOCALE_UUID}`).send({
				name: 'Mountainside'
			});

			const expectedResponseBody = {
				model: 'LOCALE',
				uuid: LOCALE_UUID,
				name: 'Mountainside',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Locale'), 1);
		});

		it('shows locale', async () => {
			const response = await request(app).get(`/locales/${LOCALE_UUID}`);

			const expectedResponseBody = {
				model: 'LOCALE',
				uuid: LOCALE_UUID,
				name: 'Mountainside',
				differentiator: null
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes locale', async () => {
			assert.equal(await countNodesWithLabel('Locale'), 1);

			const response = await request(app).delete(`/locales/${LOCALE_UUID}`);

			const expectedResponseBody = {
				model: 'LOCALE',
				name: 'Mountainside',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Locale'), 0);
		});
	});

	describe('GET list endpoint', () => {
		const STATELY_HOME_LOCALE_UUID = 'STATELY_HOME_LOCALE_UUID';
		const HILLSIDE_LOCALE_UUID = 'HILLSIDE_LOCALE_UUID';
		const PUBLIC_SQUARE_LOCALE_UUID = 'PUBLIC_SQUARE_LOCALE_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/locales').send({
				name: 'Stately home'
			});

			await request(app).post('/locales').send({
				name: 'Hillside'
			});

			await request(app).post('/locales').send({
				name: 'Public square'
			});
		});

		it('lists all locales ordered by name', async () => {
			const response = await request(app).get('/locales');

			const expectedResponseBody = [
				{
					model: 'LOCALE',
					uuid: HILLSIDE_LOCALE_UUID,
					name: 'Hillside'
				},
				{
					model: 'LOCALE',
					uuid: PUBLIC_SQUARE_LOCALE_UUID,
					name: 'Public square'
				},
				{
					model: 'LOCALE',
					uuid: STATELY_HOME_LOCALE_UUID,
					name: 'Stately home'
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

describe('CRUD (Create, Read, Update, Delete): Festival Serieses API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new festival series', async () => {
			const response = await request(app).get('/festival-serieses/new');

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				name: '',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD', () => {
		const FESTIVAL_SERIES_UUID = 'EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates festival series', async () => {
			assert.equal(await countNodesWithLabel('FestivalSeries'), 0);

			const response = await request(app).post('/festival-serieses').send({
				name: 'Edinburgh International Festival'
			});

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				uuid: FESTIVAL_SERIES_UUID,
				name: 'Edinburgh International Festival',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('FestivalSeries'), 1);
		});

		it('gets data required to edit specific festival series', async () => {
			const response = await request(app).get(`/festival-serieses/${FESTIVAL_SERIES_UUID}/edit`);

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				uuid: FESTIVAL_SERIES_UUID,
				name: 'Edinburgh International Festival',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates festival series', async () => {
			assert.equal(await countNodesWithLabel('FestivalSeries'), 1);

			const response = await request(app).put(`/festival-serieses/${FESTIVAL_SERIES_UUID}`).send({
				name: 'Connections'
			});

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				uuid: FESTIVAL_SERIES_UUID,
				name: 'Connections',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('FestivalSeries'), 1);
		});

		it('shows festival series', async () => {
			const response = await request(app).get(`/festival-serieses/${FESTIVAL_SERIES_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				uuid: FESTIVAL_SERIES_UUID,
				name: 'Connections',
				differentiator: null,
				festivals: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes festival series', async () => {
			assert.equal(await countNodesWithLabel('FestivalSeries'), 1);

			const response = await request(app).delete(`/festival-serieses/${FESTIVAL_SERIES_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				name: 'Connections',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('FestivalSeries'), 0);
		});
	});

	describe('GET list endpoint', () => {
		const HIGHTIDE_FESTIVAL_SERIES_UUID = 'HIGHTIDE_FESTIVAL_FESTIVAL_SERIES_UUID';
		const EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID =
			'EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID';
		const CONNECTIONS_FESTIVAL_SERIES_UUID = 'CONNECTIONS_FESTIVAL_SERIES_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/festival-serieses').send({
				name: 'Edinburgh International Festival'
			});

			await request(app).post('/festival-serieses').send({
				name: 'HighTide Festival'
			});

			await request(app).post('/festival-serieses').send({
				name: 'Connections'
			});
		});

		it('lists all festival serieses ordered by name', async () => {
			const response = await request(app).get('/festival-serieses');

			const expectedResponseBody = [
				{
					model: 'FESTIVAL_SERIES',
					uuid: CONNECTIONS_FESTIVAL_SERIES_UUID,
					name: 'Connections'
				},
				{
					model: 'FESTIVAL_SERIES',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
					name: 'Edinburgh International Festival'
				},
				{
					model: 'FESTIVAL_SERIES',
					uuid: HIGHTIDE_FESTIVAL_SERIES_UUID,
					name: 'HighTide Festival'
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

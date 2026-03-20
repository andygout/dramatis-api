import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';

const FESTIVAL_SERIES_1_UUID = '2';
const FESTIVAL_SERIES_2_UUID = '5';

describe('Uniqueness in database: Festival Serieses API', () => {
	before(async () => {
		stubUuidCounterClient.setValueToZero();

		await purgeDatabase();
	});

	after(() => {
		stubUuidCounterClient.setValueToUndefined();
	});

	it('creates festival series without differentiator', async () => {
		assert.equal(await countNodesWithLabel('FestivalSeries'), 0);

		const response = await request(app).post('/festival-serieses').send({
			name: 'Connections'
		});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			uuid: FESTIVAL_SERIES_1_UUID,
			name: 'Connections',
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('FestivalSeries'), 1);
	});

	it('responds with errors if trying to create existing festival series that does also not have differentiator', async () => {
		assert.equal(await countNodesWithLabel('FestivalSeries'), 1);

		const response = await request(app).post('/festival-serieses').send({
			name: 'Connections'
		});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			name: 'Connections',
			differentiator: '',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('FestivalSeries'), 1);
	});

	it('creates festival series with same name as existing festival series but uses a differentiator', async () => {
		assert.equal(await countNodesWithLabel('FestivalSeries'), 1);

		const response = await request(app).post('/festival-serieses').send({
			name: 'Connections',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			uuid: FESTIVAL_SERIES_2_UUID,
			name: 'Connections',
			differentiator: '1',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('FestivalSeries'), 2);
	});

	it('responds with errors if trying to update festival series to one with same name and differentiator combination', async () => {
		assert.equal(await countNodesWithLabel('FestivalSeries'), 2);

		const response = await request(app).put(`/festival-serieses/${FESTIVAL_SERIES_1_UUID}`).send({
			name: 'Connections',
			differentiator: '1'
		});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			uuid: FESTIVAL_SERIES_1_UUID,
			name: 'Connections',
			differentiator: '1',
			hasErrors: true,
			errors: {
				name: ['Name and differentiator combination already exists'],
				differentiator: ['Name and differentiator combination already exists']
			}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('FestivalSeries'), 2);
	});

	it('updates festival series with same name as existing festival series but uses a different differentiator', async () => {
		assert.equal(await countNodesWithLabel('FestivalSeries'), 2);

		const response = await request(app).put(`/festival-serieses/${FESTIVAL_SERIES_1_UUID}`).send({
			name: 'Connections',
			differentiator: '2'
		});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			uuid: FESTIVAL_SERIES_1_UUID,
			name: 'Connections',
			differentiator: '2',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('FestivalSeries'), 2);
	});

	it('updates festival series with same name as existing festival series but without a differentiator', async () => {
		assert.equal(await countNodesWithLabel('FestivalSeries'), 2);

		const response = await request(app).put(`/festival-serieses/${FESTIVAL_SERIES_2_UUID}`).send({
			name: 'Connections'
		});

		const expectedResponseBody = {
			model: 'FESTIVAL_SERIES',
			uuid: FESTIVAL_SERIES_2_UUID,
			name: 'Connections',
			differentiator: '',
			errors: {}
		};

		assert.equal(response.status, 200);
		assert.deepEqual(response.body, expectedResponseBody);
		assert.equal(await countNodesWithLabel('FestivalSeries'), 2);
	});
});

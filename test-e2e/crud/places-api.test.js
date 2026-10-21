import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('CRUD (Create, Read, Update, Delete): Places API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new place', async () => {
			const response = await request(app).get('/places/new');

			const expectedResponseBody = {
				model: 'PLACE',
				name: '',
				differentiator: '',
				minLatitude: null,
				maxLatitude: null,
				minLongitude: null,
				maxLongitude: null,
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD with minimum range of attributes assigned values', () => {
		const PLACE_UUID = 'KNIGHTSBRIDGE_PLACE_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 0);

			const response = await request(app).post('/places').send({
				name: 'Knightsbridge'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '',
				minLatitude: null,
				maxLatitude: null,
				minLongitude: null,
				maxLongitude: null,
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 1);
		});

		it('gets data required to edit specific place', async () => {
			const response = await request(app).get(`/places/${PLACE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '',
				minLatitude: null,
				maxLatitude: null,
				minLongitude: null,
				maxLongitude: null,
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app).put(`/places/${PLACE_UUID}`).send({
				name: 'Belgravia'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Belgravia',
				differentiator: '',
				minLatitude: null,
				maxLatitude: null,
				minLongitude: null,
				maxLongitude: null,
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 1);
		});

		it('shows place', async () => {
			const response = await request(app).get(`/places/${PLACE_UUID}`);

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Belgravia',
				differentiator: null,
				surPlaces: [],
				subPlaces: [],
				materials: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app).delete(`/places/${PLACE_UUID}`);

			const expectedResponseBody = {
				model: 'PLACE',
				name: 'Belgravia',
				differentiator: '',
				minLatitude: null,
				maxLatitude: null,
				minLongitude: null,
				maxLongitude: null,
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 0);
		});
	});

	describe('CRUD with full range of attributes assigned values', () => {
		const PLACE_UUID = 'KNIGHTSBRIDGE_PLACE_1_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 0);

			const response = await request(app).post('/places').send({
				name: 'Knightsbridge',
				differentiator: '1',
				minLatitude: 51.4808444,
				maxLatitude: 51.5208444,
				minLongitude: -0.186965,
				maxLongitude: -0.146965
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '1',
				minLatitude: 51.4808444,
				maxLatitude: 51.5208444,
				minLongitude: -0.186965,
				maxLongitude: -0.146965,
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 1);
		});

		it('shows place (post-creation)', async () => {
			const response = await request(app).get(`/places/${PLACE_UUID}`);

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '1',
				surPlaces: [],
				subPlaces: [],
				materials: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('gets data required to edit specific place', async () => {
			const response = await request(app).get(`/places/${PLACE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '1',
				minLatitude: 51.4808444,
				maxLatitude: 51.5208444,
				minLongitude: -0.186965,
				maxLongitude: -0.146965,
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates place (with existing data)', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app).put(`/places/${PLACE_UUID}`).send({
				name: 'Knightsbridge',
				differentiator: '1',
				minLatitude: 51.4808444,
				maxLatitude: 51.5208444,
				minLongitude: -0.186965,
				maxLongitude: -0.146965
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '1',
				minLatitude: 51.4808444,
				maxLatitude: 51.5208444,
				minLongitude: -0.186965,
				maxLongitude: -0.146965,
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 1);
		});

		it('updates place (with new data)', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app).put(`/places/${PLACE_UUID}`).send({
				name: 'Belgravia',
				differentiator: '1',
				minLatitude: 51.4782128,
				maxLatitude: 51.5182128,
				minLongitude: -0.1734998,
				maxLongitude: -0.1334998
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Belgravia',
				differentiator: '1',
				minLatitude: 51.4782128,
				maxLatitude: 51.5182128,
				minLongitude: -0.1734998,
				maxLongitude: -0.1334998,
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 1);
		});

		it('shows place (post-update)', async () => {
			const response = await request(app).get(`/places/${PLACE_UUID}`);

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Belgravia',
				differentiator: '1',
				surPlaces: [],
				subPlaces: [],
				materials: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app).delete(`/places/${PLACE_UUID}`);

			const expectedResponseBody = {
				model: 'PLACE',
				name: 'Belgravia',
				differentiator: '1',
				minLatitude: null,
				maxLatitude: null,
				minLongitude: null,
				maxLongitude: null,
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 0);
		});
	});

	describe('GET list endpoint', () => {
		const DERBYSHIRE_PLACE_UUID = 'DERBYSHIRE_PLACE_UUID';
		const KNIGHTSBRIDGE_PLACE_UUID = 'KNIGHTSBRIDGE_PLACE_UUID';
		const CONSTANTINOPLE_PLACE_UUID = 'CONSTANTINOPLE_PLACE_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/places').send({
				name: 'Derbyshire'
			});

			await request(app).post('/places').send({
				name: 'Knightsbridge'
			});

			await request(app).post('/places').send({
				name: 'Constantinople'
			});
		});

		it('lists all places ordered by name', async () => {
			const response = await request(app).get('/places');

			const expectedResponseBody = [
				{
					model: 'PLACE',
					uuid: CONSTANTINOPLE_PLACE_UUID,
					name: 'Constantinople'
				},
				{
					model: 'PLACE',
					uuid: DERBYSHIRE_PLACE_UUID,
					name: 'Derbyshire'
				},
				{
					model: 'PLACE',
					uuid: KNIGHTSBRIDGE_PLACE_UUID,
					name: 'Knightsbridge'
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

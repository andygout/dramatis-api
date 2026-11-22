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
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
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
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
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
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app).put(`/places/${PLACE_UUID}`).send({
				name: 'Saint-Germain-des-Prés'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Saint-Germain-des-Prés',
				differentiator: '',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
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
				name: 'Saint-Germain-des-Prés',
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
				name: 'Saint-Germain-des-Prés',
				differentiator: '',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 0);
		});
	});

	describe('CRUD with full range of attributes assigned values', () => {
		const PLACE_UUID = 'KNIGHTSBRIDGE_PLACE_1_UUID';
		const LONDON_PLACE_UUID = 'LONDON_PLACE_1_UUID';
		const PARIS_PLACE_UUID = 'PARIS_PLACE_1_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 0);

			const response = await request(app)
				.post('/places')
				.send({
					name: 'Knightsbridge',
					differentiator: '1',
					surPlace: {
						name: 'London',
						differentiator: '1'
					}
				});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '1',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: 'London',
					differentiator: '1',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 2);
		});

		it('shows place (post-creation)', async () => {
			const response = await request(app).get(`/places/${PLACE_UUID}`);

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '1',
				surPlaces: [
					{
						model: 'PLACE',
						uuid: LONDON_PLACE_UUID,
						name: 'London'
					}
				],
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
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: 'London',
					differentiator: '1',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates place (with existing data)', async () => {
			assert.equal(await countNodesWithLabel('Place'), 2);

			const response = await request(app)
				.put(`/places/${PLACE_UUID}`)
				.send({
					name: 'Knightsbridge',
					differentiator: '1',
					surPlace: {
						name: 'London',
						differentiator: '1'
					}
				});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Knightsbridge',
				differentiator: '1',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: 'London',
					differentiator: '1',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 2);
		});

		it('updates place (with new data)', async () => {
			assert.equal(await countNodesWithLabel('Place'), 2);

			const response = await request(app)
				.put(`/places/${PLACE_UUID}`)
				.send({
					name: 'Saint-Germain-des-Prés',
					differentiator: '1',
					surPlace: {
						name: 'Paris',
						differentiator: '1'
					}
				});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Saint-Germain-des-Prés',
				differentiator: '1',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: 'Paris',
					differentiator: '1',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 3);
		});

		it('shows place (post-update)', async () => {
			const response = await request(app).get(`/places/${PLACE_UUID}`);

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Saint-Germain-des-Prés',
				differentiator: '1',
				surPlaces: [
					{
						model: 'PLACE',
						uuid: PARIS_PLACE_UUID,
						name: 'Paris'
					}
				],
				subPlaces: [],
				materials: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates place to remove all associations prior to deletion', async () => {
			assert.equal(await countNodesWithLabel('Place'), 3);

			const response = await request(app).put(`/places/${PLACE_UUID}`).send({
				name: 'Saint-Germain-des-Prés',
				differentiator: '1'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_UUID,
				name: 'Saint-Germain-des-Prés',
				differentiator: '1',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 3);
		});

		it('deletes place', async () => {
			assert.equal(await countNodesWithLabel('Place'), 3);

			const response = await request(app).delete(`/places/${PLACE_UUID}`);

			const expectedResponseBody = {
				model: 'PLACE',
				name: 'Saint-Germain-des-Prés',
				differentiator: '1',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 2);
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

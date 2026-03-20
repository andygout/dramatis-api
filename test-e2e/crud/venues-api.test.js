import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

describe('CRUD (Create, Read, Update, Delete): Venues API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new venue', async () => {
			const response = await request(app).get('/venues/new');

			const expectedResponseBody = {
				model: 'VENUE',
				name: '',
				differentiator: '',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD with minimum range of attributes assigned values', () => {
		const VENUE_UUID = 'NATIONAL_THEATRE_VENUE_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates venue', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 0);

			const response = await request(app).post('/venues').send({
				name: 'National Theatre'
			});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Venue'), 1);
		});

		it('gets data required to edit specific venue', async () => {
			const response = await request(app).get(`/venues/${VENUE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates venue', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 1);

			const response = await request(app).put(`/venues/${VENUE_UUID}`).send({
				name: 'Almeida Theatre'
			});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'Almeida Theatre',
				differentiator: '',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Venue'), 1);
		});

		it('shows venue', async () => {
			const response = await request(app).get(`/venues/${VENUE_UUID}`);

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'Almeida Theatre',
				differentiator: null,
				surVenue: null,
				subVenues: [],
				productions: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes venue', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 1);

			const response = await request(app).delete(`/venues/${VENUE_UUID}`);

			const expectedResponseBody = {
				model: 'VENUE',
				name: 'Almeida Theatre',
				differentiator: '',
				errors: {},
				subVenues: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Venue'), 0);
		});
	});

	describe('CRUD with full range of attributes assigned values', () => {
		const VENUE_UUID = 'NATIONAL_THEATRE_VENUE_1_UUID';
		const OLIVIER_THEATRE_VENUE_UUID = 'OLIVIER_THEATRE_VENUE_1_UUID';
		const LYTTELTON_THEATRE_VENUE_UUID = 'LYTTELTON_THEATRE_VENUE_1_UUID';
		const DORFMAN_THEATRE_VENUE_UUID = 'DORFMAN_THEATRE_VENUE_1_UUID';
		const JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID = 'JERWOOD_THEATRE_DOWNSTAIRS_VENUE_1_UUID';
		const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = 'JERWOOD_THEATRE_UPSTAIRS_VENUE_1_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates venue', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 0);

			const response = await request(app)
				.post('/venues')
				.send({
					name: 'National Theatre',
					differentiator: '1',
					subVenues: [
						{
							name: 'Olivier Theatre',
							differentiator: '1'
						},
						{
							name: 'Lyttelton Theatre',
							differentiator: '1'
						},
						{
							name: 'Dorfman Theatre',
							differentiator: '1'
						}
					]
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '1',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: 'Olivier Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Lyttelton Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Dorfman Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Venue'), 4);
		});

		it('shows venue (post-creation)', async () => {
			const response = await request(app).get(`/venues/${VENUE_UUID}`);

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '1',
				surVenue: null,
				subVenues: [
					{
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre'
					},
					{
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre'
					},
					{
						model: 'VENUE',
						uuid: DORFMAN_THEATRE_VENUE_UUID,
						name: 'Dorfman Theatre'
					}
				],
				productions: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('gets data required to edit specific venue', async () => {
			const response = await request(app).get(`/venues/${VENUE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '1',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: 'Olivier Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Lyttelton Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Dorfman Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates venue (with existing data)', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 4);

			const response = await request(app)
				.put(`/venues/${VENUE_UUID}`)
				.send({
					name: 'National Theatre',
					differentiator: '1',
					subVenues: [
						{
							name: 'Olivier Theatre',
							differentiator: '1'
						},
						{
							name: 'Lyttelton Theatre',
							differentiator: '1'
						},
						{
							name: 'Dorfman Theatre',
							differentiator: '1'
						}
					]
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '1',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: 'Olivier Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Lyttelton Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Dorfman Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Venue'), 4);
		});

		it('updates venue (with new data)', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 4);

			const response = await request(app)
				.put(`/venues/${VENUE_UUID}`)
				.send({
					name: 'Royal Court Theatre',
					differentiator: '1',
					subVenues: [
						{
							name: 'Jerwood Theatre Downstairs',
							differentiator: '1'
						},
						{
							name: 'Jerwood Theatre Upstairs',
							differentiator: '1'
						}
					]
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'Royal Court Theatre',
				differentiator: '1',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: 'Jerwood Theatre Downstairs',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Jerwood Theatre Upstairs',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Venue'), 6);
		});

		it('shows venue (post-update)', async () => {
			const response = await request(app).get(`/venues/${VENUE_UUID}`);

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'Royal Court Theatre',
				differentiator: '1',
				surVenue: null,
				subVenues: [
					{
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs'
					},
					{
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs'
					}
				],
				productions: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates venue to remove all associations prior to deletion', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 6);

			const response = await request(app).put(`/venues/${VENUE_UUID}`).send({
				name: 'Royal Court Theatre',
				differentiator: '1'
			});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'Royal Court Theatre',
				differentiator: '1',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Venue'), 6);
		});

		it('deletes venue', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 6);

			const response = await request(app).delete(`/venues/${VENUE_UUID}`);

			const expectedResponseBody = {
				model: 'VENUE',
				name: 'Royal Court Theatre',
				differentiator: '1',
				errors: {},
				subVenues: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Venue'), 5);
		});
	});

	describe('GET list endpoint', () => {
		const DONMAR_WAREHOUSE_VENUE_UUID = 'DONMAR_WAREHOUSE_VENUE_UUID';
		const NATIONAL_THEATRE_VENUE_UUID = 'NATIONAL_THEATRE_VENUE_UUID';
		const ALMEIDA_THEATRE_VENUE_UUID = 'ALMEIDA_THEATRE_VENUE_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/venues').send({
				name: 'Donmar Warehouse'
			});

			await request(app).post('/venues').send({
				name: 'National Theatre'
			});

			await request(app).post('/venues').send({
				name: 'Almeida Theatre'
			});
		});

		it('lists all venues ordered by name', async () => {
			const response = await request(app).get('/venues');

			const expectedResponseBody = [
				{
					model: 'VENUE',
					uuid: ALMEIDA_THEATRE_VENUE_UUID,
					name: 'Almeida Theatre',
					subVenues: []
				},
				{
					model: 'VENUE',
					uuid: DONMAR_WAREHOUSE_VENUE_UUID,
					name: 'Donmar Warehouse',
					subVenues: []
				},
				{
					model: 'VENUE',
					uuid: NATIONAL_THEATRE_VENUE_UUID,
					name: 'National Theatre',
					subVenues: []
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

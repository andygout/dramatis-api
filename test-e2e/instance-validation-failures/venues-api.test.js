import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import {
	countNodesWithLabel,
	createNode,
	createRelationship,
	isNodeExistent,
	purgeDatabase
} from '../test-helpers/neo4j/index.js';

const context = describe;

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Instance validation failures: Venues API', () => {
	describe('attempt to create instance', () => {
		const DONMAR_WAREHOUSE_VENUE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Venue',
				uuid: DONMAR_WAREHOUSE_VENUE_UUID,
				name: 'Donmar Warehouse'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Venue'), 1);

				const response = await request(app).post('/venues').send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'VENUE',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					},
					subVenues: []
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Venue'), 1);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Venue'), 1);

				const response = await request(app).post('/venues').send({
					name: 'Donmar Warehouse'
				});

				const expectedResponseBody = {
					model: 'VENUE',
					name: 'Donmar Warehouse',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					},
					subVenues: []
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Venue'), 1);
			});
		});

		context('instance has both input and database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Venue'), 1);

				const response = await request(app)
					.post('/venues')
					.send({
						name: 'Donmar Warehouse',
						subVenues: [
							{
								name: ABOVE_MAX_LENGTH_STRING
							}
						]
					});

				const expectedResponseBody = {
					model: 'VENUE',
					name: 'Donmar Warehouse',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					},
					subVenues: [
						{
							model: 'VENUE',
							name: ABOVE_MAX_LENGTH_STRING,
							differentiator: '',
							errors: {
								name: ['Value is too long']
							}
						}
					]
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Venue'), 1);
			});
		});
	});

	describe('attempt to update instance', () => {
		const ALMEIDA_THEATRE_VENUE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const DONMAR_WAREHOUSE_VENUE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Venue',
				uuid: ALMEIDA_THEATRE_VENUE_UUID,
				name: 'Almeida Theatre'
			});

			await createNode({
				label: 'Venue',
				uuid: DONMAR_WAREHOUSE_VENUE_UUID,
				name: 'Donmar Warehouse'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Venue'), 2);

				const response = await request(app).put(`/venues/${ALMEIDA_THEATRE_VENUE_UUID}`).send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'VENUE',
					uuid: ALMEIDA_THEATRE_VENUE_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					},
					subVenues: []
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Venue'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Venue',
						name: 'Almeida Theatre',
						uuid: ALMEIDA_THEATRE_VENUE_UUID
					}),
					true
				);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Venue'), 2);

				const response = await request(app).put(`/venues/${ALMEIDA_THEATRE_VENUE_UUID}`).send({
					name: 'Donmar Warehouse'
				});

				const expectedResponseBody = {
					model: 'VENUE',
					uuid: ALMEIDA_THEATRE_VENUE_UUID,
					name: 'Donmar Warehouse',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					},
					subVenues: []
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Venue'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Venue',
						name: 'Almeida Theatre',
						uuid: ALMEIDA_THEATRE_VENUE_UUID
					}),
					true
				);
			});
		});

		context('instance has both input and database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Venue'), 2);

				const response = await request(app)
					.put(`/venues/${ALMEIDA_THEATRE_VENUE_UUID}`)
					.send({
						name: 'Donmar Warehouse',
						subVenues: [
							{
								name: ABOVE_MAX_LENGTH_STRING
							}
						]
					});

				const expectedResponseBody = {
					model: 'VENUE',
					uuid: ALMEIDA_THEATRE_VENUE_UUID,
					name: 'Donmar Warehouse',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					},
					subVenues: [
						{
							model: 'VENUE',
							name: ABOVE_MAX_LENGTH_STRING,
							differentiator: '',
							errors: {
								name: ['Value is too long']
							}
						}
					]
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Venue'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Venue',
						name: 'Almeida Theatre',
						uuid: ALMEIDA_THEATRE_VENUE_UUID
					}),
					true
				);
			});
		});
	});

	describe('attempt to delete instance', () => {
		const ALMEIDA_THEATRE_VENUE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const THE_MERCHANT_OF_VENICE_ALMEIDA_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Venue',
				uuid: ALMEIDA_THEATRE_VENUE_UUID,
				name: 'Almeida Theatre'
			});

			await createNode({
				label: 'Production',
				uuid: THE_MERCHANT_OF_VENICE_ALMEIDA_PRODUCTION_UUID,
				name: 'The Merchant of Venice'
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: THE_MERCHANT_OF_VENICE_ALMEIDA_PRODUCTION_UUID,
				destinationLabel: 'Venue',
				destinationUuid: ALMEIDA_THEATRE_VENUE_UUID,
				relationshipName: 'PLAYS_AT'
			});
		});

		context('instance has associations', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Venue'), 1);

				const response = await request(app).delete(`/venues/${ALMEIDA_THEATRE_VENUE_UUID}`);

				const expectedResponseBody = {
					model: 'VENUE',
					uuid: ALMEIDA_THEATRE_VENUE_UUID,
					name: 'Almeida Theatre',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: ['Production']
					},
					subVenues: []
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Venue'), 1);
			});
		});
	});
});

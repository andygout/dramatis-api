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

describe('Instance validation failures: Places API', () => {
	describe('attempt to create instance', () => {
		const KNIGHTSBRIDGE_PLACE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Place',
				uuid: KNIGHTSBRIDGE_PLACE_UUID,
				name: 'Knightsbridge'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Place'), 1);

				const response = await request(app).post('/places').send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'PLACE',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Place'), 1);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Place'), 1);

				const response = await request(app).post('/places').send({
					name: 'Knightsbridge'
				});

				const expectedResponseBody = {
					model: 'PLACE',
					name: 'Knightsbridge',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Place'), 1);
			});
		});
	});

	describe('attempt to update instance', () => {
		const DERBYSHIRE_PLACE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const KNIGHTSBRIDGE_PLACE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Place',
				uuid: DERBYSHIRE_PLACE_UUID,
				name: 'Derbyshire'
			});

			await createNode({
				label: 'Place',
				uuid: KNIGHTSBRIDGE_PLACE_UUID,
				name: 'Knightsbridge'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Place'), 2);

				const response = await request(app).put(`/places/${DERBYSHIRE_PLACE_UUID}`).send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'PLACE',
					uuid: DERBYSHIRE_PLACE_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Place'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Place',
						name: 'Derbyshire',
						uuid: DERBYSHIRE_PLACE_UUID
					}),
					true
				);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Place'), 2);

				const response = await request(app).put(`/places/${DERBYSHIRE_PLACE_UUID}`).send({
					name: 'Knightsbridge'
				});

				const expectedResponseBody = {
					model: 'PLACE',
					uuid: DERBYSHIRE_PLACE_UUID,
					name: 'Knightsbridge',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Place'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Place',
						name: 'Derbyshire',
						uuid: DERBYSHIRE_PLACE_UUID
					}),
					true
				);
			});
		});
	});

	describe('attempt to delete instance', () => {
		const DERBYSHIRE_PLACE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const ARCADIA_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Place',
				uuid: DERBYSHIRE_PLACE_UUID,
				name: 'Derbyshire'
			});

			await createNode({
				label: 'Material',
				uuid: ARCADIA_MATERIAL_UUID,
				name: 'Arcadia'
			});

			await createRelationship({
				sourceLabel: 'Material',
				sourceUuid: ARCADIA_MATERIAL_UUID,
				destinationLabel: 'Place',
				destinationUuid: DERBYSHIRE_PLACE_UUID,
				relationshipName: 'HAS_SETTING'
			});
		});

		context('instance has associations', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Place'), 1);

				const response = await request(app).delete(`/places/${DERBYSHIRE_PLACE_UUID}`);

				const expectedResponseBody = {
					model: 'PLACE',
					uuid: DERBYSHIRE_PLACE_UUID,
					name: 'Derbyshire',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: ['Material']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Place'), 1);
			});
		});
	});
});

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

describe('Database validation failures: Places API', () => {
	describe('attempt to update instance', () => {
		context('sur-place is a descendent of the subject place', () => {
			const RUSSIA_PLACE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
			const MOSCOW_PLACE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

			before(async () => {
				await purgeDatabase();

				await createNode({
					label: 'Place',
					uuid: RUSSIA_PLACE_UUID,
					name: 'Russia'
				});

				await createNode({
					label: 'Place',
					uuid: MOSCOW_PLACE_UUID,
					name: 'Moscow'
				});

				await createRelationship({
					sourceLabel: 'Place',
					sourceUuid: RUSSIA_PLACE_UUID,
					destinationLabel: 'Place',
					destinationUuid: MOSCOW_PLACE_UUID,
					relationshipName: 'CONTAINS'
				});
			});

			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Place'), 2);

				const response = await request(app)
					.put(`/places/${RUSSIA_PLACE_UUID}`)
					.send({
						name: 'Russia',
						surPlace: {
							name: 'Moscow'
						}
					});

				const expectedResponseBody = {
					model: 'PLACE',
					uuid: RUSSIA_PLACE_UUID,
					name: 'Russia',
					differentiator: '',
					hasErrors: true,
					errors: {},
					surPlace: {
						model: 'PLACE',
						name: 'Moscow',
						differentiator: '',
						errors: {
							name: ['Place with these attributes is a descendent of this place'],
							differentiator: ['Place with these attributes is a descendent of this place']
						}
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Place'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Place',
						name: 'Russia',
						uuid: RUSSIA_PLACE_UUID
					}),
					true
				);
			});
		});
	});
});

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

describe('Instance validation failures: Times API', () => {
	describe('attempt to create instance', () => {
		const NINETEEN_SIXTY_TWO_TIME_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Time',
				uuid: NINETEEN_SIXTY_TWO_TIME_UUID,
				name: '1962'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Time'), 1);

				const response = await request(app).post('/times').send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'TIME',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Time'), 1);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Time'), 1);

				const response = await request(app).post('/times').send({
					name: '1962'
				});

				const expectedResponseBody = {
					model: 'TIME',
					name: '1962',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Time'), 1);
			});
		});
	});

	describe('attempt to update instance', () => {
		const EIGHTEEN_ZERO_NINE_TIME_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const NINETEEN_SIXTY_TWO_TIME_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Time',
				uuid: EIGHTEEN_ZERO_NINE_TIME_UUID,
				name: '1809'
			});

			await createNode({
				label: 'Time',
				uuid: NINETEEN_SIXTY_TWO_TIME_UUID,
				name: '1962'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Time'), 2);

				const response = await request(app).put(`/times/${EIGHTEEN_ZERO_NINE_TIME_UUID}`).send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'TIME',
					uuid: EIGHTEEN_ZERO_NINE_TIME_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Time'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Time',
						name: '1809',
						uuid: EIGHTEEN_ZERO_NINE_TIME_UUID
					}),
					true
				);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Time'), 2);

				const response = await request(app).put(`/times/${EIGHTEEN_ZERO_NINE_TIME_UUID}`).send({
					name: '1962'
				});

				const expectedResponseBody = {
					model: 'TIME',
					uuid: EIGHTEEN_ZERO_NINE_TIME_UUID,
					name: '1962',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Time'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Time',
						name: '1809',
						uuid: EIGHTEEN_ZERO_NINE_TIME_UUID
					}),
					true
				);
			});
		});
	});

	describe('attempt to delete instance', () => {
		const EIGHTEEN_ZERO_NINE_TIME_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const ARCADIA_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Time',
				uuid: EIGHTEEN_ZERO_NINE_TIME_UUID,
				name: '1809'
			});

			await createNode({
				label: 'Material',
				uuid: ARCADIA_MATERIAL_UUID,
				name: 'Arcadia'
			});

			await createRelationship({
				sourceLabel: 'Material',
				sourceUuid: ARCADIA_MATERIAL_UUID,
				destinationLabel: 'Time',
				destinationUuid: EIGHTEEN_ZERO_NINE_TIME_UUID,
				relationshipName: 'HAS_SETTING'
			});
		});

		context('instance has associations', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Time'), 1);

				const response = await request(app).delete(`/times/${EIGHTEEN_ZERO_NINE_TIME_UUID}`);

				const expectedResponseBody = {
					model: 'TIME',
					uuid: EIGHTEEN_ZERO_NINE_TIME_UUID,
					name: '1809',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: ['Material']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Time'), 1);
			});
		});
	});
});

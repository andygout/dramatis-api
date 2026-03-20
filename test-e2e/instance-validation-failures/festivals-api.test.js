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

describe('Instance validation failures: Festivals API', () => {
	describe('attempt to create instance', () => {
		const THE_COMPLETE_WORKS_FESTIVAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Festival',
				uuid: THE_COMPLETE_WORKS_FESTIVAL_UUID,
				name: 'The Complete Works'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Festival'), 1);

				const response = await request(app).post('/festivals').send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'FESTIVAL',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					},
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Festival'), 1);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Festival'), 1);

				const response = await request(app).post('/festivals').send({
					name: 'The Complete Works'
				});

				const expectedResponseBody = {
					model: 'FESTIVAL',
					name: 'The Complete Works',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					},
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Festival'), 1);
			});
		});
	});

	describe('attempt to update instance', () => {
		const GLOBE_TO_GLOBE_FESTIVAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const THE_COMPLETE_WORKS_FESTIVAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Festival',
				uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
				name: 'Globe to Globe'
			});

			await createNode({
				label: 'Festival',
				uuid: THE_COMPLETE_WORKS_FESTIVAL_UUID,
				name: 'The Complete Works'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Festival'), 2);

				const response = await request(app).put(`/festivals/${GLOBE_TO_GLOBE_FESTIVAL_UUID}`).send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'FESTIVAL',
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					},
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Festival'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Festival',
						name: 'Globe to Globe',
						uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID
					}),
					true
				);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Festival'), 2);

				const response = await request(app).put(`/festivals/${GLOBE_TO_GLOBE_FESTIVAL_UUID}`).send({
					name: 'The Complete Works'
				});

				const expectedResponseBody = {
					model: 'FESTIVAL',
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
					name: 'The Complete Works',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					},
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Festival'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Festival',
						name: 'Globe to Globe',
						uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID
					}),
					true
				);
			});
		});
	});

	describe('attempt to delete instance', () => {
		const GLOBE_TO_GLOBE_FESTIVAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const MEASURE_FOR_MEASURE_GLOBE_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Festival',
				uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
				name: 'Globe to Globe'
			});

			await createNode({
				label: 'Production',
				uuid: MEASURE_FOR_MEASURE_GLOBE_PRODUCTION_UUID,
				name: 'Measure for Measure'
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: MEASURE_FOR_MEASURE_GLOBE_PRODUCTION_UUID,
				destinationLabel: 'Festival',
				destinationUuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
				relationshipName: 'PART_OF_FESTIVAL'
			});
		});

		context('instance has associations', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Festival'), 1);

				const response = await request(app).delete(`/festivals/${GLOBE_TO_GLOBE_FESTIVAL_UUID}`);

				const expectedResponseBody = {
					model: 'FESTIVAL',
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
					name: 'Globe to Globe',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: ['Production']
					},
					festivalSeries: {
						model: 'FESTIVAL_SERIES',
						name: '',
						differentiator: '',
						errors: {}
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Festival'), 1);
			});
		});
	});
});

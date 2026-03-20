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

describe('Instance validation failures: Festival Serieses API', () => {
	describe('attempt to create instance', () => {
		const EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'FestivalSeries',
				uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
				name: 'Edinburgh International Festival'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('FestivalSeries'), 1);

				const response = await request(app).post('/festival-serieses').send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'FESTIVAL_SERIES',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('FestivalSeries'), 1);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('FestivalSeries'), 1);

				const response = await request(app).post('/festival-serieses').send({
					name: 'Edinburgh International Festival'
				});

				const expectedResponseBody = {
					model: 'FESTIVAL_SERIES',
					name: 'Edinburgh International Festival',
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
		});
	});

	describe('attempt to update instance', () => {
		const CONNECTIONS_FESTIVAL_SERIES_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'FestivalSeries',
				uuid: CONNECTIONS_FESTIVAL_SERIES_UUID,
				name: 'Connections'
			});

			await createNode({
				label: 'FestivalSeries',
				uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
				name: 'Edinburgh International Festival'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('FestivalSeries'), 2);

				const response = await request(app).put(`/festival-serieses/${CONNECTIONS_FESTIVAL_SERIES_UUID}`).send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'FESTIVAL_SERIES',
					uuid: CONNECTIONS_FESTIVAL_SERIES_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('FestivalSeries'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'FestivalSeries',
						name: 'Connections',
						uuid: CONNECTIONS_FESTIVAL_SERIES_UUID
					}),
					true
				);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('FestivalSeries'), 2);

				const response = await request(app).put(`/festival-serieses/${CONNECTIONS_FESTIVAL_SERIES_UUID}`).send({
					name: 'Edinburgh International Festival'
				});

				const expectedResponseBody = {
					model: 'FESTIVAL_SERIES',
					uuid: CONNECTIONS_FESTIVAL_SERIES_UUID,
					name: 'Edinburgh International Festival',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('FestivalSeries'), 2);
				assert.equa;
				(await isNodeExistent({
					label: 'FestivalSeries',
					name: 'Connections',
					uuid: CONNECTIONS_FESTIVAL_SERIES_UUID
				}),
					true);
			});
		});
	});

	describe('attempt to delete instance', () => {
		const EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const TWO_THOUSAND_AND_EIGHT_FESTIVAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'FestivalSeries',
				uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
				name: 'Edinburgh International Festival'
			});

			await createNode({
				label: 'Festival',
				uuid: TWO_THOUSAND_AND_EIGHT_FESTIVAL_UUID,
				name: '2008'
			});

			await createRelationship({
				sourceLabel: 'Festival',
				sourceUuid: TWO_THOUSAND_AND_EIGHT_FESTIVAL_UUID,
				destinationLabel: 'FestivalSeries',
				destinationUuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
				relationshipName: 'PART_OF_FESTIVAL_SERIES'
			});
		});

		context('instance has associations', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('FestivalSeries'), 1);

				const response = await request(app).delete(
					`/festival-serieses/${EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID}`
				);

				const expectedResponseBody = {
					model: 'FESTIVAL_SERIES',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
					name: 'Edinburgh International Festival',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: ['Festival']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('FestivalSeries'), 1);
			});
		});
	});
});

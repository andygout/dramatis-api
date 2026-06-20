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

describe('Instance validation failures: Locales API', () => {
	describe('attempt to create instance', () => {
		const HILLSIDE_LOCALE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Locale',
				uuid: HILLSIDE_LOCALE_UUID,
				name: 'Hillside'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Locale'), 1);

				const response = await request(app).post('/locales').send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'LOCALE',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Locale'), 1);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Locale'), 1);

				const response = await request(app).post('/locales').send({
					name: 'Hillside'
				});

				const expectedResponseBody = {
					model: 'LOCALE',
					name: 'Hillside',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Locale'), 1);
			});
		});
	});

	describe('attempt to update instance', () => {
		const STATELY_HOME_LOCALE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const HILLSIDE_LOCALE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Locale',
				uuid: STATELY_HOME_LOCALE_UUID,
				name: 'Stately home'
			});

			await createNode({
				label: 'Locale',
				uuid: HILLSIDE_LOCALE_UUID,
				name: 'Hillside'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Locale'), 2);

				const response = await request(app).put(`/locales/${STATELY_HOME_LOCALE_UUID}`).send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'LOCALE',
					uuid: STATELY_HOME_LOCALE_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Locale'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Locale',
						name: 'Stately home',
						uuid: STATELY_HOME_LOCALE_UUID
					}),
					true
				);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Locale'), 2);

				const response = await request(app).put(`/locales/${STATELY_HOME_LOCALE_UUID}`).send({
					name: 'Hillside'
				});

				const expectedResponseBody = {
					model: 'LOCALE',
					uuid: STATELY_HOME_LOCALE_UUID,
					name: 'Hillside',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Locale'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Locale',
						name: 'Stately home',
						uuid: STATELY_HOME_LOCALE_UUID
					}),
					true
				);
			});
		});
	});

	describe('attempt to delete instance', () => {
		const STATELY_HOME_LOCALE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const ARCADIA_MATERIAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Locale',
				uuid: STATELY_HOME_LOCALE_UUID,
				name: 'Stately home'
			});

			await createNode({
				label: 'Material',
				uuid: ARCADIA_MATERIAL_UUID,
				name: 'Arcadia'
			});

			await createRelationship({
				sourceLabel: 'Material',
				sourceUuid: ARCADIA_MATERIAL_UUID,
				destinationLabel: 'Locale',
				destinationUuid: STATELY_HOME_LOCALE_UUID,
				relationshipName: 'HAS_SETTING'
			});
		});

		context('instance has associations', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Locale'), 1);

				const response = await request(app).delete(`/locales/${STATELY_HOME_LOCALE_UUID}`);

				const expectedResponseBody = {
					model: 'LOCALE',
					uuid: STATELY_HOME_LOCALE_UUID,
					name: 'Stately home',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: ['Material']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Locale'), 1);
			});
		});
	});
});

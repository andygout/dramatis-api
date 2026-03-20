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

describe('Instance validation failures: People API', () => {
	describe('attempt to create instance', () => {
		const MAGGIE_SMITH_PERSON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Person',
				uuid: MAGGIE_SMITH_PERSON_UUID,
				name: 'Maggie Smith'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Person'), 1);

				const response = await request(app).post('/people').send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'PERSON',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Person'), 1);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Person'), 1);

				const response = await request(app).post('/people').send({
					name: 'Maggie Smith'
				});

				const expectedResponseBody = {
					model: 'PERSON',
					name: 'Maggie Smith',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Person'), 1);
			});
		});
	});

	describe('attempt to update instance', () => {
		const JUDI_DENCH_PERSON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const MAGGIE_SMITH_PERSON_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Person',
				uuid: JUDI_DENCH_PERSON_UUID,
				name: 'Judi Dench'
			});

			await createNode({
				label: 'Person',
				uuid: MAGGIE_SMITH_PERSON_UUID,
				name: 'Maggie Smith'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Person'), 2);

				const response = await request(app).put(`/people/${JUDI_DENCH_PERSON_UUID}`).send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'PERSON',
					uuid: JUDI_DENCH_PERSON_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Person'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Person',
						name: 'Judi Dench',
						uuid: JUDI_DENCH_PERSON_UUID
					}),
					true
				);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Person'), 2);

				const response = await request(app).put(`/people/${JUDI_DENCH_PERSON_UUID}`).send({
					name: 'Maggie Smith'
				});

				const expectedResponseBody = {
					model: 'PERSON',
					uuid: JUDI_DENCH_PERSON_UUID,
					name: 'Maggie Smith',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Person'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Person',
						name: 'Judi Dench',
						uuid: JUDI_DENCH_PERSON_UUID
					}),
					true
				);
			});
		});
	});

	describe('attempt to delete instance', () => {
		const JUDI_DENCH_PERSON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Person',
				uuid: JUDI_DENCH_PERSON_UUID,
				name: 'Judi Dench'
			});

			await createNode({
				label: 'Production',
				uuid: A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID,
				name: "A Midsummer Night's Dream"
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID,
				destinationLabel: 'Person',
				destinationUuid: JUDI_DENCH_PERSON_UUID,
				relationshipName: 'HAS_CAST_MEMBER'
			});
		});

		context('instance has associations', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Person'), 1);

				const response = await request(app).delete(`/people/${JUDI_DENCH_PERSON_UUID}`);

				const expectedResponseBody = {
					model: 'PERSON',
					uuid: JUDI_DENCH_PERSON_UUID,
					name: 'Judi Dench',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: ['Production']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Person'), 1);
			});
		});
	});
});

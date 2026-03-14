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

describe('Instance validation failures: Companies API', () => {
	describe('attempt to create instance', () => {
		const DONMAR_WAREHOUSE_PROJECTS_COMPANY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Company',
				uuid: DONMAR_WAREHOUSE_PROJECTS_COMPANY_UUID,
				name: 'Donmar Warehouse Projects'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Company'), 1);

				const response = await request(app).post('/companies').send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'COMPANY',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Company'), 1);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Company'), 1);

				const response = await request(app).post('/companies').send({
					name: 'Donmar Warehouse Projects'
				});

				const expectedResponseBody = {
					model: 'COMPANY',
					name: 'Donmar Warehouse Projects',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Company'), 1);
			});
		});
	});

	describe('attempt to update instance', () => {
		const SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const DONMAR_WAREHOUSE_PROJECTS_COMPANY_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Company',
				uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
				name: 'Shakespeare Globe Trust'
			});

			await createNode({
				label: 'Company',
				uuid: DONMAR_WAREHOUSE_PROJECTS_COMPANY_UUID,
				name: 'Donmar Warehouse Projects'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Company'), 2);

				const response = await request(app).put(`/companies/${SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID}`).send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'COMPANY',
					uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Company'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Company',
						name: 'Shakespeare Globe Trust',
						uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID
					}),
					true
				);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Company'), 2);

				const response = await request(app).put(`/companies/${SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID}`).send({
					name: 'Donmar Warehouse Projects'
				});

				const expectedResponseBody = {
					model: 'COMPANY',
					uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
					name: 'Donmar Warehouse Projects',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Company'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Company',
						name: 'Shakespeare Globe Trust',
						uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID
					}),
					true
				);
			});
		});
	});

	describe('attempt to delete instance', () => {
		const SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const A_MIDSUMMER_NIGHTS_DREAM_GLOBE_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Company',
				uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
				name: 'Shakespeare Globe Trust'
			});

			await createNode({
				label: 'Production',
				uuid: A_MIDSUMMER_NIGHTS_DREAM_GLOBE_PRODUCTION_UUID,
				name: "A Midsummer Night's Dream"
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: A_MIDSUMMER_NIGHTS_DREAM_GLOBE_PRODUCTION_UUID,
				destinationLabel: 'Company',
				destinationUuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
				relationshipName: 'PRODUCED_BY'
			});
		});

		context('instance has associations', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Company'), 1);

				const response = await request(app).delete(`/companies/${SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID}`);

				const expectedResponseBody = {
					model: 'COMPANY',
					uuid: SHAKESPEARE_GLOBE_TRUST_COMPANY_UUID,
					name: 'Shakespeare Globe Trust',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: ['Production']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Company'), 1);
			});
		});
	});
});

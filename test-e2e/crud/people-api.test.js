import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

describe('CRUD (Create, Read, Update, Delete): People API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new person', async () => {
			const response = await request(app).get('/people/new');

			const expectedResponseBody = {
				model: 'PERSON',
				name: '',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD', () => {
		const PERSON_UUID = 'IAN_MCKELLEN_PERSON_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates person', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app).post('/people').send({
				name: 'Ian McKellen'
			});

			const expectedResponseBody = {
				model: 'PERSON',
				uuid: PERSON_UUID,
				name: 'Ian McKellen',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('gets data required to edit specific person', async () => {
			const response = await request(app).get(`/people/${PERSON_UUID}/edit`);

			const expectedResponseBody = {
				model: 'PERSON',
				uuid: PERSON_UUID,
				name: 'Ian McKellen',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates person', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app).put(`/people/${PERSON_UUID}`).send({
				name: 'Patrick Stewart'
			});

			const expectedResponseBody = {
				model: 'PERSON',
				uuid: PERSON_UUID,
				name: 'Patrick Stewart',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('shows person', async () => {
			const response = await request(app).get(`/people/${PERSON_UUID}`);

			const expectedResponseBody = {
				model: 'PERSON',
				uuid: PERSON_UUID,
				name: 'Patrick Stewart',
				differentiator: null,
				materials: [],
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				rightsGrantorMaterials: [],
				materialProductions: [],
				subsequentVersionMaterialProductions: [],
				sourcingMaterialProductions: [],
				rightsGrantorMaterialProductions: [],
				producerProductions: [],
				castMemberProductions: [],
				creativeProductions: [],
				crewProductions: [],
				reviewCriticProductions: [],
				awards: [],
				subsequentVersionMaterialAwards: [],
				sourcingMaterialAwards: [],
				rightsGrantorMaterialAwards: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes person', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app).delete(`/people/${PERSON_UUID}`);

			const expectedResponseBody = {
				model: 'PERSON',
				name: 'Patrick Stewart',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Person'), 0);
		});
	});

	describe('GET list endpoint', () => {
		const IAN_MCKELLEN_PERSON_UUID = 'IAN_MCKELLEN_PERSON_UUID';
		const PATRICK_STEWART_PERSON_UUID = 'PATRICK_STEWART_PERSON_UUID';
		const MATTHEW_KELLY_PERSON_UUID = 'MATTHEW_KELLY_PERSON_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/people').send({
				name: 'Ian McKellen'
			});

			await request(app).post('/people').send({
				name: 'Patrick Stewart'
			});

			await request(app).post('/people').send({
				name: 'Matthew Kelly'
			});
		});

		it('lists all people ordered by name', async () => {
			const response = await request(app).get('/people');

			const expectedResponseBody = [
				{
					model: 'PERSON',
					uuid: IAN_MCKELLEN_PERSON_UUID,
					name: 'Ian McKellen'
				},
				{
					model: 'PERSON',
					uuid: MATTHEW_KELLY_PERSON_UUID,
					name: 'Matthew Kelly'
				},
				{
					model: 'PERSON',
					uuid: PATRICK_STEWART_PERSON_UUID,
					name: 'Patrick Stewart'
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('CRUD (Create, Read, Update, Delete): Times API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new time', async () => {
			const response = await request(app).get('/times/new');

			const expectedResponseBody = {
				model: 'TIME',
				name: '',
				differentiator: '',
				fromDate: '',
				toDate: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD with minimum range of attributes assigned values', () => {
		const TIME_UUID = '1962_TIME_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates time', async () => {
			assert.equal(await countNodesWithLabel('Time'), 0);

			const response = await request(app).post('/times').send({
				name: '1962'
			});

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1962',
				differentiator: '',
				fromDate: '',
				toDate: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Time'), 1);
		});

		it('gets data required to edit specific time', async () => {
			const response = await request(app).get(`/times/${TIME_UUID}/edit`);

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1962',
				differentiator: '',
				fromDate: '',
				toDate: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates time', async () => {
			assert.equal(await countNodesWithLabel('Time'), 1);

			const response = await request(app).put(`/times/${TIME_UUID}`).send({
				name: '1963'
			});

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1963',
				differentiator: '',
				fromDate: '',
				toDate: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Time'), 1);
		});

		it('shows time', async () => {
			const response = await request(app).get(`/times/${TIME_UUID}`);

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1963',
				differentiator: null,
				surTimes: [],
				subTimes: [],
				materials: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes time', async () => {
			assert.equal(await countNodesWithLabel('Time'), 1);

			const response = await request(app).delete(`/times/${TIME_UUID}`);

			const expectedResponseBody = {
				model: 'TIME',
				name: '1963',
				differentiator: '',
				fromDate: '',
				toDate: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Time'), 0);
		});
	});

	describe('CRUD with full range of attributes assigned values', () => {
		const TIME_UUID = '1962_TIME_1_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates time', async () => {
			assert.equal(await countNodesWithLabel('Time'), 0);

			const response = await request(app).post('/times').send({
				name: '1962',
				differentiator: '1',
				fromDate: '1962-01-01',
				toDate: '1962-12-31'
			});

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1962',
				differentiator: '1',
				fromDate: '1962-01-01',
				toDate: '1962-12-31',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Time'), 1);
		});

		it('shows time (post-creation)', async () => {
			const response = await request(app).get(`/times/${TIME_UUID}`);

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1962',
				differentiator: '1',
				surTimes: [],
				subTimes: [],
				materials: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('gets data required to edit specific time', async () => {
			const response = await request(app).get(`/times/${TIME_UUID}/edit`);

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1962',
				differentiator: '1',
				fromDate: '1962-01-01',
				toDate: '1962-12-31',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates time (with existing data)', async () => {
			assert.equal(await countNodesWithLabel('Time'), 1);

			const response = await request(app).put(`/times/${TIME_UUID}`).send({
				name: '1962',
				differentiator: '1',
				fromDate: '1962-01-01',
				toDate: '1962-12-31'
			});

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1962',
				differentiator: '1',
				fromDate: '1962-01-01',
				toDate: '1962-12-31',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Time'), 1);
		});

		it('updates time (with new data)', async () => {
			assert.equal(await countNodesWithLabel('Time'), 1);

			const response = await request(app).put(`/times/${TIME_UUID}`).send({
				name: '1963',
				differentiator: '1',
				fromDate: '1963-01-01',
				toDate: '1963-12-31'
			});

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1963',
				differentiator: '1',
				fromDate: '1963-01-01',
				toDate: '1963-12-31',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Time'), 1);
		});

		it('shows time (post-update)', async () => {
			const response = await request(app).get(`/times/${TIME_UUID}`);

			const expectedResponseBody = {
				model: 'TIME',
				uuid: TIME_UUID,
				name: '1963',
				differentiator: '1',
				surTimes: [],
				subTimes: [],
				materials: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes time', async () => {
			assert.equal(await countNodesWithLabel('Time'), 1);

			const response = await request(app).delete(`/times/${TIME_UUID}`);

			const expectedResponseBody = {
				model: 'TIME',
				name: '1963',
				differentiator: '1',
				fromDate: '',
				toDate: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Time'), 0);
		});
	});

	describe('GET list endpoint', () => {
		const FIRST_JANUARY_NINETEEN_SIXTY_TIME_UUID = '1ST_JANUARY_1960_TIME_UUID';
		const CLASSICAL_ANTIQUITY_TIME_UUID = 'CLASSICAL_ANTIQUITY_TIME_UUID';
		const NINETEEN_SIXTY_NINE_TIME_UUID = '1969_TIME_UUID';
		const NINETEEN_SIXTIES_TIME_UUID = '1960S_TIME_UUID';
		const ANCIENT_ROME_TIME_UUID = 'ANCIENT_ROME_TIME_UUID';
		const NINETEEN_SIXTY_TIME_UUID = '1960_TIME_UUID';
		const EDWARDIAN_ERA_TIME_UUID = 'EDWARDIAN_ERA_TIME_UUID';
		const THIRTY_FIRST_DECEMBER_NINETEEN_SIXTY_NINE_TIME_UUID = '31ST_DECEMBER_1969_TIME_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/times').send({
				name: '1st January 1960',
				fromDate: '1960-01-01',
				toDate: '1960-01-01'
			});

			await request(app).post('/times').send({
				name: 'Classical antiquity'
			});

			await request(app).post('/times').send({
				name: '1969',
				fromDate: '1969-01-01',
				toDate: '1969-12-31'
			});

			await request(app).post('/times').send({
				name: '1960s',
				fromDate: '1960-01-01',
				toDate: '1969-12-31'
			});

			await request(app).post('/times').send({
				name: 'Ancient Rome'
			});

			await request(app).post('/times').send({
				name: '1960',
				fromDate: '1960-01-01',
				toDate: '1960-12-31'
			});

			await request(app).post('/times').send({
				name: 'Edwardian era'
			});

			await request(app).post('/times').send({
				name: '31st December 1969',
				fromDate: '1969-12-31',
				toDate: '1969-12-31'
			});
		});

		it('lists all times ordered by toDate, fromDate, then (those without those values) by name', async () => {
			const response = await request(app).get('/times');

			const expectedResponseBody = [
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTIES_TIME_UUID,
					name: '1960s'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_NINE_TIME_UUID,
					name: '1969'
				},
				{
					model: 'TIME',
					uuid: THIRTY_FIRST_DECEMBER_NINETEEN_SIXTY_NINE_TIME_UUID,
					name: '31st December 1969'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_TIME_UUID,
					name: '1960'
				},
				{
					model: 'TIME',
					uuid: FIRST_JANUARY_NINETEEN_SIXTY_TIME_UUID,
					name: '1st January 1960'
				},
				{
					model: 'TIME',
					uuid: ANCIENT_ROME_TIME_UUID,
					name: 'Ancient Rome'
				},
				{
					model: 'TIME',
					uuid: CLASSICAL_ANTIQUITY_TIME_UUID,
					name: 'Classical antiquity'
				},
				{
					model: 'TIME',
					uuid: EDWARDIAN_ERA_TIME_UUID,
					name: 'Edwardian era'
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

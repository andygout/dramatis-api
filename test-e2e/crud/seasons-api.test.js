import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

describe('CRUD (Create, Read, Update, Delete): Seasons API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new season', async () => {
			const response = await request(app).get('/seasons/new');

			const expectedResponseBody = {
				model: 'SEASON',
				name: '',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD', () => {
		const SEASON_UUID = 'NOT_BLACK_AND_WHITE_SEASON_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates season', async () => {
			assert.equal(await countNodesWithLabel('Season'), 0);

			const response = await request(app).post('/seasons').send({
				name: 'Not Black and White'
			});

			const expectedResponseBody = {
				model: 'SEASON',
				uuid: SEASON_UUID,
				name: 'Not Black and White',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Season'), 1);
		});

		it('gets data required to edit specific season', async () => {
			const response = await request(app).get(`/seasons/${SEASON_UUID}/edit`);

			const expectedResponseBody = {
				model: 'SEASON',
				uuid: SEASON_UUID,
				name: 'Not Black and White',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates season', async () => {
			assert.equal(await countNodesWithLabel('Season'), 1);

			const response = await request(app).put(`/seasons/${SEASON_UUID}`).send({
				name: 'The David Hare Season'
			});

			const expectedResponseBody = {
				model: 'SEASON',
				uuid: SEASON_UUID,
				name: 'The David Hare Season',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Season'), 1);
		});

		it('shows season', async () => {
			const response = await request(app).get(`/seasons/${SEASON_UUID}`);

			const expectedResponseBody = {
				model: 'SEASON',
				uuid: SEASON_UUID,
				name: 'The David Hare Season',
				differentiator: null,
				productions: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes season', async () => {
			assert.equal(await countNodesWithLabel('Season'), 1);

			const response = await request(app).delete(`/seasons/${SEASON_UUID}`);

			const expectedResponseBody = {
				model: 'SEASON',
				name: 'The David Hare Season',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Season'), 0);
		});
	});

	describe('GET list endpoint', () => {
		const THE_DAVID_HARE_SEASON_UUID = 'THE_DAVID_HARE_SEASON_SEASON_UUID';
		const NOT_BLACK_AND_WHITE_SEASON_UUID = 'NOT_BLACK_AND_WHITE_SEASON_UUID';
		const DONMAR_IN_THE_WEST_END_SEASON_UUID = 'DONMAR_IN_THE_WEST_END_SEASON_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/seasons').send({
				name: 'The David Hare Season'
			});

			await request(app).post('/seasons').send({
				name: 'Not Black and White'
			});

			await request(app).post('/seasons').send({
				name: 'Donmar in the West End'
			});
		});

		it('lists all seasons ordered by name', async () => {
			const response = await request(app).get('/seasons');

			const expectedResponseBody = [
				{
					model: 'SEASON',
					uuid: DONMAR_IN_THE_WEST_END_SEASON_UUID,
					name: 'Donmar in the West End'
				},
				{
					model: 'SEASON',
					uuid: NOT_BLACK_AND_WHITE_SEASON_UUID,
					name: 'Not Black and White'
				},
				{
					model: 'SEASON',
					uuid: THE_DAVID_HARE_SEASON_UUID,
					name: 'The David Hare Season'
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

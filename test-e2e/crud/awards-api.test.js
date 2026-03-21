import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('CRUD (Create, Read, Update, Delete): Awards API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new award', async () => {
			const response = await request(app).get('/awards/new');

			const expectedResponseBody = {
				model: 'AWARD',
				name: '',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD', () => {
		const AWARD_UUID = 'LAURENCE_OLIVIER_AWARDS_AWARD_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates award', async () => {
			assert.equal(await countNodesWithLabel('Award'), 0);

			const response = await request(app).post('/awards').send({
				name: 'Laurence Olivier Awards'
			});

			const expectedResponseBody = {
				model: 'AWARD',
				uuid: AWARD_UUID,
				name: 'Laurence Olivier Awards',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Award'), 1);
		});

		it('gets data required to edit specific award', async () => {
			const response = await request(app).get(`/awards/${AWARD_UUID}/edit`);

			const expectedResponseBody = {
				model: 'AWARD',
				uuid: AWARD_UUID,
				name: 'Laurence Olivier Awards',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates award', async () => {
			assert.equal(await countNodesWithLabel('Award'), 1);

			const response = await request(app).put(`/awards/${AWARD_UUID}`).send({
				name: 'Evening Standard Theatre Awards'
			});

			const expectedResponseBody = {
				model: 'AWARD',
				uuid: AWARD_UUID,
				name: 'Evening Standard Theatre Awards',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Award'), 1);
		});

		it('shows award', async () => {
			const response = await request(app).get(`/awards/${AWARD_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD',
				uuid: AWARD_UUID,
				name: 'Evening Standard Theatre Awards',
				differentiator: null,
				ceremonies: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes award', async () => {
			assert.equal(await countNodesWithLabel('Award'), 1);

			const response = await request(app).delete(`/awards/${AWARD_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD',
				name: 'Evening Standard Theatre Awards',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Award'), 0);
		});
	});

	describe('GET list endpoint', () => {
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = 'EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'LAURENCE_OLIVIER_AWARDS_AWARD_UUID';
		const CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID = 'CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/awards').send({
				name: 'Evening Standard Theatre Awards'
			});

			await request(app).post('/awards').send({
				name: 'Laurence Olivier Awards'
			});

			await request(app).post('/awards').send({
				name: "Critics' Circle Theatre Awards"
			});
		});

		it('lists all awards ordered by name', async () => {
			const response = await request(app).get('/awards');

			const expectedResponseBody = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: "Critics' Circle Theatre Awards"
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards'
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards'
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

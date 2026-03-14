import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

describe('CRUD (Create, Read, Update, Delete): Characters API', () => {
	describe('GET new endpoint', () => {
		it('responds with data required to prepare new character', async () => {
			const response = await request(app).get('/characters/new');

			const expectedResponseBody = {
				model: 'CHARACTER',
				name: '',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});

	describe('CRUD', () => {
		const CHARACTER_UUID = 'ROMEO_CHARACTER_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();
		});

		it('creates character', async () => {
			assert.equal(await countNodesWithLabel('Character'), 0);

			const response = await request(app).post('/characters').send({
				name: 'Romeo'
			});

			const expectedResponseBody = {
				model: 'CHARACTER',
				uuid: CHARACTER_UUID,
				name: 'Romeo',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Character'), 1);
		});

		it('gets data required to edit specific character', async () => {
			const response = await request(app).get(`/characters/${CHARACTER_UUID}/edit`);

			const expectedResponseBody = {
				model: 'CHARACTER',
				uuid: CHARACTER_UUID,
				name: 'Romeo',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('updates character', async () => {
			assert.equal(await countNodesWithLabel('Character'), 1);

			const response = await request(app).put(`/characters/${CHARACTER_UUID}`).send({
				name: 'Juliet'
			});

			const expectedResponseBody = {
				model: 'CHARACTER',
				uuid: CHARACTER_UUID,
				name: 'Juliet',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Character'), 1);
		});

		it('shows character', async () => {
			const response = await request(app).get(`/characters/${CHARACTER_UUID}`);

			const expectedResponseBody = {
				model: 'CHARACTER',
				uuid: CHARACTER_UUID,
				name: 'Juliet',
				differentiator: null,
				materials: [],
				productions: [],
				variantNamedDepictions: [],
				variantNamedPortrayals: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});

		it('deletes character', async () => {
			assert.equal(await countNodesWithLabel('Character'), 1);

			const response = await request(app).delete(`/characters/${CHARACTER_UUID}`);

			const expectedResponseBody = {
				model: 'CHARACTER',
				name: 'Juliet',
				differentiator: '',
				errors: {}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Character'), 0);
		});
	});

	describe('GET list endpoint', () => {
		const ROMEO_CHARACTER_UUID = 'ROMEO_CHARACTER_UUID';
		const JULIET_CHARACTER_UUID = 'JULIET_CHARACTER_UUID';
		const NURSE_CHARACTER_UUID = 'NURSE_CHARACTER_UUID';

		before(async () => {
			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request(app).post('/characters').send({
				name: 'Romeo'
			});

			await request(app).post('/characters').send({
				name: 'Juliet'
			});

			await request(app).post('/characters').send({
				name: 'Nurse'
			});
		});

		it('lists all characters ordered by name', async () => {
			const response = await request(app).get('/characters');

			const expectedResponseBody = [
				{
					model: 'CHARACTER',
					uuid: JULIET_CHARACTER_UUID,
					name: 'Juliet'
				},
				{
					model: 'CHARACTER',
					uuid: NURSE_CHARACTER_UUID,
					name: 'Nurse'
				},
				{
					model: 'CHARACTER',
					uuid: ROMEO_CHARACTER_UUID,
					name: 'Romeo'
				}
			];

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
		});
	});
});

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';
import { countNodesWithLabel, createNode, purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('Uniqueness in database: Places API', () => {
	describe('Place uniqueness in database', () => {
		const PLACE_1_UUID = '2';
		const PLACE_2_UUID = '5';

		before(async () => {
			stubUuidCounterClient.setValueToZero();

			await purgeDatabase();
		});

		after(() => {
			stubUuidCounterClient.setValueToUndefined();
		});

		it('creates place without differentiator', async () => {
			assert.equal(await countNodesWithLabel('Place'), 0);

			const response = await request(app).post('/places').send({
				name: 'London'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_1_UUID,
				name: 'London',
				differentiator: '',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 1);
		});

		it('responds with errors if trying to create existing place that does also not have differentiator', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app).post('/places').send({
				name: 'London'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				name: 'London',
				differentiator: '',
				hasErrors: true,
				errors: {
					name: ['Name and differentiator combination already exists'],
					differentiator: ['Name and differentiator combination already exists']
				},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 1);
		});

		it('creates place with same name as existing place but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app).post('/places').send({
				name: 'London',
				differentiator: '1'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_2_UUID,
				name: 'London',
				differentiator: '1',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 2);
		});

		it('responds with errors if trying to update place to one with same name and differentiator combination', async () => {
			assert.equal(await countNodesWithLabel('Place'), 2);

			const response = await request(app).put(`/places/${PLACE_1_UUID}`).send({
				name: 'London',
				differentiator: '1'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_1_UUID,
				name: 'London',
				differentiator: '1',
				hasErrors: true,
				errors: {
					name: ['Name and differentiator combination already exists'],
					differentiator: ['Name and differentiator combination already exists']
				},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 2);
		});

		it('updates place with same name as existing place but uses a different differentiator', async () => {
			assert.equal(await countNodesWithLabel('Place'), 2);

			const response = await request(app).put(`/places/${PLACE_1_UUID}`).send({
				name: 'London',
				differentiator: '2'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_1_UUID,
				name: 'London',
				differentiator: '2',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 2);
		});

		it('updates place with same name as existing place but without a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Place'), 2);

			const response = await request(app).put(`/places/${PLACE_2_UUID}`).send({
				name: 'London'
			});

			const expectedResponseBody = {
				model: 'PLACE',
				uuid: PLACE_2_UUID,
				name: 'London',
				differentiator: '',
				errors: {},
				surPlace: {
					model: 'PLACE',
					name: '',
					differentiator: '',
					errors: {}
				}
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Place'), 2);
		});
	});

	describe('Place sur-place uniqueness in database', () => {
		const TBILISI_PLACE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedSurPlaceGeorgia1 = {
			model: 'PLACE',
			name: 'Georgia',
			differentiator: '',
			errors: {}
		};

		const expectedSurPlaceGeorgia2 = {
			model: 'PLACE',
			name: 'Georgia',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Place',
				uuid: TBILISI_PLACE_UUID,
				name: 'Tbilisi'
			});
		});

		it('updates place and creates sur-place that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Place'), 1);

			const response = await request(app)
				.put(`/places/${TBILISI_PLACE_UUID}`)
				.send({
					name: 'Tbilisi',
					surPlace: {
						name: 'Georgia'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.surPlace, expectedSurPlaceGeorgia1);
			assert.equal(await countNodesWithLabel('Place'), 2);
		});

		it('updates place and creates sur-place that has same name as existing sur-place but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Place'), 2);

			const response = await request(app)
				.put(`/places/${TBILISI_PLACE_UUID}`)
				.send({
					name: 'Tbilisi',
					surPlace: {
						name: 'Georgia',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.surPlace, expectedSurPlaceGeorgia2);
			assert.equal(await countNodesWithLabel('Place'), 3);
		});

		it('updates place and uses existing sur-place that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Place'), 3);

			const response = await request(app)
				.put(`/places/${TBILISI_PLACE_UUID}`)
				.send({
					name: 'Tbilisi',
					surPlace: {
						name: 'Georgia'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.surPlace, expectedSurPlaceGeorgia1);
			assert.equal(await countNodesWithLabel('Place'), 3);
		});

		it('updates place and uses existing sur-place that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Place'), 3);

			const response = await request(app)
				.put(`/places/${TBILISI_PLACE_UUID}`)
				.send({
					name: 'Tbilisi',
					surPlace: {
						name: 'Georgia',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.surPlace, expectedSurPlaceGeorgia2);
			assert.equal(await countNodesWithLabel('Place'), 3);
		});
	});
});

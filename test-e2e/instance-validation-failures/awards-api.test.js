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

describe('Instance validation failures: Awards API', () => {
	describe('attempt to create instance', () => {
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Award',
				uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
				name: 'Laurence Olivier Awards'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Award'), 1);

				const response = await request(app).post('/awards').send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'AWARD',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Award'), 1);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Award'), 1);

				const response = await request(app).post('/awards').send({
					name: 'Laurence Olivier Awards'
				});

				const expectedResponseBody = {
					model: 'AWARD',
					name: 'Laurence Olivier Awards',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Award'), 1);
			});
		});
	});

	describe('attempt to update instance', () => {
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Award',
				uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
				name: 'Evening Standard Theatre Awards'
			});

			await createNode({
				label: 'Award',
				uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
				name: 'Laurence Olivier Awards'
			});
		});

		context('instance has input validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Award'), 2);

				const response = await request(app).put(`/awards/${EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID}`).send({
					name: ''
				});

				const expectedResponseBody = {
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Value is too short']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Award'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Award',
						name: 'Evening Standard Theatre Awards',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID
					}),
					true
				);
			});
		});

		context('instance has database validation failures', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Award'), 2);

				const response = await request(app).put(`/awards/${EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID}`).send({
					name: 'Laurence Olivier Awards'
				});

				const expectedResponseBody = {
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: ['Name and differentiator combination already exists'],
						differentiator: ['Name and differentiator combination already exists']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Award'), 2);
				assert.equal(
					await isNodeExistent({
						label: 'Award',
						name: 'Evening Standard Theatre Awards',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID
					}),
					true
				);
			});
		});
	});

	describe('attempt to delete instance', () => {
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Award',
				uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
				name: 'Evening Standard Theatre Awards'
			});

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
				name: '2019'
			});

			await createRelationship({
				sourceLabel: 'AwardCeremony',
				sourceUuid: TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
				destinationLabel: 'Award',
				destinationUuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
				relationshipName: 'PRESENTED_AT'
			});
		});

		context('instance has associations', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('Award'), 1);

				const response = await request(app).delete(`/awards/${EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID}`);

				const expectedResponseBody = {
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: ['AwardCeremony']
					}
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('Award'), 1);
			});
		});
	});
});

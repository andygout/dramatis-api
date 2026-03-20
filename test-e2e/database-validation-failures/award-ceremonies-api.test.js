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

describe('Database validation failures: Award ceremonies API', () => {
	describe('attempt to create instance', () => {
		before(async () => {
			await purgeDatabase();
		});

		context('nominated production uuid does not exist in database', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('AwardCeremony'), 0);

				const response = await request(app)
					.post('/award-ceremonies')
					.send({
						name: '2020',
						award: {
							name: 'Laurence Olivier Awards'
						},
						categories: [
							{
								name: 'Best Revival',
								nominations: [
									{
										productions: [
											{
												uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
											}
										]
									}
								]
							}
						]
					});

				const expectedResponseBody = {
					model: 'AWARD_CEREMONY',
					name: '2020',
					hasErrors: true,
					errors: {},
					award: {
						model: 'AWARD',
						name: 'Laurence Olivier Awards',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							model: 'AWARD_CEREMONY_CATEGORY',
							name: 'Best Revival',
							errors: {},
							nominations: [
								{
									model: 'NOMINATION',
									isWinner: false,
									customType: '',
									errors: {},
									entities: [],
									productions: [
										{
											model: 'PRODUCTION_IDENTIFIER',
											uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
											errors: {
												uuid: ['Production with this UUID does not exist']
											}
										}
									],
									materials: []
								}
							]
						}
					]
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('AwardCeremony'), 0);
			});
		});
	});

	describe('attempt to update instance', () => {
		const TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				name: '2020'
			});

			await createNode({
				label: 'Award',
				uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
				name: 'Laurence Olivier Awards'
			});

			await createRelationship({
				sourceLabel: 'Award',
				sourceUuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
				destinationLabel: 'AwardCeremony',
				destinationUuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				relationshipName: 'PRESENTED_AT'
			});
		});

		context('nominated production uuid does not exist in database', () => {
			it('returns instance with appropriate errors attached', async () => {
				assert.equal(await countNodesWithLabel('AwardCeremony'), 1);

				const response = await request(app)
					.put(`/award-ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
					.send({
						name: '2020',
						award: {
							name: 'Laurence Olivier Awards'
						},
						categories: [
							{
								name: 'Best Revival',
								nominations: [
									{
										productions: [
											{
												uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
											}
										]
									}
								]
							}
						]
					});

				const expectedResponseBody = {
					model: 'AWARD_CEREMONY',
					uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
					name: '2020',
					hasErrors: true,
					errors: {},
					award: {
						model: 'AWARD',
						name: 'Laurence Olivier Awards',
						differentiator: '',
						errors: {}
					},
					categories: [
						{
							model: 'AWARD_CEREMONY_CATEGORY',
							name: 'Best Revival',
							errors: {},
							nominations: [
								{
									model: 'NOMINATION',
									isWinner: false,
									customType: '',
									errors: {},
									entities: [],
									productions: [
										{
											model: 'PRODUCTION_IDENTIFIER',
											uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
											errors: {
												uuid: ['Production with this UUID does not exist']
											}
										}
									],
									materials: []
								}
							]
						}
					]
				};

				assert.equal(response.status, 200);
				assert.deepEqual(response.body, expectedResponseBody);
				assert.equal(await countNodesWithLabel('AwardCeremony'), 1);
				assert.equal(
					await isNodeExistent({
						label: 'AwardCeremony',
						name: '2020',
						uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID
					}),
					true
				);
			});
		});
	});
});

import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { countNodesWithLabel, createNode, purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('Uniqueness in database: Award ceremonies API', () => {
	describe('Award ceremony award uniqueness in database', () => {
		const TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedAwardCriticsCircleTheatreAwards1 = {
			model: 'AWARD',
			name: "Critics' Circle Theatre Awards",
			differentiator: '',
			errors: {}
		};

		const expectedAwardCriticsCircleTheatreAwards2 = {
			model: 'AWARD',
			name: "Critics' Circle Theatre Awards",
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
				name: '2020'
			});
		});

		it('updates award ceremony and creates award that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Award'), 0);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: "Critics' Circle Theatre Awards"
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.award, expectedAwardCriticsCircleTheatreAwards1);
			assert.equal(await countNodesWithLabel('Award'), 1);
		});

		it('updates award ceremony and creates award that has same name as existing award but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Award'), 1);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: "Critics' Circle Theatre Awards",
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.award, expectedAwardCriticsCircleTheatreAwards2);
			assert.equal(await countNodesWithLabel('Award'), 2);
		});

		it('updates award ceremony and uses existing award that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Award'), 2);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: "Critics' Circle Theatre Awards"
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.award, expectedAwardCriticsCircleTheatreAwards1);
			assert.equal(await countNodesWithLabel('Award'), 2);
		});

		it('updates award ceremony and uses existing award that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Award'), 2);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2020',
					award: {
						name: "Critics' Circle Theatre Awards",
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.award, expectedAwardCriticsCircleTheatreAwards2);
			assert.equal(await countNodesWithLabel('Award'), 2);
		});
	});

	describe('Award ceremony nominee entity (person) uniqueness in database', () => {
		const TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonChristopherShutt1 = {
			model: 'PERSON',
			name: 'Christopher Shutt',
			differentiator: '',
			errors: {}
		};

		const expectedPersonChristopherShutt2 = {
			model: 'PERSON',
			name: 'Christopher Shutt',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
				name: '2010'
			});
		});

		it('updates award ceremony and creates nominee entity (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Christopher Shutt'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.categories[0].nominations[0].entities[0], expectedPersonChristopherShutt1);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates award ceremony and creates nominee entity (person) that has same name as existing nominee entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Christopher Shutt',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.categories[0].nominations[0].entities[0], expectedPersonChristopherShutt2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates award ceremony and uses existing nominee entity (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Christopher Shutt'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.categories[0].nominations[0].entities[0], expectedPersonChristopherShutt1);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates award ceremony and uses existing nominee entity (person) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Christopher Shutt',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.categories[0].nominations[0].entities[0], expectedPersonChristopherShutt2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});

	describe('Award ceremony nominee entity (company) uniqueness in database', () => {
		const TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCompanyAutograph1 = {
			model: 'COMPANY',
			name: 'Autograph',
			differentiator: '',
			errors: {},
			members: [
				{
					model: 'PERSON',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		const expectedCompanyAutograph2 = {
			model: 'COMPANY',
			name: 'Autograph',
			differentiator: '1',
			errors: {},
			members: [
				{
					model: 'PERSON',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
				name: '2010'
			});
		});

		it('updates award ceremony and creates nominee entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 0);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.categories[0].nominations[0].entities[0], expectedCompanyAutograph1);
			assert.equal(await countNodesWithLabel('Company'), 1);
		});

		it('updates award ceremony and creates nominee entity (company) that has same name as existing nominee entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 1);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.categories[0].nominations[0].entities[0], expectedCompanyAutograph2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates award ceremony and uses existing nominee entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.categories[0].nominations[0].entities[0], expectedCompanyAutograph1);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates award ceremony and uses existing nominee entity (company) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.categories[0].nominations[0].entities[0], expectedCompanyAutograph2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});
	});

	describe('Award ceremony nominee entity (company) credited member (person) uniqueness in database', () => {
		const TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonIanDickinson1 = {
			model: 'PERSON',
			name: 'Ian Dickinson',
			differentiator: '',
			errors: {}
		};

		const expectedPersonIanDickinson2 = {
			model: 'PERSON',
			name: 'Ian Dickinson',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'AwardCeremony',
				uuid: TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
				name: '2010'
			});
		});

		it('updates award ceremony and creates nominee entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											members: [
												{
													name: 'Ian Dickinson'
												}
											]
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(
				response.body.categories[0].nominations[0].entities[0].members[0],
				expectedPersonIanDickinson1
			);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates award ceremony and creates nominee entity (company) that has same name as existing nominee entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											members: [
												{
													name: 'Ian Dickinson',
													differentiator: '1'
												}
											]
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(
				response.body.categories[0].nominations[0].entities[0].members[0],
				expectedPersonIanDickinson2
			);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates award ceremony and uses existing nominee entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											members: [
												{
													name: 'Ian Dickinson'
												}
											]
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(
				response.body.categories[0].nominations[0].entities[0].members[0],
				expectedPersonIanDickinson1
			);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates award ceremony and uses existing nominee entity (company) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/award-ceremonies/${TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID}`)
				.send({
					name: '2010',
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											members: [
												{
													name: 'Ian Dickinson',
													differentiator: '1'
												}
											]
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(
				response.body.categories[0].nominations[0].entities[0].members[0],
				expectedPersonIanDickinson2
			);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});
});

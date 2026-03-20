import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { countNodesWithLabel, createNode, purgeDatabase } from '../test-helpers/neo4j/index.js';

describe('Uniqueness in database: Productions API', () => {
	describe('Production material uniqueness in database', () => {
		const HOME_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedMaterialHome1 = {
			model: 'MATERIAL',
			name: 'Home',
			differentiator: '',
			errors: {}
		};

		const expectedMaterialHome2 = {
			model: 'MATERIAL',
			name: 'Home',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: HOME_PRODUCTION_UUID,
				name: 'Home'
			});
		});

		it('updates production and creates material that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 0);

			const response = await request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					material: {
						name: 'Home'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.material, expectedMaterialHome1);
			assert.equal(await countNodesWithLabel('Material'), 1);
		});

		it('updates production and creates material that has same name as existing material but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 1);

			const response = await request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					material: {
						name: 'Home',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.material, expectedMaterialHome2);
			assert.equal(await countNodesWithLabel('Material'), 2);
		});

		it('updates production and uses existing material that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 2);

			const response = await request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					material: {
						name: 'Home'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.material, expectedMaterialHome1);
			assert.equal(await countNodesWithLabel('Material'), 2);
		});

		it('updates production and uses existing material that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 2);

			const response = await request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					material: {
						name: 'Home',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.material, expectedMaterialHome2);
			assert.equal(await countNodesWithLabel('Material'), 2);
		});
	});

	describe('Production venue uniqueness in database', () => {
		const DIAL_M_FOR_MURDER_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedVenueNewTheatre1 = {
			model: 'VENUE',
			name: 'New Theatre',
			differentiator: '',
			errors: {}
		};

		const expectedVenueNewTheatre2 = {
			model: 'VENUE',
			name: 'New Theatre',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: DIAL_M_FOR_MURDER_PRODUCTION_UUID,
				name: 'Dial M for Murder'
			});
		});

		it('updates production and creates venue that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 0);

			const response = await request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					venue: {
						name: 'New Theatre'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.venue, expectedVenueNewTheatre1);
			assert.equal(await countNodesWithLabel('Venue'), 1);
		});

		it('updates production and creates venue that has same name as existing venue but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 1);

			const response = await request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					venue: {
						name: 'New Theatre',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.venue, expectedVenueNewTheatre2);
			assert.equal(await countNodesWithLabel('Venue'), 2);
		});

		it('updates production and uses existing venue that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 2);

			const response = await request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					venue: {
						name: 'New Theatre'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.venue, expectedVenueNewTheatre1);
			assert.equal(await countNodesWithLabel('Venue'), 2);
		});

		it('updates production and uses existing venue that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Venue'), 2);

			const response = await request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					venue: {
						name: 'New Theatre',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.venue, expectedVenueNewTheatre2);
			assert.equal(await countNodesWithLabel('Venue'), 2);
		});
	});

	describe('Production season uniqueness in database', () => {
		const DETAINING_JUSTICE_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedSeasonNotBlackAndWhite1 = {
			model: 'SEASON',
			name: 'Not Black and White',
			differentiator: '',
			errors: {}
		};

		const expectedSeasonNotBlackAndWhite2 = {
			model: 'SEASON',
			name: 'Not Black and White',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: DETAINING_JUSTICE_PRODUCTION_UUID,
				name: 'Detaining Justice'
			});
		});

		it('updates production and creates season that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Season'), 0);

			const response = await request(app)
				.put(`/productions/${DETAINING_JUSTICE_PRODUCTION_UUID}`)
				.send({
					name: 'Detaining Justice',
					season: {
						name: 'Not Black and White'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.season, expectedSeasonNotBlackAndWhite1);
			assert.equal(await countNodesWithLabel('Season'), 1);
		});

		it('updates production and creates season that has same name as existing season but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Season'), 1);

			const response = await request(app)
				.put(`/productions/${DETAINING_JUSTICE_PRODUCTION_UUID}`)
				.send({
					name: 'Detaining Justice',
					season: {
						name: 'Not Black and White',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.season, expectedSeasonNotBlackAndWhite2);
			assert.equal(await countNodesWithLabel('Season'), 2);
		});

		it('updates production and uses existing season that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Season'), 2);

			const response = await request(app)
				.put(`/productions/${DETAINING_JUSTICE_PRODUCTION_UUID}`)
				.send({
					name: 'Detaining Justice',
					season: {
						name: 'Not Black and White'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.season, expectedSeasonNotBlackAndWhite1);
			assert.equal(await countNodesWithLabel('Season'), 2);
		});

		it('updates production and uses existing season that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Season'), 2);

			const response = await request(app)
				.put(`/productions/${DETAINING_JUSTICE_PRODUCTION_UUID}`)
				.send({
					name: 'Detaining Justice',
					season: {
						name: 'Not Black and White',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.season, expectedSeasonNotBlackAndWhite2);
			assert.equal(await countNodesWithLabel('Season'), 2);
		});
	});

	describe('Production festival uniqueness in database', () => {
		const MEASURE_FOR_MEASURE_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedFestivalGlobeToGlobe1 = {
			model: 'FESTIVAL',
			name: 'Globe to Globe',
			differentiator: '',
			errors: {}
		};

		const expectedFestivalGlobeToGlobe2 = {
			model: 'FESTIVAL',
			name: 'Globe to Globe',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: MEASURE_FOR_MEASURE_PRODUCTION_UUID,
				name: 'Measure for Measure'
			});
		});

		it('updates production and creates festival that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Festival'), 0);

			const response = await request(app)
				.put(`/productions/${MEASURE_FOR_MEASURE_PRODUCTION_UUID}`)
				.send({
					name: 'Measure for Measure',
					festival: {
						name: 'Globe to Globe'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.festival, expectedFestivalGlobeToGlobe1);
			assert.equal(await countNodesWithLabel('Festival'), 1);
		});

		it('updates production and creates festival that has same name as existing festival but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Festival'), 1);

			const response = await request(app)
				.put(`/productions/${MEASURE_FOR_MEASURE_PRODUCTION_UUID}`)
				.send({
					name: 'Measure for Measure',
					festival: {
						name: 'Globe to Globe',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.festival, expectedFestivalGlobeToGlobe2);
			assert.equal(await countNodesWithLabel('Festival'), 2);
		});

		it('updates production and uses existing festival that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Festival'), 2);

			const response = await request(app)
				.put(`/productions/${MEASURE_FOR_MEASURE_PRODUCTION_UUID}`)
				.send({
					name: 'Measure for Measure',
					festival: {
						name: 'Globe to Globe'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.festival, expectedFestivalGlobeToGlobe1);
			assert.equal(await countNodesWithLabel('Festival'), 2);
		});

		it('updates production and uses existing festival that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Festival'), 2);

			const response = await request(app)
				.put(`/productions/${MEASURE_FOR_MEASURE_PRODUCTION_UUID}`)
				.send({
					name: 'Measure for Measure',
					festival: {
						name: 'Globe to Globe',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.festival, expectedFestivalGlobeToGlobe2);
			assert.equal(await countNodesWithLabel('Festival'), 2);
		});
	});

	describe('Production producer entity (person) uniqueness in database', () => {
		const GIRL_NO_7_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonPaulHiggins1 = {
			model: 'PERSON',
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		const expectedPersonPaulHiggins2 = {
			model: 'PERSON',
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: GIRL_NO_7_PRODUCTION_UUID,
				name: 'Girl No 7'
			});
		});

		it('updates production and creates producer entity (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									name: 'Paul Higgins'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0], expectedPersonPaulHiggins1);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates production and creates producer entity (person) that has same name as existing producer entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									name: 'Paul Higgins',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0], expectedPersonPaulHiggins2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing producer entity (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									name: 'Paul Higgins'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0], expectedPersonPaulHiggins1);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing producer entity (person) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									name: 'Paul Higgins',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0], expectedPersonPaulHiggins2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});

	describe('Production producer entity (company) uniqueness in database', () => {
		const HAMLET_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCompanyTheatreRoyalProductions1 = {
			model: 'COMPANY',
			name: 'Theatre Royal Productions',
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

		const expectedCompanyTheatreRoyalProductions2 = {
			model: 'COMPANY',
			name: 'Theatre Royal Productions',
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
				label: 'Production',
				uuid: HAMLET_PRODUCTION_UUID,
				name: 'Hamlet'
			});
		});

		it('updates production and creates producer entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 0);

			const response = await request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Theatre Royal Productions'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0], expectedCompanyTheatreRoyalProductions1);
			assert.equal(await countNodesWithLabel('Company'), 1);
		});

		it('updates production and creates producer entity (company) that has same name as existing producer entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 1);

			const response = await request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Theatre Royal Productions',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0], expectedCompanyTheatreRoyalProductions2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates production and uses existing producer entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Theatre Royal Productions'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0], expectedCompanyTheatreRoyalProductions1);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates production and uses existing producer entity (company) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Theatre Royal Productions',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0], expectedCompanyTheatreRoyalProductions2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});
	});

	describe('Production producer entity (company) credited member (person) uniqueness in database', () => {
		const GIRL_NO_7_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonPaulHiggins1 = {
			model: 'PERSON',
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		const expectedPersonPaulHiggins2 = {
			model: 'PERSON',
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: GIRL_NO_7_PRODUCTION_UUID,
				name: 'Girl No 7'
			});
		});

		it('updates production and creates producer entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Theatre 503 Productions',
									members: [
										{
											name: 'Paul Higgins'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0].members[0], expectedPersonPaulHiggins1);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates production and creates producer entity (company) that has same name as existing producer entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Theatre 503 Productions',
									members: [
										{
											name: 'Paul Higgins',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0].members[0], expectedPersonPaulHiggins2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing producer entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Theatre 503 Productions',
									members: [
										{
											name: 'Paul Higgins'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0].members[0], expectedPersonPaulHiggins1);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing producer entity (company) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					producerCredits: [
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Theatre 503 Productions',
									members: [
										{
											name: 'Paul Higgins',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.producerCredits[0].entities[0].members[0], expectedPersonPaulHiggins2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});

	describe('Production cast member uniqueness in database', () => {
		const ARISTOCRATS_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCastMemberPaulHiggins1 = {
			model: 'PERSON',
			name: 'Paul Higgins',
			differentiator: '',
			errors: {},
			roles: [
				{
					model: 'ROLE',
					name: '',
					characterName: '',
					characterDifferentiator: '',
					qualifier: '',
					isAlternate: false,
					errors: {}
				}
			]
		};

		const expectedCastMemberPaulHiggins2 = {
			model: 'PERSON',
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {},
			roles: [
				{
					model: 'ROLE',
					name: '',
					characterName: '',
					characterDifferentiator: '',
					qualifier: '',
					isAlternate: false,
					errors: {}
				}
			]
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: ARISTOCRATS_PRODUCTION_UUID,
				name: 'Aristocrats'
			});
		});

		it('updates production and creates cast member that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins'
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.cast[0], expectedCastMemberPaulHiggins1);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates production and creates cast member that has same name as existing cast member but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins',
							differentiator: '1'
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.cast[0], expectedCastMemberPaulHiggins2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing cast member that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins'
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.cast[0], expectedCastMemberPaulHiggins1);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing cast member that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins',
							differentiator: '1'
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.cast[0], expectedCastMemberPaulHiggins2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});

	describe('Production creative entity (person) uniqueness in database', () => {
		const GIRL_NO_7_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonPaulHiggins1 = {
			model: 'PERSON',
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		const expectedPersonPaulHiggins2 = {
			model: 'PERSON',
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: GIRL_NO_7_PRODUCTION_UUID,
				name: 'Girl No 7'
			});
		});

		it('updates production and creates creative entity (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Paul Higgins'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0], expectedPersonPaulHiggins1);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates production and creates creative entity (person) that has same name as existing creative entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Paul Higgins',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0], expectedPersonPaulHiggins2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing creative entity (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Paul Higgins'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0], expectedPersonPaulHiggins1);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing creative entity (person) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${GIRL_NO_7_PRODUCTION_UUID}`)
				.send({
					name: 'Girl No 7',
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Paul Higgins',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0], expectedPersonPaulHiggins2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});

	describe('Production creative entity (company) uniqueness in database', () => {
		const MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

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
				label: 'Production',
				uuid: MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID,
				name: 'Mother Courage and Her Children'
			});
		});

		it('updates production and creates creative entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 0);

			const response = await request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0], expectedCompanyAutograph1);
			assert.equal(await countNodesWithLabel('Company'), 1);
		});

		it('updates production and creates creative entity (company) that has same name as existing creative entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 1);

			const response = await request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0], expectedCompanyAutograph2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates production and uses existing creative entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0], expectedCompanyAutograph1);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates production and uses existing creative entity (company) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0], expectedCompanyAutograph2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});
	});

	describe('Production creative entity (company) credited member (person) uniqueness in database', () => {
		const MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonAndrewBruce1 = {
			model: 'PERSON',
			name: 'Andrew Bruce',
			differentiator: '',
			errors: {}
		};

		const expectedPersonAndrewBruce2 = {
			model: 'PERSON',
			name: 'Andrew Bruce',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID,
				name: 'Mother Courage and Her Children'
			});
		});

		it('updates production and creates creative entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									members: [
										{
											name: 'Andrew Bruce'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0].members[0], expectedPersonAndrewBruce1);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates production and creates creative entity (company) that has same name as existing creative entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									members: [
										{
											name: 'Andrew Bruce',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0].members[0], expectedPersonAndrewBruce2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing creative entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									members: [
										{
											name: 'Andrew Bruce'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0].members[0], expectedPersonAndrewBruce1);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing creative entity (company) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_PRODUCTION_UUID}`)
				.send({
					name: 'Mother Courage and Her Children',
					creativeCredits: [
						{
							name: 'Sound Designer',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									members: [
										{
											name: 'Andrew Bruce',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.creativeCredits[0].entities[0].members[0], expectedPersonAndrewBruce2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});

	describe('Production crew entity (person) uniqueness in database', () => {
		const MRS_AFFLECK_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonTariqHussain1 = {
			model: 'PERSON',
			name: 'Tariq Hussain',
			differentiator: '',
			errors: {}
		};

		const expectedPersonTariqHussain2 = {
			model: 'PERSON',
			name: 'Tariq Hussain',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: MRS_AFFLECK_PRODUCTION_UUID,
				name: 'Mrs Affleck'
			});
		});

		it('updates production and creates crew entity (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/productions/${MRS_AFFLECK_PRODUCTION_UUID}`)
				.send({
					name: 'Mrs Affleck',
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Tariq Hussain'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0], expectedPersonTariqHussain1);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates production and creates crew entity (person) that has same name as existing crew entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/productions/${MRS_AFFLECK_PRODUCTION_UUID}`)
				.send({
					name: 'Mrs Affleck',
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Tariq Hussain',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0], expectedPersonTariqHussain2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing crew entity (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${MRS_AFFLECK_PRODUCTION_UUID}`)
				.send({
					name: 'Mrs Affleck',
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Tariq Hussain'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0], expectedPersonTariqHussain1);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing crew entity (person) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${MRS_AFFLECK_PRODUCTION_UUID}`)
				.send({
					name: 'Mrs Affleck',
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Tariq Hussain',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0], expectedPersonTariqHussain2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});

	describe('Production crew entity (company) uniqueness in database', () => {
		const THREE_SISTERS_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCompanyCrewDeputiesLtd1 = {
			model: 'COMPANY',
			name: 'Crew Deputies Ltd',
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

		const expectedCompanyCrewDeputiesLtd2 = {
			model: 'COMPANY',
			name: 'Crew Deputies Ltd',
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
				label: 'Production',
				uuid: THREE_SISTERS_PRODUCTION_UUID,
				name: 'Three Sisters'
			});
		});

		it('updates production and creates crew entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 0);

			const response = await request(app)
				.put(`/productions/${THREE_SISTERS_PRODUCTION_UUID}`)
				.send({
					name: 'Three Sisters',
					crewCredits: [
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Deputies Ltd'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0], expectedCompanyCrewDeputiesLtd1);
			assert.equal(await countNodesWithLabel('Company'), 1);
		});

		it('updates production and creates crew entity (company) that has same name as existing crew entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 1);

			const response = await request(app)
				.put(`/productions/${THREE_SISTERS_PRODUCTION_UUID}`)
				.send({
					name: 'Three Sisters',
					crewCredits: [
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Deputies Ltd',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0], expectedCompanyCrewDeputiesLtd2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates production and uses existing crew entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/productions/${THREE_SISTERS_PRODUCTION_UUID}`)
				.send({
					name: 'Three Sisters',
					crewCredits: [
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Deputies Ltd'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0], expectedCompanyCrewDeputiesLtd1);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates production and uses existing crew entity (company) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/productions/${THREE_SISTERS_PRODUCTION_UUID}`)
				.send({
					name: 'Three Sisters',
					crewCredits: [
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Deputies Ltd',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0], expectedCompanyCrewDeputiesLtd2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});
	});

	describe('Production crew entity (company) credited member (person) uniqueness in database', () => {
		const HAMLET_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonMollyEinchcomb1 = {
			model: 'PERSON',
			name: 'Molly Einchcomb',
			differentiator: '',
			errors: {}
		};

		const expectedPersonMollyEinchcomb2 = {
			model: 'PERSON',
			name: 'Molly Einchcomb',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: HAMLET_PRODUCTION_UUID,
				name: 'Hamlet'
			});
		});

		it('updates production and creates crew entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Assistants Ltd',
									members: [
										{
											name: 'Molly Einchcomb'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0].members[0], expectedPersonMollyEinchcomb1);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates production and creates crew entity (company) that has same name as existing crew entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Assistants Ltd',
									members: [
										{
											name: 'Molly Einchcomb',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0].members[0], expectedPersonMollyEinchcomb2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing crew entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Assistants Ltd',
									members: [
										{
											name: 'Molly Einchcomb'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0].members[0], expectedPersonMollyEinchcomb1);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing crew entity (company) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${HAMLET_PRODUCTION_UUID}`)
				.send({
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Assistants Ltd',
									members: [
										{
											name: 'Molly Einchcomb',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.crewCredits[0].entities[0].members[0], expectedPersonMollyEinchcomb2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});

	describe('Production review publication (company) uniqueness in database', () => {
		const LONG_DAYS_JOURNEY_INTO_NIGHT_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCompanyFinancialTimes1 = {
			model: 'COMPANY',
			name: 'Financial Times',
			differentiator: '',
			errors: {}
		};

		const expectedCompanyFinancialTimes2 = {
			model: 'COMPANY',
			name: 'Financial Times',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: LONG_DAYS_JOURNEY_INTO_NIGHT_PRODUCTION_UUID,
				name: "Long Day's Journey Into Night"
			});
		});

		it('updates production and creates review publication (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 0);

			const response = await request(app)
				.put(`/productions/${LONG_DAYS_JOURNEY_INTO_NIGHT_PRODUCTION_UUID}`)
				.send({
					name: "Long Day's Journey Into Night",
					reviews: [
						{
							url: 'https://www.ft.com/content/bcf4484a-5200-4961-ac12-1e0138518f89',
							publication: {
								name: 'Financial Times'
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.reviews[0].publication, expectedCompanyFinancialTimes1);
			assert.equal(await countNodesWithLabel('Company'), 1);
		});

		it('updates production and creates review publication (company) that has same name as existing review publication but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 1);

			const response = await request(app)
				.put(`/productions/${LONG_DAYS_JOURNEY_INTO_NIGHT_PRODUCTION_UUID}`)
				.send({
					name: "Long Day's Journey Into Night",
					reviews: [
						{
							url: 'https://www.ft.com/content/bcf4484a-5200-4961-ac12-1e0138518f89',
							publication: {
								name: 'Financial Times',
								differentiator: '1'
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.reviews[0].publication, expectedCompanyFinancialTimes2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates production and uses existing review publication (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/productions/${LONG_DAYS_JOURNEY_INTO_NIGHT_PRODUCTION_UUID}`)
				.send({
					name: "Long Day's Journey Into Night",
					reviews: [
						{
							url: 'https://www.ft.com/content/bcf4484a-5200-4961-ac12-1e0138518f89',
							publication: {
								name: 'Financial Times'
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.reviews[0].publication, expectedCompanyFinancialTimes1);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates production and uses existing review publication (company) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/productions/${LONG_DAYS_JOURNEY_INTO_NIGHT_PRODUCTION_UUID}`)
				.send({
					name: "Long Day's Journey Into Night",
					reviews: [
						{
							url: 'https://www.ft.com/content/bcf4484a-5200-4961-ac12-1e0138518f89',
							publication: {
								name: 'Financial Times',
								differentiator: '1'
							},
							critic: {
								name: 'Sarah Hemming'
							}
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.reviews[0].publication, expectedCompanyFinancialTimes2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});
	});

	describe('Production review critic (person) uniqueness in database', () => {
		const NYE_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonArifaAkbar1 = {
			model: 'PERSON',
			name: 'Arifa Akbar',
			differentiator: '',
			errors: {}
		};

		const expectedPersonArifaAkbar2 = {
			model: 'PERSON',
			name: 'Arifa Akbar',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: NYE_PRODUCTION_UUID,
				name: 'Nye'
			});
		});

		it('updates production and creates review critic (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/productions/${NYE_PRODUCTION_UUID}`)
				.send({
					name: 'Nye',
					reviews: [
						{
							url: 'https://www.theguardian.com/stage/2024/mar/07/nye-review-michael-sheen-olivier-theatre',
							publication: {
								name: 'The Guardian'
							},
							critic: {
								name: 'Arifa Akbar'
							}
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.reviews[0].critic, expectedPersonArifaAkbar1);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates production and creates review critic (person) that has same name as existing review critic but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/productions/${NYE_PRODUCTION_UUID}`)
				.send({
					name: 'Nye',
					reviews: [
						{
							url: 'https://www.theguardian.com/stage/2024/mar/07/nye-review-michael-sheen-olivier-theatre',
							publication: {
								name: 'The Guardian'
							},
							critic: {
								name: 'Arifa Akbar',
								differentiator: '1'
							}
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.reviews[0].critic, expectedPersonArifaAkbar2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing review critic (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${NYE_PRODUCTION_UUID}`)
				.send({
					name: 'Nye',
					reviews: [
						{
							url: 'https://www.theguardian.com/stage/2024/mar/07/nye-review-michael-sheen-olivier-theatre',
							publication: {
								name: 'The Guardian'
							},
							critic: {
								name: 'Arifa Akbar'
							}
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.reviews[0].critic, expectedPersonArifaAkbar1);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates production and uses existing review critic (person) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/productions/${NYE_PRODUCTION_UUID}`)
				.send({
					name: 'Nye',
					reviews: [
						{
							url: 'https://www.theguardian.com/stage/2024/mar/07/nye-review-michael-sheen-olivier-theatre',
							publication: {
								name: 'The Guardian'
							},
							critic: {
								name: 'Arifa Akbar',
								differentiator: '1'
							}
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.reviews[0].critic, expectedPersonArifaAkbar2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});
});

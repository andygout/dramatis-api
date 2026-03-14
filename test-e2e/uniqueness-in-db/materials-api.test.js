import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../../src/app.js';
import { countNodesWithLabel, createNode, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';

describe('Uniqueness in database: Materials API', () => {
	describe('Material uniqueness in database', () => {
		const MATERIAL_1_UUID = '2';
		const MATERIAL_2_UUID = '5';

		before(async () => {
			stubUuidCounterClient.setValueToZero();

			await purgeDatabase();
		});

		after(() => {
			stubUuidCounterClient.setValueToUndefined();
		});

		it('creates material without differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 0);

			const response = await request(app).post('/materials').send({
				name: 'Home'
			});

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_1_UUID,
				name: 'Home',
				differentiator: '',
				subtitle: '',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				subMaterials: [
					{
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					}
				],
				characterGroups: [
					{
						model: 'CHARACTER_GROUP',
						name: '',
						errors: {},
						characters: [
							{
								model: 'CHARACTER',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Material'), 1);
		});

		it('responds with errors if trying to create existing material that does also not have differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 1);

			const response = await request(app).post('/materials').send({
				name: 'Home'
			});

			const expectedResponseBody = {
				model: 'MATERIAL',
				name: 'Home',
				differentiator: '',
				subtitle: '',
				format: '',
				year: '',
				hasErrors: true,
				errors: {
					name: ['Name and differentiator combination already exists'],
					differentiator: ['Name and differentiator combination already exists']
				},
				originalVersionMaterial: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [],
				subMaterials: [],
				characterGroups: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Material'), 1);
		});

		it('creates material with same name as existing material but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 1);

			const response = await request(app).post('/materials').send({
				name: 'Home',
				differentiator: '1'
			});

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_2_UUID,
				name: 'Home',
				differentiator: '1',
				subtitle: '',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				subMaterials: [
					{
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					}
				],
				characterGroups: [
					{
						model: 'CHARACTER_GROUP',
						name: '',
						errors: {},
						characters: [
							{
								model: 'CHARACTER',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Material'), 2);
		});

		it('responds with errors if trying to update material to one with same name and differentiator combination', async () => {
			assert.equal(await countNodesWithLabel('Material'), 2);

			const response = await request(app).put(`/materials/${MATERIAL_1_UUID}`).send({
				name: 'Home',
				differentiator: '1'
			});

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_1_UUID,
				name: 'Home',
				differentiator: '1',
				subtitle: '',
				format: '',
				year: '',
				hasErrors: true,
				errors: {
					name: ['Name and differentiator combination already exists'],
					differentiator: ['Name and differentiator combination already exists']
				},
				originalVersionMaterial: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [],
				subMaterials: [],
				characterGroups: []
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Material'), 2);
		});

		it('updates material with same name as existing material but uses a different differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 2);

			const response = await request(app).put(`/materials/${MATERIAL_1_UUID}`).send({
				name: 'Home',
				differentiator: '2'
			});

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_1_UUID,
				name: 'Home',
				differentiator: '2',
				subtitle: '',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				subMaterials: [
					{
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					}
				],
				characterGroups: [
					{
						model: 'CHARACTER_GROUP',
						name: '',
						errors: {},
						characters: [
							{
								model: 'CHARACTER',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Material'), 2);
		});

		it('updates material with same name as existing material but without a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 2);

			const response = await request(app).put(`/materials/${MATERIAL_2_UUID}`).send({
				name: 'Home'
			});

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_2_UUID,
				name: 'Home',
				differentiator: '',
				subtitle: '',
				format: '',
				year: '',
				errors: {},
				originalVersionMaterial: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: '',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				subMaterials: [
					{
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					}
				],
				characterGroups: [
					{
						model: 'CHARACTER_GROUP',
						name: '',
						errors: {},
						characters: [
							{
								model: 'CHARACTER',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			assert.equal(response.status, 200);
			assert.deepEqual(response.body, expectedResponseBody);
			assert.equal(await countNodesWithLabel('Material'), 2);
		});
	});

	describe('Material original version material uniqueness in database', () => {
		const THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedOriginalVersionMaterialTheSeagull1 = {
			model: 'MATERIAL',
			name: 'The Seagull',
			differentiator: '',
			errors: {}
		};

		const expectedOriginalVersionMaterialTheSeagull2 = {
			model: 'MATERIAL',
			name: 'The Seagull',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID,
				name: 'The Seagull'
			});
		});

		it('updates material and creates original version material that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 1);

			const response = await request(app)
				.put(`/materials/${THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.originalVersionMaterial, expectedOriginalVersionMaterialTheSeagull1);
			assert.equal(await countNodesWithLabel('Material'), 2);
		});

		it('updates material and creates original version material that has same name as existing original version material but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 2);

			const response = await request(app)
				.put(`/materials/${THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.originalVersionMaterial, expectedOriginalVersionMaterialTheSeagull2);
			assert.equal(await countNodesWithLabel('Material'), 3);
		});

		it('updates material and uses existing original version material that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 3);

			const response = await request(app)
				.put(`/materials/${THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.originalVersionMaterial, expectedOriginalVersionMaterialTheSeagull1);
			assert.equal(await countNodesWithLabel('Material'), 3);
		});

		it('updates material and uses existing original version material that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 3);

			const response = await request(app)
				.put(`/materials/${THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull',
						differentiator: '1'
					}
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.originalVersionMaterial, expectedOriginalVersionMaterialTheSeagull2);
			assert.equal(await countNodesWithLabel('Material'), 3);
		});
	});

	describe('Material writing entity (person) uniqueness in database', () => {
		const DOT_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonKateRyan1 = {
			model: 'PERSON',
			name: 'Kate Ryan',
			differentiator: '',
			errors: {}
		};

		const expectedPersonKateRyan2 = {
			model: 'PERSON',
			name: 'Kate Ryan',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: DOT_MATERIAL_UUID,
				name: 'Dot'
			});
		});

		it('updates material and creates writing entity (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 0);

			const response = await request(app)
				.put(`/materials/${DOT_MATERIAL_UUID}`)
				.send({
					name: 'Dot',
					writingCredits: [
						{
							entities: [
								{
									name: 'Kate Ryan'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedPersonKateRyan1);
			assert.equal(await countNodesWithLabel('Person'), 1);
		});

		it('updates material and creates writing entity (person) that has same name as existing writing entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 1);

			const response = await request(app)
				.put(`/materials/${DOT_MATERIAL_UUID}`)
				.send({
					name: 'Dot',
					writingCredits: [
						{
							entities: [
								{
									name: 'Kate Ryan',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedPersonKateRyan2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates material and uses existing writing entity (person) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/materials/${DOT_MATERIAL_UUID}`)
				.send({
					name: 'Dot',
					writingCredits: [
						{
							entities: [
								{
									name: 'Kate Ryan'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedPersonKateRyan1);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});

		it('updates material and uses existing writing entity (person) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Person'), 2);

			const response = await request(app)
				.put(`/materials/${DOT_MATERIAL_UUID}`)
				.send({
					name: 'Dot',
					writingCredits: [
						{
							entities: [
								{
									name: 'Kate Ryan',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedPersonKateRyan2);
			assert.equal(await countNodesWithLabel('Person'), 2);
		});
	});

	describe('Material writing entity (company) uniqueness in database', () => {
		const UNTITLED_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCompanyGateTheatreCompany1 = {
			model: 'COMPANY',
			name: 'Gate Theatre Company',
			differentiator: '',
			errors: {}
		};

		const expectedCompanyGateTheatreCompany2 = {
			model: 'COMPANY',
			name: 'Gate Theatre Company',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: UNTITLED_MATERIAL_UUID,
				name: 'Untitled'
			});
		});

		it('updates material and creates writing entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 0);

			const response = await request(app)
				.put(`/materials/${UNTITLED_MATERIAL_UUID}`)
				.send({
					name: 'Untitled',
					writingCredits: [
						{
							entities: [
								{
									model: 'COMPANY',
									name: 'Gate Theatre Company'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedCompanyGateTheatreCompany1);
			assert.equal(await countNodesWithLabel('Company'), 1);
		});

		it('updates material and creates writing entity (company) that has same name as existing writing entity but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 1);

			const response = await request(app)
				.put(`/materials/${UNTITLED_MATERIAL_UUID}`)
				.send({
					name: 'Untitled',
					writingCredits: [
						{
							entities: [
								{
									model: 'COMPANY',
									name: 'Gate Theatre Company',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedCompanyGateTheatreCompany2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates material and uses existing writing entity (company) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/materials/${UNTITLED_MATERIAL_UUID}`)
				.send({
					name: 'Untitled',
					writingCredits: [
						{
							entities: [
								{
									model: 'COMPANY',
									name: 'Gate Theatre Company'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedCompanyGateTheatreCompany1);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});

		it('updates material and uses existing writing entity (company) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Company'), 2);

			const response = await request(app)
				.put(`/materials/${UNTITLED_MATERIAL_UUID}`)
				.send({
					name: 'Untitled',
					writingCredits: [
						{
							entities: [
								{
									model: 'COMPANY',
									name: 'Gate Theatre Company',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedCompanyGateTheatreCompany2);
			assert.equal(await countNodesWithLabel('Company'), 2);
		});
	});

	describe('Material writing entity (source material) uniqueness in database', () => {
		const THE_INDIAN_BOY_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedMaterialAMidsummerNightsDream1 = {
			model: 'MATERIAL',
			name: "A Midsummer Night's Dream",
			differentiator: '',
			errors: {}
		};

		const expectedMaterialAMidsummerNightsDream2 = {
			model: 'MATERIAL',
			name: "A Midsummer Night's Dream",
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: THE_INDIAN_BOY_MATERIAL_UUID,
				name: 'The Indian Boy'
			});
		});

		it('updates material and creates writing entity (source material) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 1);

			const response = await request(app)
				.put(`/materials/${THE_INDIAN_BOY_MATERIAL_UUID}`)
				.send({
					name: 'The Indian Boy',
					writingCredits: [
						{
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									name: "A Midsummer Night's Dream"
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedMaterialAMidsummerNightsDream1);
			assert.equal(await countNodesWithLabel('Material'), 2);
		});

		it('updates material and creates writing entity (source material) that has same name as existing writing entity (source material) but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 2);

			const response = await request(app)
				.put(`/materials/${THE_INDIAN_BOY_MATERIAL_UUID}`)
				.send({
					name: 'The Indian Boy',
					writingCredits: [
						{
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									name: "A Midsummer Night's Dream",
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedMaterialAMidsummerNightsDream2);
			assert.equal(await countNodesWithLabel('Material'), 3);
		});

		it('updates material and uses existing writing entity (source material) that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 3);

			const response = await request(app)
				.put(`/materials/${THE_INDIAN_BOY_MATERIAL_UUID}`)
				.send({
					name: 'The Indian Boy',
					writingCredits: [
						{
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									name: "A Midsummer Night's Dream"
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedMaterialAMidsummerNightsDream1);
			assert.equal(await countNodesWithLabel('Material'), 3);
		});

		it('updates material and uses existing writing entity (source material) that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 3);

			const response = await request(app)
				.put(`/materials/${THE_INDIAN_BOY_MATERIAL_UUID}`)
				.send({
					name: 'The Indian Boy',
					writingCredits: [
						{
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									name: "A Midsummer Night's Dream",
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.writingCredits[0].entities[0], expectedMaterialAMidsummerNightsDream2);
			assert.equal(await countNodesWithLabel('Material'), 3);
		});
	});

	describe('Material sub-material uniqueness in database', () => {
		const THE_COAST_OF_UTOPIA_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedMaterialVoyage1 = {
			model: 'MATERIAL',
			name: 'Voyage',
			differentiator: '',
			errors: {}
		};

		const expectedMaterialVoyage2 = {
			model: 'MATERIAL',
			name: 'Voyage',
			differentiator: '1',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
				name: 'The Coast of Utopia'
			});
		});

		it('updates material and creates sub-material that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 1);

			const response = await request(app)
				.put(`/materials/${THE_COAST_OF_UTOPIA_MATERIAL_UUID}`)
				.send({
					name: 'The Coast of Utopia',
					subMaterials: [
						{
							name: 'Voyage'
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.subMaterials[0], expectedMaterialVoyage1);
			assert.equal(await countNodesWithLabel('Material'), 2);
		});

		it('updates material and creates sub-material that has same name as existing sub-material but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 2);

			const response = await request(app)
				.put(`/materials/${THE_COAST_OF_UTOPIA_MATERIAL_UUID}`)
				.send({
					name: 'The Coast of Utopia',
					subMaterials: [
						{
							name: 'Voyage',
							differentiator: '1'
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.subMaterials[0], expectedMaterialVoyage2);
			assert.equal(await countNodesWithLabel('Material'), 3);
		});

		it('updates material and uses existing sub-material that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 3);

			const response = await request(app)
				.put(`/materials/${THE_COAST_OF_UTOPIA_MATERIAL_UUID}`)
				.send({
					name: 'The Coast of Utopia',
					subMaterials: [
						{
							name: 'Voyage'
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.subMaterials[0], expectedMaterialVoyage1);
			assert.equal(await countNodesWithLabel('Material'), 3);
		});

		it('updates material and uses existing sub-material that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Material'), 3);

			const response = await request(app)
				.put(`/materials/${THE_COAST_OF_UTOPIA_MATERIAL_UUID}`)
				.send({
					name: 'The Coast of Utopia',
					subMaterials: [
						{
							name: 'Voyage',
							differentiator: '1'
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.subMaterials[0], expectedMaterialVoyage2);
			assert.equal(await countNodesWithLabel('Material'), 3);
		});
	});

	describe('Material character uniqueness in database', () => {
		const TITUS_ANDRONICUS_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCharacterDemetrius1 = {
			model: 'CHARACTER',
			name: 'Demetrius',
			underlyingName: '',
			differentiator: '',
			qualifier: '',
			errors: {}
		};

		const expectedCharacterDemetrius2 = {
			model: 'CHARACTER',
			name: 'Demetrius',
			underlyingName: '',
			differentiator: '1',
			qualifier: '',
			errors: {}
		};

		before(async () => {
			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: TITUS_ANDRONICUS_MATERIAL_UUID,
				name: 'Titus Andronicus'
			});
		});

		it('updates material and creates character that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Character'), 0);

			const response = await request(app)
				.put(`/materials/${TITUS_ANDRONICUS_MATERIAL_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characterGroups: [
						{
							characters: [
								{
									name: 'Demetrius'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.characterGroups[0].characters[0], expectedCharacterDemetrius1);
			assert.equal(await countNodesWithLabel('Character'), 1);
		});

		it('updates material and creates character that has same name as existing character but uses a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Character'), 1);

			const response = await request(app)
				.put(`/materials/${TITUS_ANDRONICUS_MATERIAL_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characterGroups: [
						{
							characters: [
								{
									name: 'Demetrius',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.characterGroups[0].characters[0], expectedCharacterDemetrius2);
			assert.equal(await countNodesWithLabel('Character'), 2);
		});

		it('updates material and uses existing character that does not have a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Character'), 2);

			const response = await request(app)
				.put(`/materials/${TITUS_ANDRONICUS_MATERIAL_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characterGroups: [
						{
							characters: [
								{
									name: 'Demetrius'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.characterGroups[0].characters[0], expectedCharacterDemetrius1);
			assert.equal(await countNodesWithLabel('Character'), 2);
		});

		it('updates material and uses existing character that has a differentiator', async () => {
			assert.equal(await countNodesWithLabel('Character'), 2);

			const response = await request(app)
				.put(`/materials/${TITUS_ANDRONICUS_MATERIAL_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characterGroups: [
						{
							characters: [
								{
									name: 'Demetrius',
									differentiator: '1'
								}
							]
						}
					]
				});

			assert.equal(response.status, 200);
			assert.deepEqual(response.body.characterGroups[0].characters[0], expectedCharacterDemetrius2);
			assert.equal(await countNodesWithLabel('Character'), 2);
		});
	});
});

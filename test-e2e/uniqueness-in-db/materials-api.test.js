import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Uniqueness in database: Materials API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('Material uniqueness in database', () => {

		const MATERIAL_1_UUID = '2';
		const MATERIAL_2_UUID = '8';

		before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates material without differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(0);

			const response = await chai.request(app)
				.post('/materials')
				.send({
					name: 'Home'
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_1_UUID,
				name: 'Home',
				differentiator: '',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						writingEntities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(1);

		});

		it('responds with errors if trying to create existing material that does also not have differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.post('/materials')
				.send({
					name: 'Home'
				});

			const expectedResponseBody = {
				model: 'material',
				name: 'Home',
				differentiator: '',
				format: '',
				hasErrors: true,
				errors: {
					name: [
						'Name and differentiator combination already exists'
					],
					differentiator: [
						'Name and differentiator combination already exists'
					]
				},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [],
				characterGroups: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(1);

		});

		it('creates material with same name as existing material but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.post('/materials')
				.send({
					name: 'Home',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_2_UUID,
				name: 'Home',
				differentiator: '1',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						writingEntities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(2);

		});

		it('responds with errors if trying to update material to one with same name and differentiator combination', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(2);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_1_UUID}`)
				.send({
					name: 'Home',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_1_UUID,
				name: 'Home',
				differentiator: '1',
				format: '',
				hasErrors: true,
				errors: {
					name: [
						'Name and differentiator combination already exists'
					],
					differentiator: [
						'Name and differentiator combination already exists'
					]
				},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [],
				characterGroups: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(2);

		});

		it('updates material with same name as existing material but uses a different differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(2);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_1_UUID}`)
				.send({
					name: 'Home',
					differentiator: '2'
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_1_UUID,
				name: 'Home',
				differentiator: '2',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						writingEntities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(2);

		});

		it('updates material with same name as existing material but without a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(2);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_2_UUID}`)
				.send({
					name: 'Home'
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_2_UUID,
				name: 'Home',
				differentiator: '',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writingCredits: [
					{
						model: 'writingCredit',
						name: '',
						creditType: null,
						errors: {},
						writingEntities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(2);

		});

	});

	describe('Material original version material uniqueness in database', () => {

		const THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedOriginalVersionMaterialTheSeagull1 = {
			model: 'material',
			name: 'The Seagull',
			differentiator: '',
			errors: {}
		};

		const expectedOriginalVersionMaterialTheSeagull2 = {
			model: 'material',
			name: 'The Seagull',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID,
				name: 'The Seagull'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates material and creates original version material that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.put(`/materials/${THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.originalVersionMaterial).to.deep.equal(expectedOriginalVersionMaterialTheSeagull1);
			expect(await countNodesWithLabel('Material')).to.equal(2);

		});

		it('updates material and creates original version material that has same name as existing original version material but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(2);

			const response = await chai.request(app)
				.put(`/materials/${THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.originalVersionMaterial).to.deep.equal(expectedOriginalVersionMaterialTheSeagull2);
			expect(await countNodesWithLabel('Material')).to.equal(3);

		});

		it('updates material and uses existing original version material that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(3);

			const response = await chai.request(app)
				.put(`/materials/${THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.originalVersionMaterial).to.deep.equal(expectedOriginalVersionMaterialTheSeagull1);
			expect(await countNodesWithLabel('Material')).to.equal(3);

		});

		it('updates material and uses existing original version material that has a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(3);

			const response = await chai.request(app)
				.put(`/materials/${THE_SEAGULL_SUBSEQUENT_VERSION_MATERIAL_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.originalVersionMaterial).to.deep.equal(expectedOriginalVersionMaterialTheSeagull2);
			expect(await countNodesWithLabel('Material')).to.equal(3);

		});

	});

	describe('Material writing entity (person) uniqueness in database', () => {

		const DOT_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonKateRyan1 = {
			model: 'person',
			name: 'Kate Ryan',
			differentiator: '',
			errors: {}
		};

		const expectedPersonKateRyan2 = {
			model: 'person',
			name: 'Kate Ryan',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: DOT_MATERIAL_UUID,
				name: 'Dot'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates material and creates writing entity (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/materials/${DOT_MATERIAL_UUID}`)
				.send({
					name: 'Dot',
					writingCredits: [
						{
							writingEntities: [
								{
									name: 'Kate Ryan'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedPersonKateRyan1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates material and creates writing entity (person) that has same name as existing writing entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/materials/${DOT_MATERIAL_UUID}`)
				.send({
					name: 'Dot',
					writingCredits: [
						{
							writingEntities: [
								{
									name: 'Kate Ryan',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedPersonKateRyan2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates material and uses existing writing entity (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/materials/${DOT_MATERIAL_UUID}`)
				.send({
					name: 'Dot',
					writingCredits: [
						{
							writingEntities: [
								{
									name: 'Kate Ryan'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedPersonKateRyan1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates material and uses existing writing entity (person) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/materials/${DOT_MATERIAL_UUID}`)
				.send({
					name: 'Dot',
					writingCredits: [
						{
							writingEntities: [
								{
									name: 'Kate Ryan',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedPersonKateRyan2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

	describe('Material writing entity (company) uniqueness in database', () => {

		const UNTITLED_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCompanyGateTheatreCompany1 = {
			model: 'company',
			name: 'Gate Theatre Company',
			differentiator: '',
			errors: {}
		};

		const expectedCompanyGateTheatreCompany2 = {
			model: 'company',
			name: 'Gate Theatre Company',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: UNTITLED_MATERIAL_UUID,
				name: 'Untitled'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates material and creates writing entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(0);

			const response = await chai.request(app)
				.put(`/materials/${UNTITLED_MATERIAL_UUID}`)
				.send({
					name: 'Untitled',
					writingCredits: [
						{
							writingEntities: [
								{
									model: 'company',
									name: 'Gate Theatre Company'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedCompanyGateTheatreCompany1);
			expect(await countNodesWithLabel('Company')).to.equal(1);

		});

		it('updates material and creates writing entity (company) that has same name as existing writing entity but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(1);

			const response = await chai.request(app)
				.put(`/materials/${UNTITLED_MATERIAL_UUID}`)
				.send({
					name: 'Untitled',
					writingCredits: [
						{
							writingEntities: [
								{
									model: 'company',
									name: 'Gate Theatre Company',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedCompanyGateTheatreCompany2);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

		it('updates material and uses existing writing entity (company) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(2);

			const response = await chai.request(app)
				.put(`/materials/${UNTITLED_MATERIAL_UUID}`)
				.send({
					name: 'Untitled',
					writingCredits: [
						{
							writingEntities: [
								{
									model: 'company',
									name: 'Gate Theatre Company'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedCompanyGateTheatreCompany1);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

		it('updates material and uses existing writing entity (company) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(2);

			const response = await chai.request(app)
				.put(`/materials/${UNTITLED_MATERIAL_UUID}`)
				.send({
					name: 'Untitled',
					writingCredits: [
						{
							writingEntities: [
								{
									model: 'company',
									name: 'Gate Theatre Company',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedCompanyGateTheatreCompany2);
			expect(await countNodesWithLabel('Company')).to.equal(2);

		});

	});

	describe('Material writing entity (source material) uniqueness in database', () => {

		const THE_INDIAN_BOY_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedMaterialAMidsummerNightsDream1 = {
			model: 'material',
			name: 'A Midsummer Night\'s Dream',
			differentiator: '',
			errors: {}
		};

		const expectedMaterialAMidsummerNightsDream2 = {
			model: 'material',
			name: 'A Midsummer Night\'s Dream',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: THE_INDIAN_BOY_MATERIAL_UUID,
				name: 'The Indian Boy'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates material and creates writing entity (source material) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.put(`/materials/${THE_INDIAN_BOY_MATERIAL_UUID}`)
				.send({
					name: 'The Indian Boy',
					writingCredits: [
						{
							name: 'inspired by',
							writingEntities: [
								{
									model: 'material',
									name: 'A Midsummer Night\'s Dream'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedMaterialAMidsummerNightsDream1);
			expect(await countNodesWithLabel('Material')).to.equal(2);

		});

		it('updates material and creates writing entity (source material) that has same name as existing writing entity (source material) but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(2);

			const response = await chai.request(app)
				.put(`/materials/${THE_INDIAN_BOY_MATERIAL_UUID}`)
				.send({
					name: 'The Indian Boy',
					writingCredits: [
						{
							name: 'inspired by',
							writingEntities: [
								{
									model: 'material',
									name: 'A Midsummer Night\'s Dream',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedMaterialAMidsummerNightsDream2);
			expect(await countNodesWithLabel('Material')).to.equal(3);

		});

		it('updates material and uses existing writing entity (source material) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(3);

			const response = await chai.request(app)
				.put(`/materials/${THE_INDIAN_BOY_MATERIAL_UUID}`)
				.send({
					name: 'The Indian Boy',
					writingCredits: [
						{
							name: 'inspired by',
							writingEntities: [
								{
									model: 'material',
									name: 'A Midsummer Night\'s Dream'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedMaterialAMidsummerNightsDream1);
			expect(await countNodesWithLabel('Material')).to.equal(3);

		});

		it('updates material and uses existing writing entity (source material) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(3);

			const response = await chai.request(app)
				.put(`/materials/${THE_INDIAN_BOY_MATERIAL_UUID}`)
				.send({
					name: 'The Indian Boy',
					writingCredits: [
						{
							name: 'inspired by',
							writingEntities: [
								{
									model: 'material',
									name: 'A Midsummer Night\'s Dream',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writingCredits[0].writingEntities[0]).to.deep.equal(expectedMaterialAMidsummerNightsDream2);
			expect(await countNodesWithLabel('Material')).to.equal(3);

		});

	});

	describe('Material character uniqueness in database', () => {

		const TITUS_ANDRONICUS_MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCharacterDemetrius1 = {
			model: 'character',
			name: 'Demetrius',
			underlyingName: '',
			differentiator: '',
			qualifier: '',
			errors: {}
		};

		const expectedCharacterDemetrius2 = {
			model: 'character',
			name: 'Demetrius',
			underlyingName: '',
			differentiator: '1',
			qualifier: '',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Material',
				uuid: TITUS_ANDRONICUS_MATERIAL_UUID,
				name: 'Titus Andronicus'
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates material and creates character that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(0);

			const response = await chai.request(app)
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

			expect(response).to.have.status(200);
			expect(response.body.characterGroups[0].characters[0]).to.deep.equal(expectedCharacterDemetrius1);
			expect(await countNodesWithLabel('Character')).to.equal(1);

		});

		it('updates material and creates character that has same name as existing character but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(1);

			const response = await chai.request(app)
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

			expect(response).to.have.status(200);
			expect(response.body.characterGroups[0].characters[0]).to.deep.equal(expectedCharacterDemetrius2);
			expect(await countNodesWithLabel('Character')).to.equal(2);

		});

		it('updates material and uses existing character that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(2);

			const response = await chai.request(app)
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

			expect(response).to.have.status(200);
			expect(response.body.characterGroups[0].characters[0]).to.deep.equal(expectedCharacterDemetrius1);
			expect(await countNodesWithLabel('Character')).to.equal(2);

		});

		it('updates material and uses existing character that has a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(2);

			const response = await chai.request(app)
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

			expect(response).to.have.status(200);
			expect(response.body.characterGroups[0].characters[0]).to.deep.equal(expectedCharacterDemetrius2);
			expect(await countNodesWithLabel('Character')).to.equal(2);

		});

	});

});

import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Materials API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new material', async () => {

			const response = await chai.request(app)
				.get('/materials/new');

			const expectedResponseBody = {
				model: 'MATERIAL',
				name: '',
				differentiator: '',
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(crypto, 'randomUUID').returns(MATERIAL_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(0);

			const response = await chai.request(app)
				.post('/materials')
				.send({
					name: 'Uncle Vanya'
				});

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_UUID,
				name: 'Uncle Vanya',
				differentiator: '',
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(1);

		});

		it('gets data required to edit specific material', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}/edit`);

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_UUID,
				name: 'Uncle Vanya',
				differentiator: '',
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_UUID}`)
				.send({
					name: 'The Cherry Orchard'
				});

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_UUID,
				name: 'The Cherry Orchard',
				differentiator: '',
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(1);

		});

		it('shows material', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_UUID,
				name: 'The Cherry Orchard',
				differentiator: null,
				format: null,
				year: null,
				originalVersionMaterial: null,
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				surMaterial: null,
				subMaterials: [],
				writingCredits: [],
				characterGroups: [],
				productions: [],
				sourcingMaterialProductions: [],
				awards: [],
				subsequentVersionMaterialAwards: [],
				sourcingMaterialAwards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'MATERIAL',
				name: 'The Cherry Orchard',
				differentiator: '',
				format: '',
				year: '',
				errors: {},
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const MATERIAL_UUID = '12';
		const JOHN_GABRIEL_BORKMAN_ORIGINAL_VERSION_MATERIAL_UUID = '13';
		const HENRIK_IBSEN_PERSON_UUID = '14';
		const IBSEN_THEATRE_COMPANY_UUID = '15';
		const DAVID_ELDRIDGE_PERSON_UUID = '16';
		const JOHN_GABRIEL_BORKMAN_SOURCE_MATERIAL_MATERIAL_UUID = '17';
		const JOHN_GABRIEL_BORKMAN_SUB_MATERIAL_1_MATERIAL_UUID = '18';
		const JOHN_GABRIEL_BORKMAN_SUB_MATERIAL_2_MATERIAL_UUID = '19';
		const JOHN_GABRIEL_BORKMAN_SUB_MATERIAL_3_MATERIAL_UUID = '20';
		const JOHN_GABRIEL_BORKMAN_CHARACTER_UUID = '21';
		const GUNHILD_BORKMAN_CHARACTER_UUID = '22';
		const ERHART_BORKMAN_CHARACTER_UUID = '23';
		const THREE_SISTERS_ORIGINAL_VERSION_MATERIAL_UUID = '35';
		const ANTON_CHEKHOV_PERSON_UUID = '36';
		const CHEKHOV_THEATRE_COMPANY_UUID = '37';
		const BENEDICT_ANDREWS_PERSON_UUID = '38';
		const THREE_SISTERS_SOURCE_MATERIAL_MATERIAL_UUID = '39';
		const THREE_SISTERS_SUB_MATERIAL_1_MATERIAL_UUID = '40';
		const THREE_SISTERS_SUB_MATERIAL_2_MATERIAL_UUID = '41';
		const THREE_SISTERS_SUB_MATERIAL_3_MATERIAL_UUID = '42';
		const OLGA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID = '43';
		const MARIA_SERGEYEVNA_KULYGINA_CHARACTER_UUID = '44';
		const IRINA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID = '45';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(0);

			const response = await chai.request(app)
				.post('/materials')
				.send({
					name: 'John Gabriel Borkman',
					differentiator: '2',
					format: 'play',
					year: 2007,
					originalVersionMaterial: {
						name: 'John Gabriel Borkman',
						differentiator: '1'
					},
					writingCredits: [
						{
							name: '',
							entities: [
								{
									name: 'Henrik Ibsen',
									differentiator: '1'
								},
								// Contrivance for purposes of test.
								{
									model: 'COMPANY',
									name: 'Ibsen Theatre Company',
									differentiator: '1'
								}
							]
						},
						{
							name: 'version by',
							entities: [
								{
									name: 'David Eldridge',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									name: 'John Gabriel Borkman',
									differentiator: '3'
								}
							]
						}
					],
					// Contrivance for purposes of test.
					subMaterials: [
						{
							name: 'John Gabriel Borkman sub-material #1',
							differentiator: '1'
						},
						{
							name: 'John Gabriel Borkman sub-material #2',
							differentiator: '1'
						},
						{
							name: 'John Gabriel Borkman sub-material #3',
							differentiator: '1'
						}
					],
					characterGroups: [
						{
							name: 'The Borkmans',
							characters: [
								{
									name: 'John Gabriel Borkman',
									underlyingName: 'Mr John Gabriel Borkman',
									differentiator: '1',
									qualifier: 'foo'
								},
								{
									name: 'Gunhild Borkman',
									underlyingName: 'Mrs Gunhild Borkman',
									differentiator: '1',
									qualifier: 'bar'
								},
								{
									name: 'Erhart Borkman',
									underlyingName: 'Mr Erhart Borkman',
									differentiator: '1',
									qualifier: 'baz'
								}
							]
						}
					]
				});

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				format: 'play',
				year: 2007,
				errors: {},
				originalVersionMaterial: {
					model: 'MATERIAL',
					name: 'John Gabriel Borkman',
					differentiator: '1',
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
								name: 'Henrik Ibsen',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'version by',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'David Eldridge',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'based on',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'MATERIAL',
								name: 'John Gabriel Borkman',
								differentiator: '3',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
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
						name: 'John Gabriel Borkman sub-material #1',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'MATERIAL',
						name: 'John Gabriel Borkman sub-material #2',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'MATERIAL',
						name: 'John Gabriel Borkman sub-material #3',
						differentiator: '1',
						errors: {}
					},
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
						name: 'The Borkmans',
						errors: {},
						characters: [
							{
								model: 'CHARACTER',
								name: 'John Gabriel Borkman',
								underlyingName: 'Mr John Gabriel Borkman',
								differentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'CHARACTER',
								name: 'Gunhild Borkman',
								underlyingName: 'Mrs Gunhild Borkman',
								differentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'CHARACTER',
								name: 'Erhart Borkman',
								underlyingName: 'Mr Erhart Borkman',
								differentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'CHARACTER',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(6);

		});

		it('shows material (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				format: 'play',
				year: 2007,
				originalVersionMaterial: {
					model: 'MATERIAL',
					uuid: JOHN_GABRIEL_BORKMAN_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'John Gabriel Borkman',
					format: null,
					year: null,
					surMaterial: null,
					writingCredits: []
				},
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen'
							},
							{
								model: 'COMPANY',
								uuid: IBSEN_THEATRE_COMPANY_UUID,
								name: 'Ibsen Theatre Company'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'version by',
						entities: [
							{
								model: 'PERSON',
								uuid: DAVID_ELDRIDGE_PERSON_UUID,
								name: 'David Eldridge'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								uuid: JOHN_GABRIEL_BORKMAN_SOURCE_MATERIAL_MATERIAL_UUID,
								name: 'John Gabriel Borkman',
								format: null,
								year: null,
								surMaterial: null,
								writingCredits: []
							}
						]
					}
				],
				surMaterial: null,
				subMaterials: [
					{
						model: 'MATERIAL',
						uuid: JOHN_GABRIEL_BORKMAN_SUB_MATERIAL_1_MATERIAL_UUID,
						name: 'John Gabriel Borkman sub-material #1',
						format: null,
						year: null,
						writingCredits: []
					},
					{
						model: 'MATERIAL',
						uuid: JOHN_GABRIEL_BORKMAN_SUB_MATERIAL_2_MATERIAL_UUID,
						name: 'John Gabriel Borkman sub-material #2',
						format: null,
						year: null,
						writingCredits: []
					},
					{
						model: 'MATERIAL',
						uuid: JOHN_GABRIEL_BORKMAN_SUB_MATERIAL_3_MATERIAL_UUID,
						name: 'John Gabriel Borkman sub-material #3',
						format: null,
						year: null,
						writingCredits: []
					}
				],
				characterGroups: [
					{
						model: 'CHARACTER_GROUP',
						name: 'The Borkmans',
						position: null,
						characters: [
							{
								model: 'CHARACTER',
								uuid: JOHN_GABRIEL_BORKMAN_CHARACTER_UUID,
								name: 'John Gabriel Borkman',
								qualifier: 'foo'
							},
							{
								model: 'CHARACTER',
								uuid: GUNHILD_BORKMAN_CHARACTER_UUID,
								name: 'Gunhild Borkman',
								qualifier: 'bar'
							},
							{
								model: 'CHARACTER',
								uuid: ERHART_BORKMAN_CHARACTER_UUID,
								name: 'Erhart Borkman',
								qualifier: 'baz'
							}
						]
					}
				],
				productions: [],
				sourcingMaterialProductions: [],
				awards: [],
				subsequentVersionMaterialAwards: [],
				sourcingMaterialAwards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific material', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}/edit`);

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				format: 'play',
				year: 2007,
				errors: {},
				originalVersionMaterial: {
					model: 'MATERIAL',
					name: 'John Gabriel Borkman',
					differentiator: '1',
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
								name: 'Henrik Ibsen',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'COMPANY',
								name: 'Ibsen Theatre Company',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'version by',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'David Eldridge',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'based on',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'MATERIAL',
								name: 'John Gabriel Borkman',
								differentiator: '3',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
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
						name: 'John Gabriel Borkman sub-material #1',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'MATERIAL',
						name: 'John Gabriel Borkman sub-material #2',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'MATERIAL',
						name: 'John Gabriel Borkman sub-material #3',
						differentiator: '1',
						errors: {}
					},
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
						name: 'The Borkmans',
						errors: {},
						characters: [
							{
								model: 'CHARACTER',
								name: 'John Gabriel Borkman',
								underlyingName: 'Mr John Gabriel Borkman',
								differentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'CHARACTER',
								name: 'Gunhild Borkman',
								underlyingName: 'Mrs Gunhild Borkman',
								differentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'CHARACTER',
								name: 'Erhart Borkman',
								underlyingName: 'Mr Erhart Borkman',
								differentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'CHARACTER',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(6);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_UUID}`)
				.send({
					name: 'Three Sisters',
					differentiator: '2',
					format: 'play',
					year: 2012,
					originalVersionMaterial: {
						name: 'Three Sisters',
						differentiator: '1'
					},
					writingCredits: [
						{
							name: '',
							entities: [
								{
									name: 'Anton Chekhov',
									differentiator: '1'
								},
								// Contrivance for purposes of test.
								{
									model: 'COMPANY',
									name: 'Chekhov Theatre Company',
									differentiator: '1'
								}
							]
						},
						{
							name: 'adaptation by',
							entities: [
								{
									name: 'Benedict Andrews',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									name: 'Three Sisters',
									differentiator: '3'
								}
							]
						}
					],
					// Contrivance for purposes of test.
					subMaterials: [
						{
							name: 'Three Sisters sub-material #1',
							differentiator: '1'
						},
						{
							name: 'Three Sisters sub-material #2',
							differentiator: '1'
						},
						{
							name: 'Three Sisters sub-material #3',
							differentiator: '1'
						}
					],
					characterGroups: [
						{
							name: 'The Prozorovs',
							characters: [
								{
									name: 'Olga',
									underlyingName: 'Olga Sergeyevna Prozorova',
									differentiator: '1',
									qualifier: 'foo'
								},
								{
									name: 'Maria',
									underlyingName: 'Maria Sergeyevna Kulygina',
									differentiator: '1',
									qualifier: 'bar'
								},
								{
									name: 'Irina',
									underlyingName: 'Irina Sergeyevna Prozorova',
									differentiator: '1',
									qualifier: 'baz'
								}
							]
						}
					]
				});

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				format: 'play',
				year: 2012,
				errors: {},
				originalVersionMaterial: {
					model: 'MATERIAL',
					name: 'Three Sisters',
					differentiator: '1',
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
								name: 'Anton Chekhov',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'COMPANY',
								name: 'Chekhov Theatre Company',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'adaptation by',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Benedict Andrews',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'based on',
						creditType: null,
						errors: {},
						entities: [
							{
								model: 'MATERIAL',
								name: 'Three Sisters',
								differentiator: '3',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
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
						name: 'Three Sisters sub-material #1',
						differentiator: '1',
						errors: {}
					},

					{
						model: 'MATERIAL',
						name: 'Three Sisters sub-material #2',
						differentiator: '1',
						errors: {}
					},

					{
						model: 'MATERIAL',
						name: 'Three Sisters sub-material #3',
						differentiator: '1',
						errors: {}
					},
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
						name: 'The Prozorovs',
						errors: {},
						characters: [
							{
								model: 'CHARACTER',
								name: 'Olga',
								underlyingName: 'Olga Sergeyevna Prozorova',
								differentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'CHARACTER',
								name: 'Maria',
								underlyingName: 'Maria Sergeyevna Kulygina',
								differentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'CHARACTER',
								name: 'Irina',
								underlyingName: 'Irina Sergeyevna Prozorova',
								differentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'CHARACTER',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(11);

		});

		it('shows material (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				format: 'play',
				year: 2012,
				originalVersionMaterial: {
					model: 'MATERIAL',
					uuid: THREE_SISTERS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Three Sisters',
					format: null,
					year: null,
					surMaterial: null,
					writingCredits: []
				},
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: ANTON_CHEKHOV_PERSON_UUID,
								name: 'Anton Chekhov'
							},
							{
								model: 'COMPANY',
								uuid: CHEKHOV_THEATRE_COMPANY_UUID,
								name: 'Chekhov Theatre Company'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'adaptation by',
						entities: [
							{
								model: 'PERSON',
								uuid: BENEDICT_ANDREWS_PERSON_UUID,
								name: 'Benedict Andrews'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								uuid: THREE_SISTERS_SOURCE_MATERIAL_MATERIAL_UUID,
								name: 'Three Sisters',
								format: null,
								year: null,
								surMaterial: null,
								writingCredits: []
							}
						]
					}
				],
				surMaterial: null,
				subMaterials: [
					{
						model: 'MATERIAL',
						uuid: THREE_SISTERS_SUB_MATERIAL_1_MATERIAL_UUID,
						name: 'Three Sisters sub-material #1',
						format: null,
						year: null,
						writingCredits: []
					},
					{
						model: 'MATERIAL',
						uuid: THREE_SISTERS_SUB_MATERIAL_2_MATERIAL_UUID,
						name: 'Three Sisters sub-material #2',
						format: null,
						year: null,
						writingCredits: []
					},
					{
						model: 'MATERIAL',
						uuid: THREE_SISTERS_SUB_MATERIAL_3_MATERIAL_UUID,
						name: 'Three Sisters sub-material #3',
						format: null,
						year: null,
						writingCredits: []
					}
				],
				characterGroups: [
					{
						model: 'CHARACTER_GROUP',
						name: 'The Prozorovs',
						position: null,
						characters: [
							{
								model: 'CHARACTER',
								uuid: OLGA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID,
								name: 'Olga',
								qualifier: 'foo'
							},
							{
								model: 'CHARACTER',
								uuid: MARIA_SERGEYEVNA_KULYGINA_CHARACTER_UUID,
								name: 'Maria',
								qualifier: 'bar'
							},
							{
								model: 'CHARACTER',
								uuid: IRINA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID,
								name: 'Irina',
								qualifier: 'baz'
							}
						]
					}
				],
				productions: [],
				sourcingMaterialProductions: [],
				awards: [],
				subsequentVersionMaterialAwards: [],
				sourcingMaterialAwards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates material to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(11);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_UUID}`)
				.send({
					name: 'Three Sisters',
					differentiator: '2'
				});

			const expectedResponseBody = {
				model: 'MATERIAL',
				uuid: MATERIAL_UUID,
				name: 'Three Sisters',
				differentiator: '2',
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(11);

		});

		it('deletes material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(11);

			const response = await chai.request(app)
				.delete(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'MATERIAL',
				name: 'Three Sisters',
				differentiator: '2',
				format: '',
				year: '',
				errors: {},
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(10);

		});

	});

	describe('GET list endpoint', () => {

		const HAUNTING_JULIA_MATERIAL_UUID = '2';
		const A_WORD_FROM_OUR_SPONSOR_MATERIAL_UUID = '6';
		const THE_MUSICAL_JIGSAW_PLAY_MATERIAL_UUID = '10';
		const DREAMS_FROM_A_SUMMER_HOUSE_MATERIAL_UUID = '14';
		const COMMUNICATING_DOORS_MATERIAL_UUID = '18';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'Haunting Julia',
					format: 'play',
					year: 1994
				});

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'A Word from Our Sponsor',
					format: 'play',
					year: 1995
				});

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'The Musical Jigsaw Play',
					format: 'play',
					year: 1994
				});

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'Dreams from a Summer House',
					format: 'play',
					year: 1992
				});

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'Communicating Doors',
					format: 'play',
					year: 1994
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all materials ordered by year then name', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'MATERIAL',
					uuid: A_WORD_FROM_OUR_SPONSOR_MATERIAL_UUID,
					name: 'A Word from Our Sponsor',
					format: 'play',
					year: 1995,
					surMaterial: null,
					writingCredits: []
				},
				{
					model: 'MATERIAL',
					uuid: COMMUNICATING_DOORS_MATERIAL_UUID,
					name: 'Communicating Doors',
					format: 'play',
					year: 1994,
					surMaterial: null,
					writingCredits: []
				},
				{
					model: 'MATERIAL',
					uuid: HAUNTING_JULIA_MATERIAL_UUID,
					name: 'Haunting Julia',
					format: 'play',
					year: 1994,
					surMaterial: null,
					writingCredits: []
				},
				{
					model: 'MATERIAL',
					uuid: THE_MUSICAL_JIGSAW_PLAY_MATERIAL_UUID,
					name: 'The Musical Jigsaw Play',
					format: 'play',
					year: 1994,
					surMaterial: null,
					writingCredits: []
				},
				{
					model: 'MATERIAL',
					uuid: DREAMS_FROM_A_SUMMER_HOUSE_MATERIAL_UUID,
					name: 'Dreams from a Summer House',
					format: 'play',
					year: 1992,
					surMaterial: null,
					writingCredits: []
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

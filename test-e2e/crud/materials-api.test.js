import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

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
				model: 'material',
				name: '',
				differentiator: '',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
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

		});

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const MATERIAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(MATERIAL_UUID);

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
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'Uncle Vanya',
				differentiator: '',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
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

		it('gets data required to edit specific material', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}/edit`);

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'Uncle Vanya',
				differentiator: '',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
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

		});

		it('updates material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_UUID}`)
				.send({
					name: 'The Cherry Orchard'
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'The Cherry Orchard',
				differentiator: '',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
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

		it('shows material', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'The Cherry Orchard',
				differentiator: null,
				format: null,
				originalVersionMaterial: null,
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				writerGroups: [],
				characterGroups: [],
				productions: [],
				sourcingMaterialProductions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'material',
				name: 'The Cherry Orchard',
				differentiator: '',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [],
				characterGroups: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const MATERIAL_UUID = '8';
		const JOHN_GABRIEL_BORKMAN_ORIGINAL_VERSION_MATERIAL_UUID = '9';
		const HENRIK_IBSEN_PERSON_UUID = '10';
		const DAVID_ELDRIDGE_PERSON_UUID = '11';
		const JOHN_GABRIEL_BORKMAN_SOURCE_MATERIAL_MATERIAL_UUID = '12';
		const JOHN_GABRIEL_BORKMAN_CHARACTER_UUID = '13';
		const GUNHILD_BORKMAN_CHARACTER_UUID = '14';
		const ERHART_BORKMAN_CHARACTER_UUID = '15';
		const THREE_SISTERS_ORIGINAL_VERSION_MATERIAL_UUID = '23';
		const ANTON_CHEKHOV_PERSON_UUID = '24';
		const BENEDICT_ANDREWS_PERSON_UUID = '25';
		const THREE_SISTERS_SOURCE_MATERIAL_MATERIAL_UUID = '26';
		const OLGA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID = '27';
		const MARIA_SERGEYEVNA_KULYGINA_CHARACTER_UUID = '28';
		const IRINA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID = '29';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

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
					originalVersionMaterial: {
						name: 'John Gabriel Borkman',
						differentiator: '1'
					},
					writerGroups: [
						{
							name: '',
							writers: [
								{
									name: 'Henrik Ibsen',
									differentiator: '1'
								}
							]
						},
						{
							name: 'version by',
							writers: [
								{
									name: 'David Eldridge',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'based on',
							writers: [
								{
									name: 'John Gabriel Borkman',
									differentiator: '3',
									model: 'material'
								}
							]
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
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				format: 'play',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: 'John Gabriel Borkman',
					differentiator: '1',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'person',
								name: 'Henrik Ibsen',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'version by',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'person',
								name: 'David Eldridge',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'based on',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'material',
								name: 'John Gabriel Borkman',
								differentiator: '3',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
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
						name: 'The Borkmans',
						errors: {},
						characters: [
							{
								model: 'character',
								name: 'John Gabriel Borkman',
								underlyingName: 'Mr John Gabriel Borkman',
								differentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'character',
								name: 'Gunhild Borkman',
								underlyingName: 'Mrs Gunhild Borkman',
								differentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'character',
								name: 'Erhart Borkman',
								underlyingName: 'Mr Erhart Borkman',
								differentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
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
			expect(await countNodesWithLabel('Material')).to.equal(3);

		});

		it('shows material (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				format: 'play',
				originalVersionMaterial: {
					model: 'material',
					uuid: JOHN_GABRIEL_BORKMAN_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'John Gabriel Borkman',
					format: null,
					writerGroups: []
				},
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				writerGroups: [
					{
						model: 'writerGroup',
						name: 'by',
						writers: [
							{
								model: 'person',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen',
								format: null,
								sourceMaterialWriterGroups: []
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'version by',
						writers: [
							{
								model: 'person',
								uuid: DAVID_ELDRIDGE_PERSON_UUID,
								name: 'David Eldridge',
								format: null,
								sourceMaterialWriterGroups: []
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'based on',
						writers: [
							{
								model: 'material',
								uuid: JOHN_GABRIEL_BORKMAN_SOURCE_MATERIAL_MATERIAL_UUID,
								name: 'John Gabriel Borkman',
								format: null,
								sourceMaterialWriterGroups: []
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: 'The Borkmans',
						position: null,
						characters: [
							{
								model: 'character',
								uuid: JOHN_GABRIEL_BORKMAN_CHARACTER_UUID,
								name: 'John Gabriel Borkman',
								qualifier: 'foo'
							},
							{
								model: 'character',
								uuid: GUNHILD_BORKMAN_CHARACTER_UUID,
								name: 'Gunhild Borkman',
								qualifier: 'bar'
							},
							{
								model: 'character',
								uuid: ERHART_BORKMAN_CHARACTER_UUID,
								name: 'Erhart Borkman',
								qualifier: 'baz'
							}
						]
					}
				],
				productions: [],
				sourcingMaterialProductions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific material', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}/edit`);

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				format: 'play',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: 'John Gabriel Borkman',
					differentiator: '1',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'person',
								name: 'Henrik Ibsen',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'version by',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'person',
								name: 'David Eldridge',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'based on',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'material',
								name: 'John Gabriel Borkman',
								differentiator: '3',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
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
						name: 'The Borkmans',
						errors: {},
						characters: [
							{
								model: 'character',
								name: 'John Gabriel Borkman',
								underlyingName: 'Mr John Gabriel Borkman',
								differentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'character',
								name: 'Gunhild Borkman',
								underlyingName: 'Mrs Gunhild Borkman',
								differentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'character',
								name: 'Erhart Borkman',
								underlyingName: 'Mr Erhart Borkman',
								differentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
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

		});

		it('updates material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(3);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_UUID}`)
				.send({
					name: 'Three Sisters',
					differentiator: '2',
					format: 'play',
					originalVersionMaterial: {
						name: 'Three Sisters',
						differentiator: '1'
					},
					writerGroups: [
						{
							name: '',
							writers: [
								{
									name: 'Anton Chekhov',
									differentiator: '1'
								}
							]
						},
						{
							name: 'adaptation by',
							writers: [
								{
									name: 'Benedict Andrews',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'based on',
							writers: [
								{
									name: 'Three Sisters',
									differentiator: '3',
									model: 'material'
								}
							]
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
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				format: 'play',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: 'Three Sisters',
					differentiator: '1',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'person',
								name: 'Anton Chekhov',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'adaptation by',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'person',
								name: 'Benedict Andrews',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'based on',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'material',
								name: 'Three Sisters',
								differentiator: '3',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
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
						name: 'The Prozorovs',
						errors: {},
						characters: [
							{
								model: 'character',
								name: 'Olga',
								underlyingName: 'Olga Sergeyevna Prozorova',
								differentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'character',
								name: 'Maria',
								underlyingName: 'Maria Sergeyevna Kulygina',
								differentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'character',
								name: 'Irina',
								underlyingName: 'Irina Sergeyevna Prozorova',
								differentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
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
			expect(await countNodesWithLabel('Material')).to.equal(5);

		});

		it('shows material (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				format: 'play',
				originalVersionMaterial: {
					model: 'material',
					uuid: THREE_SISTERS_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Three Sisters',
					format: null,
					writerGroups: []
				},
				subsequentVersionMaterials: [],
				sourcingMaterials: [],
				writerGroups: [
					{
						model: 'writerGroup',
						name: 'by',
						writers: [
							{
								model: 'person',
								uuid: ANTON_CHEKHOV_PERSON_UUID,
								name: 'Anton Chekhov',
								format: null,
								sourceMaterialWriterGroups: []
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'adaptation by',
						writers: [
							{
								model: 'person',
								uuid: BENEDICT_ANDREWS_PERSON_UUID,
								name: 'Benedict Andrews',
								format: null,
								sourceMaterialWriterGroups: []
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'based on',
						writers: [
							{
								model: 'material',
								uuid: THREE_SISTERS_SOURCE_MATERIAL_MATERIAL_UUID,
								name: 'Three Sisters',
								format: null,
								sourceMaterialWriterGroups: []
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: 'The Prozorovs',
						position: null,
						characters: [
							{
								model: 'character',
								uuid: OLGA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID,
								name: 'Olga',
								qualifier: 'foo'
							},
							{
								model: 'character',
								uuid: MARIA_SERGEYEVNA_KULYGINA_CHARACTER_UUID,
								name: 'Maria',
								qualifier: 'bar'
							},
							{
								model: 'character',
								uuid: IRINA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID,
								name: 'Irina',
								qualifier: 'baz'
							}
						]
					}
				],
				productions: [],
				sourcingMaterialProductions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates material to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(5);

			const response = await chai.request(app)
				.put(`/materials/${MATERIAL_UUID}`)
				.send({
					name: 'Three Sisters',
					differentiator: '2'
				});

			const expectedResponseBody = {
				model: 'material',
				uuid: MATERIAL_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
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
			expect(await countNodesWithLabel('Material')).to.equal(5);

		});

		it('deletes material', async () => {

			expect(await countNodesWithLabel('Material')).to.equal(5);

			const response = await chai.request(app)
				.delete(`/materials/${MATERIAL_UUID}`);

			const expectedResponseBody = {
				model: 'material',
				name: 'Three Sisters',
				differentiator: '2',
				format: '',
				errors: {},
				originalVersionMaterial: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [],
				characterGroups: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Material')).to.equal(4);

		});

	});

	describe('GET list endpoint', () => {

		const UNCLE_VANYA_MATERIAL_UUID = '2';
		const THE_CHERRY_ORCHARD_MATERIAL_UUID = '6';
		const THREE_SISTERS_MATERIAL_UUID = '10';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'Uncle Vanya',
					format: 'play'
				});

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'The Cherry Orchard',
					format: 'play'
				});

			await chai.request(app)
				.post('/materials')
				.send({
					name: 'Three Sisters',
					format: 'play'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all materials ordered by name', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'material',
					uuid: THE_CHERRY_ORCHARD_MATERIAL_UUID,
					name: 'The Cherry Orchard',
					format: 'play',
					writerGroups: []
				},
				{
					model: 'material',
					uuid: THREE_SISTERS_MATERIAL_UUID,
					name: 'Three Sisters',
					format: 'play',
					writerGroups: []
				},
				{
					model: 'material',
					uuid: UNCLE_VANYA_MATERIAL_UUID,
					name: 'Uncle Vanya',
					format: 'play',
					writerGroups: []
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

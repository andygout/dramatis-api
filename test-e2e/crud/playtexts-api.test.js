import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Playtexts API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new playtext', async () => {

			const response = await chai.request(app)
				.get('/playtexts/new');

			const expectedResponseBody = {
				model: 'playtext',
				name: '',
				differentiator: '',
				errors: {},
				originalVersionPlaytext: {
					model: 'playtext',
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

		const PLAYTEXT_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(PLAYTEXT_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates playtext', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(0);

			const response = await chai.request(app)
				.post('/playtexts')
				.send({
					name: 'Uncle Vanya'
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'Uncle Vanya',
				differentiator: '',
				errors: {},
				originalVersionPlaytext: {
					model: 'playtext',
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
			expect(await countNodesWithLabel('Playtext')).to.equal(1);

		});

		it('gets data required to edit specific playtext', async () => {

			const response = await chai.request(app)
				.get(`/playtexts/${PLAYTEXT_UUID}/edit`);

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'Uncle Vanya',
				differentiator: '',
				errors: {},
				originalVersionPlaytext: {
					model: 'playtext',
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

		it('updates playtext', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.put(`/playtexts/${PLAYTEXT_UUID}`)
				.send({
					name: 'The Cherry Orchard'
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'The Cherry Orchard',
				differentiator: '',
				errors: {},
				originalVersionPlaytext: {
					model: 'playtext',
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
			expect(await countNodesWithLabel('Playtext')).to.equal(1);

		});

		it('shows playtext', async () => {

			const response = await chai.request(app)
				.get(`/playtexts/${PLAYTEXT_UUID}`);

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'The Cherry Orchard',
				differentiator: null,
				originalVersionPlaytext: null,
				subsequentVersionPlaytexts: [],
				sourcingPlaytexts: [],
				writerGroups: [],
				characterGroups: [],
				productions: [],
				sourcingPlaytextProductions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes playtext', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/playtexts/${PLAYTEXT_UUID}`);

			const expectedResponseBody = {
				model: 'playtext',
				name: 'The Cherry Orchard',
				differentiator: '',
				errors: {},
				originalVersionPlaytext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [],
				characterGroups: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const PLAYTEXT_UUID = '8';
		const JOHN_GABRIEL_BORKMAN_ORIGINAL_VERSION_PLAYTEXT_UUID = '9';
		const HENRIK_IBSEN_PERSON_UUID = '10';
		const DAVID_ELDRIDGE_PERSON_UUID = '11';
		const JOHN_GABRIEL_BORKMAN_SOURCE_MATERIAL_PLAYTEXT_UUID = '12';
		const JOHN_GABRIEL_BORKMAN_CHARACTER_UUID = '13';
		const GUNHILD_BORKMAN_CHARACTER_UUID = '14';
		const ERHART_BORKMAN_CHARACTER_UUID = '15';
		const THREE_SISTERS_ORIGINAL_VERSION_PLAYTEXT_UUID = '23';
		const ANTON_CHEKHOV_PERSON_UUID = '24';
		const BENEDICT_ANDREWS_PERSON_UUID = '25';
		const THREE_SISTERS_SOURCE_MATERIAL_PLAYTEXT_UUID = '26';
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

		it('creates playtext', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(0);

			const response = await chai.request(app)
				.post('/playtexts')
				.send({
					name: 'John Gabriel Borkman',
					differentiator: '2',
					originalVersionPlaytext: {
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
									model: 'playtext'
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
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				errors: {},
				originalVersionPlaytext: {
					model: 'playtext',
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
								model: 'playtext',
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
			expect(await countNodesWithLabel('Playtext')).to.equal(3);

		});

		it('shows playtext (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/playtexts/${PLAYTEXT_UUID}`);

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				originalVersionPlaytext: {
					model: 'playtext',
					uuid: JOHN_GABRIEL_BORKMAN_ORIGINAL_VERSION_PLAYTEXT_UUID,
					name: 'John Gabriel Borkman',
					writerGroups: []
				},
				subsequentVersionPlaytexts: [],
				sourcingPlaytexts: [],
				writerGroups: [
					{
						model: 'writerGroup',
						name: 'by',
						writers: [
							{
								model: 'person',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen',
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
								sourceMaterialWriterGroups: []
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'based on',
						writers: [
							{
								model: 'playtext',
								uuid: JOHN_GABRIEL_BORKMAN_SOURCE_MATERIAL_PLAYTEXT_UUID,
								name: 'John Gabriel Borkman',
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
				sourcingPlaytextProductions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific playtext', async () => {

			const response = await chai.request(app)
				.get(`/playtexts/${PLAYTEXT_UUID}/edit`);

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '2',
				errors: {},
				originalVersionPlaytext: {
					model: 'playtext',
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
								model: 'playtext',
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

		it('updates playtext', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(3);

			const response = await chai.request(app)
				.put(`/playtexts/${PLAYTEXT_UUID}`)
				.send({
					name: 'Three Sisters',
					differentiator: '2',
					originalVersionPlaytext: {
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
									model: 'playtext'
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
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				errors: {},
				originalVersionPlaytext: {
					model: 'playtext',
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
								model: 'playtext',
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
			expect(await countNodesWithLabel('Playtext')).to.equal(5);

		});

		it('shows playtext (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/playtexts/${PLAYTEXT_UUID}`);

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				originalVersionPlaytext: {
					model: 'playtext',
					uuid: THREE_SISTERS_ORIGINAL_VERSION_PLAYTEXT_UUID,
					name: 'Three Sisters',
					writerGroups: []
				},
				subsequentVersionPlaytexts: [],
				sourcingPlaytexts: [],
				writerGroups: [
					{
						model: 'writerGroup',
						name: 'by',
						writers: [
							{
								model: 'person',
								uuid: ANTON_CHEKHOV_PERSON_UUID,
								name: 'Anton Chekhov',
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
								sourceMaterialWriterGroups: []
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'based on',
						writers: [
							{
								model: 'playtext',
								uuid: THREE_SISTERS_SOURCE_MATERIAL_PLAYTEXT_UUID,
								name: 'Three Sisters',
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
				sourcingPlaytextProductions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates playtext to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(5);

			const response = await chai.request(app)
				.put(`/playtexts/${PLAYTEXT_UUID}`)
				.send({
					name: 'Three Sisters',
					differentiator: '2'
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'Three Sisters',
				differentiator: '2',
				errors: {},
				originalVersionPlaytext: {
					model: 'playtext',
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
			expect(await countNodesWithLabel('Playtext')).to.equal(5);

		});

		it('deletes playtext', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(5);

			const response = await chai.request(app)
				.delete(`/playtexts/${PLAYTEXT_UUID}`);

			const expectedResponseBody = {
				model: 'playtext',
				name: 'Three Sisters',
				differentiator: '2',
				errors: {},
				originalVersionPlaytext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [],
				characterGroups: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(4);

		});

	});

	describe('GET list endpoint', () => {

		const UNCLE_VANYA_PLAYTEXT_UUID = '2';
		const THE_CHERRY_ORCHARD_PLAYTEXT_UUID = '6';
		const THREE_SISTERS_PLAYTEXT_UUID = '10';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/playtexts')
				.send({
					name: 'Uncle Vanya'
				});

			await chai.request(app)
				.post('/playtexts')
				.send({
					name: 'The Cherry Orchard'
				});

			await chai.request(app)
				.post('/playtexts')
				.send({
					name: 'Three Sisters'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all playtexts ordered by name', async () => {

			const response = await chai.request(app)
				.get('/playtexts');

			const expectedResponseBody = [
				{
					model: 'playtext',
					uuid: THE_CHERRY_ORCHARD_PLAYTEXT_UUID,
					name: 'The Cherry Orchard',
					writerGroups: []
				},
				{
					model: 'playtext',
					uuid: THREE_SISTERS_PLAYTEXT_UUID,
					name: 'Three Sisters',
					writerGroups: []
				},
				{
					model: 'playtext',
					uuid: UNCLE_VANYA_PLAYTEXT_UUID,
					name: 'Uncle Vanya',
					writerGroups: []
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

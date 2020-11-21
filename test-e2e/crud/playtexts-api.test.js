import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Playtexts API', () => {

	chai.use(chaiHttp);

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new playtext', async () => {

			const response = await chai.request(app)
				.get('/playtexts/new');

			const expectedResponseBody = {
				model: 'playtext',
				name: '',
				differentiator: '',
				errors: {},
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

		const sandbox = createSandbox();

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
				writerGroups: [],
				characterGroups: [],
				productions: []
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
				writerGroups: [],
				characterGroups: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const PLAYTEXT_UUID = '6';
		const HENRIK_IBSEN_PERSON_UUID = '7';
		const DAVID_ELDRIDGE_PERSON_UUID = '8';
		const JOHN_GABRIEL_BORKMAN_CHARACTER_UUID = '9';
		const GUNHILD_BORKMAN_CHARACTER_UUID = '10';
		const ERHART_BORKMAN_CHARACTER_UUID = '11';
		const ANTON_CHEKHOV_PERSON_UUID = '17';
		const BENEDICT_ANDREWS_PERSON_UUID = '18';
		const OLGA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID = '19';
		const MARIA_SERGEYEVNA_KULYGINA_CHARACTER_UUID = '20';
		const IRINA_SERGEYEVNA_PROZOROVA_CHARACTER_UUID = '21';

		const sandbox = createSandbox();

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
					differentiator: '1',
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
				differentiator: '1',
				errors: {},
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
			expect(await countNodesWithLabel('Playtext')).to.equal(1);

		});

		it('shows playtext (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/playtexts/${PLAYTEXT_UUID}`);

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'John Gabriel Borkman',
				differentiator: '1',
				writerGroups: [
					{
						model: 'writerGroup',
						name: 'by',
						writers: [
							{
								model: 'person',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen'
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
								name: 'David Eldridge'
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
				productions: []
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
				differentiator: '1',
				errors: {},
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

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.put(`/playtexts/${PLAYTEXT_UUID}`)
				.send({
					name: 'Three Sisters',
					differentiator: '1',
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
				differentiator: '1',
				errors: {},
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
			expect(await countNodesWithLabel('Playtext')).to.equal(1);

		});

		it('shows playtext (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/playtexts/${PLAYTEXT_UUID}`);

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'Three Sisters',
				differentiator: '1',
				writerGroups: [
					{
						model: 'writerGroup',
						name: 'by',
						writers: [
							{
								model: 'person',
								uuid: ANTON_CHEKHOV_PERSON_UUID,
								name: 'Anton Chekhov'
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
								name: 'Benedict Andrews'
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
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates playtext to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.put(`/playtexts/${PLAYTEXT_UUID}`)
				.send({
					name: 'Three Sisters',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'Three Sisters',
				differentiator: '1',
				errors: {},
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

		it('deletes playtext', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/playtexts/${PLAYTEXT_UUID}`);

			const expectedResponseBody = {
				model: 'playtext',
				name: 'Three Sisters',
				differentiator: '1',
				errors: {},
				writerGroups: [],
				characterGroups: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const UNCLE_VANYA_PLAYTEXT_UUID = '1';
		const THE_CHERRY_ORCHARD_PLAYTEXT_UUID = '3';
		const THREE_SISTERS_PLAYTEXT_UUID = '5';

		const sandbox = createSandbox();

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

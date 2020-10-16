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
				characters: [
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
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
				characters: [
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
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
				characters: [
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
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
				characters: [
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
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
				characterGroups: [
					{
						model: 'characterGroup',
						name: null,
						characters: []
					}
				],
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('lists all playtexts', async () => {

			const response = await chai.request(app)
				.get('/playtexts');

			const expectedResponseBody = [
				{
					model: 'playtext',
					uuid: PLAYTEXT_UUID,
					name: 'The Cherry Orchard'
				}
			];

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
				characters: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const PLAYTEXT_UUID = '4';
		const IRINA_NIKOLAYEVNA_ARKADINA_UUID = '5';
		const KONSTANTIN_GAVRILOVICH_TREPLYOV_UUID = '6';
		const BORIS_ALEXEYEVICH_TRIGORIN_UUID = '7';
		const OLGA_SERGEYEVNA_PROZOROVA_UUID = '11';
		const MARIA_SERGEYEVNA_KULYGINA_UUID = '12';
		const IRINA_SERGEYEVNA_PROZOROVA_UUID = '13';

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
					name: 'The Seagull',
					differentiator: '1',
					characters: [
						{
							name: 'Irina',
							underlyingName: 'Irina Nikolayevna Arkadina',
							differentiator: '1',
							qualifier: 'foo',
							group: 'The Guests'
						},
						{
							name: 'Konstantin',
							underlyingName: 'Konstantin Gavrilovich Treplyov',
							differentiator: '1',
							qualifier: 'bar',
							group: 'The Guests'
						},
						{
							name: 'Boris',
							underlyingName: 'Boris Alexeyevich Trigorin',
							differentiator: '1',
							qualifier: 'baz',
							group: 'The Guests'
						}
					]
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'The Seagull',
				differentiator: '1',
				errors: {},
				characters: [
					{
						model: 'character',
						name: 'Irina',
						underlyingName: 'Irina Nikolayevna Arkadina',
						differentiator: '1',
						qualifier: 'foo',
						group: 'The Guests',
						errors: {}
					},
					{
						model: 'character',
						name: 'Konstantin',
						underlyingName: 'Konstantin Gavrilovich Treplyov',
						differentiator: '1',
						qualifier: 'bar',
						group: 'The Guests',
						errors: {}
					},
					{
						model: 'character',
						name: 'Boris',
						underlyingName: 'Boris Alexeyevich Trigorin',
						differentiator: '1',
						qualifier: 'baz',
						group: 'The Guests',
						errors: {}
					},
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
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
				name: 'The Seagull',
				differentiator: '1',
				characterGroups: [
					{
						model: 'characterGroup',
						name: 'The Guests',
						characters: [
							{
								model: 'character',
								uuid: IRINA_NIKOLAYEVNA_ARKADINA_UUID,
								name: 'Irina',
								qualifier: 'foo'
							},
							{
								model: 'character',
								uuid: KONSTANTIN_GAVRILOVICH_TREPLYOV_UUID,
								name: 'Konstantin',
								qualifier: 'bar'
							},
							{
								model: 'character',
								uuid: BORIS_ALEXEYEVICH_TRIGORIN_UUID,
								name: 'Boris',
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
				name: 'The Seagull',
				differentiator: '1',
				errors: {},
				characters: [
					{
						model: 'character',
						name: 'Irina',
						underlyingName: 'Irina Nikolayevna Arkadina',
						differentiator: '1',
						qualifier: 'foo',
						group: 'The Guests',
						errors: {}
					},
					{
						model: 'character',
						name: 'Konstantin',
						underlyingName: 'Konstantin Gavrilovich Treplyov',
						differentiator: '1',
						qualifier: 'bar',
						group: 'The Guests',
						errors: {}
					},
					{
						model: 'character',
						name: 'Boris',
						underlyingName: 'Boris Alexeyevich Trigorin',
						differentiator: '1',
						qualifier: 'baz',
						group: 'The Guests',
						errors: {}
					},
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
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
					characters: [
						{
							name: 'Olga',
							underlyingName: 'Olga Sergeyevna Prozorova',
							differentiator: '1',
							qualifier: 'foo',
							group: 'The Prozorovs'
						},
						{
							name: 'Maria',
							underlyingName: 'Maria Sergeyevna Kulygina',
							differentiator: '1',
							qualifier: 'bar',
							group: 'The Prozorovs'
						},
						{
							name: 'Irina',
							underlyingName: 'Irina Sergeyevna Prozorova',
							differentiator: '1',
							qualifier: 'baz',
							group: 'The Prozorovs'
						}
					]
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'Three Sisters',
				differentiator: '1',
				errors: {},
				characters: [
					{
						model: 'character',
						name: 'Olga',
						underlyingName: 'Olga Sergeyevna Prozorova',
						differentiator: '1',
						qualifier: 'foo',
						group: 'The Prozorovs',
						errors: {}
					},
					{
						model: 'character',
						name: 'Maria',
						underlyingName: 'Maria Sergeyevna Kulygina',
						differentiator: '1',
						qualifier: 'bar',
						group: 'The Prozorovs',
						errors: {}
					},
					{
						model: 'character',
						name: 'Irina',
						underlyingName: 'Irina Sergeyevna Prozorova',
						differentiator: '1',
						qualifier: 'baz',
						group: 'The Prozorovs',
						errors: {}
					},
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
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
				characterGroups: [
					{
						model: 'characterGroup',
						name: 'The Prozorovs',
						characters: [
							{
								model: 'character',
								uuid: OLGA_SERGEYEVNA_PROZOROVA_UUID,
								name: 'Olga',
								qualifier: 'foo'
							},
							{
								model: 'character',
								uuid: MARIA_SERGEYEVNA_KULYGINA_UUID,
								name: 'Maria',
								qualifier: 'bar'
							},
							{
								model: 'character',
								uuid: IRINA_SERGEYEVNA_PROZOROVA_UUID,
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

		it('lists all playtexts', async () => {

			const response = await chai.request(app)
				.get('/playtexts');

			const expectedResponseBody = [
				{
					model: 'playtext',
					uuid: PLAYTEXT_UUID,
					name: 'Three Sisters'
				}
			];

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
				characters: [
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
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
				characters: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(0);

		});

	});

});

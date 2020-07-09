import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Playtexts API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new playtext', async () => {

			const response = await chai.request(app)
				.get('/playtexts/new');

			const expectedResponseBody = {
				model: 'playtext',
				name: '',
				errors: {},
				characters: [
					{
						model: 'character',
						name: '',
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
				errors: {},
				characters: [
					{
						model: 'character',
						name: '',
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
				errors: {},
				characters: [
					{
						model: 'character',
						name: '',
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
				errors: {},
				characters: [
					{
						model: 'character',
						name: '',
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
				characters: [],
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
				name: 'The Cherry Orchard'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const PLAYTEXT_UUID = '0';
		const IRINA_NIKOLAYEVNA_ARKADINA_UUID = '1';
		const KONSTANTIN_GAVRILOVICH_TREPLYOV_UUID = '2';
		const BORIS_ALEXEYEVICH_TRIGORIN_UUID = '3';
		const OLGA_SERGEYEVNA_PROZOROVA_UUID = '4';
		const MARIA_SERGEYEVNA_KULYGINA_UUID = '5';
		const IRINA_SERGEYEVNA_PROZOROVA_UUID = '6';

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
					characters: [
						{
							name: 'Irina Nikolayevna Arkadina'
						},
						{
							name: 'Konstantin Gavrilovich Treplyov'
						},
						{
							name: 'Boris Alexeyevich Trigorin'
						}
					]
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'The Seagull',
				errors: {},
				characters: [
					{
						model: 'character',
						name: 'Irina Nikolayevna Arkadina',
						errors: {},
					},
					{
						model: 'character',
						name: 'Konstantin Gavrilovich Treplyov',
						errors: {}
					},
					{
						model: 'character',
						name: 'Boris Alexeyevich Trigorin',
						errors: {}
					},
					{
						model: 'character',
						name: '',
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
				characters: [
					{
						model: 'character',
						uuid: IRINA_NIKOLAYEVNA_ARKADINA_UUID,
						name: 'Irina Nikolayevna Arkadina'
					},
					{
						model: 'character',
						uuid: KONSTANTIN_GAVRILOVICH_TREPLYOV_UUID,
						name: 'Konstantin Gavrilovich Treplyov'
					},
					{
						model: 'character',
						uuid: BORIS_ALEXEYEVICH_TRIGORIN_UUID,
						name: 'Boris Alexeyevich Trigorin'
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
				errors: {},
				characters: [
					{
						model: 'character',
						name: 'Irina Nikolayevna Arkadina',
						errors: {},
					},
					{
						model: 'character',
						name: 'Konstantin Gavrilovich Treplyov',
						errors: {}
					},
					{
						model: 'character',
						name: 'Boris Alexeyevich Trigorin',
						errors: {}
					},
					{
						model: 'character',
						name: '',
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
					characters: [
						{
							name: 'Olga Sergeyevna Prozorova'
						},
						{
							name: 'Maria Sergeyevna Kulygina'
						},
						{
							name: 'Irina Sergeyevna Prozorova'
						}
					]
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_UUID,
				name: 'Three Sisters',
				errors: {},
				characters: [
					{
						model: 'character',
						name: 'Olga Sergeyevna Prozorova',
						errors: {},
					},
					{
						model: 'character',
						name: 'Maria Sergeyevna Kulygina',
						errors: {}
					},
					{
						model: 'character',
						name: 'Irina Sergeyevna Prozorova',
						errors: {}
					},
					{
						model: 'character',
						name: '',
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
				characters: [
					{
						model: 'character',
						uuid: OLGA_SERGEYEVNA_PROZOROVA_UUID,
						name: 'Olga Sergeyevna Prozorova'
					},
					{
						model: 'character',
						uuid: MARIA_SERGEYEVNA_KULYGINA_UUID,
						name: 'Maria Sergeyevna Kulygina'
					},
					{
						model: 'character',
						uuid: IRINA_SERGEYEVNA_PROZOROVA_UUID,
						name: 'Irina Sergeyevna Prozorova'
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

		it('deletes playtext', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/playtexts/${PLAYTEXT_UUID}`);

			const expectedResponseBody = {
				model: 'playtext',
				name: 'Three Sisters'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(0);

		});

	});

	describe('requests for instances that do not exist in database', () => {

		const NON_EXISTENT_PLAYTEXT_UUID = 'foobar';

		describe('GET edit endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/playtexts/${NON_EXISTENT_PLAYTEXT_UUID}/edit`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('PUT update endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.put(`/playtexts/${NON_EXISTENT_PLAYTEXT_UUID}`)
					.send({ name: 'The Cherry Orchard' });

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('GET show endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/playtexts/${NON_EXISTENT_PLAYTEXT_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('DELETE delete endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.delete(`/playtexts/${NON_EXISTENT_PLAYTEXT_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

	});

});

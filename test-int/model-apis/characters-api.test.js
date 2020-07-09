import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Characters API', () => {

	chai.use(chaiHttp);

	const expect = chai.expect;

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new character', async () => {

			const response = await chai.request(app)
				.get('/characters/new');

			const expectedResponseBody = {
				model: 'character',
				name: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const CHARACTER_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const sandbox = createSandbox();

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(CHARACTER_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates character', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(0);

			const response = await chai.request(app)
				.post('/characters')
				.send({
					name: 'Romeo'
				});

			const expectedResponseBody = {
				model: 'character',
				uuid: CHARACTER_UUID,
				name: 'Romeo',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Character')).to.equal(1);

		});

		it('gets data required to edit specific character', async () => {

			const response = await chai.request(app)
				.get(`/characters/${CHARACTER_UUID}/edit`);

			const expectedResponseBody = {
				model: 'character',
				uuid: CHARACTER_UUID,
				name: 'Romeo',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates character', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(1);

			const response = await chai.request(app)
				.put(`/characters/${CHARACTER_UUID}`)
				.send({
					name: 'Juliet'
				});

			const expectedResponseBody = {
				model: 'character',
				uuid: CHARACTER_UUID,
				name: 'Juliet',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Character')).to.equal(1);

		});

		it('shows character', async () => {

			const response = await chai.request(app)
				.get(`/characters/${CHARACTER_UUID}`);

			const expectedResponseBody = {
				model: 'character',
				uuid: CHARACTER_UUID,
				name: 'Juliet',
				playtexts: [],
				productions: [],
				variantNames: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('lists all characters', async () => {

			const response = await chai.request(app)
				.get('/characters');

			const expectedResponseBody = [
				{
					model: 'character',
					uuid: CHARACTER_UUID,
					name: 'Juliet'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes character', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/characters/${CHARACTER_UUID}`);

			const expectedResponseBody = {
				model: 'character',
				name: 'Juliet'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Character')).to.equal(0);

		});

	});

	describe('requests for instances that do not exist in database', () => {

		const NON_EXISTENT_CHARACTER_UUID = 'foobar';

		describe('GET edit endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/characters/${NON_EXISTENT_CHARACTER_UUID}/edit`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('PUT update endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.put(`/characters/${NON_EXISTENT_CHARACTER_UUID}`)
					.send({ name: 'Juliet' });

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('GET show endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/characters/${NON_EXISTENT_CHARACTER_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('DELETE delete endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.delete(`/characters/${NON_EXISTENT_CHARACTER_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

	});

});

import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j';

describe('CRUD (Create, Read, Update, Delete): Characters API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new character', async () => {

			const response = await chai.request(app)
				.get('/characters/new');

			const expectedResponseBody = {
				model: 'CHARACTER',
				name: '',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const CHARACTER_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(crypto, 'randomUUID').returns(CHARACTER_UUID);

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
				model: 'CHARACTER',
				uuid: CHARACTER_UUID,
				name: 'Romeo',
				differentiator: '',
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
				model: 'CHARACTER',
				uuid: CHARACTER_UUID,
				name: 'Romeo',
				differentiator: '',
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
				model: 'CHARACTER',
				uuid: CHARACTER_UUID,
				name: 'Juliet',
				differentiator: '',
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
				model: 'CHARACTER',
				uuid: CHARACTER_UUID,
				name: 'Juliet',
				differentiator: null,
				materials: [],
				productions: [],
				variantNamedDepictions: [],
				variantNamedPortrayals: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes character', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/characters/${CHARACTER_UUID}`);

			const expectedResponseBody = {
				model: 'CHARACTER',
				name: 'Juliet',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Character')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const ROMEO_CHARACTER_UUID = '1';
		const JULIET_CHARACTER_UUID = '3';
		const NURSE_CHARACTER_UUID = '5';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/characters')
				.send({
					name: 'Romeo'
				});

			await chai.request(app)
				.post('/characters')
				.send({
					name: 'Juliet'
				});

			await chai.request(app)
				.post('/characters')
				.send({
					name: 'Nurse'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all characters ordered by name', async () => {

			const response = await chai.request(app)
				.get('/characters');

			const expectedResponseBody = [
				{
					model: 'CHARACTER',
					uuid: JULIET_CHARACTER_UUID,
					name: 'Juliet'
				},
				{
					model: 'CHARACTER',
					uuid: NURSE_CHARACTER_UUID,
					name: 'Nurse'
				},
				{
					model: 'CHARACTER',
					uuid: ROMEO_CHARACTER_UUID,
					name: 'Romeo'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

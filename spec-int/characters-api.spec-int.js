import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../server/app';
import countNodesWithLabel from './spec-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from './spec-helpers/neo4j/purge-database';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Characters API', () => {

	const CHARACTER_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').returns(CHARACTER_UUID);

		await purgeDatabase();

	});

	after(() => {

		sandbox.restore();

	});

	it('gets data required to prepare new character', async () => {

		const response = await chai.request(app)
			.get('/characters/new');

		const expectedResponseBody = {
			name: '',
			productions: [],
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);

	});

	it('creates character', async () => {

		expect(await countNodesWithLabel('Character')).to.equal(0);

		const response = await chai.request(app)
			.post('/characters')
			.send({ name: 'Romeo' });

		const expectedResponseBody = {
			model: 'character',
			uuid: CHARACTER_UUID,
			name: 'Romeo'
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
			name: 'Romeo'
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);

	});

	it('updates character', async () => {

		expect(await countNodesWithLabel('Character')).to.equal(1);

		const response = await chai.request(app)
			.post(`/characters/${CHARACTER_UUID}`)
			.send({ name: 'Juliet' })

		const expectedResponseBody = {
			model: 'character',
			uuid: CHARACTER_UUID,
			name: 'Juliet'
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

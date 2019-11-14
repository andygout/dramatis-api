import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../server/app';
import countNodesWithLabel from './spec-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from './spec-helpers/neo4j/purge-database';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Playtexts API', () => {

	const PLAYTEXT_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').returns(PLAYTEXT_UUID);

		await purgeDatabase();

	});

	after(() => {

		sandbox.restore();

	});

	it('gets data required to prepare new playtext', async () => {

		const response = await chai.request(app)
			.get('/playtexts/new');

		const expectedResponseBody = {
			name: '',
			characters: [],
			productions: [],
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);

	});

	it('creates playtext', async () => {

		expect(await countNodesWithLabel('Playtext')).to.equal(0);

		const response = await chai.request(app)
			.post('/playtexts')
			.send({ name: 'The Seagull' });

		const expectedResponseBody = {
			model: 'playtext',
			uuid: PLAYTEXT_UUID,
			name: 'The Seagull'
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
			name: 'The Seagull',
			characters: [
				{
					name: ''
				}
			]
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);

	});

	it('updates playtext', async () => {

		expect(await countNodesWithLabel('Playtext')).to.equal(1);

		const response = await chai.request(app)
			.post(`/playtexts/${PLAYTEXT_UUID}`)
			.send({ name: 'Three Sisters' })

		const expectedResponseBody = {
			model: 'playtext',
			uuid: PLAYTEXT_UUID,
			name: 'Three Sisters'
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
			name: 'Three Sisters',
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

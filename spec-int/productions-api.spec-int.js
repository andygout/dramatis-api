import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../server/app';
import countNodesWithLabel from './spec-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from './spec-helpers/neo4j/purge-database';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Productions API', () => {

	const PRODUCTION_UUID = '0';
	const THEATRE_UUID = '1';

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

	});

	after(() => {

		sandbox.restore();

	});

	it('gets data required to prepare new production', async () => {

		const response = await chai.request(app)
			.get('/productions/new');

		const expectedResponseBody = {
			name: '',
			cast: [],
			playtext: {
				name: '',
				characters: [],
				productions: [],
				errors: {}
			},
			theatre: {
				name: '',
				productions: [],
				errors: {}
			},
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);

	});

	it('creates production', async () => {

		expect(await countNodesWithLabel('Production')).to.equal(0);

		const response = await chai.request(app)
			.post('/productions')
			.send({ name: 'As You Like It', theatre: { name: 'Novello Theatre' } });

		const expectedResponseBody = {
			model: 'production',
			uuid: PRODUCTION_UUID,
			name: 'As You Like It'
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Production')).to.equal(1);

	});

	it('gets data required to edit specific production', async () => {

		const response = await chai.request(app)
			.get(`/productions/${PRODUCTION_UUID}/edit`);

		const expectedResponseBody = {
			model: 'production',
			uuid: PRODUCTION_UUID,
			name: 'As You Like It',
			cast: [
				{
					name: '',
					roles: [
						{
							characterName: '',
							name: ''
						}
					]
				}
			],
			playtext: {
				name: null
			},
			theatre: {
				name: 'Novello Theatre'
			}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);

	});

	it('updates production', async () => {

		expect(await countNodesWithLabel('Production')).to.equal(1);

		const response = await chai.request(app)
			.post(`/productions/${PRODUCTION_UUID}`)
			.send({ name: 'The Tempest', theatre: { name: 'Novello Theatre' } });

		const expectedResponseBody = {
			model: 'production',
			uuid: PRODUCTION_UUID,
			name: 'The Tempest'
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Production')).to.equal(1);

	});

	it('shows production', async () => {

		const response = await chai.request(app)
			.get(`/productions/${PRODUCTION_UUID}`);

		const expectedResponseBody = {
			model: 'production',
			uuid: PRODUCTION_UUID,
			name: 'The Tempest',
			cast: [],
			playtext: null,
			theatre: {
				model: 'theatre',
				name: 'Novello Theatre',
				uuid: THEATRE_UUID
			}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);

	});

	it('lists all productions', async () => {

		const response = await chai.request(app)
			.get('/productions');

		const expectedResponseBody = [
			{
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'The Tempest',
				theatre: {
					model: 'theatre',
					name: 'Novello Theatre',
					uuid: THEATRE_UUID
				}
			}
		];

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);

	});

	it('deletes production', async () => {

		expect(await countNodesWithLabel('Production')).to.equal(1);

		const response = await chai.request(app)
			.delete(`/productions/${PRODUCTION_UUID}`);

		const expectedResponseBody = {
			model: 'production',
			name: 'The Tempest'
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Production')).to.equal(0);

	});

});

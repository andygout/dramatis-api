import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Uniqueness in database: Theatres API', () => {

	chai.use(chaiHttp);

	const THEATRE_1_UUID = '1';
	const THEATRE_2_UUID = '4';

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

	});

	after(() => {

		sandbox.restore();

	});

	it('creates theatre without differentiator', async () => {

		expect(await countNodesWithLabel('Theatre')).to.equal(0);

		const response = await chai.request(app)
			.post('/theatres')
			.send({
				name: 'New Theatre'
			});

		const expectedResponseBody = {
			model: 'theatre',
			uuid: THEATRE_1_UUID,
			name: 'New Theatre',
			differentiator: '',
			errors: {},
			subTheatres: [
				{
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Theatre')).to.equal(1);

	});

	it('responds with errors if trying to create existing theatre that does also not have differentiator', async () => {

		expect(await countNodesWithLabel('Theatre')).to.equal(1);

		const response = await chai.request(app)
			.post('/theatres')
			.send({
				name: 'New Theatre'
			});

		const expectedResponseBody = {
			model: 'theatre',
			name: 'New Theatre',
			differentiator: '',
			hasErrors: true,
			errors: {
				name: [
					'Name and differentiator combination already exists'
				],
				differentiator: [
					'Name and differentiator combination already exists'
				]
			},
			subTheatres: []
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Theatre')).to.equal(1);

	});

	it('creates theatre with same name as existing theatre but uses a differentiator', async () => {

		expect(await countNodesWithLabel('Theatre')).to.equal(1);

		const response = await chai.request(app)
			.post('/theatres')
			.send({
				name: 'New Theatre',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'theatre',
			uuid: THEATRE_2_UUID,
			name: 'New Theatre',
			differentiator: '1',
			errors: {},
			subTheatres: [
				{
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Theatre')).to.equal(2);

	});

	it('responds with errors if trying to update theatre to one with same name and differentiator combination', async () => {

		expect(await countNodesWithLabel('Theatre')).to.equal(2);

		const response = await chai.request(app)
			.put(`/theatres/${THEATRE_1_UUID}`)
			.send({
				name: 'New Theatre',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'theatre',
			uuid: THEATRE_1_UUID,
			name: 'New Theatre',
			differentiator: '1',
			hasErrors: true,
			errors: {
				name: [
					'Name and differentiator combination already exists'
				],
				differentiator: [
					'Name and differentiator combination already exists'
				]
			},
			subTheatres: []
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Theatre')).to.equal(2);

	});

	it('updates theatre with same name as existing theatre but uses a different differentiator', async () => {

		expect(await countNodesWithLabel('Theatre')).to.equal(2);

		const response = await chai.request(app)
			.put(`/theatres/${THEATRE_1_UUID}`)
			.send({
				name: 'New Theatre',
				differentiator: '2'
			});

		const expectedResponseBody = {
			model: 'theatre',
			uuid: THEATRE_1_UUID,
			name: 'New Theatre',
			differentiator: '2',
			errors: {},
			subTheatres: [
				{
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Theatre')).to.equal(2);

	});

	it('updates theatre with same name as existing theatre but without a differentiator', async () => {

		expect(await countNodesWithLabel('Theatre')).to.equal(2);

		const response = await chai.request(app)
			.put(`/theatres/${THEATRE_2_UUID}`)
			.send({
				name: 'New Theatre'
			});

		const expectedResponseBody = {
			model: 'theatre',
			uuid: THEATRE_2_UUID,
			name: 'New Theatre',
			differentiator: '',
			errors: {},
			subTheatres: [
				{
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				}
			]
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Theatre')).to.equal(2);

	});

});

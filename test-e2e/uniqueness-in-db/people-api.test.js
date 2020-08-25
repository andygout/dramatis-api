import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Uniqueness in database: People API', () => {

	chai.use(chaiHttp);

	const PEOPLE_1_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
	const PEOPLE_2_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

	const sandbox = createSandbox();

	before(async () => {

		sandbox.stub(uuid, 'v4')
			.onFirstCall().returns(PEOPLE_1_UUID)
			.onSecondCall().returns(PEOPLE_2_UUID);

		await purgeDatabase();

	});

	after(() => {

		sandbox.restore();

	});

	it('creates person without differentiator', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(0);

		const response = await chai.request(app)
			.post('/people')
			.send({
				name: 'Paul Higgins'
			});

		const expectedResponseBody = {
			model: 'person',
			uuid: PEOPLE_1_UUID,
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Person')).to.equal(1);

	});

	it('responds with errors if trying to create existing person that does also not have differentiator', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(1);

		const response = await chai.request(app)
			.post('/people')
			.send({
				name: 'Paul Higgins'
			});

		const expectedResponseBody = {
			model: 'person',
			name: 'Paul Higgins',
			differentiator: '',
			hasErrors: true,
			errors: {
				name: [
					'Name and differentiator combination already exists'
				],
				differentiator: [
					'Name and differentiator combination already exists'
				]
			}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Person')).to.equal(1);

	});

	it('creates person with same name as existing person but uses a differentiator', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(1);

		const response = await chai.request(app)
			.post('/people')
			.send({
				name: 'Paul Higgins',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'person',
			uuid: PEOPLE_2_UUID,
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Person')).to.equal(2);

	});

	it('responds with errors if trying to update person to one with same name and differentiator combination', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(2);

		const response = await chai.request(app)
			.put(`/people/${PEOPLE_1_UUID}`)
			.send({
				name: 'Paul Higgins',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'person',
			uuid: PEOPLE_1_UUID,
			name: 'Paul Higgins',
			differentiator: '1',
			hasErrors: true,
			errors: {
				name: [
					'Name and differentiator combination already exists'
				],
				differentiator: [
					'Name and differentiator combination already exists'
				]
			}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Person')).to.equal(2);

	});

	it('updates person with same name as existing person but uses a different differentiator', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(2);

		const response = await chai.request(app)
			.put(`/people/${PEOPLE_1_UUID}`)
			.send({
				name: 'Paul Higgins',
				differentiator: '2'
			});

		const expectedResponseBody = {
			model: 'person',
			uuid: PEOPLE_1_UUID,
			name: 'Paul Higgins',
			differentiator: '2',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Person')).to.equal(2);

	});

	it('updates person with same name as existing person but without a differentiator', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(2);

		const response = await chai.request(app)
			.put(`/people/${PEOPLE_2_UUID}`)
			.send({
				name: 'Paul Higgins'
			});

		const expectedResponseBody = {
			model: 'person',
			uuid: PEOPLE_2_UUID,
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Person')).to.equal(2);

	});

});

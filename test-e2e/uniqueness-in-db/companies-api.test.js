import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Uniqueness in database: Companies API', () => {

	chai.use(chaiHttp);

	const COMPANY_1_UUID = '1';
	const COMPANY_2_UUID = '4';

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

	});

	after(() => {

		sandbox.restore();

	});

	it('creates company without differentiator', async () => {

		expect(await countNodesWithLabel('Company')).to.equal(0);

		const response = await chai.request(app)
			.post('/companies')
			.send({
				name: 'Gate Theatre Company'
			});

		const expectedResponseBody = {
			model: 'company',
			uuid: COMPANY_1_UUID,
			name: 'Gate Theatre Company',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Company')).to.equal(1);

	});

	it('responds with errors if trying to create existing company that does also not have differentiator', async () => {

		expect(await countNodesWithLabel('Company')).to.equal(1);

		const response = await chai.request(app)
			.post('/companies')
			.send({
				name: 'Gate Theatre Company'
			});

		const expectedResponseBody = {
			model: 'company',
			name: 'Gate Theatre Company',
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
		expect(await countNodesWithLabel('Company')).to.equal(1);

	});

	it('creates company with same name as existing company but uses a differentiator', async () => {

		expect(await countNodesWithLabel('Company')).to.equal(1);

		const response = await chai.request(app)
			.post('/companies')
			.send({
				name: 'Gate Theatre Company',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'company',
			uuid: COMPANY_2_UUID,
			name: 'Gate Theatre Company',
			differentiator: '1',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Company')).to.equal(2);

	});

	it('responds with errors if trying to update company to one with same name and differentiator combination', async () => {

		expect(await countNodesWithLabel('Company')).to.equal(2);

		const response = await chai.request(app)
			.put(`/companies/${COMPANY_1_UUID}`)
			.send({
				name: 'Gate Theatre Company',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'company',
			uuid: COMPANY_1_UUID,
			name: 'Gate Theatre Company',
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
		expect(await countNodesWithLabel('Company')).to.equal(2);

	});

	it('updates company with same name as existing company but uses a different differentiator', async () => {

		expect(await countNodesWithLabel('Company')).to.equal(2);

		const response = await chai.request(app)
			.put(`/companies/${COMPANY_1_UUID}`)
			.send({
				name: 'Gate Theatre Company',
				differentiator: '2'
			});

		const expectedResponseBody = {
			model: 'company',
			uuid: COMPANY_1_UUID,
			name: 'Gate Theatre Company',
			differentiator: '2',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Company')).to.equal(2);

	});

	it('updates company with same name as existing company but without a differentiator', async () => {

		expect(await countNodesWithLabel('Company')).to.equal(2);

		const response = await chai.request(app)
			.put(`/companies/${COMPANY_2_UUID}`)
			.send({
				name: 'Gate Theatre Company'
			});

		const expectedResponseBody = {
			model: 'company',
			uuid: COMPANY_2_UUID,
			name: 'Gate Theatre Company',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Company')).to.equal(2);

	});

});

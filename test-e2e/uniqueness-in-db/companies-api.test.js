import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';

const { expect } = chai;

chai.use(chaiHttp);

const COMPANY_1_UUID = '2';
const COMPANY_2_UUID = '5';

describe('Uniqueness in database: Companies API', () => {

	before(async () => {

		stubUuidCounterClient.setValueToZero();

		await purgeDatabase();

	});

	after(() => {

		stubUuidCounterClient.setValueToUndefined();

	});

	it('creates company without differentiator', async () => {

		expect(await countNodesWithLabel('Company')).to.equal(0);

		const response = await request.execute(app)
			.post('/companies')
			.send({
				name: 'Gate Theatre Company'
			});

		const expectedResponseBody = {
			model: 'COMPANY',
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

		const response = await request.execute(app)
			.post('/companies')
			.send({
				name: 'Gate Theatre Company'
			});

		const expectedResponseBody = {
			model: 'COMPANY',
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

		const response = await request.execute(app)
			.post('/companies')
			.send({
				name: 'Gate Theatre Company',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'COMPANY',
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

		const response = await request.execute(app)
			.put(`/companies/${COMPANY_1_UUID}`)
			.send({
				name: 'Gate Theatre Company',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'COMPANY',
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

		const response = await request.execute(app)
			.put(`/companies/${COMPANY_1_UUID}`)
			.send({
				name: 'Gate Theatre Company',
				differentiator: '2'
			});

		const expectedResponseBody = {
			model: 'COMPANY',
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

		const response = await request.execute(app)
			.put(`/companies/${COMPANY_2_UUID}`)
			.send({
				name: 'Gate Theatre Company'
			});

		const expectedResponseBody = {
			model: 'COMPANY',
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

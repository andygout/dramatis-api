import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Companies API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new company', async () => {

			const response = await chai.request(app)
				.get('/companies/new');

			const expectedResponseBody = {
				model: 'company',
				name: '',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const COMPANY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(COMPANY_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates company', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(0);

			const response = await chai.request(app)
				.post('/companies')
				.send({
					name: 'National Theatre Company'
				});

			const expectedResponseBody = {
				model: 'company',
				uuid: COMPANY_UUID,
				name: 'National Theatre Company',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Company')).to.equal(1);

		});

		it('gets data required to edit specific company', async () => {

			const response = await chai.request(app)
				.get(`/companies/${COMPANY_UUID}/edit`);

			const expectedResponseBody = {
				model: 'company',
				uuid: COMPANY_UUID,
				name: 'National Theatre Company',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates company', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(1);

			const response = await chai.request(app)
				.put(`/companies/${COMPANY_UUID}`)
				.send({
					name: 'Royal Shakespeare Company'
				});

			const expectedResponseBody = {
				model: 'company',
				uuid: COMPANY_UUID,
				name: 'Royal Shakespeare Company',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Company')).to.equal(1);

		});

		it('shows company', async () => {

			const response = await chai.request(app)
				.get(`/companies/${COMPANY_UUID}`);

			const expectedResponseBody = {
				model: 'company',
				uuid: COMPANY_UUID,
				name: 'Royal Shakespeare Company',
				differentiator: null
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes company', async () => {

			expect(await countNodesWithLabel('Company')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/companies/${COMPANY_UUID}`);

			const expectedResponseBody = {
				model: 'company',
				name: 'Royal Shakespeare Company',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Company')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const NATIONAL_THEATRE_COMPANY_UUID = '1';
		const ROYAL_SHAKESPEARE_COMPANY_UUID = '3';
		const ALMEIDA_THEATRE_COMPANY_UUID = '5';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/companies')
				.send({
					name: 'National Theatre Company'
				});

			await chai.request(app)
				.post('/companies')
				.send({
					name: 'Royal Shakespeare Company'
				});

			await chai.request(app)
				.post('/companies')
				.send({
					name: 'Almeida Theatre Company'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all companies ordered by name', async () => {

			const response = await chai.request(app)
				.get('/companies');

			const expectedResponseBody = [
				{
					model: 'company',
					uuid: ALMEIDA_THEATRE_COMPANY_UUID,
					name: 'Almeida Theatre Company'
				},
				{
					model: 'company',
					uuid: NATIONAL_THEATRE_COMPANY_UUID,
					name: 'National Theatre Company'
				},
				{
					model: 'company',
					uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
					name: 'Royal Shakespeare Company'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

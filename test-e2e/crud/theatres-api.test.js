import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Theatres API', () => {

	chai.use(chaiHttp);

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new theatre', async () => {

			const response = await chai.request(app)
				.get('/theatres/new');

			const expectedResponseBody = {
				model: 'theatre',
				name: '',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const THEATRE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const sandbox = createSandbox();

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(THEATRE_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates theatre', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(0);

			const response = await chai.request(app)
				.post('/theatres')
				.send({
					name: 'National Theatre'
				});

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'National Theatre',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(1);

		});

		it('gets data required to edit specific theatre', async () => {

			const response = await chai.request(app)
				.get(`/theatres/${THEATRE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'National Theatre',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates theatre', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(1);

			const response = await chai.request(app)
				.put(`/theatres/${THEATRE_UUID}`)
				.send({
					name: 'Almeida Theatre'
				});

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'Almeida Theatre',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(1);

		});

		it('shows theatre', async () => {

			const response = await chai.request(app)
				.get(`/theatres/${THEATRE_UUID}`);

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'Almeida Theatre',
				differentiator: null,
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('lists all theatres', async () => {

			const response = await chai.request(app)
				.get('/theatres');

			const expectedResponseBody = [
				{
					model: 'theatre',
					uuid: THEATRE_UUID,
					name: 'Almeida Theatre',
					differentiator: null
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes theatre', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/theatres/${THEATRE_UUID}`);

			const expectedResponseBody = {
				model: 'theatre',
				name: 'Almeida Theatre',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(0);

		});

	});

});

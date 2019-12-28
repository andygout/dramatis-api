import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../server/app';
import countNodesWithLabel from './spec-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from './spec-helpers/neo4j/purge-database';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Theatres API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new theatre', async () => {

			const response = await chai.request(app)
				.get('/theatres/new');

			const expectedResponseBody = {
				model: 'theatre',
				name: '',
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
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates theatre', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(1);

			const response = await chai.request(app)
				.post(`/theatres/${THEATRE_UUID}`)
				.send({
					name: 'Almeida Theatre'
				});

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'Almeida Theatre',
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
					name: 'Almeida Theatre'
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
				name: 'Almeida Theatre'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(0);

		});

	});

});

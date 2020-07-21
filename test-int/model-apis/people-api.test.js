import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('People API', () => {

	chai.use(chaiHttp);

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new person', async () => {

			const response = await chai.request(app)
				.get('/people/new');

			const expectedResponseBody = {
				model: 'person',
				name: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const PERSON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const sandbox = createSandbox();

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(PERSON_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates person', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.post('/people')
				.send({
					name: 'Ian McKellen'
				});

			const expectedResponseBody = {
				model: 'person',
				uuid: PERSON_UUID,
				name: 'Ian McKellen',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('gets data required to edit specific person', async () => {

			const response = await chai.request(app)
				.get(`/people/${PERSON_UUID}/edit`);

			const expectedResponseBody = {
				model: 'person',
				uuid: PERSON_UUID,
				name: 'Ian McKellen',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates person', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/people/${PERSON_UUID}`)
				.send({
					name: 'Patrick Stewart'
				});

			const expectedResponseBody = {
				model: 'person',
				uuid: PERSON_UUID,
				name: 'Patrick Stewart',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('shows person', async () => {

			const response = await chai.request(app)
				.get(`/people/${PERSON_UUID}`);

			const expectedResponseBody = {
				model: 'person',
				uuid: PERSON_UUID,
				name: 'Patrick Stewart',
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('lists all people', async () => {

			const response = await chai.request(app)
				.get('/people');

			const expectedResponseBody = [
				{
					model: 'person',
					uuid: PERSON_UUID,
					name: 'Patrick Stewart'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes person', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/people/${PERSON_UUID}`);

			const expectedResponseBody = {
				model: 'person',
				name: 'Patrick Stewart'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Person')).to.equal(0);

		});

	});

	describe('requests for instances that do not exist in database', () => {

		const NON_EXISTENT_PERSON_UUID = 'foobar';

		describe('GET edit endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/people/${NON_EXISTENT_PERSON_UUID}/edit`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('PUT update endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.put(`/people/${NON_EXISTENT_PERSON_UUID}`)
					.send({ name: 'Patrick Stewart' });

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('GET show endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.get(`/people/${NON_EXISTENT_PERSON_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

		describe('DELETE delete endpoint', () => {

			it('responds with 404 Not Found error', async () => {

				const response = await chai.request(app)
					.delete(`/people/${NON_EXISTENT_PERSON_UUID}`);

				expect(response).to.have.status(404);
				expect(response.text).to.equal('Not Found');

			});

		});

	});

});

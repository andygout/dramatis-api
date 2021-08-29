import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Awards API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new award', async () => {

			const response = await chai.request(app)
				.get('/awards/new');

			const expectedResponseBody = {
				model: 'award',
				name: '',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const AWARD_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(AWARD_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates award', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(0);

			const response = await chai.request(app)
				.post('/awards')
				.send({
					name: 'Laurence Olivier Awards'
				});

			const expectedResponseBody = {
				model: 'award',
				uuid: AWARD_UUID,
				name: 'Laurence Olivier Awards',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Award')).to.equal(1);

		});

		it('gets data required to edit specific award', async () => {

			const response = await chai.request(app)
				.get(`/awards/${AWARD_UUID}/edit`);

			const expectedResponseBody = {
				model: 'award',
				uuid: AWARD_UUID,
				name: 'Laurence Olivier Awards',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates award', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(1);

			const response = await chai.request(app)
				.put(`/awards/${AWARD_UUID}`)
				.send({
					name: 'Evening Standard Theatre Awards'
				});

			const expectedResponseBody = {
				model: 'award',
				uuid: AWARD_UUID,
				name: 'Evening Standard Theatre Awards',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Award')).to.equal(1);

		});

		it('shows award', async () => {

			const response = await chai.request(app)
				.get(`/awards/${AWARD_UUID}`);

			const expectedResponseBody = {
				model: 'award',
				uuid: AWARD_UUID,
				name: 'Evening Standard Theatre Awards',
				differentiator: null,
				awardCeremonies: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes award', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/awards/${AWARD_UUID}`);

			const expectedResponseBody = {
				model: 'award',
				name: 'Evening Standard Theatre Awards',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Award')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '1';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '3';
		const CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID = '5';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/awards')
				.send({
					name: 'Evening Standard Theatre Awards'
				});

			await chai.request(app)
				.post('/awards')
				.send({
					name: 'Laurence Olivier Awards'
				});

			await chai.request(app)
				.post('/awards')
				.send({
					name: 'Critics\' Circle Theatre Awards'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all awards ordered by name', async () => {

			const response = await chai.request(app)
				.get('/awards');

			const expectedResponseBody = [
				{
					model: 'award',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards'
				},
				{
					model: 'award',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards'
				},
				{
					model: 'award',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

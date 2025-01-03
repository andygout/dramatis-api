import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

const { expect } = chai;

chai.use(chaiHttp);

describe('CRUD (Create, Read, Update, Delete): Awards API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new award', async () => {

			const response = await request.execute(app)
				.get('/awards/new');

			const expectedResponseBody = {
				model: 'AWARD',
				name: '',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const AWARD_UUID = 'LAURENCE_OLIVIER_AWARDS_AWARD_UUID';

		before(async () => {

			stubUuidToCountMapClient.clear();

			await purgeDatabase();

		});

		it('creates award', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(0);

			const response = await request.execute(app)
				.post('/awards')
				.send({
					name: 'Laurence Olivier Awards'
				});

			const expectedResponseBody = {
				model: 'AWARD',
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

			const response = await request.execute(app)
				.get(`/awards/${AWARD_UUID}/edit`);

			const expectedResponseBody = {
				model: 'AWARD',
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

			const response = await request.execute(app)
				.put(`/awards/${AWARD_UUID}`)
				.send({
					name: 'Evening Standard Theatre Awards'
				});

			const expectedResponseBody = {
				model: 'AWARD',
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

			const response = await request.execute(app)
				.get(`/awards/${AWARD_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD',
				uuid: AWARD_UUID,
				name: 'Evening Standard Theatre Awards',
				differentiator: null,
				ceremonies: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes award', async () => {

			expect(await countNodesWithLabel('Award')).to.equal(1);

			const response = await request.execute(app)
				.delete(`/awards/${AWARD_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD',
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

		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = 'EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = 'LAURENCE_OLIVIER_AWARDS_AWARD_UUID';
		const CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID = 'CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID';

		before(async () => {

			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request.execute(app)
				.post('/awards')
				.send({
					name: 'Evening Standard Theatre Awards'
				});

			await request.execute(app)
				.post('/awards')
				.send({
					name: 'Laurence Olivier Awards'
				});

			await request.execute(app)
				.post('/awards')
				.send({
					name: 'Critics\' Circle Theatre Awards'
				});

		});

		it('lists all awards ordered by name', async () => {

			const response = await request.execute(app)
				.get('/awards');

			const expectedResponseBody = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards'
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards'
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

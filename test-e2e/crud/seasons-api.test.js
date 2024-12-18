import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

const { expect } = chai;

chai.use(chaiHttp);

describe('CRUD (Create, Read, Update, Delete): Seasons API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new season', async () => {

			const response = await request.execute(app)
				.get('/seasons/new');

			const expectedResponseBody = {
				model: 'SEASON',
				name: '',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const SEASON_UUID = 'NOT_BLACK_AND_WHITE_SEASON_UUID';

		before(async () => {

			stubUuidToCountMapClient.clear();

			await purgeDatabase();

		});

		it('creates season', async () => {

			expect(await countNodesWithLabel('Season')).to.equal(0);

			const response = await request.execute(app)
				.post('/seasons')
				.send({
					name: 'Not Black and White'
				});

			const expectedResponseBody = {
				model: 'SEASON',
				uuid: SEASON_UUID,
				name: 'Not Black and White',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Season')).to.equal(1);

		});

		it('gets data required to edit specific season', async () => {

			const response = await request.execute(app)
				.get(`/seasons/${SEASON_UUID}/edit`);

			const expectedResponseBody = {
				model: 'SEASON',
				uuid: SEASON_UUID,
				name: 'Not Black and White',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates season', async () => {

			expect(await countNodesWithLabel('Season')).to.equal(1);

			const response = await request.execute(app)
				.put(`/seasons/${SEASON_UUID}`)
				.send({
					name: 'The David Hare Season'
				});

			const expectedResponseBody = {
				model: 'SEASON',
				uuid: SEASON_UUID,
				name: 'The David Hare Season',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Season')).to.equal(1);

		});

		it('shows season', async () => {

			const response = await request.execute(app)
				.get(`/seasons/${SEASON_UUID}`);

			const expectedResponseBody = {
				model: 'SEASON',
				uuid: SEASON_UUID,
				name: 'The David Hare Season',
				differentiator: null,
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes season', async () => {

			expect(await countNodesWithLabel('Season')).to.equal(1);

			const response = await request.execute(app)
				.delete(`/seasons/${SEASON_UUID}`);

			const expectedResponseBody = {
				model: 'SEASON',
				name: 'The David Hare Season',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Season')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const THE_DAVID_HARE_SEASON_UUID = 'THE_DAVID_HARE_SEASON_SEASON_UUID';
		const NOT_BLACK_AND_WHITE_SEASON_UUID = 'NOT_BLACK_AND_WHITE_SEASON_UUID';
		const DONMAR_IN_THE_WEST_END_SEASON_UUID = 'DONMAR_IN_THE_WEST_END_SEASON_UUID';

		before(async () => {

			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request.execute(app)
				.post('/seasons')
				.send({
					name: 'The David Hare Season'
				});

			await request.execute(app)
				.post('/seasons')
				.send({
					name: 'Not Black and White'
				});

			await request.execute(app)
				.post('/seasons')
				.send({
					name: 'Donmar in the West End'
				});

		});

		it('lists all seasons ordered by name', async () => {

			const response = await request.execute(app)
				.get('/seasons');

			const expectedResponseBody = [
				{
					model: 'SEASON',
					uuid: DONMAR_IN_THE_WEST_END_SEASON_UUID,
					name: 'Donmar in the West End'
				},
				{
					model: 'SEASON',
					uuid: NOT_BLACK_AND_WHITE_SEASON_UUID,
					name: 'Not Black and White'
				},
				{
					model: 'SEASON',
					uuid: THE_DAVID_HARE_SEASON_UUID,
					name: 'The David Hare Season'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

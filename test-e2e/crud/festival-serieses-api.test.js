import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

const { expect } = chai;

chai.use(chaiHttp);

describe('CRUD (Create, Read, Update, Delete): Festival Serieses API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new festival series', async () => {

			const response = await request.execute(app)
				.get('/festival-serieses/new');

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				name: '',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const FESTIVAL_SERIES_UUID = 'EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID';

		before(async () => {

			stubUuidToCountMapClient.clear();

			await purgeDatabase();

		});

		it('creates festival series', async () => {

			expect(await countNodesWithLabel('FestivalSeries')).to.equal(0);

			const response = await request.execute(app)
				.post('/festival-serieses')
				.send({
					name: 'Edinburgh International Festival'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				uuid: FESTIVAL_SERIES_UUID,
				name: 'Edinburgh International Festival',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('FestivalSeries')).to.equal(1);

		});

		it('gets data required to edit specific festival series', async () => {

			const response = await request.execute(app)
				.get(`/festival-serieses/${FESTIVAL_SERIES_UUID}/edit`);

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				uuid: FESTIVAL_SERIES_UUID,
				name: 'Edinburgh International Festival',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates festival series', async () => {

			expect(await countNodesWithLabel('FestivalSeries')).to.equal(1);

			const response = await request.execute(app)
				.put(`/festival-serieses/${FESTIVAL_SERIES_UUID}`)
				.send({
					name: 'Connections'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				uuid: FESTIVAL_SERIES_UUID,
				name: 'Connections',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('FestivalSeries')).to.equal(1);

		});

		it('shows festival series', async () => {

			const response = await request.execute(app)
				.get(`/festival-serieses/${FESTIVAL_SERIES_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				uuid: FESTIVAL_SERIES_UUID,
				name: 'Connections',
				differentiator: null,
				festivals: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes festival series', async () => {

			expect(await countNodesWithLabel('FestivalSeries')).to.equal(1);

			const response = await request.execute(app)
				.delete(`/festival-serieses/${FESTIVAL_SERIES_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL_SERIES',
				name: 'Connections',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('FestivalSeries')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const HIGHTIDE_FESTIVAL_SERIES_UUID = 'HIGHTIDE_FESTIVAL_FESTIVAL_SERIES_UUID';
		const EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID = 'EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID';
		const CONNECTIONS_FESTIVAL_SERIES_UUID = 'CONNECTIONS_FESTIVAL_SERIES_UUID';

		before(async () => {

			stubUuidToCountMapClient.clear();

			await purgeDatabase();

			await request.execute(app)
				.post('/festival-serieses')
				.send({
					name: 'Edinburgh International Festival'
				});

			await request.execute(app)
				.post('/festival-serieses')
				.send({
					name: 'HighTide Festival'
				});

			await request.execute(app)
				.post('/festival-serieses')
				.send({
					name: 'Connections'
				});

		});

		it('lists all festival serieses ordered by name', async () => {

			const response = await request.execute(app)
				.get('/festival-serieses');

			const expectedResponseBody = [
				{
					model: 'FESTIVAL_SERIES',
					uuid: CONNECTIONS_FESTIVAL_SERIES_UUID,
					name: 'Connections'
				},
				{
					model: 'FESTIVAL_SERIES',
					uuid: EDINBURGH_INTERNATIONAL_FESTIVAL_FESTIVAL_SERIES_UUID,
					name: 'Edinburgh International Festival'
				},
				{
					model: 'FESTIVAL_SERIES',
					uuid: HIGHTIDE_FESTIVAL_SERIES_UUID,
					name: 'HighTide Festival'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

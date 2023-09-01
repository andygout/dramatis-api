import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid';
import app from '../../src/app';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j';
import { getStubUuid } from '../test-helpers';

describe('CRUD (Create, Read, Update, Delete): Festivals API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new festival', async () => {

			const response = await chai.request(app)
				.get('/festivals/new');

			const expectedResponseBody = {
				model: 'FESTIVAL',
				name: '',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD', () => {

		const FESTIVAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').returns(FESTIVAL_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates festival', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(0);

			const response = await chai.request(app)
				.post('/festivals')
				.send({
					name: 'The Complete Works'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: 'The Complete Works',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(1);

		});

		it('gets data required to edit specific festival', async () => {

			const response = await chai.request(app)
				.get(`/festivals/${FESTIVAL_UUID}/edit`);

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: 'The Complete Works',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates festival', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(1);

			const response = await chai.request(app)
				.put(`/festivals/${FESTIVAL_UUID}`)
				.send({
					name: 'Globe to Globe'
				});

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: 'Globe to Globe',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(1);

		});

		it('shows festival', async () => {

			const response = await chai.request(app)
				.get(`/festivals/${FESTIVAL_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL',
				uuid: FESTIVAL_UUID,
				name: 'Globe to Globe',
				differentiator: null
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes festival', async () => {

			expect(await countNodesWithLabel('Festival')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/festivals/${FESTIVAL_UUID}`);

			const expectedResponseBody = {
				model: 'FESTIVAL',
				name: 'Globe to Globe',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Festival')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const SHAKESPEARE_400_ARTS_FESTIVAL_UUID = 'SHAKESPEARE_400_ARTS_FESTIVAL_FESTIVAL_UUID';
		const THE_COMPLETE_WORKS_FESTIVAL_UUID = 'THE_COMPLETE_WORKS_FESTIVAL_UUID';
		const GLOBE_TO_GLOBE_FESTIVAL_UUID = 'GLOBE_TO_GLOBE_FESTIVAL_UUID';

		before(async () => {

			const stubUuidCounts = {};

			sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(arg => getStubUuid(arg, stubUuidCounts));

			await purgeDatabase();

			await chai.request(app)
				.post('/festivals')
				.send({
					name: 'Shakespeare 400 Arts Festival'
				});

			await chai.request(app)
				.post('/festivals')
				.send({
					name: 'The Complete Works'
				});

			await chai.request(app)
				.post('/festivals')
				.send({
					name: 'Globe to Globe'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all festivals ordered by name', async () => {

			const response = await chai.request(app)
				.get('/festivals');

			const expectedResponseBody = [
				{
					model: 'FESTIVAL',
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
					name: 'Globe to Globe'
				},
				{
					model: 'FESTIVAL',
					uuid: SHAKESPEARE_400_ARTS_FESTIVAL_UUID,
					name: 'Shakespeare 400 Arts Festival'
				},
				{
					model: 'FESTIVAL',
					uuid: THE_COMPLETE_WORKS_FESTIVAL_UUID,
					name: 'The Complete Works'
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

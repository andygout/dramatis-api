import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';

const { expect } = chai;

chai.use(chaiHttp);

const SEASON_1_UUID = '2';
const SEASON_2_UUID = '5';

describe('Uniqueness in database: Seasons API', () => {

	before(async () => {

		stubUuidCounterClient.setValueToZero();

		await purgeDatabase();

	});

	after(() => {

		stubUuidCounterClient.setValueToUndefined();

	});

	it('creates season without differentiator', async () => {

		expect(await countNodesWithLabel('Season')).to.equal(0);

		const response = await request.execute(app)
			.post('/seasons')
			.send({
				name: 'Donmar in the West End'
			});

		const expectedResponseBody = {
			model: 'SEASON',
			uuid: SEASON_1_UUID,
			name: 'Donmar in the West End',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Season')).to.equal(1);

	});

	it('responds with errors if trying to create existing season that does also not have differentiator', async () => {

		expect(await countNodesWithLabel('Season')).to.equal(1);

		const response = await request.execute(app)
			.post('/seasons')
			.send({
				name: 'Donmar in the West End'
			});

		const expectedResponseBody = {
			model: 'SEASON',
			name: 'Donmar in the West End',
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
		expect(await countNodesWithLabel('Season')).to.equal(1);

	});

	it('creates season with same name as existing season but uses a differentiator', async () => {

		expect(await countNodesWithLabel('Season')).to.equal(1);

		const response = await request.execute(app)
			.post('/seasons')
			.send({
				name: 'Donmar in the West End',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'SEASON',
			uuid: SEASON_2_UUID,
			name: 'Donmar in the West End',
			differentiator: '1',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Season')).to.equal(2);

	});

	it('responds with errors if trying to update season to one with same name and differentiator combination', async () => {

		expect(await countNodesWithLabel('Season')).to.equal(2);

		const response = await request.execute(app)
			.put(`/seasons/${SEASON_1_UUID}`)
			.send({
				name: 'Donmar in the West End',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'SEASON',
			uuid: SEASON_1_UUID,
			name: 'Donmar in the West End',
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
		expect(await countNodesWithLabel('Season')).to.equal(2);

	});

	it('updates season with same name as existing season but uses a different differentiator', async () => {

		expect(await countNodesWithLabel('Season')).to.equal(2);

		const response = await request.execute(app)
			.put(`/seasons/${SEASON_1_UUID}`)
			.send({
				name: 'Donmar in the West End',
				differentiator: '2'
			});

		const expectedResponseBody = {
			model: 'SEASON',
			uuid: SEASON_1_UUID,
			name: 'Donmar in the West End',
			differentiator: '2',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Season')).to.equal(2);

	});

	it('updates season with same name as existing season but without a differentiator', async () => {

		expect(await countNodesWithLabel('Season')).to.equal(2);

		const response = await request.execute(app)
			.put(`/seasons/${SEASON_2_UUID}`)
			.send({
				name: 'Donmar in the West End'
			});

		const expectedResponseBody = {
			model: 'SEASON',
			uuid: SEASON_2_UUID,
			name: 'Donmar in the West End',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Season')).to.equal(2);

	});

});

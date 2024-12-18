import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';

import app from '../../src/app.js';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidCounterClient } from '../test-helpers/index.js';

const { expect } = chai;

chai.use(chaiHttp);

const PERSON_1_UUID = '2';
const PERSON_2_UUID = '5';

describe('Uniqueness in database: People API', () => {

	before(async () => {

		stubUuidCounterClient.setValueToZero();

		await purgeDatabase();

	});

	after(() => {

		stubUuidCounterClient.setValueToUndefined();

	});

	it('creates person without differentiator', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(0);

		const response = await request.execute(app)
			.post('/people')
			.send({
				name: 'Paul Higgins'
			});

		const expectedResponseBody = {
			model: 'PERSON',
			uuid: PERSON_1_UUID,
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Person')).to.equal(1);

	});

	it('responds with errors if trying to create existing person that does also not have differentiator', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(1);

		const response = await request.execute(app)
			.post('/people')
			.send({
				name: 'Paul Higgins'
			});

		const expectedResponseBody = {
			model: 'PERSON',
			name: 'Paul Higgins',
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
		expect(await countNodesWithLabel('Person')).to.equal(1);

	});

	it('creates person with same name as existing person but uses a differentiator', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(1);

		const response = await request.execute(app)
			.post('/people')
			.send({
				name: 'Paul Higgins',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'PERSON',
			uuid: PERSON_2_UUID,
			name: 'Paul Higgins',
			differentiator: '1',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Person')).to.equal(2);

	});

	it('responds with errors if trying to update person to one with same name and differentiator combination', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(2);

		const response = await request.execute(app)
			.put(`/people/${PERSON_1_UUID}`)
			.send({
				name: 'Paul Higgins',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'PERSON',
			uuid: PERSON_1_UUID,
			name: 'Paul Higgins',
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
		expect(await countNodesWithLabel('Person')).to.equal(2);

	});

	it('updates person with same name as existing person but uses a different differentiator', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(2);

		const response = await request.execute(app)
			.put(`/people/${PERSON_1_UUID}`)
			.send({
				name: 'Paul Higgins',
				differentiator: '2'
			});

		const expectedResponseBody = {
			model: 'PERSON',
			uuid: PERSON_1_UUID,
			name: 'Paul Higgins',
			differentiator: '2',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Person')).to.equal(2);

	});

	it('updates person with same name as existing person but without a differentiator', async () => {

		expect(await countNodesWithLabel('Person')).to.equal(2);

		const response = await request.execute(app)
			.put(`/people/${PERSON_2_UUID}`)
			.send({
				name: 'Paul Higgins'
			});

		const expectedResponseBody = {
			model: 'PERSON',
			uuid: PERSON_2_UUID,
			name: 'Paul Higgins',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Person')).to.equal(2);

	});

});

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import * as getRandomUuidModule from '../../src/lib/get-random-uuid';
import app from '../../src/app';
import { countNodesWithLabel, purgeDatabase } from '../test-helpers/neo4j';

describe('Uniqueness in database: Festivals API', () => {

	chai.use(chaiHttp);

	const FESTIVAL_1_UUID = '1';
	const FESTIVAL_2_UUID = '4';

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(getRandomUuidModule, 'getRandomUuid').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

	});

	after(() => {

		sandbox.restore();

	});

	it('creates festival without differentiator', async () => {

		expect(await countNodesWithLabel('Festival')).to.equal(0);

		const response = await chai.request(app)
			.post('/festivals')
			.send({
				name: 'Globe to Globe'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL',
			uuid: FESTIVAL_1_UUID,
			name: 'Globe to Globe',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Festival')).to.equal(1);

	});

	it('responds with errors if trying to create existing festival that does also not have differentiator', async () => {

		expect(await countNodesWithLabel('Festival')).to.equal(1);

		const response = await chai.request(app)
			.post('/festivals')
			.send({
				name: 'Globe to Globe'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL',
			name: 'Globe to Globe',
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
		expect(await countNodesWithLabel('Festival')).to.equal(1);

	});

	it('creates festival with same name as existing festival but uses a differentiator', async () => {

		expect(await countNodesWithLabel('Festival')).to.equal(1);

		const response = await chai.request(app)
			.post('/festivals')
			.send({
				name: 'Globe to Globe',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL',
			uuid: FESTIVAL_2_UUID,
			name: 'Globe to Globe',
			differentiator: '1',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Festival')).to.equal(2);

	});

	it('responds with errors if trying to update festival to one with same name and differentiator combination', async () => {

		expect(await countNodesWithLabel('Festival')).to.equal(2);

		const response = await chai.request(app)
			.put(`/festivals/${FESTIVAL_1_UUID}`)
			.send({
				name: 'Globe to Globe',
				differentiator: '1'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL',
			uuid: FESTIVAL_1_UUID,
			name: 'Globe to Globe',
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
		expect(await countNodesWithLabel('Festival')).to.equal(2);

	});

	it('updates festival with same name as existing festival but uses a different differentiator', async () => {

		expect(await countNodesWithLabel('Festival')).to.equal(2);

		const response = await chai.request(app)
			.put(`/festivals/${FESTIVAL_1_UUID}`)
			.send({
				name: 'Globe to Globe',
				differentiator: '2'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL',
			uuid: FESTIVAL_1_UUID,
			name: 'Globe to Globe',
			differentiator: '2',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Festival')).to.equal(2);

	});

	it('updates festival with same name as existing festival but without a differentiator', async () => {

		expect(await countNodesWithLabel('Festival')).to.equal(2);

		const response = await chai.request(app)
			.put(`/festivals/${FESTIVAL_2_UUID}`)
			.send({
				name: 'Globe to Globe'
			});

		const expectedResponseBody = {
			model: 'FESTIVAL',
			uuid: FESTIVAL_2_UUID,
			name: 'Globe to Globe',
			differentiator: '',
			errors: {}
		};

		expect(response).to.have.status(200);
		expect(response.body).to.deep.equal(expectedResponseBody);
		expect(await countNodesWithLabel('Festival')).to.equal(2);

	});

});

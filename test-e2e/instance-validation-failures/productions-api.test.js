import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import matchNode from '../test-helpers/neo4j/match-node';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Instance validation failures: Productions API', () => {

	chai.use(chaiHttp);

	before(async () => {

		await purgeDatabase();

	});

	describe('attempt to create instance', () => {

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(0);

				const response = await chai.request(app)
					.post('/productions')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'production',
					name: '',
					hasErrors: true,
					errors: {
						name: [
							'Name is too short'
						]
					},
					theatre: {
						model: 'theatre',
						name: '',
						errors: {}
					},
					playtext: {
						model: 'playtext',
						name: '',
						errors: {}
					},
					cast: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(0);

			});

		});

	});

	describe('attempt to update instance', () => {

		const MACBETH_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Production',
				name: 'Macbeth',
				uuid: MACBETH_PRODUCTION_UUID
			});

		});

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(1);

				const response = await chai.request(app)
					.put(`/productions/${MACBETH_PRODUCTION_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'production',
					uuid: MACBETH_PRODUCTION_UUID,
					name: '',
					hasErrors: true,
					errors: {
						name: [
							'Name is too short'
						]
					},
					theatre: {
						model: 'theatre',
						name: '',
						errors: {}
					},
					playtext: {
						model: 'playtext',
						name: '',
						errors: {}
					},
					cast: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(1);
				expect(await matchNode({
					label: 'Production',
					name: 'Macbeth',
					uuid: MACBETH_PRODUCTION_UUID
				})).to.be.true;

			});

		});

	});

});

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import createRelationship from '../test-helpers/neo4j/create-relationship';
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
						name: '',
						theatre: {
							name: 'Almeida Theatre'
						}
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
						name: 'Almeida Theatre',
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

		const MACBETH_ALMEIDA_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const ALMEIDA_THEATRE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Production',
				name: 'Macbeth',
				uuid: MACBETH_ALMEIDA_PRODUCTION_UUID
			});

			await createNode({
				label: 'Theatre',
				name: 'Almeida Theatre',
				uuid: ALMEIDA_THEATRE_UUID
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: MACBETH_ALMEIDA_PRODUCTION_UUID,
				destinationLabel: 'Theatre',
				destinationUuid: ALMEIDA_THEATRE_UUID,
				relationshipName: 'PLAYS_AT'
			});

		});

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(1);

				const response = await chai.request(app)
					.put(`/productions/${MACBETH_ALMEIDA_PRODUCTION_UUID}`)
					.send({
						name: '',
						theatre: {
							name: 'Almeida Theatre'
						}
					});

				const expectedResponseBody = {
					model: 'production',
					uuid: MACBETH_ALMEIDA_PRODUCTION_UUID,
					name: '',
					hasErrors: true,
					errors: {
						name: [
							'Name is too short'
						]
					},
					theatre: {
						model: 'theatre',
						name: 'Almeida Theatre',
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
					uuid: MACBETH_ALMEIDA_PRODUCTION_UUID
				})).to.be.true;

			});

		});

	});

});

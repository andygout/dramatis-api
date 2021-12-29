import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import createRelationship from '../test-helpers/neo4j/create-relationship';
import isNodeExistent from '../test-helpers/neo4j/is-node-existent';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Instance validation failures: Productions API', () => {

	chai.use(chaiHttp);

	describe('attempt to create instance', () => {

		before(async () => {

			await purgeDatabase();

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(0);

				const response = await chai.request(app)
					.post('/productions')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					name: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					material: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
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
				uuid: MACBETH_PRODUCTION_UUID,
				name: 'Macbeth'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(1);

				const response = await chai.request(app)
					.put(`/productions/${MACBETH_PRODUCTION_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: MACBETH_PRODUCTION_UUID,
					name: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					material: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(1);
				expect(await isNodeExistent({
					label: 'Production',
					name: 'Macbeth',
					uuid: MACBETH_PRODUCTION_UUID
				})).to.be.true;

			});

		});

	});

	describe('attempt to delete instance', () => {

		const OTHELLO_DONMAR_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const DONMAR_WAREHOUSE_VENUE_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';
		const OTHELLO_MATERIAL_UUID = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: OTHELLO_DONMAR_PRODUCTION_UUID,
				name: 'Othello'
			});

			await createNode({
				label: 'Venue',
				uuid: DONMAR_WAREHOUSE_VENUE_UUID,
				name: 'Donmar Warehouse'
			});

			await createNode({
				label: 'Material',
				uuid: OTHELLO_MATERIAL_UUID,
				name: 'Othello'
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: OTHELLO_DONMAR_PRODUCTION_UUID,
				destinationLabel: 'Venue',
				destinationUuid: DONMAR_WAREHOUSE_VENUE_UUID,
				relationshipName: 'PLAYS_AT'
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: OTHELLO_DONMAR_PRODUCTION_UUID,
				destinationLabel: 'Material',
				destinationUuid: OTHELLO_MATERIAL_UUID,
				relationshipName: 'PRODUCTION_OF'
			});

		});

		context('instance has associations', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(1);

				const response = await chai.request(app)
					.delete(`/productions/${OTHELLO_DONMAR_PRODUCTION_UUID}`);

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: OTHELLO_DONMAR_PRODUCTION_UUID,
					name: 'Othello',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {
						associations: [
							'Material',
							'Venue'
						]
					},
					material: {
						model: 'MATERIAL',
						name: '',
						differentiator: '',
						errors: {}
					},
					venue: {
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Production')).to.equal(1);

			});

		});

	});

});

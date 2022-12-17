import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import isNodeExistent from '../test-helpers/neo4j/is-node-existent';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Database validation failures: Productions API', () => {

	chai.use(chaiHttp);

	describe('attempt to create instance', () => {

		before(async () => {

			await purgeDatabase();

		});

		context('sub-production uuid does not exist in database', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(0);

				const response = await chai.request(app)
					.post('/productions')
					.send({
						name: 'The Coast of Utopia',
						subProductions: [
							{
								uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					name: 'The Coast of Utopia',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
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
					subProductions: [
						{
							model: 'PRODUCTION_IDENTIFIER',
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							errors: {
								uuid: [
									'Production with this UUID does not exist'
								]
							}
						}
					],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

			});

		});

	});

	describe('attempt to update instance', () => {

		const THE_COAST_OF_UTOPIA_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Production',
				uuid: THE_COAST_OF_UTOPIA_PRODUCTION_UUID,
				name: 'The Coast of Utopia'
			});

		});

		context('sub-production uuid does not exist in database', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Production')).to.equal(1);

				const response = await chai.request(app)
					.put(`/productions/${THE_COAST_OF_UTOPIA_PRODUCTION_UUID}`)
					.send({
						name: 'The Coast of Utopia',
						subProductions: [
							{
								uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
							}
						]
					});

				const expectedResponseBody = {
					model: 'PRODUCTION',
					uuid: THE_COAST_OF_UTOPIA_PRODUCTION_UUID,
					name: 'The Coast of Utopia',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
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
					subProductions: [
						{
							model: 'PRODUCTION_IDENTIFIER',
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							errors: {
								uuid: [
									'Production with this UUID does not exist'
								]
							}
						}
					],
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
					name: 'The Coast of Utopia',
					uuid: THE_COAST_OF_UTOPIA_PRODUCTION_UUID
				})).to.be.true;

			});

		});

	});

});

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import { countNodesWithLabel, createNode, isNodeExistent, purgeDatabase } from '../test-helpers/neo4j';

describe('Instance validation failures: Festivals API', () => {

	chai.use(chaiHttp);

	describe('attempt to create instance', () => {

		const THE_COMPLETE_WORKS_FESTIVAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Festival',
				uuid: THE_COMPLETE_WORKS_FESTIVAL_UUID,
				name: 'The Complete Works'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Festival')).to.equal(1);

				const response = await chai.request(app)
					.post('/festivals')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'FESTIVAL',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Festival')).to.equal(1);

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Festival')).to.equal(1);

				const response = await chai.request(app)
					.post('/festivals')
					.send({
						name: 'The Complete Works'
					});

				const expectedResponseBody = {
					model: 'FESTIVAL',
					name: 'The Complete Works',
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

		});

	});

	describe('attempt to update instance', () => {

		const GLOBE_TO_GLOBE_FESTIVAL_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const THE_COMPLETE_WORKS_FESTIVAL_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Festival',
				uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
				name: 'Globe to Globe'
			});

			await createNode({
				label: 'Festival',
				uuid: THE_COMPLETE_WORKS_FESTIVAL_UUID,
				name: 'The Complete Works'
			});

		});

		context('instance has input validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Festival')).to.equal(2);

				const response = await chai.request(app)
					.put(`/festivals/${GLOBE_TO_GLOBE_FESTIVAL_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'FESTIVAL',
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Festival')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Festival',
					name: 'Globe to Globe',
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation failures', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Festival')).to.equal(2);

				const response = await chai.request(app)
					.put(`/festivals/${GLOBE_TO_GLOBE_FESTIVAL_UUID}`)
					.send({
						name: 'The Complete Works'
					});

				const expectedResponseBody = {
					model: 'FESTIVAL',
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID,
					name: 'The Complete Works',
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
				expect(await countNodesWithLabel('Festival')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Festival',
					name: 'Globe to Globe',
					uuid: GLOBE_TO_GLOBE_FESTIVAL_UUID
				})).to.be.true;

			});

		});

	});

});

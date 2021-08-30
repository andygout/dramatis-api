import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import createRelationship from '../test-helpers/neo4j/create-relationship';
import isNodeExistent from '../test-helpers/neo4j/is-node-existent';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Instance validation failures: People API', () => {

	chai.use(chaiHttp);

	describe('attempt to create instance', () => {

		const MAGGIE_SMITH_PERSON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Person',
				uuid: MAGGIE_SMITH_PERSON_UUID,
				name: 'Maggie Smith'
			});

		});

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Person')).to.equal(1);

				const response = await chai.request(app)
					.post('/people')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'PERSON',
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
				expect(await countNodesWithLabel('Person')).to.equal(1);

			});

		});

		context('instance has database validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Person')).to.equal(1);

				const response = await chai.request(app)
					.post('/people')
					.send({
						name: 'Maggie Smith'
					});

				const expectedResponseBody = {
					model: 'PERSON',
					name: 'Maggie Smith',
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

		});

	});

	describe('attempt to update instance', () => {

		const JUDI_DENCH_PERSON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const MAGGIE_SMITH_PERSON_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Person',
				uuid: JUDI_DENCH_PERSON_UUID,
				name: 'Judi Dench'
			});

			await createNode({
				label: 'Person',
				uuid: MAGGIE_SMITH_PERSON_UUID,
				name: 'Maggie Smith'
			});

		});

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Person')).to.equal(2);

				const response = await chai.request(app)
					.put(`/people/${JUDI_DENCH_PERSON_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'PERSON',
					uuid: JUDI_DENCH_PERSON_UUID,
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
				expect(await countNodesWithLabel('Person')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Person',
					name: 'Judi Dench',
					uuid: JUDI_DENCH_PERSON_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Person')).to.equal(2);

				const response = await chai.request(app)
					.put(`/people/${JUDI_DENCH_PERSON_UUID}`)
					.send({
						name: 'Maggie Smith'
					});

				const expectedResponseBody = {
					model: 'PERSON',
					uuid: JUDI_DENCH_PERSON_UUID,
					name: 'Maggie Smith',
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
				expect(await countNodesWithLabel('Person')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Person',
					name: 'Judi Dench',
					uuid: JUDI_DENCH_PERSON_UUID
				})).to.be.true;

			});

		});

	});

	describe('attempt to delete instance', () => {

		const JUDI_DENCH_PERSON_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Person',
				uuid: JUDI_DENCH_PERSON_UUID,
				name: 'Judi Dench'
			});

			await createNode({
				label: 'Production',
				uuid: A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID,
				name: 'A Midsummer Night\'s Dream'
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID,
				destinationLabel: 'Person',
				destinationUuid: JUDI_DENCH_PERSON_UUID,
				relationshipName: 'HAS_CAST_MEMBER'
			});

		});

		context('instance has associations', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Person')).to.equal(1);

				const response = await chai.request(app)
					.delete(`/people/${JUDI_DENCH_PERSON_UUID}`);

				const expectedResponseBody = {
					model: 'PERSON',
					uuid: JUDI_DENCH_PERSON_UUID,
					name: 'Judi Dench',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: [
							'Production'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Person')).to.equal(1);

			});

		});

	});

});

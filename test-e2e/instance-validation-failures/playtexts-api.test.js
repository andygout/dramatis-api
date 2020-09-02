import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import createRelationship from '../test-helpers/neo4j/create-relationship';
import isNodeExistent from '../test-helpers/neo4j/is-node-existent';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Instance validation failures: Playtexts API', () => {

	chai.use(chaiHttp);

	describe('attempt to create instance', () => {

		const THE_WILD_DUCK_PLAYTEXT_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Playtext',
				name: 'The Wild Duck',
				uuid: THE_WILD_DUCK_PLAYTEXT_UUID
			});

		});

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Playtext')).to.equal(1);

				const response = await chai.request(app)
					.post('/playtexts')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'playtext',
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					characters: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Playtext')).to.equal(1);

			});

		});

		context('instance has database validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Playtext')).to.equal(1);

				const response = await chai.request(app)
					.post('/playtexts')
					.send({
						name: 'The Wild Duck'
					});

				const expectedResponseBody = {
					model: 'playtext',
					name: 'The Wild Duck',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					},
					characters: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Playtext')).to.equal(1);

			});

		});

	});

	describe('attempt to update instance', () => {

		const GHOSTS_PLAYTEXT_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const THE_WILD_DUCK_PLAYTEXT_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Playtext',
				name: 'Ghosts',
				uuid: GHOSTS_PLAYTEXT_UUID
			});

			await createNode({
				label: 'Playtext',
				name: 'The Wild Duck',
				uuid: THE_WILD_DUCK_PLAYTEXT_UUID
			});

		});

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Playtext')).to.equal(2);

				const response = await chai.request(app)
					.put(`/playtexts/${GHOSTS_PLAYTEXT_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'playtext',
					uuid: GHOSTS_PLAYTEXT_UUID,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					characters: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Playtext')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Playtext',
					name: 'Ghosts',
					uuid: GHOSTS_PLAYTEXT_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Playtext')).to.equal(2);

				const response = await chai.request(app)
					.put(`/playtexts/${GHOSTS_PLAYTEXT_UUID}`)
					.send({
						name: 'The Wild Duck'
					});

				const expectedResponseBody = {
					model: 'playtext',
					uuid: GHOSTS_PLAYTEXT_UUID,
					name: 'The Wild Duck',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					},
					characters: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Playtext')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Playtext',
					name: 'Ghosts',
					uuid: GHOSTS_PLAYTEXT_UUID
				})).to.be.true;

			});

		});

	});

	describe('attempt to delete instance', () => {

		const GHOSTS_PLAYTEXT_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const GHOSTS_ALMEIDA_PRODUCTION_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Playtext',
				name: 'Ghosts',
				uuid: GHOSTS_PLAYTEXT_UUID
			});

			await createNode({
				label: 'Production',
				name: 'Ghosts',
				uuid: GHOSTS_ALMEIDA_PRODUCTION_UUID
			});

			await createRelationship({
				sourceLabel: 'Production',
				sourceUuid: GHOSTS_ALMEIDA_PRODUCTION_UUID,
				destinationLabel: 'Playtext',
				destinationUuid: GHOSTS_PLAYTEXT_UUID,
				relationshipName: 'PRODUCTION_OF'
			});

		});

		context('instance has associations', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Playtext')).to.equal(1);

				const response = await chai.request(app)
					.delete(`/playtexts/${GHOSTS_PLAYTEXT_UUID}`);

				const expectedResponseBody = {
					model: 'playtext',
					uuid: GHOSTS_PLAYTEXT_UUID,
					name: 'Ghosts',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: [
							'Production'
						]
					},
					characters: []
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Playtext')).to.equal(1);

			});

		});

	});

});

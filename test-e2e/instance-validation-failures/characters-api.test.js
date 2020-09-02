import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import createRelationship from '../test-helpers/neo4j/create-relationship';
import isNodeExistent from '../test-helpers/neo4j/is-node-existent';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Instance validation failures: Characters API', () => {

	chai.use(chaiHttp);

	describe('attempt to create instance', () => {

		const ORSINO_CHARACTER_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Character',
				name: 'Orsino',
				uuid: ORSINO_CHARACTER_UUID
			});

		});

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Character')).to.equal(1);

				const response = await chai.request(app)
					.post('/characters')
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'character',
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
				expect(await countNodesWithLabel('Character')).to.equal(1);

			});

		});

		context('instance has database validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Character')).to.equal(1);

				const response = await chai.request(app)
					.post('/characters')
					.send({
						name: 'Orsino'
					});

				const expectedResponseBody = {
					model: 'character',
					name: 'Orsino',
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
				expect(await countNodesWithLabel('Character')).to.equal(1);

			});

		});

	});

	describe('attempt to update instance', () => {

		const VIOLA_CHARACTER_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const ORSINO_CHARACTER_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Character',
				name: 'Viola',
				uuid: VIOLA_CHARACTER_UUID
			});

			await createNode({
				label: 'Character',
				name: 'Orsino',
				uuid: ORSINO_CHARACTER_UUID
			});

		});

		context('instance has input validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Character')).to.equal(2);

				const response = await chai.request(app)
					.put(`/characters/${VIOLA_CHARACTER_UUID}`)
					.send({
						name: ''
					});

				const expectedResponseBody = {
					model: 'character',
					uuid: VIOLA_CHARACTER_UUID,
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
				expect(await countNodesWithLabel('Character')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Character',
					name: 'Viola',
					uuid: VIOLA_CHARACTER_UUID
				})).to.be.true;

			});

		});

		context('instance has database validation errors', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Character')).to.equal(2);

				const response = await chai.request(app)
					.put(`/characters/${VIOLA_CHARACTER_UUID}`)
					.send({
						name: 'Orsino'
					});

				const expectedResponseBody = {
					model: 'character',
					uuid: VIOLA_CHARACTER_UUID,
					name: 'Orsino',
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
				expect(await countNodesWithLabel('Character')).to.equal(2);
				expect(await isNodeExistent({
					label: 'Character',
					name: 'Viola',
					uuid: VIOLA_CHARACTER_UUID
				})).to.be.true;

			});

		});

	});

	describe('attempt to delete instance', () => {

		const VIOLA_CHARACTER_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		const TWELFTH_NIGHT_PLAYTEXT_UUID = 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy';

		before(async () => {

			await purgeDatabase();

			await createNode({
				label: 'Character',
				name: 'Viola',
				uuid: VIOLA_CHARACTER_UUID
			});

			await createNode({
				label: 'Playtext',
				name: 'Twelfth Night',
				uuid: TWELFTH_NIGHT_PLAYTEXT_UUID
			});

			await createRelationship({
				sourceLabel: 'Playtext',
				sourceUuid: TWELFTH_NIGHT_PLAYTEXT_UUID,
				destinationLabel: 'Character',
				destinationUuid: VIOLA_CHARACTER_UUID,
				relationshipName: 'INCLUDES_CHARACTER'
			});

		});

		context('instance has associations', () => {

			it('returns instance with appropriate errors attached', async () => {

				expect(await countNodesWithLabel('Character')).to.equal(1);

				const response = await chai.request(app)
					.delete(`/characters/${VIOLA_CHARACTER_UUID}`);

				const expectedResponseBody = {
					model: 'character',
					uuid: VIOLA_CHARACTER_UUID,
					name: 'Viola',
					differentiator: null,
					hasErrors: true,
					errors: {
						associations: [
							'Playtext'
						]
					}
				};

				expect(response).to.have.status(200);
				expect(response.body).to.deep.equal(expectedResponseBody);
				expect(await countNodesWithLabel('Character')).to.equal(1);

			});

		});

	});

});

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Uniqueness in database: Playtexts API', () => {

	describe('Playtext uniqueness in database', () => {

		chai.use(chaiHttp);

		const PLAYTEXT_1_UUID = '1';
		const PLAYTEXT_2_UUID = '4';

		const sandbox = createSandbox();

		before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates playtext without differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(0);

			const response = await chai.request(app)
				.post('/playtexts')
				.send({
					name: 'Home'
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_1_UUID,
				name: 'Home',
				differentiator: '',
				errors: {},
				writers: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {}
					}
				],
				characters: [
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(1);

		});

		it('responds with errors if trying to create existing playtext that does also not have differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.post('/playtexts')
				.send({
					name: 'Home'
				});

			const expectedResponseBody = {
				model: 'playtext',
				name: 'Home',
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
				writers: [],
				characters: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(1);

		});

		it('creates playtext with same name as existing playtext but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.post('/playtexts')
				.send({
					name: 'Home',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_2_UUID,
				name: 'Home',
				differentiator: '1',
				errors: {},
				writers: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {}
					}
				],
				characters: [
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(2);

		});

		it('responds with errors if trying to update playtext to one with same name and differentiator combination', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${PLAYTEXT_1_UUID}`)
				.send({
					name: 'Home',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_1_UUID,
				name: 'Home',
				differentiator: '1',
				hasErrors: true,
				errors: {
					name: [
						'Name and differentiator combination already exists'
					],
					differentiator: [
						'Name and differentiator combination already exists'
					]
				},
				writers: [],
				characters: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(2);

		});

		it('updates playtext with same name as existing playtext but uses a different differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${PLAYTEXT_1_UUID}`)
				.send({
					name: 'Home',
					differentiator: '2'
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_1_UUID,
				name: 'Home',
				differentiator: '2',
				errors: {},
				writers: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {}
					}
				],
				characters: [
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(2);

		});

		it('updates playtext with same name as existing playtext but without a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${PLAYTEXT_2_UUID}`)
				.send({
					name: 'Home'
				});

			const expectedResponseBody = {
				model: 'playtext',
				uuid: PLAYTEXT_2_UUID,
				name: 'Home',
				differentiator: '',
				errors: {},
				writers: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {}
					}
				],
				characters: [
					{
						model: 'character',
						name: '',
						underlyingName: '',
						differentiator: '',
						qualifier: '',
						group: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(2);

		});

	});

	describe('Playtext writer uniqueness in database', () => {

		chai.use(chaiHttp);

		const DOT_PLAYTEXT_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const sandbox = createSandbox();

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Playtext',
				name: 'Dot',
				uuid: DOT_PLAYTEXT_UUID
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates playtext and creates writer that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/playtexts/${DOT_PLAYTEXT_UUID}`)
				.send({
					name: 'Dot',
					writers: [
						{
							name: 'Kate Ryan'
						}
					]
				});

			const expectedPersonKateRyan1 = {
				model: 'person',
				name: 'Kate Ryan',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.writers[0]).to.deep.equal(expectedPersonKateRyan1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates playtext and creates writer that has same name as existing writer but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/playtexts/${DOT_PLAYTEXT_UUID}`)
				.send({
					name: 'Dot',
					writers: [
						{
							name: 'Kate Ryan',
							differentiator: '1'
						}
					]
				});

			const expectedPersonKateRyan2 = {
				model: 'person',
				name: 'Kate Ryan',
				differentiator: '1',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.writers[0]).to.deep.equal(expectedPersonKateRyan2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates playtext and uses existing writer that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${DOT_PLAYTEXT_UUID}`)
				.send({
					name: 'Dot',
					writers: [
						{
							name: 'Kate Ryan'
						}
					]
				});

			const expectedPersonKateRyan1 = {
				model: 'person',
				name: 'Kate Ryan',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.writers[0]).to.deep.equal(expectedPersonKateRyan1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates playtext and uses existing writer that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${DOT_PLAYTEXT_UUID}`)
				.send({
					name: 'Dot',
					writers: [
						{
							name: 'Kate Ryan',
							differentiator: '1'
						}
					]
				});

			const expectedPersonKateRyan2 = {
				model: 'person',
				name: 'Kate Ryan',
				differentiator: '1',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.writers[0]).to.deep.equal(expectedPersonKateRyan2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

	describe('Playtext character uniqueness in database', () => {

		chai.use(chaiHttp);

		const TITUS_ANDRONICUS_PLAYTEXT_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const sandbox = createSandbox();

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Playtext',
				name: 'Titus Andronicus',
				uuid: TITUS_ANDRONICUS_PLAYTEXT_UUID
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates playtext and creates character that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(0);

			const response = await chai.request(app)
				.put(`/playtexts/${TITUS_ANDRONICUS_PLAYTEXT_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characters: [
						{
							name: 'Demetrius'
						}
					]
				});

			const expectedCharacterDemetrius1 = {
				model: 'character',
				name: 'Demetrius',
				underlyingName: '',
				differentiator: '',
				qualifier: '',
				group: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.characters[0]).to.deep.equal(expectedCharacterDemetrius1);
			expect(await countNodesWithLabel('Character')).to.equal(1);

		});

		it('updates playtext and creates character that has same name as existing character but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(1);

			const response = await chai.request(app)
				.put(`/playtexts/${TITUS_ANDRONICUS_PLAYTEXT_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characters: [
						{
							name: 'Demetrius',
							differentiator: '1'
						}
					]
				});

			const expectedCharacterDemetrius2 = {
				model: 'character',
				name: 'Demetrius',
				underlyingName: '',
				differentiator: '1',
				qualifier: '',
				group: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.characters[0]).to.deep.equal(expectedCharacterDemetrius2);
			expect(await countNodesWithLabel('Character')).to.equal(2);

		});

		it('updates playtext and uses existing character that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${TITUS_ANDRONICUS_PLAYTEXT_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characters: [
						{
							name: 'Demetrius'
						}
					]
				});

			const expectedCharacterDemetrius1 = {
				model: 'character',
				name: 'Demetrius',
				underlyingName: '',
				differentiator: '',
				qualifier: '',
				group: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.characters[0]).to.deep.equal(expectedCharacterDemetrius1);
			expect(await countNodesWithLabel('Character')).to.equal(2);

		});

		it('updates playtext and uses existing character that has a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${TITUS_ANDRONICUS_PLAYTEXT_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characters: [
						{
							name: 'Demetrius',
							differentiator: '1'
						}
					]
				});

			const expectedCharacterDemetrius2 = {
				model: 'character',
				name: 'Demetrius',
				underlyingName: '',
				differentiator: '1',
				qualifier: '',
				group: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.characters[0]).to.deep.equal(expectedCharacterDemetrius2);
			expect(await countNodesWithLabel('Character')).to.equal(2);

		});

	});

});

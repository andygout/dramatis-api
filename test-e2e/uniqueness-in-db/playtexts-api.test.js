import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Uniqueness in database: Playtexts API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('Playtext uniqueness in database', () => {

		const PLAYTEXT_1_UUID = '2';
		const PLAYTEXT_2_UUID = '8';

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
				originalVersionPlaytext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
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
				originalVersionPlaytext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [],
				characterGroups: []
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
				originalVersionPlaytext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
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
				originalVersionPlaytext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [],
				characterGroups: []
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
				originalVersionPlaytext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
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
				originalVersionPlaytext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				writerGroups: [
					{
						model: 'writerGroup',
						name: '',
						isOriginalVersionWriter: null,
						errors: {},
						writers: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				characterGroups: [
					{
						model: 'characterGroup',
						name: '',
						errors: {},
						characters: [
							{
								model: 'character',
								name: '',
								underlyingName: '',
								differentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Playtext')).to.equal(2);

		});

	});

	describe('Playtext original version playtext uniqueness in database', () => {

		const THE_SEAGULL_SUBSEQUENT_VERSION_PLAYTEXT_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedOriginalVersionPlaytextTheSeagull1 = {
			model: 'playtext',
			name: 'The Seagull',
			differentiator: '',
			errors: {}
		};

		const expectedOriginalVersionPlaytextTheSeagull2 = {
			model: 'playtext',
			name: 'The Seagull',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Playtext',
				name: 'The Seagull',
				uuid: THE_SEAGULL_SUBSEQUENT_VERSION_PLAYTEXT_UUID
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates playtext and creates original version playtext that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.put(`/playtexts/${THE_SEAGULL_SUBSEQUENT_VERSION_PLAYTEXT_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionPlaytext: {
						name: 'The Seagull'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.originalVersionPlaytext).to.deep.equal(expectedOriginalVersionPlaytextTheSeagull1);
			expect(await countNodesWithLabel('Playtext')).to.equal(2);

		});

		it('updates playtext and creates original version playtext that has same name as existing original version playtext but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${THE_SEAGULL_SUBSEQUENT_VERSION_PLAYTEXT_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionPlaytext: {
						name: 'The Seagull',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.originalVersionPlaytext).to.deep.equal(expectedOriginalVersionPlaytextTheSeagull2);
			expect(await countNodesWithLabel('Playtext')).to.equal(3);

		});

		it('updates playtext and uses existing original version playtext that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(3);

			const response = await chai.request(app)
				.put(`/playtexts/${THE_SEAGULL_SUBSEQUENT_VERSION_PLAYTEXT_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionPlaytext: {
						name: 'The Seagull'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.originalVersionPlaytext).to.deep.equal(expectedOriginalVersionPlaytextTheSeagull1);
			expect(await countNodesWithLabel('Playtext')).to.equal(3);

		});

		it('updates playtext and uses existing original version playtext that has a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(3);

			const response = await chai.request(app)
				.put(`/playtexts/${THE_SEAGULL_SUBSEQUENT_VERSION_PLAYTEXT_UUID}`)
				.send({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionPlaytext: {
						name: 'The Seagull',
						differentiator: '1'
					}
				});

			expect(response).to.have.status(200);
			expect(response.body.originalVersionPlaytext).to.deep.equal(expectedOriginalVersionPlaytextTheSeagull2);
			expect(await countNodesWithLabel('Playtext')).to.equal(3);

		});

	});

	describe('Playtext writer (person) uniqueness in database', () => {

		const DOT_PLAYTEXT_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPersonKateRyan1 = {
			model: 'person',
			name: 'Kate Ryan',
			differentiator: '',
			errors: {}
		};

		const expectedPersonKateRyan2 = {
			model: 'person',
			name: 'Kate Ryan',
			differentiator: '1',
			errors: {}
		};

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

		it('updates playtext and creates writer (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/playtexts/${DOT_PLAYTEXT_UUID}`)
				.send({
					name: 'Dot',
					writerGroups: [
						{
							writers: [
								{
									name: 'Kate Ryan'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writerGroups[0].writers[0]).to.deep.equal(expectedPersonKateRyan1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates playtext and creates writer (person) that has same name as existing writer but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/playtexts/${DOT_PLAYTEXT_UUID}`)
				.send({
					name: 'Dot',
					writerGroups: [
						{
							writers: [
								{
									name: 'Kate Ryan',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writerGroups[0].writers[0]).to.deep.equal(expectedPersonKateRyan2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates playtext and uses existing writer (person) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${DOT_PLAYTEXT_UUID}`)
				.send({
					name: 'Dot',
					writerGroups: [
						{
							writers: [
								{
									name: 'Kate Ryan'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writerGroups[0].writers[0]).to.deep.equal(expectedPersonKateRyan1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates playtext and uses existing writer (person) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${DOT_PLAYTEXT_UUID}`)
				.send({
					name: 'Dot',
					writerGroups: [
						{
							writers: [
								{
									name: 'Kate Ryan',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writerGroups[0].writers[0]).to.deep.equal(expectedPersonKateRyan2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

	describe('Playtext writer (source material playtext) uniqueness in database', () => {

		const THE_INDIAN_BOY_PLAYTEXT_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedPlaytextAMidsummerNightsDream1 = {
			model: 'playtext',
			name: 'A Midsummer Night\'s Dream',
			differentiator: '',
			errors: {}
		};

		const expectedPlaytextAMidsummerNightsDream2 = {
			model: 'playtext',
			name: 'A Midsummer Night\'s Dream',
			differentiator: '1',
			errors: {}
		};

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Playtext',
				name: 'The Indian Boy',
				uuid: THE_INDIAN_BOY_PLAYTEXT_UUID
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates playtext and creates writer (source material playtext) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.put(`/playtexts/${THE_INDIAN_BOY_PLAYTEXT_UUID}`)
				.send({
					name: 'The Indian Boy',
					writerGroups: [
						{
							name: 'inspired by',
							writers: [
								{
									name: 'A Midsummer Night\'s Dream',
									model: 'playtext'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writerGroups[0].writers[0]).to.deep.equal(expectedPlaytextAMidsummerNightsDream1);
			expect(await countNodesWithLabel('Playtext')).to.equal(2);

		});

		it('updates playtext and creates writer (source material playtext) that has same name as existing writer (source material playtext) but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${THE_INDIAN_BOY_PLAYTEXT_UUID}`)
				.send({
					name: 'The Indian Boy',
					writerGroups: [
						{
							name: 'inspired by',
							writers: [
								{
									name: 'A Midsummer Night\'s Dream',
									differentiator: '1',
									model: 'playtext'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writerGroups[0].writers[0]).to.deep.equal(expectedPlaytextAMidsummerNightsDream2);
			expect(await countNodesWithLabel('Playtext')).to.equal(3);

		});

		it('updates playtext and uses existing writer (source material playtext) that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(3);

			const response = await chai.request(app)
				.put(`/playtexts/${THE_INDIAN_BOY_PLAYTEXT_UUID}`)
				.send({
					name: 'The Indian Boy',
					writerGroups: [
						{
							name: 'inspired by',
							writers: [
								{
									name: 'A Midsummer Night\'s Dream',
									model: 'playtext'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writerGroups[0].writers[0]).to.deep.equal(expectedPlaytextAMidsummerNightsDream1);
			expect(await countNodesWithLabel('Playtext')).to.equal(3);

		});

		it('updates playtext and uses existing writer (source material playtext) that has a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(3);

			const response = await chai.request(app)
				.put(`/playtexts/${THE_INDIAN_BOY_PLAYTEXT_UUID}`)
				.send({
					name: 'The Indian Boy',
					writerGroups: [
						{
							name: 'inspired by',
							writers: [
								{
									name: 'A Midsummer Night\'s Dream',
									differentiator: '1',
									model: 'playtext'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.writerGroups[0].writers[0]).to.deep.equal(expectedPlaytextAMidsummerNightsDream2);
			expect(await countNodesWithLabel('Playtext')).to.equal(3);

		});

	});

	describe('Playtext character uniqueness in database', () => {

		const TITUS_ANDRONICUS_PLAYTEXT_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const expectedCharacterDemetrius1 = {
			model: 'character',
			name: 'Demetrius',
			underlyingName: '',
			differentiator: '',
			qualifier: '',
			errors: {}
		};

		const expectedCharacterDemetrius2 = {
			model: 'character',
			name: 'Demetrius',
			underlyingName: '',
			differentiator: '1',
			qualifier: '',
			errors: {}
		};

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
					characterGroups: [
						{
							characters: [
								{
									name: 'Demetrius'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.characterGroups[0].characters[0]).to.deep.equal(expectedCharacterDemetrius1);
			expect(await countNodesWithLabel('Character')).to.equal(1);

		});

		it('updates playtext and creates character that has same name as existing character but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(1);

			const response = await chai.request(app)
				.put(`/playtexts/${TITUS_ANDRONICUS_PLAYTEXT_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characterGroups: [
						{
							characters: [
								{
									name: 'Demetrius',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.characterGroups[0].characters[0]).to.deep.equal(expectedCharacterDemetrius2);
			expect(await countNodesWithLabel('Character')).to.equal(2);

		});

		it('updates playtext and uses existing character that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${TITUS_ANDRONICUS_PLAYTEXT_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characterGroups: [
						{
							characters: [
								{
									name: 'Demetrius'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.characterGroups[0].characters[0]).to.deep.equal(expectedCharacterDemetrius1);
			expect(await countNodesWithLabel('Character')).to.equal(2);

		});

		it('updates playtext and uses existing character that has a differentiator', async () => {

			expect(await countNodesWithLabel('Character')).to.equal(2);

			const response = await chai.request(app)
				.put(`/playtexts/${TITUS_ANDRONICUS_PLAYTEXT_UUID}`)
				.send({
					name: 'Titus Andronicus',
					characterGroups: [
						{
							characters: [
								{
									name: 'Demetrius',
									differentiator: '1'
								}
							]
						}
					]
				});

			expect(response).to.have.status(200);
			expect(response.body.characterGroups[0].characters[0]).to.deep.equal(expectedCharacterDemetrius2);
			expect(await countNodesWithLabel('Character')).to.equal(2);

		});

	});

});

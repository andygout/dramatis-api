import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../server/app';
import countNodesWithLabel from './spec-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from './spec-helpers/neo4j/purge-database';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Productions API', () => {

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new production', async () => {

			const response = await chai.request(app)
				.get('/productions/new');

			const expectedResponseBody = {
				name: '',
				theatre: {
					name: '',
					productions: [],
					errors: {}
				},
				playtext: {
					name: '',
					characters: [],
					productions: [],
					errors: {}
				},
				cast: [],
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const PRODUCTION_UUID = '0';
		const THEATRE_UUID = '1';

		const sandbox = createSandbox();

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(0);

			const response = await chai.request(app)
				.post('/productions')
				.send({ name: 'As You Like It', theatre: { name: 'Novello Theatre' } });

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'As You Like It'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(1);

		});

		it('gets data required to edit specific production', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}/edit`);

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'As You Like It',
				theatre: {
					name: 'Novello Theatre'
				},
				playtext: {
					name: null
				},
				cast: [
					{
						name: '',
						roles: [
							{
								characterName: '',
								name: ''
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.post(`/productions/${PRODUCTION_UUID}`)
				.send({ name: 'The Tempest', theatre: { name: 'Novello Theatre' } });

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'The Tempest'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(1);

		});

		it('shows production', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'The Tempest',
				theatre: {
					model: 'theatre',
					uuid: THEATRE_UUID,
					name: 'Novello Theatre'
				},
				playtext: null,
				cast: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('lists all productions', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
				{
					model: 'production',
					uuid: PRODUCTION_UUID,
					name: 'The Tempest',
					theatre: {
						model: 'theatre',
						uuid: THEATRE_UUID,
						name: 'Novello Theatre'
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'production',
				name: 'The Tempest'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const PRODUCTION_UUID = '0';
		const NATIONAL_THEATRE_UUID = '1';
		const THE_TRAGEDY_OF_HAMLET_PRINCE_OF_DENMARK_UUID = '2';
		const RORY_KINNEAR_UUID = '3';
		const JAMES_LAURENSON_UUID = '4';
		const MICHAEL_SHELDON_UUID = '5';
		const LEO_STAAR_UUID = '6';
		const ALMEIDA_THEATRE_UUID = '7';
		const THE_TRAGEDY_OF_KING_RICHARD_III_UUID = '8';
		const RALPH_FIENNES_UUID = '9';
		const TOM_CANTON_UUID = '10';
		const MARK_HADFIELD_UUID = '11';
		const JOSH_COLLINS_UUID = '12';

		const sandbox = createSandbox();

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(0);

			const response = await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					theatre: {
						name: 'National Theatre'
					},
					playtext: {
						name: 'The Tragedy of Hamlet, Prince of Denmark'
					},
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: 'Hamlet',
									characterName: ''
								}
							]
						},
						{
							name: 'James Laurenson',
							roles: [
								{
									name: 'Ghost',
									characterName: 'Ghost of King Hamlet'
								},
								{
									name: 'Player King',
									characterName: 'First Player'
								}
							]
						},
						{
							name: 'Michael Sheldon',
							roles: [
								{
									name: 'Lucianus',
									characterName: ''
								},
								{
									name: 'English Ambassador',
									characterName: ''
								}
							]
						},
						{
							name: 'Leo Staar',
							roles: [
								{
									name: '',
									characterName: ''
								}
							]
						}
					]
				});

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(1);

		});

		it('shows production (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				playtext: {
					model: 'playtext',
					uuid: THE_TRAGEDY_OF_HAMLET_PRINCE_OF_DENMARK_UUID,
					name: 'The Tragedy of Hamlet, Prince of Denmark'
				},
				cast: [
					{
						model: 'person',
						uuid: RORY_KINNEAR_UUID,
						name: 'Rory Kinnear',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Hamlet'
							}
						]
					},
					{
						model: 'person',
						uuid: JAMES_LAURENSON_UUID,
						name: 'James Laurenson',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Ghost'
							},
							{
								model: 'character',
								uuid: null,
								name: 'Player King'
							}
						]
					},
					{
						model: 'person',
						uuid: MICHAEL_SHELDON_UUID,
						name: 'Michael Sheldon',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Lucianus'
							},
							{
								model: 'character',
								uuid: null,
								name: 'English Ambassador'
							}
						]
					},
					{
						model: 'person',
						uuid: LEO_STAAR_UUID,
						name: 'Leo Staar',
						roles: [
							{
								name: 'Performer'
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific production', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}/edit`);

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				theatre: {
					name: 'National Theatre'
				},
				playtext: {
					name: 'The Tragedy of Hamlet, Prince of Denmark'
				},
				cast: [
					{
						name: 'Rory Kinnear',
						roles: [
							{
								name: 'Hamlet',
								characterName: null
							},
							{
								characterName: '',
								name: ''
							}
						]
					},
					{
						name: 'James Laurenson',
						roles: [
							{
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet'
							},
							{
								name: 'Player King',
								characterName: 'First Player'
							},
							{
								characterName: '',
								name: ''
							}
						]
					},
					{
						name: 'Michael Sheldon',
						roles: [
							{
								name: 'Lucianus',
								characterName: null
							},
							{
								name: 'English Ambassador',
								characterName: null
							},
							{
								characterName: '',
								name: ''
							}
						]
					},
					{
						name: 'Leo Staar',
						roles: [
							{
								name: '',
								characterName: ''
							}
						]
					},
					{
						name: '',
						roles: [
							{
								name: '',
								characterName: ''
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.post(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'Richard III',
					theatre: {
						name: 'Almeida Theatre'
					},
					playtext: {
						name: 'The Tragedy of King Richard III'
					},
					cast: [
						{
							name: 'Ralph Fiennes',
							roles: [
								{
									name: 'Richard, Duke of Gloucester',
									characterName: ''
								}
							]
						},
						{
							name: 'Tom Canton',
							roles: [
								{
									name: 'Brakenbury',
									characterName: 'Sir Robert Brakenbury'
								},
								{
									name: 'Richmond',
									characterName: 'Henry, Earl of Richmond'
								}
							]
						},
						{
							name: 'Mark Hadfield',
							roles: [
								{
									name: 'Ratcliffe',
									characterName: ''
								},
								{
									name: 'Lord Mayor',
									characterName: ''
								}
							]
						},
						{
							name: 'Josh Collins',
							roles: [
								{
									name: '',
									characterName: ''
								}
							]
						}
					]
				});

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Richard III'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(1);

		});

		it('shows production (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				theatre: {
					model: 'theatre',
					uuid: ALMEIDA_THEATRE_UUID,
					name: 'Almeida Theatre'
				},
				playtext: {
					model: 'playtext',
					uuid: THE_TRAGEDY_OF_KING_RICHARD_III_UUID,
					name: 'The Tragedy of King Richard III'
				},
				cast: [
					{
						model: 'person',
						uuid: RALPH_FIENNES_UUID,
						name: 'Ralph Fiennes',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Richard, Duke of Gloucester'
							}
						]
					},
					{
						model: 'person',
						uuid: TOM_CANTON_UUID,
						name: 'Tom Canton',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Brakenbury'
							},
							{
								model: 'character',
								uuid: null,
								name: 'Richmond'
							}
						]
					},
					{
						model: 'person',
						uuid: MARK_HADFIELD_UUID,
						name: 'Mark Hadfield',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Ratcliffe'
							},
							{
								model: 'character',
								uuid: null,
								name: 'Lord Mayor'
							}
						]
					},
					{
						model: 'person',
						uuid: JOSH_COLLINS_UUID,
						name: 'Josh Collins',
						roles: [
							{
								name: 'Performer'
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('lists all productions', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
				{
					model: 'production',
					uuid: PRODUCTION_UUID,
					name: 'Richard III',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre'
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'production',
				name: 'Richard III'
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(0);

		});

	});

});

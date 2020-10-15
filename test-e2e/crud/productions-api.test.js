import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Productions API', () => {

	chai.use(chaiHttp);

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new production', async () => {

			const response = await chai.request(app)
				.get('/productions/new');

			const expectedResponseBody = {
				model: 'production',
				name: '',
				errors: {},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
				playtext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				cast: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const PRODUCTION_UUID = '0';

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
					name: 'As You Like It'
				});

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'As You Like It',
				errors: {},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
				playtext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				cast: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
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
				errors: {},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
				playtext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				cast: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
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
				.put(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'The Tempest'
				});

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'The Tempest',
				errors: {},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
				playtext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				cast: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
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
				theatre: null,
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
					theatre: null
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
				name: 'The Tempest',
				errors: {},
				theatre: {
					differentiator: '',
					errors: {},
					model: 'theatre',
					name: ''
				},
				playtext: {
					differentiator: '',
					errors: {},
					model: 'playtext',
					name: ''
				},
				cast: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const PRODUCTION_UUID = '0';
		const THE_TRAGEDY_OF_HAMLET_PRINCE_OF_DENMARK_UUID = '1';
		const NATIONAL_THEATRE_UUID = '2';
		const RORY_KINNEAR_UUID = '3';
		const JAMES_LAURENSON_UUID = '4';
		const MICHAEL_SHELDON_UUID = '5';
		const LEO_STAAR_UUID = '6';
		const THE_TRAGEDY_OF_KING_RICHARD_III_UUID = '7';
		const ALMEIDA_THEATRE_UUID = '8';
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
									name: 'Hamlet'
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
									name: 'Lucianus'
								},
								{
									name: 'English Ambassador'
								}
							]
						},
						{
							name: 'Leo Staar'
						}
					]
				});

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				errors: {},
				theatre: {
					model: 'theatre',
					name: 'National Theatre',
					differentiator: '',
					errors: {}
				},
				playtext: {
					model: 'playtext',
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					differentiator: '',
					errors: {}
				},
				cast: [
					{
						model: 'person',
						name: 'Rory Kinnear',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Hamlet',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'James Laurenson',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: 'Player King',
								characterName: 'First Player',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Michael Sheldon',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Lucianus',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: 'English Ambassador',
								qualifier: '',
								characterName: '',
								characterDifferentiator: '',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Leo Staar',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
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
					name: 'National Theatre',
					surTheatre: null
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
								name: 'Hamlet',
								qualifier: null
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
								name: 'Ghost',
								qualifier: null
							},
							{
								model: 'character',
								uuid: null,
								name: 'Player King',
								qualifier: null
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
								name: 'Lucianus',
								qualifier: null
							},
							{
								model: 'character',
								uuid: null,
								name: 'English Ambassador',
								qualifier: null
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
				errors: {},
				theatre: {
					model: 'theatre',
					name: 'National Theatre',
					differentiator: '',
					errors: {}
				},
				playtext: {
					model: 'playtext',
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					differentiator: '',
					errors: {}
				},
				cast: [
					{
						model: 'person',
						name: 'Rory Kinnear',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Hamlet',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'James Laurenson',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: 'Player King',
								characterName: 'First Player',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Michael Sheldon',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Lucianus',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: 'English Ambassador',
								qualifier: '',
								characterName: '',
								characterDifferentiator: '',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Leo Staar',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
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
				.put(`/productions/${PRODUCTION_UUID}`)
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
									name: 'Richard, Duke of Gloucester'
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
									name: 'Ratcliffe'
								},
								{
									name: 'Lord Mayor'
								}
							]
						},
						{
							name: 'Josh Collins'
						}
					]
				});

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				errors: {},
				theatre: {
					model: 'theatre',
					name: 'Almeida Theatre',
					differentiator: '',
					errors: {}
				},
				playtext: {
					model: 'playtext',
					name: 'The Tragedy of King Richard III',
					differentiator: '',
					errors: {}
				},
				cast: [
					{
						model: 'person',
						name: 'Ralph Fiennes',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Richard, Duke of Gloucester',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Tom Canton',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Brakenbury',
								characterName: 'Sir Robert Brakenbury',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: 'Richmond',
								characterName: 'Henry, Earl of Richmond',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Mark Hadfield',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Ratcliffe',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: 'Lord Mayor',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Josh Collins',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
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
					name: 'Almeida Theatre',
					surTheatre: null
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
								name: 'Richard, Duke of Gloucester',
								qualifier: null
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
								name: 'Brakenbury',
								qualifier: null
							},
							{
								model: 'character',
								uuid: null,
								name: 'Richmond',
								qualifier: null
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
								name: 'Ratcliffe',
								qualifier: null
							},
							{
								model: 'character',
								uuid: null,
								name: 'Lord Mayor',
								qualifier: null
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
						name: 'Almeida Theatre',
						surTheatre: null
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates production to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'Richard III'
				});

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				errors: {},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
				playtext: {
					model: 'playtext',
					name: '',
					differentiator: '',
					errors: {}
				},
				cast: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(1);

		});

		it('deletes production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'production',
				name: 'Richard III',
				errors: {},
				theatre: {
					differentiator: '',
					errors: {},
					model: 'theatre',
					name: ''
				},
				playtext: {
					differentiator: '',
					errors: {},
					model: 'playtext',
					name: ''
				},
				cast: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(0);

		});

	});

});

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Theatres API', () => {

	chai.use(chaiHttp);

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new theatre', async () => {

			const response = await chai.request(app)
				.get('/theatres/new');

			const expectedResponseBody = {
				model: 'theatre',
				name: '',
				differentiator: '',
				errors: {},
				subTheatres: [
					{
						model: 'theatre',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const THEATRE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const sandbox = createSandbox();

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(THEATRE_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates theatre', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(0);

			const response = await chai.request(app)
				.post('/theatres')
				.send({
					name: 'National Theatre'
				});

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'National Theatre',
				differentiator: '',
				errors: {},
				subTheatres: [
					{
						model: 'theatre',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(1);

		});

		it('gets data required to edit specific theatre', async () => {

			const response = await chai.request(app)
				.get(`/theatres/${THEATRE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'National Theatre',
				differentiator: '',
				errors: {},
				subTheatres: [
					{
						model: 'theatre',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates theatre', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(1);

			const response = await chai.request(app)
				.put(`/theatres/${THEATRE_UUID}`)
				.send({
					name: 'Almeida Theatre'
				});

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'Almeida Theatre',
				differentiator: '',
				errors: {},
				subTheatres: [
					{
						model: 'theatre',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(1);

		});

		it('shows theatre', async () => {

			const response = await chai.request(app)
				.get(`/theatres/${THEATRE_UUID}`);

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'Almeida Theatre',
				differentiator: null,
				surTheatre: null,
				subTheatres: [],
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('lists all theatres', async () => {

			const response = await chai.request(app)
				.get('/theatres');

			const expectedResponseBody = [
				{
					model: 'theatre',
					uuid: THEATRE_UUID,
					name: 'Almeida Theatre',
					subTheatres: []
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes theatre', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/theatres/${THEATRE_UUID}`);

			const expectedResponseBody = {
				model: 'theatre',
				name: 'Almeida Theatre',
				differentiator: '',
				errors: {},
				subTheatres: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const THEATRE_UUID = '4';
		const OLIVIER_THEATRE_UUID = '5';
		const LYTTELTON_THEATRE_UUID = '6';
		const DORFMAN_THEATRE_UUID = '7';
		const JERWOOD_THEATRE_DOWNSTAIRS_UUID = '10';
		const JERWOOD_THEATRE_UPSTAIRS_UUID = '11';

		const sandbox = createSandbox();

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates theatre', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(0);

			const response = await chai.request(app)
				.post('/theatres')
				.send({
					name: 'National Theatre',
					subTheatres: [
						{
							name: 'Olivier Theatre'
						},
						{
							name: 'Lyttelton Theatre'
						},
						{
							name: 'Dorfman Theatre'
						}
					]
				});

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'National Theatre',
				differentiator: '',
				errors: {},
				subTheatres: [
					{
						model: 'theatre',
						name: 'Olivier Theatre',
						differentiator: '',
						errors: {}
					},
					{
						model: 'theatre',
						name: 'Lyttelton Theatre',
						differentiator: '',
						errors: {}
					},
					{
						model: 'theatre',
						name: 'Dorfman Theatre',
						differentiator: '',
						errors: {}
					},
					{
						model: 'theatre',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(4);

		});

		it('shows theatre (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/theatres/${THEATRE_UUID}`);

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'National Theatre',
				differentiator: null,
				surTheatre: null,
				subTheatres: [
					{
						model: 'theatre',
						uuid: OLIVIER_THEATRE_UUID,
						name: 'Olivier Theatre'
					},
					{
						model: 'theatre',
						uuid: LYTTELTON_THEATRE_UUID,
						name: 'Lyttelton Theatre'
					},
					{
						model: 'theatre',
						uuid: DORFMAN_THEATRE_UUID,
						name: 'Dorfman Theatre'
					}
				],
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific theatre', async () => {

			const response = await chai.request(app)
				.get(`/theatres/${THEATRE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'National Theatre',
				differentiator: '',
				errors: {},
				subTheatres: [
					{
						model: 'theatre',
						name: 'Olivier Theatre',
						differentiator: '',
						errors: {}
					},
					{
						model: 'theatre',
						name: 'Lyttelton Theatre',
						differentiator: '',
						errors: {}
					},
					{
						model: 'theatre',
						name: 'Dorfman Theatre',
						differentiator: '',
						errors: {}
					},
					{
						model: 'theatre',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates theatre', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(4);

			const response = await chai.request(app)
				.put(`/theatres/${THEATRE_UUID}`)
				.send({
					name: 'Royal Court Theatre',
					subTheatres: [
						{
							name: 'Jerwood Theatre Downstairs'
						},
						{
							name: 'Jerwood Theatre Upstairs'
						}
					]
				});

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'Royal Court Theatre',
				differentiator: '',
				errors: {},
				subTheatres: [
					{
						model: 'theatre',
						name: 'Jerwood Theatre Downstairs',
						differentiator: '',
						errors: {}
					},
					{
						model: 'theatre',
						name: 'Jerwood Theatre Upstairs',
						differentiator: '',
						errors: {}
					},
					{
						model: 'theatre',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(6);

		});

		it('shows theatre (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/theatres/${THEATRE_UUID}`);

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'Royal Court Theatre',
				differentiator: null,
				surTheatre: null,
				subTheatres: [
					{
						model: 'theatre',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_UUID,
						name: 'Jerwood Theatre Downstairs'
					},
					{
						model: 'theatre',
						uuid: JERWOOD_THEATRE_UPSTAIRS_UUID,
						name: 'Jerwood Theatre Upstairs'
					}
				],
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('lists all theatres', async () => {

			const response = await chai.request(app)
				.get('/theatres');

			const expectedResponseBody = [
				{
					model: 'theatre',
					uuid: THEATRE_UUID,
					name: 'Royal Court Theatre',
					subTheatres: [
						{
							model: 'theatre',
							uuid: JERWOOD_THEATRE_DOWNSTAIRS_UUID,
							name: 'Jerwood Theatre Downstairs'
						},
						{
							model: 'theatre',
							uuid: JERWOOD_THEATRE_UPSTAIRS_UUID,
							name: 'Jerwood Theatre Upstairs'
						}
					]
				},
				{
					model: 'theatre',
					uuid: OLIVIER_THEATRE_UUID,
					name: 'Olivier Theatre',
					subTheatres: []
				},
				{
					model: 'theatre',
					uuid: LYTTELTON_THEATRE_UUID,
					name: 'Lyttelton Theatre',
					subTheatres: []
				},
				{
					model: 'theatre',
					uuid: DORFMAN_THEATRE_UUID,
					name: 'Dorfman Theatre',
					subTheatres: []
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates theatre to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(6);

			const response = await chai.request(app)
				.put(`/theatres/${THEATRE_UUID}`)
				.send({
					name: 'Royal Court Theatre'
				});

			const expectedResponseBody = {
				model: 'theatre',
				uuid: THEATRE_UUID,
				name: 'Royal Court Theatre',
				differentiator: '',
				errors: {},
				subTheatres: [
					{
						model: 'theatre',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(6);

		});

		it('deletes theatre', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(6);

			const response = await chai.request(app)
				.delete(`/theatres/${THEATRE_UUID}`);

			const expectedResponseBody = {
				model: 'theatre',
				name: 'Royal Court Theatre',
				differentiator: '',
				errors: {},
				subTheatres: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Theatre')).to.equal(5);

		});

	});

});

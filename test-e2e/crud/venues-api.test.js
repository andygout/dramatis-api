import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Venues API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new venue', async () => {

			const response = await chai.request(app)
				.get('/venues/new');

			const expectedResponseBody = {
				model: 'VENUE',
				name: '',
				differentiator: '',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
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

		const VENUE_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(uuid, 'v4').returns(VENUE_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates venue', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(0);

			const response = await chai.request(app)
				.post('/venues')
				.send({
					name: 'National Theatre'
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(1);

		});

		it('gets data required to edit specific venue', async () => {

			const response = await chai.request(app)
				.get(`/venues/${VENUE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates venue', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(1);

			const response = await chai.request(app)
				.put(`/venues/${VENUE_UUID}`)
				.send({
					name: 'Almeida Theatre'
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'Almeida Theatre',
				differentiator: '',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(1);

		});

		it('shows venue', async () => {

			const response = await chai.request(app)
				.get(`/venues/${VENUE_UUID}`);

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'Almeida Theatre',
				differentiator: null,
				surVenue: null,
				subVenues: [],
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes venue', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/venues/${VENUE_UUID}`);

			const expectedResponseBody = {
				model: 'VENUE',
				name: 'Almeida Theatre',
				differentiator: '',
				errors: {},
				subVenues: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const VENUE_UUID = '4';
		const OLIVIER_THEATRE_VENUE_UUID = '5';
		const LYTTELTON_THEATRE_VENUE_UUID = '6';
		const DORFMAN_THEATRE_VENUE_UUID = '7';
		const JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID = '10';
		const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = '11';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates venue', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(0);

			const response = await chai.request(app)
				.post('/venues')
				.send({
					name: 'National Theatre',
					differentiator: '1',
					subVenues: [
						{
							name: 'Olivier Theatre',
							differentiator: '1'
						},
						{
							name: 'Lyttelton Theatre',
							differentiator: '1'
						},
						{
							name: 'Dorfman Theatre',
							differentiator: '1'
						}
					]
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '1',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: 'Olivier Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Lyttelton Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Dorfman Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(4);

		});

		it('shows venue (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/venues/${VENUE_UUID}`);

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '1',
				surVenue: null,
				subVenues: [
					{
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre'
					},
					{
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre'
					},
					{
						model: 'VENUE',
						uuid: DORFMAN_THEATRE_VENUE_UUID,
						name: 'Dorfman Theatre'
					}
				],
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific venue', async () => {

			const response = await chai.request(app)
				.get(`/venues/${VENUE_UUID}/edit`);

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'National Theatre',
				differentiator: '1',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: 'Olivier Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Lyttelton Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Dorfman Theatre',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates venue', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(4);

			const response = await chai.request(app)
				.put(`/venues/${VENUE_UUID}`)
				.send({
					name: 'Royal Court Theatre',
					differentiator: '1',
					subVenues: [
						{
							name: 'Jerwood Theatre Downstairs',
							differentiator: '1'
						},
						{
							name: 'Jerwood Theatre Upstairs',
							differentiator: '1'
						}
					]
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'Royal Court Theatre',
				differentiator: '1',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: 'Jerwood Theatre Downstairs',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: 'Jerwood Theatre Upstairs',
						differentiator: '1',
						errors: {}
					},
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(6);

		});

		it('shows venue (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/venues/${VENUE_UUID}`);

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'Royal Court Theatre',
				differentiator: '1',
				surVenue: null,
				subVenues: [
					{
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Downstairs'
					},
					{
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs'
					}
				],
				productions: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates venue to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(6);

			const response = await chai.request(app)
				.put(`/venues/${VENUE_UUID}`)
				.send({
					name: 'Royal Court Theatre',
					differentiator: '1'
				});

			const expectedResponseBody = {
				model: 'VENUE',
				uuid: VENUE_UUID,
				name: 'Royal Court Theatre',
				differentiator: '1',
				errors: {},
				subVenues: [
					{
						model: 'VENUE',
						name: '',
						differentiator: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(6);

		});

		it('deletes venue', async () => {

			expect(await countNodesWithLabel('Venue')).to.equal(6);

			const response = await chai.request(app)
				.delete(`/venues/${VENUE_UUID}`);

			const expectedResponseBody = {
				model: 'VENUE',
				name: 'Royal Court Theatre',
				differentiator: '1',
				errors: {},
				subVenues: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Venue')).to.equal(5);

		});

	});

	describe('GET list endpoint', () => {

		const DONMAR_WAREHOUSE_VENUE_UUID = '1';
		const NATIONAL_THEATRE_VENUE_UUID = '3';
		const ALMEIDA_THEATRE_VENUE_UUID = '5';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/venues')
				.send({
					name: 'Donmar Warehouse'
				});

			await chai.request(app)
				.post('/venues')
				.send({
					name: 'National Theatre'
				});

			await chai.request(app)
				.post('/venues')
				.send({
					name: 'Almeida Theatre'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all venues ordered by name', async () => {

			const response = await chai.request(app)
				.get('/venues');

			const expectedResponseBody = [
				{
					model: 'VENUE',
					uuid: ALMEIDA_THEATRE_VENUE_UUID,
					name: 'Almeida Theatre',
					subVenues: []
				},
				{
					model: 'VENUE',
					uuid: DONMAR_WAREHOUSE_VENUE_UUID,
					name: 'Donmar Warehouse',
					subVenues: []
				},
				{
					model: 'VENUE',
					uuid: NATIONAL_THEATRE_VENUE_UUID,
					name: 'National Theatre',
					subVenues: []
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

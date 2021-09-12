import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Award ceremonies API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new award ceremony', async () => {

			const response = await chai.request(app)
				.get('/awards/ceremonies/new');

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				name: '',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(crypto, 'randomUUID').returns(AWARD_CEREMONY_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

			const response = await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2020'
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2020',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('gets data required to edit specific award ceremony', async () => {

			const response = await chai.request(app)
				.get(`/awards/ceremonies/${AWARD_CEREMONY_UUID}/edit`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2020',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.put(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`)
				.send({
					name: '2019'
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2019',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('shows award ceremony', async () => {

			const response = await chai.request(app)
				.get(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2019',
				award: null,
				categories: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				name: '2019',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const AWARD_CEREMONY_UUID = '2';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '3';
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '5';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

			const response = await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2020',
					award: {
						name: 'Laurence Olivier Awards',
						differentiator: '1'
					},
					categories: [
						{
							name: 'Best New Play'
						},
						{
							name: 'Best New Musical'
						},
						{
							name: 'Best Revival'
						}
					]
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2020',
				errors: {},
				award: {
					model: 'AWARD',
					name: 'Laurence Olivier Awards',
					differentiator: '1',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Play',
						errors: {}
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Musical',
						errors: {}
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Revival',
						errors: {}
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('shows award ceremony (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2020',
				award: {
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards'
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Play'
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Musical'
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Revival'
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific award ceremony', async () => {

			const response = await chai.request(app)
				.get(`/awards/ceremonies/${AWARD_CEREMONY_UUID}/edit`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2020',
				errors: {},
				award: {
					model: 'AWARD',
					name: 'Laurence Olivier Awards',
					differentiator: '1',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Play',
						errors: {}
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Musical',
						errors: {}
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Revival',
						errors: {}
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.put(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`)
				.send({
					name: '2019',
					award: {
						name: 'Evening Standard Theatre Awards',
						differentiator: '2'
					},
					categories: [
						{
							name: 'Best Director'
						},
						{
							name: 'Best Actor'
						},
						{
							name: 'Best Actress'
						}
					]
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2019',
				errors: {},
				award: {
					model: 'AWARD',
					name: 'Evening Standard Theatre Awards',
					differentiator: '2',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Director',
						errors: {}
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Actor',
						errors: {}
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Actress',
						errors: {}
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('shows award ceremony (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2019',
				award: {
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards'
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Director'
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Actor'
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Actress'
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates award ceremony to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.put(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`)
				.send({
					name: '2019'
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2019',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('deletes awards ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				name: '2019',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '2';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '3';
		const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = '6';
		const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '10';
		const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '14';
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '15';
		const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = '18';
		const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '22';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2019',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2020',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2018',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2019',
					award: {
						name: 'Evening Standard Theatre Awards'
					}
				});

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2020',
					award: {
						name: 'Evening Standard Theatre Awards'
					}
				});

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2018',
					award: {
						name: 'Evening Standard Theatre Awards'
					}
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all award ceremonies ordered by name then award name', async () => {

			const response = await chai.request(app)
				.get('/awards/ceremonies');

			const expectedResponseBody = [
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
					name: '2020',
					award: {
						model: 'AWARD',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
						name: 'Evening Standard Theatre Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
					name: '2020',
					award: {
						model: 'AWARD',
						uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
						name: 'Laurence Olivier Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '2019',
					award: {
						model: 'AWARD',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
						name: 'Evening Standard Theatre Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '2019',
					award: {
						model: 'AWARD',
						uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
						name: 'Laurence Olivier Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
					name: '2018',
					award: {
						model: 'AWARD',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
						name: 'Evening Standard Theatre Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
					name: '2018',
					award: {
						model: 'AWARD',
						uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
						name: 'Laurence Olivier Awards'
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import createNode from '../test-helpers/neo4j/create-node';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Uniqueness in database: Productions API', () => {

	describe('Production theatre uniqueness in database', () => {

		chai.use(chaiHttp);

		const DIAL_M_FOR_MURDER_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const sandbox = createSandbox();

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				name: 'Dial M for Murder',
				uuid: DIAL_M_FOR_MURDER_PRODUCTION_UUID
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates theatre that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					theatre: {
						name: 'New Theatre'
					}
				});

			const expectedTheatreNewTheatre1 = {
				model: 'theatre',
				name: 'New Theatre',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.theatre).to.deep.equal(expectedTheatreNewTheatre1);
			expect(await countNodesWithLabel('Theatre')).to.equal(1);

		});

		it('updates production and creates theatre that has same name as existing theatre but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					theatre: {
						name: 'New Theatre',
						differentiator: '1'
					}
				});

			const expectedTheatreNewTheatre2 = {
				model: 'theatre',
				name: 'New Theatre',
				differentiator: '1',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.theatre).to.deep.equal(expectedTheatreNewTheatre2);
			expect(await countNodesWithLabel('Theatre')).to.equal(2);

		});

		it('updates production and uses existing theatre that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					theatre: {
						name: 'New Theatre'
					}
				});

			const expectedTheatreNewTheatre1 = {
				model: 'theatre',
				name: 'New Theatre',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.theatre).to.deep.equal(expectedTheatreNewTheatre1);
			expect(await countNodesWithLabel('Theatre')).to.equal(2);

		});

		it('updates production and uses existing theatre that has a differentiator', async () => {

			expect(await countNodesWithLabel('Theatre')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${DIAL_M_FOR_MURDER_PRODUCTION_UUID}`)
				.send({
					name: 'Dial M for Murder',
					theatre: {
						name: 'New Theatre',
						differentiator: '1'
					}
				});

			const expectedTheatreNewTheatre2 = {
				model: 'theatre',
				name: 'New Theatre',
				differentiator: '1',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.theatre).to.deep.equal(expectedTheatreNewTheatre2);
			expect(await countNodesWithLabel('Theatre')).to.equal(2);

		});

	});

	describe('Production playtext uniqueness in database', () => {

		chai.use(chaiHttp);

		const HOME_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const sandbox = createSandbox();

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				name: 'Home',
				uuid: HOME_PRODUCTION_UUID
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates playtext that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					playtext: {
						name: 'Home'
					}
				});

			const expectedPlaytextHome1 = {
				model: 'playtext',
				name: 'Home',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.playtext).to.deep.equal(expectedPlaytextHome1);
			expect(await countNodesWithLabel('Playtext')).to.equal(1);

		});

		it('updates production and creates playtext that has same name as existing playtext but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					playtext: {
						name: 'Home',
						differentiator: '1'
					}
				});

			const expectedPlaytextHome2 = {
				model: 'playtext',
				name: 'Home',
				differentiator: '1',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.playtext).to.deep.equal(expectedPlaytextHome2);
			expect(await countNodesWithLabel('Playtext')).to.equal(2);

		});

		it('updates production and uses existing playtext that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					playtext: {
						name: 'Home'
					}
				});

			const expectedPlaytextHome1 = {
				model: 'playtext',
				name: 'Home',
				differentiator: '',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.playtext).to.deep.equal(expectedPlaytextHome1);
			expect(await countNodesWithLabel('Playtext')).to.equal(2);

		});

		it('updates production and uses existing playtext that has a differentiator', async () => {

			expect(await countNodesWithLabel('Playtext')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${HOME_PRODUCTION_UUID}`)
				.send({
					name: 'Home',
					playtext: {
						name: 'Home',
						differentiator: '1'
					}
				});

			const expectedPlaytextHome2 = {
				model: 'playtext',
				name: 'Home',
				differentiator: '1',
				errors: {}
			};

			expect(response).to.have.status(200);
			expect(response.body.playtext).to.deep.equal(expectedPlaytextHome2);
			expect(await countNodesWithLabel('Playtext')).to.equal(2);

		});

	});

	describe('Production cast member uniqueness in database', () => {

		chai.use(chaiHttp);

		const ARISTOCRATS_PRODUCTION_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		const sandbox = createSandbox();

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await createNode({
				label: 'Production',
				name: 'Aristocrats',
				uuid: ARISTOCRATS_PRODUCTION_UUID
			});

		});

		after(() => {

			sandbox.restore();

		});

		it('updates production and creates cast member that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(0);

			const response = await chai.request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins'
						}
					]
				});

			const expectedCastMemberPaulHiggins1 = {
				model: 'person',
				name: 'Paul Higgins',
				differentiator: '',
				errors: {},
				roles: [
					{
						model: 'role',
						name: '',
						characterName: '',
						qualifier: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body.cast[0]).to.deep.equal(expectedCastMemberPaulHiggins1);
			expect(await countNodesWithLabel('Person')).to.equal(1);

		});

		it('updates production and creates cast member that has same name as existing cast member but uses a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins',
							differentiator: '1'
						}
					]
				});

			const expectedCastMemberPaulHiggins2 = {
				model: 'person',
				name: 'Paul Higgins',
				differentiator: '1',
				errors: {},
				roles: [
					{
						model: 'role',
						name: '',
						characterName: '',
						qualifier: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body.cast[0]).to.deep.equal(expectedCastMemberPaulHiggins2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing cast member that does not have a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins'
						}
					]
				});

			const expectedCastMemberPaulHiggins1 = {
				model: 'person',
				name: 'Paul Higgins',
				differentiator: '',
				errors: {},
				roles: [
					{
						model: 'role',
						name: '',
						characterName: '',
						qualifier: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body.cast[0]).to.deep.equal(expectedCastMemberPaulHiggins1);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

		it('updates production and uses existing cast member that has a differentiator', async () => {

			expect(await countNodesWithLabel('Person')).to.equal(2);

			const response = await chai.request(app)
				.put(`/productions/${ARISTOCRATS_PRODUCTION_UUID}`)
				.send({
					name: 'Aristocrats',
					cast: [
						{
							name: 'Paul Higgins',
							differentiator: '1'
						}
					]
				});

			const expectedCastMemberPaulHiggins2 = {
				model: 'person',
				name: 'Paul Higgins',
				differentiator: '1',
				errors: {},
				roles: [
					{
						model: 'role',
						name: '',
						characterName: '',
						qualifier: '',
						errors: {}
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body.cast[0]).to.deep.equal(expectedCastMemberPaulHiggins2);
			expect(await countNodesWithLabel('Person')).to.equal(2);

		});

	});

});

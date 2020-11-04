import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Writer of multiple playtexts', () => {

	chai.use(chaiHttp);

	const DINNER_PLAYTEXT_UUID = '3';
	const MOIRA_BUFFINI_PERSON_UUID = '4';
	const PAIGE_CHARACTER_UUID = '5';
	const GREENLAND_PLAYTEXT_UUID = '12';
	const MATT_CHARMAN_PERSON_UUID = '14';
	const PENELOPE_SKINNER_PERSON_UUID = '15';
	const JACK_THORNE_PERSON_UUID = '16';
	const ADEEL_CHARACTER_UUID = '17';
	const DINNER_WYNDHAMS_PRODUCTION_UUID = '18';
	const GREENLAND_LYTTELTON_PRODUCTION_UUID = '21';

	let moiraBuffiniPerson;
	let dinnerPlaytext;
	let greenlandPlaytext;
	let dinnerWyndhamsProduction;
	let greenlandLytteltonProduction;
	let paigeCharacter;
	let adeelCharacter;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Dinner',
				writers: [
					{
						name: 'Moira Buffini'
					}
				],
				characters: [
					{
						name: 'Paige'
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Greenland',
				writers: [
					{
						name: 'Moira Buffini'
					},
					{
						name: 'Matt Charman'
					},
					{
						name: 'Penelope Skinner'
					},
					{
						name: 'Jack Thorne'
					}
				],
				characters: [
					{
						name: 'Adeel'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Dinner',
				playtext: {
					name: 'Dinner'
				},
				theatre: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Greenland',
				playtext: {
					name: 'Greenland'
				},
				theatre: {
					name: 'Lyttelton Theatre'
				}
			});

		moiraBuffiniPerson = await chai.request(app)
			.get(`/people/${MOIRA_BUFFINI_PERSON_UUID}`);

		dinnerPlaytext = await chai.request(app)
			.get(`/playtexts/${DINNER_PLAYTEXT_UUID}`);

		greenlandPlaytext = await chai.request(app)
			.get(`/playtexts/${GREENLAND_PLAYTEXT_UUID}`);

		dinnerWyndhamsProduction = await chai.request(app)
			.get(`/productions/${DINNER_WYNDHAMS_PRODUCTION_UUID}`);

		greenlandLytteltonProduction = await chai.request(app)
			.get(`/productions/${GREENLAND_LYTTELTON_PRODUCTION_UUID}`);

		paigeCharacter = await chai.request(app)
			.get(`/characters/${PAIGE_CHARACTER_UUID}`);

		adeelCharacter = await chai.request(app)
			.get(`/characters/${ADEEL_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Moira Buffini (person)', () => {

		it('includes playtexts they have written, including co-writers where applicable', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: DINNER_PLAYTEXT_UUID,
					name: 'Dinner',
					coWriters: []
				},
				{
					model: 'playtext',
					uuid: GREENLAND_PLAYTEXT_UUID,
					name: 'Greenland',
					coWriters: [
						{
							model: 'person',
							uuid: MATT_CHARMAN_PERSON_UUID,
							name: 'Matt Charman'
						},
						{
							model: 'person',
							uuid: PENELOPE_SKINNER_PERSON_UUID,
							name: 'Penelope Skinner'
						},
						{
							model: 'person',
							uuid: JACK_THORNE_PERSON_UUID,
							name: 'Jack Thorne'
						}
					]
				}
			];

			const { playtexts } = moiraBuffiniPerson.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

	});

	describe('Dinner (playtext)', () => {

		it('includes writers of this playtext', () => {

			const expectedWriters = [
				{
					model: 'person',
					uuid: MOIRA_BUFFINI_PERSON_UUID,
					name: 'Moira Buffini'
				}
			];

			const { writers } = dinnerPlaytext.body;

			expect(writers).to.deep.equal(expectedWriters);

		});

	});

	describe('Greenland (playtext)', () => {

		it('includes writers of this playtext', () => {

			const expectedWriters = [
				{
					model: 'person',
					uuid: MOIRA_BUFFINI_PERSON_UUID,
					name: 'Moira Buffini'
				},
				{
					model: 'person',
					uuid: MATT_CHARMAN_PERSON_UUID,
					name: 'Matt Charman'
				},
				{
					model: 'person',
					uuid: PENELOPE_SKINNER_PERSON_UUID,
					name: 'Penelope Skinner'
				},
				{
					model: 'person',
					uuid: JACK_THORNE_PERSON_UUID,
					name: 'Jack Thorne'
				}
			];

			const { writers } = greenlandPlaytext.body;

			expect(writers).to.deep.equal(expectedWriters);

		});

	});

	describe('Dinner at Wyndham\'s Theatre (production)', () => {

		it('includes in its playtext data the writers of the playtext', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: DINNER_PLAYTEXT_UUID,
				name: 'Dinner',
				writers: [
					{
						model: 'person',
						uuid: MOIRA_BUFFINI_PERSON_UUID,
						name: 'Moira Buffini'
					}
				]
			};

			const { playtext } = dinnerWyndhamsProduction.body;

			expect(playtext).to.deep.equal(expectedPlaytext);

		});

	});

	describe('Greenland at Lyttelton Theatre (production)', () => {

		it('includes in its playtext data the writers of the playtext', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: GREENLAND_PLAYTEXT_UUID,
				name: 'Greenland',
				writers: [
					{
						model: 'person',
						uuid: MOIRA_BUFFINI_PERSON_UUID,
						name: 'Moira Buffini'
					},
					{
						model: 'person',
						uuid: MATT_CHARMAN_PERSON_UUID,
						name: 'Matt Charman'
					},
					{
						model: 'person',
						uuid: PENELOPE_SKINNER_PERSON_UUID,
						name: 'Penelope Skinner'
					},
					{
						model: 'person',
						uuid: JACK_THORNE_PERSON_UUID,
						name: 'Jack Thorne'
					}
				]
			};

			const { playtext } = greenlandLytteltonProduction.body;

			expect(playtext).to.deep.equal(expectedPlaytext);

		});

	});

	describe('Paige (character)', () => {

		it('includes in its playtext data the writers of the playtext', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: DINNER_PLAYTEXT_UUID,
					name: 'Dinner',
					writers: [
						{
							model: 'person',
							uuid: MOIRA_BUFFINI_PERSON_UUID,
							name: 'Moira Buffini'
						}
					],
					depictions: []
				}
			];

			const { playtexts } = paigeCharacter.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

	});

	describe('Adeel (character)', () => {

		it('includes in its playtext data the writers of the playtext', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: GREENLAND_PLAYTEXT_UUID,
					name: 'Greenland',
					writers: [
						{
							model: 'person',
							uuid: MOIRA_BUFFINI_PERSON_UUID,
							name: 'Moira Buffini'
						},
						{
							model: 'person',
							uuid: MATT_CHARMAN_PERSON_UUID,
							name: 'Matt Charman'
						},
						{
							model: 'person',
							uuid: PENELOPE_SKINNER_PERSON_UUID,
							name: 'Penelope Skinner'
						},
						{
							model: 'person',
							uuid: JACK_THORNE_PERSON_UUID,
							name: 'Jack Thorne'
						}
					],
					depictions: []
				}
			];

			const { playtexts } = adeelCharacter.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

	});

	describe('playtexts list', () => {

		it('displays writers', async () => {

			const response = await chai.request(app)
				.get('/playtexts');

			const expectedResponseBody = [
				{
					model: 'playtext',
					uuid: DINNER_PLAYTEXT_UUID,
					name: 'Dinner',
					writers: [
						{
							model: 'person',
							uuid: MOIRA_BUFFINI_PERSON_UUID,
							name: 'Moira Buffini'
						}
					]
				},
				{
					model: 'playtext',
					uuid: GREENLAND_PLAYTEXT_UUID,
					name: 'Greenland',
					writers: [
						{
							model: 'person',
							uuid: MOIRA_BUFFINI_PERSON_UUID,
							name: 'Moira Buffini'
						},
						{
							model: 'person',
							uuid: MATT_CHARMAN_PERSON_UUID,
							name: 'Matt Charman'
						},
						{
							model: 'person',
							uuid: PENELOPE_SKINNER_PERSON_UUID,
							name: 'Penelope Skinner'
						},
						{
							model: 'person',
							uuid: JACK_THORNE_PERSON_UUID,
							name: 'Jack Thorne'
						}
					]
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

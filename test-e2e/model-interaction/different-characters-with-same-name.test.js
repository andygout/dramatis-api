import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Different characters with the same name', () => {

	chai.use(chaiHttp);

	const A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID = '3';
	const LYSANDER_CHARACTER_UUID = '4';
	const DEMETRIUS_CHARACTER_1_UUID = '5';
	const TITUS_ANDRONICUS_PLAYTEXT_UUID = '9';
	const DEMETRIUS_CHARACTER_2_UUID = '10';
	const CHIRON_CHARACTER_UUID = '11';
	const A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID = '12';
	const NOVELLO_THEATRE_UUID = '13';
	const OSCAR_PEARCE_PERSON_UUID = '15';
	const TRYSTAN_GRAVELLE_PERSON_UUID = '16';
	const TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID = '17';
	const SHAKESPEARES_GLOBE_THEATRE_UUID = '18';
	const RICHARD_RIDDELL_PERSON_UUID = '20';
	const SAM_ALEXANDER_PERSON_UUID = '21';

	let demetriusCharacter1;
	let demetriusCharacter2;
	let aMidsummerNightsDreamPlaytext;
	let titusAndronicusPlaytext;
	let aMidsummerNightsDreamNovelloProduction;
	let titusAndronicusGlobeProduction;
	let oscarPearcePerson;
	let samAlexanderPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'A Midsummer Night\'s Dream',
				characters: [
					{
						name: 'Lysander'
					},
					{
						name: 'Demetrius',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Titus Andronicus',
				characters: [
					{
						name: 'Demetrius',
						differentiator: '2'
					},
					{
						name: 'Chiron'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Midsummer Night\'s Dream',
				theatre: {
					name: 'Novello Theatre'
				},
				playtext: {
					name: 'A Midsummer Night\'s Dream'
				},
				cast: [
					{
						name: 'Oscar Pearce',
						roles: [
							{
								name: 'Demetrius'
							}
						]
					},
					{
						name: 'Trystan Gravelle',
						roles: [
							{
								name: 'Lysander'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Titus Andronicus',
				theatre: {
					name: 'Shakespeare\'s Globe'
				},
				playtext: {
					name: 'Titus Andronicus'
				},
				cast: [
					{
						name: 'Richard Riddell',
						roles: [
							{
								name: 'Chiron'
							}
						]
					},
					{
						name: 'Sam Alexander',
						roles: [
							{
								name: 'Demetrius'
							}
						]
					}
				]
			});

		demetriusCharacter1 = await chai.request(app)
			.get(`/characters/${DEMETRIUS_CHARACTER_1_UUID}`);

		demetriusCharacter2 = await chai.request(app)
			.get(`/characters/${DEMETRIUS_CHARACTER_2_UUID}`);

		aMidsummerNightsDreamPlaytext = await chai.request(app)
			.get(`/playtexts/${A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID}`);

		titusAndronicusPlaytext = await chai.request(app)
			.get(`/playtexts/${TITUS_ANDRONICUS_PLAYTEXT_UUID}`);

		aMidsummerNightsDreamNovelloProduction = await chai.request(app)
			.get(`/productions/${A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID}`);

		titusAndronicusGlobeProduction = await chai.request(app)
			.get(`/productions/${TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID}`);

		oscarPearcePerson = await chai.request(app)
			.get(`/people/${OSCAR_PEARCE_PERSON_UUID}`);

		samAlexanderPerson = await chai.request(app)
			.get(`/people/${SAM_ALEXANDER_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Demetrius (character) (#1)', () => {

		it('includes productions in which character was portrayed (i.e. excludes productions of different character with same name)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					theatre: {
						model: 'theatre',
						uuid: NOVELLO_THEATRE_UUID,
						name: 'Novello Theatre'
					},
					performers: [
						{
							model: 'person',
							uuid: OSCAR_PEARCE_PERSON_UUID,
							name: 'Oscar Pearce',
							roleName: 'Demetrius',
							qualifier: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = demetriusCharacter1.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Demetrius (character) (#2)', () => {

		it('includes productions in which character was portrayed (i.e. excludes productions of different character with same name)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID,
					name: 'Titus Andronicus',
					theatre: {
						model: 'theatre',
						uuid: SHAKESPEARES_GLOBE_THEATRE_UUID,
						name: 'Shakespeare\'s Globe'
					},
					performers: [
						{
							model: 'person',
							uuid: SAM_ALEXANDER_PERSON_UUID,
							name: 'Sam Alexander',
							roleName: 'Demetrius',
							qualifier: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = demetriusCharacter2.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('A Midsummer Night\'s Dream (playtext)', () => {

		it('includes Demetrius (#1) in its characters (i.e. and not Demetrius (#2))', () => {

			const expectedCharacters = [
				{
					model: 'character',
					uuid: LYSANDER_CHARACTER_UUID,
					name: 'Lysander',
					qualifier: null
				},
				{
					model: 'character',
					uuid: DEMETRIUS_CHARACTER_1_UUID,
					name: 'Demetrius',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = aMidsummerNightsDreamPlaytext.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Titus Andronicus (playtext)', () => {

		it('includes Demetrius (#2) in its characters (i.e. and not Demetrius (#1))', () => {

			const expectedCharacters = [
				{
					model: 'character',
					uuid: DEMETRIUS_CHARACTER_2_UUID,
					name: 'Demetrius',
					qualifier: null
				},
				{
					model: 'character',
					uuid: CHIRON_CHARACTER_UUID,
					name: 'Chiron',
					qualifier: null
				},

			];

			const { characterGroups: [{ characters }] } = titusAndronicusPlaytext.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('A Midsummer Night\'s Dream at Novello Theatre (production)', () => {

		it('includes cast with Oscar Pearce as Demetrius (#1)', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: OSCAR_PEARCE_PERSON_UUID,
					name: 'Oscar Pearce',
					roles: [
						{
							model: 'character',
							uuid: DEMETRIUS_CHARACTER_1_UUID,
							name: 'Demetrius',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: TRYSTAN_GRAVELLE_PERSON_UUID,
					name: 'Trystan Gravelle',
					roles: [
						{
							model: 'character',
							uuid: LYSANDER_CHARACTER_UUID,
							name: 'Lysander',
							qualifier: null
						}
					]
				}
			];

			const { cast } = aMidsummerNightsDreamNovelloProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Titus Andronicus at Shakespeare\'s Globe (production)', () => {

		it('includes cast with Sam Alexander as Demetrius (#2)', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: RICHARD_RIDDELL_PERSON_UUID,
					name: 'Richard Riddell',
					roles: [
						{
							model: 'character',
							uuid: CHIRON_CHARACTER_UUID,
							name: 'Chiron',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: SAM_ALEXANDER_PERSON_UUID,
					name: 'Sam Alexander',
					roles: [
						{
							model: 'character',
							uuid: DEMETRIUS_CHARACTER_2_UUID,
							name: 'Demetrius',
							qualifier: null
						}
					]
				}
			];

			const { cast } = titusAndronicusGlobeProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Oscar Pearce (person)', () => {

		it('includes in their production credits their portrayal of Demetrius (#1) (i.e. and not Demetrius (#2))', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					theatre: {
						model: 'theatre',
						uuid: NOVELLO_THEATRE_UUID,
						name: 'Novello Theatre'
					},
					roles: [
						{
							model: 'character',
							uuid: DEMETRIUS_CHARACTER_1_UUID,
							name: 'Demetrius',
							qualifier: null
						}
					]
				}
			];

			const { productions } = oscarPearcePerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Sam Alexander (person)', () => {

		it('includes in their production credits their portrayal of Demetrius (#2) (i.e. and not Demetrius (#1))', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID,
					name: 'Titus Andronicus',
					theatre: {
						model: 'theatre',
						uuid: SHAKESPEARES_GLOBE_THEATRE_UUID,
						name: 'Shakespeare\'s Globe'
					},
					roles: [
						{
							model: 'character',
							uuid: DEMETRIUS_CHARACTER_2_UUID,
							name: 'Demetrius',
							qualifier: null
						}
					]
				}
			];

			const { productions } = samAlexanderPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

});

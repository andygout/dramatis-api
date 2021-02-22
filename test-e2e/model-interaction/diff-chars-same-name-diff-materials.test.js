import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Different characters with the same name from different materials', () => {

	chai.use(chaiHttp);

	const A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID = '4';
	const LYSANDER_CHARACTER_UUID = '6';
	const DEMETRIUS_CHARACTER_1_UUID = '7';
	const TITUS_ANDRONICUS_MATERIAL_UUID = '12';
	const DEMETRIUS_CHARACTER_2_UUID = '14';
	const CHIRON_CHARACTER_UUID = '15';
	const A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID = '16';
	const NOVELLO_THEATRE_UUID = '18';
	const OSCAR_PEARCE_PERSON_UUID = '19';
	const TRYSTAN_GRAVELLE_PERSON_UUID = '20';
	const TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID = '21';
	const SHAKESPEARES_GLOBE_THEATRE_UUID = '23';
	const RICHARD_RIDDELL_PERSON_UUID = '24';
	const SAM_ALEXANDER_PERSON_UUID = '25';

	let demetriusCharacter1;
	let demetriusCharacter2;
	let aMidsummerNightsDreamMaterial;
	let titusAndronicusMaterial;
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
			.post('/materials')
			.send({
				name: 'A Midsummer Night\'s Dream',
				characterGroups: [
					{
						characters: [
							{
								name: 'Lysander'
							},
							{
								name: 'Demetrius',
								differentiator: '1'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Titus Andronicus',
				characterGroups: [
					{
						characters: [
							{
								name: 'Demetrius',
								differentiator: '2'
							},
							{
								name: 'Chiron'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Midsummer Night\'s Dream',
				material: {
					name: 'A Midsummer Night\'s Dream'
				},
				theatre: {
					name: 'Novello Theatre'
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
				material: {
					name: 'Titus Andronicus'
				},
				theatre: {
					name: 'Shakespeare\'s Globe'
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

		aMidsummerNightsDreamMaterial = await chai.request(app)
			.get(`/materials/${A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID}`);

		titusAndronicusMaterial = await chai.request(app)
			.get(`/materials/${TITUS_ANDRONICUS_MATERIAL_UUID}`);

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
						name: 'Novello Theatre',
						surTheatre: null
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
						name: 'Shakespeare\'s Globe',
						surTheatre: null
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

	describe('A Midsummer Night\'s Dream (material)', () => {

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

			const { characterGroups: [{ characters }] } = aMidsummerNightsDreamMaterial.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Titus Andronicus (material)', () => {

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
				}

			];

			const { characterGroups: [{ characters }] } = titusAndronicusMaterial.body;

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

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					theatre: {
						model: 'theatre',
						uuid: NOVELLO_THEATRE_UUID,
						name: 'Novello Theatre',
						surTheatre: null
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

			const { castMemberProductions } = oscarPearcePerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Sam Alexander (person)', () => {

		it('includes in their production credits their portrayal of Demetrius (#2) (i.e. and not Demetrius (#1))', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID,
					name: 'Titus Andronicus',
					theatre: {
						model: 'theatre',
						uuid: SHAKESPEARES_GLOBE_THEATRE_UUID,
						name: 'Shakespeare\'s Globe',
						surTheatre: null
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

			const { castMemberProductions } = samAlexanderPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});

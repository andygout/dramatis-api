import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character with multiple appearances in the same playtext in different groups', () => {

	chai.use(chaiHttp);

	const THREE_WINTERS_PLAYTEXT_UUID = '8';
	const ALISA_KOS_CHARACTER_UUID = '9';
	const MAŠA_KOS_CHARACTER_UUID = '10';
	const ALEKSANDER_KING_CHARACTER_UUID = '12';
	const ROSE_KING_CHARACTER_UUID = '14';
	const THREE_WINTERS_NATIONAL_PRODUCTION_UUID = '16';
	const NATIONAL_THEATRE_UUID = '17';
	const SIOBHAN_FINNERAN_PERSON_UUID = '19';
	const JO_HERBERT_PERSON_UUID = '20';
	const JAMES_LAURENSON_PERSON_UUID = '21';
	const JODIE_MCNEE_PERSON_UUID = '22';
	const ALEX_PRICE_PERSON_UUID = '23';
	const BEBE_SANDERS_PERSON_UUID = '24';

	let alisaKosCharacter;
	let mašaKosCharacter;
	let aleksanderKingCharacter;
	let roseKingCharacter;
	let threeWintersPlaytext;
	let threeWintersNationalProduction;
	let siobhanFinneranPerson;
	let joHerbertPerson;
	let jamesLaurensonPerson;
	let jodieMcNeePerson;
	let alexPricePerson;
	let bebeSandersPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: '3 Winters',
				characters: [
					{
						name: 'Alisa Kos',
						group: '2011'
					},
					{
						name: 'Maša Kos',
						group: '2011'
					},
					{
						name: 'Maša Kos',
						group: '1990'
					},
					{
						name: 'Aleksander King',
						group: '1990'
					},
					{
						name: 'Alisa Kos',
						group: '1990'
					},
					{
						name: 'Rose King',
						group: '1945'
					},
					{
						name: 'Aleksander King',
						group: '1945'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: '3 Winters',
				theatre: {
					name: 'National Theatre'
				},
				playtext: {
					name: '3 Winters'
				},
				cast: [
					{
						name: 'Siobhan Finneran',
						roles: [
							{
								name: 'Maša Kos'
							}
						]
					},
					{
						name: 'Jo Herbert',
						roles: [
							{
								name: 'Rose King'
							}
						]
					},
					{
						name: 'James Laurenson',
						roles: [
							{
								name: 'Aleksander King',
								qualifier: '1990'
							}
						]
					},
					{
						name: 'Jodie McNee',
						roles: [
							{
								name: 'Alisa Kos',
								qualifier: '2011'
							}
						]
					},
					{
						name: 'Alex Price',
						roles: [
							{
								name: 'Aleksander King',
								qualifier: '1945'
							}
						]
					},
					{
						name: 'Bebe Sanders',
						roles: [
							{
								name: 'Alisa Kos',
								qualifier: '1990'
							}
						]
					}
				]
			});

		alisaKosCharacter = await chai.request(app)
			.get(`/characters/${ALISA_KOS_CHARACTER_UUID}`);

		mašaKosCharacter = await chai.request(app)
			.get(`/characters/${MAŠA_KOS_CHARACTER_UUID}`);

		aleksanderKingCharacter = await chai.request(app)
			.get(`/characters/${ALEKSANDER_KING_CHARACTER_UUID}`);

		roseKingCharacter = await chai.request(app)
			.get(`/characters/${ROSE_KING_CHARACTER_UUID}`);

		threeWintersPlaytext = await chai.request(app)
			.get(`/playtexts/${THREE_WINTERS_PLAYTEXT_UUID}`);

		threeWintersNationalProduction = await chai.request(app)
			.get(`/productions/${THREE_WINTERS_NATIONAL_PRODUCTION_UUID}`);

		siobhanFinneranPerson = await chai.request(app)
			.get(`/people/${SIOBHAN_FINNERAN_PERSON_UUID}`);

		joHerbertPerson = await chai.request(app)
			.get(`/people/${JO_HERBERT_PERSON_UUID}`);

		jamesLaurensonPerson = await chai.request(app)
			.get(`/people/${JAMES_LAURENSON_PERSON_UUID}`);

		jodieMcNeePerson = await chai.request(app)
			.get(`/people/${JODIE_MCNEE_PERSON_UUID}`);

		alexPricePerson = await chai.request(app)
			.get(`/people/${ALEX_PRICE_PERSON_UUID}`);

		bebeSandersPerson = await chai.request(app)
			.get(`/people/${BEBE_SANDERS_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Alisa Kos (character)', () => {

		it('includes playtexts in which character appears, including the groups applied', () => {

			const expectedThreeWintersPlaytext = {
				model: 'playtext',
				uuid: THREE_WINTERS_PLAYTEXT_UUID,
				name: '3 Winters',
				qualifiers: [],
				groups: [
					'2011',
					'1990'
				]
			};

			const { playtexts } = alisaKosCharacter.body;

			const threeWintersPlaytext = playtexts.find(playtext => playtext.uuid === THREE_WINTERS_PLAYTEXT_UUID);

			expect(playtexts.length).to.equal(1);
			expect(threeWintersPlaytext).to.deep.equal(expectedThreeWintersPlaytext);

		});

		it('includes productions in which character is portrayed, including by which performer and in which group', () => {

			const expectedThreeWintersNationalProduction = {
				model: 'production',
				uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
				name: '3 Winters',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: JODIE_MCNEE_PERSON_UUID,
						name: 'Jodie McNee',
						roleName: 'Alisa Kos',
						qualifier: '2011',
						otherRoles: []
					},
					{
						model: 'person',
						uuid: BEBE_SANDERS_PERSON_UUID,
						name: 'Bebe Sanders',
						roleName: 'Alisa Kos',
						qualifier: '1990',
						otherRoles: []
					}
				]
			};

			const { productions } = alisaKosCharacter.body;

			const threeWintersNationalProduction =
				productions.find(production => production.uuid === THREE_WINTERS_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(threeWintersNationalProduction).to.deep.equal(expectedThreeWintersNationalProduction);

		});

	});

	describe('Maša Kos (character)', () => {

		it('includes playtexts in which character appears, including the groups applied', () => {

			const expectedThreeWintersPlaytext = {
				model: 'playtext',
				uuid: THREE_WINTERS_PLAYTEXT_UUID,
				name: '3 Winters',
				qualifiers: [],
				groups: [
					'2011',
					'1990'
				]
			};

			const { playtexts } = mašaKosCharacter.body;

			const threeWintersPlaytext = playtexts.find(playtext => playtext.uuid === THREE_WINTERS_PLAYTEXT_UUID);

			expect(playtexts.length).to.equal(1);
			expect(threeWintersPlaytext).to.deep.equal(expectedThreeWintersPlaytext);

		});

		it('includes productions in which character is portrayed, including by which performer and excluding group as not applied', () => {

			const expectedThreeWintersNationalProduction = {
				model: 'production',
				uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
				name: '3 Winters',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: SIOBHAN_FINNERAN_PERSON_UUID,
						name: 'Siobhan Finneran',
						roleName: 'Maša Kos',
						qualifier: null,
						otherRoles: []
					}
				]
			};

			const { productions } = mašaKosCharacter.body;

			const threeWintersNationalProduction =
				productions.find(production => production.uuid === THREE_WINTERS_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(threeWintersNationalProduction).to.deep.equal(expectedThreeWintersNationalProduction);

		});

	});

	describe('Aleksander King (character)', () => {

		it('includes playtexts in which character appears, including the groups applied', () => {

			const expectedThreeWintersPlaytext = {
				model: 'playtext',
				uuid: THREE_WINTERS_PLAYTEXT_UUID,
				name: '3 Winters',
				qualifiers: [],
				groups: [
					'1990',
					'1945'
				]
			};

			const { playtexts } = aleksanderKingCharacter.body;

			const threeWintersPlaytext = playtexts.find(playtext => playtext.uuid === THREE_WINTERS_PLAYTEXT_UUID);

			expect(playtexts.length).to.equal(1);
			expect(threeWintersPlaytext).to.deep.equal(expectedThreeWintersPlaytext);

		});

		it('includes productions in which character is portrayed, including by which performer and in which group', () => {

			const expectedThreeWintersNationalProduction = {
				model: 'production',
				uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
				name: '3 Winters',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: JAMES_LAURENSON_PERSON_UUID,
						name: 'James Laurenson',
						roleName: 'Aleksander King',
						qualifier: '1990',
						otherRoles: []
					},
					{
						model: 'person',
						uuid: ALEX_PRICE_PERSON_UUID,
						name: 'Alex Price',
						roleName: 'Aleksander King',
						qualifier: '1945',
						otherRoles: []
					}
				]
			};

			const { productions } = aleksanderKingCharacter.body;

			const threeWintersNationalProduction =
				productions.find(production => production.uuid === THREE_WINTERS_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(threeWintersNationalProduction).to.deep.equal(expectedThreeWintersNationalProduction);

		});

	});

	describe('Rose King (character)', () => {

		it('includes playtexts in which character appears, including the groups applied', () => {

			const expectedThreeWintersPlaytext = {
				model: 'playtext',
				uuid: THREE_WINTERS_PLAYTEXT_UUID,
				name: '3 Winters',
				qualifiers: [],
				groups: [
					'1945'
				]
			};

			const { playtexts } = roseKingCharacter.body;

			const threeWintersPlaytext = playtexts.find(playtext => playtext.uuid === THREE_WINTERS_PLAYTEXT_UUID);

			expect(playtexts.length).to.equal(1);
			expect(threeWintersPlaytext).to.deep.equal(expectedThreeWintersPlaytext);

		});

		it('includes productions in which character is portrayed, including by which performer and excluding group as not applied', () => {

			const expectedThreeWintersNationalProduction = {
				model: 'production',
				uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
				name: '3 Winters',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: JO_HERBERT_PERSON_UUID,
						name: 'Jo Herbert',
						roleName: 'Rose King',
						qualifier: null,
						otherRoles: []
					}
				]
			};

			const { productions } = roseKingCharacter.body;

			const threeWintersNationalProduction =
				productions.find(production => production.uuid === THREE_WINTERS_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(threeWintersNationalProduction).to.deep.equal(expectedThreeWintersNationalProduction);

		});

	});

	describe('3 Winters (playtext)', () => {

		it('includes its characters in their respective groups', () => {

			const expectedCharacterGroups = [
				{
					name: '2011',
					model: 'characterGroup',
					characters: [
						{
							model: 'character',
							uuid: ALISA_KOS_CHARACTER_UUID,
							name: 'Alisa Kos',
							qualifier: null
						},
						{
							model: 'character',
							uuid: MAŠA_KOS_CHARACTER_UUID,
							name: 'Maša Kos',
							qualifier: null
						}
					]
				},
				{
					name: '1990',
					model: 'characterGroup',
					characters: [
						{
							model: 'character',
							uuid: MAŠA_KOS_CHARACTER_UUID,
							name: 'Maša Kos',
							qualifier: null
						},
						{
							model: 'character',
							uuid: ALEKSANDER_KING_CHARACTER_UUID,
							name: 'Aleksander King',
							qualifier: null
						},
						{
							model: 'character',
							uuid: ALISA_KOS_CHARACTER_UUID,
							name: 'Alisa Kos',
							qualifier: null
						}
					]
				},
				{
					name: '1945',
					model: 'characterGroup',
					characters: [
						{
							model: 'character',
							uuid: ROSE_KING_CHARACTER_UUID,
							name: 'Rose King',
							qualifier: null
						},
						{
							model: 'character',
							uuid: ALEKSANDER_KING_CHARACTER_UUID,
							name: 'Aleksander King',
							qualifier: null
						}
					]
				}
			];

			const { characterGroups } = threeWintersPlaytext.body;

			expect(characterGroups).to.deep.equal(expectedCharacterGroups);

		});

	});

	describe('3 Winters at National Theatre (production)', () => {

		it('includes the portrayers of the characters in its cast with their corresponding qualifiers', () => {

			const expectedSiobhanFinneranCastMember = {
				model: 'person',
				uuid: SIOBHAN_FINNERAN_PERSON_UUID,
				name: 'Siobhan Finneran',
				roles: [
					{
						model: 'character',
						uuid: MAŠA_KOS_CHARACTER_UUID,
						name: 'Maša Kos',
						qualifier: null
					}
				]
			};

			const expectedJoHerbertCastMember = {
				model: 'person',
				uuid: JO_HERBERT_PERSON_UUID,
				name: 'Jo Herbert',
				roles: [
					{
						model: 'character',
						uuid: ROSE_KING_CHARACTER_UUID,
						name: 'Rose King',
						qualifier: null
					}
				]
			};

			const expectedJamesLaurensonCastMember = {
				model: 'person',
				uuid: JAMES_LAURENSON_PERSON_UUID,
				name: 'James Laurenson',
				roles: [
					{
						model: 'character',
						uuid: ALEKSANDER_KING_CHARACTER_UUID,
						name: 'Aleksander King',
						qualifier: '1990'
					}
				]
			};

			const expectedJodieMcNeeCastMember = {
				model: 'person',
				uuid: JODIE_MCNEE_PERSON_UUID,
				name: 'Jodie McNee',
				roles: [
					{
						model: 'character',
						uuid: ALISA_KOS_CHARACTER_UUID,
						name: 'Alisa Kos',
						qualifier: '2011'
					}
				]
			};

			const expectedAlexPriceCastMember = {
				model: 'person',
				uuid: ALEX_PRICE_PERSON_UUID,
				name: 'Alex Price',
				roles: [
					{
						model: 'character',
						uuid: ALEKSANDER_KING_CHARACTER_UUID,
						name: 'Aleksander King',
						qualifier: '1945'
					}
				]
			};

			const expectedBebeSandersCastMember = {
				model: 'person',
				uuid: BEBE_SANDERS_PERSON_UUID,
				name: 'Bebe Sanders',
				roles: [
					{
						model: 'character',
						uuid: ALISA_KOS_CHARACTER_UUID,
						name: 'Alisa Kos',
						qualifier: '1990'
					}
				]
			};

			const { cast } = threeWintersNationalProduction.body;

			const siobhanFinneranCastMember = cast.find(castMember => castMember.uuid === SIOBHAN_FINNERAN_PERSON_UUID);
			const joHerbertCastMember = cast.find(castMember => castMember.uuid === JO_HERBERT_PERSON_UUID);
			const jamesLaurensonCastMember = cast.find(castMember => castMember.uuid === JAMES_LAURENSON_PERSON_UUID);
			const jodieMcNeeCastMember = cast.find(castMember => castMember.uuid === JODIE_MCNEE_PERSON_UUID);
			const alexPriceCastMember = cast.find(castMember => castMember.uuid === ALEX_PRICE_PERSON_UUID);
			const bebeSandersCastMember = cast.find(castMember => castMember.uuid === BEBE_SANDERS_PERSON_UUID);

			expect(cast.length).to.equal(6);
			expect(siobhanFinneranCastMember).to.deep.equal(expectedSiobhanFinneranCastMember);
			expect(joHerbertCastMember).to.deep.equal(expectedJoHerbertCastMember);
			expect(jamesLaurensonCastMember).to.deep.equal(expectedJamesLaurensonCastMember);
			expect(jodieMcNeeCastMember).to.deep.equal(expectedJodieMcNeeCastMember);
			expect(alexPriceCastMember).to.deep.equal(expectedAlexPriceCastMember);
			expect(bebeSandersCastMember).to.deep.equal(expectedBebeSandersCastMember);

		});

	});

	describe('Siobhan Finneran (person)', () => {

		it('includes in their production credits their portrayal of Maša Kos without a qualifier as not required', () => {

			const expectedThreeWintersNationalProduction = {
				model: 'production',
				uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
				name: '3 Winters',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: MAŠA_KOS_CHARACTER_UUID,
						name: 'Maša Kos',
						qualifier: null
					}
				]
			};

			const { productions } = siobhanFinneranPerson.body;

			const threeWintersNationalProduction =
				productions.find(production => production.uuid === THREE_WINTERS_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(threeWintersNationalProduction).to.deep.equal(expectedThreeWintersNationalProduction);

		});

	});

	describe('Jo Herbert (person)', () => {

		it('includes in their production credits their portrayal of Rose King without a qualifier as not required', () => {

			const expectedThreeWintersNationalProduction = {
				model: 'production',
				uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
				name: '3 Winters',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: ROSE_KING_CHARACTER_UUID,
						name: 'Rose King',
						qualifier: null
					}
				]
			};

			const { productions } = joHerbertPerson.body;

			const threeWintersNationalProduction =
				productions.find(production => production.uuid === THREE_WINTERS_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(threeWintersNationalProduction).to.deep.equal(expectedThreeWintersNationalProduction);

		});

	});

	describe('James Laurenson (person)', () => {

		it('includes in their production credits their portrayal of Aleksander King with its corresponding qualifier (i.e. 1990)', () => {

			const expectedThreeWintersNationalProduction = {
				model: 'production',
				uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
				name: '3 Winters',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: ALEKSANDER_KING_CHARACTER_UUID,
						name: 'Aleksander King',
						qualifier: '1990'
					}
				]
			};

			const { productions } = jamesLaurensonPerson.body;

			const threeWintersNationalProduction =
				productions.find(production => production.uuid === THREE_WINTERS_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(threeWintersNationalProduction).to.deep.equal(expectedThreeWintersNationalProduction);

		});

	});

	describe('Jodie McNee (person)', () => {

		it('includes in their production credits their portrayal of Alisa Kos with its corresponding qualifier (i.e. 2011)', () => {

			const expectedThreeWintersNationalProduction = {
				model: 'production',
				uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
				name: '3 Winters',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: ALISA_KOS_CHARACTER_UUID,
						name: 'Alisa Kos',
						qualifier: '2011'
					}
				]
			};

			const { productions } = jodieMcNeePerson.body;

			const threeWintersNationalProduction =
				productions.find(production => production.uuid === THREE_WINTERS_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(threeWintersNationalProduction).to.deep.equal(expectedThreeWintersNationalProduction);

		});

	});

	describe('Alex Price (person)', () => {

		it('includes in their production credits their portrayal of Aleksander King with its corresponding qualifier (i.e. 1945)', () => {

			const expectedThreeWintersNationalProduction = {
				model: 'production',
				uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
				name: '3 Winters',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: ALEKSANDER_KING_CHARACTER_UUID,
						name: 'Aleksander King',
						qualifier: '1945'
					}
				]
			};

			const { productions } = alexPricePerson.body;

			const threeWintersNationalProduction =
				productions.find(production => production.uuid === THREE_WINTERS_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(threeWintersNationalProduction).to.deep.equal(expectedThreeWintersNationalProduction);

		});

	});

	describe('Bebe Sanders (person)', () => {

		it('includes in their production credits their portrayal of Alisa Kos with its corresponding qualifier (i.e. 1990)', () => {

			const expectedThreeWintersNationalProduction = {
				model: 'production',
				uuid: THREE_WINTERS_NATIONAL_PRODUCTION_UUID,
				name: '3 Winters',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: ALISA_KOS_CHARACTER_UUID,
						name: 'Alisa Kos',
						qualifier: '1990'
					}
				]
			};

			const { productions } = bebeSandersPerson.body;

			const threeWintersNationalProduction =
				productions.find(production => production.uuid === THREE_WINTERS_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(threeWintersNationalProduction).to.deep.equal(expectedThreeWintersNationalProduction);

		});

	});

});

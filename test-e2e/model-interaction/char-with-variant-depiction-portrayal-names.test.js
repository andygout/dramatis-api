import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character with variant depiction and portrayal names', () => {

	chai.use(chaiHttp);

	const HENRY_IV_PART_1_PLAYTEXT_UUID = '4';
	const KING_HENRY_V_CHARACTER_UUID = '5';
	const SIR_JOHN_FALSTAFF_CHARACTER_UUID = '6';
	const MESSENGER_CHARACTER_UUID = '7';
	const HENRY_IV_PART_2_PLAYTEXT_UUID = '12';
	const ATTENDANT_CHARACTER_UUID = '15';
	const HENRY_V_PLAYTEXT_UUID = '20';
	const KING_OF_FRANCE_CHARACTER_UUID = '22';
	const SOLDIER_CHARACTER_UUID = '23';
	const THE_MERRY_WIVES_OF_WINDSOR_PLAYTEXT_UUID = '26';
	const HENRY_IV_PART_1_ROYAL_SHAKESPEARE_PRODUCTION_UUID = '28';
	const ROYAL_SHAKESPEARE_THEATRE_UUID = '30';
	const ALEX_HASSELL_PERSON_UUID = '31';
	const ANTONY_SHER_PERSON_UUID = '32';
	const HENRY_IV_PART_2_ROYAL_SHAKESPEARE_PRODUCTION_UUID = '33';
	const HENRY_V_ROYAL_SHAKESPEARE_PRODUCTION_UUID = '38';
	const SIMON_THORP_PERSON_UUID = '42';
	const HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID = '43';
	const NATIONAL_THEATRE_UUID = '45';
	const MATTHEW_MACFADYEN_PERSON_UUID = '46';
	const MICHAEL_GAMBON_PERSON_UUID = '47';
	const HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID = '48';
	const HENRY_V_NATIONAL_PRODUCTION_UUID = '53';
	const ADRIAN_LESTER_PERSON_UUID = '56';
	const IAN_HOGG_PERSON_UUID = '57';

	let kingHenryVCharacter;
	let messengerCharacter;
	let attendantCharacter;
	let soldierCharacter;
	let henryIVPart1Playtext;
	let henryIVPart2Playtext;
	let henryVPlaytext;
	let henryIVPart1RoyalShakespeareProduction;
	let henryIVPart2RoyalShakespeareProduction;
	let henryVRoyalShakespeareProduction;
	let henryIVPart1NationalProduction;
	let henryIVPart2NationalProduction;
	let henryVNationalProduction;
	let alexHassellPerson;
	let matthewMacfadyenPerson;
	let adrianLesterPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Henry IV, Part 1',
				characters: [
					{
						name: 'Henry, Prince of Wales',
						underlyingName: 'King Henry V'
					},
					{
						name: 'Sir John Falstaff'
					},
					{
						name: 'Messenger'
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Henry IV, Part 2',
				characters: [
					{
						name: 'Prince Hal',
						underlyingName: 'King Henry V'
					},
					{
						name: 'Sir John Falstaff'
					},
					{
						name: 'Attendant'
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Henry V',
				characters: [
					{
						name: 'King Henry V'
					},
					{
						name: 'King of France'
					},
					{
						name: 'Soldier'
					}
				]
			});

		// Prince Hal does not appear in The Merry Wives of Windsor;
		// it is a contrivance to test distinct variant named depictions.
		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'The Merry Wives of Windsor',
				characters: [
					{
						name: 'Prince Hal',
						underlyingName: 'King Henry V'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV, Part 1',
				playtext: {
					name: 'Henry IV, Part 1'
				},
				theatre: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Alex Hassell',
						roles: [
							{
								name: 'Harry',
								characterName: 'Henry, Prince of Wales'
							},
							{
								name: 'Messenger'
							}
						]
					},
					{
						name: 'Antony Sher',
						roles: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV, Part 2',
				playtext: {
					name: 'Henry IV, Part 2'
				},
				theatre: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Alex Hassell',
						roles: [
							{
								name: 'Hal',
								characterName: 'Prince Hal'
							},
							{
								name: 'Attendant'
							}
						]
					},
					{
						name: 'Antony Sher',
						roles: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry V',
				playtext: {
					name: 'Henry V'
				},
				theatre: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Alex Hassell',
						roles: [
							{
								name: 'Henry V, King of England',
								characterName: 'King Henry V'
							},
							{
								name: 'Soldier'
							}
						]
					},
					{
						name: 'Simon Thorp',
						roles: [
							{
								name: 'King of France'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV, Part 1',
				playtext: {
					name: 'Henry IV, Part 1'
				},
				theatre: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Matthew Macfadyen',
						roles: [
							{
								name: 'Prince Hal',
								characterName: 'Henry, Prince of Wales'
							},
							{
								name: 'Messenger'
							}
						]
					},
					{
						name: 'Michael Gambon',
						roles: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV, Part 2',
				playtext: {
					name: 'Henry IV, Part 2'
				},
				theatre: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Matthew Macfadyen',
						roles: [
							{
								name: 'Hal, Prince of England',
								characterName: 'Prince Hal'
							},
							{
								name: 'Attendant'
							}
						]
					},
					{
						name: 'Michael Gambon',
						roles: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry V',
				playtext: {
					name: 'Henry V'
				},
				theatre: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Adrian Lester',
						roles: [
							{
								name: 'Henry V',
								characterName: 'King Henry V'
							},
							{
								name: 'Soldier'
							}
						]
					},
					{
						name: 'Ian Hogg',
						roles: [
							{
								name: 'King of France'
							}
						]
					}
				]
			});

		kingHenryVCharacter = await chai.request(app)
			.get(`/characters/${KING_HENRY_V_CHARACTER_UUID}`);

		messengerCharacter = await chai.request(app)
			.get(`/characters/${MESSENGER_CHARACTER_UUID}`);

		attendantCharacter = await chai.request(app)
			.get(`/characters/${ATTENDANT_CHARACTER_UUID}`);

		soldierCharacter = await chai.request(app)
			.get(`/characters/${SOLDIER_CHARACTER_UUID}`);

		henryIVPart1Playtext = await chai.request(app)
			.get(`/playtexts/${HENRY_IV_PART_1_PLAYTEXT_UUID}`);

		henryIVPart2Playtext = await chai.request(app)
			.get(`/playtexts/${HENRY_IV_PART_2_PLAYTEXT_UUID}`);

		henryVPlaytext = await chai.request(app)
			.get(`/playtexts/${HENRY_V_PLAYTEXT_UUID}`);

		henryIVPart1RoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${HENRY_IV_PART_1_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		henryIVPart2RoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${HENRY_IV_PART_2_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		henryVRoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${HENRY_V_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		henryIVPart1NationalProduction = await chai.request(app)
			.get(`/productions/${HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID}`);

		henryIVPart2NationalProduction = await chai.request(app)
			.get(`/productions/${HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID}`);

		henryVNationalProduction = await chai.request(app)
			.get(`/productions/${HENRY_V_NATIONAL_PRODUCTION_UUID}`);

		alexHassellPerson = await chai.request(app)
			.get(`/people/${ALEX_HASSELL_PERSON_UUID}`);

		matthewMacfadyenPerson = await chai.request(app)
			.get(`/people/${MATTHEW_MACFADYEN_PERSON_UUID}`);

		adrianLesterPerson = await chai.request(app)
			.get(`/people/${ADRIAN_LESTER_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('King Henry V (character)', () => {

		it('includes playtexts in which character is depicted', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: HENRY_IV_PART_1_PLAYTEXT_UUID,
					name: 'Henry IV, Part 1',
					writers: [],
					depictions: [
						{
							displayName: 'Henry, Prince of Wales',
							qualifier: null,
							group: null
						}
					]
				},
				{
					model: 'playtext',
					uuid: HENRY_IV_PART_2_PLAYTEXT_UUID,
					name: 'Henry IV, Part 2',
					writers: [],
					depictions: [
						{
							displayName: 'Prince Hal',
							qualifier: null,
							group: null
						}
					]
				},
				{
					model: 'playtext',
					uuid: HENRY_V_PLAYTEXT_UUID,
					name: 'Henry V',
					writers: [],
					depictions: [
						{
							displayName: null,
							qualifier: null,
							group: null
						}
					]
				},
				{
					model: 'playtext',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_PLAYTEXT_UUID,
					name: 'The Merry Wives of Windsor',
					writers: [],
					depictions: [
						{
							displayName: 'Prince Hal',
							qualifier: null,
							group: null
						}
					]
				}
			];

			const { playtexts } = kingHenryVCharacter.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

		it('includes distinct variant named depictions (i.e. depictions in playtexts with names different to the underlying character name)', () => {

			const expectedVariantNamedDepictions = [
				'Henry, Prince of Wales',
				'Prince Hal'
			];

			const { variantNamedDepictions } = kingHenryVCharacter.body;

			expect(variantNamedDepictions).to.deep.equal(expectedVariantNamedDepictions);

		});

		// Even though 'Prince Hal' already appears in the variant depiction names (i.e. variant names from playtexts),
		// it still appears here because the corresponding portrayal was of the character from a playtext (Henry IV, Part 1)
		// in which neither the underlying nor display name matches the role name used for the portrayal.
		it('includes distinct variant named portrayals (i.e. portrayals in productions with names different to that in playtext)', () => {

			const expectedVariantNamedPortrayals = [
				'Hal',
				'Hal, Prince of England',
				'Harry',
				'Henry V',
				'Henry V, King of England',
				'Prince Hal'
			];

			const { variantNamedPortrayals } = kingHenryVCharacter.body;

			expect(variantNamedPortrayals).to.deep.equal(expectedVariantNamedPortrayals);

		});

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: MATTHEW_MACFADYEN_PERSON_UUID,
							name: 'Matthew Macfadyen',
							roleName: 'Prince Hal',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: MESSENGER_CHARACTER_UUID,
									name: 'Messenger',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Harry',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: MESSENGER_CHARACTER_UUID,
									name: 'Messenger',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: MATTHEW_MACFADYEN_PERSON_UUID,
							name: 'Matthew Macfadyen',
							roleName: 'Hal, Prince of England',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: ATTENDANT_CHARACTER_UUID,
									name: 'Attendant',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Hal',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: ATTENDANT_CHARACTER_UUID,
									name: 'Attendant',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_V_NATIONAL_PRODUCTION_UUID,
					name: 'Henry V',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ADRIAN_LESTER_PERSON_UUID,
							name: 'Adrian Lester',
							roleName: 'Henry V',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: SOLDIER_CHARACTER_UUID,
									name: 'Soldier',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_V_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry V',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Henry V, King of England',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: SOLDIER_CHARACTER_UUID,
									name: 'Soldier',
									qualifier: null
								}
							]
						}
					]
				}
			];

			const { productions } = kingHenryVCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Messenger (character)', () => {

		it('includes productions in which character was portrayed (with portrayers\' other roles using uuid of King Henry V and specific display name)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: MATTHEW_MACFADYEN_PERSON_UUID,
							name: 'Matthew Macfadyen',
							roleName: 'Messenger',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Prince Hal',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Messenger',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Harry',
									qualifier: null
								}
							]
						}
					]
				}
			];

			const { productions } = messengerCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Attendant (character)', () => {

		it('includes productions in which character was portrayed (with portrayers\' other roles using uuid of King Henry V and specific display name)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: MATTHEW_MACFADYEN_PERSON_UUID,
							name: 'Matthew Macfadyen',
							roleName: 'Attendant',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Hal, Prince of England',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Attendant',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Hal',
									qualifier: null
								}
							]
						}
					]
				}
			];

			const { productions } = attendantCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Soldier (character)', () => {

		it('includes productions in which character was portrayed (with portrayers\' other roles using uuid of King Henry V and specific display name)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HENRY_V_NATIONAL_PRODUCTION_UUID,
					name: 'Henry V',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ADRIAN_LESTER_PERSON_UUID,
							name: 'Adrian Lester',
							roleName: 'Soldier',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Henry V',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_V_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry V',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ALEX_HASSELL_PERSON_UUID,
							name: 'Alex Hassell',
							roleName: 'Soldier',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: KING_HENRY_V_CHARACTER_UUID,
									name: 'Henry V, King of England',
									qualifier: null
								}
							]
						}
					]
				}
			];

			const { productions } = soldierCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Henry IV, Part 1 (playtext)', () => {

		it('includes Henry, Prince of Wales in its characters using the uuid value of King Henry V', () => {

			const expectedCharacters = [
				{
					model: 'character',
					uuid: KING_HENRY_V_CHARACTER_UUID,
					name: 'Henry, Prince of Wales',
					qualifier: null
				},
				{
					model: 'character',
					uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
					name: 'Sir John Falstaff',
					qualifier: null
				},
				{
					model: 'character',
					uuid: MESSENGER_CHARACTER_UUID,
					name: 'Messenger',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = henryIVPart1Playtext.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Henry IV, Part 2 (playtext)', () => {

		it('includes Prince Hal in its characters using the uuid value of King Henry V', () => {

			const expectedCharacters = [
				{
					model: 'character',
					uuid: KING_HENRY_V_CHARACTER_UUID,
					name: 'Prince Hal',
					qualifier: null
				},
				{
					model: 'character',
					uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
					name: 'Sir John Falstaff',
					qualifier: null
				},
				{
					model: 'character',
					uuid: ATTENDANT_CHARACTER_UUID,
					name: 'Attendant',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = henryIVPart2Playtext.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Henry V (playtext)', () => {

		it('includes Henry V in its characters using the uuid value of King Henry V', () => {

			const expectedCharacters = [
				{
					model: 'character',
					uuid: KING_HENRY_V_CHARACTER_UUID,
					name: 'King Henry V',
					qualifier: null
				},
				{
					model: 'character',
					uuid: KING_OF_FRANCE_CHARACTER_UUID,
					name: 'King of France',
					qualifier: null
				},
				{
					model: 'character',
					uuid: SOLDIER_CHARACTER_UUID,
					name: 'Soldier',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = henryVPlaytext.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Henry IV, Part 1 at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Alex Hassell as Harry using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: ALEX_HASSELL_PERSON_UUID,
					name: 'Alex Hassell',
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Harry',
							qualifier: null
						},
						{
							model: 'character',
							uuid: MESSENGER_CHARACTER_UUID,
							name: 'Messenger',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: ANTONY_SHER_PERSON_UUID,
					name: 'Antony Sher',
					roles: [
						{
							model: 'character',
							uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
							name: 'Sir John Falstaff',
							qualifier: null
						}
					]
				}
			];

			const { cast } = henryIVPart1RoyalShakespeareProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Henry IV, Part 2 at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Alex Hassell as Hal using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: ALEX_HASSELL_PERSON_UUID,
					name: 'Alex Hassell',
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Hal',
							qualifier: null
						},
						{
							model: 'character',
							uuid: ATTENDANT_CHARACTER_UUID,
							name: 'Attendant',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: ANTONY_SHER_PERSON_UUID,
					name: 'Antony Sher',
					roles: [
						{
							model: 'character',
							uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
							name: 'Sir John Falstaff',
							qualifier: null
						}
					]
				}
			];

			const { cast } = henryIVPart2RoyalShakespeareProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Henry V at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Alex Hassell as Henry, King of England using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: ALEX_HASSELL_PERSON_UUID,
					name: 'Alex Hassell',
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Henry V, King of England',
							qualifier: null
						},
						{
							model: 'character',
							uuid: SOLDIER_CHARACTER_UUID,
							name: 'Soldier',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: SIMON_THORP_PERSON_UUID,
					name: 'Simon Thorp',
					roles: [
						{
							model: 'character',
							uuid: KING_OF_FRANCE_CHARACTER_UUID,
							name: 'King of France',
							qualifier: null
						}
					]
				}
			];

			const { cast } = henryVRoyalShakespeareProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Henry IV, Part 1 at National Theatre (production)', () => {

		it('includes cast with Matthew Macfadyen as Harry using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: MATTHEW_MACFADYEN_PERSON_UUID,
					name: 'Matthew Macfadyen',
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Prince Hal',
							qualifier: null
						},
						{
							model: 'character',
							uuid: MESSENGER_CHARACTER_UUID,
							name: 'Messenger',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: MICHAEL_GAMBON_PERSON_UUID,
					name: 'Michael Gambon',
					roles: [
						{
							model: 'character',
							uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
							name: 'Sir John Falstaff',
							qualifier: null
						}
					]
				}
			];

			const { cast } = henryIVPart1NationalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Henry IV, Part 2 at National Theatre (production)', () => {

		it('includes cast with Matthew Macfadyen as Hal using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: MATTHEW_MACFADYEN_PERSON_UUID,
					name: 'Matthew Macfadyen',
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Hal, Prince of England',
							qualifier: null
						},
						{
							model: 'character',
							uuid: ATTENDANT_CHARACTER_UUID,
							name: 'Attendant',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: MICHAEL_GAMBON_PERSON_UUID,
					name: 'Michael Gambon',
					roles: [
						{
							model: 'character',
							uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
							name: 'Sir John Falstaff',
							qualifier: null
						}
					]
				}
			];

			const { cast } = henryIVPart2NationalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Henry V at National Theatre (production)', () => {

		it('includes cast with Adrian Lester as Henry, King of England using the uuid value of King Henry V', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: ADRIAN_LESTER_PERSON_UUID,
					name: 'Adrian Lester',
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Henry V',
							qualifier: null
						},
						{
							model: 'character',
							uuid: SOLDIER_CHARACTER_UUID,
							name: 'Soldier',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: IAN_HOGG_PERSON_UUID,
					name: 'Ian Hogg',
					roles: [
						{
							model: 'character',
							uuid: KING_OF_FRANCE_CHARACTER_UUID,
							name: 'King of France',
							qualifier: null
						}
					]
				}
			];

			const { cast } = henryVNationalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Alex Hassell (person)', () => {

		it('includes productions of their portrayals of King Henry V under variant names (Harry; Hal; Henry V, King of England) but using its uuid value', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Harry',
							qualifier: null
						},
						{
							model: 'character',
							uuid: MESSENGER_CHARACTER_UUID,
							name: 'Messenger',
							qualifier: null
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Hal',
							qualifier: null
						},
						{
							model: 'character',
							uuid: ATTENDANT_CHARACTER_UUID,
							name: 'Attendant',
							qualifier: null
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_V_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Henry V',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Henry V, King of England',
							qualifier: null
						},
						{
							model: 'character',
							uuid: SOLDIER_CHARACTER_UUID,
							name: 'Soldier',
							qualifier: null
						}
					]
				}
			];

			const { productions } = alexHassellPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Matthew Macfadyen (person)', () => {

		it('includes productions of their portrayals of King Henry V under variant names (Prince Hal; Hal, Prince of England) but using its uuid value', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Prince Hal',
							qualifier: null
						},
						{
							model: 'character',
							uuid: MESSENGER_CHARACTER_UUID,
							name: 'Messenger',
							qualifier: null
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Hal, Prince of England',
							qualifier: null
						},
						{
							model: 'character',
							uuid: ATTENDANT_CHARACTER_UUID,
							name: 'Attendant',
							qualifier: null
						}
					]
				}
			];

			const { productions } = matthewMacfadyenPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Adrian Lester (person)', () => {

		it('includes productions of their portrayals of King Henry V under variant names (Henry V) but using its uuid value', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HENRY_V_NATIONAL_PRODUCTION_UUID,
					name: 'Henry V',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: KING_HENRY_V_CHARACTER_UUID,
							name: 'Henry V',
							qualifier: null
						},
						{
							model: 'character',
							uuid: SOLDIER_CHARACTER_UUID,
							name: 'Soldier',
							qualifier: null
						}
					]
				}
			];

			const { productions } = adrianLesterPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

});

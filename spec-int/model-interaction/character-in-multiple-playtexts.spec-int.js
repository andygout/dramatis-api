import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../server/app';
import purgeDatabase from '../spec-helpers/neo4j/purge-database';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Character in multiple playtexts', () => {

	const HENRY_IV_PART_1_PLAYTEXT_UUID = '0';
	const SIR_JOHN_FALSTAFF_CHARACTER_UUID = '1';
	const HENRY_IV_PART_2_PLAYTEXT_UUID = '2';
	const MERRY_WIVES_OF_WINDSOR_PLAYTEXT_UUID = '4';
	const HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID = '6';
	const NATIONAL_THEATRE_UUID = '7';
	const MICHAEL_GAMBON_PERSON_UUID = '9';
	const HENRY_IV_PART_2_GLOBE_PRODUCTION_UUID = '10';
	const GLOBE_THEATRE_UUID = '11';
	const ROGER_ALLAM_PERSON_UUID = '13';
	const MERRY_WIVES_OF_WINDSOR_SWAN_PRODUCTION_UUID = '14';
	const SWAN_THEATRE_UUID = '15';
	const RICHARD_CORDERY_PERSON_UUID = '17';

	let sirJohnFalstaffCharacter;
	let henryIVPart1Playtext;
	let henryIVPart2Playtext;
	let merryWivesOfWindsorPlaytext;
	let henryIVPart1NationalProduction;
	let henryIVPart2GlobeProduction;
	let merryWivesOfWindsorSwanProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Henry IV: Part 1',
				characters: [
					{
						name: 'Sir John Falstaff'
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Henry IV: Part 2',
				characters: [
					{
						name: 'Sir John Falstaff'
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'The Merry Wives of Windsor',
				characters: [
					{
						name: 'Sir John Falstaff'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV: Part 1',
				theatre: {
					name: 'National Theatre'
				},
				playtext: {
					name: 'Henry IV: Part 1'
				},
				cast: [
					{
						name: 'Michael Gambon',
						roles: [
							{
								name: 'Sir John Falstaff',
								characterName: ''
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV: Part 2',
				theatre: {
					name: 'Globe Theatre'
				},
				playtext: {
					name: 'Henry IV: Part 2'
				},
				cast: [
					{
						name: 'Roger Allam',
						roles: [
							{
								name: 'Sir John Falstaff',
								characterName: ''
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Merry Wives of Windsor',
				theatre: {
					name: 'Swan Theatre'
				},
				playtext: {
					name: 'The Merry Wives of Windsor'
				},
				cast: [
					{
						name: 'Richard Cordery',
						roles: [
							{
								name: 'Sir John Falstaff',
								characterName: ''
							}
						]
					}
				]
			});

		sirJohnFalstaffCharacter = await chai.request(app)
			.get(`/characters/${SIR_JOHN_FALSTAFF_CHARACTER_UUID}`);

		henryIVPart1Playtext = await chai.request(app)
			.get(`/playtexts/${HENRY_IV_PART_1_PLAYTEXT_UUID}`);

		henryIVPart2Playtext = await chai.request(app)
			.get(`/playtexts/${HENRY_IV_PART_2_PLAYTEXT_UUID}`);

		merryWivesOfWindsorPlaytext = await chai.request(app)
			.get(`/playtexts/${MERRY_WIVES_OF_WINDSOR_PLAYTEXT_UUID}`);

		henryIVPart1NationalProduction = await chai.request(app)
			.get(`/productions/${HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID}`);

		henryIVPart2GlobeProduction = await chai.request(app)
			.get(`/productions/${HENRY_IV_PART_2_GLOBE_PRODUCTION_UUID}`);

		merryWivesOfWindsorSwanProduction = await chai.request(app)
			.get(`/productions/${MERRY_WIVES_OF_WINDSOR_SWAN_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Sir John Falstaff (character)', () => {

		it('includes playtexts in which character appears', () => {

			const expectedHenryIVPart1PlaytextCredit = {
				model: 'playtext',
				uuid: HENRY_IV_PART_1_PLAYTEXT_UUID,
				name: 'Henry IV: Part 1'
			};

			const expectedHenryIVPart2PlaytextCredit = {
				model: 'playtext',
				uuid: HENRY_IV_PART_2_PLAYTEXT_UUID,
				name: 'Henry IV: Part 2'
			};

			const expectedMerryWivesOfWindsorPlaytextCredit = {
				model: 'playtext',
				uuid: MERRY_WIVES_OF_WINDSOR_PLAYTEXT_UUID,
				name: 'The Merry Wives of Windsor'
			};

			const { playtexts } = sirJohnFalstaffCharacter.body;

			const henryIVPart1PlaytextCredit =
				playtexts.find(playtext => playtext.uuid === HENRY_IV_PART_1_PLAYTEXT_UUID);

			const henryIVPart2PlaytextCredit =
				playtexts.find(playtext => playtext.uuid === HENRY_IV_PART_2_PLAYTEXT_UUID);

			const merryWivesOfWindsorPlaytextCredit =
				playtexts.find(playtext => playtext.uuid === MERRY_WIVES_OF_WINDSOR_PLAYTEXT_UUID);

			expect(playtexts.length).to.equal(3);
			expect(expectedHenryIVPart1PlaytextCredit)
				.to.deep.equal(henryIVPart1PlaytextCredit);
			expect(expectedHenryIVPart2PlaytextCredit)
				.to.deep.equal(henryIVPart2PlaytextCredit);
			expect(expectedMerryWivesOfWindsorPlaytextCredit)
				.to.deep.equal(merryWivesOfWindsorPlaytextCredit);

		});

		it('includes productions of playtexts in which character appears (including cast member who portrayed them)', () => {

			const expectedHenryIVPart1NationalProductionCredit = {
				model: 'production',
				uuid: HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID,
				name: 'Henry IV: Part 1',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: MICHAEL_GAMBON_PERSON_UUID,
						name: 'Michael Gambon',
						role: {
							name: 'Sir John Falstaff'
						},
						otherRoles: []
					}
				]
			};

			const expectedHenryIVPart2GlobeProductionCredit = {
				model: 'production',
				uuid: HENRY_IV_PART_2_GLOBE_PRODUCTION_UUID,
				name: 'Henry IV: Part 2',
				theatre: {
					model: 'theatre',
					uuid: GLOBE_THEATRE_UUID,
					name: 'Globe Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: ROGER_ALLAM_PERSON_UUID,
						name: 'Roger Allam',
						role: {
							name: 'Sir John Falstaff'
						},
						otherRoles: []
					}
				]
			};

			const expectedMerryWivesOfWindsorSwanProductionCredit = {
				model: 'production',
				uuid: MERRY_WIVES_OF_WINDSOR_SWAN_PRODUCTION_UUID,
				name: 'The Merry Wives of Windsor',
				theatre: {
					model: 'theatre',
					uuid: SWAN_THEATRE_UUID,
					name: 'Swan Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: RICHARD_CORDERY_PERSON_UUID,
						name: 'Richard Cordery',
						role: {
							name: 'Sir John Falstaff'
						},
						otherRoles: []
					}
				]
			};

			const { productions } = sirJohnFalstaffCharacter.body;

			const henryIVPart1NationalProductionCredit =
				productions.find(production => production.uuid === HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID);

			const henryIVPart2NationalProductionCredit =
				productions.find(production => production.uuid === HENRY_IV_PART_2_GLOBE_PRODUCTION_UUID);

			const merryWivesOfWindsorSwanProductionCredit =
				productions.find(production => production.uuid === MERRY_WIVES_OF_WINDSOR_SWAN_PRODUCTION_UUID);

			expect(productions.length).to.equal(3);
			expect(expectedHenryIVPart1NationalProductionCredit)
				.to.deep.equal(henryIVPart1NationalProductionCredit);
			expect(expectedHenryIVPart2GlobeProductionCredit)
				.to.deep.equal(henryIVPart2NationalProductionCredit);
			expect(expectedMerryWivesOfWindsorSwanProductionCredit)
				.to.deep.equal(merryWivesOfWindsorSwanProductionCredit);

		});

	});

	describe('Henry IV: Part 1 (playtext)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedCharacterSirJohnFalstaffCredit = {
				model: 'character',
				uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
				name: 'Sir John Falstaff'
			};

			const { characters } = henryIVPart1Playtext.body;

			const sirJohnFalstaffCharacterCredit =
				characters.find(character => character.uuid === SIR_JOHN_FALSTAFF_CHARACTER_UUID);

			expect(expectedCharacterSirJohnFalstaffCredit).to.deep.equal(sirJohnFalstaffCharacterCredit);

		});

	});

	describe('Henry IV: Part 2 (playtext)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedCharacterSirJohnFalstaffCredit = {
				model: 'character',
				uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
				name: 'Sir John Falstaff'
			};

			const { characters } = henryIVPart2Playtext.body;

			const sirJohnFalstaffCharacterCredit =
				characters.find(character => character.uuid === SIR_JOHN_FALSTAFF_CHARACTER_UUID);

			expect(expectedCharacterSirJohnFalstaffCredit).to.deep.equal(sirJohnFalstaffCharacterCredit);

		});

	});

	describe('The Merry Wives of Windsor (playtext)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedCharacterSirJohnFalstaffCredit = {
				model: 'character',
				uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
				name: 'Sir John Falstaff'
			};

			const { characters } = merryWivesOfWindsorPlaytext.body;

			const sirJohnFalstaffCharacterCredit =
				characters.find(character => character.uuid === SIR_JOHN_FALSTAFF_CHARACTER_UUID);

			expect(expectedCharacterSirJohnFalstaffCredit).to.deep.equal(sirJohnFalstaffCharacterCredit);

		});

	});

});

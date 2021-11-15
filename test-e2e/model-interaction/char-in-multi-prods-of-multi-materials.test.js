import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character in multiple productions of multiple materials', () => {

	chai.use(chaiHttp);

	const HENRY_IV_PART_1_MATERIAL_UUID = '3';
	const SIR_JOHN_FALSTAFF_CHARACTER_UUID = '5';
	const HENRY_IV_PART_2_MATERIAL_UUID = '9';
	const THE_MERRY_WIVES_OF_WINDSOR_MATERIAL_UUID = '15';
	const HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID = '18';
	const NATIONAL_THEATRE_VENUE_UUID = '20';
	const MICHAEL_GAMBON_PERSON_UUID = '21';
	const HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID = '22';
	const THE_MERRY_WIVES_OF_WINDSOR_NATIONAL_PRODUCTION_UUID = '26';
	const HENRY_IV_PART_1_GLOBE_PRODUCTION_UUID = '30';
	const SHAKESPEARES_GLOBE_VENUE_UUID = '32';
	const ROGER_ALLAM_PERSON_UUID = '33';
	const HENRY_IV_PART_2_GLOBE_PRODUCTION_UUID = '34';
	const THE_MERRY_WIVES_OF_WINDSOR_GLOBE_PRODUCTION_UUID = '38';
	const HENRY_IV_PART_1_SWAN_PRODUCTION_UUID = '42';
	const SWAN_THEATRE_VENUE_UUID = '44';
	const RICHARD_CORDERY_PERSON_UUID = '45';
	const HENRY_IV_PART_2_SWAN_PRODUCTION_UUID = '46';
	const THE_MERRY_WIVES_OF_WINDSOR_SWAN_PRODUCTION_UUID = '50';

	let sirJohnFalstaffCharacter;
	let henryIVPart1Material;
	let henryIVPart2Material;
	let merryWivesOfWindsorMaterial;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Henry IV, Part 1',
				format: 'play',
				year: 1597,
				characterGroups: [
					{
						characters: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Henry IV, Part 2',
				format: 'play',
				year: 1599,
				characterGroups: [
					{
						characters: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Merry Wives of Windsor',
				format: 'play',
				year: 1597,
				characterGroups: [
					{
						characters: [
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
				name: 'Henry IV, Part 1',
				startDate: '2005-04-16',
				pressDate: '2005-05-04',
				endDate: '2005-08-31',
				material: {
					name: 'Henry IV, Part 1'
				},
				venue: {
					name: 'National Theatre'
				},
				cast: [
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
				startDate: '2005-04-26',
				pressDate: '2005-05-04',
				endDate: '2005-08-31',
				material: {
					name: 'Henry IV, Part 2'
				},
				venue: {
					name: 'National Theatre'
				},
				cast: [
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
				// Contrivance for purposes of test.
				name: 'The Merry Wives of Windsor',
				startDate: '2005-09-04',
				pressDate: '2005-09-11',
				endDate: '2005-11-27',
				material: {
					name: 'The Merry Wives of Windsor'
				},
				venue: {
					name: 'National Theatre'
				},
				cast: [
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
				name: 'Henry IV, Part 1',
				startDate: '2010-06-06',
				pressDate: '2010-07-14',
				endDate: '2010-10-02',
				material: {
					name: 'Henry IV, Part 1'
				},
				venue: {
					name: 'Shakespeare\'s Globe'
				},
				cast: [
					{
						name: 'Roger Allam',
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
				startDate: '2010-07-03',
				pressDate: '2010-07-14',
				endDate: '2010-10-03',
				material: {
					name: 'Henry IV, Part 2'
				},
				venue: {
					name: 'Shakespeare\'s Globe'
				},
				cast: [
					{
						name: 'Roger Allam',
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
				name: 'The Merry Wives of Windsor',
				startDate: '2019-05-17',
				pressDate: '2019-05-28',
				endDate: '2019-10-12',
				material: {
					name: 'The Merry Wives of Windsor'
				},
				venue: {
					name: 'Shakespeare\'s Globe'
				},
				cast: [
					{
						// Contrivance for purposes of test.
						name: 'Roger Allam',
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
				name: 'Henry IV, Part 1',
				startDate: '2000-04-12', // Contrivance because date unavailable.
				pressDate: '2000-04-19',
				endDate: '2000-06-15', // Contrivance because date unavailable.
				venue: {
					name: 'Swan Theatre'
				},
				material: {
					name: 'Henry IV, Part 1'
				},
				cast: [
					{
						// Contrivance for purposes of test.
						name: 'Richard Cordery',
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
				startDate: '2000-06-22', // Contrivance because date unavailable.
				pressDate: '2000-06-29',
				endDate: '2000-09-15', // Contrivance because date unavailable.
				material: {
					name: 'Henry IV, Part 2'
				},
				venue: {
					name: 'Swan Theatre'
				},
				cast: [
					{
						// Contrivance for purposes of test.
						name: 'Richard Cordery',
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
				name: 'The Merry Wives of Windsor',
				startDate: '2002-10-24',
				pressDate: '2002-10-31',
				endDate: '2003-01-25',
				material: {
					name: 'The Merry Wives of Windsor'
				},
				venue: {
					name: 'Swan Theatre'
				},
				cast: [
					{
						name: 'Richard Cordery',
						roles: [
							{
								name: 'Sir John Falstaff'
							}
						]
					}
				]
			});

		sirJohnFalstaffCharacter = await chai.request(app)
			.get(`/characters/${SIR_JOHN_FALSTAFF_CHARACTER_UUID}`);

		henryIVPart1Material = await chai.request(app)
			.get(`/materials/${HENRY_IV_PART_1_MATERIAL_UUID}`);

		henryIVPart2Material = await chai.request(app)
			.get(`/materials/${HENRY_IV_PART_2_MATERIAL_UUID}`);

		merryWivesOfWindsorMaterial = await chai.request(app)
			.get(`/materials/${THE_MERRY_WIVES_OF_WINDSOR_MATERIAL_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Sir John Falstaff (character)', () => {

		it('includes materials in which character is depicted', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: HENRY_IV_PART_2_MATERIAL_UUID,
					name: 'Henry IV, Part 2',
					format: 'play',
					year: 1599,
					writingCredits: [],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: HENRY_IV_PART_1_MATERIAL_UUID,
					name: 'Henry IV, Part 1',
					format: 'play',
					year: 1597,
					writingCredits: [],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_MATERIAL_UUID,
					name: 'The Merry Wives of Windsor',
					format: 'play',
					year: 1597,
					writingCredits: [],
					depictions: []
				}
			];

			const { materials } = sirJohnFalstaffCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes productions of materials in which character is portrayed (including cast member who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_GLOBE_PRODUCTION_UUID,
					name: 'The Merry Wives of Windsor',
					startDate: '2019-05-17',
					endDate: '2019-10-12',
					venue: {
						model: 'VENUE',
						uuid: SHAKESPEARES_GLOBE_VENUE_UUID,
						name: 'Shakespeare\'s Globe',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: ROGER_ALLAM_PERSON_UUID,
							name: 'Roger Allam',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_2_GLOBE_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					startDate: '2010-07-03',
					endDate: '2010-10-03',
					venue: {
						model: 'VENUE',
						uuid: SHAKESPEARES_GLOBE_VENUE_UUID,
						name: 'Shakespeare\'s Globe',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: ROGER_ALLAM_PERSON_UUID,
							name: 'Roger Allam',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_1_GLOBE_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					startDate: '2010-06-06',
					endDate: '2010-10-02',
					venue: {
						model: 'VENUE',
						uuid: SHAKESPEARES_GLOBE_VENUE_UUID,
						name: 'Shakespeare\'s Globe',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: ROGER_ALLAM_PERSON_UUID,
							name: 'Roger Allam',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_NATIONAL_PRODUCTION_UUID,
					name: 'The Merry Wives of Windsor',
					startDate: '2005-09-04',
					endDate: '2005-11-27',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					startDate: '2005-04-26',
					endDate: '2005-08-31',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					startDate: '2005-04-16',
					endDate: '2005-08-31',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_SWAN_PRODUCTION_UUID,
					name: 'The Merry Wives of Windsor',
					startDate: '2002-10-24',
					endDate: '2003-01-25',
					venue: {
						model: 'VENUE',
						uuid: SWAN_THEATRE_VENUE_UUID,
						name: 'Swan Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICHARD_CORDERY_PERSON_UUID,
							name: 'Richard Cordery',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_2_SWAN_PRODUCTION_UUID,
					name: 'Henry IV, Part 2',
					startDate: '2000-06-22',
					endDate: '2000-09-15',
					venue: {
						model: 'VENUE',
						uuid: SWAN_THEATRE_VENUE_UUID,
						name: 'Swan Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICHARD_CORDERY_PERSON_UUID,
							name: 'Richard Cordery',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HENRY_IV_PART_1_SWAN_PRODUCTION_UUID,
					name: 'Henry IV, Part 1',
					startDate: '2000-04-12',
					endDate: '2000-06-15',
					venue: {
						model: 'VENUE',
						uuid: SWAN_THEATRE_VENUE_UUID,
						name: 'Swan Theatre',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICHARD_CORDERY_PERSON_UUID,
							name: 'Richard Cordery',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = sirJohnFalstaffCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Henry IV, Part 1 (material)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
					name: 'Sir John Falstaff',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = henryIVPart1Material.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Henry IV, Part 2 (material)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
					name: 'Sir John Falstaff',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = henryIVPart2Material.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('The Merry Wives of Windsor (material)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
					name: 'Sir John Falstaff',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = merryWivesOfWindsorMaterial.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

});

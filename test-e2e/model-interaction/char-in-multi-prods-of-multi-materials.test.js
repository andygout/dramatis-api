import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character in multiple productions of multiple materials', () => {

	chai.use(chaiHttp);

	const HENRY_IV_PART_1_MATERIAL_UUID = '3';
	const SIR_JOHN_FALSTAFF_CHARACTER_UUID = '5';
	const HENRY_IV_PART_2_MATERIAL_UUID = '9';
	const THE_MERRY_WIVES_OF_WINDSOR_MATERIAL_UUID = '15';
	const HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID = '18';
	const NATIONAL_THEATRE_UUID = '20';
	const MICHAEL_GAMBON_PERSON_UUID = '21';
	const HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID = '22';
	const THE_MERRY_WIVES_OF_WINDSOR_NATIONAL_PRODUCTION_UUID = '26';
	const HENRY_IV_PART_1_GLOBE_PRODUCTION_UUID = '30';
	const SHAKESPEARES_GLOBE_THEATRE_UUID = '32';
	const ROGER_ALLAM_PERSON_UUID = '33';
	const HENRY_IV_PART_2_GLOBE_PRODUCTION_UUID = '34';
	const THE_MERRY_WIVES_OF_WINDSOR_GLOBE_PRODUCTION_UUID = '38';
	const HENRY_IV_PART_1_SWAN_PRODUCTION_UUID = '42';
	const SWAN_THEATRE_UUID = '44';
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

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Henry IV: Part 1',
				format: 'play',
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
				name: 'Henry IV: Part 2',
				format: 'play',
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
				name: 'Henry IV: Part 1',
				material: {
					name: 'Henry IV: Part 1'
				},
				theatre: {
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
				name: 'Henry IV: Part 2',
				material: {
					name: 'Henry IV: Part 2'
				},
				theatre: {
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
				name: 'The Merry Wives of Windsor',
				material: {
					name: 'The Merry Wives of Windsor'
				},
				theatre: {
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
				name: 'Henry IV: Part 1',
				material: {
					name: 'Henry IV: Part 1'
				},
				theatre: {
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
				name: 'Henry IV: Part 2',
				material: {
					name: 'Henry IV: Part 2'
				},
				theatre: {
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
				material: {
					name: 'The Merry Wives of Windsor'
				},
				theatre: {
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
				name: 'Henry IV: Part 1',
				theatre: {
					name: 'Swan Theatre'
				},
				material: {
					name: 'Henry IV: Part 1'
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

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Henry IV: Part 2',
				material: {
					name: 'Henry IV: Part 2'
				},
				theatre: {
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

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Merry Wives of Windsor',
				material: {
					name: 'The Merry Wives of Windsor'
				},
				theatre: {
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
					model: 'material',
					uuid: HENRY_IV_PART_1_MATERIAL_UUID,
					name: 'Henry IV: Part 1',
					format: 'play',
					writerGroups: [],
					depictions: []
				},
				{
					model: 'material',
					uuid: HENRY_IV_PART_2_MATERIAL_UUID,
					name: 'Henry IV: Part 2',
					format: 'play',
					writerGroups: [],
					depictions: []
				},
				{
					model: 'material',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_MATERIAL_UUID,
					name: 'The Merry Wives of Windsor',
					format: 'play',
					writerGroups: [],
					depictions: []
				}
			];

			const { materials } = sirJohnFalstaffCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes productions of materials in which character is portrayed (including cast member who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV: Part 1',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_GLOBE_PRODUCTION_UUID,
					name: 'Henry IV: Part 1',
					theatre: {
						model: 'theatre',
						uuid: SHAKESPEARES_GLOBE_THEATRE_UUID,
						name: 'Shakespeare\'s Globe',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ROGER_ALLAM_PERSON_UUID,
							name: 'Roger Allam',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_1_SWAN_PRODUCTION_UUID,
					name: 'Henry IV: Part 1',
					theatre: {
						model: 'theatre',
						uuid: SWAN_THEATRE_UUID,
						name: 'Swan Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: RICHARD_CORDERY_PERSON_UUID,
							name: 'Richard Cordery',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_NATIONAL_PRODUCTION_UUID,
					name: 'Henry IV: Part 2',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_GLOBE_PRODUCTION_UUID,
					name: 'Henry IV: Part 2',
					theatre: {
						model: 'theatre',
						uuid: SHAKESPEARES_GLOBE_THEATRE_UUID,
						name: 'Shakespeare\'s Globe',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ROGER_ALLAM_PERSON_UUID,
							name: 'Roger Allam',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HENRY_IV_PART_2_SWAN_PRODUCTION_UUID,
					name: 'Henry IV: Part 2',
					theatre: {
						model: 'theatre',
						uuid: SWAN_THEATRE_UUID,
						name: 'Swan Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: RICHARD_CORDERY_PERSON_UUID,
							name: 'Richard Cordery',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_NATIONAL_PRODUCTION_UUID,
					name: 'The Merry Wives of Windsor',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_GLOBE_PRODUCTION_UUID,
					name: 'The Merry Wives of Windsor',
					theatre: {
						model: 'theatre',
						uuid: SHAKESPEARES_GLOBE_THEATRE_UUID,
						name: 'Shakespeare\'s Globe',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ROGER_ALLAM_PERSON_UUID,
							name: 'Roger Allam',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: THE_MERRY_WIVES_OF_WINDSOR_SWAN_PRODUCTION_UUID,
					name: 'The Merry Wives of Windsor',
					theatre: {
						model: 'theatre',
						uuid: SWAN_THEATRE_UUID,
						name: 'Swan Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: RICHARD_CORDERY_PERSON_UUID,
							name: 'Richard Cordery',
							roleName: 'Sir John Falstaff',
							qualifier: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = sirJohnFalstaffCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Henry IV: Part 1 (material)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedCharacters = [
				{
					model: 'character',
					uuid: SIR_JOHN_FALSTAFF_CHARACTER_UUID,
					name: 'Sir John Falstaff',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = henryIVPart1Material.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Henry IV: Part 2 (material)', () => {

		it('includes Sir John Falstaff in its characters', () => {

			const expectedCharacters = [
				{
					model: 'character',
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
					model: 'character',
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

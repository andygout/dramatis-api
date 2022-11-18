import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Different characters with the same name from the same material', () => {

	chai.use(chaiHttp);

	const JULIUS_CAESAR_MATERIAL_UUID = '5';
	const CINNA_CHARACTER_1_UUID = '7';
	const VOLUMNIUS_CHARACTER_UUID = '8';
	const CINNA_CHARACTER_2_UUID = '9';
	const JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID = '10';
	const BARBICAN_THEATRE_VENUE_UUID = '12';
	const PAUL_SHEARER_PERSON_UUID = '13';
	const LEO_WRINGER_PERSON_UUID = '14';

	let cinnaCharacter1;
	let cinnaCharacter2;
	let volumniusCharacter;
	let juliusCaesarMaterial;
	let juliusCaesarBarbicanProduction;
	let paulShearerPerson;
	let leoWringerPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Julius Caesar',
				characterGroups: [
					{
						characters: [
							{
								name: 'Cinna',
								differentiator: '1'
							},
							{
								name: 'Volumnius'
							},
							{
								name: 'Cinna',
								differentiator: '2'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Julius Caesar',
				startDate: '2005-04-14',
				pressDate: '2005-04-20',
				endDate: '2005-05-14',
				material: {
					name: 'Julius Caesar'
				},
				venue: {
					name: 'Barbican'
				},
				cast: [
					{
						name: 'Paul Shearer',
						roles: [
							{
								name: 'Cinna',
								characterDifferentiator: '1'
							},
							{
								name: 'Volumnius'
							}
						]
					},
					{
						name: 'Leo Wringer',
						roles: [
							{
								name: 'Cinna',
								characterDifferentiator: '2'
							}
						]
					}
				]
			});

		cinnaCharacter1 = await chai.request(app)
			.get(`/characters/${CINNA_CHARACTER_1_UUID}`);

		cinnaCharacter2 = await chai.request(app)
			.get(`/characters/${CINNA_CHARACTER_2_UUID}`);

		volumniusCharacter = await chai.request(app)
			.get(`/characters/${VOLUMNIUS_CHARACTER_UUID}`);

		juliusCaesarMaterial = await chai.request(app)
			.get(`/materials/${JULIUS_CAESAR_MATERIAL_UUID}`);

		juliusCaesarBarbicanProduction = await chai.request(app)
			.get(`/productions/${JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID}`);

		paulShearerPerson = await chai.request(app)
			.get(`/people/${PAUL_SHEARER_PERSON_UUID}`);

		leoWringerPerson = await chai.request(app)
			.get(`/people/${LEO_WRINGER_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Cinna (character) (#1)', () => {

		it('includes productions in which character was portrayed including performers who portrayed them (i.e. excludes portrayers of different character with same name)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: PAUL_SHEARER_PERSON_UUID,
							name: 'Paul Shearer',
							roleName: 'Cinna',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: VOLUMNIUS_CHARACTER_UUID,
									name: 'Volumnius',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = cinnaCharacter1.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Cinna (character) (#2)', () => {

		it('includes productions in which character was portrayed including performers who portrayed them (i.e. excludes portrayers of different character with same name)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: LEO_WRINGER_PERSON_UUID,
							name: 'Leo Wringer',
							roleName: 'Cinna',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = cinnaCharacter2.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Volumnius (character)', () => {

		it('includes productions in which character was portrayed including in portrayer\'s other roles the correct duplicate-named character', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican',
						surVenue: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: PAUL_SHEARER_PERSON_UUID,
							name: 'Paul Shearer',
							roleName: 'Volumnius',
							qualifier: null,
							isAlternate: false,
							otherRoles: [
								{
									model: 'CHARACTER',
									uuid: CINNA_CHARACTER_1_UUID,
									name: 'Cinna',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					]
				}
			];

			const { productions } = volumniusCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Julius Caesar (material)', () => {

		it('includes Cinna (#1) and Cinna (#2) in its characters', () => {

			const expectedCharacters = [
				{
					model: 'CHARACTER',
					uuid: CINNA_CHARACTER_1_UUID,
					name: 'Cinna',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: VOLUMNIUS_CHARACTER_UUID,
					name: 'Volumnius',
					qualifier: null
				},
				{
					model: 'CHARACTER',
					uuid: CINNA_CHARACTER_2_UUID,
					name: 'Cinna',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = juliusCaesarMaterial.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Julius Caesar at Barbican (production)', () => {

		it('includes cast with Paul Shearer as Cinna (#1) and Leo Wringer as Cinna (#2)', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: PAUL_SHEARER_PERSON_UUID,
					name: 'Paul Shearer',
					roles: [
						{
							model: 'CHARACTER',
							uuid: CINNA_CHARACTER_1_UUID,
							name: 'Cinna',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: VOLUMNIUS_CHARACTER_UUID,
							name: 'Volumnius',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PERSON',
					uuid: LEO_WRINGER_PERSON_UUID,
					name: 'Leo Wringer',
					roles: [
						{
							model: 'CHARACTER',
							uuid: CINNA_CHARACTER_2_UUID,
							name: 'Cinna',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = juliusCaesarBarbicanProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Paul Shearer (person)', () => {

		it('includes in their production credits their portrayal of Cinna (#1) (i.e. and not Cinna (#2))', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican',
						surVenue: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: CINNA_CHARACTER_1_UUID,
							name: 'Cinna',
							qualifier: null,
							isAlternate: false
						},
						{
							model: 'CHARACTER',
							uuid: VOLUMNIUS_CHARACTER_UUID,
							name: 'Volumnius',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = paulShearerPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Leo Wringer (person)', () => {

		it('includes in their production credits their portrayal of Cinna (#2) (i.e. and not Cinna (#1))', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican',
						surVenue: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: CINNA_CHARACTER_2_UUID,
							name: 'Cinna',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = leoWringerPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});

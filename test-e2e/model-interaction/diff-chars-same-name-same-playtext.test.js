import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Different characters with the same name from the same playtext', () => {

	chai.use(chaiHttp);

	const JULIUS_CAESAR_PLAYTEXT_UUID = '4';
	const CINNA_CHARACTER_1_UUID = '5';
	const VOLUMNIUS_CHARACTER_UUID = '6';
	const CINNA_CHARACTER_2_UUID = '7';
	const JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID = '8';
	const BARBICAN_THEATRE_UUID = '10';
	const PAUL_SHEARER_PERSON_UUID = '11';
	const LEO_WRINGER_PERSON_UUID = '12';

	let cinnaCharacter1;
	let cinnaCharacter2;
	let volumniusCharacter;
	let juliusCaesarPlaytext;
	let juliusCaesarBarbicanProduction;
	let paulShearerPerson;
	let leoWringerPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
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
				playtext: {
					name: 'Julius Caesar'
				},
				theatre: {
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

		juliusCaesarPlaytext = await chai.request(app)
			.get(`/playtexts/${JULIUS_CAESAR_PLAYTEXT_UUID}`);

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
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: PAUL_SHEARER_PERSON_UUID,
							name: 'Paul Shearer',
							roleName: 'Cinna',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: VOLUMNIUS_CHARACTER_UUID,
									name: 'Volumnius',
									qualifier: null
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
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: LEO_WRINGER_PERSON_UUID,
							name: 'Leo Wringer',
							roleName: 'Cinna',
							qualifier: null,
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
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: PAUL_SHEARER_PERSON_UUID,
							name: 'Paul Shearer',
							roleName: 'Volumnius',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: CINNA_CHARACTER_1_UUID,
									name: 'Cinna',
									qualifier: null
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

	describe('Julius Caesar (playtext)', () => {

		it('includes Cinna (#1) and Cinna (#2) in its characters', () => {

			const expectedCharacters = [
				{
					model: 'character',
					uuid: CINNA_CHARACTER_1_UUID,
					name: 'Cinna',
					qualifier: null
				},
				{
					model: 'character',
					uuid: VOLUMNIUS_CHARACTER_UUID,
					name: 'Volumnius',
					qualifier: null
				},
				{
					model: 'character',
					uuid: CINNA_CHARACTER_2_UUID,
					name: 'Cinna',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = juliusCaesarPlaytext.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Julius Caesar at Barbican (production)', () => {

		it('includes cast with Paul Shearer as Cinna (#1) and Leo Wringer as Cinna (#2)', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: PAUL_SHEARER_PERSON_UUID,
					name: 'Paul Shearer',
					roles: [
						{
							model: 'character',
							uuid: CINNA_CHARACTER_1_UUID,
							name: 'Cinna',
							qualifier: null
						},
						{
							model: 'character',
							uuid: VOLUMNIUS_CHARACTER_UUID,
							name: 'Volumnius',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: LEO_WRINGER_PERSON_UUID,
					name: 'Leo Wringer',
					roles: [
						{
							model: 'character',
							uuid: CINNA_CHARACTER_2_UUID,
							name: 'Cinna',
							qualifier: null
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

			const expectedProductions = [
				{
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: CINNA_CHARACTER_1_UUID,
							name: 'Cinna',
							qualifier: null
						},
						{
							model: 'character',
							uuid: VOLUMNIUS_CHARACTER_UUID,
							name: 'Volumnius',
							qualifier: null
						}
					]
				}
			];

			const { productions } = paulShearerPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Leo Wringer (person)', () => {

		it('includes in their production credits their portrayal of Cinna (#2) (i.e. and not Cinna (#1))', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: CINNA_CHARACTER_2_UUID,
							name: 'Cinna',
							qualifier: null
						}
					]
				}
			];

			const { productions } = leoWringerPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

});

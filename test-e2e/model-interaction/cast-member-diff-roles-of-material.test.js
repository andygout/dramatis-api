import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Cast member performing different roles in different productions of same material', () => {

	chai.use(chaiHttp);

	const KING_LEAR_CHARACTER_UUID = '6';
	const FOOL_CHARACTER_UUID = '7';
	const KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID = '8';
	const ROYAL_SHAKESPEARE_THEATRE_UUID = '10';
	const MICHAEL_GAMBON_PERSON_UUID = '11';
	const ANTONY_SHER_PERSON_UUID = '12';
	const KING_LEAR_BARBICAN_PRODUCTION_UUID = '13';
	const BARBICAN_THEATRE_UUID = '15';
	const GRAHAM_TURNER_PERSON_UUID = '17';

	let kingLearCharacter;
	let foolCharacter;
	let kingLearRoyalShakespeareProduction;
	let kingLearBarbicanProduction;
	let michaelGambonPerson;
	let antonySherPerson;
	let grahamTurnerPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Tragedy of King Lear',
				characterGroups: [
					{
						characters: [
							{
								name: 'King Lear'
							},
							{
								name: 'Fool'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'King Lear',
				material: {
					name: 'The Tragedy of King Lear'
				},
				theatre: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Michael Gambon',
						roles: [
							{
								name: 'King Lear'
							}
						]
					},
					{
						name: 'Antony Sher',
						roles: [
							{
								name: 'Fool'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'King Lear',
				material: {
					name: 'The Tragedy of King Lear'
				},
				theatre: {
					name: 'Barbican'
				},
				cast: [
					{
						name: 'Antony Sher',
						roles: [
							{
								name: 'King Lear'
							}
						]
					},
					{
						name: 'Graham Turner',
						roles: [
							{
								name: 'Fool'
							}
						]
					}
				]
			});

		kingLearCharacter = await chai.request(app)
			.get(`/characters/${KING_LEAR_CHARACTER_UUID}`);

		foolCharacter = await chai.request(app)
			.get(`/characters/${FOOL_CHARACTER_UUID}`);

		kingLearRoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		kingLearBarbicanProduction = await chai.request(app)
			.get(`/productions/${KING_LEAR_BARBICAN_PRODUCTION_UUID}`);

		michaelGambonPerson = await chai.request(app)
			.get(`/people/${MICHAEL_GAMBON_PERSON_UUID}`);

		antonySherPerson = await chai.request(app)
			.get(`/people/${ANTONY_SHER_PERSON_UUID}`);

		grahamTurnerPerson = await chai.request(app)
			.get(`/people/${GRAHAM_TURNER_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('King Lear (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
					name: 'King Lear',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ANTONY_SHER_PERSON_UUID,
							name: 'Antony Sher',
							roleName: 'King Lear',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'King Lear',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: MICHAEL_GAMBON_PERSON_UUID,
							name: 'Michael Gambon',
							roleName: 'King Lear',
							qualifier: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = kingLearCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Fool (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
					name: 'King Lear',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: GRAHAM_TURNER_PERSON_UUID,
							name: 'Graham Turner',
							roleName: 'Fool',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'King Lear',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: ANTONY_SHER_PERSON_UUID,
							name: 'Antony Sher',
							roleName: 'Fool',
							qualifier: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = foolCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('King Lear at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Michael Gambon as King Lear and Antony Sher as Fool', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: MICHAEL_GAMBON_PERSON_UUID,
					name: 'Michael Gambon',
					roles: [
						{
							model: 'character',
							uuid: KING_LEAR_CHARACTER_UUID,
							name: 'King Lear',
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
							uuid: FOOL_CHARACTER_UUID,
							name: 'Fool',
							qualifier: null
						}
					]
				}
			];

			const { cast } = kingLearRoyalShakespeareProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('King Lear at Barbican (production)', () => {

		it('includes cast with Antony Sher as King Lear and Graham Turner as Fool', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: ANTONY_SHER_PERSON_UUID,
					name: 'Antony Sher',
					roles: [
						{
							model: 'character',
							uuid: KING_LEAR_CHARACTER_UUID,
							name: 'King Lear',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: GRAHAM_TURNER_PERSON_UUID,
					name: 'Graham Turner',
					roles: [
						{
							model: 'character',
							uuid: FOOL_CHARACTER_UUID,
							name: 'Fool',
							qualifier: null
						}
					]
				}
			];

			const { cast } = kingLearBarbicanProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Michael Gambon (person)', () => {

		it('includes production with his portrayal of King Lear', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'King Lear',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: KING_LEAR_CHARACTER_UUID,
							name: 'King Lear',
							qualifier: null
						}
					]
				}
			];

			const { productions } = michaelGambonPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Antony Sher (person)', () => {

		it('includes production with his respective portrayals of King Lear and the Fool', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
					name: 'King Lear',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: KING_LEAR_CHARACTER_UUID,
							name: 'King Lear',
							qualifier: null
						}
					]
				},
				{
					model: 'production',
					uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'King Lear',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: FOOL_CHARACTER_UUID,
							name: 'Fool',
							qualifier: null
						}
					]
				}
			];

			const { productions } = antonySherPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Graham Turner (person)', () => {

		it('includes production with his portrayal of the Fool', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
					name: 'King Lear',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: FOOL_CHARACTER_UUID,
							name: 'Fool',
							qualifier: null
						}
					]
				}
			];

			const { productions } = grahamTurnerPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

});

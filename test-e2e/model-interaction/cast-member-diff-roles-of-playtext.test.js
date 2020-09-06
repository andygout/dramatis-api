import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Cast member performing different roles in different productions of same playtext', () => {

	chai.use(chaiHttp);

	const KING_LEAR_CHARACTER_UUID = '4';
	const FOOL_CHARACTER_UUID = '5';
	const KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID = '6';
	const ROYAL_SHAKESPEARE_THEATRE_UUID = '7';
	const MICHAEL_GAMBON_PERSON_UUID = '9';
	const ANTONY_SHER_PERSON_UUID = '10';
	const KING_LEAR_BARBICAN_PRODUCTION_UUID = '11';
	const BARBICAN_THEATRE_UUID = '12';
	const GRAHAM_TURNER_PERSON_UUID = '15';

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
			.post('/playtexts')
			.send({
				name: 'The Tragedy of King Lear',
				characters: [
					{
						name: 'King Lear'
					},
					{
						name: 'Fool'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'King Lear',
				theatre: {
					name: 'Royal Shakespeare Theatre'
				},
				playtext: {
					name: 'The Tragedy of King Lear'
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
				theatre: {
					name: 'Barbican'
				},
				playtext: {
					name: 'The Tragedy of King Lear'
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

			const expectedKingLearRoyalShakespeareProductionCredit = {
				model: 'production',
				uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
				name: 'King Lear',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
					name: 'Royal Shakespeare Theatre'
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
			};

			const expectedKingLearBarbicanProductionCredit = {
				model: 'production',
				uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
				name: 'King Lear',
				theatre: {
					model: 'theatre',
					uuid: BARBICAN_THEATRE_UUID,
					name: 'Barbican'
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
			};

			const { productions } = kingLearCharacter.body;

			const kingLearRoyalShakespeareProductionCredit =
				productions.find(production => production.uuid === KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID);

			const kingLearBarbicanProductionCredit =
				productions.find(production => production.uuid === KING_LEAR_BARBICAN_PRODUCTION_UUID);

			expect(productions.length).to.equal(2);
			expect(expectedKingLearRoyalShakespeareProductionCredit)
				.to.deep.equal(kingLearRoyalShakespeareProductionCredit);
			expect(expectedKingLearBarbicanProductionCredit).to.deep.equal(kingLearBarbicanProductionCredit);

		});

	});

	describe('Fool (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedKingLearRoyalShakespeareProductionCredit = {
				model: 'production',
				uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
				name: 'King Lear',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
					name: 'Royal Shakespeare Theatre'
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
			};

			const expectedKingLearBarbicanProductionCredit = {
				model: 'production',
				uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
				name: 'King Lear',
				theatre: {
					model: 'theatre',
					uuid: BARBICAN_THEATRE_UUID,
					name: 'Barbican'
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
			};

			const { productions } = foolCharacter.body;

			const kingLearRoyalShakespeareProductionCredit =
				productions.find(production => production.uuid === KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID);

			const kingLearBarbicanProductionCredit =
				productions.find(production => production.uuid === KING_LEAR_BARBICAN_PRODUCTION_UUID);

			expect(productions.length).to.equal(2);
			expect(expectedKingLearRoyalShakespeareProductionCredit)
				.to.deep.equal(kingLearRoyalShakespeareProductionCredit);
			expect(expectedKingLearBarbicanProductionCredit).to.deep.equal(kingLearBarbicanProductionCredit);

		});

	});

	describe('King Lear at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Michael Gambon as King Lear and Antony Sher as Fool', () => {

			const expectedCastMemberMichaelGambon = {
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
			};

			const expectedCastMemberAntonySher = {
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
			};

			const { cast } = kingLearRoyalShakespeareProduction.body;

			const castMemberMichaelGambon = cast.find(castMember => castMember.uuid === MICHAEL_GAMBON_PERSON_UUID);
			const castMemberAntonySher = cast.find(castMember => castMember.uuid === ANTONY_SHER_PERSON_UUID);

			expect(cast.length).to.equal(2);
			expect(castMemberMichaelGambon).to.deep.equal(expectedCastMemberMichaelGambon);
			expect(castMemberAntonySher).to.deep.equal(expectedCastMemberAntonySher);

		});

	});

	describe('King Lear at Barbican (production)', () => {

		it('includes cast with Antony Sher as King Lear and Graham Turner as Fool', () => {

			const expectedCastMemberAntonySher = {
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
			};

			const expectedCastMemberGrahamTurner = {
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
			};

			const { cast } = kingLearBarbicanProduction.body;

			const castMemberAntonySher = cast.find(castMember => castMember.uuid === ANTONY_SHER_PERSON_UUID);
			const castMemberGrahamTurner = cast.find(castMember => castMember.uuid === GRAHAM_TURNER_PERSON_UUID);

			expect(cast.length).to.equal(2);
			expect(castMemberAntonySher).to.deep.equal(expectedCastMemberAntonySher);
			expect(castMemberGrahamTurner).to.deep.equal(expectedCastMemberGrahamTurner);

		});

	});

	describe('Michael Gambon (person)', () => {

		it('includes production with his portrayal of King Lear', () => {

			const expectedProductionCredit = {
				model: 'production',
				uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
				name: 'King Lear',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
					name: 'Royal Shakespeare Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: KING_LEAR_CHARACTER_UUID,
						name: 'King Lear',
						qualifier: null
					}
				]
			};

			const { productions } = michaelGambonPerson.body;

			const productionCredit =
				productions.find(production => production.uuid === KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(productionCredit).to.deep.equal(expectedProductionCredit);

		});

	});

	describe('Antony Sher (person)', () => {

		it('includes production with his respective portrayals of King Lear and the Fool', () => {

			const expectedKingLearRoyalShakespeareProductionCredit = {
				model: 'production',
				uuid: KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
				name: 'King Lear',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
					name: 'Royal Shakespeare Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: FOOL_CHARACTER_UUID,
						name: 'Fool',
						qualifier: null
					}
				]
			};

			const expectedKingLearBarbicanProductionCredit = {
				model: 'production',
				uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
				name: 'King Lear',
				theatre: {
					model: 'theatre',
					uuid: BARBICAN_THEATRE_UUID,
					name: 'Barbican'
				},
				roles: [
					{
						model: 'character',
						uuid: KING_LEAR_CHARACTER_UUID,
						name: 'King Lear',
						qualifier: null
					}
				]
			};

			const { productions } = antonySherPerson.body;

			const kingLearRoyalShakespeareProductionCredit =
				productions.find(production => production.uuid === KING_LEAR_ROYAL_SHAKESPEARE_PRODUCTION_UUID);

			const kingLearBarbicanProductionCredit =
				productions.find(production => production.uuid === KING_LEAR_BARBICAN_PRODUCTION_UUID);

			expect(productions.length).to.equal(2);
			expect(expectedKingLearRoyalShakespeareProductionCredit)
				.to.deep.equal(kingLearRoyalShakespeareProductionCredit);
			expect(expectedKingLearBarbicanProductionCredit).to.deep.equal(kingLearBarbicanProductionCredit);

		});

	});

	describe('Graham Turner (person)', () => {

		it('includes production with his portrayal of the Fool', () => {

			const expectedProductionCredit = {
				model: 'production',
				uuid: KING_LEAR_BARBICAN_PRODUCTION_UUID,
				name: 'King Lear',
				theatre: {
					model: 'theatre',
					uuid: BARBICAN_THEATRE_UUID,
					name: 'Barbican'
				},
				roles: [
					{
						model: 'character',
						uuid: FOOL_CHARACTER_UUID,
						name: 'Fool',
						qualifier: null
					}
				]
			};

			const { productions } = grahamTurnerPerson.body;

			const productionCredit =
				productions.find(production => production.uuid === KING_LEAR_BARBICAN_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(productionCredit).to.deep.equal(expectedProductionCredit);

		});

	});

});

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character with multiple appearances in the same playtext under different qualifiers', () => {

	chai.use(chaiHttp);

	const ROCK_N_ROLL_PLAYTEXT_UUID = '6';
	const ESME_CHARACTER_UUID = '7';
	const MAX_CHARACTER_UUID = '8';
	const ELEANOR_CHARACTER_UUID = '9';
	const ALICE_CHARACTER_UUID = '11';
	const ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID = '12';
	const ROYAL_COURT_THEATRE_UUID = '13';
	const ALICE_EVE_PERSON_UUID = '15';
	const SINEAD_CUSACK_PERSON_UUID = '17';

	let esmeCharacter;
	let aliceCharacter;
	let eleanorCharacter;
	let rockNRollPlaytext;
	let rockNRollRoyalCourtProduction;
	let aliceEvePerson;
	let sineadCusackPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Rock \'n\' Roll',
				characters: [
					{
						name: 'Esme',
						qualifier: 'younger'
					},
					{
						name: 'Max',
						qualifier: ''
					},
					{
						name: 'Eleanor',
						qualifier: ''
					},
					{
						name: 'Esme',
						qualifier: 'older'
					},
					{
						name: 'Alice',
						qualifier: ''
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Rock \'n\' Roll',
				theatre: {
					name: 'Royal Court Theatre'
				},
				playtext: {
					name: 'Rock \'n\' Roll'
				},
				cast: [
					{
						name: 'Alice Eve',
						roles: [
							{
								name: 'Esme',
								qualifier: 'younger'
							},
							{
								name: 'Alice',
								qualifier: ''
							}
						]
					},
					{
						name: 'Brian Cox',
						roles: [
							{
								name: 'Max',
								qualifier: ''
							}
						]
					},
					{
						name: 'Sinead Cusack',
						roles: [
							{
								name: 'Eleanor',
								qualifier: ''
							},
							{
								name: 'Esme',
								qualifier: 'older'
							}
						]
					}
				]
			});

		esmeCharacter = await chai.request(app)
			.get(`/characters/${ESME_CHARACTER_UUID}`);

		aliceCharacter = await chai.request(app)
			.get(`/characters/${ALICE_CHARACTER_UUID}`);

		eleanorCharacter = await chai.request(app)
			.get(`/characters/${ELEANOR_CHARACTER_UUID}`);

		rockNRollPlaytext = await chai.request(app)
			.get(`/playtexts/${ROCK_N_ROLL_PLAYTEXT_UUID}`);

		rockNRollRoyalCourtProduction = await chai.request(app)
			.get(`/productions/${ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID}`);

		aliceEvePerson = await chai.request(app)
			.get(`/people/${ALICE_EVE_PERSON_UUID}`);

		sineadCusackPerson = await chai.request(app)
			.get(`/people/${SINEAD_CUSACK_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Esme (character)', () => {

		it('includes playtexts in which character appears, including the qualifiers used', () => {

			const expectedRockNRollPlaytext = {
				model: 'playtext',
				uuid: ROCK_N_ROLL_PLAYTEXT_UUID,
				name: 'Rock \'n\' Roll',
				qualifiers: [
					'younger',
					'older'
				],
				groups: []
			};

			const { playtexts } = esmeCharacter.body;

			const rockNRollPlaytext = playtexts.find(playtext => playtext.uuid === ROCK_N_ROLL_PLAYTEXT_UUID);

			expect(playtexts.length).to.equal(1);
			expect(rockNRollPlaytext).to.deep.equal(expectedRockNRollPlaytext);

		});

		it('includes productions in which character is portrayed, including by which performer and under which qualifier', () => {

			const expectedRockNRollRoyalCourtProduction = {
				model: 'production',
				uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
				name: 'Rock \'n\' Roll',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_COURT_THEATRE_UUID,
					name: 'Royal Court Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: ALICE_EVE_PERSON_UUID,
						name: 'Alice Eve',
						roleName: 'Esme',
						qualifier: 'younger',
						otherRoles: [
							{
								model: 'character',
								uuid: ALICE_CHARACTER_UUID,
								name: 'Alice',
								qualifier: null
							}
						]
					},
					{
						model: 'person',
						uuid: SINEAD_CUSACK_PERSON_UUID,
						name: 'Sinead Cusack',
						roleName: 'Esme',
						qualifier: 'older',
						otherRoles: [
							{
								model: 'character',
								uuid: ELEANOR_CHARACTER_UUID,
								name: 'Eleanor',
								qualifier: null
							}
						]
					}
				]
			};

			const { productions } = esmeCharacter.body;

			const rockNRollRoyalCourtProduction =
				productions.find(production => production.uuid === ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(rockNRollRoyalCourtProduction).to.deep.equal(expectedRockNRollRoyalCourtProduction);

		});

	});

	describe('Alice (character)', () => {

		it('includes productions in which character is portrayed, including performer\'s other roles with qualifiers', () => {

			const expectedRockNRollRoyalCourtProduction = {
				model: 'production',
				uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
				name: 'Rock \'n\' Roll',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_COURT_THEATRE_UUID,
					name: 'Royal Court Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: ALICE_EVE_PERSON_UUID,
						name: 'Alice Eve',
						roleName: 'Alice',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: ESME_CHARACTER_UUID,
								name: 'Esme',
								qualifier: 'younger'
							}
						]
					}
				]
			};

			const { productions } = aliceCharacter.body;

			const rockNRollRoyalCourtProduction =
				productions.find(production => production.uuid === ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(rockNRollRoyalCourtProduction).to.deep.equal(expectedRockNRollRoyalCourtProduction);

		});

	});

	describe('Eleanor (character)', () => {

		it('includes productions in which character is portrayed, including performer\'s other roles with qualifiers', () => {

			const expectedRockNRollRoyalCourtProduction = {
				model: 'production',
				uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
				name: 'Rock \'n\' Roll',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_COURT_THEATRE_UUID,
					name: 'Royal Court Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: SINEAD_CUSACK_PERSON_UUID,
						name: 'Sinead Cusack',
						roleName: 'Eleanor',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: ESME_CHARACTER_UUID,
								name: 'Esme',
								qualifier: 'older'
							}
						]
					}
				]
			};

			const { productions } = eleanorCharacter.body;

			const rockNRollRoyalCourtProduction =
				productions.find(production => production.uuid === ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(rockNRollRoyalCourtProduction).to.deep.equal(expectedRockNRollRoyalCourtProduction);

		});

	});

	describe('Rock \'n\' Roll (playtext)', () => {

		it('includes Esme in its characters with an entry for each qualifier', () => {

			const expectedCharacters = [
				{
					model: 'character',
					uuid: ESME_CHARACTER_UUID,
					name: 'Esme',
					qualifier: 'younger'
				},
				{
					model: 'character',
					uuid: MAX_CHARACTER_UUID,
					name: 'Max',
					qualifier: null
				},
				{
					model: 'character',
					uuid: ELEANOR_CHARACTER_UUID,
					name: 'Eleanor',
					qualifier: null
				},
				{
					model: 'character',
					uuid: ESME_CHARACTER_UUID,
					name: 'Esme',
					qualifier: 'older'
				},
				{
					model: 'character',
					uuid: ALICE_CHARACTER_UUID,
					name: 'Alice',
					qualifier: null
				}
			];

			const { characterGroups: [{ characters }] } = rockNRollPlaytext.body;

			expect(characters).to.deep.equal(expectedCharacters);

		});

	});

	describe('Rock \'n\' Roll at Royal Court Theatre (production)', () => {

		it('includes the portrayers of Esme in its cast with their corresponding qualifiers', () => {

			const expectedAliceEveCastMember = {
				model: 'person',
				uuid: ALICE_EVE_PERSON_UUID,
				name: 'Alice Eve',
				roles: [
					{
						model: 'character',
						uuid: ESME_CHARACTER_UUID,
						name: 'Esme',
						qualifier: 'younger'
					},
					{
						model: 'character',
						uuid: ALICE_CHARACTER_UUID,
						name: 'Alice',
						qualifier: null
					}
				]
			};

			const expectedSineadCusackCastMember = {
				model: 'person',
				uuid: SINEAD_CUSACK_PERSON_UUID,
				name: 'Sinead Cusack',
				roles: [
					{
						model: 'character',
						uuid: ELEANOR_CHARACTER_UUID,
						name: 'Eleanor',
						qualifier: null
					},
					{
						model: 'character',
						uuid: ESME_CHARACTER_UUID,
						name: 'Esme',
						qualifier: 'older'
					}
				]
			};

			const { cast } = rockNRollRoyalCourtProduction.body;

			const aliceEveCastMember = cast.find(castMember => castMember.uuid === ALICE_EVE_PERSON_UUID);
			const sineadCusackCastMember = cast.find(castMember => castMember.uuid === SINEAD_CUSACK_PERSON_UUID);

			expect(cast.length).to.equal(3);
			expect(aliceEveCastMember).to.deep.equal(expectedAliceEveCastMember);
			expect(sineadCusackCastMember).to.deep.equal(expectedSineadCusackCastMember);

		});

	});

	describe('Alice Eve (person)', () => {

		it('includes in their production credits their portrayal of Esme with its corresponding qualifier (i.e. younger)', () => {

			const expectedRockNRollRoyalCourtProduction = {
				model: 'production',
				uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
				name: 'Rock \'n\' Roll',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_COURT_THEATRE_UUID,
					name: 'Royal Court Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: ESME_CHARACTER_UUID,
						name: 'Esme',
						qualifier: 'younger'
					},
					{
						model: 'character',
						uuid: ALICE_CHARACTER_UUID,
						name: 'Alice',
						qualifier: null
					}
				]
			};

			const { productions } = aliceEvePerson.body;

			const rockNRollRoyalCourtProduction =
				productions.find(production => production.uuid === ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(rockNRollRoyalCourtProduction).to.deep.equal(expectedRockNRollRoyalCourtProduction);

		});

	});

	describe('Sinead Cusack (person)', () => {

		it('includes in their production credits their portrayal of Esme with its corresponding qualifier (i.e. older)', () => {

			const expectedRockNRollRoyalCourtProduction = {
				model: 'production',
				uuid: ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID,
				name: 'Rock \'n\' Roll',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_COURT_THEATRE_UUID,
					name: 'Royal Court Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: ELEANOR_CHARACTER_UUID,
						name: 'Eleanor',
						qualifier: null
					},
					{
						model: 'character',
						uuid: ESME_CHARACTER_UUID,
						name: 'Esme',
						qualifier: 'older'
					}
				]
			};

			const { productions } = sineadCusackPerson.body;

			const rockNRollRoyalCourtProduction =
				productions.find(production => production.uuid === ROCK_N_ROLL_ROYAL_COURT_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(rockNRollRoyalCourtProduction).to.deep.equal(expectedRockNRollRoyalCourtProduction);

		});

	});

});

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character with variant names', () => {

	chai.use(chaiHttp);

	const CLAUDIUS_CHARACTER_UUID = '7';
	const GHOST_CHARACTER_UUID = '8';
	const FIRST_PLAYER_CHARACTER_UUID = '9';
	const HAMLET_ALMEIDA_PRODUCTION_UUID = '10';
	const ALMEIDA_THEATRE_UUID = '11';
	const DAVID_RINTOUL_PERSON_UUID = '14';
	const HAMLET_NOVELLO_PRODUCTION_UUID = '15';
	const NOVELLO_THEATRE_UUID = '16';
	const PATRICK_STEWART_PERSON_UUID = '19';
	const HAMLET_WYNDHAMS_PRODUCTION_UUID = '20';
	const WYNDHAMS_THEATRE_UUID = '21';
	const PETER_EYRE_PERSON_UUID = '24';

	let ghostCharacter;
	let hamletAlmeidaProduction;
	let hamletNovelloProduction;
	let hamletWyndhamsProduction;
	let davidRintoulPerson;
	let patrickStewartPerson;
	let peterEyrePerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'The Tragedy of Hamlet, Prince of Denmark',
				characters: [
					{
						name: 'Hamlet, Prince of Denmark'
					},
					{
						name: 'Claudius, King of Denmark'
					},
					{
						name: 'Ghost of King Hamlet'
					},
					{
						name: 'First Player'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamlet',
				theatre: {
					name: 'Almeida Theatre'
				},
				playtext: {
					name: 'The Tragedy of Hamlet, Prince of Denmark'
				},
				cast: [
					{
						name: 'Andrew Scott',
						roles: [
							{
								name: 'Hamlet',
								characterName: 'Hamlet, Prince of Denmark'
							}
						]
					},
					{
						name: 'David Rintoul',
						roles: [
							{
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet'
							},
							{
								name: 'Player King',
								characterName: 'First Player'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamlet',
				theatre: {
					name: 'Novello Theatre'
				},
				playtext: {
					name: 'The Tragedy of Hamlet, Prince of Denmark'
				},
				cast: [
					{
						name: 'David Tennant',
						roles: [
							{
								name: 'Hamlet',
								characterName: 'Hamlet, Prince of Denmark'
							}
						]
					},
					{
						name: 'Patrick Stewart',
						roles: [
							{
								name: 'Claudius',
								characterName: 'Claudius, King of Denmark'
							},
							{
								name: 'Ghost of King Hamlet'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamlet',
				theatre: {
					name: 'Wyndham\'s Theatre'
				},
				playtext: {
					name: 'The Tragedy of Hamlet, Prince of Denmark'
				},
				cast: [
					{
						name: 'Jude Law',
						roles: [
							{
								name: 'Hamlet',
								characterName: 'Hamlet, Prince of Denmark'
							}
						]
					},
					{
						name: 'Peter Eyre',
						roles: [
							{
								name: 'King Hamlet',
								characterName: 'Ghost of King Hamlet'
							},
							{
								name: 'First Player'
							}
						]
					}
				]
			});

		ghostCharacter = await chai.request(app)
			.get(`/characters/${GHOST_CHARACTER_UUID}`);

		hamletAlmeidaProduction = await chai.request(app)
			.get(`/productions/${HAMLET_ALMEIDA_PRODUCTION_UUID}`);

		hamletNovelloProduction = await chai.request(app)
			.get(`/productions/${HAMLET_NOVELLO_PRODUCTION_UUID}`);

		hamletWyndhamsProduction = await chai.request(app)
			.get(`/productions/${HAMLET_WYNDHAMS_PRODUCTION_UUID}`);

		davidRintoulPerson = await chai.request(app)
			.get(`/people/${DAVID_RINTOUL_PERSON_UUID}`);

		patrickStewartPerson = await chai.request(app)
			.get(`/people/${PATRICK_STEWART_PERSON_UUID}`);

		peterEyrePerson = await chai.request(app)
			.get(`/people/${PETER_EYRE_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Ghost (character)', () => {

		it('includes variant names (i.e. portrayals in productions with names different to that in playtext)', () => {

			const expectedVariantNames = [
				'Ghost',
				'King Hamlet'
			];

			const { variantNames } = ghostCharacter.body;

			expect(variantNames).to.deep.equal(expectedVariantNames);

		});

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedHamletAlmeidaProduction = {
				model: 'production',
				uuid: HAMLET_ALMEIDA_PRODUCTION_UUID,
				name: 'Hamlet',
				theatre: {
					model: 'theatre',
					uuid: ALMEIDA_THEATRE_UUID,
					name: 'Almeida Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: DAVID_RINTOUL_PERSON_UUID,
						name: 'David Rintoul',
						roleName: 'Ghost',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: FIRST_PLAYER_CHARACTER_UUID,
								name: 'Player King',
								qualifier: null
							}
						]
					}
				]
			};

			const expectedHamletNovelloProduction = {
				model: 'production',
				uuid: HAMLET_NOVELLO_PRODUCTION_UUID,
				name: 'Hamlet',
				theatre: {
					model: 'theatre',
					uuid: NOVELLO_THEATRE_UUID,
					name: 'Novello Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: PATRICK_STEWART_PERSON_UUID,
						name: 'Patrick Stewart',
						roleName: 'Ghost of King Hamlet',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: CLAUDIUS_CHARACTER_UUID,
								name: 'Claudius',
								qualifier: null
							}
						]
					}
				]
			};

			const expectedHamletWyndhamsProduction = {
				model: 'production',
				uuid: HAMLET_WYNDHAMS_PRODUCTION_UUID,
				name: 'Hamlet',
				theatre: {
					model: 'theatre',
					uuid: WYNDHAMS_THEATRE_UUID,
					name: 'Wyndham\'s Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: PETER_EYRE_PERSON_UUID,
						name: 'Peter Eyre',
						roleName: 'King Hamlet',
						qualifier: null,
						otherRoles: [
							{
								model: 'character',
								uuid: FIRST_PLAYER_CHARACTER_UUID,
								name: 'First Player',
								qualifier: null
							}
						]
					}
				]
			};

			const { productions } = ghostCharacter.body;

			const hamletAlmeidaProduction =
				productions.find(production => production.uuid === HAMLET_ALMEIDA_PRODUCTION_UUID);

			const hamletNovelloProduction =
				productions.find(production => production.uuid === HAMLET_NOVELLO_PRODUCTION_UUID);

			const hamletWyndhamsProduction =
				productions.find(production => production.uuid === HAMLET_WYNDHAMS_PRODUCTION_UUID);

			expect(productions.length).to.equal(3);
			expect(hamletAlmeidaProduction).to.deep.equal(expectedHamletAlmeidaProduction);
			expect(hamletNovelloProduction).to.deep.equal(expectedHamletNovelloProduction);
			expect(hamletWyndhamsProduction).to.deep.equal(expectedHamletWyndhamsProduction);

		});

	});

	describe('Hamlet at Almeida Theatre (production)', () => {

		it('includes cast with David Rintoul as Ghost of King Hamlet under a variant name (Ghost)', () => {

			const expectedCastMember = {
				model: 'person',
				uuid: DAVID_RINTOUL_PERSON_UUID,
				name: 'David Rintoul',
				roles: [
					{
						model: 'character',
						uuid: GHOST_CHARACTER_UUID,
						name: 'Ghost',
						qualifier: null
					},
					{
						model: 'character',
						uuid: FIRST_PLAYER_CHARACTER_UUID,
						name: 'Player King',
						qualifier: null
					}
				]
			};

			const { cast } = hamletAlmeidaProduction.body;

			const castMember = cast.find(castMember => castMember.uuid === DAVID_RINTOUL_PERSON_UUID);

			expect(cast.length).to.equal(2);
			expect(castMember).to.deep.equal(expectedCastMember);

		});

	});

	describe('Hamlet at Novello Theatre (production)', () => {

		it('includes cast with Patrick Stewart as Ghost of King Hamlet under same name as in playtext (Ghost of King Hamlet)', () => {

			const expectedCastMember = {
				model: 'person',
				uuid: PATRICK_STEWART_PERSON_UUID,
				name: 'Patrick Stewart',
				roles: [
					{
						model: 'character',
						uuid: CLAUDIUS_CHARACTER_UUID,
						name: 'Claudius',
						qualifier: null
					},
					{
						model: 'character',
						uuid: GHOST_CHARACTER_UUID,
						name: 'Ghost of King Hamlet',
						qualifier: null
					}
				]
			};

			const { cast } = hamletNovelloProduction.body;

			const castMember = cast.find(castMember => castMember.uuid === PATRICK_STEWART_PERSON_UUID);

			expect(cast.length).to.equal(2);
			expect(castMember).to.deep.equal(expectedCastMember);

		});

	});

	describe('Hamlet at Wyndham\'s Theatre (production)', () => {

		it('includes cast with Peter Eyre as Ghost of King Hamlet under a variant name (King Hamlet)', () => {

			const expectedCastMember = {
				model: 'person',
				uuid: PETER_EYRE_PERSON_UUID,
				name: 'Peter Eyre',
				roles: [
					{
						model: 'character',
						uuid: GHOST_CHARACTER_UUID,
						name: 'King Hamlet',
						qualifier: null
					},
					{
						model: 'character',
						uuid: FIRST_PLAYER_CHARACTER_UUID,
						name: 'First Player',
						qualifier: null
					}
				]
			};

			const { cast } = hamletWyndhamsProduction.body;

			const castMember = cast.find(castMember => castMember.uuid === PETER_EYRE_PERSON_UUID);

			expect(cast.length).to.equal(2);
			expect(castMember).to.deep.equal(expectedCastMember);

		});

	});

	describe('David Rintoul (person)', () => {

		it('includes production with his portrayal of Ghost of King Hamlet under a variant name (Ghost)', () => {

			const expectedProduction = {
				model: 'production',
				uuid: HAMLET_ALMEIDA_PRODUCTION_UUID,
				name: 'Hamlet',
				theatre: {
					model: 'theatre',
					uuid: ALMEIDA_THEATRE_UUID,
					name: 'Almeida Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: GHOST_CHARACTER_UUID,
						name: 'Ghost',
						qualifier: null
					},
					{
						model: 'character',
						uuid: FIRST_PLAYER_CHARACTER_UUID,
						name: 'Player King',
						qualifier: null
					}
				]
			};

			const { productions } = davidRintoulPerson.body;

			const production = productions.find(production => production.uuid === HAMLET_ALMEIDA_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(production).to.deep.equal(expectedProduction);

		});

	});

	describe('Patrick Stewart (person)', () => {

		it('includes production with his portrayal of Ghost of King Hamlet under same name as in playtext (Ghost of King Hamlet)', () => {

			const expectedProduction = {
				model: 'production',
				uuid: HAMLET_NOVELLO_PRODUCTION_UUID,
				name: 'Hamlet',
				theatre: {
					model: 'theatre',
					uuid: NOVELLO_THEATRE_UUID,
					name: 'Novello Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: CLAUDIUS_CHARACTER_UUID,
						name: 'Claudius',
						qualifier: null
					},
					{
						model: 'character',
						uuid: GHOST_CHARACTER_UUID,
						name: 'Ghost of King Hamlet',
						qualifier: null
					}
				]
			};

			const { productions } = patrickStewartPerson.body;

			const production = productions.find(production => production.uuid === HAMLET_NOVELLO_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(production).to.deep.equal(expectedProduction);

		});

	});

	describe('Peter Eyre (person)', () => {

		it('includes production with his portrayal of Ghost of King Hamlet under a variant name (King Hamlet)', () => {

			const expectedProduction = {
				model: 'production',
				uuid: HAMLET_WYNDHAMS_PRODUCTION_UUID,
				name: 'Hamlet',
				theatre: {
					model: 'theatre',
					uuid: WYNDHAMS_THEATRE_UUID,
					name: 'Wyndham\'s Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: GHOST_CHARACTER_UUID,
						name: 'King Hamlet',
						qualifier: null
					},
					{
						model: 'character',
						uuid: FIRST_PLAYER_CHARACTER_UUID,
						name: 'First Player',
						qualifier: null
					}
				]
			};

			const { productions } = peterEyrePerson.body;

			const production = productions.find(production => production.uuid === HAMLET_WYNDHAMS_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(production).to.deep.equal(expectedProduction);

		});

	});

});

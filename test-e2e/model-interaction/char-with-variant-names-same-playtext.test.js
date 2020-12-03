import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character with variant names from productions of the same playtext', () => {

	chai.use(chaiHttp);

	const HAMLET_CHARACTER_UUID = '8';
	const CLAUDIUS_CHARACTER_UUID = '9';
	const GHOST_CHARACTER_UUID = '10';
	const FIRST_PLAYER_CHARACTER_UUID = '11';
	const HAMLET_ALMEIDA_PRODUCTION_UUID = '12';
	const ALMEIDA_THEATRE_UUID = '14';
	const ANDREW_SCOTT_PERSON_UUID = '15';
	const DAVID_RINTOUL_PERSON_UUID = '16';
	const HAMLET_NOVELLO_PRODUCTION_UUID = '17';
	const NOVELLO_THEATRE_UUID = '19';
	const DAVID_TENNANT_PERSON_UUID = '20';
	const PATRICK_STEWART_PERSON_UUID = '21';
	const HAMLET_WYNDHAMS_PRODUCTION_UUID = '22';
	const WYNDHAMS_THEATRE_UUID = '24';
	const JUDE_LAW_PERSON_UUID = '25';
	const PETER_EYRE_PERSON_UUID = '26';

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
				name: 'Hamlet',
				characterGroups: [
					{
						characters: [
							{
								name: 'Hamlet'
							},
							{
								name: 'Claudius'
							},
							{
								name: 'Ghost'
							},
							{
								name: 'First Player'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamlet',
				playtext: {
					name: 'Hamlet'
				},
				theatre: {
					name: 'Almeida Theatre'
				},
				cast: [
					{
						name: 'Andrew Scott',
						roles: [
							{
								name: 'Hamlet, Prince of Denmark',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'David Rintoul',
						roles: [
							{
								name: 'Ghost of King Hamlet',
								characterName: 'Ghost'
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
				playtext: {
					name: 'Hamlet'
				},
				theatre: {
					name: 'Novello Theatre'
				},
				cast: [
					{
						name: 'David Tennant',
						roles: [
							{
								name: 'Hamlet, Prince of Denmark',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'Patrick Stewart',
						roles: [
							{
								name: 'Claudius, King of Denmark',
								characterName: 'Claudius'
							},
							{
								name: 'Ghost'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamlet',
				playtext: {
					name: 'Hamlet'
				},
				theatre: {
					name: 'Wyndham\'s Theatre'
				},
				cast: [
					{
						name: 'Jude Law',
						roles: [
							{
								name: 'Hamlet, Prince of Denmark',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'Peter Eyre',
						roles: [
							{
								name: 'King Hamlet',
								characterName: 'Ghost'
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

		it('includes variant named portrayals (i.e. portrayals in productions with names different to that in playtext)', () => {

			const expectedVariantNamedPortrayals = [
				'Ghost of King Hamlet',
				'King Hamlet'
			];

			const { variantNamedPortrayals } = ghostCharacter.body;

			expect(variantNamedPortrayals).to.deep.equal(expectedVariantNamedPortrayals);

		});

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HAMLET_ALMEIDA_PRODUCTION_UUID,
					name: 'Hamlet',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: DAVID_RINTOUL_PERSON_UUID,
							name: 'David Rintoul',
							roleName: 'Ghost of King Hamlet',
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
				},
				{
					model: 'production',
					uuid: HAMLET_NOVELLO_PRODUCTION_UUID,
					name: 'Hamlet',
					theatre: {
						model: 'theatre',
						uuid: NOVELLO_THEATRE_UUID,
						name: 'Novello Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: PATRICK_STEWART_PERSON_UUID,
							name: 'Patrick Stewart',
							roleName: 'Ghost',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: CLAUDIUS_CHARACTER_UUID,
									name: 'Claudius, King of Denmark',
									qualifier: null
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: HAMLET_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hamlet',
					theatre: {
						model: 'theatre',
						uuid: WYNDHAMS_THEATRE_UUID,
						name: 'Wyndham\'s Theatre',
						surTheatre: null
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
				}
			];

			const { productions } = ghostCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Hamlet at Almeida Theatre (production)', () => {

		it('includes cast with David Rintoul as Ghost of King Hamlet under a variant name (Ghost)', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: ANDREW_SCOTT_PERSON_UUID,
					name: 'Andrew Scott',
					roles: [
						{
							model: 'character',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Hamlet, Prince of Denmark',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: DAVID_RINTOUL_PERSON_UUID,
					name: 'David Rintoul',
					roles: [
						{
							model: 'character',
							uuid: GHOST_CHARACTER_UUID,
							name: 'Ghost of King Hamlet',
							qualifier: null
						},
						{
							model: 'character',
							uuid: FIRST_PLAYER_CHARACTER_UUID,
							name: 'Player King',
							qualifier: null
						}
					]
				}
			];

			const { cast } = hamletAlmeidaProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Hamlet at Novello Theatre (production)', () => {

		it('includes cast with Patrick Stewart as Ghost of King Hamlet under same name as in playtext (Ghost of King Hamlet)', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: DAVID_TENNANT_PERSON_UUID,
					name: 'David Tennant',
					roles: [
						{
							model: 'character',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Hamlet, Prince of Denmark',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: PATRICK_STEWART_PERSON_UUID,
					name: 'Patrick Stewart',
					roles: [
						{
							model: 'character',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'Claudius, King of Denmark',
							qualifier: null
						},
						{
							model: 'character',
							uuid: GHOST_CHARACTER_UUID,
							name: 'Ghost',
							qualifier: null
						}
					]
				}
			];

			const { cast } = hamletNovelloProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Hamlet at Wyndham\'s Theatre (production)', () => {

		it('includes cast with Peter Eyre as Ghost of King Hamlet under a variant name (King Hamlet)', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: JUDE_LAW_PERSON_UUID,
					name: 'Jude Law',
					roles: [
						{
							model: 'character',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Hamlet, Prince of Denmark',
							qualifier: null
						}
					]
				},
				{
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
				}
			];

			const { cast } = hamletWyndhamsProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('David Rintoul (person)', () => {

		it('includes production with his portrayal of Ghost of King Hamlet under a variant name (Ghost)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HAMLET_ALMEIDA_PRODUCTION_UUID,
					name: 'Hamlet',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: GHOST_CHARACTER_UUID,
							name: 'Ghost of King Hamlet',
							qualifier: null
						},
						{
							model: 'character',
							uuid: FIRST_PLAYER_CHARACTER_UUID,
							name: 'Player King',
							qualifier: null
						}
					]
				}
			];

			const { productions } = davidRintoulPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Patrick Stewart (person)', () => {

		it('includes production with his portrayal of Ghost of King Hamlet under same name as in playtext (Ghost of King Hamlet)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HAMLET_NOVELLO_PRODUCTION_UUID,
					name: 'Hamlet',
					theatre: {
						model: 'theatre',
						uuid: NOVELLO_THEATRE_UUID,
						name: 'Novello Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'Claudius, King of Denmark',
							qualifier: null
						},
						{
							model: 'character',
							uuid: GHOST_CHARACTER_UUID,
							name: 'Ghost',
							qualifier: null
						}
					]
				}
			];

			const { productions } = patrickStewartPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Peter Eyre (person)', () => {

		it('includes production with his portrayal of Ghost of King Hamlet under a variant name (King Hamlet)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HAMLET_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hamlet',
					theatre: {
						model: 'theatre',
						uuid: WYNDHAMS_THEATRE_UUID,
						name: 'Wyndham\'s Theatre',
						surTheatre: null
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
				}
			];

			const { productions } = peterEyrePerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

});

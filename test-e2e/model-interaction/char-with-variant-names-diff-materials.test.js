import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character with variant names from productions of different materials', () => {

	chai.use(chaiHttp);

	const HAMLET_MATERIAL_UUID = '4';
	const HAMLET_CHARACTER_UUID = '6';
	const CLAUDIUS_CHARACTER_UUID = '7';
	const ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_MATERIAL_UUID = '12';
	const FORTINBRAS_MATERIAL_UUID = '20';
	const HAMLETMACHINE_MATERIAL_UUID = '28';
	const HAMLET_NATIONAL_PRODUCTION_UUID = '32';
	const NATIONAL_THEATRE_UUID = '34';
	const RORY_KINNEAR_PERSON_UUID = '35';
	const PATRICK_MALAHIDE_PERSON_UUID = '36';
	const ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_HAYMARKET_PRODUCTION_UUID = '37';
	const THEATRE_ROYAL_HAYMARKET_THEATRE_UUID = '39';
	const JACK_HAWKINS_PERSON_UUID = '40';
	const JAMES_SIMMONS_PERSON_UUID = '41';
	const FORTINBRAS_LA_JOLLA_PRODUCTION_UUID = '42';
	const LA_JOLLA_PLAYHOUSE_THEATRE_UUID = '44';
	const DON_REILLY_PERSON_UUID = '45';
	const JONATHAN_FREEMAN_PERSON_UUID = '46';
	const HAMLETMACHINE_TEATRO_SAN_NICOLÒ_PRODUCTION_UUID = '47';
	const TEATRO_SAN_NICOLÒ_THEATRE_UUID = '49';
	const GABRIELE_CICIRELLO_PERSON_UUID = '50';
	const RENATO_CIVELLO_PERSON_UUID = '51';

	let hamletCharacter;
	let hamletNationalProduction;
	let rosencrantzAndGuildensternAreDeadHaymarketProduction;
	let fortinbrasLaJollaProduction;
	let hamletmachineTetroSanNicolòProduction;
	let roryKinnearPerson;
	let jackHawkinsPerson;
	let donReillyPerson;
	let gabrieleCicirelloPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Hamlet',
				format: 'play',
				characterGroups: [
					{
						characters: [
							{
								name: 'Hamlet'
							},
							{
								name: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Rosencrantz and Guildenstern Are Dead',
				format: 'play',
				characterGroups: [
					{
						characters: [
							{
								name: 'Hamlet'
							},
							{
								name: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Fortinbras',
				format: 'play',
				characterGroups: [
					{
						characters: [
							{
								name: 'Hamlet'
							},
							{
								name: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Hamletmachine',
				format: 'play',
				characterGroups: [
					{
						characters: [
							{
								name: 'Hamlet'
							},
							{
								name: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamlet',
				material: {
					name: 'Hamlet'
				},
				theatre: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Rory Kinnear',
						roles: [
							{
								name: 'Hamlet, Prince of Denmark',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'Patrick Malahide',
						roles: [
							{
								name: 'Claudius, King of Denmark',
								characterName: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Rosencrantz and Guildenstern Are Dead',
				material: {
					name: 'Rosencrantz and Guildenstern Are Dead'
				},
				theatre: {
					name: 'Theatre Royal Haymarket'
				},
				cast: [
					{
						name: 'Jack Hawkins',
						roles: [
							{
								name: 'Prince Hamlet',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'James Simmons',
						roles: [
							{
								name: 'King Claudius',
								characterName: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Fortinbras',
				material: {
					name: 'Fortinbras'
				},
				theatre: {
					name: 'La Jolla Playhouse'
				},
				cast: [
					{
						name: 'Don Reilly',
						roles: [
							{
								name: 'Spirit of Hamlet',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'Jonathan Freeman',
						roles: [
							{
								name: 'Spirit of Claudius',
								characterName: 'Claudius'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hamletmachine',
				material: {
					name: 'Hamletmachine'
				},
				theatre: {
					name: 'Teatro San Nicolò'
				},
				cast: [
					{
						name: 'Gabriele Cicirello',
						roles: [
							{
								name: 'Hamlet, Prince of Denmark',
								characterName: 'Hamlet'
							}
						]
					},
					{
						name: 'Renato Civello',
						roles: [
							{
								name: 'Claudius, King of Denmark',
								characterName: 'Claudius'
							}
						]
					}
				]
			});

		hamletCharacter = await chai.request(app)
			.get(`/characters/${HAMLET_CHARACTER_UUID}`);

		hamletNationalProduction = await chai.request(app)
			.get(`/productions/${HAMLET_NATIONAL_PRODUCTION_UUID}`);

		rosencrantzAndGuildensternAreDeadHaymarketProduction = await chai.request(app)
			.get(`/productions/${ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_HAYMARKET_PRODUCTION_UUID}`);

		fortinbrasLaJollaProduction = await chai.request(app)
			.get(`/productions/${FORTINBRAS_LA_JOLLA_PRODUCTION_UUID}`);

		hamletmachineTetroSanNicolòProduction = await chai.request(app)
			.get(`/productions/${HAMLETMACHINE_TEATRO_SAN_NICOLÒ_PRODUCTION_UUID}`);

		roryKinnearPerson = await chai.request(app)
			.get(`/people/${RORY_KINNEAR_PERSON_UUID}`);

		jackHawkinsPerson = await chai.request(app)
			.get(`/people/${JACK_HAWKINS_PERSON_UUID}`);

		donReillyPerson = await chai.request(app)
			.get(`/people/${DON_REILLY_PERSON_UUID}`);

		gabrieleCicirelloPerson = await chai.request(app)
			.get(`/people/${GABRIELE_CICIRELLO_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Hamlet (character)', () => {

		it('includes materials in which character is depicted', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: FORTINBRAS_MATERIAL_UUID,
					name: 'Fortinbras',
					format: 'play',
					writingCredits: [],
					depictions: []
				},
				{
					model: 'material',
					uuid: HAMLET_MATERIAL_UUID,
					name: 'Hamlet',
					format: 'play',
					writingCredits: [],
					depictions: []
				},
				{
					model: 'material',
					uuid: HAMLETMACHINE_MATERIAL_UUID,
					name: 'Hamletmachine',
					format: 'play',
					writingCredits: [],
					depictions: []
				},
				{
					model: 'material',
					uuid: ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_MATERIAL_UUID,
					name: 'Rosencrantz and Guildenstern Are Dead',
					format: 'play',
					writingCredits: [],
					depictions: []
				}
			];

			const { materials } = hamletCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes distinct variant named portrayals (i.e. portrayals in productions with names different to that in material)', () => {

			const expectedVariantNamedPortrayals = [
				'Hamlet, Prince of Denmark',
				'Prince Hamlet',
				'Spirit of Hamlet'
			];

			const { variantNamedPortrayals } = hamletCharacter.body;

			expect(variantNamedPortrayals).to.deep.equal(expectedVariantNamedPortrayals);

		});

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: FORTINBRAS_LA_JOLLA_PRODUCTION_UUID,
					name: 'Fortinbras',
					theatre: {
						model: 'theatre',
						uuid: LA_JOLLA_PLAYHOUSE_THEATRE_UUID,
						name: 'La Jolla Playhouse',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: DON_REILLY_PERSON_UUID,
							name: 'Don Reilly',
							roleName: 'Spirit of Hamlet',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HAMLET_NATIONAL_PRODUCTION_UUID,
					name: 'Hamlet',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: RORY_KINNEAR_PERSON_UUID,
							name: 'Rory Kinnear',
							roleName: 'Hamlet, Prince of Denmark',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: HAMLETMACHINE_TEATRO_SAN_NICOLÒ_PRODUCTION_UUID,
					name: 'Hamletmachine',
					theatre: {
						model: 'theatre',
						uuid: TEATRO_SAN_NICOLÒ_THEATRE_UUID,
						name: 'Teatro San Nicolò',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: GABRIELE_CICIRELLO_PERSON_UUID,
							name: 'Gabriele Cicirello',
							roleName: 'Hamlet, Prince of Denmark',
							qualifier: null,
							otherRoles: []
						}
					]
				},
				{
					model: 'production',
					uuid: ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_HAYMARKET_PRODUCTION_UUID,
					name: 'Rosencrantz and Guildenstern Are Dead',
					theatre: {
						model: 'theatre',
						uuid: THEATRE_ROYAL_HAYMARKET_THEATRE_UUID,
						name: 'Theatre Royal Haymarket',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: JACK_HAWKINS_PERSON_UUID,
							name: 'Jack Hawkins',
							roleName: 'Prince Hamlet',
							qualifier: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = hamletCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Hamlet at National Theatre (production)', () => {

		it('includes cast with Rory Kinnear as Hamlet and Patrick Malahide as Claudius under variant names', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: RORY_KINNEAR_PERSON_UUID,
					name: 'Rory Kinnear',
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
					uuid: PATRICK_MALAHIDE_PERSON_UUID,
					name: 'Patrick Malahide',
					roles: [
						{
							model: 'character',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'Claudius, King of Denmark',
							qualifier: null
						}
					]
				}
			];

			const { cast } = hamletNationalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Rosencrantz and Guildenstern Are Dead at Theatre Royal Haymarket (production)', () => {

		it('includes cast with Jack Hawkins as Hamlet and James Simmons as Claudius under variant names', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: JACK_HAWKINS_PERSON_UUID,
					name: 'Jack Hawkins',
					roles: [
						{
							model: 'character',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Prince Hamlet',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: JAMES_SIMMONS_PERSON_UUID,
					name: 'James Simmons',
					roles: [
						{
							model: 'character',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'King Claudius',
							qualifier: null
						}
					]
				}
			];

			const { cast } = rosencrantzAndGuildensternAreDeadHaymarketProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Fortinbras at La Jolla Playhouse (production)', () => {

		it('includes cast with Don Reilly as Hamlet and Jonathan Freeman as Claudius under variant names', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: DON_REILLY_PERSON_UUID,
					name: 'Don Reilly',
					roles: [
						{
							model: 'character',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Spirit of Hamlet',
							qualifier: null
						}
					]
				},
				{
					model: 'person',
					uuid: JONATHAN_FREEMAN_PERSON_UUID,
					name: 'Jonathan Freeman',
					roles: [
						{
							model: 'character',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'Spirit of Claudius',
							qualifier: null
						}
					]
				}
			];

			const { cast } = fortinbrasLaJollaProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Hamletmachine at Teatro San Nicolò (production)', () => {

		it('includes cast with Gabriele Cicirello as Hamlet and Renato Civello as Claudius under variant names', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: GABRIELE_CICIRELLO_PERSON_UUID,
					name: 'Gabriele Cicirello',
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
					uuid: RENATO_CIVELLO_PERSON_UUID,
					name: 'Renato Civello',
					roles: [
						{
							model: 'character',
							uuid: CLAUDIUS_CHARACTER_UUID,
							name: 'Claudius, King of Denmark',
							qualifier: null
						}
					]
				}
			];

			const { cast } = hamletmachineTetroSanNicolòProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Rory Kinnear (person)', () => {

		it('includes production with their portrayal of Hamlet under a variant name (Hamlet, Prince of Denmark)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HAMLET_NATIONAL_PRODUCTION_UUID,
					name: 'Hamlet',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Hamlet, Prince of Denmark',
							qualifier: null
						}
					]
				}
			];

			const { productions } = roryKinnearPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Jack Hawkins (person)', () => {

		it('includes production with their portrayal of Hamlet under a variant name (Prince Hamlet)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: ROSENCRANTZ_AND_GUILDENSTERN_ARE_DEAD_HAYMARKET_PRODUCTION_UUID,
					name: 'Rosencrantz and Guildenstern Are Dead',
					theatre: {
						model: 'theatre',
						uuid: THEATRE_ROYAL_HAYMARKET_THEATRE_UUID,
						name: 'Theatre Royal Haymarket',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Prince Hamlet',
							qualifier: null
						}
					]
				}
			];

			const { productions } = jackHawkinsPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Don Reilly (person)', () => {

		it('includes production with their portrayal of Hamlet under a variant name (Spirit of Hamlet)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: FORTINBRAS_LA_JOLLA_PRODUCTION_UUID,
					name: 'Fortinbras',
					theatre: {
						model: 'theatre',
						uuid: LA_JOLLA_PLAYHOUSE_THEATRE_UUID,
						name: 'La Jolla Playhouse',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Spirit of Hamlet',
							qualifier: null
						}
					]
				}
			];

			const { productions } = donReillyPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Gabriele Cicirello (person)', () => {

		it('includes production with their portrayal of Hamlet under a variant name (Hamlet, Prince of Denmark)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: HAMLETMACHINE_TEATRO_SAN_NICOLÒ_PRODUCTION_UUID,
					name: 'Hamletmachine',
					theatre: {
						model: 'theatre',
						uuid: TEATRO_SAN_NICOLÒ_THEATRE_UUID,
						name: 'Teatro San Nicolò',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: HAMLET_CHARACTER_UUID,
							name: 'Hamlet, Prince of Denmark',
							qualifier: null
						}
					]
				}
			];

			const { productions } = gabrieleCicirelloPerson.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

});
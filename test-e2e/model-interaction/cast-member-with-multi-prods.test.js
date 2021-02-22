import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Cast member with multiple production credits', () => {

	chai.use(chaiHttp);

	const THE_GREEKS_ALDWYCH_PRODUCTION_UUID = '0';
	const ALDWYCH_THEATRE_UUID = '2';
	const SUSANNAH_FELLOWS_PERSON_UUID = '3';
	const CITY_OF_ANGELS_PRINCE_OF_WALES_PRODUCTION_UUID = '4';
	const PRINCE_OF_WALES_THEATRE_UUID = '6';
	const ENRON_CHICHESTER_FESTIVAL_PRODUCTION_UUID = '8';
	const CHICHESTER_FESTIVAL_THEATRE_UUID = '10';

	let susannahFellowsPerson;
	let theGreeksAldwychProduction;
	let cityOfAngelsPrinceOfWalesProduction;
	let enronChichesterFestivalProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Greeks',
				theatre: {
					name: 'Aldwych Theatre'
				},
				cast: [
					{
						name: 'Susannah Fellows',
						roles: [
							{
								name: 'Chorus'
							},
							{
								name: 'Trojan slave'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'City of Angels',
				theatre: {
					name: 'Prince of Wales Theatre'
				},
				cast: [
					{
						name: 'Susannah Fellows',
						roles: [
							{
								name: 'Alaura Kingsley'
							},
							{
								name: 'Carla Haywood'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Enron',
				theatre: {
					name: 'Chichester Festival Theatre'
				},
				cast: [
					{
						name: 'Susannah Fellows',
						roles: [
							{
								name: 'Congresswoman'
							},
							{
								name: 'Sheryl Sloman'
							},
							{
								name: 'Irene Gant'
							}
						]
					}
				]
			});

		susannahFellowsPerson = await chai.request(app)
			.get(`/people/${SUSANNAH_FELLOWS_PERSON_UUID}`);

		theGreeksAldwychProduction = await chai.request(app)
			.get(`/productions/${THE_GREEKS_ALDWYCH_PRODUCTION_UUID}`);

		cityOfAngelsPrinceOfWalesProduction = await chai.request(app)
			.get(`/productions/${CITY_OF_ANGELS_PRINCE_OF_WALES_PRODUCTION_UUID}`);

		enronChichesterFestivalProduction = await chai.request(app)
			.get(`/productions/${ENRON_CHICHESTER_FESTIVAL_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Susannah Fellows (person)', () => {

		it('includes productions in which cast member performed (including characters they portrayed)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'production',
					uuid: CITY_OF_ANGELS_PRINCE_OF_WALES_PRODUCTION_UUID,
					name: 'City of Angels',
					theatre: {
						model: 'theatre',
						uuid: PRINCE_OF_WALES_THEATRE_UUID,
						name: 'Prince of Wales Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: null,
							name: 'Alaura Kingsley',
							qualifier: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Carla Haywood',
							qualifier: null
						}
					]
				},
				{
					model: 'production',
					uuid: ENRON_CHICHESTER_FESTIVAL_PRODUCTION_UUID,
					name: 'Enron',
					theatre: {
						model: 'theatre',
						uuid: CHICHESTER_FESTIVAL_THEATRE_UUID,
						name: 'Chichester Festival Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: null,
							name: 'Congresswoman',
							qualifier: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Sheryl Sloman',
							qualifier: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Irene Gant',
							qualifier: null
						}
					]
				},
				{
					model: 'production',
					uuid: THE_GREEKS_ALDWYCH_PRODUCTION_UUID,
					name: 'The Greeks',
					theatre: {
						model: 'theatre',
						uuid: ALDWYCH_THEATRE_UUID,
						name: 'Aldwych Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: null,
							name: 'Chorus',
							qualifier: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Trojan slave',
							qualifier: null
						}
					]
				}
			];

			const { castMemberProductions } = susannahFellowsPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('The Greeks at Aldwych Theatre (production)', () => {

		it('includes Susannah Fellows in its cast (including characters she portrayed)', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: SUSANNAH_FELLOWS_PERSON_UUID,
					name: 'Susannah Fellows',
					roles: [
						{
							model: 'character',
							uuid: null,
							name: 'Chorus',
							qualifier: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Trojan slave',
							qualifier: null
						}
					]
				}
			];

			const { cast } = theGreeksAldwychProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('City of Angels at Prince of Wales Theatre (production)', () => {

		it('includes Susannah Fellows in its cast (including characters she portrayed)', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: SUSANNAH_FELLOWS_PERSON_UUID,
					name: 'Susannah Fellows',
					roles: [
						{
							model: 'character',
							uuid: null,
							name: 'Alaura Kingsley',
							qualifier: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Carla Haywood',
							qualifier: null
						}
					]
				}
			];

			const { cast } = cityOfAngelsPrinceOfWalesProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Enron at Chichester Festival Theatre (production)', () => {

		it('includes Susannah Fellows in its cast (including characters she portrayed)', () => {

			const expectedCast = [
				{
					model: 'person',
					uuid: SUSANNAH_FELLOWS_PERSON_UUID,
					name: 'Susannah Fellows',
					roles: [
						{
							model: 'character',
							uuid: null,
							name: 'Congresswoman',
							qualifier: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Sheryl Sloman',
							qualifier: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Irene Gant',
							qualifier: null
						}
					]
				}
			];

			const { cast } = enronChichesterFestivalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

});

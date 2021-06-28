import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Cast member with multiple production credits', () => {

	chai.use(chaiHttp);

	const THE_GREEKS_ALDWYCH_PRODUCTION_UUID = '0';
	const ALDWYCH_THEATRE_VENUE_UUID = '2';
	const SUSANNAH_FELLOWS_PERSON_UUID = '3';
	const CITY_OF_ANGELS_PRINCE_OF_WALES_PRODUCTION_UUID = '4';
	const PRINCE_OF_WALES_THEATRE_VENUE_UUID = '6';
	const ENRON_CHICHESTER_FESTIVAL_PRODUCTION_UUID = '8';
	const CHICHESTER_FESTIVAL_THEATRE_VENUE_UUID = '10';

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
				startDate: '1980-01-26', // Contrivance because date unavailable.
				pressDate: '1980-02-02',
				endDate: '1980-03-29',
				venue: {
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
				startDate: '1993-03-19',
				pressDate: '1993-03-30',
				endDate: '1993-11-18',
				venue: {
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
				startDate: '2009-07-11',
				pressDate: '2009-07-22',
				endDate: '2009-08-29',
				venue: {
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
					uuid: ENRON_CHICHESTER_FESTIVAL_PRODUCTION_UUID,
					name: 'Enron',
					startDate: '2009-07-11',
					endDate: '2009-08-29',
					venue: {
						model: 'venue',
						uuid: CHICHESTER_FESTIVAL_THEATRE_VENUE_UUID,
						name: 'Chichester Festival Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: null,
							name: 'Congresswoman',
							qualifier: null,
							isAlternate: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Sheryl Sloman',
							qualifier: null,
							isAlternate: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Irene Gant',
							qualifier: null,
							isAlternate: null
						}
					]
				},
				{
					model: 'production',
					uuid: CITY_OF_ANGELS_PRINCE_OF_WALES_PRODUCTION_UUID,
					name: 'City of Angels',
					startDate: '1993-03-19',
					endDate: '1993-11-18',
					venue: {
						model: 'venue',
						uuid: PRINCE_OF_WALES_THEATRE_VENUE_UUID,
						name: 'Prince of Wales Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: null,
							name: 'Alaura Kingsley',
							qualifier: null,
							isAlternate: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Carla Haywood',
							qualifier: null,
							isAlternate: null
						}
					]
				},
				{
					model: 'production',
					uuid: THE_GREEKS_ALDWYCH_PRODUCTION_UUID,
					name: 'The Greeks',
					startDate: '1980-01-26',
					endDate: '1980-03-29',
					venue: {
						model: 'venue',
						uuid: ALDWYCH_THEATRE_VENUE_UUID,
						name: 'Aldwych Theatre',
						surVenue: null
					},
					roles: [
						{
							model: 'character',
							uuid: null,
							name: 'Chorus',
							qualifier: null,
							isAlternate: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Trojan slave',
							qualifier: null,
							isAlternate: null
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
							qualifier: null,
							isAlternate: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Trojan slave',
							qualifier: null,
							isAlternate: null
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
							qualifier: null,
							isAlternate: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Carla Haywood',
							qualifier: null,
							isAlternate: null
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
							qualifier: null,
							isAlternate: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Sheryl Sloman',
							qualifier: null,
							isAlternate: null
						},
						{
							model: 'character',
							uuid: null,
							name: 'Irene Gant',
							qualifier: null,
							isAlternate: null
						}
					]
				}
			];

			const { cast } = enronChichesterFestivalProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

});

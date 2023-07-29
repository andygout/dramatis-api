import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';

describe('Cast member performing same role in different productions of same material', () => {

	chai.use(chaiHttp);

	const TITANIA_CHARACTER_UUID = '5';
	const A_MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID = '6';
	const ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID = '8';
	const JUDI_DENCH_PERSON_UUID = '9';
	const A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID = '10';
	const ROSE_THEATRE_VENUE_UUID = '12';

	let titaniaCharacter;
	let aMidsummerNightsDreamRoyalShakespeareProduction;
	let aMidsummerNightsDreamRoseProduction;
	let judiDenchPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'A Midsummer Night\'s Dream',
				characterGroups: [
					{
						characters: [
							{
								name: 'Titania, Queen of the Fairies'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Midsummer Night\'s Dream',
				startDate: '1962-04-10',
				pressDate: '1962-04-17',
				endDate: '1962-07-20',
				material: {
					name: 'A Midsummer Night\'s Dream'
				},
				venue: {
					name: 'Royal Shakespeare Theatre'
				},
				cast: [
					{
						name: 'Judi Dench',
						roles: [
							{
								name: 'Titania',
								characterName: 'Titania, Queen of the Fairies'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Midsummer Night\'s Dream',
				startDate: '2010-02-09',
				pressDate: '2010-02-15',
				endDate: '2010-03-20',
				material: {
					name: 'A Midsummer Night\'s Dream'
				},
				venue: {
					name: 'Rose Theatre'
				},
				cast: [
					{
						name: 'Judi Dench',
						roles: [
							{
								name: 'Titania, Faerie Queene',
								characterName: 'Titania, Queen of the Fairies'
							}
						]
					}
				]
			});

		titaniaCharacter = await chai.request(app)
			.get(`/characters/${TITANIA_CHARACTER_UUID}`);

		aMidsummerNightsDreamRoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${A_MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		aMidsummerNightsDreamRoseProduction = await chai.request(app)
			.get(`/productions/${A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID}`);

		judiDenchPerson = await chai.request(app)
			.get(`/people/${JUDI_DENCH_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Titania (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					startDate: '2010-02-09',
					endDate: '2010-03-20',
					venue: {
						model: 'VENUE',
						uuid: ROSE_THEATRE_VENUE_UUID,
						name: 'Rose Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: JUDI_DENCH_PERSON_UUID,
							name: 'Judi Dench',
							roleName: 'Titania, Faerie Queene',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					startDate: '1962-04-10',
					endDate: '1962-07-20',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: JUDI_DENCH_PERSON_UUID,
							name: 'Judi Dench',
							roleName: 'Titania',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = titaniaCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('A Midsummer Night\'s Dream at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Judi Dench as Titania, Queen of the Fairies under a variant name (Titania)', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: JUDI_DENCH_PERSON_UUID,
					name: 'Judi Dench',
					roles: [
						{
							model: 'CHARACTER',
							uuid: TITANIA_CHARACTER_UUID,
							name: 'Titania',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = aMidsummerNightsDreamRoyalShakespeareProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('A Midsummer Night\'s Dream at Rose Theatre (production)', () => {

		it('includes cast with Judi Dench as Titania, Queen of the Fairies under a variant name (Titania, Faerie Queene)', () => {

			const expectedCast = [
				{
					model: 'PERSON',
					uuid: JUDI_DENCH_PERSON_UUID,
					name: 'Judi Dench',
					roles: [
						{
							model: 'CHARACTER',
							uuid: TITANIA_CHARACTER_UUID,
							name: 'Titania, Faerie Queene',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { cast } = aMidsummerNightsDreamRoseProduction.body;

			expect(cast).to.deep.equal(expectedCast);

		});

	});

	describe('Judi Dench (person)', () => {

		it('includes production with her respective portrayals of Titania', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					startDate: '2010-02-09',
					endDate: '2010-03-20',
					venue: {
						model: 'VENUE',
						uuid: ROSE_THEATRE_VENUE_UUID,
						name: 'Rose Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: TITANIA_CHARACTER_UUID,
							name: 'Titania, Faerie Queene',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					startDate: '1962-04-10',
					endDate: '1962-07-20',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: TITANIA_CHARACTER_UUID,
							name: 'Titania',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = judiDenchPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

});

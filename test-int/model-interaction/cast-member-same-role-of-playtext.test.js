import chai from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../server/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Cast member performing same role in different productions of same playtext', () => {

	const TITANIA_CHARACTER_UUID = '1';
	const MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID = '2';
	const ROYAL_SHAKESPEARE_THEATRE_UUID = '3';
	const JUDI_DENCH_PERSON_UUID = '5';
	const MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID = '6';
	const ROSE_THEATRE_UUID = '7';

	let titaniaCharacter;
	let midsummerNightsDreamRoyalShakespeareProduction;
	let midsummerNightsDreamRoseProduction;
	let judiDenchPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'A Midsummer Night\'s Dream',
				characters: [
					{
						name: 'Titania, Queen of the Fairies'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Midsummer Night\'s Dream',
				theatre: {
					name: 'Royal Shakespeare Theatre'
				},
				playtext: {
					name: 'A Midsummer Night\'s Dream'
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
				theatre: {
					name: 'Rose Theatre'
				},
				playtext: {
					name: 'A Midsummer Night\'s Dream'
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

		midsummerNightsDreamRoyalShakespeareProduction = await chai.request(app)
			.get(`/productions/${MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID}`);

		midsummerNightsDreamRoseProduction = await chai.request(app)
			.get(`/productions/${MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID}`);

		judiDenchPerson = await chai.request(app)
			.get(`/people/${JUDI_DENCH_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Titania (character)', () => {

		it('includes productions in which character was portrayed (including performers who portrayed them)', () => {

			const expectedMidsummerNightsDreamRoyalShakespeareProduction = {
				model: 'production',
				uuid: MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
				name: 'A Midsummer Night\'s Dream',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
					name: 'Royal Shakespeare Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: JUDI_DENCH_PERSON_UUID,
						name: 'Judi Dench',
						role: {
							name: 'Titania'
						},
						otherRoles: []
					}
				]
			};

			const expectedMidsummerNightsDreamRoseProduction = {
				model: 'production',
				uuid: MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID,
				name: 'A Midsummer Night\'s Dream',
				theatre: {
					model: 'theatre',
					uuid: ROSE_THEATRE_UUID,
					name: 'Rose Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: JUDI_DENCH_PERSON_UUID,
						name: 'Judi Dench',
						role: {
							name: 'Titania, Faerie Queene'
						},
						otherRoles: []
					}
				]
			};

			const { productions } = titaniaCharacter.body;

			const midsummerNightsDreamRoyalShakespeareProductionCredit =
				productions.find(production =>
					production.uuid === MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID
				);

			const midsummerNightsDreamRoseProductionCredit =
				productions.find(production =>
					production.uuid === MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID
				);

			expect(productions.length).to.equal(2);
			expect(expectedMidsummerNightsDreamRoyalShakespeareProduction)
				.to.deep.equal(midsummerNightsDreamRoyalShakespeareProductionCredit);
			expect(expectedMidsummerNightsDreamRoseProduction).to.deep.equal(midsummerNightsDreamRoseProductionCredit);

		});

	});

	describe('A Midsummer Night\'s Dream at Royal Shakespeare Theatre (production)', () => {

		it('includes cast with Judi Dench as Titania, Queen of the Fairies under a variant name (Titania)', () => {

			const expectedCastMemberJudiDench = {
				model: 'person',
				uuid: JUDI_DENCH_PERSON_UUID,
				name: 'Judi Dench',
				roles: [
					{
						model: 'character',
						uuid: TITANIA_CHARACTER_UUID,
						name: 'Titania'
					}
				]
			};

			const { cast } = midsummerNightsDreamRoyalShakespeareProduction.body;

			const castMemberJudiDench = cast.find(castMember => castMember.uuid === JUDI_DENCH_PERSON_UUID);

			expect(cast.length).to.equal(1);
			expect(castMemberJudiDench).to.deep.equal(expectedCastMemberJudiDench);

		});

	});

	describe('A Midsummer Night\'s Dream at Rose Theatre (production)', () => {

		it('includes cast with Judi Dench as Titania, Queen of the Fairies under a variant name (Titania, Faerie Queene)', () => {

			const expectedCastMemberJudiDench = {
				model: 'person',
				uuid: JUDI_DENCH_PERSON_UUID,
				name: 'Judi Dench',
				roles: [
					{
						model: 'character',
						uuid: TITANIA_CHARACTER_UUID,
						name: 'Titania, Faerie Queene'
					}
				]
			};

			const { cast } = midsummerNightsDreamRoseProduction.body;

			const castMemberJudiDench = cast.find(castMember => castMember.uuid === JUDI_DENCH_PERSON_UUID);

			expect(cast.length).to.equal(1);
			expect(castMemberJudiDench).to.deep.equal(expectedCastMemberJudiDench);

		});

	});

	describe('Judi Dench (person)', () => {

		it('includes production with her respective portrayals of Titania', () => {

			const expectedmidsummerNightsDreamRoyalShakespeareProductionCredit = {
				model: 'production',
				uuid: MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
				name: 'A Midsummer Night\'s Dream',
				theatre: {
					model: 'theatre',
					uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
					name: 'Royal Shakespeare Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: TITANIA_CHARACTER_UUID,
						name: 'Titania'
					}
				]
			};

			const expectedmidsummerNightsDreamRoseProductionCredit = {
				model: 'production',
				uuid: MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID,
				name: 'A Midsummer Night\'s Dream',
				theatre: {
					model: 'theatre',
					uuid: ROSE_THEATRE_UUID,
					name: 'Rose Theatre'
				},
				roles: [
					{
						model: 'character',
						uuid: TITANIA_CHARACTER_UUID,
						name: 'Titania, Faerie Queene'
					}
				]
			};

			const { productions } = judiDenchPerson.body;

			const midsummerNightsDreamRoyalShakespeareProductionCredit =
				productions.find(production =>
					production.uuid === MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID
				);

			const midsummerNightsDreamRoseProductionCredit =
				productions.find(production => production.uuid === MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID);

			expect(productions.length).to.equal(2);
			expect(expectedmidsummerNightsDreamRoyalShakespeareProductionCredit)
				.to.deep.equal(midsummerNightsDreamRoyalShakespeareProductionCredit);
			expect(expectedmidsummerNightsDreamRoseProductionCredit)
				.to.deep.equal(midsummerNightsDreamRoseProductionCredit);

		});

	});

});

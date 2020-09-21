import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Cast member performing same role in different productions of same playtext', () => {

	chai.use(chaiHttp);

	const TITANIA_CHARACTER_UUID = '3';
	const A_MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID = '4';
	const ROYAL_SHAKESPEARE_THEATRE_UUID = '5';
	const JUDI_DENCH_PERSON_UUID = '7';
	const A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID = '8';
	const ROSE_THEATRE_UUID = '9';

	let titaniaCharacter;
	let aMidsummerNightsDreamRoyalShakespeareProduction;
	let aMidsummerNightsDreamRoseProduction;
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

			const expectedAMidsummerNightsDreamRoyalShakespeareProduction = {
				model: 'production',
				uuid: A_MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
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
						roleName: 'Titania',
						qualifier: null,
						otherRoles: []
					}
				]
			};

			const expectedAMidsummerNightsDreamRoseProduction = {
				model: 'production',
				uuid: A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID,
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
						roleName: 'Titania, Faerie Queene',
						qualifier: null,
						otherRoles: []
					}
				]
			};

			const { productions } = titaniaCharacter.body;

			const aMidsummerNightsDreamRoyalShakespeareProduction =
				productions.find(production => production.uuid === A_MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID);

			const aMidsummerNightsDreamRoseProduction =
				productions.find(production => production.uuid === A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID);

			expect(productions.length).to.equal(2);
			expect(aMidsummerNightsDreamRoyalShakespeareProduction)
				.to.deep.equal(expectedAMidsummerNightsDreamRoyalShakespeareProduction);
			expect(aMidsummerNightsDreamRoseProduction).to.deep.equal(expectedAMidsummerNightsDreamRoseProduction);

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
						name: 'Titania',
						qualifier: null
					}
				]
			};

			const { cast } = aMidsummerNightsDreamRoyalShakespeareProduction.body;

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
						name: 'Titania, Faerie Queene',
						qualifier: null
					}
				]
			};

			const { cast } = aMidsummerNightsDreamRoseProduction.body;

			const castMemberJudiDench = cast.find(castMember => castMember.uuid === JUDI_DENCH_PERSON_UUID);

			expect(cast.length).to.equal(1);
			expect(castMemberJudiDench).to.deep.equal(expectedCastMemberJudiDench);

		});

	});

	describe('Judi Dench (person)', () => {

		it('includes production with her respective portrayals of Titania', () => {

			const expectedAMidsummerNightsDreamRoyalShakespeareProduction = {
				model: 'production',
				uuid: A_MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
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
						name: 'Titania',
						qualifier: null
					}
				]
			};

			const expectedAMidsummerNightsDreamRoseProduction = {
				model: 'production',
				uuid: A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID,
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
						name: 'Titania, Faerie Queene',
						qualifier: null
					}
				]
			};

			const { productions } = judiDenchPerson.body;

			const aMidsummerNightsDreamRoyalShakespeareProduction =
				productions.find(production =>
					production.uuid === A_MIDSUMMER_NIGHTS_DREAM_ROYAL_SHAKESPEARE_PRODUCTION_UUID
				);

			const aMidsummerNightsDreamRoseProduction =
				productions.find(production => production.uuid === A_MIDSUMMER_NIGHTS_DREAM_ROSE_PRODUCTION_UUID);

			expect(productions.length).to.equal(2);
			expect(aMidsummerNightsDreamRoyalShakespeareProduction)
				.to.deep.equal(expectedAMidsummerNightsDreamRoyalShakespeareProduction);
			expect(aMidsummerNightsDreamRoseProduction).to.deep.equal(expectedAMidsummerNightsDreamRoseProduction);

		});

	});

});

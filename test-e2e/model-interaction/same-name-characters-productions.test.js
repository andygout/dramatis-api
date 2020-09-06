import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Different characters with same name production credits', () => {

	chai.use(chaiHttp);

	const DEMETRIUS_CHARACTER_1_UUID = '5';
	const DEMETRIUS_CHARACTER_2_UUID = '10';
	const A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID = '12';
	const NOVELLO_THEATRE_UUID = '13';
	const OSCAR_PEARCE_PERSON_UUID = '15';
	const TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID = '17';
	const GLOBE_THEATRE_UUID = '18';
	const SAM_ALEXANDER_PERSON_UUID = '21';

	let demetriusCharacter1;
	let demetriusCharacter2;

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
						name: 'Lysander'
					},
					{
						name: 'Demetrius',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Titus Andronicus',
				characters: [
					{
						name: 'Demetrius',
						differentiator: '2'
					},
					{
						name: 'Chiron'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Midsummer Night\'s Dream',
				theatre: {
					name: 'Novello Theatre'
				},
				playtext: {
					name: 'A Midsummer Night\'s Dream'
				},
				cast: [
					{
						name: 'Oscar Pearce',
						roles: [
							{
								name: 'Demetrius'
							}
						]
					},
					{
						name: 'Trystan Gravelle',
						roles: [
							{
								name: 'Lysander'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Titus Andronicus',
				theatre: {
					name: 'Shakespeare\'s Globe'
				},
				playtext: {
					name: 'Titus Andronicus'
				},
				cast: [
					{
						name: 'Richard Riddell',
						roles: [
							{
								name: 'Chiron'
							}
						]
					},
					{
						name: 'Sam Alexander',
						roles: [
							{
								name: 'Demetrius'
							}
						]
					}
				]
			});

		demetriusCharacter1 = await chai.request(app)
			.get(`/characters/${DEMETRIUS_CHARACTER_1_UUID}`);

		demetriusCharacter2 = await chai.request(app)
			.get(`/characters/${DEMETRIUS_CHARACTER_2_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Demetrius (character) (#1)', () => {

		it('includes productions in which character was portrayed (i.e. excludes productions of different character with same name)', () => {

			const expectedAMidsummerNightsDreamNovelloProductionCredit = {
				model: 'production',
				uuid: A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID,
				name: 'A Midsummer Night\'s Dream',
				theatre: {
					model: 'theatre',
					uuid: NOVELLO_THEATRE_UUID,
					name: 'Novello Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: OSCAR_PEARCE_PERSON_UUID,
						name: 'Oscar Pearce',
						roleName: 'Demetrius',
						qualifier: null,
						otherRoles: []
					}
				]
			};

			const { productions } = demetriusCharacter1.body;

			const aMidsummerNightsDreamNovelloProductionCredit =
				productions.find(production => production.uuid === A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(expectedAMidsummerNightsDreamNovelloProductionCredit)
				.to.deep.equal(aMidsummerNightsDreamNovelloProductionCredit);

		});

	});

	describe('Demetrius (character) (#2)', () => {

		it('includes productions in which character was portrayed (i.e. excludes productions of different character with same name)', () => {

			const expectedTitusAndronicusGlobeProductionCredit = {
				model: 'production',
				uuid: TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID,
				name: 'Titus Andronicus',
				theatre: {
					model: 'theatre',
					uuid: GLOBE_THEATRE_UUID,
					name: 'Shakespeare\'s Globe'
				},
				performers: [
					{
						model: 'person',
						uuid: SAM_ALEXANDER_PERSON_UUID,
						name: 'Sam Alexander',
						roleName: 'Demetrius',
						qualifier: null,
						otherRoles: []
					}
				]
			};

			const { productions } = demetriusCharacter2.body;

			const titusAndronicusGlobeProductionCredit =
				productions.find(production => production.uuid === TITUS_ANDRONICUS_GLOBE_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(expectedTitusAndronicusGlobeProductionCredit)
				.to.deep.equal(titusAndronicusGlobeProductionCredit);

		});

	});

});

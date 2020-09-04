import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character portrayed with other roles', () => {

	chai.use(chaiHttp);

	const JOEYS_MOTHER_CHARACTER_UUID = '8';
	const DR_SCHWEYK_CHARACTER_UUID = '9';
	const COCO_CHARACTER_UUID = '10';
	const GEORDIE_CHARACTER_UUID = '11';
	const WAR_HORSE_NATIONAL_PRODUCTION_UUID = '12';
	const NATIONAL_THEATRE_UUID = '13';
	const STEPHEN_HARPER_PERSON_UUID = '16';

	let joeysMotherCharacter;
	let drSchweykCharacter;
	let cocoCharacter;
	let geordieCharacter;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'War Horse',
				characters: [
					{
						name: 'Major Nicholls'
					},
					{
						name: 'Joey\'s mother'
					},
					{
						name: 'Dr Schweyk'
					},
					{
						name: 'Coco'
					},
					{
						name: 'Geordie'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'War Horse',
				theatre: {
					name: 'National Theatre'
				},
				playtext: {
					name: 'War Horse'
				},
				cast: [
					{
						name: 'Jamie Ballard',
						roles: [
							{
								name: 'Major Nicholls'
							}
						]
					},
					{
						name: 'Stephen Harper',
						roles: [
							{
								name: 'Joey\'s mother'
							},
							{
								name: 'Dr Schweyk'
							},
							{
								name: 'Coco'
							},
							{
								name: 'Geordie'
							}
						]
					}
				]
			});

		joeysMotherCharacter = await chai.request(app)
			.get(`/characters/${JOEYS_MOTHER_CHARACTER_UUID}`);

		drSchweykCharacter = await chai.request(app)
			.get(`/characters/${DR_SCHWEYK_CHARACTER_UUID}`);

		cocoCharacter = await chai.request(app)
			.get(`/characters/${COCO_CHARACTER_UUID}`);

		geordieCharacter = await chai.request(app)
			.get(`/characters/${GEORDIE_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Joey\'s mother (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedWarHorseNationalProductionCredit = {
				model: 'production',
				uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
				name: 'War Horse',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: STEPHEN_HARPER_PERSON_UUID,
						name: 'Stephen Harper',
						roleName: 'Joey\'s mother',
						otherRoles: [
							{
								model: 'character',
								uuid: DR_SCHWEYK_CHARACTER_UUID,
								name: 'Dr Schweyk'
							},
							{
								model: 'character',
								uuid: COCO_CHARACTER_UUID,
								name: 'Coco'
							},
							{
								model: 'character',
								uuid: GEORDIE_CHARACTER_UUID,
								name: 'Geordie'
							}
						]
					}
				]
			};

			const { productions } = joeysMotherCharacter.body;

			const warHorseNationalProductionCredit =
				productions.find(production => production.uuid === WAR_HORSE_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(expectedWarHorseNationalProductionCredit).to.deep.equal(warHorseNationalProductionCredit);

		});

	});

	describe('Dr Schweyk (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedWarHorseNationalProductionCredit = {
				model: 'production',
				uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
				name: 'War Horse',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: STEPHEN_HARPER_PERSON_UUID,
						name: 'Stephen Harper',
						roleName: 'Dr Schweyk',
						otherRoles: [
							{
								model: 'character',
								uuid: JOEYS_MOTHER_CHARACTER_UUID,
								name: 'Joey\'s mother'
							},
							{
								model: 'character',
								uuid: COCO_CHARACTER_UUID,
								name: 'Coco'
							},
							{
								model: 'character',
								uuid: GEORDIE_CHARACTER_UUID,
								name: 'Geordie'
							}
						]
					}
				]
			};

			const { productions } = drSchweykCharacter.body;

			const warHorseNationalProductionCredit =
				productions.find(production => production.uuid === WAR_HORSE_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(expectedWarHorseNationalProductionCredit).to.deep.equal(warHorseNationalProductionCredit);

		});

	});

	describe('Coco (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedWarHorseNationalProductionCredit = {
				model: 'production',
				uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
				name: 'War Horse',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: STEPHEN_HARPER_PERSON_UUID,
						name: 'Stephen Harper',
						roleName: 'Coco',
						otherRoles: [
							{
								model: 'character',
								uuid: JOEYS_MOTHER_CHARACTER_UUID,
								name: 'Joey\'s mother'
							},
							{
								model: 'character',
								uuid: DR_SCHWEYK_CHARACTER_UUID,
								name: 'Dr Schweyk'
							},
							{
								model: 'character',
								uuid: GEORDIE_CHARACTER_UUID,
								name: 'Geordie'
							}
						]
					}
				]
			};

			const { productions } = cocoCharacter.body;

			const warHorseNationalProductionCredit =
				productions.find(production => production.uuid === WAR_HORSE_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(expectedWarHorseNationalProductionCredit).to.deep.equal(warHorseNationalProductionCredit);

		});

	});

	describe('Geordie (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedWarHorseNationalProductionCredit = {
				model: 'production',
				uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
				name: 'War Horse',
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				},
				performers: [
					{
						model: 'person',
						uuid: STEPHEN_HARPER_PERSON_UUID,
						name: 'Stephen Harper',
						roleName: 'Geordie',
						otherRoles: [
							{
								model: 'character',
								uuid: JOEYS_MOTHER_CHARACTER_UUID,
								name: 'Joey\'s mother'
							},
							{
								model: 'character',
								uuid: DR_SCHWEYK_CHARACTER_UUID,
								name: 'Dr Schweyk'
							},
							{
								model: 'character',
								uuid: COCO_CHARACTER_UUID,
								name: 'Coco'
							}
						]
					}
				]
			};

			const { productions } = geordieCharacter.body;

			const warHorseNationalProductionCredit =
				productions.find(production => production.uuid === WAR_HORSE_NATIONAL_PRODUCTION_UUID);

			expect(productions.length).to.equal(1);
			expect(expectedWarHorseNationalProductionCredit).to.deep.equal(warHorseNationalProductionCredit);

		});

	});

});

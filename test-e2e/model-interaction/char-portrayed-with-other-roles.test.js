import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Character portrayed with other roles', () => {

	chai.use(chaiHttp);

	const JOEYS_MOTHER_CHARACTER_UUID = '10';
	const DR_SCHWEYK_CHARACTER_UUID = '11';
	const COCO_CHARACTER_UUID = '12';
	const GEORDIE_CHARACTER_UUID = '13';
	const WAR_HORSE_NATIONAL_PRODUCTION_UUID = '14';
	const NATIONAL_THEATRE_UUID = '16';
	const STEPHEN_HARPER_PERSON_UUID = '18';

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
			.post('/materials')
			.send({
				name: 'War Horse',
				characterGroups: [
					{
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
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'War Horse',
				startDate: '2007-10-09',
				pressDate: '2007-10-17',
				endDate: '2008-02-14',
				material: {
					name: 'War Horse'
				},
				theatre: {
					name: 'National Theatre'
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

			const expectedProductions = [
				{
					model: 'production',
					uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
					name: 'War Horse',
					startDate: '2007-10-09',
					endDate: '2008-02-14',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: STEPHEN_HARPER_PERSON_UUID,
							name: 'Stephen Harper',
							roleName: 'Joey\'s mother',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: DR_SCHWEYK_CHARACTER_UUID,
									name: 'Dr Schweyk',
									qualifier: null
								},
								{
									model: 'character',
									uuid: COCO_CHARACTER_UUID,
									name: 'Coco',
									qualifier: null
								},
								{
									model: 'character',
									uuid: GEORDIE_CHARACTER_UUID,
									name: 'Geordie',
									qualifier: null
								}
							]
						}
					]
				}
			];

			const { productions } = joeysMotherCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Dr Schweyk (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
					name: 'War Horse',
					startDate: '2007-10-09',
					endDate: '2008-02-14',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: STEPHEN_HARPER_PERSON_UUID,
							name: 'Stephen Harper',
							roleName: 'Dr Schweyk',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: JOEYS_MOTHER_CHARACTER_UUID,
									name: 'Joey\'s mother',
									qualifier: null
								},
								{
									model: 'character',
									uuid: COCO_CHARACTER_UUID,
									name: 'Coco',
									qualifier: null
								},
								{
									model: 'character',
									uuid: GEORDIE_CHARACTER_UUID,
									name: 'Geordie',
									qualifier: null
								}
							]
						}
					]
				}
			];

			const { productions } = drSchweykCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Coco (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
					name: 'War Horse',
					startDate: '2007-10-09',
					endDate: '2008-02-14',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: STEPHEN_HARPER_PERSON_UUID,
							name: 'Stephen Harper',
							roleName: 'Coco',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: JOEYS_MOTHER_CHARACTER_UUID,
									name: 'Joey\'s mother',
									qualifier: null
								},
								{
									model: 'character',
									uuid: DR_SCHWEYK_CHARACTER_UUID,
									name: 'Dr Schweyk',
									qualifier: null
								},
								{
									model: 'character',
									uuid: GEORDIE_CHARACTER_UUID,
									name: 'Geordie',
									qualifier: null
								}
							]
						}
					]
				}
			];

			const { productions } = cocoCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Geordie (character)', () => {

		it('includes performers who portrayed them and the other roles they also played', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: WAR_HORSE_NATIONAL_PRODUCTION_UUID,
					name: 'War Horse',
					startDate: '2007-10-09',
					endDate: '2008-02-14',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: STEPHEN_HARPER_PERSON_UUID,
							name: 'Stephen Harper',
							roleName: 'Geordie',
							qualifier: null,
							otherRoles: [
								{
									model: 'character',
									uuid: JOEYS_MOTHER_CHARACTER_UUID,
									name: 'Joey\'s mother',
									qualifier: null
								},
								{
									model: 'character',
									uuid: DR_SCHWEYK_CHARACTER_UUID,
									name: 'Dr Schweyk',
									qualifier: null
								},
								{
									model: 'character',
									uuid: COCO_CHARACTER_UUID,
									name: 'Coco',
									qualifier: null
								}
							]
						}
					]
				}
			];

			const { productions } = geordieCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

});

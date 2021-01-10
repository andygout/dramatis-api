import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Materials with source material', () => {

	chai.use(chaiHttp);

	const A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID = '3';
	const WILLIAM_SHAKESPEARE_PERSON_UUID = '5';
	const THE_INDIAN_BOY_MATERIAL_UUID = '11';
	const RONA_MUNRO_PERSON_UUID = '13';
	const THE_INDIAN_BOY_CHARACTER_UUID = '15';
	const THE_INDIAN_BOY_ROYAL_SHAKESPEARE_THEATRE_PRODUCTION_UUID = '16';
	const ROYAL_SHAKESPEARE_THEATRE_UUID = '18';

	let theIndianBoyMaterial;
	let aMidsummerNightsDreamMaterial;
	let ronaMunroPerson;
	let williamShakespearePerson;
	let theIndianBoyRoyalShakespeareTheatreProduction;
	let theIndianBoyCharacter;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'A Midsummer Night\'s Dream',
				format: 'play',
				writingCredits: [
					{
						writingEntities: [
							{
								name: 'William Shakespeare'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Indian Boy',
				format: 'play',
				writingCredits: [
					{
						writingEntities: [
							{
								name: 'Rona Munro'
							}
						]
					},
					{
						name: 'inspired by',
						writingEntities: [
							{
								model: 'material',
								name: 'A Midsummer Night\'s Dream'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'The Indian Boy'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Indian Boy',
				material: {
					name: 'The Indian Boy'
				},
				theatre: {
					name: 'Royal Shakespeare Theatre'
				}
			});

		theIndianBoyMaterial = await chai.request(app)
			.get(`/materials/${THE_INDIAN_BOY_MATERIAL_UUID}`);

		aMidsummerNightsDreamMaterial = await chai.request(app)
			.get(`/materials/${A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID}`);

		ronaMunroPerson = await chai.request(app)
			.get(`/people/${RONA_MUNRO_PERSON_UUID}`);

		williamShakespearePerson = await chai.request(app)
			.get(`/people/${WILLIAM_SHAKESPEARE_PERSON_UUID}`);

		theIndianBoyRoyalShakespeareTheatreProduction = await chai.request(app)
			.get(`/productions/${THE_INDIAN_BOY_ROYAL_SHAKESPEARE_THEATRE_PRODUCTION_UUID}`);

		theIndianBoyCharacter = await chai.request(app)
			.get(`/characters/${THE_INDIAN_BOY_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Indian Boy (material)', () => {

		it('includes writers of this material and its source material grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'writingCredit',
					name: 'by',
					writingEntities: [
						{
							model: 'person',
							uuid: RONA_MUNRO_PERSON_UUID,
							name: 'Rona Munro',
							format: null,
							sourceMaterialWritingCredits: []
						}
					]
				},
				{
					model: 'writingCredit',
					name: 'inspired by',
					writingEntities: [
						{
							model: 'material',
							uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
							name: 'A Midsummer Night\'s Dream',
							format: 'play',
							sourceMaterialWritingCredits: [
								{
									model: 'writingCredit',
									name: 'by',
									writingEntities: [
										{
											model: 'person',
											uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
											name: 'William Shakespeare'
										}
									]
								}
							]
						}
					]
				}
			];

			const { writingCredits } = theIndianBoyMaterial.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('A Midsummer Night\'s Dream (material)', () => {

		it('includes materials that used it as source material (in which their uuid is nullified), with corresponding writers', () => {

			const expectedSourcingMaterials = [
				{
					model: 'material',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro',
									format: null
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'inspired by',
							writingEntities: [
								{
									model: 'material',
									uuid: null,
									name: 'A Midsummer Night\'s Dream',
									format: 'play'
								}
							]
						}
					]
				}
			];

			const { sourcingMaterials } = aMidsummerNightsDreamMaterial.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of materials that used it as source material', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'production',
					uuid: THE_INDIAN_BOY_ROYAL_SHAKESPEARE_THEATRE_PRODUCTION_UUID,
					name: 'The Indian Boy',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					}
				}
			];

			const { sourcingMaterialProductions } = aMidsummerNightsDreamMaterial.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('Rona Munro (person)', () => {

		it('includes materials they have written (in which their uuid is nullified), with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'Rona Munro',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'inspired by',
							writingEntities: [
								{
									model: 'material',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									sourceMaterialWritingCredits: [
										{
											model: 'writingCredit',
											name: 'by',
											writingEntities: [
												{
													model: 'person',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { materials } = ronaMunroPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('William Shakespeare (person)', () => {

		it('includes materials that used their work as source material, with corresponding writers', () => {

			const expectedSourcingMaterials = [
				{
					model: 'material',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro',
									format: null
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'inspired by',
							writingEntities: [
								{
									model: 'material',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play'
								}
							]
						}
					]
				}
			];

			const { sourcingMaterials } = williamShakespearePerson.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

	});

	describe('The Indian Boy at Royal Shakespeare Theatre (production)', () => {

		it('includes in its material data the writers of the material and its source material', () => {

			const expectedMaterial = {
				model: 'material',
				uuid: THE_INDIAN_BOY_MATERIAL_UUID,
				name: 'The Indian Boy',
				format: 'play',
				writingCredits: [
					{
						model: 'writingCredit',
						name: 'by',
						writingEntities: [
							{
								model: 'person',
								uuid: RONA_MUNRO_PERSON_UUID,
								name: 'Rona Munro',
								format: null,
								sourceMaterialWritingCredits: []
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'inspired by',
						writingEntities: [
							{
								model: 'material',
								uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
								name: 'A Midsummer Night\'s Dream',
								format: 'play',
								sourceMaterialWritingCredits: [
									{
										model: 'writingCredit',
										name: 'by',
										writingEntities: [
											{
												model: 'person',
												uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
												name: 'William Shakespeare'
											}
										]
									}
								]
							}
						]
					}
				]
			};

			const { material } = theIndianBoyRoyalShakespeareTheatreProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('The Indian Boy (character)', () => {

		it('includes in its material data the writers of the material and its source material', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'inspired by',
							writingEntities: [
								{
									model: 'material',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									sourceMaterialWritingCredits: [
										{
											model: 'writingCredit',
											name: 'by',
											writingEntities: [
												{
													model: 'person',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												}
											]
										}
									]
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = theIndianBoyCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('materials list', () => {

		it('includes writers of the materials and their corresponding source material', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'material',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
					name: 'A Midsummer Night\'s Dream',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro',
									format: null,
									sourceMaterialWritingCredits: []
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'inspired by',
							writingEntities: [
								{
									model: 'material',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									sourceMaterialWritingCredits: [
										{
											model: 'writingCredit',
											name: 'by',
											writingEntities: [
												{
													model: 'person',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

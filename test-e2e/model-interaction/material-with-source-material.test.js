import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Materials with source material', () => {

	chai.use(chaiHttp);

	const A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID = '4';
	const WILLIAM_SHAKESPEARE_PERSON_UUID = '6';
	const THE_KINGS_MEN_COMPANY_UUID = '7';
	const THE_DONKEY_SHOW_MATERIAL_UUID = '13';
	const DIANE_PAULUS_PERSON_UUID = '15';
	const RANDY_WEINER_PERSON_UUID = '16';
	const THE_INDIAN_BOY_MATERIAL_UUID = '24';
	const RONA_MUNRO_PERSON_UUID = '26';
	const ROYAL_SHAKESPEARE_COMPANY_UUID = '27';
	const THE_INDIAN_BOY_CHARACTER_UUID = '29';
	const SHAKESPEARES_VILLAINS_MATERIAL_UUID = '37';
	const STEVEN_BERKOFF_PERSON_UUID = '39';
	const EAST_PRODUCTIONS_COMPANY_UUID = '40';
	const IAGO_CHARACTER_UUID = '43';
	const A_MOORISH_CAPTAIN_MATERIAL_UUID = '48';
	const OTHELLO_MATERIAL_UUID = '58';
	const A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_THEATRE_PRODUCTION_UUID = '64';
	const NOVELLO_THEATRE_UUID = '66';
	const THE_DONKEY_SHOW_HANOVER_GRAND_PRODUCTION_UUID = '67';
	const HANOVER_GRAND_THEATRE_UUID = '69';
	const THE_INDIAN_BOY_ROYAL_SHAKESPEARE_THEATRE_PRODUCTION_UUID = '70';
	const ROYAL_SHAKESPEARE_THEATRE_UUID = '72';
	const SHAKESPEARES_VILLAINS_THEATRE_ROYAL_HAYMARKET_PRODUCTION_UUID = '73';
	const OTHELLO_DONMAR_WAREHOUSE_PRODUCTION_UUID = '76';

	let aMidsummerNightsDreamMaterial;
	let theIndianBoyMaterial;
	let shakespearesVillainsMaterial;
	let aMoorishCaptainMaterial;
	let othelloMaterial;
	let williamShakespearePerson;
	let ronaMunroPerson;
	let stevenBerkoffPerson;
	let theKingsMenCompany;
	let royalShakespeareCompany;
	let eastProductionsCompany;
	let theIndianBoyRoyalShakespeareTheatreProduction;
	let shakespearesVillainsTheatreRoyalHaymarketProduction;
	let othelloDonmarWarehouseProduction;
	let theIndianBoyCharacter;
	let iagoCharacter;

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
							},
							// Contrivance for purposes of test.
							{
								model: 'company',
								name: 'The King\'s Men'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Donkey Show',
				format: 'musical',
				writingCredits: [
					{
						name: 'book by',
						writingEntities: [
							{
								name: 'Diane Paulus'
							},
							{
								name: 'Randy Weiner'
							}
						]
					},
					{
						name: 'based on',
						writingEntities: [
							{
								model: 'material',
								name: 'A Midsummer Night\'s Dream'
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
							},
							// Contrivance for purposes of test.
							{
								model: 'company',
								name: 'Royal Shakespeare Company'
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
			.post('/materials')
			.send({
				name: 'Shakespeare\'s Villains',
				format: 'play',
				writingCredits: [
					{
						writingEntities: [
							{
								name: 'Steven Berkoff'
							},
							// Contrivance for purposes of test.
							{
								model: 'company',
								name: 'East Productions'
							}
						]
					},
					{
						name: 'based on works by',
						creditType: 'NON_SPECIFIC_SOURCE_MATERIAL',
						writingEntities: [
							{
								name: 'William Shakespeare'
							},
							// Contrivance for purposes of test.
							{
								model: 'company',
								name: 'The King\'s Men'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Iago'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'A Moorish Captain',
				format: 'tale',
				writingCredits: [
					{
						writingEntities: [
							// Contrivance for purposes of test.
							{
								model: 'person',
								name: 'William Shakespeare'
							},
							{
								model: 'company',
								name: 'The King\'s Men'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Othello',
				format: 'play',
				writingCredits: [
					{
						writingEntities: [
							{
								model: 'person',
								name: 'William Shakespeare'
							},
							{
								model: 'company',
								name: 'The King\'s Men'
							}
						]
					},
					{
						name: 'based on',
						writingEntities: [
							{
								model: 'material',
								name: 'A Moorish Captain'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Iago'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'A Midsummer Night\'s Dream',
				material: {
					name: 'A Midsummer Night\'s Dream'
				},
				theatre: {
					name: 'Novello Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Donkey Show',
				material: {
					name: 'The Donkey Show'
				},
				theatre: {
					name: 'Hanover Grand'
				}
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

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Shakespeare\'s Villains',
				material: {
					name: 'Shakespeare\'s Villains'
				},
				theatre: {
					name: 'Theatre Royal Haymarket'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Othello',
				material: {
					name: 'Othello'
				},
				theatre: {
					name: 'Donmar Warehouse'
				}
			});

		aMidsummerNightsDreamMaterial = await chai.request(app)
			.get(`/materials/${A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID}`);

		theIndianBoyMaterial = await chai.request(app)
			.get(`/materials/${THE_INDIAN_BOY_MATERIAL_UUID}`);

		shakespearesVillainsMaterial = await chai.request(app)
			.get(`/materials/${SHAKESPEARES_VILLAINS_MATERIAL_UUID}`);

		aMoorishCaptainMaterial = await chai.request(app)
			.get(`/materials/${A_MOORISH_CAPTAIN_MATERIAL_UUID}`);

		othelloMaterial = await chai.request(app)
			.get(`/materials/${OTHELLO_MATERIAL_UUID}`);

		williamShakespearePerson = await chai.request(app)
			.get(`/people/${WILLIAM_SHAKESPEARE_PERSON_UUID}`);

		ronaMunroPerson = await chai.request(app)
			.get(`/people/${RONA_MUNRO_PERSON_UUID}`);

		stevenBerkoffPerson = await chai.request(app)
			.get(`/people/${STEVEN_BERKOFF_PERSON_UUID}`);

		theKingsMenCompany = await chai.request(app)
			.get(`/companies/${THE_KINGS_MEN_COMPANY_UUID}`);

		royalShakespeareCompany = await chai.request(app)
			.get(`/companies/${ROYAL_SHAKESPEARE_COMPANY_UUID}`);

		eastProductionsCompany = await chai.request(app)
			.get(`/companies/${EAST_PRODUCTIONS_COMPANY_UUID}`);

		theIndianBoyRoyalShakespeareTheatreProduction = await chai.request(app)
			.get(`/productions/${THE_INDIAN_BOY_ROYAL_SHAKESPEARE_THEATRE_PRODUCTION_UUID}`);

		shakespearesVillainsTheatreRoyalHaymarketProduction = await chai.request(app)
			.get(`/productions/${SHAKESPEARES_VILLAINS_THEATRE_ROYAL_HAYMARKET_PRODUCTION_UUID}`);

		othelloDonmarWarehouseProduction = await chai.request(app)
			.get(`/productions/${OTHELLO_DONMAR_WAREHOUSE_PRODUCTION_UUID}`);

		theIndianBoyCharacter = await chai.request(app)
			.get(`/characters/${THE_INDIAN_BOY_CHARACTER_UUID}`);

		iagoCharacter = await chai.request(app)
			.get(`/characters/${IAGO_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('A Midsummer Night\'s Dream (material)', () => {

		it('includes materials that used it as source material (in which their uuid is nullified), with corresponding writers', () => {

			const expectedSourcingMaterials = [
				{
					model: 'material',
					uuid: THE_DONKEY_SHOW_MATERIAL_UUID,
					name: 'The Donkey Show',
					format: 'musical',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'book by',
							writingEntities: [
								{
									model: 'person',
									uuid: DIANE_PAULUS_PERSON_UUID,
									name: 'Diane Paulus'
								},
								{
									model: 'person',
									uuid: RANDY_WEINER_PERSON_UUID,
									name: 'Randy Weiner'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on',
							writingEntities: [
								{
									model: 'material',
									uuid: null,
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
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
												}
											]
										}
									]
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
									name: 'Rona Munro'
								},
								{
									model: 'company',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
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
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
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

			const { sourcingMaterials } = aMidsummerNightsDreamMaterial.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of material', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_THEATRE_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					theatre: {
						model: 'theatre',
						uuid: NOVELLO_THEATRE_UUID,
						name: 'Novello Theatre',
						surTheatre: null
					}
				}
			];

			const { productions } = aMidsummerNightsDreamMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

		it('includes productions of materials that used it as source material', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'production',
					uuid: THE_DONKEY_SHOW_HANOVER_GRAND_PRODUCTION_UUID,
					name: 'The Donkey Show',
					theatre: {
						model: 'theatre',
						uuid: HANOVER_GRAND_THEATRE_UUID,
						name: 'Hanover Grand',
						surTheatre: null
					}
				},
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
							name: 'Rona Munro'
						},
						{
							model: 'company',
							uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
							name: 'Royal Shakespeare Company'
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
										},
										{
											model: 'company',
											uuid: THE_KINGS_MEN_COMPANY_UUID,
											name: 'The King\'s Men'
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

	describe('Shakespeare\'s Villains (material)', () => {

		it('includes writers of this material and its source material grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'writingCredit',
					name: 'by',
					writingEntities: [
						{
							model: 'person',
							uuid: STEVEN_BERKOFF_PERSON_UUID,
							name: 'Steven Berkoff'
						},
						{
							model: 'company',
							uuid: EAST_PRODUCTIONS_COMPANY_UUID,
							name: 'East Productions'
						}
					]
				},
				{
					model: 'writingCredit',
					name: 'based on works by',
					writingEntities: [
						{
							model: 'person',
							uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
							name: 'William Shakespeare'
						},
						{
							model: 'company',
							uuid: THE_KINGS_MEN_COMPANY_UUID,
							name: 'The King\'s Men'
						}
					]
				}
			];

			const { writingCredits } = shakespearesVillainsMaterial.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('A Moorish Captain (material)', () => {

		it('includes writers of this material and its source material grouped by their respective credits', () => {

			const expectedSourcingMaterials = [
				{
					model: 'material',
					uuid: OTHELLO_MATERIAL_UUID,
					name: 'Othello',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on',
							writingEntities: [
								{
									model: 'material',
									uuid: null,
									name: 'A Moorish Captain',
									format: 'tale',
									sourceMaterialWritingCredits: [
										{
											model: 'writingCredit',
											name: 'by',
											writingEntities: [
												{
													model: 'person',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
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

			const { sourcingMaterials } = aMoorishCaptainMaterial.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

	});

	describe('Othello (material)', () => {

		it('includes writers of this material and its source material grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'writingCredit',
					name: 'by',
					writingEntities: [
						{
							model: 'person',
							uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
							name: 'William Shakespeare'
						},
						{
							model: 'company',
							uuid: THE_KINGS_MEN_COMPANY_UUID,
							name: 'The King\'s Men'
						}
					]
				},
				{
					model: 'writingCredit',
					name: 'based on',
					writingEntities: [
						{
							model: 'material',
							uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
							name: 'A Moorish Captain',
							format: 'tale',
							sourceMaterialWritingCredits: [
								{
									model: 'writingCredit',
									name: 'by',
									writingEntities: [
										{
											model: 'person',
											uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
											name: 'William Shakespeare'
										},
										{
											model: 'company',
											uuid: THE_KINGS_MEN_COMPANY_UUID,
											name: 'The King\'s Men'
										}
									]
								}
							]
						}
					]
				}
			];

			const { writingCredits } = othelloMaterial.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('William Shakespeare (person)', () => {

		it('includes materials that used their work as source material (both specific and non-specific), with corresponding writers', () => {

			const expectedSourcingMaterials = [
				{
					model: 'material',
					uuid: OTHELLO_MATERIAL_UUID,
					name: 'Othello',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on',
							writingEntities: [
								{
									model: 'material',
									uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
									name: 'A Moorish Captain',
									format: 'tale',
									sourceMaterialWritingCredits: [
										{
											model: 'writingCredit',
											name: 'by',
											writingEntities: [
												{
													model: 'person',
													uuid: null,
													name: 'William Shakespeare'
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: STEVEN_BERKOFF_PERSON_UUID,
									name: 'Steven Berkoff'
								},
								{
									model: 'company',
									uuid: EAST_PRODUCTIONS_COMPANY_UUID,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on works by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: THE_DONKEY_SHOW_MATERIAL_UUID,
					name: 'The Donkey Show',
					format: 'musical',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'book by',
							writingEntities: [
								{
									model: 'person',
									uuid: DIANE_PAULUS_PERSON_UUID,
									name: 'Diane Paulus'
								},
								{
									model: 'person',
									uuid: RANDY_WEINER_PERSON_UUID,
									name: 'Randy Weiner'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on',
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
													uuid: null,
													name: 'William Shakespeare'
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
												}
											]
										}
									]
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
									name: 'Rona Munro'
								},
								{
									model: 'company',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
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
													uuid: null,
													name: 'William Shakespeare'
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
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

			const { sourcingMaterials } = williamShakespearePerson.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

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
									name: 'Rona Munro'
								},
								{
									model: 'company',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
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
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
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

	describe('Steven Berkoff (person)', () => {

		it('includes materials they have written (in which their uuid is nullified), with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: null,
									name: 'Steven Berkoff'
								},
								{
									model: 'company',
									uuid: EAST_PRODUCTIONS_COMPANY_UUID,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on works by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					]
				}
			];

			const { materials } = stevenBerkoffPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('The King\'s Men (company)', () => {

		it('includes materials that used their work as source material (both specific and non-specific), with corresponding writers', () => {

			const expectedSourcingMaterials = [
				{
					model: 'material',
					uuid: OTHELLO_MATERIAL_UUID,
					name: 'Othello',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: null,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on',
							writingEntities: [
								{
									model: 'material',
									uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
									name: 'A Moorish Captain',
									format: 'tale',
									sourceMaterialWritingCredits: [
										{
											model: 'writingCredit',
											name: 'by',
											writingEntities: [
												{
													model: 'person',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'company',
													uuid: null,
													name: 'The King\'s Men'
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: STEVEN_BERKOFF_PERSON_UUID,
									name: 'Steven Berkoff'
								},
								{
									model: 'company',
									uuid: EAST_PRODUCTIONS_COMPANY_UUID,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on works by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: null,
									name: 'The King\'s Men'
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: THE_DONKEY_SHOW_MATERIAL_UUID,
					name: 'The Donkey Show',
					format: 'musical',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'book by',
							writingEntities: [
								{
									model: 'person',
									uuid: DIANE_PAULUS_PERSON_UUID,
									name: 'Diane Paulus'
								},
								{
									model: 'person',
									uuid: RANDY_WEINER_PERSON_UUID,
									name: 'Randy Weiner'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on',
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
												},
												{
													model: 'company',
													uuid: null,
													name: 'The King\'s Men'
												}
											]
										}
									]
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
									name: 'Rona Munro'
								},
								{
									model: 'company',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
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
												},
												{
													model: 'company',
													uuid: null,
													name: 'The King\'s Men'
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

			const { sourcingMaterials } = theKingsMenCompany.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

	});

	describe('Royal Shakespeare Company (company)', () => {

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
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro'
								},
								{
									model: 'company',
									uuid: null,
									name: 'Royal Shakespeare Company'
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
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
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

			const { materials } = royalShakespeareCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('East Productions (company)', () => {

		it('includes materials they have written (in which their uuid is nullified), with corresponding writers', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: STEVEN_BERKOFF_PERSON_UUID,
									name: 'Steven Berkoff'
								},
								{
									model: 'company',
									uuid: null,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on works by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					]
				}
			];

			const { materials } = eastProductionsCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

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
								name: 'Rona Munro'
							},
							{
								model: 'company',
								uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
								name: 'Royal Shakespeare Company'
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
											},
											{
												model: 'company',
												uuid: THE_KINGS_MEN_COMPANY_UUID,
												name: 'The King\'s Men'
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

	describe('Shakespeare\'s Villains at Theatre Royal Haymarket (production)', () => {

		it('includes in its material data the writers of the material and its source material', () => {

			const expectedMaterial = {
				model: 'material',
				uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
				name: 'Shakespeare\'s Villains',
				format: 'play',
				writingCredits: [
					{
						model: 'writingCredit',
						name: 'by',
						writingEntities: [
							{
								model: 'person',
								uuid: STEVEN_BERKOFF_PERSON_UUID,
								name: 'Steven Berkoff'
							},
							{
								model: 'company',
								uuid: EAST_PRODUCTIONS_COMPANY_UUID,
								name: 'East Productions'
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'based on works by',
						writingEntities: [
							{
								model: 'person',
								uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
								name: 'William Shakespeare'
							},
							{
								model: 'company',
								uuid: THE_KINGS_MEN_COMPANY_UUID,
								name: 'The King\'s Men'
							}
						]
					}
				]
			};

			const { material } = shakespearesVillainsTheatreRoyalHaymarketProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('Othello at Donmar Warehouse (production)', () => {

		it('includes in its material data the writers of the material and its source material', () => {

			const expectedMaterial = {
				model: 'material',
				uuid: OTHELLO_MATERIAL_UUID,
				name: 'Othello',
				format: 'play',
				writingCredits: [
					{
						model: 'writingCredit',
						name: 'by',
						writingEntities: [
							{
								model: 'person',
								uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
								name: 'William Shakespeare'
							},
							{
								model: 'company',
								uuid: THE_KINGS_MEN_COMPANY_UUID,
								name: 'The King\'s Men'
							}
						]
					},
					{
						model: 'writingCredit',
						name: 'based on',
						writingEntities: [
							{
								model: 'material',
								uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
								name: 'A Moorish Captain',
								format: 'tale',
								sourceMaterialWritingCredits: [
									{
										model: 'writingCredit',
										name: 'by',
										writingEntities: [
											{
												model: 'person',
												uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
												name: 'William Shakespeare'
											},
											{
												model: 'company',
												uuid: THE_KINGS_MEN_COMPANY_UUID,
												name: 'The King\'s Men'
											}
										]
									}
								]
							}
						]
					}
				]
			};

			const { material } = othelloDonmarWarehouseProduction.body;

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
									name: 'Rona Munro'
								},
								{
									model: 'company',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
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
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
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

	describe('Iago (character)', () => {

		it('includes in its material data the writers of the material and its source material', () => {

			const expectedMaterials = [
				{
					model: 'material',
					uuid: OTHELLO_MATERIAL_UUID,
					name: 'Othello',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on',
							writingEntities: [
								{
									model: 'material',
									uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
									name: 'A Moorish Captain',
									format: 'tale',
									sourceMaterialWritingCredits: [
										{
											model: 'writingCredit',
											name: 'by',
											writingEntities: [
												{
													model: 'person',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
												}
											]
										}
									]
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'material',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: STEVEN_BERKOFF_PERSON_UUID,
									name: 'Steven Berkoff'
								},
								{
									model: 'company',
									uuid: EAST_PRODUCTIONS_COMPANY_UUID,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on works by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = iagoCharacter.body;

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
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
					name: 'A Moorish Captain',
					format: 'tale',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: OTHELLO_MATERIAL_UUID,
					name: 'Othello',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on',
							writingEntities: [
								{
									model: 'material',
									uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
									name: 'A Moorish Captain',
									format: 'tale',
									sourceMaterialWritingCredits: [
										{
											model: 'writingCredit',
											name: 'by',
											writingEntities: [
												{
													model: 'person',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'by',
							writingEntities: [
								{
									model: 'person',
									uuid: STEVEN_BERKOFF_PERSON_UUID,
									name: 'Steven Berkoff'
								},
								{
									model: 'company',
									uuid: EAST_PRODUCTIONS_COMPANY_UUID,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on works by',
							writingEntities: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'company',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					]
				},
				{
					model: 'material',
					uuid: THE_DONKEY_SHOW_MATERIAL_UUID,
					name: 'The Donkey Show',
					format: 'musical',
					writingCredits: [
						{
							model: 'writingCredit',
							name: 'book by',
							writingEntities: [
								{
									model: 'person',
									uuid: DIANE_PAULUS_PERSON_UUID,
									name: 'Diane Paulus'
								},
								{
									model: 'person',
									uuid: RANDY_WEINER_PERSON_UUID,
									name: 'Randy Weiner'
								}
							]
						},
						{
							model: 'writingCredit',
							name: 'based on',
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
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
												}
											]
										}
									]
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
									name: 'Rona Munro'
								},
								{
									model: 'company',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
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
												},
												{
													model: 'company',
													uuid: THE_KINGS_MEN_COMPANY_UUID,
													name: 'The King\'s Men'
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

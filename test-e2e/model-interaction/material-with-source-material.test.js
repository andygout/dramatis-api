import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

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
	const NOVELLO_THEATRE_VENUE_UUID = '66';
	const THE_DONKEY_SHOW_HANOVER_GRAND_PRODUCTION_UUID = '67';
	const HANOVER_GRAND_VENUE_UUID = '69';
	const THE_INDIAN_BOY_ROYAL_SHAKESPEARE_THEATRE_PRODUCTION_UUID = '70';
	const ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID = '72';
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

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'A Midsummer Night\'s Dream',
				format: 'play',
				year: '1595',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							// Contrivance for purposes of test.
							{
								model: 'COMPANY',
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
				year: '2000',
				writingCredits: [
					{
						name: 'book by',
						entities: [
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
						entities: [
							{
								model: 'MATERIAL',
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
				year: '2006',
				writingCredits: [
					{
						entities: [
							{
								name: 'Rona Munro'
							},
							// Contrivance for purposes of test.
							{
								model: 'COMPANY',
								name: 'Royal Shakespeare Company'
							}
						]
					},
					{
						name: 'inspired by',
						entities: [
							{
								model: 'MATERIAL',
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
				year: '1998',
				writingCredits: [
					{
						entities: [
							{
								name: 'Steven Berkoff'
							},
							// Contrivance for purposes of test.
							{
								model: 'COMPANY',
								name: 'East Productions'
							}
						]
					},
					{
						name: 'based on works by',
						creditType: 'NON_SPECIFIC_SOURCE_MATERIAL',
						entities: [
							{
								name: 'William Shakespeare'
							},
							// Contrivance for purposes of test.
							{
								model: 'COMPANY',
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
				year: '1565',
				writingCredits: [
					{
						entities: [
							// Contrivance for purposes of test.
							{
								model: 'PERSON',
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
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
				year: '1603',
				writingCredits: [
					{
						entities: [
							{
								model: 'PERSON',
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: 'The King\'s Men'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
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
				startDate: '2006-02-02',
				pressDate: '2006-02-07',
				endDate: '2006-02-25',
				material: {
					name: 'A Midsummer Night\'s Dream'
				},
				venue: {
					name: 'Novello Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Donkey Show',
				startDate: '2000-09-12',
				pressDate: '2000-09-18',
				endDate: '2002-01-02',
				material: {
					name: 'The Donkey Show'
				},
				venue: {
					name: 'Hanover Grand'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Indian Boy',
				startDate: '2006-11-07',
				pressDate: '2006-11-09',
				endDate: '2006-11-11',
				material: {
					name: 'The Indian Boy'
				},
				venue: {
					name: 'Royal Shakespeare Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Shakespeare\'s Villains',
				startDate: '1998-06-30',
				pressDate: '1998-07-07',
				endDate: '1998-08-08',
				material: {
					name: 'Shakespeare\'s Villains'
				},
				venue: {
					name: 'Theatre Royal Haymarket'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Othello',
				startDate: '2007-11-30',
				pressDate: '2007-12-04',
				endDate: '2008-02-23',
				material: {
					name: 'Othello'
				},
				venue: {
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
					model: 'MATERIAL',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					year: 2006,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									uuid: null,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: THE_DONKEY_SHOW_MATERIAL_UUID,
					name: 'The Donkey Show',
					format: 'musical',
					year: 2000,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'book by',
							entities: [
								{
									model: 'PERSON',
									uuid: DIANE_PAULUS_PERSON_UUID,
									name: 'Diane Paulus'
								},
								{
									model: 'PERSON',
									uuid: RANDY_WEINER_PERSON_UUID,
									name: 'Randy Weiner'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: null,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'PRODUCTION',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_NOVELLO_THEATRE_PRODUCTION_UUID,
					name: 'A Midsummer Night\'s Dream',
					startDate: '2006-02-02',
					endDate: '2006-02-25',
					venue: {
						model: 'VENUE',
						uuid: NOVELLO_THEATRE_VENUE_UUID,
						name: 'Novello Theatre',
						surVenue: null
					}
				}
			];

			const { productions } = aMidsummerNightsDreamMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

		it('includes productions of materials that used it as source material', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_INDIAN_BOY_ROYAL_SHAKESPEARE_THEATRE_PRODUCTION_UUID,
					name: 'The Indian Boy',
					startDate: '2006-11-07',
					endDate: '2006-11-11',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_DONKEY_SHOW_HANOVER_GRAND_PRODUCTION_UUID,
					name: 'The Donkey Show',
					startDate: '2000-09-12',
					endDate: '2002-01-02',
					venue: {
						model: 'VENUE',
						uuid: HANOVER_GRAND_VENUE_UUID,
						name: 'Hanover Grand',
						surVenue: null
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
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: RONA_MUNRO_PERSON_UUID,
							name: 'Rona Munro'
						},
						{
							model: 'COMPANY',
							uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
							name: 'Royal Shakespeare Company'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'inspired by',
					entities: [
						{
							model: 'MATERIAL',
							uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
							name: 'A Midsummer Night\'s Dream',
							format: 'play',
							year: 1595,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
											name: 'William Shakespeare'
										},
										{
											model: 'COMPANY',
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
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: STEVEN_BERKOFF_PERSON_UUID,
							name: 'Steven Berkoff'
						},
						{
							model: 'COMPANY',
							uuid: EAST_PRODUCTIONS_COMPANY_UUID,
							name: 'East Productions'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'based on works by',
					entities: [
						{
							model: 'PERSON',
							uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
							name: 'William Shakespeare'
						},
						{
							model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: OTHELLO_MATERIAL_UUID,
					name: 'Othello',
					format: 'play',
					year: 1603,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: null,
									name: 'A Moorish Captain',
									format: 'tale',
									year: 1565,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
							name: 'William Shakespeare'
						},
						{
							model: 'COMPANY',
							uuid: THE_KINGS_MEN_COMPANY_UUID,
							name: 'The King\'s Men'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'based on',
					entities: [
						{
							model: 'MATERIAL',
							uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
							name: 'A Moorish Captain',
							format: 'tale',
							year: 1565,
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
											name: 'William Shakespeare'
										},
										{
											model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					year: 2006,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: null,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: THE_DONKEY_SHOW_MATERIAL_UUID,
					name: 'The Donkey Show',
					format: 'musical',
					year: 2000,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'book by',
							entities: [
								{
									model: 'PERSON',
									uuid: DIANE_PAULUS_PERSON_UUID,
									name: 'Diane Paulus'
								},
								{
									model: 'PERSON',
									uuid: RANDY_WEINER_PERSON_UUID,
									name: 'Randy Weiner'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: null,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					year: 1998,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_BERKOFF_PERSON_UUID,
									name: 'Steven Berkoff'
								},
								{
									model: 'COMPANY',
									uuid: EAST_PRODUCTIONS_COMPANY_UUID,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on works by',
							entities: [
								{
									model: 'PERSON',
									uuid: null,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: OTHELLO_MATERIAL_UUID,
					name: 'Othello',
					format: 'play',
					year: 1603,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: null,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
									name: 'A Moorish Captain',
									format: 'tale',
									year: 1565,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: null,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					year: 2006,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: null,
									name: 'Rona Munro'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					year: 1998,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: null,
									name: 'Steven Berkoff'
								},
								{
									model: 'COMPANY',
									uuid: EAST_PRODUCTIONS_COMPANY_UUID,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on works by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					year: 2006,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: THE_DONKEY_SHOW_MATERIAL_UUID,
					name: 'The Donkey Show',
					format: 'musical',
					year: 2000,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'book by',
							entities: [
								{
									model: 'PERSON',
									uuid: DIANE_PAULUS_PERSON_UUID,
									name: 'Diane Paulus'
								},
								{
									model: 'PERSON',
									uuid: RANDY_WEINER_PERSON_UUID,
									name: 'Randy Weiner'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					year: 1998,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_BERKOFF_PERSON_UUID,
									name: 'Steven Berkoff'
								},
								{
									model: 'COMPANY',
									uuid: EAST_PRODUCTIONS_COMPANY_UUID,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on works by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: null,
									name: 'The King\'s Men'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: OTHELLO_MATERIAL_UUID,
					name: 'Othello',
					format: 'play',
					year: 1603,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: null,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
									name: 'A Moorish Captain',
									format: 'tale',
									year: 1565,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					year: 2006,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro'
								},
								{
									model: 'COMPANY',
									uuid: null,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					year: 1998,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_BERKOFF_PERSON_UUID,
									name: 'Steven Berkoff'
								},
								{
									model: 'COMPANY',
									uuid: null,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on works by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
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
				model: 'MATERIAL',
				uuid: THE_INDIAN_BOY_MATERIAL_UUID,
				name: 'The Indian Boy',
				format: 'play',
				year: 2006,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: RONA_MUNRO_PERSON_UUID,
								name: 'Rona Munro'
							},
							{
								model: 'COMPANY',
								uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
								name: 'Royal Shakespeare Company'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'inspired by',
						entities: [
							{
								model: 'MATERIAL',
								uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
								name: 'A Midsummer Night\'s Dream',
								format: 'play',
								year: 1595,
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
												name: 'William Shakespeare'
											},
											{
												model: 'COMPANY',
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
				model: 'MATERIAL',
				uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
				name: 'Shakespeare\'s Villains',
				format: 'play',
				year: 1998,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: STEVEN_BERKOFF_PERSON_UUID,
								name: 'Steven Berkoff'
							},
							{
								model: 'COMPANY',
								uuid: EAST_PRODUCTIONS_COMPANY_UUID,
								name: 'East Productions'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'based on works by',
						entities: [
							{
								model: 'PERSON',
								uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
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
				model: 'MATERIAL',
				uuid: OTHELLO_MATERIAL_UUID,
				name: 'Othello',
				format: 'play',
				year: 1603,
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								uuid: THE_KINGS_MEN_COMPANY_UUID,
								name: 'The King\'s Men'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
								name: 'A Moorish Captain',
								format: 'tale',
								year: 1565,
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
												name: 'William Shakespeare'
											},
											{
												model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					year: 2006,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					year: 1998,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_BERKOFF_PERSON_UUID,
									name: 'Steven Berkoff'
								},
								{
									model: 'COMPANY',
									uuid: EAST_PRODUCTIONS_COMPANY_UUID,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on works by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: OTHELLO_MATERIAL_UUID,
					name: 'Othello',
					format: 'play',
					year: 1603,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
									name: 'A Moorish Captain',
									format: 'tale',
									year: 1565,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: THE_INDIAN_BOY_MATERIAL_UUID,
					name: 'The Indian Boy',
					format: 'play',
					year: 2006,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro'
								},
								{
									model: 'COMPANY',
									uuid: ROYAL_SHAKESPEARE_COMPANY_UUID,
									name: 'Royal Shakespeare Company'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'inspired by',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: THE_DONKEY_SHOW_MATERIAL_UUID,
					name: 'The Donkey Show',
					format: 'musical',
					year: 2000,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'book by',
							entities: [
								{
									model: 'PERSON',
									uuid: DIANE_PAULUS_PERSON_UUID,
									name: 'Diane Paulus'
								},
								{
									model: 'PERSON',
									uuid: RANDY_WEINER_PERSON_UUID,
									name: 'Randy Weiner'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
									name: 'A Midsummer Night\'s Dream',
									format: 'play',
									year: 1595,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: SHAKESPEARES_VILLAINS_MATERIAL_UUID,
					name: 'Shakespeare\'s Villains',
					format: 'play',
					year: 1998,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_BERKOFF_PERSON_UUID,
									name: 'Steven Berkoff'
								},
								{
									model: 'COMPANY',
									uuid: EAST_PRODUCTIONS_COMPANY_UUID,
									name: 'East Productions'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on works by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: OTHELLO_MATERIAL_UUID,
					name: 'Othello',
					format: 'play',
					year: 1603,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
									name: 'A Moorish Captain',
									format: 'tale',
									year: 1565,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												},
												{
													model: 'COMPANY',
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
					model: 'MATERIAL',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_MATERIAL_UUID,
					name: 'A Midsummer Night\'s Dream',
					format: 'play',
					year: 1595,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: A_MOORISH_CAPTAIN_MATERIAL_UUID,
					name: 'A Moorish Captain',
					format: 'tale',
					year: 1565,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare'
								},
								{
									model: 'COMPANY',
									uuid: THE_KINGS_MEN_COMPANY_UUID,
									name: 'The King\'s Men'
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

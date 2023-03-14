import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Material with sub-sub-materials and source materials thereof', () => {

	chai.use(chaiHttp);

	const GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID = '4';
	const RICHARD_BANCROFT_PERSON_UUID = '6';
	const THE_CANTERBURY_EDITORS_COMPANY_UUID = '7';
	const THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID = '13';
	const THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID = '23';
	const GODBLOG_PLAY_MATERIAL_UUID = '34';
	const JEANETTE_WINTERSON_PERSON_UUID = '36';
	const ONLY_FRUITS_COMPANY_UUID = '37';
	const GOD_CHARACTER_UUID = '39';
	const THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID = '44';
	const SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID = '52';
	const GODBLOG_BUSH_THEATRE_PRODUCTION_UUID = '56';
	const BUSH_THEATRE_VENUE_UUID = '58';
	const THE_BOOKS_OF_THE_OLD_TESTAMENT_BUSH_THEATRE_PRODUCTION_UUID = '59';
	const SIXTY_SIX_BOOKS_BUSH_THEATRE_PRODUCTION_UUID = '62';

	let genesisReligiousTextMaterial;
	let godblogPlayMaterial;
	let richardBancroftPerson;
	let jeanetteWintersonPerson;
	let theCanterburyEditorsCompany;
	let onlyFruitsCompany;
	let godblogBushTheatreProduction;
	let godCharacter;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Genesis',
				format: 'religious text',
				year: '1611',
				writingCredits: [
					{
						entities: [
							{
								name: 'Richard Bancroft'
							},
							{
								model: 'COMPANY',
								name: 'The Canterbury Editors'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Old Testament',
				format: 'religious text',
				year: '1611',
				writingCredits: [
					{
						entities: [
							{
								name: 'Richard Bancroft'
							},
							{
								model: 'COMPANY',
								name: 'The Canterbury Editors'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Genesis'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Bible: King James Version',
				format: 'religious text',
				year: '1611',
				writingCredits: [
					{
						entities: [
							{
								name: 'Richard Bancroft'
							},
							{
								model: 'COMPANY',
								name: 'The Canterbury Editors'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Old Testament'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Godblog',
				format: 'play',
				year: '2011',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jeanette Winterson'
							},
							{
								model: 'COMPANY',
								name: 'Only Fruits'
							}
						]
					},
					{
						name: 'written in response to',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Genesis'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'God'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Books of the Old Testament',
				format: 'sub-collection of plays',
				year: '2011',
				writingCredits: [
					{
						name: 'written in response to',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Old Testament'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Godblog'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sixty-Six Books',
				format: 'collection of plays',
				year: '2011',
				writingCredits: [
					{
						name: 'written in response to',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Bible: King James Version'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Books of the Old Testament'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Godblog',
				startDate: '2011-10-10',
				pressDate: '2011-10-14',
				endDate: '2011-10-28',
				material: {
					name: 'Godblog'
				},
				venue: {
					name: 'Bush Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Books of the Old Testament',
				startDate: '2011-10-10',
				pressDate: '2011-10-14',
				endDate: '2011-10-29',
				material: {
					name: 'The Books of the Old Testament'
				},
				venue: {
					name: 'Bush Theatre'
				},
				subProductions: [
					{
						uuid: GODBLOG_BUSH_THEATRE_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sixty-Six Books',
				startDate: '2011-10-10',
				pressDate: '2011-10-14',
				endDate: '2011-10-29',
				material: {
					name: 'Sixty-Six Books'
				},
				venue: {
					name: 'Bush Theatre'
				},
				subProductions: [
					{
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_BUSH_THEATRE_PRODUCTION_UUID
					}
				]
			});

		genesisReligiousTextMaterial = await chai.request(app)
			.get(`/materials/${GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID}`);

		godblogPlayMaterial = await chai.request(app)
			.get(`/materials/${GODBLOG_PLAY_MATERIAL_UUID}`);

		richardBancroftPerson = await chai.request(app)
			.get(`/people/${RICHARD_BANCROFT_PERSON_UUID}`);

		jeanetteWintersonPerson = await chai.request(app)
			.get(`/people/${JEANETTE_WINTERSON_PERSON_UUID}`);

		theCanterburyEditorsCompany = await chai.request(app)
			.get(`/companies/${THE_CANTERBURY_EDITORS_COMPANY_UUID}`);

		onlyFruitsCompany = await chai.request(app)
			.get(`/companies/${ONLY_FRUITS_COMPANY_UUID}`);

		godblogBushTheatreProduction = await chai.request(app)
			.get(`/productions/${GODBLOG_BUSH_THEATRE_PRODUCTION_UUID}`);

		godCharacter = await chai.request(app)
			.get(`/characters/${GOD_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Genesis (religious text) (material)', () => {

		it('includes materials that used it as source material, with corresponding sur-material and sur-sur-material', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'written in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { sourcingMaterials } = genesisReligiousTextMaterial.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

		it('includes productions of material that used it as source material, including the sur-production and sur-sur-production', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: GODBLOG_BUSH_THEATRE_PRODUCTION_UUID,
					name: 'Godblog',
					startDate: '2011-10-10',
					endDate: '2011-10-28',
					venue: {
						model: 'VENUE',
						uuid: BUSH_THEATRE_VENUE_UUID,
						name: 'Bush Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_BUSH_THEATRE_PRODUCTION_UUID,
						name: 'The Books of the Old Testament',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SIXTY_SIX_BOOKS_BUSH_THEATRE_PRODUCTION_UUID,
							name: 'Sixty-Six Books'
						}
					}
				}
			];

			const { sourcingMaterialProductions } = genesisReligiousTextMaterial.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

	describe('Godblog (play) (material)', () => {

		it('includes writers of this material and its source material (with corresponding sur-material and sur-sur-material) grouped by their respective credits', () => {

			const expectedWritingCredits = [
				{
					model: 'WRITING_CREDIT',
					name: 'by',
					entities: [
						{
							model: 'PERSON',
							uuid: JEANETTE_WINTERSON_PERSON_UUID,
							name: 'Jeanette Winterson'
						},
						{
							model: 'COMPANY',
							uuid: ONLY_FRUITS_COMPANY_UUID,
							name: 'Only Fruits'
						}
					]
				},
				{
					model: 'WRITING_CREDIT',
					name: 'written in response to',
					entities: [
						{
							model: 'MATERIAL',
							uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
							name: 'Genesis',
							format: 'religious text',
							year: 1611,
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
								name: 'The Old Testament',
								surMaterial: {
									model: 'MATERIAL',
									uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'The Bible: King James Version'
								}
							},
							writingCredits: [
								{
									model: 'WRITING_CREDIT',
									name: 'by',
									entities: [
										{
											model: 'PERSON',
											uuid: RICHARD_BANCROFT_PERSON_UUID,
											name: 'Richard Bancroft'
										},
										{
											model: 'COMPANY',
											uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
											name: 'The Canterbury Editors'
										}
									]
								}
							]
						}
					]
				}
			];

			const { writingCredits } = godblogPlayMaterial.body;

			expect(writingCredits).to.deep.equal(expectedWritingCredits);

		});

	});

	describe('Richard Bancroft (person)', () => {

		it('includes materials that used their work as source material, with corresponding sur-material and sur-sur-material', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'written in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { sourcingMaterials } = richardBancroftPerson.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

	});

	describe('The Canterbury Editors (company)', () => {

		it('includes materials that used their work as source material, with corresponding sur-material and sur-sur-material', () => {

			const expectedSourcingMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'written in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { sourcingMaterials } = theCanterburyEditorsCompany.body;

			expect(sourcingMaterials).to.deep.equal(expectedSourcingMaterials);

		});

	});

	describe('Jeanette Winterson (person)', () => {

		it('includes materials they have written, with corresponding sur-material and sur-sur-materials', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'written in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { materials } = jeanetteWintersonPerson.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Only Fruits (company)', () => {

		it('includes materials it has written, with corresponding sur-material and sur-sur-material', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'written in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { materials } = onlyFruitsCompany.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('Godblog at Bush Theatre (production)', () => {

		it('includes in its material data the writers of the material and its source material (with corresponding sur-material and sur-sur-material)', () => {

			const expectedMaterial = {
				model: 'MATERIAL',
				uuid: GODBLOG_PLAY_MATERIAL_UUID,
				name: 'Godblog',
				format: 'play',
				year: 2011,
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
					name: 'The Books of the Old Testament',
					surMaterial: {
						model: 'MATERIAL',
						uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
						name: 'Sixty-Six Books'
					}
				},
				writingCredits: [
					{
						model: 'WRITING_CREDIT',
						name: 'by',
						entities: [
							{
								model: 'PERSON',
								uuid: JEANETTE_WINTERSON_PERSON_UUID,
								name: 'Jeanette Winterson'
							},
							{
								model: 'COMPANY',
								uuid: ONLY_FRUITS_COMPANY_UUID,
								name: 'Only Fruits'
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'written in response to',
						entities: [
							{
								model: 'MATERIAL',
								uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
								name: 'Genesis',
								format: 'religious text',
								year: 1611,
								surMaterial: {
									model: 'MATERIAL',
									uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'The Old Testament',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Bible: King James Version'
									}
								},
								writingCredits: [
									{
										model: 'WRITING_CREDIT',
										name: 'by',
										entities: [
											{
												model: 'PERSON',
												uuid: RICHARD_BANCROFT_PERSON_UUID,
												name: 'Richard Bancroft'
											},
											{
												model: 'COMPANY',
												uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
												name: 'The Canterbury Editors'
											}
										]
									}
								]
							}
						]
					}
				]
			};

			const { material } = godblogBushTheatreProduction.body;

			expect(material).to.deep.equal(expectedMaterial);

		});

	});

	describe('God (character)', () => {

		it('includes in its material data the writers of the material and its source material (with corresponding sur-material and sur-sur-materials)', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'written in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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

			const { materials } = godCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

	});

	describe('materials list', () => {

		it('includes writers of the materials and their corresponding source material (with corresponding sur-material)', async () => {

			const response = await chai.request(app)
				.get('/materials');

			const expectedResponseBody = [
				{
					model: 'MATERIAL',
					uuid: GODBLOG_PLAY_MATERIAL_UUID,
					name: 'Godblog',
					format: 'play',
					year: 2011,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_BOOKS_OF_THE_OLD_TESTAMENT_PLAYS_MATERIAL_UUID,
						name: 'The Books of the Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: SIXTY_SIX_BOOKS_PLAYS_MATERIAL_UUID,
							name: 'Sixty-Six Books'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JEANETTE_WINTERSON_PERSON_UUID,
									name: 'Jeanette Winterson'
								},
								{
									model: 'COMPANY',
									uuid: ONLY_FRUITS_COMPANY_UUID,
									name: 'Only Fruits'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'written in response to',
							entities: [
								{
									model: 'MATERIAL',
									uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
									name: 'Genesis',
									format: 'religious text',
									year: 1611,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
										name: 'The Old Testament',
										surMaterial: {
											model: 'MATERIAL',
											uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
											name: 'The Bible: King James Version'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: RICHARD_BANCROFT_PERSON_UUID,
													name: 'Richard Bancroft'
												},
												{
													model: 'COMPANY',
													uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
													name: 'The Canterbury Editors'
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
					uuid: GENESIS_RELIGIOUS_TEXT_MATERIAL_UUID,
					name: 'Genesis',
					format: 'religious text',
					year: 1611,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_OLD_TESTAMENT_RELIGIOUS_TEXT_MATERIAL_UUID,
						name: 'The Old Testament',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_BIBLE_KING_JAMES_VERSION_RELIGIOUS_TEXT_MATERIAL_UUID,
							name: 'The Bible: King James Version'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: RICHARD_BANCROFT_PERSON_UUID,
									name: 'Richard Bancroft'
								},
								{
									model: 'COMPANY',
									uuid: THE_CANTERBURY_EDITORS_COMPANY_UUID,
									name: 'The Canterbury Editors'
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

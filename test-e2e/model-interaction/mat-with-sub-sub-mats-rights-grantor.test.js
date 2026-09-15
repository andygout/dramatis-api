import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import request from '../test-helpers/model-interaction-request.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';

const THIRTY_FIRST_CENTURY_TIME_UUID = '31ST_CENTURY_TIME_UUID';
const THIRTY_TENS_TIME_UUID = '3010S_TIME_UUID';
const THIRTY_EIGHTEEN_TIME_UUID = '3018_TIME_UUID';
const THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID = 'THE_FELLOWSHIP_OF_THE_RING_MATERIAL_1_UUID';
const J_R_R_TOLKIEN_PERSON_UUID = 'J_R_R_TOLKIEN_PERSON_UUID';
const THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID = 'THE_LORD_OF_THE_RINGS_MATERIAL_1_UUID';
const TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID = 'TOLKIENS_LEGENDARIUM_MATERIAL_1_UUID';
const THE_FELLOWSHIP_OF_THE_RING_PLAY_MATERIAL_UUID = 'THE_FELLOWSHIP_OF_THE_RING_MATERIAL_2_UUID';
const SHAUN_MCKENNA_PERSON_UUID = 'SHAUN_MCKENNA_PERSON_UUID';
const THE_TOLKIEN_ESTATE_COMPANY_UUID = 'THE_TOLKIEN_ESTATE_COMPANY_UUID';
const BAILLIE_TOLKIEN_PERSON_UUID = 'BAILLIE_TOLKIEN_PERSON_UUID';
const HOBBITON_PLACE_UUID = 'HOBBITON_PLACE_UUID';
const KITCHEN_LOCALE_UUID = 'KITCHEN_LOCALE_UUID';
const THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID = 'THE_LORD_OF_THE_RINGS_MATERIAL_2_UUID';
const WESTFARTHING_PLACE_UUID = 'WESTFARTHING_PLACE_UUID';
const HOBBIT_HOLE_LOCALE_UUID = 'HOBBIT_HOLE_LOCALE_UUID';
const TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID = 'TOLKIENS_LEGENDARIUM_MATERIAL_2_UUID';
const THE_SHIRE_PLACE_UUID = 'THE_SHIRE_PLACE_UUID';
const PARTY_FIELD_LOCALE_UUID = 'PARTY_FIELD_LOCALE_UUID';
const THE_FELLOWSHIP_OF_THE_RING_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID =
	'THE_FELLOWSHIP_OF_THE_RING_PRODUCTION_UUID';
const THEATRE_ROYAL_DRURY_LANE_VENUE_UUID = 'THEATRE_ROYAL_DRURY_LANE_VENUE_UUID';
const THE_LORD_OF_THE_RINGS_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID = 'THE_LORD_OF_THE_RINGS_PRODUCTION_UUID';
const TOLKIENS_LEGENDARIUM_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID = 'TOLKIENS_LEGENDARIUM_PRODUCTION_UUID';
const THE_FELLOWSHIP_OF_THE_RING_WATERMILL_PRODUCTION_UUID = 'THE_FELLOWSHIP_OF_THE_RING_PRODUCTION_2_UUID';
const WATERMILL_THEATRE_VENUE_UUID = 'WATERMILL_THEATRE_VENUE_UUID';
const THE_LORD_OF_THE_RINGS_WATERMILL_PRODUCTION_UUID = 'THE_LORD_OF_THE_RINGS_PRODUCTION_2_UUID';
const TOLKIENS_LEGENDARIUM_WATERMILL_PRODUCTION_UUID = 'TOLKIENS_LEGENDARIUM_PRODUCTION_2_UUID';

let theTolkienEstateCompany;
let baillieTolkienPerson;
let thirtyFirstCenturyTime;
let thirtyEighteenTime;
let hobbitonPlace;
let kitchenLocale;

describe('Material with sub-sub-materials and rights grantor credits thereof', () => {
	before(async () => {
		stubUuidToCountMapClient.clear();

		await purgeDatabase();

		await request(app).post('/times').send({
			name: '31st century',
			fromDate: '3001-01-01',
			toDate: '3100-12-31'
		});

		await request(app).post('/times').send({
			name: '3010s',
			fromDate: '3010-01-01',
			toDate: '3019-12-31'
		});

		await request(app).post('/times').send({
			name: '3018',
			fromDate: '3011-01-01',
			toDate: '3011-12-31'
		});

		await request(app)
			.post('/materials')
			.send({
				name: 'The Fellowship of the Ring',
				differentiator: '1',
				format: 'novel',
				year: '1954',
				writingCredits: [
					{
						entities: [
							{
								name: 'J R R Tolkien'
							}
						]
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'The Lord of the Rings',
				differentiator: '1',
				format: 'trilogy of novels',
				year: '1955',
				writingCredits: [
					{
						entities: [
							{
								name: 'J R R Tolkien'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Fellowship of the Ring',
						differentiator: '1'
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: "Tolkien's Legendarium",
				differentiator: '1',
				format: 'body of writing',
				year: '1977',
				writingCredits: [
					{
						entities: [
							{
								name: 'J R R Tolkien'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Lord of the Rings',
						differentiator: '1'
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'The Fellowship of the Ring',
				differentiator: '2',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Shaun McKenna'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Fellowship of the Ring',
								differentiator: '1'
							}
						]
					},
					{
						name: 'by special arrangement with',
						creditType: 'RIGHTS_GRANTOR',
						entities: [
							{
								model: 'COMPANY',
								name: 'The Tolkien Estate'
							},
							{
								name: 'Baillie Tolkien'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '3018'
						},
						place: {
							name: 'Hobbiton'
						},
						locale: {
							name: 'Kitchen'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'The Lord of the Rings',
				differentiator: '2',
				format: 'trilogy of plays',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Shaun McKenna'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Lord of the Rings',
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Fellowship of the Ring',
						differentiator: '2'
					}
				],
				settings: [
					{
						time: {
							name: '3010s'
						},
						place: {
							name: 'Westfarthing'
						},
						locale: {
							name: 'Hobbit-hole'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: "Tolkien's Legendarium",
				differentiator: '2',
				format: 'collection of plays',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Shaun McKenna'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: "Tolkien's Legendarium",
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Lord of the Rings',
						differentiator: '2'
					}
				],
				settings: [
					{
						time: {
							name: '31st century'
						},
						place: {
							name: 'The Shire'
						},
						locale: {
							name: 'Party field'
						}
					}
				]
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'The Fellowship of the Ring',
				startDate: '2007-05-09',
				pressDate: '2007-06-19',
				endDate: '2008-07-20',
				material: {
					name: 'The Fellowship of the Ring',
					differentiator: '2'
				},
				venue: {
					name: 'Theatre Royal Drury Lane'
				}
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'The Lord of the Rings',
				startDate: '2007-05-09',
				pressDate: '2007-06-19',
				endDate: '2008-07-20',
				material: {
					name: 'The Lord of the Rings',
					differentiator: '2'
				},
				venue: {
					name: 'Theatre Royal Drury Lane'
				},
				subProductions: [
					{
						uuid: THE_FELLOWSHIP_OF_THE_RING_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID
					}
				]
			});

		await request(app)
			.post('/productions')
			.send({
				name: "Tolkien's Legendarium",
				startDate: '2007-05-09',
				pressDate: '2007-06-19',
				endDate: '2008-07-20',
				material: {
					name: "Tolkien's Legendarium",
					differentiator: '2'
				},
				venue: {
					name: 'Theatre Royal Drury Lane'
				},
				subProductions: [
					{
						uuid: THE_LORD_OF_THE_RINGS_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID
					}
				]
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'The Fellowship of the Ring',
				startDate: '2023-07-25',
				pressDate: '2023-08-01',
				endDate: '2023-10-15',
				material: {
					name: 'The Fellowship of the Ring',
					differentiator: '2'
				},
				venue: {
					name: 'Watermill Theatre'
				}
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'The Lord of the Rings',
				startDate: '2023-07-25',
				pressDate: '2023-08-01',
				endDate: '2023-10-15',
				material: {
					name: 'The Lord of the Rings',
					differentiator: '2'
				},
				venue: {
					name: 'Watermill Theatre'
				},
				subProductions: [
					{
						uuid: THE_FELLOWSHIP_OF_THE_RING_WATERMILL_PRODUCTION_UUID
					}
				]
			});

		await request(app)
			.post('/productions')
			.send({
				name: "Tolkien's Legendarium",
				startDate: '2023-07-25',
				pressDate: '2023-08-01',
				endDate: '2023-10-15',
				material: {
					name: "Tolkien's Legendarium",
					differentiator: '2'
				},
				venue: {
					name: 'Watermill Theatre'
				},
				subProductions: [
					{
						uuid: THE_LORD_OF_THE_RINGS_WATERMILL_PRODUCTION_UUID
					}
				]
			});

		theTolkienEstateCompany = await request(app).get(`/companies/${THE_TOLKIEN_ESTATE_COMPANY_UUID}`);

		baillieTolkienPerson = await request(app).get(`/people/${BAILLIE_TOLKIEN_PERSON_UUID}`);

		thirtyFirstCenturyTime = await request(app).get(`/times/${THIRTY_FIRST_CENTURY_TIME_UUID}`);

		thirtyEighteenTime = await request(app).get(`/times/${THIRTY_EIGHTEEN_TIME_UUID}`);

		hobbitonPlace = await request(app).get(`/places/${HOBBITON_PLACE_UUID}`);

		kitchenLocale = await request(app).get(`/locales/${KITCHEN_LOCALE_UUID}`);
	});

	describe('The Tolkien Estate (company)', () => {
		it('includes materials for which it has a rights grantor credit, with corresponding sur-material and sur-sur-material', () => {
			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FELLOWSHIP_OF_THE_RING_PLAY_MATERIAL_UUID,
					name: 'The Fellowship of the Ring',
					format: 'play',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
						name: 'The Lord of the Rings',
						surMaterial: {
							model: 'MATERIAL',
							uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
							name: "Tolkien's Legendarium"
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID,
									name: 'The Fellowship of the Ring',
									format: 'novel',
									year: 1954,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
										name: 'The Lord of the Rings',
										surMaterial: {
											model: 'MATERIAL',
											uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
											name: "Tolkien's Legendarium"
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'by special arrangement with',
							entities: [
								{
									model: 'COMPANY',
									uuid: THE_TOLKIEN_ESTATE_COMPANY_UUID,
									name: 'The Tolkien Estate'
								},
								{
									model: 'PERSON',
									uuid: BAILLIE_TOLKIEN_PERSON_UUID,
									name: 'Baillie Tolkien'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = theTolkienEstateCompany.body;

			assert.deepEqual(rightsGrantorMaterials, expectedRightsGrantorMaterials);
		});

		it('includes productions of materials for which they have granted rights, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {
			const expectedRightsGrantorMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_FELLOWSHIP_OF_THE_RING_WATERMILL_PRODUCTION_UUID,
					name: 'The Fellowship of the Ring',
					startDate: '2023-07-25',
					endDate: '2023-10-15',
					venue: {
						model: 'VENUE',
						uuid: WATERMILL_THEATRE_VENUE_UUID,
						name: 'Watermill Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_LORD_OF_THE_RINGS_WATERMILL_PRODUCTION_UUID,
						name: 'The Lord of the Rings',
						surProduction: {
							model: 'PRODUCTION',
							uuid: TOLKIENS_LEGENDARIUM_WATERMILL_PRODUCTION_UUID,
							name: "Tolkien's Legendarium"
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_FELLOWSHIP_OF_THE_RING_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
					name: 'The Fellowship of the Ring',
					startDate: '2007-05-09',
					endDate: '2008-07-20',
					venue: {
						model: 'VENUE',
						uuid: THEATRE_ROYAL_DRURY_LANE_VENUE_UUID,
						name: 'Theatre Royal Drury Lane',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_LORD_OF_THE_RINGS_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
						name: 'The Lord of the Rings',
						surProduction: {
							model: 'PRODUCTION',
							uuid: TOLKIENS_LEGENDARIUM_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
							name: "Tolkien's Legendarium"
						}
					}
				}
			];

			const { rightsGrantorMaterialProductions } = theTolkienEstateCompany.body;

			assert.deepEqual(rightsGrantorMaterialProductions, expectedRightsGrantorMaterialProductions);
		});
	});

	describe('Baillie Tolkien (person)', () => {
		it('includes materials for which they have a rights grantor credit, with corresponding sur-material and sur-sur-material', () => {
			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FELLOWSHIP_OF_THE_RING_PLAY_MATERIAL_UUID,
					name: 'The Fellowship of the Ring',
					format: 'play',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
						name: 'The Lord of the Rings',
						surMaterial: {
							model: 'MATERIAL',
							uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
							name: "Tolkien's Legendarium"
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID,
									name: 'The Fellowship of the Ring',
									format: 'novel',
									year: 1954,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
										name: 'The Lord of the Rings',
										surMaterial: {
											model: 'MATERIAL',
											uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
											name: "Tolkien's Legendarium"
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'by special arrangement with',
							entities: [
								{
									model: 'COMPANY',
									uuid: THE_TOLKIEN_ESTATE_COMPANY_UUID,
									name: 'The Tolkien Estate'
								},
								{
									model: 'PERSON',
									uuid: BAILLIE_TOLKIEN_PERSON_UUID,
									name: 'Baillie Tolkien'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = baillieTolkienPerson.body;

			assert.deepEqual(rightsGrantorMaterials, expectedRightsGrantorMaterials);
		});

		it('includes productions of materials for which they have granted rights, with corresponding sur-production; will exclude sur-productions when included via sub-production association', () => {
			const expectedRightsGrantorMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_FELLOWSHIP_OF_THE_RING_WATERMILL_PRODUCTION_UUID,
					name: 'The Fellowship of the Ring',
					startDate: '2023-07-25',
					endDate: '2023-10-15',
					venue: {
						model: 'VENUE',
						uuid: WATERMILL_THEATRE_VENUE_UUID,
						name: 'Watermill Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_LORD_OF_THE_RINGS_WATERMILL_PRODUCTION_UUID,
						name: 'The Lord of the Rings',
						surProduction: {
							model: 'PRODUCTION',
							uuid: TOLKIENS_LEGENDARIUM_WATERMILL_PRODUCTION_UUID,
							name: "Tolkien's Legendarium"
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: THE_FELLOWSHIP_OF_THE_RING_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
					name: 'The Fellowship of the Ring',
					startDate: '2007-05-09',
					endDate: '2008-07-20',
					venue: {
						model: 'VENUE',
						uuid: THEATRE_ROYAL_DRURY_LANE_VENUE_UUID,
						name: 'Theatre Royal Drury Lane',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_LORD_OF_THE_RINGS_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
						name: 'The Lord of the Rings',
						surProduction: {
							model: 'PRODUCTION',
							uuid: TOLKIENS_LEGENDARIUM_THEATRE_ROYAL_DRURY_LANE_PRODUCTION_UUID,
							name: "Tolkien's Legendarium"
						}
					}
				}
			];

			const { rightsGrantorMaterialProductions } = baillieTolkienPerson.body;

			assert.deepEqual(rightsGrantorMaterialProductions, expectedRightsGrantorMaterialProductions);
		});
	});

	describe('31st century (time)', () => {
		it("includes in its and its contained sub-times' material data the writers and rights grantors of the material", () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
					name: "Tolkien's Legendarium",
					format: 'collection of plays',
					year: 2007,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
									name: "Tolkien's Legendarium",
									format: 'body of writing',
									year: 1977,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
												}
											]
										}
									]
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTY_FIRST_CENTURY_TIME_UUID,
								name: '31st century'
							},
							place: {
								model: 'PLACE',
								uuid: THE_SHIRE_PLACE_UUID,
								name: 'The Shire'
							},
							locale: {
								model: 'LOCALE',
								uuid: PARTY_FIELD_LOCALE_UUID,
								name: 'Party field'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THE_FELLOWSHIP_OF_THE_RING_PLAY_MATERIAL_UUID,
					name: 'The Fellowship of the Ring',
					format: 'play',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
						name: 'The Lord of the Rings',
						surMaterial: {
							model: 'MATERIAL',
							uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
							name: "Tolkien's Legendarium"
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID,
									name: 'The Fellowship of the Ring',
									format: 'novel',
									year: 1954,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
										name: 'The Lord of the Rings',
										surMaterial: {
											model: 'MATERIAL',
											uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
											name: "Tolkien's Legendarium"
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'by special arrangement with',
							entities: [
								{
									model: 'COMPANY',
									uuid: THE_TOLKIEN_ESTATE_COMPANY_UUID,
									name: 'The Tolkien Estate'
								},
								{
									model: 'PERSON',
									uuid: BAILLIE_TOLKIEN_PERSON_UUID,
									name: 'Baillie Tolkien'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTY_EIGHTEEN_TIME_UUID,
								name: '3018'
							},
							place: {
								model: 'PLACE',
								uuid: HOBBITON_PLACE_UUID,
								name: 'Hobbiton'
							},
							locale: {
								model: 'LOCALE',
								uuid: KITCHEN_LOCALE_UUID,
								name: 'Kitchen'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
					name: 'The Lord of the Rings',
					format: 'trilogy of plays',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
						name: "Tolkien's Legendarium",
						surMaterial: null
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
									name: 'The Lord of the Rings',
									format: 'trilogy of novels',
									year: 1955,
									surMaterial: {
										model: 'MATERIAL',
										uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
										name: "Tolkien's Legendarium",
										surMaterial: null
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
												}
											]
										}
									]
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTY_TENS_TIME_UUID,
								name: '3010s'
							},
							place: {
								model: 'PLACE',
								uuid: WESTFARTHING_PLACE_UUID,
								name: 'Westfarthing'
							},
							locale: {
								model: 'LOCALE',
								uuid: HOBBIT_HOLE_LOCALE_UUID,
								name: 'Hobbit-hole'
							}
						}
					]
				}
			];

			const { materials } = thirtyFirstCenturyTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	// Note: A test for "3010s (time)" which might appear here is unnecessary
	// because the use cases it would test are already covered by the tests in
	// mat-with-sub-mats-rights-grantor.test.js.

	describe('3018 (time)', () => {
		it('includes in its material data the writers and rights grantors of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FELLOWSHIP_OF_THE_RING_PLAY_MATERIAL_UUID,
					name: 'The Fellowship of the Ring',
					format: 'play',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
						name: 'The Lord of the Rings',
						surMaterial: {
							model: 'MATERIAL',
							uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
							name: "Tolkien's Legendarium"
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID,
									name: 'The Fellowship of the Ring',
									format: 'novel',
									year: 1954,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
										name: 'The Lord of the Rings',
										surMaterial: {
											model: 'MATERIAL',
											uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
											name: "Tolkien's Legendarium"
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'by special arrangement with',
							entities: [
								{
									model: 'COMPANY',
									uuid: THE_TOLKIEN_ESTATE_COMPANY_UUID,
									name: 'The Tolkien Estate'
								},
								{
									model: 'PERSON',
									uuid: BAILLIE_TOLKIEN_PERSON_UUID,
									name: 'Baillie Tolkien'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTY_EIGHTEEN_TIME_UUID,
								name: '3018'
							},
							place: {
								model: 'PLACE',
								uuid: HOBBITON_PLACE_UUID,
								name: 'Hobbiton'
							},
							locale: {
								model: 'LOCALE',
								uuid: KITCHEN_LOCALE_UUID,
								name: 'Kitchen'
							}
						}
					]
				}
			];

			const { materials } = thirtyEighteenTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Hobbiton (place)', () => {
		it('includes in its material data the writers and rights grantors of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FELLOWSHIP_OF_THE_RING_PLAY_MATERIAL_UUID,
					name: 'The Fellowship of the Ring',
					format: 'play',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
						name: 'The Lord of the Rings',
						surMaterial: {
							model: 'MATERIAL',
							uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
							name: "Tolkien's Legendarium"
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID,
									name: 'The Fellowship of the Ring',
									format: 'novel',
									year: 1954,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
										name: 'The Lord of the Rings',
										surMaterial: {
											model: 'MATERIAL',
											uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
											name: "Tolkien's Legendarium"
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'by special arrangement with',
							entities: [
								{
									model: 'COMPANY',
									uuid: THE_TOLKIEN_ESTATE_COMPANY_UUID,
									name: 'The Tolkien Estate'
								},
								{
									model: 'PERSON',
									uuid: BAILLIE_TOLKIEN_PERSON_UUID,
									name: 'Baillie Tolkien'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTY_EIGHTEEN_TIME_UUID,
								name: '3018'
							},
							place: {
								model: 'PLACE',
								uuid: HOBBITON_PLACE_UUID,
								name: 'Hobbiton'
							},
							locale: {
								model: 'LOCALE',
								uuid: KITCHEN_LOCALE_UUID,
								name: 'Kitchen'
							}
						}
					]
				}
			];

			const { materials } = hobbitonPlace.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Kitchen (locale)', () => {
		it('includes in its material data the writers and rights grantors of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FELLOWSHIP_OF_THE_RING_PLAY_MATERIAL_UUID,
					name: 'The Fellowship of the Ring',
					format: 'play',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
						name: 'The Lord of the Rings',
						surMaterial: {
							model: 'MATERIAL',
							uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
							name: "Tolkien's Legendarium"
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID,
									name: 'The Fellowship of the Ring',
									format: 'novel',
									year: 1954,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
										name: 'The Lord of the Rings',
										surMaterial: {
											model: 'MATERIAL',
											uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
											name: "Tolkien's Legendarium"
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'by special arrangement with',
							entities: [
								{
									model: 'COMPANY',
									uuid: THE_TOLKIEN_ESTATE_COMPANY_UUID,
									name: 'The Tolkien Estate'
								},
								{
									model: 'PERSON',
									uuid: BAILLIE_TOLKIEN_PERSON_UUID,
									name: 'Baillie Tolkien'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTY_EIGHTEEN_TIME_UUID,
								name: '3018'
							},
							place: {
								model: 'PLACE',
								uuid: HOBBITON_PLACE_UUID,
								name: 'Hobbiton'
							},
							locale: {
								model: 'LOCALE',
								uuid: KITCHEN_LOCALE_UUID,
								name: 'Kitchen'
							}
						}
					]
				}
			];

			const { materials } = kitchenLocale.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});
});

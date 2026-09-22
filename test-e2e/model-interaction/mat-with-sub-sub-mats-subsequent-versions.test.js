import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import request from '../test-helpers/model-interaction-request.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';

const FOURTEENTH_CENTURY_TIME_UUID = '14TH_CENTURY_TIME_UUID';
const THIRTEEN_NINETIES_TIME_UUID = '1390S_TIME_UUID';
const THIRTEEN_NINETY_NINE_TIME_UUID = '1399_TIME_UUID';
const UNICORN_THEATRE_VENUE_UUID = 'UNICORN_THEATRE_VENUE_UUID';
const WESTON_THEATRE_VENUE_UUID = 'WESTON_THEATRE_VENUE_UUID';
const RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID = 'RICHARD_II_MATERIAL_1_UUID';
const WILLIAM_SHAKESPEARE_PERSON_UUID = 'WILLIAM_SHAKESPEARE_PERSON_UUID';
const THE_KINGS_MEN_COMPANY_UUID = 'THE_KINGS_MEN_COMPANY_UUID';
const FLINT_CASTLE_PLACE_UUID = 'FLINT_CASTLE_PLACE_UUID';
const CASTLE_ROOM_LOCALE_UUID = 'CASTLE_ROOM_LOCALE_UUID';
const LORD_ROSS_CHARACTER_UUID = 'LORD_ROSS_CHARACTER_UUID';
const THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID = 'THE_FIRST_HENRIAD_MATERIAL_1_UUID';
const FLINT_PLACE_UUID = 'FLINT_PLACE_UUID';
const CASTLE_LOCALE_UUID = 'CASTLE_LOCALE_UUID';
const THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID = 'THE_HENRIAD_MATERIAL_1_UUID';
const FLINTSHIRE_PLACE_UUID = 'FLINTSHIRE_PLACE_UUID';
const CASTLE_GROUNDS_LOCALE_UUID = 'CASTLE_GROUNDS_LOCALE_UUID';
const RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID = 'RICHARD_II_MATERIAL_2_UUID';
const CARL_HEAP_PERSON_UUID = 'CARL_HEAP_PERSON_UUID';
const BEGGARS_BELIEF_THEATRE_COMPANY_UUID = 'BEGGARS_BELIEF_THEATRE_COMPANY_COMPANY_UUID';
const THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID = 'THE_FIRST_HENRIAD_MATERIAL_2_UUID';
const THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID = 'THE_HENRIAD_MATERIAL_2_UUID';
const RICHARD_II_ROYAL_SHAKESPEARE_PRODUCTION_UUID = 'RICHARD_II_PRODUCTION_UUID';
const ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID = 'ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID';
const THE_FIRST_HENRIAD_ROYAL_SHAKESPEARE_PRODUCTION_UUID = 'THE_FIRST_HENRIAD_PRODUCTION_UUID';
const THE_HENRIAD_ROYAL_SHAKESPEARE_PRODUCTION_UUID = 'THE_HENRIAD_PRODUCTION_UUID';
const RICHARD_II_UNICORN_PRODUCTION_UUID = 'RICHARD_II_PRODUCTION_2_UUID';
const THE_FIRST_HENRIAD_UNICORN_PRODUCTION_UUID = 'THE_FIRST_HENRIAD_PRODUCTION_2_UUID';
const THE_HENRIAD_UNICORN_PRODUCTION_UUID = 'THE_HENRIAD_PRODUCTION_2_UUID';

let richardIIOriginalVersionMaterial;
let richardIISubsequentVersionMaterial;
let theFirstHenriadSubsequentVersionMaterial;
let theHenriadSubsequentVersionMaterial;
let williamShakespearePerson;
let theKingsMenCompany;
let fourteenthCenturyTime;
let thirteenNinetyNineTime;
let flintCastlePlace;
let castleRoomLocale;
let lordRossCharacter;

describe('Material with sub-sub-materials and subsequent versions thereof', () => {
	before(async () => {
		stubUuidToCountMapClient.clear();

		await purgeDatabase();

		await request(app).post('/times').send({
			name: '14th century',
			fromDate: '1301-01-01',
			toDate: '1400-12-31'
		});

		await request(app).post('/times').send({
			name: '1390s',
			fromDate: '1390-01-01',
			toDate: '1399-12-31'
		});

		await request(app).post('/times').send({
			name: '1399',
			fromDate: '1399-01-01',
			toDate: '1399-12-31'
		});

		await request(app)
			.post('/venues')
			.send({
				name: 'Unicorn Theatre',
				subVenues: [
					{
						name: 'Weston Theatre'
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'Richard II',
				differentiator: '1',
				format: 'play',
				year: '1595',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: "The King's Men"
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '1399'
						},
						place: {
							name: 'Flint Castle'
						},
						locale: {
							name: 'Castle room'
						}
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Lord Ross'
							}
						]
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'The First Henriad',
				differentiator: '1',
				format: 'sub-group of plays',
				year: '1599',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: "The King's Men"
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Richard II',
						differentiator: '1'
					}
				],
				settings: [
					{
						time: {
							name: '1390s'
						},
						place: {
							name: 'Flint'
						},
						locale: {
							name: 'Castle'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'The Henriad',
				differentiator: '1',
				format: 'group of plays',
				year: '1599',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: "The King's Men"
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The First Henriad',
						differentiator: '1'
					}
				],
				settings: [
					{
						time: {
							name: '14th century'
						},
						place: {
							name: 'Flintshire'
						},
						locale: {
							name: 'Castle grounds'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'Richard II',
				differentiator: '2',
				format: 'play',
				year: '2009',
				originalVersionMaterial: {
					name: 'Richard II',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: "The King's Men"
							}
						]
					},
					{
						name: 'adapted for young people by',
						entities: [
							{
								name: 'Carl Heap'
							},
							{
								model: 'COMPANY',
								name: 'Beggars Belief Theatre Company'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '1399'
						},
						place: {
							name: 'Flint Castle'
						},
						locale: {
							name: 'Castle room'
						}
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Lord Ross'
							}
						]
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'The First Henriad',
				differentiator: '2',
				format: 'sub-group of plays',
				year: '2009',
				originalVersionMaterial: {
					name: 'The First Henriad',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: "The King's Men"
							}
						]
					},
					{
						name: 'adapted for young people by',
						entities: [
							{
								name: 'Carl Heap'
							},
							{
								model: 'COMPANY',
								name: 'Beggars Belief Theatre Company'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Richard II',
						differentiator: '2'
					}
				],
				settings: [
					{
						time: {
							name: '1390s'
						},
						place: {
							name: 'Flint'
						},
						locale: {
							name: 'Castle'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'The Henriad',
				differentiator: '2',
				format: 'group of plays',
				year: '2009',
				originalVersionMaterial: {
					name: 'The Henriad',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'William Shakespeare'
							},
							{
								model: 'COMPANY',
								name: "The King's Men"
							}
						]
					},
					{
						name: 'adapted for young people by',
						entities: [
							{
								name: 'Carl Heap'
							},
							{
								model: 'COMPANY',
								name: 'Beggars Belief Theatre Company'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The First Henriad',
						differentiator: '2'
					}
				],
				settings: [
					{
						time: {
							name: '14th century'
						},
						place: {
							name: 'Flintshire'
						},
						locale: {
							name: 'Castle grounds'
						}
					}
				]
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'Richard II',
				startDate: '2013-10-10',
				pressDate: '2013-10-17',
				endDate: '2013-11-16',
				material: {
					name: 'Richard II',
					differentiator: '2'
				},
				venue: {
					name: 'Royal Shakespeare Theatre'
				}
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'The First Henriad',
				startDate: '2013-10-10',
				pressDate: '2013-10-17',
				endDate: '2013-11-16',
				material: {
					name: 'The First Henriad',
					differentiator: '2'
				},
				venue: {
					name: 'Royal Shakespeare Theatre'
				},
				subProductions: [
					{
						uuid: RICHARD_II_ROYAL_SHAKESPEARE_PRODUCTION_UUID
					}
				]
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'The Henriad',
				startDate: '2013-10-10',
				pressDate: '2013-10-17',
				endDate: '2013-11-16',
				material: {
					name: 'The Henriad',
					differentiator: '2'
				},
				venue: {
					name: 'Royal Shakespeare Theatre'
				},
				subProductions: [
					{
						uuid: THE_FIRST_HENRIAD_ROYAL_SHAKESPEARE_PRODUCTION_UUID
					}
				]
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'Richard II',
				startDate: '2013-08-12',
				pressDate: '2013-08-19',
				endDate: '2013-09-28',
				material: {
					name: 'Richard II',
					differentiator: '2'
				},
				venue: {
					name: 'Weston Theatre'
				}
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'The First Henriad',
				startDate: '2013-08-12',
				pressDate: '2013-08-19',
				endDate: '2013-09-28',
				material: {
					name: 'The First Henriad',
					differentiator: '2'
				},
				venue: {
					name: 'Weston Theatre'
				},
				subProductions: [
					{
						uuid: RICHARD_II_UNICORN_PRODUCTION_UUID
					}
				]
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'The Henriad',
				startDate: '2013-08-12',
				pressDate: '2013-08-19',
				endDate: '2013-09-28',
				material: {
					name: 'The Henriad',
					differentiator: '2'
				},
				venue: {
					name: 'Weston Theatre'
				},
				subProductions: [
					{
						uuid: THE_FIRST_HENRIAD_UNICORN_PRODUCTION_UUID
					}
				]
			});

		richardIIOriginalVersionMaterial = await request(app).get(
			`/materials/${RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID}`
		);

		richardIISubsequentVersionMaterial = await request(app).get(
			`/materials/${RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID}`
		);

		theFirstHenriadSubsequentVersionMaterial = await request(app).get(
			`/materials/${THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID}`
		);

		theHenriadSubsequentVersionMaterial = await request(app).get(
			`/materials/${THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID}`
		);

		williamShakespearePerson = await request(app).get(`/people/${WILLIAM_SHAKESPEARE_PERSON_UUID}`);

		theKingsMenCompany = await request(app).get(`/companies/${THE_KINGS_MEN_COMPANY_UUID}`);

		fourteenthCenturyTime = await request(app).get(`/times/${FOURTEENTH_CENTURY_TIME_UUID}`);

		thirteenNinetyNineTime = await request(app).get(`/times/${THIRTEEN_NINETY_NINE_TIME_UUID}`);

		flintCastlePlace = await request(app).get(`/places/${FLINT_CASTLE_PLACE_UUID}`);

		castleRoomLocale = await request(app).get(`/locales/${CASTLE_ROOM_LOCALE_UUID}`);

		lordRossCharacter = await request(app).get(`/characters/${LORD_ROSS_CHARACTER_UUID}`);
	});

	describe('Richard II (original version) (material)', () => {
		it('includes subsequent versions of this material, with corresponding sur-material and sur-sur-material; will omit original version writers', () => {
			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = richardIIOriginalVersionMaterial.body;

			assert.deepEqual(subsequentVersionMaterials, expectedSubsequentVersionMaterials);
		});

		it('includes productions of subsequent versions, including the sur-production and sur-sur-production', () => {
			const expectedSubsequentVersionMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '2013-10-10',
					endDate: '2013-11-16',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_FIRST_HENRIAD_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
						name: 'The First Henriad',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_HENRIAD_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
							name: 'The Henriad'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_UNICORN_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '2013-08-12',
					endDate: '2013-09-28',
					venue: {
						model: 'VENUE',
						uuid: WESTON_THEATRE_VENUE_UUID,
						name: 'Weston Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: UNICORN_THEATRE_VENUE_UUID,
							name: 'Unicorn Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_FIRST_HENRIAD_UNICORN_PRODUCTION_UUID,
						name: 'The First Henriad',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_HENRIAD_UNICORN_PRODUCTION_UUID,
							name: 'The Henriad'
						}
					}
				}
			];

			const { subsequentVersionMaterialProductions } = richardIIOriginalVersionMaterial.body;

			assert.deepEqual(subsequentVersionMaterialProductions, expectedSubsequentVersionMaterialProductions);
		});
	});

	describe('Richard II (subsequent version) (material)', () => {
		it('includes original version of this material, with corresponding sur-material and sur-sur-material', () => {
			const expectedOriginalVersionMaterial = {
				model: 'MATERIAL',
				uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
				name: 'Richard II',
				format: 'play',
				year: 1595,
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'The First Henriad',
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The Henriad'
					}
				},
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
								name: "The King's Men"
							}
						]
					}
				]
			};

			const { originalVersionMaterial } = richardIISubsequentVersionMaterial.body;

			assert.deepEqual(originalVersionMaterial, expectedOriginalVersionMaterial);
		});

		it('includes its sur-material and sur-sur-material with their corresponding original versions', () => {
			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
				name: 'The First Henriad',
				subtitle: null,
				format: 'sub-group of plays',
				year: 2009,
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
								name: "The King's Men"
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'adapted for young people by',
						entities: [
							{
								model: 'PERSON',
								uuid: CARL_HEAP_PERSON_UUID,
								name: 'Carl Heap'
							},
							{
								model: 'COMPANY',
								uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
								name: 'Beggars Belief Theatre Company'
							}
						]
					}
				],
				originalVersionMaterial: {
					model: 'MATERIAL',
					uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'The First Henriad',
					format: 'sub-group of plays',
					year: 1599,
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
									name: "The King's Men"
								}
							]
						}
					],
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The Henriad',
						surMaterial: null
					}
				},
				surMaterial: {
					model: 'MATERIAL',
					uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'The Henriad',
					subtitle: null,
					format: 'group of plays',
					year: 2009,
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
									name: "The King's Men"
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					],
					originalVersionMaterial: {
						model: 'MATERIAL',
						uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The Henriad',
						format: 'group of plays',
						year: 1599,
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
										name: "The King's Men"
									}
								]
							}
						],
						surMaterial: null
					},
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: FOURTEENTH_CENTURY_TIME_UUID,
								name: '14th century'
							},
							place: {
								model: 'PLACE',
								uuid: FLINTSHIRE_PLACE_UUID,
								name: 'Flintshire'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_GROUNDS_LOCALE_UUID,
								name: 'Castle grounds'
							}
						}
					],
					characterGroups: []
				},
				settings: [
					{
						model: 'SETTING',
						time: {
							model: 'TIME',
							uuid: THIRTEEN_NINETIES_TIME_UUID,
							name: '1390s'
						},
						place: {
							model: 'PLACE',
							uuid: FLINT_PLACE_UUID,
							name: 'Flint'
						},
						locale: {
							model: 'LOCALE',
							uuid: CASTLE_LOCALE_UUID,
							name: 'Castle'
						}
					}
				],
				characterGroups: []
			};

			const { surMaterial } = richardIISubsequentVersionMaterial.body;

			assert.deepEqual(surMaterial, expectedSurMaterial);
		});
	});

	describe('The First Henriad (subsequent version) (material)', () => {
		it('includes its sur-material with its corresponding original version', () => {
			const expectedSurMaterial = {
				model: 'MATERIAL',
				uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
				name: 'The Henriad',
				subtitle: null,
				format: 'group of plays',
				year: 2009,
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
								name: "The King's Men"
							}
						]
					},
					{
						model: 'WRITING_CREDIT',
						name: 'adapted for young people by',
						entities: [
							{
								model: 'PERSON',
								uuid: CARL_HEAP_PERSON_UUID,
								name: 'Carl Heap'
							},
							{
								model: 'COMPANY',
								uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
								name: 'Beggars Belief Theatre Company'
							}
						]
					}
				],
				originalVersionMaterial: {
					model: 'MATERIAL',
					uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'The Henriad',
					format: 'group of plays',
					year: 1599,
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
									name: "The King's Men"
								}
							]
						}
					],
					surMaterial: null
				},
				surMaterial: null,
				settings: [
					{
						model: 'SETTING',
						time: {
							model: 'TIME',
							uuid: FOURTEENTH_CENTURY_TIME_UUID,
							name: '14th century'
						},
						place: {
							model: 'PLACE',
							uuid: FLINTSHIRE_PLACE_UUID,
							name: 'Flintshire'
						},
						locale: {
							model: 'LOCALE',
							uuid: CASTLE_GROUNDS_LOCALE_UUID,
							name: 'Castle grounds'
						}
					}
				],
				characterGroups: []
			};

			const { surMaterial } = theFirstHenriadSubsequentVersionMaterial.body;

			assert.deepEqual(surMaterial, expectedSurMaterial);
		});

		it('includes its sub-materials with their corresponding original versions', () => {
			const expectedSubMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					subtitle: null,
					format: 'play',
					year: 2009,
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
									name: "The King's Men"
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					],
					originalVersionMaterial: {
						model: 'MATERIAL',
						uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'Richard II',
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
										name: "The King's Men"
									}
								]
							}
						],
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
							name: 'The First Henriad',
							surMaterial: {
								model: 'MATERIAL',
								uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
								name: 'The Henriad'
							}
						}
					},
					subMaterials: [],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETY_NINE_TIME_UUID,
								name: '1399'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_CASTLE_PLACE_UUID,
								name: 'Flint Castle'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_ROOM_LOCALE_UUID,
								name: 'Castle room'
							}
						}
					],
					characterGroups: [
						{
							model: 'CHARACTER_GROUP',
							name: null,
							position: null,
							characters: [
								{
									model: 'CHARACTER',
									uuid: LORD_ROSS_CHARACTER_UUID,
									name: 'Lord Ross',
									qualifier: null
								}
							]
						}
					]
				}
			];

			const { subMaterials } = theFirstHenriadSubsequentVersionMaterial.body;

			assert.deepEqual(subMaterials, expectedSubMaterials);
		});
	});

	describe('The Henriad (subsequent version) (material)', () => {
		it('includes its sub-materials and sub-sub-materials with their corresponding original versions', () => {
			const expectedSubMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'The First Henriad',
					subtitle: null,
					format: 'sub-group of plays',
					year: 2009,
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
									name: "The King's Men"
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					],
					originalVersionMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						format: 'sub-group of plays',
						year: 1599,
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
										name: "The King's Men"
									}
								]
							}
						],
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
							name: 'The Henriad',
							surMaterial: null
						}
					},
					subMaterials: [
						{
							model: 'MATERIAL',
							uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'Richard II',
							subtitle: null,
							format: 'play',
							year: 2009,
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
											name: "The King's Men"
										}
									]
								},
								{
									model: 'WRITING_CREDIT',
									name: 'adapted for young people by',
									entities: [
										{
											model: 'PERSON',
											uuid: CARL_HEAP_PERSON_UUID,
											name: 'Carl Heap'
										},
										{
											model: 'COMPANY',
											uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
											name: 'Beggars Belief Theatre Company'
										}
									]
								}
							],
							originalVersionMaterial: {
								model: 'MATERIAL',
								uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
								name: 'Richard II',
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
												name: "The King's Men"
											}
										]
									}
								],
								surMaterial: {
									model: 'MATERIAL',
									uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
									name: 'The First Henriad',
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
										name: 'The Henriad'
									}
								}
							},
							settings: [
								{
									model: 'SETTING',
									time: {
										model: 'TIME',
										uuid: THIRTEEN_NINETY_NINE_TIME_UUID,
										name: '1399'
									},
									place: {
										model: 'PLACE',
										uuid: FLINT_CASTLE_PLACE_UUID,
										name: 'Flint Castle'
									},
									locale: {
										model: 'LOCALE',
										uuid: CASTLE_ROOM_LOCALE_UUID,
										name: 'Castle room'
									}
								}
							],
							characterGroups: [
								{
									model: 'CHARACTER_GROUP',
									name: null,
									position: null,
									characters: [
										{
											model: 'CHARACTER',
											uuid: LORD_ROSS_CHARACTER_UUID,
											name: 'Lord Ross',
											qualifier: null
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
								uuid: THIRTEEN_NINETIES_TIME_UUID,
								name: '1390s'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_PLACE_UUID,
								name: 'Flint'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_LOCALE_UUID,
								name: 'Castle'
							}
						}
					],
					characterGroups: []
				}
			];

			const { subMaterials } = theHenriadSubsequentVersionMaterial.body;

			assert.deepEqual(subMaterials, expectedSubMaterials);
		});
	});

	describe('William Shakespeare (person)', () => {
		it('includes subsequent versions of materials they originally wrote, with corresponding sur-material and sur-sur-material; will exclude sur-materials when included via sub-material association; will omit original version writers', () => {
			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = williamShakespearePerson.body;

			assert.deepEqual(subsequentVersionMaterials, expectedSubsequentVersionMaterials);
		});

		it('includes productions of subsequent versions of materials they originally wrote, with corresponding sur-material and sur-sur-material; will exclude sur-materials when included via sub-material association', () => {
			const expectedSubsequentVersionMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '2013-10-10',
					endDate: '2013-11-16',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_FIRST_HENRIAD_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
						name: 'The First Henriad',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_HENRIAD_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
							name: 'The Henriad'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_UNICORN_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '2013-08-12',
					endDate: '2013-09-28',
					venue: {
						model: 'VENUE',
						uuid: WESTON_THEATRE_VENUE_UUID,
						name: 'Weston Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: UNICORN_THEATRE_VENUE_UUID,
							name: 'Unicorn Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_FIRST_HENRIAD_UNICORN_PRODUCTION_UUID,
						name: 'The First Henriad',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_HENRIAD_UNICORN_PRODUCTION_UUID,
							name: 'The Henriad'
						}
					}
				}
			];

			const { subsequentVersionMaterialProductions } = williamShakespearePerson.body;

			assert.deepEqual(subsequentVersionMaterialProductions, expectedSubsequentVersionMaterialProductions);
		});
	});

	describe("The King's Men (company)", () => {
		it('includes subsequent versions of materials it originally wrote, with corresponding sur-material and sur-sur-material; will exclude sur-materials when included via sub-material association; will omit original version writers', () => {
			const expectedSubsequentVersionMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionMaterials } = theKingsMenCompany.body;

			assert.deepEqual(subsequentVersionMaterials, expectedSubsequentVersionMaterials);
		});

		it('includes productions of subsequent versions of materials they originally wrote, with corresponding sur-material and sur-sur-material; will exclude sur-materials when included via sub-material association', () => {
			const expectedSubsequentVersionMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '2013-10-10',
					endDate: '2013-11-16',
					venue: {
						model: 'VENUE',
						uuid: ROYAL_SHAKESPEARE_THEATRE_VENUE_UUID,
						name: 'Royal Shakespeare Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_FIRST_HENRIAD_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
						name: 'The First Henriad',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_HENRIAD_ROYAL_SHAKESPEARE_PRODUCTION_UUID,
							name: 'The Henriad'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_UNICORN_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '2013-08-12',
					endDate: '2013-09-28',
					venue: {
						model: 'VENUE',
						uuid: WESTON_THEATRE_VENUE_UUID,
						name: 'Weston Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: UNICORN_THEATRE_VENUE_UUID,
							name: 'Unicorn Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_FIRST_HENRIAD_UNICORN_PRODUCTION_UUID,
						name: 'The First Henriad',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_HENRIAD_UNICORN_PRODUCTION_UUID,
							name: 'The Henriad'
						}
					}
				}
			];

			const { subsequentVersionMaterialProductions } = theKingsMenCompany.body;

			assert.deepEqual(subsequentVersionMaterialProductions, expectedSubsequentVersionMaterialProductions);
		});
	});

	describe('14th century (time)', () => {
		it("includes in its and its contained sub-times' material data the writers and (for subsequent versions) original version writers of the material", () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
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
									name: "The King's Men"
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETY_NINE_TIME_UUID,
								name: '1399'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_CASTLE_PLACE_UUID,
								name: 'Flint Castle'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_ROOM_LOCALE_UUID,
								name: 'Castle room'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'The First Henriad',
					format: 'sub-group of plays',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The Henriad',
						surMaterial: null
					},
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
									name: "The King's Men"
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETIES_TIME_UUID,
								name: '1390s'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_PLACE_UUID,
								name: 'Flint'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_LOCALE_UUID,
								name: 'Castle'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'The Henriad',
					format: 'group of plays',
					year: 2009,
					surMaterial: null,
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
									name: "The King's Men"
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: FOURTEENTH_CENTURY_TIME_UUID,
								name: '14th century'
							},
							place: {
								model: 'PLACE',
								uuid: FLINTSHIRE_PLACE_UUID,
								name: 'Flintshire'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_GROUNDS_LOCALE_UUID,
								name: 'Castle grounds'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'The First Henriad',
					format: 'sub-group of plays',
					year: 1599,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The Henriad',
						surMaterial: null
					},
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
									name: "The King's Men"
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETIES_TIME_UUID,
								name: '1390s'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_PLACE_UUID,
								name: 'Flint'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_LOCALE_UUID,
								name: 'Castle'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'The Henriad',
					format: 'group of plays',
					year: 1599,
					surMaterial: null,
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
									name: "The King's Men"
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: FOURTEENTH_CENTURY_TIME_UUID,
								name: '14th century'
							},
							place: {
								model: 'PLACE',
								uuid: FLINTSHIRE_PLACE_UUID,
								name: 'Flintshire'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_GROUNDS_LOCALE_UUID,
								name: 'Castle grounds'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 1595,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
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
									name: "The King's Men"
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETY_NINE_TIME_UUID,
								name: '1399'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_CASTLE_PLACE_UUID,
								name: 'Flint Castle'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_ROOM_LOCALE_UUID,
								name: 'Castle room'
							}
						}
					]
				}
			];

			const { materials } = fourteenthCenturyTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	// Note: A test for "1390s (time)" which might appear here is unnecessary
	// because the use cases it would test are already covered by the tests in
	// mat-with-sub-mats-subsequent-versions.test.js.

	describe('1399 (time)', () => {
		it('includes in its material data the writers and (for subsequent versions) original version writers of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
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
									name: "The King's Men"
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETY_NINE_TIME_UUID,
								name: '1399'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_CASTLE_PLACE_UUID,
								name: 'Flint Castle'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_ROOM_LOCALE_UUID,
								name: 'Castle room'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 1595,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
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
									name: "The King's Men"
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETY_NINE_TIME_UUID,
								name: '1399'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_CASTLE_PLACE_UUID,
								name: 'Flint Castle'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_ROOM_LOCALE_UUID,
								name: 'Castle room'
							}
						}
					]
				}
			];

			const { materials } = thirteenNinetyNineTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Flint Castle (place)', () => {
		it('includes in its material data the writers and (for subsequent versions) original version writers of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
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
									name: "The King's Men"
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETY_NINE_TIME_UUID,
								name: '1399'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_CASTLE_PLACE_UUID,
								name: 'Flint Castle'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_ROOM_LOCALE_UUID,
								name: 'Castle room'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 1595,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
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
									name: "The King's Men"
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETY_NINE_TIME_UUID,
								name: '1399'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_CASTLE_PLACE_UUID,
								name: 'Flint Castle'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_ROOM_LOCALE_UUID,
								name: 'Castle room'
							}
						}
					]
				}
			];

			const { materials } = flintCastlePlace.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Castle room (locale)', () => {
		it('includes in its material data the writers and (for subsequent versions) original version writers of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
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
									name: "The King's Men"
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETY_NINE_TIME_UUID,
								name: '1399'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_CASTLE_PLACE_UUID,
								name: 'Flint Castle'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_ROOM_LOCALE_UUID,
								name: 'Castle room'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 1595,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
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
									name: "The King's Men"
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: THIRTEEN_NINETY_NINE_TIME_UUID,
								name: '1399'
							},
							place: {
								model: 'PLACE',
								uuid: FLINT_CASTLE_PLACE_UUID,
								name: 'Flint Castle'
							},
							locale: {
								model: 'LOCALE',
								uuid: CASTLE_ROOM_LOCALE_UUID,
								name: 'Castle room'
							}
						}
					]
				}
			];

			const { materials } = castleRoomLocale.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Lord Ross (character)', () => {
		it('includes in its material data the writers and (for subsequent versions) original version writers of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 2009,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_SUBSEQUENT_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
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
									name: "The King's Men"
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'adapted for young people by',
							entities: [
								{
									model: 'PERSON',
									uuid: CARL_HEAP_PERSON_UUID,
									name: 'Carl Heap'
								},
								{
									model: 'COMPANY',
									uuid: BEGGARS_BELIEF_THEATRE_COMPANY_UUID,
									name: 'Beggars Belief Theatre Company'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: RICHARD_II_ORIGINAL_VERSION_MATERIAL_UUID,
					name: 'Richard II',
					format: 'play',
					year: 1595,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_FIRST_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
						name: 'The First Henriad',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_HENRIAD_ORIGINAL_VERSION_MATERIAL_UUID,
							name: 'The Henriad'
						}
					},
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
									name: "The King's Men"
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = lordRossCharacter.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});
});

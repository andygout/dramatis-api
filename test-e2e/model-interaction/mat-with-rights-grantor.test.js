import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import request from '../test-helpers/model-interaction-request.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';

const LIVERPOOL_EVERYMAN_PLAYHOUSE_VENUE_UUID = 'LIVERPOOL_EVERYMAN_PLAYHOUSE_VENUE_UUID';
const PLAYHOUSE_THEATRE_VENUE_UUID = 'PLAYHOUSE_THEATRE_VENUE_UUID';
const THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID = 'THE_LADYKILLERS_MATERIAL_1_UUID';
const WILLIAM_ROSE_PERSON_UUID = 'WILLIAM_ROSE_PERSON_UUID';
const THE_LADYKILLERS_PLAY_MATERIAL_UUID = 'THE_LADYKILLERS_MATERIAL_2_UUID';
const GRAHAM_LINEHAN_PERSON_UUID = 'GRAHAM_LINEHAN_PERSON_UUID';
const STUDIOCANAL_COMPANY_UUID = 'STUDIOCANAL_COMPANY_UUID';
const ALISON_MEESE_PERSON_UUID = 'ALISON_MEESE_PERSON_UUID';
const NINETEEN_FIFTIES_TIME_UUID = '1950S_TIME_UUID';
const KINGS_CROSS_PLACE_UUID = 'KINGS_CROSS_PLACE_UUID';
const BOARDING_HOUSE_LOCALE_UUID = 'BOARDING_HOUSE_LOCALE_UUID';
const MRS_WILBERFORCE_CHARACTER_UUID = 'MRS_WILBERFORCE_CHARACTER_UUID';
const THE_LADYKILLERS_PLAYHOUSE_PRODUCTION_UUID = 'THE_LADYKILLERS_PRODUCTION_UUID';
const THE_LADYKILLERS_GIELGUD_PRODUCTION_UUID = 'THE_LADYKILLERS_PRODUCTION_2_UUID';
const GIELGUD_THEATRE_VENUE_UUID = 'GIELGUD_THEATRE_VENUE_UUID';

let studioCanalCompany;
let alisonMeesePerson;
let nineteenFiftiesTime;
let kingsCrossPlace;
let boardingHouseLocale;
let mrsWilberforceCharacter;

describe('Material with rights grantor credits', () => {
	before(async () => {
		stubUuidToCountMapClient.clear();

		await purgeDatabase();

		await request(app)
			.post('/venues')
			.send({
				name: 'Liverpool Everyman & Playhouse',
				subVenues: [
					{
						name: 'Playhouse Theatre'
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'The Ladykillers',
				differentiator: '1',
				format: 'motion picture screenplay',
				year: '1955',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Rose'
							}
						]
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'The Ladykillers',
				differentiator: '2',
				format: 'play',
				year: '2011',
				writingCredits: [
					{
						entities: [
							{
								name: 'Graham Linehan'
							}
						]
					},
					{
						name: 'from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Ladykillers',
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
								name: 'StudioCanal'
							},
							{
								name: 'Alison Meese'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '1950s'
						},
						place: {
							name: "King's Cross"
						},
						locale: {
							name: 'Boarding house'
						}
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Mrs Wilberforce'
							}
						]
					}
				]
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'The Ladykillers',
				startDate: '2011-11-03',
				endDate: '2012-04-19',
				material: {
					name: 'The Ladykillers',
					differentiator: '2'
				},
				venue: {
					name: 'Playhouse Theatre'
				}
			});

		await request(app)
			.post('/productions')
			.send({
				name: 'The Ladykillers',
				startDate: '2011-11-26',
				pressDate: '2011-12-07',
				endDate: '2012-04-14',
				material: {
					name: 'The Ladykillers',
					differentiator: '2'
				},
				venue: {
					name: 'Gielgud Theatre'
				}
			});

		studioCanalCompany = await request(app).get(`/companies/${STUDIOCANAL_COMPANY_UUID}`);

		alisonMeesePerson = await request(app).get(`/people/${ALISON_MEESE_PERSON_UUID}`);

		nineteenFiftiesTime = await request(app).get(`/times/${NINETEEN_FIFTIES_TIME_UUID}`);

		kingsCrossPlace = await request(app).get(`/places/${KINGS_CROSS_PLACE_UUID}`);

		boardingHouseLocale = await request(app).get(`/locales/${BOARDING_HOUSE_LOCALE_UUID}`);

		mrsWilberforceCharacter = await request(app).get(`/characters/${MRS_WILBERFORCE_CHARACTER_UUID}`);
	});

	describe('StudioCanal (company)', () => {
		it('includes materials for which it has a rights grantor credit', () => {
			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LADYKILLERS_PLAY_MATERIAL_UUID,
					name: 'The Ladykillers',
					format: 'play',
					year: 2011,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: GRAHAM_LINEHAN_PERSON_UUID,
									name: 'Graham Linehan'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID,
									name: 'The Ladykillers',
									format: 'motion picture screenplay',
									year: 1955,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_ROSE_PERSON_UUID,
													name: 'William Rose'
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
									uuid: STUDIOCANAL_COMPANY_UUID,
									name: 'StudioCanal'
								},
								{
									model: 'PERSON',
									uuid: ALISON_MEESE_PERSON_UUID,
									name: 'Alison Meese'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = studioCanalCompany.body;

			assert.deepEqual(rightsGrantorMaterials, expectedRightsGrantorMaterials);
		});

		it('includes productions of materials for which they have granted rights', () => {
			const expectedRightsGrantorMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_LADYKILLERS_GIELGUD_PRODUCTION_UUID,
					name: 'The Ladykillers',
					startDate: '2011-11-26',
					endDate: '2012-04-14',
					venue: {
						model: 'VENUE',
						uuid: GIELGUD_THEATRE_VENUE_UUID,
						name: 'Gielgud Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: THE_LADYKILLERS_PLAYHOUSE_PRODUCTION_UUID,
					name: 'The Ladykillers',
					startDate: '2011-11-03',
					endDate: '2012-04-19',
					venue: {
						model: 'VENUE',
						uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
						name: 'Playhouse Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: LIVERPOOL_EVERYMAN_PLAYHOUSE_VENUE_UUID,
							name: 'Liverpool Everyman & Playhouse'
						}
					},
					surProduction: null
				}
			];

			const { rightsGrantorMaterialProductions } = studioCanalCompany.body;

			assert.deepEqual(rightsGrantorMaterialProductions, expectedRightsGrantorMaterialProductions);
		});
	});

	describe('Alison Meese (person)', () => {
		it('includes materials for which they have a rights grantor credit', () => {
			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LADYKILLERS_PLAY_MATERIAL_UUID,
					name: 'The Ladykillers',
					format: 'play',
					year: 2011,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: GRAHAM_LINEHAN_PERSON_UUID,
									name: 'Graham Linehan'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID,
									name: 'The Ladykillers',
									format: 'motion picture screenplay',
									year: 1955,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_ROSE_PERSON_UUID,
													name: 'William Rose'
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
									uuid: STUDIOCANAL_COMPANY_UUID,
									name: 'StudioCanal'
								},
								{
									model: 'PERSON',
									uuid: ALISON_MEESE_PERSON_UUID,
									name: 'Alison Meese'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = alisonMeesePerson.body;

			assert.deepEqual(rightsGrantorMaterials, expectedRightsGrantorMaterials);
		});

		it('includes productions of materials for which they have granted rights', () => {
			const expectedRightsGrantorMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_LADYKILLERS_GIELGUD_PRODUCTION_UUID,
					name: 'The Ladykillers',
					startDate: '2011-11-26',
					endDate: '2012-04-14',
					venue: {
						model: 'VENUE',
						uuid: GIELGUD_THEATRE_VENUE_UUID,
						name: 'Gielgud Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: THE_LADYKILLERS_PLAYHOUSE_PRODUCTION_UUID,
					name: 'The Ladykillers',
					startDate: '2011-11-03',
					endDate: '2012-04-19',
					venue: {
						model: 'VENUE',
						uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
						name: 'Playhouse Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: LIVERPOOL_EVERYMAN_PLAYHOUSE_VENUE_UUID,
							name: 'Liverpool Everyman & Playhouse'
						}
					},
					surProduction: null
				}
			];

			const { rightsGrantorMaterialProductions } = alisonMeesePerson.body;

			assert.deepEqual(rightsGrantorMaterialProductions, expectedRightsGrantorMaterialProductions);
		});
	});

	describe('1950s (time)', () => {
		it('includes in its material data the writers and rights grantors of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LADYKILLERS_PLAY_MATERIAL_UUID,
					name: 'The Ladykillers',
					format: 'play',
					year: 2011,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: GRAHAM_LINEHAN_PERSON_UUID,
									name: 'Graham Linehan'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID,
									name: 'The Ladykillers',
									format: 'motion picture screenplay',
									year: 1955,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_ROSE_PERSON_UUID,
													name: 'William Rose'
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
									uuid: STUDIOCANAL_COMPANY_UUID,
									name: 'StudioCanal'
								},
								{
									model: 'PERSON',
									uuid: ALISON_MEESE_PERSON_UUID,
									name: 'Alison Meese'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_FIFTIES_TIME_UUID,
								name: '1950s'
							},
							place: {
								model: 'PLACE',
								uuid: KINGS_CROSS_PLACE_UUID,
								name: "King's Cross"
							},
							locale: {
								model: 'LOCALE',
								uuid: BOARDING_HOUSE_LOCALE_UUID,
								name: 'Boarding house'
							}
						}
					]
				}
			];

			const { materials } = nineteenFiftiesTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe("King's Cross (place)", () => {
		it('includes in its material data the writers and rights grantors of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LADYKILLERS_PLAY_MATERIAL_UUID,
					name: 'The Ladykillers',
					format: 'play',
					year: 2011,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: GRAHAM_LINEHAN_PERSON_UUID,
									name: 'Graham Linehan'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID,
									name: 'The Ladykillers',
									format: 'motion picture screenplay',
									year: 1955,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_ROSE_PERSON_UUID,
													name: 'William Rose'
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
									uuid: STUDIOCANAL_COMPANY_UUID,
									name: 'StudioCanal'
								},
								{
									model: 'PERSON',
									uuid: ALISON_MEESE_PERSON_UUID,
									name: 'Alison Meese'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_FIFTIES_TIME_UUID,
								name: '1950s'
							},
							place: {
								model: 'PLACE',
								uuid: KINGS_CROSS_PLACE_UUID,
								name: "King's Cross"
							},
							locale: {
								model: 'LOCALE',
								uuid: BOARDING_HOUSE_LOCALE_UUID,
								name: 'Boarding house'
							}
						}
					]
				}
			];

			const { materials } = kingsCrossPlace.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Boarding house (locale)', () => {
		it('includes in its material data the writers and rights grantors of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LADYKILLERS_PLAY_MATERIAL_UUID,
					name: 'The Ladykillers',
					format: 'play',
					year: 2011,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: GRAHAM_LINEHAN_PERSON_UUID,
									name: 'Graham Linehan'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID,
									name: 'The Ladykillers',
									format: 'motion picture screenplay',
									year: 1955,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_ROSE_PERSON_UUID,
													name: 'William Rose'
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
									uuid: STUDIOCANAL_COMPANY_UUID,
									name: 'StudioCanal'
								},
								{
									model: 'PERSON',
									uuid: ALISON_MEESE_PERSON_UUID,
									name: 'Alison Meese'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_FIFTIES_TIME_UUID,
								name: '1950s'
							},
							place: {
								model: 'PLACE',
								uuid: KINGS_CROSS_PLACE_UUID,
								name: "King's Cross"
							},
							locale: {
								model: 'LOCALE',
								uuid: BOARDING_HOUSE_LOCALE_UUID,
								name: 'Boarding house'
							}
						}
					]
				}
			];

			const { materials } = boardingHouseLocale.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Mrs Wilberforce (character)', () => {
		it('includes in its material data the writers and rights grantors of the material', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LADYKILLERS_PLAY_MATERIAL_UUID,
					name: 'The Ladykillers',
					format: 'play',
					year: 2011,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: GRAHAM_LINEHAN_PERSON_UUID,
									name: 'Graham Linehan'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID,
									name: 'The Ladykillers',
									format: 'motion picture screenplay',
									year: 1955,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_ROSE_PERSON_UUID,
													name: 'William Rose'
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
									uuid: STUDIOCANAL_COMPANY_UUID,
									name: 'StudioCanal'
								},
								{
									model: 'PERSON',
									uuid: ALISON_MEESE_PERSON_UUID,
									name: 'Alison Meese'
								}
							]
						}
					],
					depictions: []
				}
			];

			const { materials } = mrsWilberforceCharacter.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});
});

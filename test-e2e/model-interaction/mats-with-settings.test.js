import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import request from '../test-helpers/model-interaction-request.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';

const UNCLE_VANYA_MATERIAL_UUID = 'UNCLE_VANYA_MATERIAL_UUID';
const ANTON_CHEKHOV_PERSON_UUID = 'ANTON_CHEKHOV_PERSON_UUID';
const EIGHTEEN_NINETY_FIVE_TIME_UUID = '1895_TIME_UUID';
const RUSSIA_PLACE_UUID = 'RUSSIA_PLACE_UUID';
const COUNTRY_ESTATE_LOCALE_UUID = 'COUNTRY_ESTATE_LOCALE_UUID';
const EIGHTEEN_NINETY_SIX_TIME_UUID = '1896_TIME_UUID';
const ROMANIA_PLACE_UUID = 'ROMANIA_PLACE_UUID';
const HILLSIDE_LOCALE_UUID = 'HILLSIDE_LOCALE_UUID';
const THREE_SISTERS_MATERIAL_UUID = 'THREE_SISTERS_MATERIAL_UUID';
const THE_CHERRY_ORCHARD_MATERIAL_UUID = 'THE_CHERRY_ORCHARD_MATERIAL_UUID';

let uncleVanyaMaterial;
let eighteenNinetyFiveTime;
let russiaPlace;
let countryEstateLocale;

describe('Materials with settings', () => {
	before(async () => {
		stubUuidToCountMapClient.clear();

		await purgeDatabase();

		await request(app)
			.post('/materials')
			.send({
				name: 'Three Sisters',
				format: 'play',
				year: '1901',
				writingCredits: [
					{
						entities: [
							{
								name: 'Anton Chekhov'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '1895'
						},
						place: {
							name: 'Russia'
						},
						locale: {
							name: 'Country estate'
						}
					},
					{
						time: {
							name: '1896'
						},
						place: {
							name: 'Russia'
						},
						locale: {
							name: 'Country estate'
						}
					},
					{
						time: {
							name: '1895'
						},
						place: {
							name: 'Romania'
						},
						locale: {
							name: 'Country estate'
						}
					},
					{
						time: {
							name: '1895'
						},
						place: {
							name: 'Russia'
						},
						locale: {
							name: 'Hillside'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'Uncle Vanya',
				format: 'play',
				year: '1897',
				writingCredits: [
					{
						entities: [
							{
								name: 'Anton Chekhov'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '1895'
						},
						place: {
							name: 'Russia'
						},
						locale: {
							name: 'Country estate'
						}
					},
					{
						time: {
							name: '1896'
						},
						place: {
							name: 'Russia'
						},
						locale: {
							name: 'Country estate'
						}
					},
					{
						time: {
							name: '1895'
						},
						place: {
							name: 'Romania'
						},
						locale: {
							name: 'Country estate'
						}
					},
					{
						time: {
							name: '1895'
						},
						place: {
							name: 'Russia'
						},
						locale: {
							name: 'Hillside'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'The Cherry Orchard',
				format: 'play',
				year: '1904',
				writingCredits: [
					{
						entities: [
							{
								name: 'Anton Chekhov'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '1895'
						},
						place: {
							name: 'Russia'
						},
						locale: {
							name: 'Country estate'
						}
					},
					{
						time: {
							name: '1896'
						},
						place: {
							name: 'Russia'
						},
						locale: {
							name: 'Country estate'
						}
					},
					{
						time: {
							name: '1895'
						},
						place: {
							name: 'Romania'
						},
						locale: {
							name: 'Country estate'
						}
					},
					{
						time: {
							name: '1895'
						},
						place: {
							name: 'Russia'
						},
						locale: {
							name: 'Hillside'
						}
					}
				]
			});

		uncleVanyaMaterial = await request(app).get(`/materials/${UNCLE_VANYA_MATERIAL_UUID}`);

		eighteenNinetyFiveTime = await request(app).get(`/times/${EIGHTEEN_NINETY_FIVE_TIME_UUID}`);

		russiaPlace = await request(app).get(`/places/${RUSSIA_PLACE_UUID}`);

		countryEstateLocale = await request(app).get(`/locales/${COUNTRY_ESTATE_LOCALE_UUID}`);
	});

	describe('Uncle Vanya (material)', () => {
		it('includes settings', () => {
			const expectedSettings = [
				{
					model: 'SETTING',
					time: {
						model: 'TIME',
						uuid: EIGHTEEN_NINETY_FIVE_TIME_UUID,
						name: '1895'
					},
					place: {
						model: 'PLACE',
						uuid: RUSSIA_PLACE_UUID,
						name: 'Russia'
					},
					locale: {
						model: 'LOCALE',
						uuid: COUNTRY_ESTATE_LOCALE_UUID,
						name: 'Country estate'
					}
				},
				{
					model: 'SETTING',
					time: {
						model: 'TIME',
						uuid: EIGHTEEN_NINETY_SIX_TIME_UUID,
						name: '1896'
					},
					place: {
						model: 'PLACE',
						uuid: RUSSIA_PLACE_UUID,
						name: 'Russia'
					},
					locale: {
						model: 'LOCALE',
						uuid: COUNTRY_ESTATE_LOCALE_UUID,
						name: 'Country estate'
					}
				},
				{
					model: 'SETTING',
					time: {
						model: 'TIME',
						uuid: EIGHTEEN_NINETY_FIVE_TIME_UUID,
						name: '1895'
					},
					place: {
						model: 'PLACE',
						uuid: ROMANIA_PLACE_UUID,
						name: 'Romania'
					},
					locale: {
						model: 'LOCALE',
						uuid: COUNTRY_ESTATE_LOCALE_UUID,
						name: 'Country estate'
					}
				},
				{
					model: 'SETTING',
					time: {
						model: 'TIME',
						uuid: EIGHTEEN_NINETY_FIVE_TIME_UUID,
						name: '1895'
					},
					place: {
						model: 'PLACE',
						uuid: RUSSIA_PLACE_UUID,
						name: 'Russia'
					},
					locale: {
						model: 'LOCALE',
						uuid: HILLSIDE_LOCALE_UUID,
						name: 'Hillside'
					}
				}
			];

			const { settings } = uncleVanyaMaterial.body;

			assert.deepEqual(settings, expectedSettings);
		});
	});

	describe('1890s (time)', () => {
		it('includes materials for which it was a setting', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_CHERRY_ORCHARD_MATERIAL_UUID,
					name: 'The Cherry Orchard',
					format: 'play',
					year: 1904,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ANTON_CHEKHOV_PERSON_UUID,
									name: 'Anton Chekhov'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THREE_SISTERS_MATERIAL_UUID,
					name: 'Three Sisters',
					format: 'play',
					year: 1901,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ANTON_CHEKHOV_PERSON_UUID,
									name: 'Anton Chekhov'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: UNCLE_VANYA_MATERIAL_UUID,
					name: 'Uncle Vanya',
					format: 'play',
					year: 1897,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ANTON_CHEKHOV_PERSON_UUID,
									name: 'Anton Chekhov'
								}
							]
						}
					]
				}
			];

			const { materials } = eighteenNinetyFiveTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Russia (place)', () => {
		it('includes materials for which it was a setting', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_CHERRY_ORCHARD_MATERIAL_UUID,
					name: 'The Cherry Orchard',
					format: 'play',
					year: 1904,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ANTON_CHEKHOV_PERSON_UUID,
									name: 'Anton Chekhov'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THREE_SISTERS_MATERIAL_UUID,
					name: 'Three Sisters',
					format: 'play',
					year: 1901,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ANTON_CHEKHOV_PERSON_UUID,
									name: 'Anton Chekhov'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: UNCLE_VANYA_MATERIAL_UUID,
					name: 'Uncle Vanya',
					format: 'play',
					year: 1897,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ANTON_CHEKHOV_PERSON_UUID,
									name: 'Anton Chekhov'
								}
							]
						}
					]
				}
			];

			const { materials } = russiaPlace.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Country estate (locale)', () => {
		it('includes materials for which it was a setting', () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_CHERRY_ORCHARD_MATERIAL_UUID,
					name: 'The Cherry Orchard',
					format: 'play',
					year: 1904,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ANTON_CHEKHOV_PERSON_UUID,
									name: 'Anton Chekhov'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: THREE_SISTERS_MATERIAL_UUID,
					name: 'Three Sisters',
					format: 'play',
					year: 1901,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ANTON_CHEKHOV_PERSON_UUID,
									name: 'Anton Chekhov'
								}
							]
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: UNCLE_VANYA_MATERIAL_UUID,
					name: 'Uncle Vanya',
					format: 'play',
					year: 1897,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ANTON_CHEKHOV_PERSON_UUID,
									name: 'Anton Chekhov'
								}
							]
						}
					]
				}
			];

			const { materials } = countryEstateLocale.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});
});

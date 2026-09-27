import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import app from '../../src/app.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';
import request from '../test-helpers/model-interaction-request.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';

const HAN_DYNASTY_TIME_UUID = 'HAN_DYNASTY_TIME_UUID';
const WESTERN_HAN_DYNASTY_TIME_UUID = 'WESTERN_HAN_DYNASTY_TIME_UUID';
const XIN_DYNASTY_TIME_UUID = 'XIN_DYNASTY_TIME_UUID';
const EASTERN_HAN_DYNASTY_TIME_UUID = 'EASTERN_HAN_DYNASTY_TIME_UUID';
const SECOND_CENTURY_BCE_TIME_UUID = '2ND_CENTURY_BCE_TIME_UUID';
const FIRST_CENTURY_BCE_TIME_UUID = '1ST_CENTURY_BCE_TIME_UUID';
const FIRST_CENTURY_TIME_UUID = '1ST_CENTURY_TIME_UUID';
const SECOND_CENTURY_TIME_UUID = '2ND_CENTURY_TIME_UUID';
const TWENTIETH_CENTURY_TIME_UUID = '20TH_CENTURY_TIME_UUID';
const NINETEEN_FIFTIES_TIME_UUID = '1950S_TIME_UUID';
const NINETEEN_SIXTIES_TIME_UUID = '1960S_TIME_UUID';
const NINETEEN_SEVENTIES_TIME_UUID = '1970S_TIME_UUID';
const NINETEEN_FIFTY_EIGHT_TO_NINETEEN_SIXTY_FIVE_TIME_UUID = '1958_1965_TIME_UUID';
const NINETEEN_SIXTY_FIVE_TO_NINETEEN_SEVENTY_FOUR_TIME_UUID = '1965_1974_TIME_UUID';
const TEN_BCE_TIME_UUID = '10_BCE_TIME_UUID';
const NINE_BCE_TIME_UUID = '9_BCE_TIME_UUID';
const EIGHT_BCE_TIME_UUID = '8_BCE_TIME_UUID';
const EIGHT_TIME_UUID = '8_TIME_UUID';
const NINE_TIME_UUID = '9_TIME_UUID';
const TEN_TIME_UUID = '10_TIME_UUID';
const NINETEEN_FIFTY_TWO_TIME_UUID = '1952_TIME_UUID';
const NINETEEN_SIXTY_TIME_UUID = '1960_TIME_UUID';
const NINETEEN_SIXTY_FIVE_TIME_UUID = '1965_TIME_UUID';
const NINETEEN_SIXTY_NINE_TIME_UUID = '1969_TIME_UUID';
const NINETEEN_SEVENTY_EIGHT_TIME_UUID = '1978_TIME_UUID';
const NOVEMBER_NINETEEN_FIFTY_TWO_TIME_UUID = 'NOVEMBER_1952_TIME_UUID';
const JANUARY_NINETEEN_SIXTY_TIME_UUID = 'JANUARY_1960_TIME_UUID';
const DECEMBER_NINETEEN_SIXTY_TIME_UUID = 'DECEMBER_1960_TIME_UUID';
const JANUARY_NINETEEN_SIXTY_FIVE_TIME_UUID = 'JANUARY_1965_TIME_UUID';
const MAY_NINETEEN_SIXTY_FIVE_TIME_UUID = 'MAY_1965_TIME_UUID';
const DECEMBER_NINETEEN_SIXTY_FIVE_TIME_UUID = 'DECEMBER_1965_TIME_UUID';
const JANUARY_NINETEEN_SIXTY_NINE_TIME_UUID = 'JANUARY_1969_TIME_UUID';
const DECEMBER_NINETEEN_SIXTY_NINE_TIME_UUID = 'DECEMBER_1969_TIME_UUID';
const FEBRUARY_NINETEEN_SEVENTY_EIGHT_TIME_UUID = 'FEBRUARY_1978_TIME_UUID';
const GRAULT_MATERIAL_UUID = 'GRAULT_MATERIAL_UUID';
const BEATRICE_BAR_PERSON_UUID = 'BEATRICE_BAR_PERSON_UUID';
const XIANYANG_PLACE_UUID = 'XIANYANG_PLACE_UUID';
const AUDIENCE_HALL_LOCALE_UUID = 'AUDIENCE_HALL_LOCALE_UUID';
const ARGENTINA_PLACE_UUID = 'ARGENTINA_PLACE_UUID';
const RIVERSIDE_LOCALE_UUID = 'RIVERSIDE_LOCALE_UUID';
const GARPLY_MATERIAL_UUID = 'GARPLY_MATERIAL_UUID';
const CONOR_CORGE_PERSON_UUID = 'CONOR_CORGE_PERSON_UUID';
const STAGECRAFT_LTD_COMPANY_UUID = 'STAGECRAFT_LTD_COMPANY_UUID';
const CHANGAN_PLACE_UUID = 'CHANGAN_PLACE_UUID';
const THRONE_ROOM_LOCALE_UUID = 'THRONE_ROOM_LOCALE_UUID';
const NANYANG_PLACE_UUID = 'NANYANG_PLACE_UUID';
const CITY_GATE_LOCALE_UUID = 'CITY_GATE_LOCALE_UUID';
const LUOYANG_PLACE_UUID = 'LUOYANG_PLACE_UUID';
const PALACE_LOCALE_UUID = 'PALACE_LOCALE_UUID';
const MANCHESTER_PLACE_UUID = 'MANCHESTER_PLACE_UUID';
const RAILWAY_STATION_LOCALE_UUID = 'RAILWAY_STATION_LOCALE_UUID';
const ONTARIO_PLACE_UUID = 'ONTARIO_PLACE_UUID';
const HOSPITAL_WARD_LOCALE_UUID = 'HOSPITAL_WARD_LOCALE_UUID';
const MEXICO_CITY_PLACE_UUID = 'MEXICO_CITY_PLACE_UUID';
const UNIVERSITY_CAMPUS_LOCALE_UUID = 'UNIVERSITY_CAMPUS_LOCALE_UUID';
const SYDNEY_PLACE_UUID = 'SYDNEY_PLACE_UUID';
const COURTYARD_LOCALE_UUID = 'COURTYARD_LOCALE_UUID';
const WALDO_MATERIAL_UUID = 'WALDO_MATERIAL_UUID';
const JANE_ROE_PERSON_UUID = 'JANE_ROE_PERSON_UUID';
const CALIFORNIA_PLACE_UUID = 'CALIFORNIA_PLACE_UUID';
const MOTEL_ROOM_LOCALE_UUID = 'MOTEL_ROOM_LOCALE_UUID';
const FRED_MATERIAL_UUID = 'FRED_MATERIAL_UUID';
const FERDINAND_FOO_PERSON_UUID = 'FERDINAND_FOO_PERSON_UUID';
const EDINBURGH_CASTLE_PLACE_UUID = 'EDINBURGH_CASTLE_PLACE_UUID';
const BARRACKS_LOCALE_UUID = 'BARRACKS_LOCALE_UUID';
const PLUGH_MATERIAL_UUID = 'PLUGH_MATERIAL_UUID';
const DELPHI_PLACE_UUID = 'DELPHI_PLACE_UUID';
const PUBLIC_SQUARE_LOCALE_UUID = 'PUBLIC_SQUARE_LOCALE_UUID';
const BRUNDISIUM_PLACE_UUID = 'BRUNDISIUM_PLACE_UUID';
const FORUM_LOCALE_UUID = 'FORUM_LOCALE_UUID';
const POMPEII_PLACE_UUID = 'POMPEII_PLACE_UUID';
const VILLA_LOCALE_UUID = 'VILLA_LOCALE_UUID';
const EPHESUS_PLACE_UUID = 'EPHESUS_PLACE_UUID';
const LIBRARY_LOCALE_UUID = 'LIBRARY_LOCALE_UUID';
const PARIS_PLACE_UUID = 'PARIS_PLACE_UUID';
const CAFE_LOCALE_UUID = 'CAFE_LOCALE_UUID';
const YORKSHIRE_PLACE_UUID = 'YORKSHIRE_PLACE_UUID';
const FARMHOUSE_LOCALE_UUID = 'FARMHOUSE_LOCALE_UUID';
const TOKYO_PLACE_UUID = 'TOKYO_PLACE_UUID';
const OFFICE_LOCALE_UUID = 'OFFICE_LOCALE_UUID';
const BAVARIA_PLACE_UUID = 'BAVARIA_PLACE_UUID';
const MONASTERY_LOCALE_UUID = 'MONASTERY_LOCALE_UUID';
const FLORIDA_PLACE_UUID = 'FLORIDA_PLACE_UUID';
const BEACH_LOCALE_UUID = 'BEACH_LOCALE_UUID';
const BERLIN_PLACE_UUID = 'BERLIN_PLACE_UUID';
const NIGHTCLUB_LOCALE_UUID = 'NIGHTCLUB_LOCALE_UUID';
const XYZZY_MATERIAL_UUID = 'XYZZY_MATERIAL_UUID';
const NOLA_PLACE_UUID = 'NOLA_PLACE_UUID';
const SENATE_CHAMBER_LOCALE_UUID = 'SENATE_CHAMBER_LOCALE_UUID';
const TIBUR_PLACE_UUID = 'TIBUR_PLACE_UUID';
const SHRINE_LOCALE_UUID = 'SHRINE_LOCALE_UUID';
const ANTIUM_PLACE_UUID = 'ANTIUM_PLACE_UUID';
const HILLSIDE_LOCALE_UUID = 'HILLSIDE_LOCALE_UUID';
const RAVENNA_PLACE_UUID = 'RAVENNA_PLACE_UUID';
const TEMPLE_LOCALE_UUID = 'TEMPLE_LOCALE_UUID';
const OSTIA_PLACE_UUID = 'OSTIA_PLACE_UUID';
const ROAD_LOCALE_UUID = 'ROAD_LOCALE_UUID';
const CAPUA_PLACE_UUID = 'CAPUA_PLACE_UUID';
const MARKET_LOCALE_UUID = 'MARKET_LOCALE_UUID';
const LIVERPOOL_PLACE_UUID = 'LIVERPOOL_PLACE_UUID';
const DOCKYARD_LOCALE_UUID = 'DOCKYARD_LOCALE_UUID';
const ROME_PLACE_UUID = 'ROME_PLACE_UUID';
const COURTHOUSE_LOCALE_UUID = 'COURTHOUSE_LOCALE_UUID';
const BUCKINGHAM_PALACE_PLACE_UUID = 'BUCKINGHAM_PALACE_PLACE_UUID';
const DRAWING_ROOM_LOCALE_UUID = 'DRAWING_ROOM_LOCALE_UUID';
const QUEBEC_PLACE_UUID = 'QUEBEC_PLACE_UUID';
const SCHOOL_CLASSROOM_LOCALE_UUID = 'SCHOOL_CLASSROOM_LOCALE_UUID';
const ATHENS_PLACE_UUID = 'ATHENS_PLACE_UUID';
const GARDEN_LOCALE_UUID = 'GARDEN_LOCALE_UUID';
const NAIROBI_PLACE_UUID = 'NAIROBI_PLACE_UUID';
const HOTEL_LOBBY_LOCALE_UUID = 'HOTEL_LOBBY_LOCALE_UUID';
const NEW_YORK_CITY_PLACE_UUID = 'NEW_YORK_CITY_PLACE_UUID';
const OPERATING_THEATRE_LOCALE_UUID = 'OPERATING_THEATRE_LOCALE_UUID';
const SCOTLAND_PLACE_UUID = 'SCOTLAND_PLACE_UUID';
const COUNTRY_HOUSE_LOCALE_UUID = 'COUNTRY_HOUSE_LOCALE_UUID';
const CAPE_TOWN_PLACE_UUID = 'CAPE_TOWN_PLACE_UUID';
const HARBOUR_LOCALE_UUID = 'HARBOUR_LOCALE_UUID';
const MOSCOW_PLACE_UUID = 'MOSCOW_PLACE_UUID';
const APARTMENT_LOCALE_UUID = 'APARTMENT_LOCALE_UUID';

let twentiethCentury;
let nineteenSixties;
let nineteenSixtyFiveTime;
let mayNineteenSixtyFiveTime;
let hanDynastyTime;
let westernHanDynastyTime;
let firstCenturyTime;
let nineTime;

describe('Times with sub-times', () => {
	before(async () => {
		stubUuidToCountMapClient.clear();

		await purgeDatabase();

		// Historical eras
		await request(app).post('/times').send({
			name: 'Han dynasty',
			fromDate: '-0202-01-01',
			toDate: '0220-12-31'
		});

		await request(app).post('/times').send({
			name: 'Western Han dynasty',
			fromDate: '-0202-01-01',
			toDate: '0009-12-31'
		});

		await request(app).post('/times').send({
			name: 'Xin dynasty',
			fromDate: '0009-01-01',
			toDate: '0023-12-31'
		});

		await request(app).post('/times').send({
			name: 'Eastern Han dynasty',
			fromDate: '0025-01-01',
			toDate: '0220-12-31'
		});

		// Centuries
		await request(app).post('/times').send({
			name: '2nd century BCE',
			fromDate: '-0200-01-01',
			toDate: '-0101-12-31'
		});

		await request(app).post('/times').send({
			name: '1st century BCE',
			fromDate: '-0100-01-01',
			toDate: '-0001-12-31'
		});

		await request(app).post('/times').send({
			name: '1st century',
			fromDate: '0001-01-01',
			toDate: '0100-12-31'
		});

		await request(app).post('/times').send({
			name: '2nd century',
			fromDate: '0101-01-01',
			toDate: '0200-12-31'
		});

		await request(app).post('/times').send({
			name: '20th century',
			fromDate: '1901-01-01',
			toDate: '2000-12-31'
		});

		// Decades
		await request(app).post('/times').send({
			name: '1950s',
			fromDate: '1950-01-01',
			toDate: '1959-12-31'
		});

		await request(app).post('/times').send({
			name: '1960s',
			fromDate: '1960-01-01',
			toDate: '1969-12-31'
		});

		await request(app).post('/times').send({
			name: '1970s',
			fromDate: '1970-01-01',
			toDate: '1979-12-31'
		});

		// Year ranges
		await request(app).post('/times').send({
			name: '1958-1965',
			fromDate: '1958-01-01',
			toDate: '1965-12-31'
		});

		await request(app).post('/times').send({
			name: '1965-1974',
			fromDate: '1965-01-01',
			toDate: '1974-12-31'
		});

		// Years
		await request(app).post('/times').send({
			name: '10 BCE',
			fromDate: '-0010-01-01',
			toDate: '-0010-12-31'
		});

		await request(app).post('/times').send({
			name: '9 BCE',
			fromDate: '-0009-01-01',
			toDate: '-0009-12-31'
		});

		await request(app).post('/times').send({
			name: '8 BCE',
			fromDate: '-0008-01-01',
			toDate: '-0008-12-31'
		});

		await request(app).post('/times').send({
			name: '8',
			fromDate: '0008-01-01',
			toDate: '0008-12-31'
		});

		await request(app).post('/times').send({
			name: '9',
			fromDate: '0009-01-01',
			toDate: '0009-12-31'
		});

		await request(app).post('/times').send({
			name: '10',
			fromDate: '0010-01-01',
			toDate: '0010-12-31'
		});

		await request(app).post('/times').send({
			name: '1952',
			fromDate: '1952-01-01',
			toDate: '1952-12-31'
		});

		await request(app).post('/times').send({
			name: '1960',
			fromDate: '1960-01-01',
			toDate: '1960-12-31'
		});

		await request(app).post('/times').send({
			name: '1965',
			fromDate: '1965-01-01',
			toDate: '1965-12-31'
		});

		await request(app).post('/times').send({
			name: '1969',
			fromDate: '1969-01-01',
			toDate: '1969-12-31'
		});

		await request(app).post('/times').send({
			name: '1978',
			fromDate: '1978-01-01',
			toDate: '1978-12-31'
		});

		// Months
		await request(app).post('/times').send({
			name: 'November 1952',
			fromDate: '1952-11-01',
			toDate: '1952-11-30'
		});

		await request(app).post('/times').send({
			name: 'January 1960',
			fromDate: '1960-01-01',
			toDate: '1960-01-31'
		});

		await request(app).post('/times').send({
			name: 'December 1960',
			fromDate: '1960-12-01',
			toDate: '1960-12-31'
		});

		await request(app).post('/times').send({
			name: 'January 1965',
			fromDate: '1965-01-01',
			toDate: '1965-01-31'
		});

		await request(app).post('/times').send({
			name: 'May 1965',
			fromDate: '1965-05-01',
			toDate: '1965-05-31'
		});

		await request(app).post('/times').send({
			name: 'December 1965',
			fromDate: '1965-12-01',
			toDate: '1965-12-31'
		});

		await request(app).post('/times').send({
			name: 'January 1969',
			fromDate: '1969-01-01',
			toDate: '1969-01-31'
		});

		await request(app).post('/times').send({
			name: 'December 1969',
			fromDate: '1969-12-01',
			toDate: '1969-12-31'
		});

		await request(app).post('/times').send({
			name: 'February 1978',
			fromDate: '1978-02-01',
			toDate: '1978-02-28'
		});

		await request(app)
			.post('/materials')
			.send({
				name: 'Grault',
				format: 'play',
				year: '2016',
				writingCredits: [
					{
						entities: [
							{
								name: 'Beatrice Bar'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: 'Han dynasty'
						},
						place: {
							name: 'Xianyang'
						},
						locale: {
							name: 'Audience hall'
						}
					},
					{
						time: {
							name: '20th century'
						},
						place: {
							name: 'Argentina'
						},
						locale: {
							name: 'Riverside'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'Garply',
				format: 'play',
				year: '2014',
				writingCredits: [
					{
						entities: [
							{
								name: 'Conor Corge'
							},
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: 'Western Han dynasty'
						},
						place: {
							name: "Chang'an"
						},
						locale: {
							name: 'Throne room'
						}
					},
					{
						time: {
							name: 'Xin dynasty'
						},
						place: {
							name: 'Nanyang'
						},
						locale: {
							name: 'City gate'
						}
					},
					{
						time: {
							name: 'Eastern Han dynasty'
						},
						place: {
							name: 'Luoyang'
						},
						locale: {
							name: 'Palace'
						}
					},
					{
						time: {
							name: '1950s'
						},
						place: {
							name: 'Manchester'
						},
						locale: {
							name: 'Railway station'
						}
					},
					{
						time: {
							name: '1960s'
						},
						place: {
							name: 'Ontario'
						},
						locale: {
							name: 'Hospital ward'
						}
					},
					{
						time: {
							name: '1960s'
						},
						place: {
							name: 'Mexico City'
						},
						locale: {
							name: 'University campus'
						}
					},
					{
						time: {
							name: '1970s'
						},
						place: {
							name: 'Sydney'
						},
						locale: {
							name: 'Courtyard'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'Waldo',
				format: 'play',
				year: '2018',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jane Roe'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '1958-1965'
						},
						place: {
							name: 'California'
						},
						locale: {
							name: 'Motel room'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'Fred',
				format: 'play',
				year: '2017',
				writingCredits: [
					{
						entities: [
							{
								name: 'Ferdinand Foo'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '1965-1974'
						},
						place: {
							name: 'Edinburgh Castle'
						},
						locale: {
							name: 'Barracks'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'Plugh',
				format: 'play',
				year: '2015',
				writingCredits: [
					{
						entities: [
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '2nd century BCE'
						},
						place: {
							name: 'Delphi'
						},
						locale: {
							name: 'Public square'
						}
					},
					{
						time: {
							name: '1st century BCE'
						},
						place: {
							name: 'Brundisium'
						},
						locale: {
							name: 'Forum'
						}
					},
					{
						time: {
							name: '1st century'
						},
						place: {
							name: 'Pompeii'
						},
						locale: {
							name: 'Villa'
						}
					},
					{
						time: {
							name: '2nd century'
						},
						place: {
							name: 'Ephesus'
						},
						locale: {
							name: 'Library'
						}
					},
					{
						time: {
							name: '1952'
						},
						place: {
							name: 'Paris'
						},
						locale: {
							name: 'Café'
						}
					},
					{
						time: {
							name: '1960'
						},
						place: {
							name: 'Yorkshire'
						},
						locale: {
							name: 'Farmhouse'
						}
					},
					{
						time: {
							name: '1965'
						},
						place: {
							name: 'Tokyo'
						},
						locale: {
							name: 'Office'
						}
					},
					{
						time: {
							name: '1965'
						},
						place: {
							name: 'Bavaria'
						},
						locale: {
							name: 'Monastery'
						}
					},
					{
						time: {
							name: '1969'
						},
						place: {
							name: 'Florida'
						},
						locale: {
							name: 'Beach'
						}
					},
					{
						time: {
							name: '1978'
						},
						place: {
							name: 'Berlin'
						},
						locale: {
							name: 'Nightclub'
						}
					}
				]
			});

		await request(app)
			.post('/materials')
			.send({
				name: 'Xyzzy',
				format: 'play',
				year: '2019',
				writingCredits: [
					{
						entities: [
							{
								name: 'Conor Corge'
							}
						]
					}
				],
				settings: [
					{
						time: {
							name: '10 BCE'
						},
						place: {
							name: 'Nola'
						},
						locale: {
							name: 'Senate chamber'
						}
					},
					{
						time: {
							name: '9 BCE'
						},
						place: {
							name: 'Tibur'
						},
						locale: {
							name: 'Shrine'
						}
					},
					{
						time: {
							name: '8 BCE'
						},
						place: {
							name: 'Antium'
						},
						locale: {
							name: 'Hillside'
						}
					},
					{
						time: {
							name: '8'
						},
						place: {
							name: 'Ravenna'
						},
						locale: {
							name: 'Temple'
						}
					},
					{
						time: {
							name: '9'
						},
						place: {
							name: 'Ostia'
						},
						locale: {
							name: 'Road'
						}
					},
					{
						time: {
							name: '10'
						},
						place: {
							name: 'Capua'
						},
						locale: {
							name: 'Market'
						}
					},
					{
						time: {
							name: 'November 1952'
						},
						place: {
							name: 'Liverpool'
						},
						locale: {
							name: 'Dockyard'
						}
					},
					{
						time: {
							name: 'January 1960'
						},
						place: {
							name: 'Rome'
						},
						locale: {
							name: 'Courthouse'
						}
					},
					{
						time: {
							name: 'December 1960'
						},
						place: {
							name: 'Buckingham Palace'
						},
						locale: {
							name: 'Drawing room'
						}
					},
					{
						time: {
							name: 'January 1965'
						},
						place: {
							name: 'Quebec'
						},
						locale: {
							name: 'School classroom'
						}
					},
					{
						time: {
							name: 'May 1965'
						},
						place: {
							name: 'Athens'
						},
						locale: {
							name: 'Garden'
						}
					},
					{
						time: {
							name: 'May 1965'
						},
						place: {
							name: 'Nairobi'
						},
						locale: {
							name: 'Hotel lobby'
						}
					},
					{
						time: {
							name: 'December 1965'
						},
						place: {
							name: 'New York City'
						},
						locale: {
							name: 'Operating theatre'
						}
					},
					{
						time: {
							name: 'January 1969'
						},
						place: {
							name: 'Scotland'
						},
						locale: {
							name: 'Country house'
						}
					},
					{
						time: {
							name: 'December 1969'
						},
						place: {
							name: 'Cape Town'
						},
						locale: {
							name: 'Harbour'
						}
					},
					{
						time: {
							name: 'February 1978'
						},
						place: {
							name: 'Moscow'
						},
						locale: {
							name: 'Apartment'
						}
					}
				]
			});

		twentiethCentury = await request(app).get(`/times/${TWENTIETH_CENTURY_TIME_UUID}`);

		nineteenSixties = await request(app).get(`/times/${NINETEEN_SIXTIES_TIME_UUID}`);

		nineteenSixtyFiveTime = await request(app).get(`/times/${NINETEEN_SIXTY_FIVE_TIME_UUID}`);

		mayNineteenSixtyFiveTime = await request(app).get(`/times/${MAY_NINETEEN_SIXTY_FIVE_TIME_UUID}`);

		hanDynastyTime = await request(app).get(`/times/${HAN_DYNASTY_TIME_UUID}`);

		westernHanDynastyTime = await request(app).get(`/times/${WESTERN_HAN_DYNASTY_TIME_UUID}`);

		firstCenturyTime = await request(app).get(`/times/${FIRST_CENTURY_TIME_UUID}`);

		nineTime = await request(app).get(`/times/${NINE_TIME_UUID}`);
	});

	describe('20th century (time)', () => {
		it('includes no containing sur-times as there are no broader periods available', async () => {
			const expectedSurTimes = [];

			const { surTimes } = twentiethCentury.body;

			assert.deepEqual(surTimes, expectedSurTimes);
		});

		it('includes contained sub-times', async () => {
			const expectedSubTimes = [
				{
					model: 'TIME',
					uuid: NINETEEN_SEVENTIES_TIME_UUID,
					name: '1970s'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SEVENTY_EIGHT_TIME_UUID,
					name: '1978'
				},
				{
					model: 'TIME',
					uuid: FEBRUARY_NINETEEN_SEVENTY_EIGHT_TIME_UUID,
					name: 'February 1978'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_FIVE_TO_NINETEEN_SEVENTY_FOUR_TIME_UUID,
					name: '1965-1974'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTIES_TIME_UUID,
					name: '1960s'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_NINE_TIME_UUID,
					name: '1969'
				},
				{
					model: 'TIME',
					uuid: DECEMBER_NINETEEN_SIXTY_NINE_TIME_UUID,
					name: 'December 1969'
				},
				{
					model: 'TIME',
					uuid: JANUARY_NINETEEN_SIXTY_NINE_TIME_UUID,
					name: 'January 1969'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_FIFTY_EIGHT_TO_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: '1958-1965'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: '1965'
				},
				{
					model: 'TIME',
					uuid: DECEMBER_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: 'December 1965'
				},
				{
					model: 'TIME',
					uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: 'May 1965'
				},
				{
					model: 'TIME',
					uuid: JANUARY_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: 'January 1965'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_TIME_UUID,
					name: '1960'
				},
				{
					model: 'TIME',
					uuid: DECEMBER_NINETEEN_SIXTY_TIME_UUID,
					name: 'December 1960'
				},
				{
					model: 'TIME',
					uuid: JANUARY_NINETEEN_SIXTY_TIME_UUID,
					name: 'January 1960'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_FIFTIES_TIME_UUID,
					name: '1950s'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_FIFTY_TWO_TIME_UUID,
					name: '1952'
				},
				{
					model: 'TIME',
					uuid: NOVEMBER_NINETEEN_FIFTY_TWO_TIME_UUID,
					name: 'November 1952'
				}
			];

			const { subTimes } = twentiethCentury.body;

			assert.deepEqual(subTimes, expectedSubTimes);
		});

		it('includes materials for which it and its contained sub-times were a setting', async () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2019,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NOVEMBER_NINETEEN_FIFTY_TWO_TIME_UUID,
								name: 'November 1952'
							},
							place: {
								model: 'PLACE',
								uuid: LIVERPOOL_PLACE_UUID,
								name: 'Liverpool'
							},
							locale: {
								model: 'LOCALE',
								uuid: DOCKYARD_LOCALE_UUID,
								name: 'Dockyard'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: JANUARY_NINETEEN_SIXTY_TIME_UUID,
								name: 'January 1960'
							},
							place: {
								model: 'PLACE',
								uuid: ROME_PLACE_UUID,
								name: 'Rome'
							},
							locale: {
								model: 'LOCALE',
								uuid: COURTHOUSE_LOCALE_UUID,
								name: 'Courthouse'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: DECEMBER_NINETEEN_SIXTY_TIME_UUID,
								name: 'December 1960'
							},
							place: {
								model: 'PLACE',
								uuid: BUCKINGHAM_PALACE_PLACE_UUID,
								name: 'Buckingham Palace'
							},
							locale: {
								model: 'LOCALE',
								uuid: DRAWING_ROOM_LOCALE_UUID,
								name: 'Drawing room'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: JANUARY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'January 1965'
							},
							place: {
								model: 'PLACE',
								uuid: QUEBEC_PLACE_UUID,
								name: 'Quebec'
							},
							locale: {
								model: 'LOCALE',
								uuid: SCHOOL_CLASSROOM_LOCALE_UUID,
								name: 'School classroom'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'May 1965'
							},
							place: {
								model: 'PLACE',
								uuid: ATHENS_PLACE_UUID,
								name: 'Athens'
							},
							locale: {
								model: 'LOCALE',
								uuid: GARDEN_LOCALE_UUID,
								name: 'Garden'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'May 1965'
							},
							place: {
								model: 'PLACE',
								uuid: NAIROBI_PLACE_UUID,
								name: 'Nairobi'
							},
							locale: {
								model: 'LOCALE',
								uuid: HOTEL_LOBBY_LOCALE_UUID,
								name: 'Hotel lobby'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: DECEMBER_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'December 1965'
							},
							place: {
								model: 'PLACE',
								uuid: NEW_YORK_CITY_PLACE_UUID,
								name: 'New York City'
							},
							locale: {
								model: 'LOCALE',
								uuid: OPERATING_THEATRE_LOCALE_UUID,
								name: 'Operating theatre'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: JANUARY_NINETEEN_SIXTY_NINE_TIME_UUID,
								name: 'January 1969'
							},
							place: {
								model: 'PLACE',
								uuid: SCOTLAND_PLACE_UUID,
								name: 'Scotland'
							},
							locale: {
								model: 'LOCALE',
								uuid: COUNTRY_HOUSE_LOCALE_UUID,
								name: 'Country house'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: DECEMBER_NINETEEN_SIXTY_NINE_TIME_UUID,
								name: 'December 1969'
							},
							place: {
								model: 'PLACE',
								uuid: CAPE_TOWN_PLACE_UUID,
								name: 'Cape Town'
							},
							locale: {
								model: 'LOCALE',
								uuid: HARBOUR_LOCALE_UUID,
								name: 'Harbour'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: FEBRUARY_NINETEEN_SEVENTY_EIGHT_TIME_UUID,
								name: 'February 1978'
							},
							place: {
								model: 'PLACE',
								uuid: MOSCOW_PLACE_UUID,
								name: 'Moscow'
							},
							locale: {
								model: 'LOCALE',
								uuid: APARTMENT_LOCALE_UUID,
								name: 'Apartment'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: WALDO_MATERIAL_UUID,
					name: 'Waldo',
					format: 'play',
					year: 2018,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: JANE_ROE_PERSON_UUID,
									name: 'Jane Roe'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_FIFTY_EIGHT_TO_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: '1958-1965'
							},
							place: {
								model: 'PLACE',
								uuid: CALIFORNIA_PLACE_UUID,
								name: 'California'
							},
							locale: {
								model: 'LOCALE',
								uuid: MOTEL_ROOM_LOCALE_UUID,
								name: 'Motel room'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: FRED_MATERIAL_UUID,
					name: 'Fred',
					format: 'play',
					year: 2017,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: FERDINAND_FOO_PERSON_UUID,
									name: 'Ferdinand Foo'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_FIVE_TO_NINETEEN_SEVENTY_FOUR_TIME_UUID,
								name: '1965-1974'
							},
							place: {
								model: 'PLACE',
								uuid: EDINBURGH_CASTLE_PLACE_UUID,
								name: 'Edinburgh Castle'
							},
							locale: {
								model: 'LOCALE',
								uuid: BARRACKS_LOCALE_UUID,
								name: 'Barracks'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: GRAULT_MATERIAL_UUID,
					name: 'Grault',
					format: 'play',
					year: 2016,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: BEATRICE_BAR_PERSON_UUID,
									name: 'Beatrice Bar'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: TWENTIETH_CENTURY_TIME_UUID,
								name: '20th century'
							},
							place: {
								model: 'PLACE',
								uuid: ARGENTINA_PLACE_UUID,
								name: 'Argentina'
							},
							locale: {
								model: 'LOCALE',
								uuid: RIVERSIDE_LOCALE_UUID,
								name: 'Riverside'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PLUGH_MATERIAL_UUID,
					name: 'Plugh',
					format: 'play',
					year: 2015,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_FIFTY_TWO_TIME_UUID,
								name: '1952'
							},
							place: {
								model: 'PLACE',
								uuid: PARIS_PLACE_UUID,
								name: 'Paris'
							},
							locale: {
								model: 'LOCALE',
								uuid: CAFE_LOCALE_UUID,
								name: 'Café'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_TIME_UUID,
								name: '1960'
							},
							place: {
								model: 'PLACE',
								uuid: YORKSHIRE_PLACE_UUID,
								name: 'Yorkshire'
							},
							locale: {
								model: 'LOCALE',
								uuid: FARMHOUSE_LOCALE_UUID,
								name: 'Farmhouse'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: '1965'
							},
							place: {
								model: 'PLACE',
								uuid: TOKYO_PLACE_UUID,
								name: 'Tokyo'
							},
							locale: {
								model: 'LOCALE',
								uuid: OFFICE_LOCALE_UUID,
								name: 'Office'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: '1965'
							},
							place: {
								model: 'PLACE',
								uuid: BAVARIA_PLACE_UUID,
								name: 'Bavaria'
							},
							locale: {
								model: 'LOCALE',
								uuid: MONASTERY_LOCALE_UUID,
								name: 'Monastery'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_NINE_TIME_UUID,
								name: '1969'
							},
							place: {
								model: 'PLACE',
								uuid: FLORIDA_PLACE_UUID,
								name: 'Florida'
							},
							locale: {
								model: 'LOCALE',
								uuid: BEACH_LOCALE_UUID,
								name: 'Beach'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SEVENTY_EIGHT_TIME_UUID,
								name: '1978'
							},
							place: {
								model: 'PLACE',
								uuid: BERLIN_PLACE_UUID,
								name: 'Berlin'
							},
							locale: {
								model: 'LOCALE',
								uuid: NIGHTCLUB_LOCALE_UUID,
								name: 'Nightclub'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: GARPLY_MATERIAL_UUID,
					name: 'Garply',
					format: 'play',
					year: 2014,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
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
								uuid: MANCHESTER_PLACE_UUID,
								name: 'Manchester'
							},
							locale: {
								model: 'LOCALE',
								uuid: RAILWAY_STATION_LOCALE_UUID,
								name: 'Railway station'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTIES_TIME_UUID,
								name: '1960s'
							},
							place: {
								model: 'PLACE',
								uuid: ONTARIO_PLACE_UUID,
								name: 'Ontario'
							},
							locale: {
								model: 'LOCALE',
								uuid: HOSPITAL_WARD_LOCALE_UUID,
								name: 'Hospital ward'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTIES_TIME_UUID,
								name: '1960s'
							},
							place: {
								model: 'PLACE',
								uuid: MEXICO_CITY_PLACE_UUID,
								name: 'Mexico City'
							},
							locale: {
								model: 'LOCALE',
								uuid: UNIVERSITY_CAMPUS_LOCALE_UUID,
								name: 'University campus'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SEVENTIES_TIME_UUID,
								name: '1970s'
							},
							place: {
								model: 'PLACE',
								uuid: SYDNEY_PLACE_UUID,
								name: 'Sydney'
							},
							locale: {
								model: 'LOCALE',
								uuid: COURTYARD_LOCALE_UUID,
								name: 'Courtyard'
							}
						}
					]
				}
			];

			const { materials } = twentiethCentury.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('1960s (time)', () => {
		it('includes containing sur-times; excludes intersections (e.g. 1958-1965 and 1965-1974)', async () => {
			const expectedSurTimes = [
				{
					model: 'TIME',
					uuid: TWENTIETH_CENTURY_TIME_UUID,
					name: '20th century'
				}
			];

			const { surTimes } = nineteenSixties.body;

			assert.deepEqual(surTimes, expectedSurTimes);
		});

		it('includes contained sub-times; excludes intersections (e.g. 1958-1965 and 1965-1974)', async () => {
			const expectedSubTimes = [
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_NINE_TIME_UUID,
					name: '1969'
				},
				{
					model: 'TIME',
					uuid: DECEMBER_NINETEEN_SIXTY_NINE_TIME_UUID,
					name: 'December 1969'
				},
				{
					model: 'TIME',
					uuid: JANUARY_NINETEEN_SIXTY_NINE_TIME_UUID,
					name: 'January 1969'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: '1965'
				},
				{
					model: 'TIME',
					uuid: DECEMBER_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: 'December 1965'
				},
				{
					model: 'TIME',
					uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: 'May 1965'
				},
				{
					model: 'TIME',
					uuid: JANUARY_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: 'January 1965'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_TIME_UUID,
					name: '1960'
				},
				{
					model: 'TIME',
					uuid: DECEMBER_NINETEEN_SIXTY_TIME_UUID,
					name: 'December 1960'
				},
				{
					model: 'TIME',
					uuid: JANUARY_NINETEEN_SIXTY_TIME_UUID,
					name: 'January 1960'
				}
			];

			const { subTimes } = nineteenSixties.body;

			assert.deepEqual(subTimes, expectedSubTimes);
		});

		it('includes materials for which it and its sub-times were a setting; excludes materials for which intersecting times (e.g. 1958-1965 and 1965-1974) were a setting', async () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2019,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: JANUARY_NINETEEN_SIXTY_TIME_UUID,
								name: 'January 1960'
							},
							place: {
								model: 'PLACE',
								uuid: ROME_PLACE_UUID,
								name: 'Rome'
							},
							locale: {
								model: 'LOCALE',
								uuid: COURTHOUSE_LOCALE_UUID,
								name: 'Courthouse'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: DECEMBER_NINETEEN_SIXTY_TIME_UUID,
								name: 'December 1960'
							},
							place: {
								model: 'PLACE',
								uuid: BUCKINGHAM_PALACE_PLACE_UUID,
								name: 'Buckingham Palace'
							},
							locale: {
								model: 'LOCALE',
								uuid: DRAWING_ROOM_LOCALE_UUID,
								name: 'Drawing room'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: JANUARY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'January 1965'
							},
							place: {
								model: 'PLACE',
								uuid: QUEBEC_PLACE_UUID,
								name: 'Quebec'
							},
							locale: {
								model: 'LOCALE',
								uuid: SCHOOL_CLASSROOM_LOCALE_UUID,
								name: 'School classroom'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'May 1965'
							},
							place: {
								model: 'PLACE',
								uuid: ATHENS_PLACE_UUID,
								name: 'Athens'
							},
							locale: {
								model: 'LOCALE',
								uuid: GARDEN_LOCALE_UUID,
								name: 'Garden'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'May 1965'
							},
							place: {
								model: 'PLACE',
								uuid: NAIROBI_PLACE_UUID,
								name: 'Nairobi'
							},
							locale: {
								model: 'LOCALE',
								uuid: HOTEL_LOBBY_LOCALE_UUID,
								name: 'Hotel lobby'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: DECEMBER_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'December 1965'
							},
							place: {
								model: 'PLACE',
								uuid: NEW_YORK_CITY_PLACE_UUID,
								name: 'New York City'
							},
							locale: {
								model: 'LOCALE',
								uuid: OPERATING_THEATRE_LOCALE_UUID,
								name: 'Operating theatre'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: JANUARY_NINETEEN_SIXTY_NINE_TIME_UUID,
								name: 'January 1969'
							},
							place: {
								model: 'PLACE',
								uuid: SCOTLAND_PLACE_UUID,
								name: 'Scotland'
							},
							locale: {
								model: 'LOCALE',
								uuid: COUNTRY_HOUSE_LOCALE_UUID,
								name: 'Country house'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: DECEMBER_NINETEEN_SIXTY_NINE_TIME_UUID,
								name: 'December 1969'
							},
							place: {
								model: 'PLACE',
								uuid: CAPE_TOWN_PLACE_UUID,
								name: 'Cape Town'
							},
							locale: {
								model: 'LOCALE',
								uuid: HARBOUR_LOCALE_UUID,
								name: 'Harbour'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PLUGH_MATERIAL_UUID,
					name: 'Plugh',
					format: 'play',
					year: 2015,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_TIME_UUID,
								name: '1960'
							},
							place: {
								model: 'PLACE',
								uuid: YORKSHIRE_PLACE_UUID,
								name: 'Yorkshire'
							},
							locale: {
								model: 'LOCALE',
								uuid: FARMHOUSE_LOCALE_UUID,
								name: 'Farmhouse'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: '1965'
							},
							place: {
								model: 'PLACE',
								uuid: TOKYO_PLACE_UUID,
								name: 'Tokyo'
							},
							locale: {
								model: 'LOCALE',
								uuid: OFFICE_LOCALE_UUID,
								name: 'Office'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: '1965'
							},
							place: {
								model: 'PLACE',
								uuid: BAVARIA_PLACE_UUID,
								name: 'Bavaria'
							},
							locale: {
								model: 'LOCALE',
								uuid: MONASTERY_LOCALE_UUID,
								name: 'Monastery'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_NINE_TIME_UUID,
								name: '1969'
							},
							place: {
								model: 'PLACE',
								uuid: FLORIDA_PLACE_UUID,
								name: 'Florida'
							},
							locale: {
								model: 'LOCALE',
								uuid: BEACH_LOCALE_UUID,
								name: 'Beach'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: GARPLY_MATERIAL_UUID,
					name: 'Garply',
					format: 'play',
					year: 2014,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTIES_TIME_UUID,
								name: '1960s'
							},
							place: {
								model: 'PLACE',
								uuid: ONTARIO_PLACE_UUID,
								name: 'Ontario'
							},
							locale: {
								model: 'LOCALE',
								uuid: HOSPITAL_WARD_LOCALE_UUID,
								name: 'Hospital ward'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTIES_TIME_UUID,
								name: '1960s'
							},
							place: {
								model: 'PLACE',
								uuid: MEXICO_CITY_PLACE_UUID,
								name: 'Mexico City'
							},
							locale: {
								model: 'LOCALE',
								uuid: UNIVERSITY_CAMPUS_LOCALE_UUID,
								name: 'University campus'
							}
						}
					]
				}
			];

			const { materials } = nineteenSixties.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('1965 (time)', () => {
		it('includes containing sur-times', async () => {
			const expectedSurTimes = [
				{
					model: 'TIME',
					uuid: TWENTIETH_CENTURY_TIME_UUID,
					name: '20th century'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_FIVE_TO_NINETEEN_SEVENTY_FOUR_TIME_UUID,
					name: '1965-1974'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTIES_TIME_UUID,
					name: '1960s'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_FIFTY_EIGHT_TO_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: '1958-1965'
				}
			];

			const { surTimes } = nineteenSixtyFiveTime.body;

			assert.deepEqual(surTimes, expectedSurTimes);
		});

		it('includes contained sub-times', async () => {
			const expectedSubTimes = [
				{
					model: 'TIME',
					uuid: DECEMBER_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: 'December 1965'
				},
				{
					model: 'TIME',
					uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: 'May 1965'
				},
				{
					model: 'TIME',
					uuid: JANUARY_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: 'January 1965'
				}
			];

			const { subTimes } = nineteenSixtyFiveTime.body;

			assert.deepEqual(subTimes, expectedSubTimes);
		});

		it('includes materials for which it and its sub-times were a setting', async () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2019,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: JANUARY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'January 1965'
							},
							place: {
								model: 'PLACE',
								uuid: QUEBEC_PLACE_UUID,
								name: 'Quebec'
							},
							locale: {
								model: 'LOCALE',
								uuid: SCHOOL_CLASSROOM_LOCALE_UUID,
								name: 'School classroom'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'May 1965'
							},
							place: {
								model: 'PLACE',
								uuid: ATHENS_PLACE_UUID,
								name: 'Athens'
							},
							locale: {
								model: 'LOCALE',
								uuid: GARDEN_LOCALE_UUID,
								name: 'Garden'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'May 1965'
							},
							place: {
								model: 'PLACE',
								uuid: NAIROBI_PLACE_UUID,
								name: 'Nairobi'
							},
							locale: {
								model: 'LOCALE',
								uuid: HOTEL_LOBBY_LOCALE_UUID,
								name: 'Hotel lobby'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: DECEMBER_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'December 1965'
							},
							place: {
								model: 'PLACE',
								uuid: NEW_YORK_CITY_PLACE_UUID,
								name: 'New York City'
							},
							locale: {
								model: 'LOCALE',
								uuid: OPERATING_THEATRE_LOCALE_UUID,
								name: 'Operating theatre'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PLUGH_MATERIAL_UUID,
					name: 'Plugh',
					format: 'play',
					year: 2015,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: '1965'
							},
							place: {
								model: 'PLACE',
								uuid: TOKYO_PLACE_UUID,
								name: 'Tokyo'
							},
							locale: {
								model: 'LOCALE',
								uuid: OFFICE_LOCALE_UUID,
								name: 'Office'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: '1965'
							},
							place: {
								model: 'PLACE',
								uuid: BAVARIA_PLACE_UUID,
								name: 'Bavaria'
							},
							locale: {
								model: 'LOCALE',
								uuid: MONASTERY_LOCALE_UUID,
								name: 'Monastery'
							}
						}
					]
				}
			];

			const { materials } = nineteenSixtyFiveTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('May 1965 (time)', () => {
		it('includes containing sur-times', async () => {
			const expectedSurTimes = [
				{
					model: 'TIME',
					uuid: TWENTIETH_CENTURY_TIME_UUID,
					name: '20th century'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_FIVE_TO_NINETEEN_SEVENTY_FOUR_TIME_UUID,
					name: '1965-1974'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTIES_TIME_UUID,
					name: '1960s'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_FIFTY_EIGHT_TO_NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: '1958-1965'
				},
				{
					model: 'TIME',
					uuid: NINETEEN_SIXTY_FIVE_TIME_UUID,
					name: '1965'
				}
			];

			const { surTimes } = mayNineteenSixtyFiveTime.body;

			assert.deepEqual(surTimes, expectedSurTimes);
		});

		it('includes no contained sub-times as there are no narrower periods', async () => {
			const expectedSubTimes = [];

			const { subTimes } = mayNineteenSixtyFiveTime.body;

			assert.deepEqual(subTimes, expectedSubTimes);
		});

		it('includes materials for which it was a setting', async () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2019,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'May 1965'
							},
							place: {
								model: 'PLACE',
								uuid: ATHENS_PLACE_UUID,
								name: 'Athens'
							},
							locale: {
								model: 'LOCALE',
								uuid: GARDEN_LOCALE_UUID,
								name: 'Garden'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: MAY_NINETEEN_SIXTY_FIVE_TIME_UUID,
								name: 'May 1965'
							},
							place: {
								model: 'PLACE',
								uuid: NAIROBI_PLACE_UUID,
								name: 'Nairobi'
							},
							locale: {
								model: 'LOCALE',
								uuid: HOTEL_LOBBY_LOCALE_UUID,
								name: 'Hotel lobby'
							}
						}
					]
				}
			];

			const { materials } = mayNineteenSixtyFiveTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Han dynasty (time)', () => {
		it('includes no containing sur-times as there are no broader periods available', async () => {
			const expectedSurTimes = [];

			const { surTimes } = hanDynastyTime.body;

			assert.deepEqual(surTimes, expectedSurTimes);
		});

		it('includes contained sub-times', async () => {
			const expectedSubTimes = [
				{
					model: 'TIME',
					uuid: EASTERN_HAN_DYNASTY_TIME_UUID,
					name: 'Eastern Han dynasty'
				},
				{
					model: 'TIME',
					uuid: SECOND_CENTURY_TIME_UUID,
					name: '2nd century'
				},
				{
					model: 'TIME',
					uuid: FIRST_CENTURY_TIME_UUID,
					name: '1st century'
				},
				{
					model: 'TIME',
					uuid: XIN_DYNASTY_TIME_UUID,
					name: 'Xin dynasty'
				},
				{
					model: 'TIME',
					uuid: TEN_TIME_UUID,
					name: '10'
				},
				{
					model: 'TIME',
					uuid: WESTERN_HAN_DYNASTY_TIME_UUID,
					name: 'Western Han dynasty'
				},
				{
					model: 'TIME',
					uuid: NINE_TIME_UUID,
					name: '9'
				},
				{
					model: 'TIME',
					uuid: EIGHT_TIME_UUID,
					name: '8'
				},
				{
					model: 'TIME',
					uuid: FIRST_CENTURY_BCE_TIME_UUID,
					name: '1st century BCE'
				},
				{
					model: 'TIME',
					uuid: EIGHT_BCE_TIME_UUID,
					name: '8 BCE'
				},
				{
					model: 'TIME',
					uuid: NINE_BCE_TIME_UUID,
					name: '9 BCE'
				},
				{
					model: 'TIME',
					uuid: TEN_BCE_TIME_UUID,
					name: '10 BCE'
				},
				{
					model: 'TIME',
					uuid: SECOND_CENTURY_BCE_TIME_UUID,
					name: '2nd century BCE'
				}
			];

			const { subTimes } = hanDynastyTime.body;

			assert.deepEqual(subTimes, expectedSubTimes);
		});

		it('includes materials for which it and its contained sub-times were a setting', async () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2019,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: TEN_BCE_TIME_UUID,
								name: '10 BCE'
							},
							place: {
								model: 'PLACE',
								uuid: NOLA_PLACE_UUID,
								name: 'Nola'
							},
							locale: {
								model: 'LOCALE',
								uuid: SENATE_CHAMBER_LOCALE_UUID,
								name: 'Senate chamber'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINE_BCE_TIME_UUID,
								name: '9 BCE'
							},
							place: {
								model: 'PLACE',
								uuid: TIBUR_PLACE_UUID,
								name: 'Tibur'
							},
							locale: {
								model: 'LOCALE',
								uuid: SHRINE_LOCALE_UUID,
								name: 'Shrine'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: EIGHT_BCE_TIME_UUID,
								name: '8 BCE'
							},
							place: {
								model: 'PLACE',
								uuid: ANTIUM_PLACE_UUID,
								name: 'Antium'
							},
							locale: {
								model: 'LOCALE',
								uuid: HILLSIDE_LOCALE_UUID,
								name: 'Hillside'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: EIGHT_TIME_UUID,
								name: '8'
							},
							place: {
								model: 'PLACE',
								uuid: RAVENNA_PLACE_UUID,
								name: 'Ravenna'
							},
							locale: {
								model: 'LOCALE',
								uuid: TEMPLE_LOCALE_UUID,
								name: 'Temple'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINE_TIME_UUID,
								name: '9'
							},
							place: {
								model: 'PLACE',
								uuid: OSTIA_PLACE_UUID,
								name: 'Ostia'
							},
							locale: {
								model: 'LOCALE',
								uuid: ROAD_LOCALE_UUID,
								name: 'Road'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: TEN_TIME_UUID,
								name: '10'
							},
							place: {
								model: 'PLACE',
								uuid: CAPUA_PLACE_UUID,
								name: 'Capua'
							},
							locale: {
								model: 'LOCALE',
								uuid: MARKET_LOCALE_UUID,
								name: 'Market'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: GRAULT_MATERIAL_UUID,
					name: 'Grault',
					format: 'play',
					year: 2016,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: BEATRICE_BAR_PERSON_UUID,
									name: 'Beatrice Bar'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: HAN_DYNASTY_TIME_UUID,
								name: 'Han dynasty'
							},
							place: {
								model: 'PLACE',
								uuid: XIANYANG_PLACE_UUID,
								name: 'Xianyang'
							},
							locale: {
								model: 'LOCALE',
								uuid: AUDIENCE_HALL_LOCALE_UUID,
								name: 'Audience hall'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PLUGH_MATERIAL_UUID,
					name: 'Plugh',
					format: 'play',
					year: 2015,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: SECOND_CENTURY_BCE_TIME_UUID,
								name: '2nd century BCE'
							},
							place: {
								model: 'PLACE',
								uuid: DELPHI_PLACE_UUID,
								name: 'Delphi'
							},
							locale: {
								model: 'LOCALE',
								uuid: PUBLIC_SQUARE_LOCALE_UUID,
								name: 'Public square'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: FIRST_CENTURY_BCE_TIME_UUID,
								name: '1st century BCE'
							},
							place: {
								model: 'PLACE',
								uuid: BRUNDISIUM_PLACE_UUID,
								name: 'Brundisium'
							},
							locale: {
								model: 'LOCALE',
								uuid: FORUM_LOCALE_UUID,
								name: 'Forum'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: FIRST_CENTURY_TIME_UUID,
								name: '1st century'
							},
							place: {
								model: 'PLACE',
								uuid: POMPEII_PLACE_UUID,
								name: 'Pompeii'
							},
							locale: {
								model: 'LOCALE',
								uuid: VILLA_LOCALE_UUID,
								name: 'Villa'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: SECOND_CENTURY_TIME_UUID,
								name: '2nd century'
							},
							place: {
								model: 'PLACE',
								uuid: EPHESUS_PLACE_UUID,
								name: 'Ephesus'
							},
							locale: {
								model: 'LOCALE',
								uuid: LIBRARY_LOCALE_UUID,
								name: 'Library'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: GARPLY_MATERIAL_UUID,
					name: 'Garply',
					format: 'play',
					year: 2014,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: WESTERN_HAN_DYNASTY_TIME_UUID,
								name: 'Western Han dynasty'
							},
							place: {
								model: 'PLACE',
								uuid: CHANGAN_PLACE_UUID,
								name: "Chang'an"
							},
							locale: {
								model: 'LOCALE',
								uuid: THRONE_ROOM_LOCALE_UUID,
								name: 'Throne room'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: XIN_DYNASTY_TIME_UUID,
								name: 'Xin dynasty'
							},
							place: {
								model: 'PLACE',
								uuid: NANYANG_PLACE_UUID,
								name: 'Nanyang'
							},
							locale: {
								model: 'LOCALE',
								uuid: CITY_GATE_LOCALE_UUID,
								name: 'City gate'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: EASTERN_HAN_DYNASTY_TIME_UUID,
								name: 'Eastern Han dynasty'
							},
							place: {
								model: 'PLACE',
								uuid: LUOYANG_PLACE_UUID,
								name: 'Luoyang'
							},
							locale: {
								model: 'LOCALE',
								uuid: PALACE_LOCALE_UUID,
								name: 'Palace'
							}
						}
					]
				}
			];

			const { materials } = hanDynastyTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('Western Han dynasty (time)', () => {
		it('includes containing sur-times; excludes intersections (e.g. Xin dynasty)', async () => {
			const expectedSurTimes = [
				{
					model: 'TIME',
					uuid: HAN_DYNASTY_TIME_UUID,
					name: 'Han dynasty'
				}
			];

			const { surTimes } = westernHanDynastyTime.body;

			assert.deepEqual(surTimes, expectedSurTimes);
		});

		it('includes contained sub-times; excludes intersections (e.g. Xin dynasty)', async () => {
			const expectedSubTimes = [
				{
					model: 'TIME',
					uuid: NINE_TIME_UUID,
					name: '9'
				},
				{
					model: 'TIME',
					uuid: EIGHT_TIME_UUID,
					name: '8'
				},
				{
					model: 'TIME',
					uuid: FIRST_CENTURY_BCE_TIME_UUID,
					name: '1st century BCE'
				},
				{
					model: 'TIME',
					uuid: EIGHT_BCE_TIME_UUID,
					name: '8 BCE'
				},
				{
					model: 'TIME',
					uuid: NINE_BCE_TIME_UUID,
					name: '9 BCE'
				},
				{
					model: 'TIME',
					uuid: TEN_BCE_TIME_UUID,
					name: '10 BCE'
				},
				{
					model: 'TIME',
					uuid: SECOND_CENTURY_BCE_TIME_UUID,
					name: '2nd century BCE'
				}
			];

			const { subTimes } = westernHanDynastyTime.body;

			assert.deepEqual(subTimes, expectedSubTimes);
		});

		it('includes materials for which it and its sub-times were a setting; excludes materials for which intersecting times (e.g. Xin dynasty) were a setting', async () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2019,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: TEN_BCE_TIME_UUID,
								name: '10 BCE'
							},
							place: {
								model: 'PLACE',
								uuid: NOLA_PLACE_UUID,
								name: 'Nola'
							},
							locale: {
								model: 'LOCALE',
								uuid: SENATE_CHAMBER_LOCALE_UUID,
								name: 'Senate chamber'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINE_BCE_TIME_UUID,
								name: '9 BCE'
							},
							place: {
								model: 'PLACE',
								uuid: TIBUR_PLACE_UUID,
								name: 'Tibur'
							},
							locale: {
								model: 'LOCALE',
								uuid: SHRINE_LOCALE_UUID,
								name: 'Shrine'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: EIGHT_BCE_TIME_UUID,
								name: '8 BCE'
							},
							place: {
								model: 'PLACE',
								uuid: ANTIUM_PLACE_UUID,
								name: 'Antium'
							},
							locale: {
								model: 'LOCALE',
								uuid: HILLSIDE_LOCALE_UUID,
								name: 'Hillside'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: EIGHT_TIME_UUID,
								name: '8'
							},
							place: {
								model: 'PLACE',
								uuid: RAVENNA_PLACE_UUID,
								name: 'Ravenna'
							},
							locale: {
								model: 'LOCALE',
								uuid: TEMPLE_LOCALE_UUID,
								name: 'Temple'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINE_TIME_UUID,
								name: '9'
							},
							place: {
								model: 'PLACE',
								uuid: OSTIA_PLACE_UUID,
								name: 'Ostia'
							},
							locale: {
								model: 'LOCALE',
								uuid: ROAD_LOCALE_UUID,
								name: 'Road'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PLUGH_MATERIAL_UUID,
					name: 'Plugh',
					format: 'play',
					year: 2015,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: SECOND_CENTURY_BCE_TIME_UUID,
								name: '2nd century BCE'
							},
							place: {
								model: 'PLACE',
								uuid: DELPHI_PLACE_UUID,
								name: 'Delphi'
							},
							locale: {
								model: 'LOCALE',
								uuid: PUBLIC_SQUARE_LOCALE_UUID,
								name: 'Public square'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: FIRST_CENTURY_BCE_TIME_UUID,
								name: '1st century BCE'
							},
							place: {
								model: 'PLACE',
								uuid: BRUNDISIUM_PLACE_UUID,
								name: 'Brundisium'
							},
							locale: {
								model: 'LOCALE',
								uuid: FORUM_LOCALE_UUID,
								name: 'Forum'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: GARPLY_MATERIAL_UUID,
					name: 'Garply',
					format: 'play',
					year: 2014,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: WESTERN_HAN_DYNASTY_TIME_UUID,
								name: 'Western Han dynasty'
							},
							place: {
								model: 'PLACE',
								uuid: CHANGAN_PLACE_UUID,
								name: "Chang'an"
							},
							locale: {
								model: 'LOCALE',
								uuid: THRONE_ROOM_LOCALE_UUID,
								name: 'Throne room'
							}
						}
					]
				}
			];

			const { materials } = westernHanDynastyTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('1st century (time)', () => {
		it('includes containing sur-times', async () => {
			const expectedSurTimes = [
				{
					model: 'TIME',
					uuid: HAN_DYNASTY_TIME_UUID,
					name: 'Han dynasty'
				}
			];

			const { surTimes } = firstCenturyTime.body;

			assert.deepEqual(surTimes, expectedSurTimes);
		});

		it('includes contained sub-times', async () => {
			const expectedSubTimes = [
				{
					model: 'TIME',
					uuid: XIN_DYNASTY_TIME_UUID,
					name: 'Xin dynasty'
				},
				{
					model: 'TIME',
					uuid: TEN_TIME_UUID,
					name: '10'
				},
				{
					model: 'TIME',
					uuid: NINE_TIME_UUID,
					name: '9'
				},
				{
					model: 'TIME',
					uuid: EIGHT_TIME_UUID,
					name: '8'
				}
			];

			const { subTimes } = firstCenturyTime.body;

			assert.deepEqual(subTimes, expectedSubTimes);
		});

		it('includes materials for which it and its sub-times were a setting', async () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2019,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: EIGHT_TIME_UUID,
								name: '8'
							},
							place: {
								model: 'PLACE',
								uuid: RAVENNA_PLACE_UUID,
								name: 'Ravenna'
							},
							locale: {
								model: 'LOCALE',
								uuid: TEMPLE_LOCALE_UUID,
								name: 'Temple'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINE_TIME_UUID,
								name: '9'
							},
							place: {
								model: 'PLACE',
								uuid: OSTIA_PLACE_UUID,
								name: 'Ostia'
							},
							locale: {
								model: 'LOCALE',
								uuid: ROAD_LOCALE_UUID,
								name: 'Road'
							}
						},
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: TEN_TIME_UUID,
								name: '10'
							},
							place: {
								model: 'PLACE',
								uuid: CAPUA_PLACE_UUID,
								name: 'Capua'
							},
							locale: {
								model: 'LOCALE',
								uuid: MARKET_LOCALE_UUID,
								name: 'Market'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: PLUGH_MATERIAL_UUID,
					name: 'Plugh',
					format: 'play',
					year: 2015,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: FIRST_CENTURY_TIME_UUID,
								name: '1st century'
							},
							place: {
								model: 'PLACE',
								uuid: POMPEII_PLACE_UUID,
								name: 'Pompeii'
							},
							locale: {
								model: 'LOCALE',
								uuid: VILLA_LOCALE_UUID,
								name: 'Villa'
							}
						}
					]
				},
				{
					model: 'MATERIAL',
					uuid: GARPLY_MATERIAL_UUID,
					name: 'Garply',
					format: 'play',
					year: 2014,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: XIN_DYNASTY_TIME_UUID,
								name: 'Xin dynasty'
							},
							place: {
								model: 'PLACE',
								uuid: NANYANG_PLACE_UUID,
								name: 'Nanyang'
							},
							locale: {
								model: 'LOCALE',
								uuid: CITY_GATE_LOCALE_UUID,
								name: 'City gate'
							}
						}
					]
				}
			];

			const { materials } = firstCenturyTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});

	describe('9 (time)', () => {
		it('includes containing sur-times', async () => {
			const expectedSurTimes = [
				{
					model: 'TIME',
					uuid: HAN_DYNASTY_TIME_UUID,
					name: 'Han dynasty'
				},
				{
					model: 'TIME',
					uuid: FIRST_CENTURY_TIME_UUID,
					name: '1st century'
				},
				{
					model: 'TIME',
					uuid: XIN_DYNASTY_TIME_UUID,
					name: 'Xin dynasty'
				},
				{
					model: 'TIME',
					uuid: WESTERN_HAN_DYNASTY_TIME_UUID,
					name: 'Western Han dynasty'
				}
			];

			const { surTimes } = nineTime.body;

			assert.deepEqual(surTimes, expectedSurTimes);
		});

		it('includes no contained sub-times as there are no narrower periods', async () => {
			const expectedSubTimes = [];

			const { subTimes } = nineTime.body;

			assert.deepEqual(subTimes, expectedSubTimes);
		});

		it('includes materials for which it was a setting', async () => {
			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: XYZZY_MATERIAL_UUID,
					name: 'Xyzzy',
					format: 'play',
					year: 2019,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								}
							]
						}
					],
					settings: [
						{
							model: 'SETTING',
							time: {
								model: 'TIME',
								uuid: NINE_TIME_UUID,
								name: '9'
							},
							place: {
								model: 'PLACE',
								uuid: OSTIA_PLACE_UUID,
								name: 'Ostia'
							},
							locale: {
								model: 'LOCALE',
								uuid: ROAD_LOCALE_UUID,
								name: 'Road'
							}
						}
					]
				}
			];

			const { materials } = nineTime.body;

			assert.deepEqual(materials, expectedMaterials);
		});
	});
});

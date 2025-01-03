import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';

import app from '../../src/app.js';
import { purgeDatabase } from '../test-helpers/neo4j/index.js';
import { stubUuidToCountMapClient } from '../test-helpers/index.js';

const { expect } = chai;

chai.use(chaiHttp);

const SEIZE_THE_DAY_TRICYCLE_PRODUCTION_UUID = 'SEIZE_THE_DAY_PRODUCTION_UUID';
const TRICYCLE_THEATRE_VENUE_UUID = 'TRICYCLE_THEATRE_VENUE_UUID';
const NOT_BLACK_AND_WHITE_SEASON_UUID = 'NOT_BLACK_AND_WHITE_SEASON_UUID';
const DETAINING_JUSTICE_TRICYCLE_PRODUCTION_UUID = 'DETAINING_JUSTICE_PRODUCTION_UUID';
const CATEGORY_B_TRICYCLE_PRODUCTION_UUID = 'CATEGORY_B_PRODUCTION_UUID';

let notBlackAndWhiteSeason;
let categoryBTricycleProduction;
let seizeTheDayTricycleProduction;
let detainingJusticeTricycleProduction;

describe('Season with multiple productions', () => {

	before(async () => {

		stubUuidToCountMapClient.clear();

		await purgeDatabase();

		await request.execute(app)
			.post('/productions')
			.send({
				name: 'Seize the Day',
				startDate: '2009-10-22',
				pressDate: '2009-11-02',
				endDate: '2009-12-17',
				venue: {
					name: 'Tricycle Theatre'
				},
				season: {
					name: 'Not Black and White'
				}
			});

		await request.execute(app)
			.post('/productions')
			.send({
				name: 'Detaining Justice',
				startDate: '2009-11-25',
				pressDate: '2009-11-30',
				endDate: '2009-12-15',
				venue: {
					name: 'Tricycle Theatre'
				},
				season: {
					name: 'Not Black and White'
				}
			});

		await request.execute(app)
			.post('/productions')
			.send({
				name: 'Category B',
				startDate: '2009-10-08',
				pressDate: '2009-10-12',
				endDate: '2009-12-19',
				venue: {
					name: 'Tricycle Theatre'
				},
				season: {
					name: 'Not Black and White'
				}
			});

		notBlackAndWhiteSeason = await request.execute(app)
			.get(`/seasons/${NOT_BLACK_AND_WHITE_SEASON_UUID}`);

		categoryBTricycleProduction = await request.execute(app)
			.get(`/productions/${CATEGORY_B_TRICYCLE_PRODUCTION_UUID}`);

		seizeTheDayTricycleProduction = await request.execute(app)
			.get(`/productions/${SEIZE_THE_DAY_TRICYCLE_PRODUCTION_UUID}`);

		detainingJusticeTricycleProduction = await request.execute(app)
			.get(`/productions/${DETAINING_JUSTICE_TRICYCLE_PRODUCTION_UUID}`);

	});

	describe('Not Black and White (season)', () => {

		it('includes productions in this season', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: DETAINING_JUSTICE_TRICYCLE_PRODUCTION_UUID,
					name: 'Detaining Justice',
					startDate: '2009-11-25',
					endDate: '2009-12-15',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: SEIZE_THE_DAY_TRICYCLE_PRODUCTION_UUID,
					name: 'Seize the Day',
					startDate: '2009-10-22',
					endDate: '2009-12-17',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: CATEGORY_B_TRICYCLE_PRODUCTION_UUID,
					name: 'Category B',
					startDate: '2009-10-08',
					endDate: '2009-12-19',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null
				}
			];

			const { productions } = notBlackAndWhiteSeason.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Category B at Tricycle Theatre (production)', () => {

		it('attributes season as Not Black and White', () => {

			const expectedSeason = {
				model: 'SEASON',
				uuid: NOT_BLACK_AND_WHITE_SEASON_UUID,
				name: 'Not Black and White'
			};

			const { season } = categoryBTricycleProduction.body;

			expect(season).to.deep.equal(expectedSeason);

		});

	});

	describe('Seize the Day at Tricycle Theatre (production)', () => {

		it('attributes season as Not Black and White', () => {

			const expectedSeason = {
				model: 'SEASON',
				uuid: NOT_BLACK_AND_WHITE_SEASON_UUID,
				name: 'Not Black and White'
			};

			const { season } = seizeTheDayTricycleProduction.body;

			expect(season).to.deep.equal(expectedSeason);

		});

	});

	describe('Detaining Justice at Tricycle Theatre (production)', () => {

		it('attributes season as Not Black and White', () => {

			const expectedSeason = {
				model: 'SEASON',
				uuid: NOT_BLACK_AND_WHITE_SEASON_UUID,
				name: 'Not Black and White'
			};

			const { season } = detainingJusticeTricycleProduction.body;

			expect(season).to.deep.equal(expectedSeason);

		});

	});

});

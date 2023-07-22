import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Award ceremonies with sub-sub-materials and sub-sub-productions', () => {

	chai.use(chaiHttp);

	const ROYAL_COURT_THEATRE_VENUE_UUID = '3';
	const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = '4';
	const SUB_HOGE_MATERIAL_UUID = '7';
	const MID_HOGE_MATERIAL_UUID = '13';
	const SUR_HOGE_MATERIAL_UUID = '20';
	const SUB_WIBBLE_PART_I_MATERIAL_UUID = '25';
	const SUB_WIBBLE_PART_II_MATERIAL_UUID = '29';
	const MID_WIBBLE_SECTION_I_MATERIAL_UUID = '37';
	const MID_WIBBLE_SECTION_II_MATERIAL_UUID = '43';
	const SUR_WIBBLE_MATERIAL_UUID = '51';
	const SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID = '55';
	const NOËL_COWARD_THEATRE_VENUE_UUID = '57';
	const MID_HOGE_NOËL_COWARD_PRODUCTION_UUID = '58';
	const SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID = '61';
	const SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '64';
	const SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '67';
	const MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '70';
	const MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '73';
	const SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '76';
	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = '86';
	const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '87';
	const CONOR_CORGE_PERSON_UUID = '88';
	const STAGECRAFT_LTD_COMPANY_UUID = '89';
	const FERDINAND_FOO_PERSON_UUID = '90';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '100';
	const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '101';
	const CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '114';
	const CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID = '115';
	const THE_STAGE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '124';
	const THE_STAGE_THEATRE_AWARDS_AWARD_UUID = '125';
	const WHATSONSTAGE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '130';
	const WHATSONSTAGE_AWARDS_AWARD_UUID = '131';

	let laurenceOlivierAwards2020AwardCeremony;
	let eveningStandardTheatreAwards2019AwardCeremony;
	let criticsCircleTheatreAwards2018AwardCeremony;
	let conorCorgePerson;
	let stagecraftLtdCompany;
	let ferdinandFooPerson;
	let subHogeNoëlCowardProduction;
	let midHogeNoëlCowardProduction;
	let surHogeNoëlCowardProduction;
	let subWibblePartIJerwoodTheatreUpstairsProduction;
	let midWibbleSectionIJerwoodTheatreUpstairsProduction;
	let surWibbleJerwoodTheatreUpstairsProduction;
	let subWibblePartIMaterial;
	let midWibbleSectionIMaterial;
	let surWibbleMaterial;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'Royal Court Theatre',
				subVenues: [
					{
						name: 'Jerwood Theatre Upstairs'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Hoge',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Hoge',
				format: 'sub-collection of plays',
				year: '2019',
				subMaterials: [
					{
						name: 'Sub-Hoge'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Hoge',
				format: 'collection of plays',
				year: '2019',
				subMaterials: [
					{
						name: 'Mid-Hoge'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble: Part I',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble: Part II',
				format: 'play',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Wibble: Section I',
				format: 'sub-trilogy of plays',
				year: '2019',
				subMaterials: [
					{
						name: 'Sub-Wibble: Part I'
					},
					{
						name: 'Sub-Wibble: Part II'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Wibble: Section II',
				format: 'sub-trilogy of plays',
				year: '2019'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Wibble',
				format: 'trilogy of trilogies of plays',
				year: '2019',
				subMaterials: [
					{
						name: 'Mid-Wibble: Section I'
					},
					{
						name: 'Mid-Wibble: Section II'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Hoge',
				startDate: '2019-05-01',
				endDate: '2019-05-31',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Hoge',
				startDate: '2019-05-01',
				endDate: '2019-05-31',
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Hoge',
				startDate: '2019-05-01',
				endDate: '2019-05-31',
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part I',
				startDate: '2019-06-01',
				endDate: '2019-06-30',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part II',
				startDate: '2019-06-01',
				endDate: '2019-06-30',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Wibble: Section I',
				startDate: '2019-06-01',
				endDate: '2019-06-30',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Wibble: Section II',
				startDate: '2019-06-01',
				endDate: '2019-06-30',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Wibble',
				startDate: '2019-06-01',
				endDate: '2019-06-30',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2020',
				award: {
					name: 'Laurence Olivier Awards'
				},
				categories: [
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								entities: [
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Ferdinand Foo'
											}
										]
									}
								],
								productions: [
									{
										uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID
									},
									{
										uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Hoge'
									},
									{
										name: 'Sub-Wibble: Part I'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2019',
				award: {
					name: 'Evening Standard Theatre Awards'
				},
				categories: [
					{
						name: 'Best Random Role',
						nominations: [
							{
								isWinner: true,
								entities: [
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Ferdinand Foo'
											}
										]
									}
								],
								productions: [
									{
										uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID
									},
									{
										uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Hoge'
									},
									{
										name: 'Sur-Wibble'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2018',
				award: {
					name: 'Critics\' Circle Theatre Awards'
				},
				categories: [
					{
						name: 'Most Remarkable Role',
						nominations: [
							{
								isWinner: true,
								entities: [
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Ferdinand Foo'
											}
										]
									}
								],
								productions: [
									{
										uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID
									},
									{
										uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Mid-Hoge'
									},
									{
										name: 'Mid-Wibble: Section I'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2018',
				award: {
					name: 'The Stage Theatre Awards'
				},
				categories: [
					{
						name: 'Most Notable Role',
						nominations: [
							{
								productions: [
									{
										uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Wibble: Part II'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2018',
				award: {
					name: 'WhatsOnStage Awards'
				},
				categories: [
					{
						name: 'Most Interesting Role',
						nominations: [
							{
								isWinner: true,
								productions: [
									{
										uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Mid-Wibble: Section II'
									}
								]
							}
						]
					}
				]
			});

		laurenceOlivierAwards2020AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`);

		eveningStandardTheatreAwards2019AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID}`);

		criticsCircleTheatreAwards2018AwardCeremony = await chai.request(app)
			.get(`/award-ceremonies/${CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID}`);

		conorCorgePerson = await chai.request(app)
			.get(`/people/${CONOR_CORGE_PERSON_UUID}`);

		stagecraftLtdCompany = await chai.request(app)
			.get(`/companies/${STAGECRAFT_LTD_COMPANY_UUID}`);

		ferdinandFooPerson = await chai.request(app)
			.get(`/people/${FERDINAND_FOO_PERSON_UUID}`);

		subHogeNoëlCowardProduction = await chai.request(app)
			.get(`/productions/${SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID}`);

		midHogeNoëlCowardProduction = await chai.request(app)
			.get(`/productions/${MID_HOGE_NOËL_COWARD_PRODUCTION_UUID}`);

		surHogeNoëlCowardProduction = await chai.request(app)
			.get(`/productions/${SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID}`);

		subWibblePartIJerwoodTheatreUpstairsProduction = await chai.request(app)
			.get(`/productions/${SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID}`);

		midWibbleSectionIJerwoodTheatreUpstairsProduction = await chai.request(app)
			.get(`/productions/${MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID}`);

		surWibbleJerwoodTheatreUpstairsProduction = await chai.request(app)
			.get(`/productions/${SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID}`);

		subWibblePartIMaterial = await chai.request(app)
			.get(`/materials/${SUB_WIBBLE_PART_I_MATERIAL_UUID}`);

		midWibbleSectionIMaterial = await chai.request(app)
			.get(`/materials/${MID_WIBBLE_SECTION_I_MATERIAL_UUID}`);

		surWibbleMaterial = await chai.request(app)
			.get(`/materials/${SUR_WIBBLE_MATERIAL_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Laurence Olivier Awards 2020 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Miscellaneous Role',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							type: 'Nomination',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										}
									]
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Sub-Hoge',
									startDate: '2019-05-01',
									endDate: '2019-05-31',
									venue: {
										model: 'VENUE',
										uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
										name: 'Noël Coward Theatre',
										surVenue: null
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Mid-Hoge',
										surProduction: {
											model: 'PRODUCTION',
											uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
											name: 'Sur-Hoge'
										}
									}
								},
								{
									model: 'PRODUCTION',
									uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Sub-Wibble: Part I',
									startDate: '2019-06-01',
									endDate: '2019-06-30',
									venue: {
										model: 'VENUE',
										uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
										name: 'Jerwood Theatre Upstairs',
										surVenue: {
											model: 'VENUE',
											uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
											name: 'Royal Court Theatre'
										}
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
										name: 'Mid-Wibble: Section I',
										surProduction: {
											model: 'PRODUCTION',
											uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
											name: 'Sur-Wibble'
										}
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: SUB_HOGE_MATERIAL_UUID,
									name: 'Sub-Hoge',
									format: 'play',
									year: 2019,
									surMaterial: {
										model: 'MATERIAL',
										uuid: MID_HOGE_MATERIAL_UUID,
										name: 'Mid-Hoge',
										surMaterial: {
											model: 'MATERIAL',
											uuid: SUR_HOGE_MATERIAL_UUID,
											name: 'Sur-Hoge'
										}
									},
									writingCredits: []
								},
								{
									model: 'MATERIAL',
									uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
									name: 'Sub-Wibble: Part I',
									format: 'play',
									year: 2019,
									surMaterial: {
										model: 'MATERIAL',
										uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
										name: 'Mid-Wibble: Section I',
										surMaterial: {
											model: 'MATERIAL',
											uuid: SUR_WIBBLE_MATERIAL_UUID,
											name: 'Sur-Wibble'
										}
									},
									writingCredits: []
								}
							]
						}
					]
				}
			];

			const { categories } = laurenceOlivierAwards2020AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('Evening Standard Theatre Awards 2019 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Best Random Role',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'Winner',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										}
									]
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Sur-Hoge',
									startDate: '2019-05-01',
									endDate: '2019-05-31',
									venue: {
										model: 'VENUE',
										uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
										name: 'Noël Coward Theatre',
										surVenue: null
									},
									surProduction: null
								},
								{
									model: 'PRODUCTION',
									uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Sur-Wibble',
									startDate: '2019-06-01',
									endDate: '2019-06-30',
									venue: {
										model: 'VENUE',
										uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
										name: 'Jerwood Theatre Upstairs',
										surVenue: {
											model: 'VENUE',
											uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
											name: 'Royal Court Theatre'
										}
									},
									surProduction: null
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: SUR_HOGE_MATERIAL_UUID,
									name: 'Sur-Hoge',
									format: 'collection of plays',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								},
								{
									model: 'MATERIAL',
									uuid: SUR_WIBBLE_MATERIAL_UUID,
									name: 'Sur-Wibble',
									format: 'trilogy of trilogies of plays',
									year: 2019,
									surMaterial: null,
									writingCredits: []
								}
							]
						}
					]
				}
			];

			const { categories } = eveningStandardTheatreAwards2019AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('Critics\' Circle Theatre Awards 2018 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					model: 'AWARD_CEREMONY_CATEGORY',
					name: 'Most Remarkable Role',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: true,
							type: 'Winner',
							entities: [
								{
									model: 'PERSON',
									uuid: CONOR_CORGE_PERSON_UUID,
									name: 'Conor Corge'
								},
								{
									model: 'COMPANY',
									uuid: STAGECRAFT_LTD_COMPANY_UUID,
									name: 'Stagecraft Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: FERDINAND_FOO_PERSON_UUID,
											name: 'Ferdinand Foo'
										}
									]
								}
							],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Mid-Hoge',
									startDate: '2019-05-01',
									endDate: '2019-05-31',
									venue: {
										model: 'VENUE',
										uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
										name: 'Noël Coward Theatre',
										surVenue: null
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Sur-Hoge',
										surProduction: null
									}
								},
								{
									model: 'PRODUCTION',
									uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Mid-Wibble: Section I',
									startDate: '2019-06-01',
									endDate: '2019-06-30',
									venue: {
										model: 'VENUE',
										uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
										name: 'Jerwood Theatre Upstairs',
										surVenue: {
											model: 'VENUE',
											uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
											name: 'Royal Court Theatre'
										}
									},
									surProduction: {
										model: 'PRODUCTION',
										uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
										name: 'Sur-Wibble',
										surProduction: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: MID_HOGE_MATERIAL_UUID,
									name: 'Mid-Hoge',
									format: 'sub-collection of plays',
									year: 2019,
									surMaterial: {
										model: 'MATERIAL',
										uuid: SUR_HOGE_MATERIAL_UUID,
										name: 'Sur-Hoge',
										surMaterial: null
									},
									writingCredits: []
								},
								{
									model: 'MATERIAL',
									uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
									name: 'Mid-Wibble: Section I',
									format: 'sub-trilogy of plays',
									year: 2019,
									surMaterial: {
										model: 'MATERIAL',
										uuid: SUR_WIBBLE_MATERIAL_UUID,
										name: 'Sur-Wibble',
										surMaterial: null
									},
									writingCredits: []
								}
							]
						}
					]
				}
			];

			const { categories } = criticsCircleTheatreAwards2018AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('Conor Corge (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble: Section I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
													name: 'Mid-Wibble: Section I',
													format: 'sub-trilogy of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { awards } = conorCorgePerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Stagecraft Ltd (company)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											members: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												}
											],
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble: Section I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
													name: 'Mid-Wibble: Section I',
													format: 'sub-trilogy of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											members: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												}
											],
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											members: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												}
											],
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { awards } = stagecraftLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Ferdinand Foo (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											employerCompany: {
												model: 'COMPANY',
												uuid: STAGECRAFT_LTD_COMPANY_UUID,
												name: 'Stagecraft Ltd',
												coMembers: []
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble: Section I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
													name: 'Mid-Wibble: Section I',
													format: 'sub-trilogy of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											employerCompany: {
												model: 'COMPANY',
												uuid: STAGECRAFT_LTD_COMPANY_UUID,
												name: 'Stagecraft Ltd',
												coMembers: []
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: {
												model: 'COMPANY',
												uuid: STAGECRAFT_LTD_COMPANY_UUID,
												name: 'Stagecraft Ltd',
												coMembers: []
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { awards } = ferdinandFooPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sub-Hoge at Noël Coward Theatre (production)', () => {

		it('includes its and its sur-production\'s and sur-sur-production\'s award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
												name: 'Mid-Hoge',
												startDate: '2019-05-01',
												endDate: '2019-05-31',
												venue: {
													model: 'VENUE',
													uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
													name: 'Noël Coward Theatre',
													surVenue: null
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble: Section I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
													name: 'Mid-Wibble: Section I',
													format: 'sub-trilogy of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
												name: 'Sur-Hoge',
												startDate: '2019-05-01',
												endDate: '2019-05-31',
												venue: {
													model: 'VENUE',
													uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
													name: 'Noël Coward Theatre',
													surVenue: null
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientProduction: null,
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { awards } = subHogeNoëlCowardProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Mid-Hoge at Noël Coward Theatre (production)', () => {

		it('includes its and its sur-production\'s and sub-productions\' award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: null,
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble: Section I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
													name: 'Mid-Wibble: Section I',
													format: 'sub-trilogy of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
												name: 'Sur-Hoge',
												startDate: '2019-05-01',
												endDate: '2019-05-31',
												venue: {
													model: 'VENUE',
													uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
													name: 'Noël Coward Theatre',
													surVenue: null
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
												name: 'Sub-Hoge',
												startDate: '2019-05-01',
												endDate: '2019-05-31',
												venue: {
													model: 'VENUE',
													uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
													name: 'Noël Coward Theatre',
													surVenue: null
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { awards } = midHogeNoëlCowardProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Hoge at Noël Coward Theatre (production)', () => {

		it('includes its and its sub-productions\' and sub-sub-productions\' award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
												name: 'Mid-Hoge',
												startDate: '2019-05-01',
												endDate: '2019-05-31',
												venue: {
													model: 'VENUE',
													uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
													name: 'Noël Coward Theatre',
													surVenue: null
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble: Section I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
													name: 'Mid-Wibble: Section I',
													format: 'sub-trilogy of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: null,
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
												name: 'Sub-Hoge',
												startDate: '2019-05-01',
												endDate: '2019-05-31',
												venue: {
													model: 'VENUE',
													uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
													name: 'Noël Coward Theatre',
													surVenue: null
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { awards } = surHogeNoëlCowardProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sub-Wibble: Part I at Jerwood Theatre Upstairs (production)', () => {

		it('includes its and its sur-production\'s and sur-sur-production\'s award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
												name: 'Mid-Wibble: Section I',
												startDate: '2019-06-01',
												endDate: '2019-06-30',
												venue: {
													model: 'VENUE',
													uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
													name: 'Jerwood Theatre Upstairs',
													surVenue: {
														model: 'VENUE',
														uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
														name: 'Royal Court Theatre'
													}
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
													name: 'Mid-Wibble: Section I',
													format: 'sub-trilogy of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
												name: 'Sur-Wibble',
												startDate: '2019-06-01',
												endDate: '2019-06-30',
												venue: {
													model: 'VENUE',
													uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
													name: 'Jerwood Theatre Upstairs',
													surVenue: {
														model: 'VENUE',
														uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
														name: 'Royal Court Theatre'
													}
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientProduction: null,
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { awards } = subWibblePartIJerwoodTheatreUpstairsProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Mid-Wibble: Section I at Jerwood Theatre Upstairs (production)', () => {

		it('includes its and its sur-production\'s and sub-productions\' award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: null,
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
													name: 'Mid-Wibble: Section I',
													format: 'sub-trilogy of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
												name: 'Sur-Wibble',
												startDate: '2019-06-01',
												endDate: '2019-06-30',
												venue: {
													model: 'VENUE',
													uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
													name: 'Jerwood Theatre Upstairs',
													surVenue: {
														model: 'VENUE',
														uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
														name: 'Royal Court Theatre'
													}
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
												name: 'Sub-Wibble: Part I',
												startDate: '2019-06-01',
												endDate: '2019-06-30',
												venue: {
													model: 'VENUE',
													uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
													name: 'Jerwood Theatre Upstairs',
													surVenue: {
														model: 'VENUE',
														uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
														name: 'Royal Court Theatre'
													}
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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
					model: 'AWARD',
					uuid: THE_STAGE_THEATRE_AWARDS_AWARD_UUID,
					name: 'The Stage Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: THE_STAGE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
												name: 'Sub-Wibble: Part II',
												startDate: '2019-06-01',
												endDate: '2019-06-30',
												venue: {
													model: 'VENUE',
													uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
													name: 'Jerwood Theatre Upstairs',
													surVenue: {
														model: 'VENUE',
														uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
														name: 'Royal Court Theatre'
													}
												}
											},
											entities: [],
											coProductions: [],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
													name: 'Sub-Wibble: Part II',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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

			const { awards } = midWibbleSectionIJerwoodTheatreUpstairsProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Wibble at Jerwood Theatre Upstairs (production)', () => {

		it('includes its and its sub-productions\' and sub-sub-productions\' award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
												name: 'Mid-Wibble: Section I',
												startDate: '2019-06-01',
												endDate: '2019-06-30',
												venue: {
													model: 'VENUE',
													uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
													name: 'Jerwood Theatre Upstairs',
													surVenue: {
														model: 'VENUE',
														uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
														name: 'Royal Court Theatre'
													}
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
												},
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
													name: 'Mid-Wibble: Section I',
													format: 'sub-trilogy of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: null,
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
												},
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of trilogies of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
												name: 'Sub-Wibble: Part I',
												startDate: '2019-06-01',
												endDate: '2019-06-30',
												venue: {
													model: 'VENUE',
													uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
													name: 'Jerwood Theatre Upstairs',
													surVenue: {
														model: 'VENUE',
														uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
														name: 'Royal Court Theatre'
													}
												}
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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
					model: 'AWARD',
					uuid: THE_STAGE_THEATRE_AWARDS_AWARD_UUID,
					name: 'The Stage Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: THE_STAGE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
												name: 'Sub-Wibble: Part II',
												startDate: '2019-06-01',
												endDate: '2019-06-30',
												venue: {
													model: 'VENUE',
													uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
													name: 'Jerwood Theatre Upstairs',
													surVenue: {
														model: 'VENUE',
														uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
														name: 'Royal Court Theatre'
													}
												}
											},
											entities: [],
											coProductions: [],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
													name: 'Sub-Wibble: Part II',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
														name: 'Mid-Wibble: Section I',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
														}
													}
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
					model: 'AWARD',
					uuid: WHATSONSTAGE_AWARDS_AWARD_UUID,
					name: 'WhatsOnStage Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WHATSONSTAGE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Interesting Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientProduction: {
												model: 'PRODUCTION',
												uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
												name: 'Mid-Wibble: Section II',
												startDate: '2019-06-01',
												endDate: '2019-06-30',
												venue: {
													model: 'VENUE',
													uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
													name: 'Jerwood Theatre Upstairs',
													surVenue: {
														model: 'VENUE',
														uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
														name: 'Royal Court Theatre'
													}
												}
											},
											entities: [],
											coProductions: [],
											materials: [
												{
													model: 'MATERIAL',
													uuid: MID_WIBBLE_SECTION_II_MATERIAL_UUID,
													name: 'Mid-Wibble: Section II',
													format: 'sub-trilogy of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
													}
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

			const { awards } = surWibbleJerwoodTheatreUpstairsProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sub-Wibble: Part I (play) (material)', () => {

		it('includes its and its sur-material\'s and sur-sur-material\'s award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
												name: 'Mid-Wibble: Section I',
												format: 'sub-trilogy of plays',
												year: 2019
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble: Section I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: SUR_WIBBLE_MATERIAL_UUID,
												name: 'Sur-Wibble',
												format: 'trilogy of trilogies of plays',
												year: 2019
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: null
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientMaterial: null,
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
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

			const { awards } = subWibblePartIMaterial.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Mid-Wibble: Section I (trilogy of plays) (material)', () => {

		it('includes its and its sur-material\'s and sub-materials\' award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterial: null,
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble: Section I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: SUR_WIBBLE_MATERIAL_UUID,
												name: 'Sur-Wibble',
												format: 'trilogy of trilogies of plays',
												year: 2019
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: null
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
												name: 'Sub-Wibble: Part I',
												format: 'play',
												year: 2019
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
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
					model: 'AWARD',
					uuid: THE_STAGE_THEATRE_AWARDS_AWARD_UUID,
					name: 'The Stage Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: THE_STAGE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
												name: 'Sub-Wibble: Part II',
												format: 'play',
												year: 2019
											},
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part II',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											coMaterials: []
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = midWibbleSectionIMaterial.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Wibble (trilogy of trilogies of plays) (material)', () => {

		it('includes its and its sub-materials\' and sub-sub-materials\' award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: MID_WIBBLE_SECTION_I_MATERIAL_UUID,
												name: 'Mid-Wibble: Section I',
												format: 'sub-trilogy of plays',
												year: 2019
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble: Section I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
													}
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
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterial: null,
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: null
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2019,
													surMaterial: null
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
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
												name: 'Sub-Wibble: Part I',
												format: 'play',
												year: 2019
											},
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
													startDate: '2019-05-01',
													endDate: '2019-05-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											coMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
														}
													}
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
					model: 'AWARD',
					uuid: THE_STAGE_THEATRE_AWARDS_AWARD_UUID,
					name: 'The Stage Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: THE_STAGE_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
												name: 'Sub-Wibble: Part II',
												format: 'play',
												year: 2019
											},
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part II',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble: Section I',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											coMaterials: []
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: WHATSONSTAGE_AWARDS_AWARD_UUID,
					name: 'WhatsOnStage Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WHATSONSTAGE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Interesting Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											recipientMaterial: {
												model: 'MATERIAL',
												uuid: MID_WIBBLE_SECTION_II_MATERIAL_UUID,
												name: 'Mid-Wibble: Section II',
												format: 'sub-trilogy of plays',
												year: 2019
											},
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble: Section II',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											coMaterials: []
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = surWibbleMaterial.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

});

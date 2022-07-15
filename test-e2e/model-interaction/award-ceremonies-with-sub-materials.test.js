import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Award ceremonies with sub-materials', () => {

	chai.use(chaiHttp);

	const SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID = '0';
	const OLD_VIC_THEATRE_VENUE_UUID = '2';
	const SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID = '3';
	const SUB_WALDO_MATERIAL_UUID = '8';
	const SUR_WALDO_MATERIAL_UUID = '13';
	const SUB_WIBBLE_MATERIAL_UUID = '19';
	const SUR_WIBBLE_MATERIAL_UUID = '26';
	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = '36';
	const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '37';
	const CONOR_CORGE_PERSON_UUID = '38';
	const STAGECRAFT_LTD_COMPANY_UUID = '39';
	const FERDINAND_FOO_PERSON_UUID = '40';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '48';
	const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '49';

	let laurenceOlivierAwards2020AwardCeremony;
	let eveningStandardTheatreAwards2019AwardCeremony;
	let conorCorgePerson;
	let stagecraftLtdCompany;
	let ferdinandFooPerson;
	let subWibbleOldVicProduction;
	let surWibbleOldVicProduction;
	let subWibbleMaterial;
	let surWibbleMaterial;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble',
				startDate: '2019-08-01',
				endDate: '2019-08-31',
				venue: {
					name: 'Old Vic Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Wibble',
				startDate: '2019-08-01',
				endDate: '2019-08-31',
				venue: {
					name: 'Old Vic Theatre'
				}
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Waldo',
				format: 'novel',
				year: '2017'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Waldo',
				format: 'trilogy of novels',
				year: '2017',
				subMaterials: [
					{
						name: 'Sub-Waldo'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble',
				format: 'play',
				year: '2019',
				writingCredits: [
					{
						name: 'adapted from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Sub-Waldo'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Wibble',
				format: 'trilogy of plays',
				year: '2019',
				writingCredits: [
					{
						name: 'adapted from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Sur-Waldo'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Wibble'
					}
				]
			});

		await chai.request(app)
			.post('/awards/ceremonies')
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
										uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Wibble'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/awards/ceremonies')
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
										uuid: SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Wibble'
									}
								]
							}
						]
					}
				]
			});

		laurenceOlivierAwards2020AwardCeremony = await chai.request(app)
			.get(`/awards/ceremonies/${LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID}`);

		eveningStandardTheatreAwards2019AwardCeremony = await chai.request(app)
			.get(`/awards/ceremonies/${EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID}`);

		conorCorgePerson = await chai.request(app)
			.get(`/people/${CONOR_CORGE_PERSON_UUID}`);

		stagecraftLtdCompany = await chai.request(app)
			.get(`/companies/${STAGECRAFT_LTD_COMPANY_UUID}`);

		ferdinandFooPerson = await chai.request(app)
			.get(`/people/${FERDINAND_FOO_PERSON_UUID}`);

		subWibbleOldVicProduction = await chai.request(app)
			.get(`/productions/${SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID}`);

		surWibbleOldVicProduction = await chai.request(app)
			.get(`/productions/${SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID}`);

		subWibbleMaterial = await chai.request(app)
			.get(`/materials/${SUB_WIBBLE_MATERIAL_UUID}`);

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
									uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID,
									name: 'Sub-Wibble',
									startDate: '2019-08-01',
									endDate: '2019-08-31',
									venue: {
										model: 'VENUE',
										uuid: OLD_VIC_THEATRE_VENUE_UUID,
										name: 'Old Vic Theatre',
										surVenue: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: SUB_WIBBLE_MATERIAL_UUID,
									name: 'Sub-Wibble',
									format: 'play',
									year: 2019,
									surMaterial: {
										model: 'MATERIAL',
										uuid: SUR_WIBBLE_MATERIAL_UUID,
										name: 'Sur-Wibble'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'adapted from',
											entities: [
												{
													model: 'MATERIAL',
													uuid: SUB_WALDO_MATERIAL_UUID,
													name: 'Sub-Waldo',
													format: 'novel',
													year: 2017,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WALDO_MATERIAL_UUID,
														name: 'Sur-Waldo'
													},
													writingCredits: []
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
									uuid: SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID,
									name: 'Sur-Wibble',
									startDate: '2019-08-01',
									endDate: '2019-08-31',
									venue: {
										model: 'VENUE',
										uuid: OLD_VIC_THEATRE_VENUE_UUID,
										name: 'Old Vic Theatre',
										surVenue: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: SUR_WIBBLE_MATERIAL_UUID,
									name: 'Sur-Wibble',
									format: 'trilogy of plays',
									year: 2019,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'adapted from',
											entities: [
												{
													model: 'MATERIAL',
													uuid: SUR_WALDO_MATERIAL_UUID,
													name: 'Sur-Waldo',
													format: 'trilogy of novels',
													year: 2017,
													surMaterial: null,
													writingCredits: []
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

			const { categories } = eveningStandardTheatreAwards2019AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('Conor Corge (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
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
													uuid: SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of plays',
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
													uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Sub-Wibble',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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
													uuid: SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of plays',
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
													uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Sub-Wibble',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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
													uuid: SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of plays',
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
													uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Sub-Wibble',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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

	describe('Sub-Wibble at Old Vic Theatre (production)', () => {

		it('includes its award nominations', () => {

			const expectedAwards = [
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
											coProductions: [],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2019,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble'
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

			const { awards } = subWibbleOldVicProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Wibble at Old Vic Theatre (production)', () => {

		it('includes its award nominations', () => {

			const expectedAwards = [
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
											coProductions: [],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of plays',
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
				}
			];

			const { awards } = surWibbleOldVicProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sub-Wibble (play) (material)', () => {

		it('includes its and its sur-material\'s award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
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
												format: 'trilogy of plays',
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
													uuid: SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
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
													uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Sub-Wibble',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
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

			const { awards } = subWibbleMaterial.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Wibble (trilogy of plays) (material)', () => {

		it('includes its and its sub-materials\' award nominations, in the latter case specifying the recipient', () => {

			const expectedAwards = [
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
													uuid: SUR_WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
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
												uuid: SUB_WIBBLE_MATERIAL_UUID,
												name: 'Sub-Wibble',
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
													uuid: SUB_WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Sub-Wibble',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
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

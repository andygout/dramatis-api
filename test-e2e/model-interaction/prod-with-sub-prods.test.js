import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Production with sub-productions', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_VENUE_UUID = '3';
	const OLIVIER_THEATRE_VENUE_UUID = '4';
	const VOYAGE_MATERIAL_UUID = '10';
	const TOM_STOPPARD_JR_PERSON_UUID = '12';
	const THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID = '13';
	const ALEXANDER_HERZEN_JR_CHARACTER_UUID = '14';
	const SHIPWRECK_MATERIAL_UUID = '20';
	const SALVAGE_MATERIAL_UUID = '30';
	const THE_COAST_OF_UTOPIA_MATERIAL_UUID = '46';
	const TOM_STOPPARD_SR_PERSON_UUID = '48';
	const THE_SUR_STRÄUSSLER_GROUP_COMPANY_UUID = '49';
	const ALEXANDER_HERZEN_SR_CHARACTER_UUID = '53';
	const VOYAGE_OLIVIER_PRODUCTION_UUID = '54';
	const TREVOR_NUNN_JR_PERSON_UUID = '57';
	const SUB_NATIONAL_THEATRE_COMPANY_UUID = '58';
	const NICK_STARR_JR_PERSON_UUID = '59';
	const STEPHEN_DILLANE_JR_PERSON_UUID = '60';
	const STEVEN_EDIS_JR_PERSON_UUID = '61';
	const SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID = '62';
	const MARK_BOUSIE_JR_PERSON_UUID = '63';
	const FIONA_BARDSLEY_JR_PERSON_UUID = '64';
	const SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID = '65';
	const SUE_MILLIN_JR_PERSON_UUID = '66';
	const SHIPWRECK_OLIVIER_PRODUCTION_UUID = '67';
	const SALVAGE_OLIVIER_PRODUCTION_UUID = '80';
	const THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID = '93';
	const TREVOR_NUNN_SR_PERSON_UUID = '96';
	const SUR_NATIONAL_THEATRE_COMPANY_UUID = '97';
	const NICK_STARR_SR_PERSON_UUID = '98';
	const STEPHEN_DILLANE_SR_PERSON_UUID = '99';
	const STEVEN_EDIS_SR_PERSON_UUID = '100';
	const SUR_MUSICAL_DIRECTION_LTD_COMPANY_UUID = '101';
	const MARK_BOUSIE_SR_PERSON_UUID = '102';
	const FIONA_BARDSLEY_SR_PERSON_UUID = '103';
	const SUR_STAGE_MANAGEMENT_LTD_COMPANY_UUID = '104';
	const SUE_MILLIN_SR_PERSON_UUID = '105';
	const VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID = '106';
	const VIVIAN_BEAUMONT_THEATRE_VENUE_UUID = '108';
	const SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID = '109';
	const SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID = '112';
	const THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID = '115';

	let theCoastOfUtopiaOlivierProduction;
	let voyageOlivierProduction;
	let theCoastOfUtopiaVivianBeaumontProduction;
	let voyageVivianBeaumontProduction;
	let theCoastOfUtopiaMaterial;
	let voyageMaterial;
	let nationalTheatreVenue;
	let olivierTheatreVenue;
	let trevorNunnJrPerson;
	let subNationalTheatreCompany;
	let nickStarrJrPerson;
	let stephenDillaneJrPerson;
	let stevenEdisJrPerson;
	let subMusicalDirectionLtdCompany;
	let markBousieJrPerson;
	let fionaBardsleyJrPerson;
	let subStageManagementLtdCompany;
	let sueMillinJrPerson;
	let alexanderHerzenJrCharacter;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/venues')
			.send({
				name: 'National Theatre',
				subVenues: [
					{
						name: 'Olivier Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Voyage',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard Jr'
							},
							{
								model: 'COMPANY',
								name: 'The Sub-Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Shipwreck',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard Jr'
							},
							{
								model: 'COMPANY',
								name: 'The Sub-Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Salvage',
				format: 'play',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard Jr'
							},
							{
								model: 'COMPANY',
								name: 'The Sub-Sträussler Group'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Coast of Utopia',
				format: 'trilogy of plays',
				year: '2002',
				writingCredits: [
					{
						entities: [
							{
								name: 'Tom Stoppard Sr'
							},
							{
								model: 'COMPANY',
								name: 'The Sur-Sträussler Group'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Voyage'
					},
					{
						name: 'Shipwreck'
					},
					{
						name: 'Salvage'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen Sr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Voyage',
				startDate: '2002-06-27',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'Voyage'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Trevor Nunn Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-National Theatre Company',
								members: [
									{
										name: 'Nick Starr Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane Jr',
						roles: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Musical Directors',
						entities: [
							{
								name: 'Steven Edis Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Shipwreck',
				startDate: '2002-07-08',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'Shipwreck'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Trevor Nunn Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-National Theatre Company',
								members: [
									{
										name: 'Nick Starr Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane Jr',
						roles: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Musical Directors',
						entities: [
							{
								name: 'Steven Edis Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Salvage',
				startDate: '2002-07-19',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'Salvage'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Trevor Nunn Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-National Theatre Company',
								members: [
									{
										name: 'Nick Starr Jr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane Jr',
						roles: [
							{
								name: 'Alexander Herzen Jr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Junior Musical Directors',
						entities: [
							{
								name: 'Steven Edis Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie Jr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Junior Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin Jr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Coast of Utopia',
				startDate: '2002-06-27',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					name: 'The Coast of Utopia'
				},
				venue: {
					name: 'Olivier Theatre'
				},
				subProductions: [
					{
						uuid: VOYAGE_OLIVIER_PRODUCTION_UUID
					},
					{
						uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID
					},
					{
						uuid: SALVAGE_OLIVIER_PRODUCTION_UUID
					}
				],
				producerCredits: [
					{
						entities: [
							{
								name: 'Trevor Nunn Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-National Theatre Company',
								members: [
									{
										name: 'Nick Starr Sr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane Sr',
						roles: [
							{
								name: 'Alexander Herzen Sr'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Senior Musical Directors',
						entities: [
							{
								name: 'Steven Edis Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie Sr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Senior Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin Sr'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Voyage',
				startDate: '2006-10-17',
				pressDate: '2006-11-27',
				endDate: '2007-05-12',
				material: {
					name: 'Voyage'
				},
				venue: {
					name: 'Vivian Beaumont Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Shipwreck',
				startDate: '2006-12-05',
				pressDate: '2006-12-21',
				endDate: '2007-05-12',
				material: {
					name: 'Shipwreck'
				},
				venue: {
					name: 'Vivian Beaumont Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Salvage',
				startDate: '2007-01-31',
				pressDate: '2007-02-18',
				endDate: '2007-05-13',
				material: {
					name: 'Salvage'
				},
				venue: {
					name: 'Vivian Beaumont Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Coast of Utopia',
				startDate: '2006-10-17',
				endDate: '2007-05-13',
				material: {
					name: 'The Coast of Utopia'
				},
				venue: {
					name: 'Vivian Beaumont Theatre'
				},
				subProductions: [
					{
						uuid: VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID
					},
					{
						uuid: SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID
					},
					{
						uuid: SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID
					}
				]
			});

		theCoastOfUtopiaOlivierProduction = await chai.request(app)
			.get(`/productions/${THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID}`);

		voyageOlivierProduction = await chai.request(app)
			.get(`/productions/${VOYAGE_OLIVIER_PRODUCTION_UUID}`);

		theCoastOfUtopiaVivianBeaumontProduction = await chai.request(app)
			.get(`/productions/${THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID}`);

		voyageVivianBeaumontProduction = await chai.request(app)
			.get(`/productions/${VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID}`);

		theCoastOfUtopiaMaterial = await chai.request(app)
			.get(`/materials/${THE_COAST_OF_UTOPIA_MATERIAL_UUID}`);

		voyageMaterial = await chai.request(app)
			.get(`/materials/${VOYAGE_MATERIAL_UUID}`);

		nationalTheatreVenue = await chai.request(app)
			.get(`/venues/${NATIONAL_THEATRE_VENUE_UUID}`);

		olivierTheatreVenue = await chai.request(app)
			.get(`/venues/${OLIVIER_THEATRE_VENUE_UUID}`);

		trevorNunnJrPerson = await chai.request(app)
			.get(`/people/${TREVOR_NUNN_JR_PERSON_UUID}`);

		subNationalTheatreCompany = await chai.request(app)
			.get(`/companies/${SUB_NATIONAL_THEATRE_COMPANY_UUID}`);

		nickStarrJrPerson = await chai.request(app)
			.get(`/people/${NICK_STARR_JR_PERSON_UUID}`);

		stephenDillaneJrPerson = await chai.request(app)
			.get(`/people/${STEPHEN_DILLANE_JR_PERSON_UUID}`);

		stevenEdisJrPerson = await chai.request(app)
			.get(`/people/${STEVEN_EDIS_JR_PERSON_UUID}`);

		subMusicalDirectionLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID}`);

		markBousieJrPerson = await chai.request(app)
			.get(`/people/${MARK_BOUSIE_JR_PERSON_UUID}`);

		fionaBardsleyJrPerson = await chai.request(app)
			.get(`/people/${FIONA_BARDSLEY_JR_PERSON_UUID}`);

		subStageManagementLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID}`);

		sueMillinJrPerson = await chai.request(app)
			.get(`/people/${SUE_MILLIN_JR_PERSON_UUID}`);

		alexanderHerzenJrCharacter = await chai.request(app)
			.get(`/characters/${ALEXANDER_HERZEN_JR_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Coast of Utopia at Olivier Theatre (production with sub-productions that have a sur-venue)', () => {

		it('includes its sub-productions', () => {

			const expectedSubProductions = [
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					pressDate: '2002-08-03',
					endDate: '2002-11-23',
					material: {
						model: 'MATERIAL',
						uuid: VOYAGE_MATERIAL_UUID,
						name: 'Voyage',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					subProductions: [],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roles: [
								{
									model: 'CHARACTER',
									uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
									name: 'Alexander Herzen Jr',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					pressDate: '2002-08-03',
					endDate: '2002-11-23',
					material: {
						model: 'MATERIAL',
						uuid: SHIPWRECK_MATERIAL_UUID,
						name: 'Shipwreck',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					subProductions: [],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roles: [
								{
									model: 'CHARACTER',
									uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
									name: 'Alexander Herzen Jr',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					pressDate: '2002-08-03',
					endDate: '2002-11-23',
					material: {
						model: 'MATERIAL',
						uuid: SALVAGE_MATERIAL_UUID,
						name: 'Salvage',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					subProductions: [],
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roles: [
								{
									model: 'CHARACTER',
									uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
									name: 'Alexander Herzen Jr',
									qualifier: null,
									isAlternate: false
								}
							]
						}
					],
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							entities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							entities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { subProductions } = theCoastOfUtopiaOlivierProduction.body;

			expect(subProductions).to.deep.equal(expectedSubProductions);

		});

	});

	describe('Voyage at Olivier Theatre (production with sur-production that has a sur-venue)', () => {

		it('includes The Coast of Utopia at Olivier Theatre as its sur-production', () => {

			const expectedSurProduction = {
				model: 'PRODUCTION',
				uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
				name: 'The Coast of Utopia',
				startDate: '2002-06-27',
				pressDate: '2002-08-03',
				endDate: '2002-11-23',
				material: {
					model: 'MATERIAL',
					uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
					name: 'The Coast of Utopia',
					format: 'trilogy of plays',
					year: 2002,
					surMaterial: null,
					writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_SR_PERSON_UUID,
										name: 'Tom Stoppard Sr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUR_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sur-Sträussler Group'
									}
								]
							}
					]
				},
				venue: {
					model: 'VENUE',
					uuid: OLIVIER_THEATRE_VENUE_UUID,
					name: 'Olivier Theatre',
					surVenue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre'
					}
				},
				surProduction: null,
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: TREVOR_NUNN_SR_PERSON_UUID,
								name: 'Trevor Nunn Sr'
							},
							{
								model: 'COMPANY',
								uuid: SUR_NATIONAL_THEATRE_COMPANY_UUID,
								name: 'Sur-National Theatre Company',
								members: [
									{
										model: 'PERSON',
										uuid: NICK_STARR_SR_PERSON_UUID,
										name: 'Nick Starr Sr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						uuid: STEPHEN_DILLANE_SR_PERSON_UUID,
						name: 'Stephen Dillane Sr',
						roles: [
							{
								model: 'CHARACTER',
								uuid: ALEXANDER_HERZEN_SR_CHARACTER_UUID,
								name: 'Alexander Herzen Sr',
								qualifier: null,
								isAlternate: false
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Senior Musical Directors',
						entities: [
							{
								model: 'PERSON',
								uuid: STEVEN_EDIS_SR_PERSON_UUID,
								name: 'Steven Edis Sr'
							},
							{
								model: 'COMPANY',
								uuid: SUR_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Sur-Musical Direction Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: MARK_BOUSIE_SR_PERSON_UUID,
										name: 'Mark Bousie Sr'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Senior Stage Managers',
						entities: [
							{
								model: 'PERSON',
								uuid: FIONA_BARDSLEY_SR_PERSON_UUID,
								name: 'Fiona Bardsley Sr'
							},
							{
								model: 'COMPANY',
								uuid: SUR_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sur-Stage Management Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: SUE_MILLIN_SR_PERSON_UUID,
										name: 'Sue Millin Sr'
									}
								]
							}
						]
					}
				]
			};

			const { surProduction } = voyageOlivierProduction.body;

			expect(surProduction).to.deep.equal(expectedSurProduction);

		});

	});

	describe('The Coast of Utopia at Vivian Beaumont Theatre (production with sub-productions that do not have a sur-venue)', () => {

		it('includes its sub-productions', () => {

			const expectedSubProductions = [
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2006-10-17',
					pressDate: '2006-11-27',
					endDate: '2007-05-12',
					material: {
						model: 'MATERIAL',
						uuid: VOYAGE_MATERIAL_UUID,
						name: 'Voyage',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2006-12-05',
					pressDate: '2006-12-21',
					endDate: '2007-05-12',
					material: {
						model: 'MATERIAL',
						uuid: SHIPWRECK_MATERIAL_UUID,
						name: 'Shipwreck',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				},
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2007-01-31',
					pressDate: '2007-02-18',
					endDate: '2007-05-13',
					material: {
						model: 'MATERIAL',
						uuid: SALVAGE_MATERIAL_UUID,
						name: 'Salvage',
						format: 'play',
						year: 2002,
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
							name: 'The Coast of Utopia',
							surMaterial: null
						},
						writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_JR_PERSON_UUID,
										name: 'Tom Stoppard Jr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUB_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sub-Sträussler Group'
									}
								]
							}
						]
					},
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					subProductions: [],
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				}
			];

			const { subProductions } = theCoastOfUtopiaVivianBeaumontProduction.body;

			expect(subProductions).to.deep.equal(expectedSubProductions);

		});

	});

	describe('Voyage at Vivian Beaumont Theatre (production with sur-production that does not have a sur-venue)', () => {

		it('includes The Coast of Utopia at Olivier Theatre as its sur-production', () => {

			const expectedSurProduction = {
				model: 'PRODUCTION',
				uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
				name: 'The Coast of Utopia',
				startDate: '2006-10-17',
				pressDate: null,
				endDate: '2007-05-13',
				material: {
					model: 'MATERIAL',
					uuid: THE_COAST_OF_UTOPIA_MATERIAL_UUID,
					name: 'The Coast of Utopia',
					format: 'trilogy of plays',
					year: 2002,
					surMaterial: null,
					writingCredits: [
							{
								model: 'WRITING_CREDIT',
								name: 'by',
								entities: [
									{
										model: 'PERSON',
										uuid: TOM_STOPPARD_SR_PERSON_UUID,
										name: 'Tom Stoppard Sr'
									},
									{
										model: 'COMPANY',
										uuid: THE_SUR_STRÄUSSLER_GROUP_COMPANY_UUID,
										name: 'The Sur-Sträussler Group'
									}
								]
							}
					]
				},
				venue: {
					model: 'VENUE',
					uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
					name: 'Vivian Beaumont Theatre',
					surVenue: null
				},
				surProduction: null,
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: []
			};

			const { surProduction } = voyageVivianBeaumontProduction.body;

			expect(surProduction).to.deep.equal(expectedSurProduction);

		});

	});

	describe('The Coast of Utopia (material)', () => {

		it('includes its productions (but with no sur-productions as does not apply)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'The Coast of Utopia',
					startDate: '2006-10-17',
					endDate: '2007-05-13',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
					name: 'The Coast of Utopia',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: null
				}
			];

			const { productions } = theCoastOfUtopiaMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Voyage (material)', () => {

		it('includes its productions and their sur-productions', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2006-10-17',
					endDate: '2007-05-12',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			const { productions } = voyageMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('National Theatre (venue)', () => {

		it('includes productions at this venue, including the specific sub-venue and, where applicable, corresponding sur-productions; will exclude sur-productions when included via sub-production association', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					subVenue: {
						model: 'VENUE',
						name: 'Olivier Theatre',
						uuid: OLIVIER_THEATRE_VENUE_UUID
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					subVenue: {
						model: 'VENUE',
						name: 'Olivier Theatre',
						uuid: OLIVIER_THEATRE_VENUE_UUID
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					subVenue: {
						model: 'VENUE',
						name: 'Olivier Theatre',
						uuid: OLIVIER_THEATRE_VENUE_UUID
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			const { productions } = nationalTheatreVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Olivier Theatre (venue)', () => {

		it('includes productions at this venue and, where applicable, corresponding sur-productions; will exclude sur-productions when included via sub-production association', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					subVenue: null,
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			const { productions } = olivierTheatreVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Trevor Nunn Jr (person)', () => {

		it('includes productions for which they have a producer credit, including the sur-production', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = trevorNunnJrPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Sub-National Theatre Company (company)', () => {

		it('includes productions for which they have a producer credit, including the sur-production', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = subNationalTheatreCompany.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Nick Starr Jr (person)', () => {

		it('includes productions for which they have a producer credit, including the sur-production', () => {
			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_JR_PERSON_UUID,
									name: 'Trevor Nunn Jr'
								},
								{
									model: 'COMPANY',
									uuid: SUB_NATIONAL_THEATRE_COMPANY_UUID,
									name: 'Sub-National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_JR_PERSON_UUID,
											name: 'Nick Starr Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = nickStarrJrPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Stephen Dillane Jr (person)', () => {

		it('includes productions for which they have a cast credit, including the sur-production', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
							name: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
							name: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: ALEXANDER_HERZEN_JR_CHARACTER_UUID,
							name: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = stephenDillaneJrPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Steven Edis Jr (person)', () => {

		it('includes productions for which they have a creative team credit, including the sur-production', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Sub-Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_JR_PERSON_UUID,
											name: 'Mark Bousie Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = stevenEdisJrPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Sub-Musical Direction Ltd (company)', () => {

		it('includes productions for which they have a creative team credit, including the sur-production', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							members: [
								{
									model: 'PERSON',
									uuid: MARK_BOUSIE_JR_PERSON_UUID,
									name: 'Mark Bousie Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							members: [
								{
									model: 'PERSON',
									uuid: MARK_BOUSIE_JR_PERSON_UUID,
									name: 'Mark Bousie Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							members: [
								{
									model: 'PERSON',
									uuid: MARK_BOUSIE_JR_PERSON_UUID,
									name: 'Mark Bousie Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = subMusicalDirectionLtdCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Mark Bousie Jr (person)', () => {

		it('includes productions for which they have a creative team credit, including the sur-production', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Sub-Musical Direction Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Sub-Musical Direction Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Junior Musical Directors',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Sub-Musical Direction Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_JR_PERSON_UUID,
									name: 'Steven Edis Jr'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = markBousieJrPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Fiona Bardsley Jr (person)', () => {

		it('includes productions for which they have a crew credit, including the sur-production', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Sub-Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_JR_PERSON_UUID,
											name: 'Sue Millin Jr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { crewProductions } = fionaBardsleyJrPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Sub-Stage Management Ltd (company)', () => {

		it('includes productions for which they have a crew credit, including the sur-production', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: SUE_MILLIN_JR_PERSON_UUID,
									name: 'Sue Millin Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: SUE_MILLIN_JR_PERSON_UUID,
									name: 'Sue Millin Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: SUE_MILLIN_JR_PERSON_UUID,
									name: 'Sue Millin Jr'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = subStageManagementLtdCompany.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Sue Millin Jr (person)', () => {

		it('includes productions for which they have a crew credit, including the sur-production', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Junior Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: SUB_STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Sub-Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_JR_PERSON_UUID,
									name: 'Fiona Bardsley Jr'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = sueMillinJrPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Alexander Herzen Jr (character)', () => {

		it('includes productions in which character was portrayed, including the sur-production', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roleName: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roleName: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_JR_PERSON_UUID,
							name: 'Stephen Dillane Jr',
							roleName: 'Alexander Herzen Jr',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = alexanderHerzenJrCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('productions list', () => {

		it('includes productions and, where applicable, corresponding sur-productions; will exclude sur-productions as these will be included via their sub-productions', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2007-01-31',
					endDate: '2007-05-13',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2006-12-05',
					endDate: '2007-05-12',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2006-10-17',
					endDate: '2007-05-12',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SALVAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2002-07-19',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SHIPWRECK_OLIVIER_PRODUCTION_UUID,
					name: 'Shipwreck',
					startDate: '2002-07-08',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: VOYAGE_OLIVIER_PRODUCTION_UUID,
					name: 'Voyage',
					startDate: '2002-06-27',
					endDate: '2002-11-23',
					venue: {
						model: 'VENUE',
						uuid: OLIVIER_THEATRE_VENUE_UUID,
						name: 'Olivier Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID,
						name: 'The Coast of Utopia',
						surProduction: null
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

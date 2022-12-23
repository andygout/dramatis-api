import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Production with sub-productions', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_VENUE_UUID = '2';
	const OLIVIER_THEATRE_VENUE_UUID = '3';
	const VOYAGE_MATERIAL_UUID = '7';
	const ALEXANDER_HERZEN_CHARACTER_UUID = '9';
	const THE_COAST_OF_UTOPIA_MATERIAL_UUID = '27';
	const VOYAGE_OLIVIER_PRODUCTION_UUID = '32';
	const TREVOR_NUNN_PERSON_UUID = '35';
	const NATIONAL_THEATRE_COMPANY_UUID = '36';
	const NICK_STARR_PERSON_UUID = '37';
	const STEPHEN_DILLANE_PERSON_UUID = '38';
	const STEVEN_EDIS_PERSON_UUID = '39';
	const MUSICAL_DIRECTION_LTD_COMPANY_UUID = '40';
	const MARK_BOUSIE_PERSON_UUID = '41';
	const FIONA_BARDSLEY_PERSON_UUID = '42';
	const STAGE_MANAGEMENT_LTD_COMPANY_UUID = '43';
	const SUE_MILLIN_PERSON_UUID = '44';
	const SHIPWRECK_OLIVIER_PRODUCTION_UUID = '45';
	const SALVAGE_OLIVIER_PRODUCTION_UUID = '58';
	const THE_COAST_OF_UTOPIA_OLIVIER_PRODUCTION_UUID = '71';
	const VOYAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID = '74';
	const VIVIAN_BEAUMONT_THEATRE_VENUE_UUID = '76';
	const SHIPWRECK_VIVIAN_BEAUMONT_PRODUCTION_UUID = '77';
	const SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID = '80';
	const THE_COAST_OF_UTOPIA_VIVIAN_BEAUMONT_PRODUCTION_UUID = '83';

	let theCoastOfUtopiaOlivierProduction;
	let voyageOlivierProduction;
	let theCoastOfUtopiaVivianBeaumontProduction;
	let voyageVivianBeaumontProduction;
	let theCoastOfUtopiaMaterial;
	let voyageMaterial;
	let nationalTheatreVenue;
	let olivierTheatreVenue;
	let trevorNunnPerson;
	let nationalTheatreCompany;
	let nickStarrPerson;
	let stephenDillanePerson;
	let stevenEdisPerson;
	let musicalDirectionLtdCompany;
	let markBousiePerson;
	let fionaBardsleyPerson;
	let stageManagementLtdCompany;
	let sueMillinPerson;
	let alexanderHerzenCharacter;

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
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen'
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
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen'
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
				characterGroups: [
					{
						characters: [
							{
								name: 'Alexander Herzen'
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
								name: 'Trevor Nunn'
							},
							{
								model: 'COMPANY',
								name: 'National Theatre Company',
								members: [
									{
										name: 'Nick Starr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane',
						roles: [
							{
								name: 'Alexander Herzen'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Musical Directors',
						entities: [
							{
								name: 'Steven Edis'
							},
							{
								model: 'COMPANY',
								name: 'Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin'
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
								name: 'Trevor Nunn'
							},
							{
								model: 'COMPANY',
								name: 'National Theatre Company',
								members: [
									{
										name: 'Nick Starr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane',
						roles: [
							{
								name: 'Alexander Herzen'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Musical Directors',
						entities: [
							{
								name: 'Steven Edis'
							},
							{
								model: 'COMPANY',
								name: 'Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin'
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
								name: 'Trevor Nunn'
							},
							{
								model: 'COMPANY',
								name: 'National Theatre Company',
								members: [
									{
										name: 'Nick Starr'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Stephen Dillane',
						roles: [
							{
								name: 'Alexander Herzen'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Musical Directors',
						entities: [
							{
								name: 'Steven Edis'
							},
							{
								model: 'COMPANY',
								name: 'Musical Direction Ltd',
								members: [
									{
										name: 'Mark Bousie'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Fiona Bardsley'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Sue Millin'
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

		trevorNunnPerson = await chai.request(app)
			.get(`/people/${TREVOR_NUNN_PERSON_UUID}`);

		nationalTheatreCompany = await chai.request(app)
			.get(`/companies/${NATIONAL_THEATRE_COMPANY_UUID}`);

		nickStarrPerson = await chai.request(app)
			.get(`/people/${NICK_STARR_PERSON_UUID}`);

		stephenDillanePerson = await chai.request(app)
			.get(`/people/${STEPHEN_DILLANE_PERSON_UUID}`);

		stevenEdisPerson = await chai.request(app)
			.get(`/people/${STEVEN_EDIS_PERSON_UUID}`);

		musicalDirectionLtdCompany = await chai.request(app)
			.get(`/companies/${MUSICAL_DIRECTION_LTD_COMPANY_UUID}`);

		markBousiePerson = await chai.request(app)
			.get(`/people/${MARK_BOUSIE_PERSON_UUID}`);

		fionaBardsleyPerson = await chai.request(app)
			.get(`/people/${FIONA_BARDSLEY_PERSON_UUID}`);

		stageManagementLtdCompany = await chai.request(app)
			.get(`/companies/${STAGE_MANAGEMENT_LTD_COMPANY_UUID}`);

		sueMillinPerson = await chai.request(app)
			.get(`/people/${SUE_MILLIN_PERSON_UUID}`);

		alexanderHerzenCharacter = await chai.request(app)
			.get(`/characters/${ALEXANDER_HERZEN_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Coast of Utopia at Olivier Theatre (production with sub-productions that have a sur-venue)', () => {

		it('includes its sub-productions', () => {

			const expectedSubProductions = [
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
					}
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
				}
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
					uuid: SALVAGE_VIVIAN_BEAUMONT_PRODUCTION_UUID,
					name: 'Salvage',
					startDate: '2007-01-31',
					endDate: '2007-05-13',
					venue: {
						model: 'VENUE',
						uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
						name: 'Vivian Beaumont Theatre',
						surVenue: null
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
					}
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
				endDate: '2007-05-13',
				venue: {
					model: 'VENUE',
					uuid: VIVIAN_BEAUMONT_THEATRE_VENUE_UUID,
					name: 'Vivian Beaumont Theatre',
					surVenue: null
				}
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
					}
				}
			];

			const { productions } = olivierTheatreVenue.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Trevor Nunn (person)', () => {

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
						name: 'The Coast of Utopia'
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_PERSON_UUID,
									name: 'Trevor Nunn'
								},
								{
									model: 'COMPANY',
									uuid: NATIONAL_THEATRE_COMPANY_UUID,
									name: 'National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_PERSON_UUID,
											name: 'Nick Starr'
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
						name: 'The Coast of Utopia'
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_PERSON_UUID,
									name: 'Trevor Nunn'
								},
								{
									model: 'COMPANY',
									uuid: NATIONAL_THEATRE_COMPANY_UUID,
									name: 'National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_PERSON_UUID,
											name: 'Nick Starr'
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
						name: 'The Coast of Utopia'
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_PERSON_UUID,
									name: 'Trevor Nunn'
								},
								{
									model: 'COMPANY',
									uuid: NATIONAL_THEATRE_COMPANY_UUID,
									name: 'National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_PERSON_UUID,
											name: 'Nick Starr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = trevorNunnPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('National Theatre Company (company)', () => {

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
						name: 'The Coast of Utopia'
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_PERSON_UUID,
									name: 'Trevor Nunn'
								},
								{
									model: 'COMPANY',
									uuid: NATIONAL_THEATRE_COMPANY_UUID,
									name: 'National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_PERSON_UUID,
											name: 'Nick Starr'
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
						name: 'The Coast of Utopia'
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_PERSON_UUID,
									name: 'Trevor Nunn'
								},
								{
									model: 'COMPANY',
									uuid: NATIONAL_THEATRE_COMPANY_UUID,
									name: 'National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_PERSON_UUID,
											name: 'Nick Starr'
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
						name: 'The Coast of Utopia'
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_PERSON_UUID,
									name: 'Trevor Nunn'
								},
								{
									model: 'COMPANY',
									uuid: NATIONAL_THEATRE_COMPANY_UUID,
									name: 'National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_PERSON_UUID,
											name: 'Nick Starr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = nationalTheatreCompany.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Nick Starr (person)', () => {

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
						name: 'The Coast of Utopia'
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_PERSON_UUID,
									name: 'Trevor Nunn'
								},
								{
									model: 'COMPANY',
									uuid: NATIONAL_THEATRE_COMPANY_UUID,
									name: 'National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_PERSON_UUID,
											name: 'Nick Starr'
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
						name: 'The Coast of Utopia'
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_PERSON_UUID,
									name: 'Trevor Nunn'
								},
								{
									model: 'COMPANY',
									uuid: NATIONAL_THEATRE_COMPANY_UUID,
									name: 'National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_PERSON_UUID,
											name: 'Nick Starr'
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
						name: 'The Coast of Utopia'
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: TREVOR_NUNN_PERSON_UUID,
									name: 'Trevor Nunn'
								},
								{
									model: 'COMPANY',
									uuid: NATIONAL_THEATRE_COMPANY_UUID,
									name: 'National Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: NICK_STARR_PERSON_UUID,
											name: 'Nick Starr'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = nickStarrPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Stephen Dillane (person)', () => {

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
						name: 'The Coast of Utopia'
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: ALEXANDER_HERZEN_CHARACTER_UUID,
							name: 'Alexander Herzen',
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
						name: 'The Coast of Utopia'
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: ALEXANDER_HERZEN_CHARACTER_UUID,
							name: 'Alexander Herzen',
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
						name: 'The Coast of Utopia'
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: ALEXANDER_HERZEN_CHARACTER_UUID,
							name: 'Alexander Herzen',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = stephenDillanePerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Steven Edis (person)', () => {

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
						name: 'The Coast of Utopia'
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Musical Directors',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_PERSON_UUID,
											name: 'Mark Bousie'
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
						name: 'The Coast of Utopia'
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Musical Directors',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_PERSON_UUID,
											name: 'Mark Bousie'
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
						name: 'The Coast of Utopia'
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Musical Directors',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MUSICAL_DIRECTION_LTD_COMPANY_UUID,
									name: 'Musical Direction Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: MARK_BOUSIE_PERSON_UUID,
											name: 'Mark Bousie'
										}
									]
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = stevenEdisPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Musical Direction Ltd (company)', () => {

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
						name: 'The Coast of Utopia'
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Musical Directors',
							members: [
								{
									model: 'PERSON',
									uuid: MARK_BOUSIE_PERSON_UUID,
									name: 'Mark Bousie'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_PERSON_UUID,
									name: 'Steven Edis'
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
						name: 'The Coast of Utopia'
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Musical Directors',
							members: [
								{
									model: 'PERSON',
									uuid: MARK_BOUSIE_PERSON_UUID,
									name: 'Mark Bousie'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_PERSON_UUID,
									name: 'Steven Edis'
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
						name: 'The Coast of Utopia'
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Musical Directors',
							members: [
								{
									model: 'PERSON',
									uuid: MARK_BOUSIE_PERSON_UUID,
									name: 'Mark Bousie'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_PERSON_UUID,
									name: 'Steven Edis'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = musicalDirectionLtdCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Mark Bousie (person)', () => {

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
						name: 'The Coast of Utopia'
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Musical Directors',
							employerCompany: {
								model: 'COMPANY',
								uuid: MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Musical Direction Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_PERSON_UUID,
									name: 'Steven Edis'
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
						name: 'The Coast of Utopia'
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Musical Directors',
							employerCompany: {
								model: 'COMPANY',
								uuid: MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Musical Direction Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_PERSON_UUID,
									name: 'Steven Edis'
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
						name: 'The Coast of Utopia'
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Musical Directors',
							employerCompany: {
								model: 'COMPANY',
								uuid: MUSICAL_DIRECTION_LTD_COMPANY_UUID,
								name: 'Musical Direction Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: STEVEN_EDIS_PERSON_UUID,
									name: 'Steven Edis'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = markBousiePerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Fiona Bardsley (person)', () => {

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
						name: 'The Coast of Utopia'
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_PERSON_UUID,
											name: 'Sue Millin'
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
						name: 'The Coast of Utopia'
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_PERSON_UUID,
											name: 'Sue Millin'
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
						name: 'The Coast of Utopia'
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: SUE_MILLIN_PERSON_UUID,
											name: 'Sue Millin'
										}
									]
								}
							]
						}
					]
				}
			];

			const { crewProductions } = fionaBardsleyPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Stage Management Ltd (company)', () => {

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
						name: 'The Coast of Utopia'
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: SUE_MILLIN_PERSON_UUID,
									name: 'Sue Millin'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_PERSON_UUID,
									name: 'Fiona Bardsley'
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
						name: 'The Coast of Utopia'
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: SUE_MILLIN_PERSON_UUID,
									name: 'Sue Millin'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_PERSON_UUID,
									name: 'Fiona Bardsley'
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
						name: 'The Coast of Utopia'
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: SUE_MILLIN_PERSON_UUID,
									name: 'Sue Millin'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_PERSON_UUID,
									name: 'Fiona Bardsley'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = stageManagementLtdCompany.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Sue Millin (person)', () => {

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
						name: 'The Coast of Utopia'
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_PERSON_UUID,
									name: 'Fiona Bardsley'
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
						name: 'The Coast of Utopia'
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_PERSON_UUID,
									name: 'Fiona Bardsley'
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
						name: 'The Coast of Utopia'
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: FIONA_BARDSLEY_PERSON_UUID,
									name: 'Fiona Bardsley'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = sueMillinPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Alexander Herzen (character)', () => {

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
						name: 'The Coast of Utopia'
					},
					performers: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_PERSON_UUID,
							name: 'Stephen Dillane',
							roleName: 'Alexander Herzen',
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
						name: 'The Coast of Utopia'
					},
					performers: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_PERSON_UUID,
							name: 'Stephen Dillane',
							roleName: 'Alexander Herzen',
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
						name: 'The Coast of Utopia'
					},
					performers: [
						{
							model: 'PERSON',
							uuid: STEPHEN_DILLANE_PERSON_UUID,
							name: 'Stephen Dillane',
							roleName: 'Alexander Herzen',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = alexanderHerzenCharacter.body;

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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
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
						name: 'The Coast of Utopia'
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

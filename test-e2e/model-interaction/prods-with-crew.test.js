import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Productions with crew', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_VENUE_UUID = '4';
	const OLIVIER_THEATRE_VENUE_UUID = '5';
	const LYTTELTON_THEATRE_VENUE_UUID = '6';
	const COTTESLOE_THEATRE_VENUE_UUID = '7';
	const WASTE_ALMEIDA_PRODUCTION_UUID = '8';
	const ALMEIDA_THEATRE_VENUE_UUID = '10';
	const TARIQ_HUSSAIN_PERSON_UUID = '11';
	const STAGECRAFT_LTD_COMPANY_UUID = '12';
	const CREW_DEPUTIES_LTD_COMPANY_UUID = '13';
	const BENJAMIN_DONOGHUE_PERSON_UUID = '14';
	const NIK_HAFFENDEN_PERSON_UUID = '15';
	const EMMA_CAMERON_PERSON_UUID = '16';
	const PRAD_PANKHANI_PERSON_UUID = '17';
	const THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID = '18';
	const CREW_ASSISTANTS_LTD_COMPANY_UUID = '19';
	const SARA_GUNTER_PERSON_UUID = '20';
	const JULIA_WICKHAM_PERSON_UUID = '21';
	const CHERYL_FIRTH_PERSON_UUID = '22';
	const CASS_KIRCHNER_PERSON_UUID = '23';
	const MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID = '24';
	const TAMARA_ALBACHARI_PERSON_UUID = '33';
	const PETER_GREGORY_PERSON_UUID = '36';
	const PHÈDRE_LYTTELTON_PRODUCTION_UUID = '40';
	const KERRY_MCDEVITT_PERSON_UUID = '50';
	const TOM_LEGGAT_PERSON_UUID = '54';
	const PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID = '56';

	let wasteAlmeidaProduction;
	let muchAdoAboutNothingOlivierProduction;
	let phèdreLytteltonProduction;
	let painsOfYouthCottesloeProduction;
	let tariqHussainPerson;
	let cassKirchnerPerson;
	let saraGunterPerson;
	let peterGregoryPerson;
	let stagecraftLtdCompany;
	let crewDeputiesLtdCompany;
	let crewAssistantsLtdCompany;

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
					},
					{
						name: 'Lyttelton Theatre'
					},
					{
						name: 'Cottesloe Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Waste',
				startDate: '2008-09-25',
				pressDate: '2008-10-02',
				endDate: '2008-11-15',
				venue: {
					name: 'Almeida Theatre'
				},
				crewCredits: [
					// Contrivance for purposes of test.
					{
						name: 'Production Manager',
						entities: [
							{
								name: 'Tariq Hussain'
							}
						]
					},
					// Contrivance for purposes of testing company with multiple crew credits for same production.
					{
						name: 'Rigging Supervisor',
						entities: [
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Sound Operator',
						entities: [
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Stage Managers',
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								creditedMembers: [
									{
										name: 'Benjamin Donoghue'
									},
									{
										name: 'Nik Haffenden'
									},
									{
										name: 'Emma Cameron'
									}
								]
							},
							{
								name: 'Prad Pankhani'
							},
							{
								model: 'COMPANY',
								name: 'Theatrical Production Services Ltd'
							},
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								creditedMembers: [
									{
										name: 'Sara Gunter'
									},
									{
										name: 'Julia Wickham'
									},
									{
										name: 'Cheryl Firth'
									}
								]
							},
							{
								name: 'Cass Kirchner'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Much Ado About Nothing',
				startDate: '2007-12-10',
				pressDate: '2007-12-18',
				endDate: '2008-03-29',
				venue: {
					name: 'Olivier Theatre'
				},
				crewCredits: [
					// Contrivance for purposes of test.
					{
						name: 'Production Management by',
						entities: [
							{
								name: 'Tariq Hussain'
							}
						]
					},
					// Contrivance for purposes of testing company and credited member with multiple crew credits for same production.
					{
						name: 'Rigging Supervision by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								creditedMembers: [
									{
										name: 'Sara Gunter'
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Sound Operation by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Stage Management by',
						entities: [
							{
								name: 'Cass Kirchner'
							},
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								creditedMembers: [
									{
										name: 'Tamara Albachari'
									},
									{
										name: 'Benjamin Donoghue'
									},
									{
										name: 'Nik Haffenden'
									}
								]
							},
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								creditedMembers: [
									{
										name: 'Peter Gregory'
									},
									{
										name: 'Sara Gunter'
									},
									{
										name: 'Julia Wickham'
									}
								]
							},
							{
								model: 'COMPANY',
								name: 'Theatrical Production Services Ltd'
							},
							{
								name: 'Prad Pankhani'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Phèdre',
				startDate: '2009-06-04',
				pressDate: '2009-06-11',
				endDate: '2009-08-27',
				venue: {
					name: 'Lyttelton Theatre'
				},
				crewCredits: [
					// Contrivance for purposes of test.
					{
						name: 'Production Management',
						entities: [
							{
								name: 'Tariq Hussain'
							}
						]
					},
					// Contrivance for purposes of testing person with multiple crew credits for same production.
					{
						name: 'Rigging Supervision',
						entities: [
							{
								name: 'Cass Kirchner'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Sound Operation',
						entities: [
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Stage Management',
						entities: [
							{
								model: 'COMPANY',
								name: 'Theatrical Production Services Ltd'
							},
							{
								name: 'Prad Pankhani'
							},
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								creditedMembers: [
									{
										name: 'Benjamin Donoghue'
									},
									{
										name: 'Kerry McDevitt'
									},
									{
										name: 'Nik Haffenden'
									}
								]
							},
							{
								name: 'Cass Kirchner'
							},
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								creditedMembers: [
									{
										name: 'Sara Gunter'
									},
									{
										name: 'Tom Leggat'
									},
									{
										name: 'Julia Wickham'
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
				name: 'Pains of Youth',
				startDate: '2009-10-21',
				pressDate: '2009-10-28',
				endDate: '2010-01-21',
				venue: {
					name: 'Cottesloe Theatre'
				},
				crewCredits: [
					// Contrivance for purposes of test.
					{
						name: 'Stage Management by',
						entities: [
							{
								name: 'Cass Kirchner'
							},
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								creditedMembers: [
									{
										name: 'Tamara Albachari'
									},
									{
										name: 'Benjamin Donoghue'
									},
									{
										name: 'Nik Haffenden'
									}
								]
							},
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								creditedMembers: [
									{
										name: 'Cheryl Firth'
									},
									{
										name: 'Sara Gunter'
									},
									{
										name: 'Julia Wickham'
									}
								]
							},
							{
								model: 'COMPANY',
								name: 'Theatrical Production Services Ltd'
							},
							{
								name: 'Prad Pankhani'
							}
						]
					}
				]
			});

		wasteAlmeidaProduction = await chai.request(app)
			.get(`/productions/${WASTE_ALMEIDA_PRODUCTION_UUID}`);

		muchAdoAboutNothingOlivierProduction = await chai.request(app)
			.get(`/productions/${MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID}`);

		phèdreLytteltonProduction = await chai.request(app)
			.get(`/productions/${PHÈDRE_LYTTELTON_PRODUCTION_UUID}`);

		painsOfYouthCottesloeProduction = await chai.request(app)
			.get(`/productions/${PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID}`);

		tariqHussainPerson = await chai.request(app)
			.get(`/people/${TARIQ_HUSSAIN_PERSON_UUID}`);

		cassKirchnerPerson = await chai.request(app)
			.get(`/people/${CASS_KIRCHNER_PERSON_UUID}`);

		saraGunterPerson = await chai.request(app)
			.get(`/people/${SARA_GUNTER_PERSON_UUID}`);

		peterGregoryPerson = await chai.request(app)
			.get(`/people/${PETER_GREGORY_PERSON_UUID}`);

		stagecraftLtdCompany = await chai.request(app)
			.get(`/companies/${STAGECRAFT_LTD_COMPANY_UUID}`);

		crewDeputiesLtdCompany = await chai.request(app)
			.get(`/companies/${CREW_DEPUTIES_LTD_COMPANY_UUID}`);

		crewAssistantsLtdCompany = await chai.request(app)
			.get(`/companies/${CREW_ASSISTANTS_LTD_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Waste at Almeida Theatre (production)', () => {

		it('includes crew credits', () => {

			const expectedCrewCredits = [
				{
					model: 'CREW_CREDIT',
					name: 'Production Manager',
					entities: [
						{
							model: 'PERSON',
							uuid: TARIQ_HUSSAIN_PERSON_UUID,
							name: 'Tariq Hussain'
						}
					]
				},
				{
					model: 'CREW_CREDIT',
					name: 'Rigging Supervisor',
					entities: [
						{
							model: 'COMPANY',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd',
							creditedMembers: []
						}
					]
				},
				{
					model: 'CREW_CREDIT',
					name: 'Sound Operator',
					entities: [
						{
							model: 'COMPANY',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd',
							creditedMembers: []
						}
					]
				},
				{
					model: 'CREW_CREDIT',
					name: 'Stage Managers',
					entities: [
						{
							model: 'COMPANY',
							uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
							name: 'Crew Deputies Ltd',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'PERSON',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								},
								{
									model: 'PERSON',
									uuid: EMMA_CAMERON_PERSON_UUID,
									name: 'Emma Cameron'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: PRAD_PANKHANI_PERSON_UUID,
							name: 'Prad Pankhani'
						},
						{
							model: 'COMPANY',
							uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
							name: 'Theatrical Production Services Ltd',
							creditedMembers: []
						},
						{
							model: 'COMPANY',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'PERSON',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								},
								{
									model: 'PERSON',
									uuid: CHERYL_FIRTH_PERSON_UUID,
									name: 'Cheryl Firth'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: CASS_KIRCHNER_PERSON_UUID,
							name: 'Cass Kirchner'
						}
					]
				}
			];

			const { crewCredits } = wasteAlmeidaProduction.body;

			expect(crewCredits).to.deep.equal(expectedCrewCredits);

		});

	});

	describe('Phèdre at Lyttelton Theatre (production)', () => {

		it('includes crew credits', () => {

			const expectedCrewCredits = [
				{
					model: 'CREW_CREDIT',
					name: 'Production Management',
					entities: [
						{
							model: 'PERSON',
							uuid: TARIQ_HUSSAIN_PERSON_UUID,
							name: 'Tariq Hussain'
						}
					]
				},
				{
					model: 'CREW_CREDIT',
					name: 'Rigging Supervision',
					entities: [
						{
							model: 'PERSON',
							uuid: CASS_KIRCHNER_PERSON_UUID,
							name: 'Cass Kirchner'
						}
					]
				},
				{
					model: 'CREW_CREDIT',
					name: 'Sound Operation',
					entities: [
						{
							model: 'COMPANY',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd',
							creditedMembers: []
						}
					]
				},
				{
					model: 'CREW_CREDIT',
					name: 'Stage Management',
					entities: [
						{
							model: 'COMPANY',
							uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
							name: 'Theatrical Production Services Ltd',
							creditedMembers: []
						},
						{
							model: 'PERSON',
							uuid: PRAD_PANKHANI_PERSON_UUID,
							name: 'Prad Pankhani'
						},
						{
							model: 'COMPANY',
							uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
							name: 'Crew Deputies Ltd',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'PERSON',
									uuid: KERRY_MCDEVITT_PERSON_UUID,
									name: 'Kerry McDevitt'
								},
								{
									model: 'PERSON',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: CASS_KIRCHNER_PERSON_UUID,
							name: 'Cass Kirchner'
						},
						{
							model: 'COMPANY',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'PERSON',
									uuid: TOM_LEGGAT_PERSON_UUID,
									name: 'Tom Leggat'
								},
								{
									model: 'PERSON',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							]
						}
					]
				}
			];

			const { crewCredits } = phèdreLytteltonProduction.body;

			expect(crewCredits).to.deep.equal(expectedCrewCredits);

		});

	});

	describe('Much Ado About Nothing at Olivier Theatre (production)', () => {

		it('includes crew credits', () => {

			const expectedCrewCredits = [
				{
					model: 'CREW_CREDIT',
					name: 'Production Management by',
					entities: [
						{
							model: 'PERSON',
							uuid: TARIQ_HUSSAIN_PERSON_UUID,
							name: 'Tariq Hussain'
						}
					]
				},
				{
					model: 'CREW_CREDIT',
					name: 'Rigging Supervision by',
					entities: [
						{
							model: 'COMPANY',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								}
							]
						}
					]
				},
				{
					model: 'CREW_CREDIT',
					name: 'Sound Operation by',
					entities: [
						{
							model: 'COMPANY',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd',
							creditedMembers: []
						}
					]
				},
				{
					model: 'CREW_CREDIT',
					name: 'Stage Management by',
					entities: [
						{
							model: 'PERSON',
							uuid: CASS_KIRCHNER_PERSON_UUID,
							name: 'Cass Kirchner'
						},
						{
							model: 'COMPANY',
							uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
							name: 'Crew Deputies Ltd',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: TAMARA_ALBACHARI_PERSON_UUID,
									name: 'Tamara Albachari'
								},
								{
									model: 'PERSON',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'PERSON',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: PETER_GREGORY_PERSON_UUID,
									name: 'Peter Gregory'
								},
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'PERSON',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
							name: 'Theatrical Production Services Ltd',
							creditedMembers: []
						},
						{
							model: 'PERSON',
							uuid: PRAD_PANKHANI_PERSON_UUID,
							name: 'Prad Pankhani'
						}
					]
				}
			];

			const { crewCredits } = muchAdoAboutNothingOlivierProduction.body;

			expect(crewCredits).to.deep.equal(expectedCrewCredits);

		});

	});

	describe('Pains of Youth at Cottesloe Theatre (production)', () => {

		it('includes crew credits', () => {

			const expectedCrewCredits = [
				{
					model: 'CREW_CREDIT',
					name: 'Stage Management by',
					entities: [
						{
							model: 'PERSON',
							uuid: CASS_KIRCHNER_PERSON_UUID,
							name: 'Cass Kirchner'
						},
						{
							model: 'COMPANY',
							uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
							name: 'Crew Deputies Ltd',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: TAMARA_ALBACHARI_PERSON_UUID,
									name: 'Tamara Albachari'
								},
								{
									model: 'PERSON',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'PERSON',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: CHERYL_FIRTH_PERSON_UUID,
									name: 'Cheryl Firth'
								},
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'PERSON',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
							name: 'Theatrical Production Services Ltd',
							creditedMembers: []
						},
						{
							model: 'PERSON',
							uuid: PRAD_PANKHANI_PERSON_UUID,
							name: 'Prad Pankhani'
						}
					]
				}
			];

			const { crewCredits } = painsOfYouthCottesloeProduction.body;

			expect(crewCredits).to.deep.equal(expectedCrewCredits);

		});

	});

	describe('Tariq Hussain (person)', () => {

		it('includes productions for which they have a crew credit', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					startDate: '2009-06-04',
					endDate: '2009-08-27',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Production Management',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					startDate: '2008-09-25',
					endDate: '2008-11-15',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Production Manager',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					startDate: '2007-12-10',
					endDate: '2008-03-29',
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
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Production Management by',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						}
					]
				}
			];

			const { crewProductions } = tariqHussainPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Cass Kirchner (person)', () => {

		it('includes productions for which they have a crew credit, included co-credited entities', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID,
					name: 'Pains of Youth',
					startDate: '2009-10-21',
					endDate: '2010-01-21',
					venue: {
						model: 'VENUE',
						uuid: COTTESLOE_THEATRE_VENUE_UUID,
						name: 'Cottesloe Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: CHERYL_FIRTH_PERSON_UUID,
											name: 'Cheryl Firth'
										},
										{
											model: 'PERSON',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'PERSON',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					startDate: '2009-06-04',
					endDate: '2009-08-27',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Rigging Supervision',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						},
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: KERRY_MCDEVITT_PERSON_UUID,
											name: 'Kerry McDevitt'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'PERSON',
											uuid: TOM_LEGGAT_PERSON_UUID,
											name: 'Tom Leggat'
										},
										{
											model: 'PERSON',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					startDate: '2008-09-25',
					endDate: '2008-11-15',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										},
										{
											model: 'PERSON',
											uuid: EMMA_CAMERON_PERSON_UUID,
											name: 'Emma Cameron'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'PERSON',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										},
										{
											model: 'PERSON',
											uuid: CHERYL_FIRTH_PERSON_UUID,
											name: 'Cheryl Firth'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					startDate: '2007-12-10',
					endDate: '2008-03-29',
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
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: PETER_GREGORY_PERSON_UUID,
											name: 'Peter Gregory'
										},
										{
											model: 'PERSON',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'PERSON',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = cassKirchnerPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Sara Gunter (person)', () => {

		it('includes productions for which they have a crew credit, included co-credited entities', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID,
					name: 'Pains of Youth',
					startDate: '2009-10-21',
					endDate: '2010-01-21',
					venue: {
						model: 'VENUE',
						uuid: COTTESLOE_THEATRE_VENUE_UUID,
						name: 'Cottesloe Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							creditedEmployerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: [
									{
										model: 'PERSON',
										uuid: CHERYL_FIRTH_PERSON_UUID,
										name: 'Cheryl Firth'
									},
									{
										model: 'PERSON',
										uuid: JULIA_WICKHAM_PERSON_UUID,
										name: 'Julia Wickham'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					startDate: '2009-06-04',
					endDate: '2009-08-27',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management',
							creditedEmployerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: [
									{
										model: 'PERSON',
										uuid: TOM_LEGGAT_PERSON_UUID,
										name: 'Tom Leggat'
									},
									{
										model: 'PERSON',
										uuid: JULIA_WICKHAM_PERSON_UUID,
										name: 'Julia Wickham'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: KERRY_MCDEVITT_PERSON_UUID,
											name: 'Kerry McDevitt'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					startDate: '2008-09-25',
					endDate: '2008-11-15',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							creditedEmployerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: [
									{
										model: 'PERSON',
										uuid: JULIA_WICKHAM_PERSON_UUID,
										name: 'Julia Wickham'
									},
									{
										model: 'PERSON',
										uuid: CHERYL_FIRTH_PERSON_UUID,
										name: 'Cheryl Firth'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										},
										{
											model: 'PERSON',
											uuid: EMMA_CAMERON_PERSON_UUID,
											name: 'Emma Cameron'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					startDate: '2007-12-10',
					endDate: '2008-03-29',
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
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Rigging Supervision by',
							creditedEmployerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: []
							},
							coCreditedEntities: []
						},
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							creditedEmployerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: [
									{
										model: 'PERSON',
										uuid: PETER_GREGORY_PERSON_UUID,
										name: 'Peter Gregory'
									},
									{
										model: 'PERSON',
										uuid: JULIA_WICKHAM_PERSON_UUID,
										name: 'Julia Wickham'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = saraGunterPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Peter Gregory (person)', () => {

		it('includes productions for which they have a crew credit, included co-credited entities', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					startDate: '2007-12-10',
					endDate: '2008-03-29',
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
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							creditedEmployerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: [
									{
										model: 'PERSON',
										uuid: SARA_GUNTER_PERSON_UUID,
										name: 'Sara Gunter'
									},
									{
										model: 'PERSON',
										uuid: JULIA_WICKHAM_PERSON_UUID,
										name: 'Julia Wickham'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = peterGregoryPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Stagecraft Ltd (company)', () => {

		it('includes productions for which they have a crew credit', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					startDate: '2009-06-04',
					endDate: '2009-08-27',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Sound Operation',
							creditedMembers: [],
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					startDate: '2008-09-25',
					endDate: '2008-11-15',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Rigging Supervisor',
							creditedMembers: [],
							coCreditedEntities: []
						},
						{
							model: 'CREW_CREDIT',
							name: 'Sound Operator',
							creditedMembers: [],
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					startDate: '2007-12-10',
					endDate: '2008-03-29',
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
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Sound Operation by',
							creditedMembers: [],
							coCreditedEntities: []
						}
					]
				}
			];

			const { crewProductions } = stagecraftLtdCompany.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Crew Deputies Ltd (company)', () => {

		it('includes productions for which they have a crew credit', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID,
					name: 'Pains of Youth',
					startDate: '2009-10-21',
					endDate: '2010-01-21',
					venue: {
						model: 'VENUE',
						uuid: COTTESLOE_THEATRE_VENUE_UUID,
						name: 'Cottesloe Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: TAMARA_ALBACHARI_PERSON_UUID,
									name: 'Tamara Albachari'
								},
								{
									model: 'PERSON',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'PERSON',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							],
							coCreditedEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: CHERYL_FIRTH_PERSON_UUID,
											name: 'Cheryl Firth'
										},
										{
											model: 'PERSON',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'PERSON',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					startDate: '2009-06-04',
					endDate: '2009-08-27',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'PERSON',
									uuid: KERRY_MCDEVITT_PERSON_UUID,
									name: 'Kerry McDevitt'
								},
								{
									model: 'PERSON',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							],
							coCreditedEntities: [
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'PERSON',
											uuid: TOM_LEGGAT_PERSON_UUID,
											name: 'Tom Leggat'
										},
										{
											model: 'PERSON',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					startDate: '2008-09-25',
					endDate: '2008-11-15',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'PERSON',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								},
								{
									model: 'PERSON',
									uuid: EMMA_CAMERON_PERSON_UUID,
									name: 'Emma Cameron'
								}
							],
							coCreditedEntities: [
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'PERSON',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										},
										{
											model: 'PERSON',
											uuid: CHERYL_FIRTH_PERSON_UUID,
											name: 'Cheryl Firth'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					startDate: '2007-12-10',
					endDate: '2008-03-29',
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
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: TAMARA_ALBACHARI_PERSON_UUID,
									name: 'Tamara Albachari'
								},
								{
									model: 'PERSON',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'PERSON',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							],
							coCreditedEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: PETER_GREGORY_PERSON_UUID,
											name: 'Peter Gregory'
										},
										{
											model: 'PERSON',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'PERSON',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = crewDeputiesLtdCompany.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Crew Assistants Ltd (company)', () => {

		it('includes productions for which they have a crew credit, included co-credited entities', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID,
					name: 'Pains of Youth',
					startDate: '2009-10-21',
					endDate: '2010-01-21',
					venue: {
						model: 'VENUE',
						uuid: COTTESLOE_THEATRE_VENUE_UUID,
						name: 'Cottesloe Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: CHERYL_FIRTH_PERSON_UUID,
									name: 'Cheryl Firth'
								},
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'PERSON',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							],
							coCreditedEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					startDate: '2009-06-04',
					endDate: '2009-08-27',
					venue: {
						model: 'VENUE',
						uuid: LYTTELTON_THEATRE_VENUE_UUID,
						name: 'Lyttelton Theatre',
						surVenue: {
							model: 'VENUE',
							uuid: NATIONAL_THEATRE_VENUE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'PERSON',
									uuid: TOM_LEGGAT_PERSON_UUID,
									name: 'Tom Leggat'
								},
								{
									model: 'PERSON',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							],
							coCreditedEntities: [
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: KERRY_MCDEVITT_PERSON_UUID,
											name: 'Kerry McDevitt'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					startDate: '2008-09-25',
					endDate: '2008-11-15',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'PERSON',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								},
								{
									model: 'PERSON',
									uuid: CHERYL_FIRTH_PERSON_UUID,
									name: 'Cheryl Firth'
								}
							],
							coCreditedEntities: [
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										},
										{
											model: 'PERSON',
											uuid: EMMA_CAMERON_PERSON_UUID,
											name: 'Emma Cameron'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					startDate: '2007-12-10',
					endDate: '2008-03-29',
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
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Rigging Supervision by',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								}
							],
							coCreditedEntities: []
						},
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							creditedMembers: [
								{
									model: 'PERSON',
									uuid: PETER_GREGORY_PERSON_UUID,
									name: 'Peter Gregory'
								},
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'PERSON',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							],
							coCreditedEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'PERSON',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'PERSON',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'PERSON',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = crewAssistantsLtdCompany.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

});

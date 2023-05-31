import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Productions with crew', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_VENUE_UUID = '7';
	const OLIVIER_THEATRE_VENUE_UUID = '8';
	const LYTTELTON_THEATRE_VENUE_UUID = '9';
	const COTTESLOE_THEATRE_VENUE_UUID = '10';
	const WASTE_ALMEIDA_PRODUCTION_UUID = '11';
	const ALMEIDA_THEATRE_VENUE_UUID = '13';
	const TARIQ_HUSSAIN_PERSON_UUID = '14';
	const STAGECRAFT_LTD_COMPANY_UUID = '15';
	const CREW_DEPUTIES_LTD_COMPANY_UUID = '16';
	const BENJAMIN_DONOGHUE_PERSON_UUID = '17';
	const NIK_HAFFENDEN_PERSON_UUID = '18';
	const EMMA_CAMERON_PERSON_UUID = '19';
	const PRAD_PANKHANI_PERSON_UUID = '20';
	const THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID = '21';
	const CREW_ASSISTANTS_LTD_COMPANY_UUID = '22';
	const SARA_GUNTER_PERSON_UUID = '23';
	const JULIA_WICKHAM_PERSON_UUID = '24';
	const CHERYL_FIRTH_PERSON_UUID = '25';
	const CASS_KIRCHNER_PERSON_UUID = '26';
	const MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID = '27';
	const TAMARA_ALBACHARI_PERSON_UUID = '36';
	const PETER_GREGORY_PERSON_UUID = '39';
	const PHÈDRE_LYTTELTON_PRODUCTION_UUID = '43';
	const KERRY_MCDEVITT_PERSON_UUID = '53';
	const TOM_LEGGAT_PERSON_UUID = '57';
	const PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID = '59';

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
					{
						name: 'Production Manager',
						entities: [
							{
								name: 'Tariq Hussain'
							}
						]
					},
					{
						name: 'Rigging Supervisor',
						entities: [
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					},
					{
						name: 'Sound Operator',
						entities: [
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					},
					{
						name: 'Stage Managers',
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								members: [
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
								members: [
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
					{
						name: 'Production Management by',
						entities: [
							{
								name: 'Tariq Hussain'
							}
						]
					},
					{
						name: 'Rigging Supervision by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								members: [
									{
										name: 'Sara Gunter'
									}
								]
							}
						]
					},
					{
						name: 'Sound Operation by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					},
					{
						name: 'Stage Management by',
						entities: [
							{
								name: 'Cass Kirchner'
							},
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								members: [
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
								members: [
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
					{
						name: 'Production Management',
						entities: [
							{
								name: 'Tariq Hussain'
							}
						]
					},
					{
						name: 'Rigging Supervision',
						entities: [
							{
								name: 'Cass Kirchner'
							}
						]
					},
					{
						name: 'Sound Operation',
						entities: [
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					},
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
								members: [
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
								members: [
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
					{
						name: 'Stage Management by',
						entities: [
							{
								name: 'Cass Kirchner'
							},
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								members: [
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
								members: [
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
							members: []
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
							members: []
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
							members: [
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
							members: []
						},
						{
							model: 'COMPANY',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							members: [
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
							members: []
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
							members: []
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
							members: [
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
							members: [
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
							members: [
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
							members: []
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
							members: [
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
							members: [
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
							members: []
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
							members: [
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
							members: [
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
							members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Production Management',
							employerCompany: null,
							coEntities: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Production Manager',
							employerCompany: null,
							coEntities: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Production Management by',
							employerCompany: null,
							coEntities: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									members: [
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
									members: [
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
									members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Rigging Supervision',
							employerCompany: null,
							coEntities: []
						},
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									members: []
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
									members: [
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
									members: [
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									members: [
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
									members: []
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									members: [
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									members: [
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
									members: [
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
									members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							employerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coMembers: [
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
							coEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									members: [
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
									members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management',
							employerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coMembers: [
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
							coEntities: [
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									members: []
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
									members: [
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coMembers: [
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
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									members: [
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
									members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Rigging Supervision by',
							employerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coMembers: []
							},
							coEntities: []
						},
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							employerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coMembers: [
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
							coEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									members: [
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
									members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							employerCompany: {
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coMembers: [
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
							coEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									members: [
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
									members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Sound Operation',
							members: [],
							coEntities: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Rigging Supervisor',
							members: [],
							coEntities: []
						},
						{
							model: 'CREW_CREDIT',
							name: 'Sound Operator',
							members: [],
							coEntities: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Sound Operation by',
							members: [],
							coEntities: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							members: [
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
							coEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									members: [
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
									members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management',
							members: [
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
							coEntities: [
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									members: []
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
									members: [
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
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
							coEntities: [
								{
									model: 'PERSON',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									members: []
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									members: [
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							members: [
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
							coEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									members: [
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
									members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							members: [
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
							coEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									members: [
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
									members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management',
							members: [
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
							coEntities: [
								{
									model: 'COMPANY',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									members: []
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
									members: [
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
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
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									members: [
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
									members: []
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
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Rigging Supervision by',
							members: [
								{
									model: 'PERSON',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								}
							],
							coEntities: []
						},
						{
							model: 'CREW_CREDIT',
							name: 'Stage Management by',
							members: [
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
							coEntities: [
								{
									model: 'PERSON',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'COMPANY',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									members: [
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
									members: []
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

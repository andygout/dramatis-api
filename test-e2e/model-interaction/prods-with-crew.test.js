import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Productions with crew', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_UUID = '4';
	const OLIVIER_THEATRE_UUID = '5';
	const LYTTELTON_THEATRE_UUID = '6';
	const COTTESLOE_THEATRE_UUID = '7';
	const WASTE_ALMEIDA_PRODUCTION_UUID = '8';
	const ALMEIDA_THEATRE_UUID = '10';
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

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/theatres')
			.send({
				name: 'National Theatre',
				subTheatres: [
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
				theatre: {
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
								model: 'company',
								name: 'Stagecraft Ltd'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Sound Operator',
						entities: [
							{
								model: 'company',
								name: 'Stagecraft Ltd'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Stage Managers',
						entities: [
							{
								model: 'company',
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
								model: 'company',
								name: 'Theatrical Production Services Ltd'
							},
							{
								model: 'company',
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
				theatre: {
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
								model: 'company',
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
								model: 'company',
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
								model: 'company',
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
								model: 'company',
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
								model: 'company',
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
				theatre: {
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
								model: 'company',
								name: 'Stagecraft Ltd'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Stage Management',
						entities: [
							{
								model: 'company',
								name: 'Theatrical Production Services Ltd'
							},
							{
								name: 'Prad Pankhani'
							},
							{
								model: 'company',
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
								model: 'company',
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
				theatre: {
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
								model: 'company',
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
								model: 'company',
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
								model: 'company',
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
					model: 'crewCredit',
					name: 'Production Manager',
					entities: [
						{
							model: 'person',
							uuid: TARIQ_HUSSAIN_PERSON_UUID,
							name: 'Tariq Hussain'
						}
					]
				},
				{
					model: 'crewCredit',
					name: 'Rigging Supervisor',
					entities: [
						{
							model: 'company',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd',
							creditedMembers: []
						}
					]
				},
				{
					model: 'crewCredit',
					name: 'Sound Operator',
					entities: [
						{
							model: 'company',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd',
							creditedMembers: []
						}
					]
				},
				{
					model: 'crewCredit',
					name: 'Stage Managers',
					entities: [
						{
							model: 'company',
							uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
							name: 'Crew Deputies Ltd',
							creditedMembers: [
								{
									model: 'person',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'person',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								},
								{
									model: 'person',
									uuid: EMMA_CAMERON_PERSON_UUID,
									name: 'Emma Cameron'
								}
							]
						},
						{
							model: 'person',
							uuid: PRAD_PANKHANI_PERSON_UUID,
							name: 'Prad Pankhani'
						},
						{
							model: 'company',
							uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
							name: 'Theatrical Production Services Ltd',
							creditedMembers: []
						},
						{
							model: 'company',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							creditedMembers: [
								{
									model: 'person',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'person',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								},
								{
									model: 'person',
									uuid: CHERYL_FIRTH_PERSON_UUID,
									name: 'Cheryl Firth'
								}
							]
						},
						{
							model: 'person',
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
					model: 'crewCredit',
					name: 'Production Management',
					entities: [
						{
							model: 'person',
							uuid: TARIQ_HUSSAIN_PERSON_UUID,
							name: 'Tariq Hussain'
						}
					]
				},
				{
					model: 'crewCredit',
					name: 'Rigging Supervision',
					entities: [
						{
							model: 'person',
							uuid: CASS_KIRCHNER_PERSON_UUID,
							name: 'Cass Kirchner'
						}
					]
				},
				{
					model: 'crewCredit',
					name: 'Sound Operation',
					entities: [
						{
							model: 'company',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd',
							creditedMembers: []
						}
					]
				},
				{
					model: 'crewCredit',
					name: 'Stage Management',
					entities: [
						{
							model: 'company',
							uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
							name: 'Theatrical Production Services Ltd',
							creditedMembers: []
						},
						{
							model: 'person',
							uuid: PRAD_PANKHANI_PERSON_UUID,
							name: 'Prad Pankhani'
						},
						{
							model: 'company',
							uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
							name: 'Crew Deputies Ltd',
							creditedMembers: [
								{
									model: 'person',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'person',
									uuid: KERRY_MCDEVITT_PERSON_UUID,
									name: 'Kerry McDevitt'
								},
								{
									model: 'person',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							]
						},
						{
							model: 'person',
							uuid: CASS_KIRCHNER_PERSON_UUID,
							name: 'Cass Kirchner'
						},
						{
							model: 'company',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							creditedMembers: [
								{
									model: 'person',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'person',
									uuid: TOM_LEGGAT_PERSON_UUID,
									name: 'Tom Leggat'
								},
								{
									model: 'person',
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
					model: 'crewCredit',
					name: 'Production Management by',
					entities: [
						{
							model: 'person',
							uuid: TARIQ_HUSSAIN_PERSON_UUID,
							name: 'Tariq Hussain'
						}
					]
				},
				{
					model: 'crewCredit',
					name: 'Rigging Supervision by',
					entities: [
						{
							model: 'company',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							creditedMembers: [
								{
									model: 'person',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								}
							]
						}
					]
				},
				{
					model: 'crewCredit',
					name: 'Sound Operation by',
					entities: [
						{
							model: 'company',
							uuid: STAGECRAFT_LTD_COMPANY_UUID,
							name: 'Stagecraft Ltd',
							creditedMembers: []
						}
					]
				},
				{
					model: 'crewCredit',
					name: 'Stage Management by',
					entities: [
						{
							model: 'person',
							uuid: CASS_KIRCHNER_PERSON_UUID,
							name: 'Cass Kirchner'
						},
						{
							model: 'company',
							uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
							name: 'Crew Deputies Ltd',
							creditedMembers: [
								{
									model: 'person',
									uuid: TAMARA_ALBACHARI_PERSON_UUID,
									name: 'Tamara Albachari'
								},
								{
									model: 'person',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'person',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							]
						},
						{
							model: 'company',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							creditedMembers: [
								{
									model: 'person',
									uuid: PETER_GREGORY_PERSON_UUID,
									name: 'Peter Gregory'
								},
								{
									model: 'person',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'person',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							]
						},
						{
							model: 'company',
							uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
							name: 'Theatrical Production Services Ltd',
							creditedMembers: []
						},
						{
							model: 'person',
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
					model: 'crewCredit',
					name: 'Stage Management by',
					entities: [
						{
							model: 'person',
							uuid: CASS_KIRCHNER_PERSON_UUID,
							name: 'Cass Kirchner'
						},
						{
							model: 'company',
							uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
							name: 'Crew Deputies Ltd',
							creditedMembers: [
								{
									model: 'person',
									uuid: TAMARA_ALBACHARI_PERSON_UUID,
									name: 'Tamara Albachari'
								},
								{
									model: 'person',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'person',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							]
						},
						{
							model: 'company',
							uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
							name: 'Crew Assistants Ltd',
							creditedMembers: [
								{
									model: 'person',
									uuid: CHERYL_FIRTH_PERSON_UUID,
									name: 'Cheryl Firth'
								},
								{
									model: 'person',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'person',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							]
						},
						{
							model: 'company',
							uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
							name: 'Theatrical Production Services Ltd',
							creditedMembers: []
						},
						{
							model: 'person',
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
					model: 'production',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					theatre: {
						model: 'theatre',
						uuid: OLIVIER_THEATRE_UUID,
						name: 'Olivier Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Production Management by',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'production',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					theatre: {
						model: 'theatre',
						uuid: LYTTELTON_THEATRE_UUID,
						name: 'Lyttelton Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Production Management',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'production',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Production Manager',
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
					model: 'production',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					theatre: {
						model: 'theatre',
						uuid: OLIVIER_THEATRE_UUID,
						name: 'Olivier Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Management by',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'company',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: PETER_GREGORY_PERSON_UUID,
											name: 'Peter Gregory'
										},
										{
											model: 'person',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'person',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										}
									]
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID,
					name: 'Pains of Youth',
					theatre: {
						model: 'theatre',
						uuid: COTTESLOE_THEATRE_UUID,
						name: 'Cottesloe Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Management by',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'company',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: CHERYL_FIRTH_PERSON_UUID,
											name: 'Cheryl Firth'
										},
										{
											model: 'person',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'person',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										}
									]
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					theatre: {
						model: 'theatre',
						uuid: LYTTELTON_THEATRE_UUID,
						name: 'Lyttelton Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Rigging Supervision',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						},
						{
							model: 'crewCredit',
							name: 'Stage Management',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: KERRY_MCDEVITT_PERSON_UUID,
											name: 'Kerry McDevitt'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'company',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'person',
											uuid: TOM_LEGGAT_PERSON_UUID,
											name: 'Tom Leggat'
										},
										{
											model: 'person',
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
					model: 'production',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Managers',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										},
										{
											model: 'person',
											uuid: EMMA_CAMERON_PERSON_UUID,
											name: 'Emma Cameron'
										}
									]
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'company',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'person',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										},
										{
											model: 'person',
											uuid: CHERYL_FIRTH_PERSON_UUID,
											name: 'Cheryl Firth'
										}
									]
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
					model: 'production',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					theatre: {
						model: 'theatre',
						uuid: OLIVIER_THEATRE_UUID,
						name: 'Olivier Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Rigging Supervision by',
							creditedEmployerCompany: {
								model: 'company',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: []
							},
							coCreditedEntities: []
						},
						{
							model: 'crewCredit',
							name: 'Stage Management by',
							creditedEmployerCompany: {
								model: 'company',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: [
									{
										model: 'person',
										uuid: PETER_GREGORY_PERSON_UUID,
										name: 'Peter Gregory'
									},
									{
										model: 'person',
										uuid: JULIA_WICKHAM_PERSON_UUID,
										name: 'Julia Wickham'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID,
					name: 'Pains of Youth',
					theatre: {
						model: 'theatre',
						uuid: COTTESLOE_THEATRE_UUID,
						name: 'Cottesloe Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Management by',
							creditedEmployerCompany: {
								model: 'company',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: [
									{
										model: 'person',
										uuid: CHERYL_FIRTH_PERSON_UUID,
										name: 'Cheryl Firth'
									},
									{
										model: 'person',
										uuid: JULIA_WICKHAM_PERSON_UUID,
										name: 'Julia Wickham'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					theatre: {
						model: 'theatre',
						uuid: LYTTELTON_THEATRE_UUID,
						name: 'Lyttelton Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Management',
							creditedEmployerCompany: {
								model: 'company',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: [
									{
										model: 'person',
										uuid: TOM_LEGGAT_PERSON_UUID,
										name: 'Tom Leggat'
									},
									{
										model: 'person',
										uuid: JULIA_WICKHAM_PERSON_UUID,
										name: 'Julia Wickham'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: KERRY_MCDEVITT_PERSON_UUID,
											name: 'Kerry McDevitt'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Managers',
							creditedEmployerCompany: {
								model: 'company',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: [
									{
										model: 'person',
										uuid: JULIA_WICKHAM_PERSON_UUID,
										name: 'Julia Wickham'
									},
									{
										model: 'person',
										uuid: CHERYL_FIRTH_PERSON_UUID,
										name: 'Cheryl Firth'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										},
										{
											model: 'person',
											uuid: EMMA_CAMERON_PERSON_UUID,
											name: 'Emma Cameron'
										}
									]
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
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
					model: 'production',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					theatre: {
						model: 'theatre',
						uuid: OLIVIER_THEATRE_UUID,
						name: 'Olivier Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Management by',
							creditedEmployerCompany: {
								model: 'company',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								coCreditedMembers: [
									{
										model: 'person',
										uuid: SARA_GUNTER_PERSON_UUID,
										name: 'Sara Gunter'
									},
									{
										model: 'person',
										uuid: JULIA_WICKHAM_PERSON_UUID,
										name: 'Julia Wickham'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
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
					model: 'production',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					theatre: {
						model: 'theatre',
						uuid: OLIVIER_THEATRE_UUID,
						name: 'Olivier Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Sound Operation by',
							creditedMembers: [],
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'production',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					theatre: {
						model: 'theatre',
						uuid: LYTTELTON_THEATRE_UUID,
						name: 'Lyttelton Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Sound Operation',
							creditedMembers: [],
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'production',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Rigging Supervisor',
							creditedMembers: [],
							coCreditedEntities: []
						},
						{
							model: 'crewCredit',
							name: 'Sound Operator',
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
					model: 'production',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					theatre: {
						model: 'theatre',
						uuid: OLIVIER_THEATRE_UUID,
						name: 'Olivier Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Management by',
							creditedMembers: [
								{
									model: 'person',
									uuid: TAMARA_ALBACHARI_PERSON_UUID,
									name: 'Tamara Albachari'
								},
								{
									model: 'person',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'person',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							],
							coCreditedEntities: [
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'company',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: PETER_GREGORY_PERSON_UUID,
											name: 'Peter Gregory'
										},
										{
											model: 'person',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'person',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										}
									]
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID,
					name: 'Pains of Youth',
					theatre: {
						model: 'theatre',
						uuid: COTTESLOE_THEATRE_UUID,
						name: 'Cottesloe Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Management by',
							creditedMembers: [
								{
									model: 'person',
									uuid: TAMARA_ALBACHARI_PERSON_UUID,
									name: 'Tamara Albachari'
								},
								{
									model: 'person',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'person',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							],
							coCreditedEntities: [
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'company',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: CHERYL_FIRTH_PERSON_UUID,
											name: 'Cheryl Firth'
										},
										{
											model: 'person',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'person',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										}
									]
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					theatre: {
						model: 'theatre',
						uuid: LYTTELTON_THEATRE_UUID,
						name: 'Lyttelton Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Management',
							creditedMembers: [
								{
									model: 'person',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'person',
									uuid: KERRY_MCDEVITT_PERSON_UUID,
									name: 'Kerry McDevitt'
								},
								{
									model: 'person',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								}
							],
							coCreditedEntities: [
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'company',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'person',
											uuid: TOM_LEGGAT_PERSON_UUID,
											name: 'Tom Leggat'
										},
										{
											model: 'person',
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
					model: 'production',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Managers',
							creditedMembers: [
								{
									model: 'person',
									uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
									name: 'Benjamin Donoghue'
								},
								{
									model: 'person',
									uuid: NIK_HAFFENDEN_PERSON_UUID,
									name: 'Nik Haffenden'
								},
								{
									model: 'person',
									uuid: EMMA_CAMERON_PERSON_UUID,
									name: 'Emma Cameron'
								}
							],
							coCreditedEntities: [
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'company',
									uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
									name: 'Crew Assistants Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: SARA_GUNTER_PERSON_UUID,
											name: 'Sara Gunter'
										},
										{
											model: 'person',
											uuid: JULIA_WICKHAM_PERSON_UUID,
											name: 'Julia Wickham'
										},
										{
											model: 'person',
											uuid: CHERYL_FIRTH_PERSON_UUID,
											name: 'Cheryl Firth'
										}
									]
								},
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
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
					model: 'production',
					uuid: MUCH_ADO_ABOUT_NOTHING_OLIVIER_PRODUCTION_UUID,
					name: 'Much Ado About Nothing',
					theatre: {
						model: 'theatre',
						uuid: OLIVIER_THEATRE_UUID,
						name: 'Olivier Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Rigging Supervision by',
							creditedMembers: [
								{
									model: 'person',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								}
							],
							coCreditedEntities: []
						},
						{
							model: 'crewCredit',
							name: 'Stage Management by',
							creditedMembers: [
								{
									model: 'person',
									uuid: PETER_GREGORY_PERSON_UUID,
									name: 'Peter Gregory'
								},
								{
									model: 'person',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'person',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							],
							coCreditedEntities: [
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: PAINS_OF_YOUTH_COTTESLOE_PRODUCTION_UUID,
					name: 'Pains of Youth',
					theatre: {
						model: 'theatre',
						uuid: COTTESLOE_THEATRE_UUID,
						name: 'Cottesloe Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Management by',
							creditedMembers: [
								{
									model: 'person',
									uuid: CHERYL_FIRTH_PERSON_UUID,
									name: 'Cheryl Firth'
								},
								{
									model: 'person',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'person',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							],
							coCreditedEntities: [
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								},
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: TAMARA_ALBACHARI_PERSON_UUID,
											name: 'Tamara Albachari'
										},
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: PHÈDRE_LYTTELTON_PRODUCTION_UUID,
					name: 'Phèdre',
					theatre: {
						model: 'theatre',
						uuid: LYTTELTON_THEATRE_UUID,
						name: 'Lyttelton Theatre',
						surTheatre: {
							model: 'theatre',
							uuid: NATIONAL_THEATRE_UUID,
							name: 'National Theatre'
						}
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Management',
							creditedMembers: [
								{
									model: 'person',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'person',
									uuid: TOM_LEGGAT_PERSON_UUID,
									name: 'Tom Leggat'
								},
								{
									model: 'person',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								}
							],
							coCreditedEntities: [
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: KERRY_MCDEVITT_PERSON_UUID,
											name: 'Kerry McDevitt'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										}
									]
								},
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: WASTE_ALMEIDA_PRODUCTION_UUID,
					name: 'Waste',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					},
					crewCredits: [
						{
							model: 'crewCredit',
							name: 'Stage Managers',
							creditedMembers: [
								{
									model: 'person',
									uuid: SARA_GUNTER_PERSON_UUID,
									name: 'Sara Gunter'
								},
								{
									model: 'person',
									uuid: JULIA_WICKHAM_PERSON_UUID,
									name: 'Julia Wickham'
								},
								{
									model: 'person',
									uuid: CHERYL_FIRTH_PERSON_UUID,
									name: 'Cheryl Firth'
								}
							],
							coCreditedEntities: [
								{
									model: 'company',
									uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
									name: 'Crew Deputies Ltd',
									creditedMembers: [
										{
											model: 'person',
											uuid: BENJAMIN_DONOGHUE_PERSON_UUID,
											name: 'Benjamin Donoghue'
										},
										{
											model: 'person',
											uuid: NIK_HAFFENDEN_PERSON_UUID,
											name: 'Nik Haffenden'
										},
										{
											model: 'person',
											uuid: EMMA_CAMERON_PERSON_UUID,
											name: 'Emma Cameron'
										}
									]
								},
								{
									model: 'person',
									uuid: PRAD_PANKHANI_PERSON_UUID,
									name: 'Prad Pankhani'
								},
								{
									model: 'company',
									uuid: THEATRICAL_PRODUCTION_SERVICES_LTD_COMPANY_UUID,
									name: 'Theatrical Production Services Ltd',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: CASS_KIRCHNER_PERSON_UUID,
									name: 'Cass Kirchner'
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

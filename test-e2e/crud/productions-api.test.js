import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Productions API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new production', async () => {

			const response = await chai.request(app)
				.get('/productions/new');

			const expectedResponseBody = {
				model: 'PRODUCTION',
				name: '',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const PRODUCTION_UUID = '0';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(0);

			const response = await chai.request(app)
				.post('/productions')
				.send({
					name: 'As You Like It'
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'As You Like It',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(1);

		});

		it('gets data required to edit specific production', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}/edit`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'As You Like It',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'The Tempest'
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'The Tempest',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(1);

		});

		it('shows production', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'The Tempest',
				startDate: null,
				pressDate: null,
				endDate: null,
				material: null,
				venue: null,
				surProduction: null,
				subProductions: [],
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: [],
				awards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				name: 'The Tempest',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [],
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID = '0';
		const HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID = '3';
		const HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID = '6';
		const RICHARD_III_SUB_PRODUCTION_1_PRODUCTION_UUID = '9';
		const RICHARD_III_SUB_PRODUCTION_2_PRODUCTION_UUID = '12';
		const RICHARD_III_SUB_PRODUCTION_3_PRODUCTION_UUID = '15';
		const PRODUCTION_UUID = '18';
		const THE_TRAGEDY_OF_HAMLET_PRINCE_OF_DENMARK_MATERIAL_UUID = '19';
		const NATIONAL_THEATRE_VENUE_UUID = '20';
		const LISA_BURGER_PERSON_UUID = '21';
		const FUEL_THEATRE_COMPANY_UUID = '22';
		const SIMON_GODWIN_PERSON_UUID = '23';
		const TOM_MORRIS_PERSON_UUID = '24';
		const NATIONAL_THEATRE_COMPANY_UUID = '25';
		const NICHOLAS_HYTNER_PERSON_UUID = '26';
		const NICK_STARR_PERSON_UUID = '27';
		const LONDON_THEATRE_COMPANY_UUID = '28';
		const RORY_KINNEAR_PERSON_UUID = '29';
		const JAMES_LAURENSON_PERSON_UUID = '30';
		const MICHAEL_SHELDON_PERSON_UUID = '31';
		const LEO_STAAR_PERSON_UUID = '32';
		const HANDSPRING_PUPPET_COMPANY_UUID = '33';
		const BEN_RINGHAM_PERSON_UUID = '34';
		const MAX_RINGHAM_PERSON_UUID = '35';
		const FIFTY_NINE_PRODUCTIONS_COMPANY_UUID = '36';
		const LEO_WARNER_PERSON_UUID = '37';
		const MARK_GRIMMER_PERSON_UUID = '38';
		const IGOR_PERSON_UUID = '39';
		const CREW_DEPUTIES_LTD_COMPANY_UUID = '40';
		const SARA_GUNTER_PERSON_UUID = '41';
		const JULIA_WICKHAM_PERSON_UUID = '42';
		const CREW_ASSISTANTS_LTD_COMPANY_UUID = '43';
		const MOLLY_EINCHCOMB_PERSON_UUID = '44';
		const MATTHEW_HELLYER_PERSON_UUID = '45';
		const THE_TRAGEDY_OF_KING_RICHARD_III_MATERIAL_UUID = '46';
		const ALMEIDA_THEATRE_VENUE_UUID = '47';
		const DENISE_WOOD_PERSON_UUID = '48';
		const TIATA_FAHODZI_COMPANY_UUID = '49';
		const REBECCA_FRECKNALL_PERSON_UUID = '50';
		const SIMEON_BLAKE_HALL_PERSON_UUID = '51';
		const ALMEIDA_THEATRE_COMPANY_UUID = '52';
		const RUPERT_GOOLD_PERSON_UUID = '53';
		const ROBERT_ICKE_PERSON_UUID = '54';
		const HEADLONG_THEATRE_COMPANY_UUID = '55';
		const RALPH_FIENNES_PERSON_UUID = '56';
		const TOM_CANTON_PERSON_UUID = '57';
		const MARK_HADFIELD_PERSON_UUID = '58';
		const JOSH_COLLINS_PERSON_UUID = '59';
		const RC_ANNIE_LTD_COMPANY_UUID = '60';
		const HILDEGARD_BECHTLER_PERSON_UUID = '61';
		const CHLOE_LAMFORD_PERSON_UUID = '62';
		const AUTOGRAPH_COMPANY_UUID = '63';
		const ANDREW_BRUCE_PERSON_UUID = '64';
		const NICK_LIDSTER_PERSON_UUID = '65';
		const ANNA_ANDERSON_PERSON_UUID = '66';
		const DEPUTY_STAGE_MANAGERS_LTD_COMPANY_UUID = '67';
		const CHERYL_FIRTH_PERSON_UUID = '68';
		const TOM_LEGGAT_PERSON_UUID = '69';
		const DESIGN_ASSISTANTS_LTD_COMPANY_UUID = '70';
		const COLIN_FALCONER_PERSON_UUID = '71';
		const ALEX_LOWDE_PERSON_UUID = '72';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet sub-material #1'
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet sub-material #2'
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet sub-material #3'
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Richard III sub-material #1'
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Richard III sub-material #2'
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Richard III sub-material #3'
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('creates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(6);

			const response = await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					startDate: '2010-09-30',
					pressDate: '2010-10-07',
					endDate: '2011-01-26',
					material: {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						differentiator: '1'
					},
					venue: {
						name: 'National Theatre',
						differentiator: '1'
					},
					subProductions: [
						{
							uuid: HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID
						},
						{
							uuid: HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID
						},
						{
							uuid: HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID
						}
					],
					cast: [
						{
							name: 'Rory Kinnear',
							differentiator: '1',
							roles: [
								{
									name: 'Hamlet',
									characterName: 'Hamlet, Prince of Denmark',
									characterDifferentiator: '1',
									qualifier: 'foo'
								}
							]
						},
						{
							name: 'James Laurenson',
							differentiator: '1',
							roles: [
								{
									name: 'Ghost',
									characterName: 'Ghost of King Hamlet',
									characterDifferentiator: '1',
									qualifier: 'bar'
								},
								{
									name: 'First Player',
									characterName: 'Player King',
									characterDifferentiator: '1',
									qualifier: 'baz'
								}
							]
						},
						{
							name: 'Michael Sheldon',
							differentiator: '1',
							roles: [
								{
									name: 'Third Player',
									characterName: 'Lucianus',
									characterDifferentiator: '1',
									qualifier: 'qux'
								},
								{
									name: 'Ambassador of the English',
									characterName: 'English Ambassador',
									characterDifferentiator: '1',
									qualifier: 'quux',
									isAlternate: true
								}
							]
						},
						{
							name: 'Leo Staar',
							differentiator: '1',
							roles: []
						}
					],
					producerCredits: [
						{
							name: 'executive produced by',
							entities: [
								{
									name: 'Lisa Burger',
									differentiator: '1'
								}
							]
						},
						{
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									name: 'Fuel Theatre',
									differentiator: '1'
								}
							]
						},
						{
							name: 'associate produced by',
							entities: [
								{
									name: 'Simon Godwin',
									differentiator: '1'
								},
								{
									name: 'Tom Morris',
									differentiator: '1'
								}
							]
						},
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'National Theatre Company',
									differentiator: '1',
									members: [
										{
											name: 'Nicholas Hytner',
											differentiator: '1'
										},
										{
											name: 'Nick Starr',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'co-produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'London Theatre Company',
									differentiator: '1',
									members: [
										{
											name: 'Nicholas Hytner',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Nicholas Hytner',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Designers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Handspring Puppet Company',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Sound Designers',
							entities: [
								{
									name: 'Ben Ringham',
									differentiator: '1'
								},
								{
									name: 'Max Ringham',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Lighting Designers',
							entities: [
								{
									model: 'COMPANY',
									name: '59 Productions',
									differentiator: '1',
									members: [
										{
											name: 'Leo Warner',
											differentiator: '1'
										},
										{
											name: 'Mark Grimmer',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Video Designers',
							entities: [
								{
									model: 'COMPANY',
									name: '59 Productions',
									differentiator: '1',
									members: [
										{
											name: 'Leo Warner',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Igor',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Deputies Ltd',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									name: 'Sara Gunter',
									differentiator: '1'
								},
								{
									name: 'Julia Wickham',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Assistants Ltd',
									differentiator: '1',
									members: [
										{
											name: 'Molly Einchcomb',
											differentiator: '1'
										},
										{
											name: 'Matthew Hellyer',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Sound Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Crew Assistants Ltd',
									differentiator: '1',
									members: [
										{
											name: 'Molly Einchcomb',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					differentiator: '1',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: 'National Theatre',
					differentiator: '1',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Lisa Burger',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Fuel Theatre',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Simon Godwin',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Tom Morris',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'National Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Nick Starr',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'London Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: 'Rory Kinnear',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Hamlet',
								characterName: 'Hamlet, Prince of Denmark',
								characterDifferentiator: '1',
								qualifier: 'foo',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'James Laurenson',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet',
								characterDifferentiator: '1',
								qualifier: 'bar',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'First Player',
								characterName: 'Player King',
								characterDifferentiator: '1',
								qualifier: 'baz',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Michael Sheldon',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Third Player',
								characterName: 'Lucianus',
								characterDifferentiator: '1',
								qualifier: 'qux',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'Ambassador of the English',
								characterName: 'English Ambassador',
								characterDifferentiator: '1',
								qualifier: 'quux',
								isAlternate: true,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Leo Staar',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Nicholas Hytner',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Handspring Puppet Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Ben Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Max Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Lighting Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Mark Grimmer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Igor',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Sara Gunter',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Julia Wickham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Matthew Hellyer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(7);

		});

		it('shows production (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				material: {
					model: 'MATERIAL',
					uuid: THE_TRAGEDY_OF_HAMLET_PRINCE_OF_DENMARK_MATERIAL_UUID,
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					format: null,
					year: null,
					surMaterial: null,
					writingCredits: []
				},
				venue: {
					model: 'VENUE',
					uuid: NATIONAL_THEATRE_VENUE_UUID,
					name: 'National Theatre',
					surVenue: null
				},
				surProduction: null,
				subProductions: [
					{
						model: 'PRODUCTION',
						uuid: HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID,
						name: 'Hamlet sub-material #1',
						startDate: null,
						endDate: null,
						venue: null
					},
					{
						model: 'PRODUCTION',
						uuid: HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID,
						name: 'Hamlet sub-material #2',
						startDate: null,
						endDate: null,
						venue: null
					},
					{
						model: 'PRODUCTION',
						uuid: HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID,
						name: 'Hamlet sub-material #3',
						startDate: null,
						endDate: null,
						venue: null
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: LISA_BURGER_PERSON_UUID,
								name: 'Lisa Burger'
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						entities: [
							{
								model: 'COMPANY',
								uuid: FUEL_THEATRE_COMPANY_UUID,
								name: 'Fuel Theatre',
								members: []
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: SIMON_GODWIN_PERSON_UUID,
								name: 'Simon Godwin'
							},
							{
								model: 'PERSON',
								uuid: TOM_MORRIS_PERSON_UUID,
								name: 'Tom Morris'
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						entities: [
							{
								model: 'COMPANY',
								uuid: NATIONAL_THEATRE_COMPANY_UUID,
								name: 'National Theatre Company',
								members: [
									{
										model: 'PERSON',
										uuid: NICHOLAS_HYTNER_PERSON_UUID,
										name: 'Nicholas Hytner'
									},
									{
										model: 'PERSON',
										uuid: NICK_STARR_PERSON_UUID,
										name: 'Nick Starr'
									}
								]
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						entities: [
							{
								model: 'COMPANY',
								uuid: LONDON_THEATRE_COMPANY_UUID,
								name: 'London Theatre Company',
								members: [
									{
										model: 'PERSON',
										uuid: NICHOLAS_HYTNER_PERSON_UUID,
										name: 'Nicholas Hytner'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						uuid: RORY_KINNEAR_PERSON_UUID,
						name: 'Rory Kinnear',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Hamlet',
								qualifier: 'foo',
								isAlternate: false
							}
						]
					},
					{
						model: 'PERSON',
						uuid: JAMES_LAURENSON_PERSON_UUID,
						name: 'James Laurenson',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Ghost',
								qualifier: 'bar',
								isAlternate: false
							},
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'First Player',
								qualifier: 'baz',
								isAlternate: false
							}
						]
					},
					{
						model: 'PERSON',
						uuid: MICHAEL_SHELDON_PERSON_UUID,
						name: 'Michael Sheldon',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Third Player',
								qualifier: 'qux',
								isAlternate: false
							},
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Ambassador of the English',
								qualifier: 'quux',
								isAlternate: true
							}
						]
					},
					{
						model: 'PERSON',
						uuid: LEO_STAAR_PERSON_UUID,
						name: 'Leo Staar',
						roles: [
							{
								name: 'Performer'
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						entities: [
							{
								model: 'PERSON',
								uuid: NICHOLAS_HYTNER_PERSON_UUID,
								name: 'Nicholas Hytner'
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						entities: [
							{
								model: 'COMPANY',
								uuid: HANDSPRING_PUPPET_COMPANY_UUID,
								name: 'Handspring Puppet Company',
								members: []
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						entities: [
							{
								model: 'PERSON',
								uuid: BEN_RINGHAM_PERSON_UUID,
								name: 'Ben Ringham'
							},
							{
								model: 'PERSON',
								uuid: MAX_RINGHAM_PERSON_UUID,
								name: 'Max Ringham'
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Lighting Designers',
						entities: [
							{
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								members: [
									{
										model: 'PERSON',
										uuid: LEO_WARNER_PERSON_UUID,
										name: 'Leo Warner'
									},
									{
										model: 'PERSON',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						entities: [
							{
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								members: [
									{
										model: 'PERSON',
										uuid: LEO_WARNER_PERSON_UUID,
										name: 'Leo Warner'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						entities: [
							{
								model: 'PERSON',
								uuid: IGOR_PERSON_UUID,
								name: 'Igor'
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						entities: [
							{
								model: 'COMPANY',
								uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
								name: 'Crew Deputies Ltd',
								members: []
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						entities: [
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
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						entities: [
							{
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: MOLLY_EINCHCOMB_PERSON_UUID,
										name: 'Molly Einchcomb'
									},
									{
										model: 'PERSON',
										uuid: MATTHEW_HELLYER_PERSON_UUID,
										name: 'Matthew Hellyer'
									}
								]
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						entities: [
							{
								model: 'COMPANY',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: MOLLY_EINCHCOMB_PERSON_UUID,
										name: 'Molly Einchcomb'
									}
								]
							}
						]
					}
				],
				awards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific production', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}/edit`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					differentiator: '1',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: 'National Theatre',
					differentiator: '1',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_1_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_2_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: HAMLET_SUB_PRODUCTION_3_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Lisa Burger',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Fuel Theatre',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Simon Godwin',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Tom Morris',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'National Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Nick Starr',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'London Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: 'Rory Kinnear',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Hamlet',
								characterName: 'Hamlet, Prince of Denmark',
								characterDifferentiator: '1',
								qualifier: 'foo',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'James Laurenson',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet',
								characterDifferentiator: '1',
								qualifier: 'bar',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'First Player',
								characterName: 'Player King',
								characterDifferentiator: '1',
								qualifier: 'baz',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Michael Sheldon',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Third Player',
								characterName: 'Lucianus',
								characterDifferentiator: '1',
								qualifier: 'qux',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'Ambassador of the English',
								characterName: 'English Ambassador',
								characterDifferentiator: '1',
								qualifier: 'quux',
								isAlternate: true,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Leo Staar',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Nicholas Hytner',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Handspring Puppet Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Ben Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Max Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Lighting Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Mark Grimmer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Igor',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Deputies Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Sara Gunter',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Julia Wickham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Matthew Hellyer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(7);

			const response = await chai.request(app)
				.put(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'Richard III',
					startDate: '2016-06-07',
					pressDate: '2016-06-16',
					endDate: '2016-08-06',
					material: {
						name: 'The Tragedy of King Richard III',
						differentiator: '1'
					},
					venue: {
						name: 'Almeida Theatre',
						differentiator: '1'
					},
					subProductions: [
						{
							uuid: RICHARD_III_SUB_PRODUCTION_1_PRODUCTION_UUID
						},
						{
							uuid: RICHARD_III_SUB_PRODUCTION_2_PRODUCTION_UUID
						},
						{
							uuid: RICHARD_III_SUB_PRODUCTION_3_PRODUCTION_UUID
						}
					],
					producerCredits: [
						{
							name: 'executive produced by',
							entities: [
								{
									name: 'Denise Wood',
									differentiator: '1'
								}
							]
						},
						{
							name: 'in association with',
							entities: [
								{
									model: 'COMPANY',
									name: 'Tiata Fahodzi',
									differentiator: '1'
								}
							]
						},
						{
							name: 'associate produced by',
							entities: [
								{
									name: 'Rebecca Frecknall',
									differentiator: '1'
								},
								{
									name: 'Simeon Blake-Hall',
									differentiator: '1'
								}
							]
						},
						{
							name: 'produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Almeida Theatre Company',
									differentiator: '1',
									members: [
										{
											name: 'Rupert Goold',
											differentiator: '1'
										},
										{
											name: 'Robert Icke',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'co-produced by',
							entities: [
								{
									model: 'COMPANY',
									name: 'Headlong Theatre',
									differentiator: '1',
									members: [
										{
											name: 'Rupert Goold',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					cast: [
						{
							name: 'Ralph Fiennes',
							differentiator: '1',
							roles: [
								{
									name: 'Richard, Duke of Gloucester',
									characterName: 'King Richard III',
									characterDifferentiator: '1',
									qualifier: 'foo'
								}
							]
						},
						{
							name: 'Tom Canton',
							differentiator: '1',
							roles: [
								{
									name: 'Brakenbury',
									characterName: 'Sir Robert Brakenbury',
									characterDifferentiator: '1',
									qualifier: 'bar'
								},
								{
									name: 'Richmond',
									characterName: 'Henry, Earl of Richmond',
									characterDifferentiator: '1',
									qualifier: 'baz'
								}
							]
						},
						{
							name: 'Mark Hadfield',
							differentiator: '1',
							roles: [
								{
									name: 'Ratcliffe',
									characterName: 'Sir Richard Ratcliffe',
									characterDifferentiator: '1',
									qualifier: 'qux'
								},
								{
									name: 'Lord Mayor',
									characterName: 'Lord Mayor of London',
									characterDifferentiator: '1',
									qualifier: 'quux',
									isAlternate: true
								}
							]
						},
						{
							name: 'Josh Collins',
							differentiator: '1'
						}
					],
					creativeCredits: [
						{
							name: 'Director',
							entities: [
								{
									name: 'Rupert Goold',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Fight Directors',
							entities: [
								{
									model: 'COMPANY',
									name: 'RC-Annie',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Designers',
							entities: [
								{
									name: 'Hildegard Bechtler',
									differentiator: '1'
								},
								{
									name: 'Chloe Lamford',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Sound Designers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									differentiator: '1',
									members: [
										{
											name: 'Andrew Bruce',
											differentiator: '1'
										},
										{
											name: 'Nick Lidster',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Video Designers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Autograph',
									differentiator: '1',
									members: [
										{
											name: 'Andrew Bruce',
											differentiator: '1'
										}
									]
								}
							]
						}
					],
					crewCredits: [
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Anna Anderson',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'COMPANY',
									name: 'Deputy Stage Managers Ltd',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									name: 'Cheryl Firth',
									differentiator: '1'
								},
								{
									name: 'Tom Leggat',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Design Assistants Ltd',
									differentiator: '1',
									members: [
										{
											name: 'Colin Falconer',
											differentiator: '1'
										},
										{
											name: 'Alex Lowde',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Sound Design Assistants',
							entities: [
								{
									model: 'COMPANY',
									name: 'Design Assistants Ltd',
									differentiator: '1',
									members: [
										{
											name: 'Colin Falconer',
											differentiator: '1'
										}
									]
								}
							]
						}
					]
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				startDate: '2016-06-07',
				pressDate: '2016-06-16',
				endDate: '2016-08-06',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: 'The Tragedy of King Richard III',
					differentiator: '1',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: 'Almeida Theatre',
					differentiator: '1',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: RICHARD_III_SUB_PRODUCTION_1_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: RICHARD_III_SUB_PRODUCTION_2_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: RICHARD_III_SUB_PRODUCTION_3_PRODUCTION_UUID,
						errors: {}
					},
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Denise Wood',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Tiata Fahodzi',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Rebecca Frecknall',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Simeon Blake-Hall',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Almeida Theatre Company',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Rupert Goold',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Robert Icke',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Headlong Theatre',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Rupert Goold',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: 'Ralph Fiennes',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Richard, Duke of Gloucester',
								characterName: 'King Richard III',
								characterDifferentiator: '1',
								qualifier: 'foo',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Tom Canton',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Brakenbury',
								characterName: 'Sir Robert Brakenbury',
								characterDifferentiator: '1',
								qualifier: 'bar',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'Richmond',
								characterName: 'Henry, Earl of Richmond',
								characterDifferentiator: '1',
								qualifier: 'baz',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Mark Hadfield',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: 'Ratcliffe',
								characterName: 'Sir Richard Ratcliffe',
								characterDifferentiator: '1',
								qualifier: 'qux',
								isAlternate: false,
								errors: {}
							},
							{
								model: 'ROLE',
								name: 'Lord Mayor',
								characterName: 'Lord Mayor of London',
								characterDifferentiator: '1',
								qualifier: 'quux',
								isAlternate: true,
								errors: {}
							},
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: 'Josh Collins',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					},
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Rupert Goold',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Fight Directors',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'RC-Annie',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Hildegard Bechtler',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Chloe Lamford',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Autograph',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Andrew Bruce',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Nick Lidster',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Autograph',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Andrew Bruce',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Anna Anderson',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Deputy Stage Managers Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: 'Cheryl Firth',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: 'Tom Leggat',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Design Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Colin Falconer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Alex Lowde',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						errors: {},
						entities: [
							{
								model: 'COMPANY',
								name: 'Design Assistants Ltd',
								differentiator: '1',
								errors: {},
								members: [
									{
										model: 'PERSON',
										name: 'Colin Falconer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(7);

		});

		it('shows production (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				startDate: '2016-06-07',
				pressDate: '2016-06-16',
				endDate: '2016-08-06',
				material: {
					model: 'MATERIAL',
					uuid: THE_TRAGEDY_OF_KING_RICHARD_III_MATERIAL_UUID,
					name: 'The Tragedy of King Richard III',
					format: null,
					year: null,
					surMaterial: null,
					writingCredits: []
				},
				venue: {
					model: 'VENUE',
					uuid: ALMEIDA_THEATRE_VENUE_UUID,
					name: 'Almeida Theatre',
					surVenue: null
				},
				surProduction: null,
				subProductions: [
					{
						model: 'PRODUCTION',
						uuid: RICHARD_III_SUB_PRODUCTION_1_PRODUCTION_UUID,
						name: 'Richard III sub-material #1',
						startDate: null,
						endDate: null,
						venue: null
					},
					{
						model: 'PRODUCTION',
						uuid: RICHARD_III_SUB_PRODUCTION_2_PRODUCTION_UUID,
						name: 'Richard III sub-material #2',
						startDate: null,
						endDate: null,
						venue: null
					},
					{
						model: 'PRODUCTION',
						uuid: RICHARD_III_SUB_PRODUCTION_3_PRODUCTION_UUID,
						name: 'Richard III sub-material #3',
						startDate: null,
						endDate: null,
						venue: null
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: 'executive produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: DENISE_WOOD_PERSON_UUID,
								name: 'Denise Wood'
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'in association with',
						entities: [
							{
								model: 'COMPANY',
								uuid: TIATA_FAHODZI_COMPANY_UUID,
								name: 'Tiata Fahodzi',
								members: []
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'associate produced by',
						entities: [
							{
								model: 'PERSON',
								uuid: REBECCA_FRECKNALL_PERSON_UUID,
								name: 'Rebecca Frecknall'
							},
							{
								model: 'PERSON',
								uuid: SIMEON_BLAKE_HALL_PERSON_UUID,
								name: 'Simeon Blake-Hall'
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'produced by',
						entities: [
							{
								model: 'COMPANY',
								uuid: ALMEIDA_THEATRE_COMPANY_UUID,
								name: 'Almeida Theatre Company',
								members: [
									{
										model: 'PERSON',
										uuid: RUPERT_GOOLD_PERSON_UUID,
										name: 'Rupert Goold'
									},
									{
										model: 'PERSON',
										uuid: ROBERT_ICKE_PERSON_UUID,
										name: 'Robert Icke'
									}
								]
							}
						]
					},
					{
						model: 'PRODUCER_CREDIT',
						name: 'co-produced by',
						entities: [
							{
								model: 'COMPANY',
								uuid: HEADLONG_THEATRE_COMPANY_UUID,
								name: 'Headlong Theatre',
								members: [
									{
										model: 'PERSON',
										uuid: RUPERT_GOOLD_PERSON_UUID,
										name: 'Rupert Goold'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						uuid: RALPH_FIENNES_PERSON_UUID,
						name: 'Ralph Fiennes',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Richard, Duke of Gloucester',
								qualifier: 'foo',
								isAlternate: false
							}
						]
					},
					{
						model: 'PERSON',
						uuid: TOM_CANTON_PERSON_UUID,
						name: 'Tom Canton',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Brakenbury',
								qualifier: 'bar',
								isAlternate: false
							},
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Richmond',
								qualifier: 'baz',
								isAlternate: false
							}
						]
					},
					{
						model: 'PERSON',
						uuid: MARK_HADFIELD_PERSON_UUID,
						name: 'Mark Hadfield',
						roles: [
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Ratcliffe',
								qualifier: 'qux',
								isAlternate: false
							},
							{
								model: 'CHARACTER',
								uuid: null,
								name: 'Lord Mayor',
								qualifier: 'quux',
								isAlternate: true
							}
						]
					},
					{
						model: 'PERSON',
						uuid: JOSH_COLLINS_PERSON_UUID,
						name: 'Josh Collins',
						roles: [
							{
								name: 'Performer'
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: 'Director',
						entities: [
							{
								model: 'PERSON',
								uuid: RUPERT_GOOLD_PERSON_UUID,
								name: 'Rupert Goold'
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Fight Directors',
						entities: [
							{
								model: 'COMPANY',
								uuid: RC_ANNIE_LTD_COMPANY_UUID,
								name: 'RC-Annie',
								members: []
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Designers',
						entities: [
							{
								model: 'PERSON',
								uuid: HILDEGARD_BECHTLER_PERSON_UUID,
								name: 'Hildegard Bechtler'
							},
							{
								model: 'PERSON',
								uuid: CHLOE_LAMFORD_PERSON_UUID,
								name: 'Chloe Lamford'
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Sound Designers',
						entities: [
							{
								model: 'COMPANY',
								uuid: AUTOGRAPH_COMPANY_UUID,
								name: 'Autograph',
								members: [
									{
										model: 'PERSON',
										uuid: ANDREW_BRUCE_PERSON_UUID,
										name: 'Andrew Bruce'
									},
									{
										model: 'PERSON',
										uuid: NICK_LIDSTER_PERSON_UUID,
										name: 'Nick Lidster'
									}
								]
							}
						]
					},
					{
						model: 'CREATIVE_CREDIT',
						name: 'Video Designers',
						entities: [
							{
								model: 'COMPANY',
								uuid: AUTOGRAPH_COMPANY_UUID,
								name: 'Autograph',
								members: [
									{
										model: 'PERSON',
										uuid: ANDREW_BRUCE_PERSON_UUID,
										name: 'Andrew Bruce'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: 'Production Manager',
						entities: [
							{
								model: 'PERSON',
								uuid: ANNA_ANDERSON_PERSON_UUID,
								name: 'Anna Anderson'
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Deputy Stage Managers',
						entities: [
							{
								model: 'COMPANY',
								uuid: DEPUTY_STAGE_MANAGERS_LTD_COMPANY_UUID,
								name: 'Deputy Stage Managers Ltd',
								members: []
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Assistant Stage Managers',
						entities: [
							{
								model: 'PERSON',
								uuid: CHERYL_FIRTH_PERSON_UUID,
								name: 'Cheryl Firth'
							},
							{
								model: 'PERSON',
								uuid: TOM_LEGGAT_PERSON_UUID,
								name: 'Tom Leggat'
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Design Assistants',
						entities: [
							{
								model: 'COMPANY',
								uuid: DESIGN_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Design Assistants Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: COLIN_FALCONER_PERSON_UUID,
										name: 'Colin Falconer'
									},
									{
										model: 'PERSON',
										uuid: ALEX_LOWDE_PERSON_UUID,
										name: 'Alex Lowde'
									}
								]
							}
						]
					},
					{
						model: 'CREW_CREDIT',
						name: 'Sound Design Assistants',
						entities: [
							{
								model: 'COMPANY',
								uuid: DESIGN_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Design Assistants Ltd',
								members: [
									{
										model: 'PERSON',
										uuid: COLIN_FALCONER_PERSON_UUID,
										name: 'Colin Falconer'
									}
								]
							}
						]
					}
				],
				awards: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates production to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(7);

			const response = await chai.request(app)
				.put(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'Richard III'
				});

			const expectedResponseBody = {
				model: 'PRODUCTION',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [
					{
						model: 'PRODUCTION_IDENTIFIER',
						uuid: '',
						errors: {}
					}
				],
				producerCredits: [
					{
						model: 'PRODUCER_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'PERSON',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'ROLE',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								isAlternate: false,
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'CREATIVE_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'CREW_CREDIT',
						name: '',
						errors: {},
						entities: [
							{
								model: 'PERSON',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(7);

		});

		it('deletes production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(7);

			const response = await chai.request(app)
				.delete(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'PRODUCTION',
				name: 'Richard III',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'MATERIAL',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'VENUE',
					name: '',
					differentiator: '',
					errors: {}
				},
				subProductions: [],
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('Production')).to.equal(6);

		});

	});

	describe('GET list endpoint', () => {

		const MACBETH_GIELGUD_PRODUCTION_UUID = '0';
		const GIELGUD_THEATRE_VENUE_UUID = '2';
		const HAMLET_NATIONAL_PRODUCTION_UUID = '3';
		const NATIONAL_THEATRE_VENUE_UUID = '5';
		const MACBETH_ALMEIDA_PRODUCTION_UUID = '6';
		const ALMEIDA_THEATRE_VENUE_UUID = '8';
		const HAMLET_WYNDHAMS_PRODUCTION_UUID = '9';
		const WYNDHAMS_THEATRE_VENUE_UUID = '11';
		const HAMLET_ALMEIDA_PRODUCTION_UUID = '12';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Macbeth',
					startDate: '2010-09-30',
					pressDate: '2010-10-07',
					endDate: '2011-01-26',
					venue: {
						name: 'Gielgud Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					startDate: '2010-09-30',
					pressDate: '2010-10-07',
					endDate: '2011-01-26',
					venue: {
						name: 'National Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Macbeth',
					startDate: '2010-09-30',
					pressDate: '2010-10-07',
					endDate: '2011-01-26',
					venue: {
						name: 'Almeida Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					startDate: '2009-05-29',
					pressDate: '2009-06-03',
					endDate: '2009-08-22',
					venue: {
						name: 'Wyndham\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					startDate: '2017-06-09',
					pressDate: '2017-06-15',
					endDate: '2017-09-02',
					venue: {
						name: 'Almeida Theatre'
					}
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all productions ordered by start date then name then venue name', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
				{
					model: 'PRODUCTION',
					uuid: HAMLET_ALMEIDA_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2017-06-09',
					endDate: '2017-09-02',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: HAMLET_NATIONAL_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2010-09-30',
					endDate: '2011-01-26',
					venue: {
						model: 'VENUE',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: MACBETH_ALMEIDA_PRODUCTION_UUID,
					name: 'Macbeth',
					startDate: '2010-09-30',
					endDate: '2011-01-26',
					venue: {
						model: 'VENUE',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: MACBETH_GIELGUD_PRODUCTION_UUID,
					name: 'Macbeth',
					startDate: '2010-09-30',
					endDate: '2011-01-26',
					venue: {
						model: 'VENUE',
						uuid: GIELGUD_THEATRE_VENUE_UUID,
						name: 'Gielgud Theatre',
						surVenue: null
					},
					surProduction: null
				},
				{
					model: 'PRODUCTION',
					uuid: HAMLET_WYNDHAMS_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2009-05-29',
					endDate: '2009-08-22',
					venue: {
						model: 'VENUE',
						uuid: WYNDHAMS_THEATRE_VENUE_UUID,
						name: 'Wyndham\'s Theatre',
						surVenue: null
					},
					surProduction: null
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

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
				model: 'production',
				startDate: '',
				pressDate: '',
				endDate: '',
				name: '',
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'venue',
					name: '',
					differentiator: '',
					errors: {}
				},
				producerCredits: [
					{
						model: 'producerCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'creativeCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'crewCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
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

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

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
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'As You Like It',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'venue',
					name: '',
					differentiator: '',
					errors: {}
				},
				producerCredits: [
					{
						model: 'producerCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'creativeCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'crewCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
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
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'As You Like It',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'venue',
					name: '',
					differentiator: '',
					errors: {}
				},
				producerCredits: [
					{
						model: 'producerCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'creativeCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'crewCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
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
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'The Tempest',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'venue',
					name: '',
					differentiator: '',
					errors: {}
				},
				producerCredits: [
					{
						model: 'producerCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'creativeCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'crewCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
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
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'The Tempest',
				startDate: null,
				pressDate: null,
				endDate: null,
				material: null,
				venue: null,
				producerCredits: [],
				cast: [],
				creativeCredits: [],
				crewCredits: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'production',
				name: 'The Tempest',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'venue',
					name: '',
					differentiator: '',
					errors: {}
				},
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

		const PRODUCTION_UUID = '0';
		const THE_TRAGEDY_OF_HAMLET_PRINCE_OF_DENMARK_MATERIAL_UUID = '1';
		const NATIONAL_THEATRE_VENUE_UUID = '2';
		const LISA_BURGER_PERSON_UUID = '3';
		const FUEL_THEATRE_COMPANY_UUID = '4';
		const SIMON_GODWIN_PERSON_UUID = '5';
		const TOM_MORRIS_PERSON_UUID = '6';
		const NATIONAL_THEATRE_COMPANY_UUID = '7';
		const NICHOLAS_HYTNER_PERSON_UUID = '8';
		const NICK_STARR_PERSON_UUID = '9';
		const LONDON_THEATRE_COMPANY_UUID = '10';
		const RORY_KINNEAR_PERSON_UUID = '11';
		const JAMES_LAURENSON_PERSON_UUID = '12';
		const MICHAEL_SHELDON_PERSON_UUID = '13';
		const LEO_STAAR_PERSON_UUID = '14';
		const HANDSPRING_PUPPET_COMPANY_UUID = '15';
		const BEN_RINGHAM_PERSON_UUID = '16';
		const MAX_RINGHAM_PERSON_UUID = '17';
		const FIFTY_NINE_PRODUCTIONS_COMPANY_UUID = '18';
		const LEO_WARNER_PERSON_UUID = '19';
		const MARK_GRIMMER_PERSON_UUID = '20';
		const IGOR_PERSON_UUID = '21';
		const CREW_DEPUTIES_LTD_COMPANY_UUID = '22';
		const SARA_GUNTER_PERSON_UUID = '23';
		const JULIA_WICKHAM_PERSON_UUID = '24';
		const CREW_ASSISTANTS_LTD_COMPANY_UUID = '25';
		const MOLLY_EINCHCOMB_PERSON_UUID = '26';
		const MATTHEW_HELLYER_PERSON_UUID = '27';
		const THE_TRAGEDY_OF_KING_RICHARD_III_MATERIAL_UUID = '28';
		const ALMEIDA_THEATRE_VENUE_UUID = '29';
		const DENISE_WOOD_PERSON_UUID = '30';
		const TIATA_FAHODZI_COMPANY_UUID = '31';
		const REBECCA_FRECKNALL_PERSON_UUID = '32';
		const SIMEON_BLAKE_HALL_PERSON_UUID = '33';
		const ALMEIDA_THEATRE_COMPANY_UUID = '34';
		const RUPERT_GOOLD_PERSON_UUID = '35';
		const ROBERT_ICKE_PERSON_UUID = '36';
		const HEADLONG_THEATRE_COMPANY_UUID = '37';
		const RALPH_FIENNES_PERSON_UUID = '38';
		const TOM_CANTON_PERSON_UUID = '39';
		const MARK_HADFIELD_PERSON_UUID = '40';
		const JOSH_COLLINS_PERSON_UUID = '41';
		const RC_ANNIE_LTD_COMPANY_UUID = '42';
		const HILDEGARD_BECHTLER_PERSON_UUID = '43';
		const CHLOE_LAMFORD_PERSON_UUID = '44';
		const AUTOGRAPH_COMPANY_UUID = '45';
		const ANDREW_BRUCE_PERSON_UUID = '46';
		const NICK_LIDSTER_PERSON_UUID = '47';
		const ANNA_ANDERSON_PERSON_UUID = '48';
		const DEPUTY_STAGE_MANAGERS_LTD_COMPANY_UUID = '49';
		const CHERYL_FIRTH_PERSON_UUID = '50';
		const TOM_LEGGAT_PERSON_UUID = '51';
		const DESIGN_ASSISTANTS_LTD_COMPANY_UUID = '52';
		const COLIN_FALCONER_PERSON_UUID = '53';
		const ALEX_LOWDE_PERSON_UUID = '54';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

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
									qualifier: 'quux'
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
						// Contrivance for purposes of test.
						{
							name: 'executive produced by',
							entities: [
								{
									name: 'Lisa Burger',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'in association with',
							entities: [
								{
									model: 'company',
									name: 'Fuel Theatre',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
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
									model: 'company',
									name: 'National Theatre Company',
									differentiator: '1',
									creditedMembers: [
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
						// Contrivance for purposes of test.
						{
							name: 'Co-Producer',
							entities: [
								{
									model: 'company',
									name: 'London Theatre Company',
									differentiator: '1',
									creditedMembers: [
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
									model: 'company',
									name: 'Handspring Puppet Company',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
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
						// Contrivance for purposes of test.
						{
							name: 'Lighting Designers',
							entities: [
								{
									model: 'company',
									name: '59 Productions',
									differentiator: '1',
									creditedMembers: [
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
						// Contrivance for purposes of test.
						{
							name: 'Video Designers',
							entities: [
								{
									model: 'company',
									name: '59 Productions',
									differentiator: '1',
									creditedMembers: [
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
						// Contrivance for purposes of test.
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'company',
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
						// Contrivance for purposes of test.
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'company',
									name: 'Crew Assistants Ltd',
									differentiator: '1',
									creditedMembers: [
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
						// Contrivance for purposes of test.
						{
							name: 'Sound Design Assistants',
							entities: [
								{
									model: 'company',
									name: 'Crew Assistants Ltd',
									differentiator: '1',
									creditedMembers: [
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
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				errors: {},
				material: {
					model: 'material',
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					differentiator: '1',
					errors: {}
				},
				venue: {
					model: 'venue',
					name: 'National Theatre',
					differentiator: '1',
					errors: {}
				},
				producerCredits: [
					{
						model: 'producerCredit',
						name: 'executive produced by',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Lisa Burger',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'in association with',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Fuel Theatre',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'associate produced by',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Simon Godwin',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: 'Tom Morris',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'produced by',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'National Theatre Company',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: 'Nick Starr',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'Co-Producer',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'London Theatre Company',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'person',
						name: 'Rory Kinnear',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Hamlet',
								characterName: 'Hamlet, Prince of Denmark',
								characterDifferentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'James Laurenson',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet',
								characterDifferentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'role',
								name: 'First Player',
								characterName: 'Player King',
								characterDifferentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Michael Sheldon',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Third Player',
								characterName: 'Lucianus',
								characterDifferentiator: '1',
								qualifier: 'qux',
								errors: {}
							},
							{
								model: 'role',
								name: 'Ambassador of the English',
								characterName: 'English Ambassador',
								characterDifferentiator: '1',
								qualifier: 'quux',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Leo Staar',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'creativeCredit',
						name: 'Director',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Nicholas Hytner',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Designers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Handspring Puppet Company',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Sound Designers',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Ben Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: 'Max Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Lighting Designers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: 'Mark Grimmer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Video Designers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'crewCredit',
						name: 'Production Manager',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Igor',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Deputy Stage Managers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Crew Deputies Ltd',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Assistant Stage Managers',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Sara Gunter',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: 'Julia Wickham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Design Assistants',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: 'Matthew Hellyer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Sound Design Assistants',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
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

		it('shows production (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				material: {
					model: 'material',
					uuid: THE_TRAGEDY_OF_HAMLET_PRINCE_OF_DENMARK_MATERIAL_UUID,
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					format: null,
					writingCredits: []
				},
				venue: {
					model: 'venue',
					uuid: NATIONAL_THEATRE_VENUE_UUID,
					name: 'National Theatre',
					surVenue: null
				},
				producerCredits: [
					{
						model: 'producerCredit',
						name: 'executive produced by',
						entities: [
							{
								model: 'person',
								uuid: LISA_BURGER_PERSON_UUID,
								name: 'Lisa Burger'
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'in association with',
						entities: [
							{
								model: 'company',
								uuid: FUEL_THEATRE_COMPANY_UUID,
								name: 'Fuel Theatre',
								creditedMembers: []
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'associate produced by',
						entities: [
							{
								model: 'person',
								uuid: SIMON_GODWIN_PERSON_UUID,
								name: 'Simon Godwin'
							},
							{
								model: 'person',
								uuid: TOM_MORRIS_PERSON_UUID,
								name: 'Tom Morris'
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'produced by',
						entities: [
							{
								model: 'company',
								uuid: NATIONAL_THEATRE_COMPANY_UUID,
								name: 'National Theatre Company',
								creditedMembers: [
									{
										model: 'person',
										uuid: NICHOLAS_HYTNER_PERSON_UUID,
										name: 'Nicholas Hytner'
									},
									{
										model: 'person',
										uuid: NICK_STARR_PERSON_UUID,
										name: 'Nick Starr'
									}
								]
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'Co-Producer',
						entities: [
							{
								model: 'company',
								uuid: LONDON_THEATRE_COMPANY_UUID,
								name: 'London Theatre Company',
								creditedMembers: [
									{
										model: 'person',
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
						model: 'person',
						uuid: RORY_KINNEAR_PERSON_UUID,
						name: 'Rory Kinnear',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Hamlet',
								qualifier: 'foo'
							}
						]
					},
					{
						model: 'person',
						uuid: JAMES_LAURENSON_PERSON_UUID,
						name: 'James Laurenson',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Ghost',
								qualifier: 'bar'
							},
							{
								model: 'character',
								uuid: null,
								name: 'First Player',
								qualifier: 'baz'
							}
						]
					},
					{
						model: 'person',
						uuid: MICHAEL_SHELDON_PERSON_UUID,
						name: 'Michael Sheldon',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Third Player',
								qualifier: 'qux'
							},
							{
								model: 'character',
								uuid: null,
								name: 'Ambassador of the English',
								qualifier: 'quux'
							}
						]
					},
					{
						model: 'person',
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
						model: 'creativeCredit',
						name: 'Director',
						entities: [
							{
								model: 'person',
								uuid: NICHOLAS_HYTNER_PERSON_UUID,
								name: 'Nicholas Hytner'
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Designers',
						entities: [
							{
								model: 'company',
								uuid: HANDSPRING_PUPPET_COMPANY_UUID,
								name: 'Handspring Puppet Company',
								creditedMembers: []
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Sound Designers',
						entities: [
							{
								model: 'person',
								uuid: BEN_RINGHAM_PERSON_UUID,
								name: 'Ben Ringham'
							},
							{
								model: 'person',
								uuid: MAX_RINGHAM_PERSON_UUID,
								name: 'Max Ringham'
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Lighting Designers',
						entities: [
							{
								model: 'company',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								creditedMembers: [
									{
										model: 'person',
										uuid: LEO_WARNER_PERSON_UUID,
										name: 'Leo Warner'
									},
									{
										model: 'person',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Video Designers',
						entities: [
							{
								model: 'company',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								creditedMembers: [
									{
										model: 'person',
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
						model: 'crewCredit',
						name: 'Production Manager',
						entities: [
							{
								model: 'person',
								uuid: IGOR_PERSON_UUID,
								name: 'Igor'
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Deputy Stage Managers',
						entities: [
							{
								model: 'company',
								uuid: CREW_DEPUTIES_LTD_COMPANY_UUID,
								name: 'Crew Deputies Ltd',
								creditedMembers: []
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Assistant Stage Managers',
						entities: [
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
						model: 'crewCredit',
						name: 'Design Assistants',
						entities: [
							{
								model: 'company',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								creditedMembers: [
									{
										model: 'person',
										uuid: MOLLY_EINCHCOMB_PERSON_UUID,
										name: 'Molly Einchcomb'
									},
									{
										model: 'person',
										uuid: MATTHEW_HELLYER_PERSON_UUID,
										name: 'Matthew Hellyer'
									}
								]
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Sound Design Assistants',
						entities: [
							{
								model: 'company',
								uuid: CREW_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Crew Assistants Ltd',
								creditedMembers: [
									{
										model: 'person',
										uuid: MOLLY_EINCHCOMB_PERSON_UUID,
										name: 'Molly Einchcomb'
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific production', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}/edit`);

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Hamlet',
				startDate: '2010-09-30',
				pressDate: '2010-10-07',
				endDate: '2011-01-26',
				errors: {},
				material: {
					model: 'material',
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					differentiator: '1',
					errors: {}
				},
				venue: {
					model: 'venue',
					name: 'National Theatre',
					differentiator: '1',
					errors: {}
				},
				producerCredits: [
					{
						model: 'producerCredit',
						name: 'executive produced by',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Lisa Burger',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'in association with',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Fuel Theatre',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'associate produced by',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Simon Godwin',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: 'Tom Morris',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'produced by',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'National Theatre Company',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: 'Nick Starr',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'Co-Producer',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'London Theatre Company',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Nicholas Hytner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'person',
						name: 'Rory Kinnear',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Hamlet',
								characterName: 'Hamlet, Prince of Denmark',
								characterDifferentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'James Laurenson',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Ghost',
								characterName: 'Ghost of King Hamlet',
								characterDifferentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'role',
								name: 'First Player',
								characterName: 'Player King',
								characterDifferentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Michael Sheldon',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Third Player',
								characterName: 'Lucianus',
								characterDifferentiator: '1',
								qualifier: 'qux',
								errors: {}
							},
							{
								model: 'role',
								name: 'Ambassador of the English',
								characterName: 'English Ambassador',
								characterDifferentiator: '1',
								qualifier: 'quux',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Leo Staar',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'creativeCredit',
						name: 'Director',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Nicholas Hytner',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Designers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Handspring Puppet Company',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Sound Designers',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Ben Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: 'Max Ringham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Lighting Designers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: 'Mark Grimmer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Video Designers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: '59 Productions',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Leo Warner',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'crewCredit',
						name: 'Production Manager',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Igor',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Deputy Stage Managers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Crew Deputies Ltd',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Assistant Stage Managers',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Sara Gunter',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: 'Julia Wickham',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Design Assistants',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: 'Matthew Hellyer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Sound Design Assistants',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Crew Assistants Ltd',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Molly Einchcomb',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
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
						// Contrivance for purposes of test.
						{
							name: 'in association with',
							entities: [
								{
									model: 'company',
									name: 'Tiata Fahodzi',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
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
									model: 'company',
									name: 'Almeida Theatre Company',
									differentiator: '1',
									creditedMembers: [
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
						// Contrivance for purposes of test.
						{
							name: 'Co-Producer',
							entities: [
								{
									model: 'company',
									name: 'Headlong Theatre',
									differentiator: '1',
									creditedMembers: [
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
									qualifier: 'quux'
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
						// Contrivance for purposes of test.
						{
							name: 'Fight Directors',
							entities: [
								{
									model: 'company',
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
								// Contrivance for purposes of test.
								{
									name: 'Chloe Lamford',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'Sound Designers',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									differentiator: '1',
									creditedMembers: [
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
						// Contrivance for purposes of test.
						{
							name: 'Video Designers',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									differentiator: '1',
									creditedMembers: [
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
						// Contrivance for purposes of test.
						{
							name: 'Production Manager',
							entities: [
								{
									name: 'Anna Anderson',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'Deputy Stage Managers',
							entities: [
								{
									model: 'company',
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
						// Contrivance for purposes of test.
						{
							name: 'Design Assistants',
							entities: [
								{
									model: 'company',
									name: 'Design Assistants Ltd',
									differentiator: '1',
									creditedMembers: [
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
						// Contrivance for purposes of test.
						{
							name: 'Sound Design Assistants',
							entities: [
								{
									model: 'company',
									name: 'Design Assistants Ltd',
									differentiator: '1',
									creditedMembers: [
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
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				startDate: '2016-06-07',
				pressDate: '2016-06-16',
				endDate: '2016-08-06',
				errors: {},
				material: {
					model: 'material',
					name: 'The Tragedy of King Richard III',
					differentiator: '1',
					errors: {}
				},
				venue: {
					model: 'venue',
					name: 'Almeida Theatre',
					differentiator: '1',
					errors: {}
				},
				producerCredits: [
					{
						model: 'producerCredit',
						name: 'executive produced by',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Denise Wood',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'in association with',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Tiata Fahodzi',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'associate produced by',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Rebecca Frecknall',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: 'Simeon Blake-Hall',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'produced by',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Almeida Theatre Company',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Rupert Goold',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: 'Robert Icke',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'Co-Producer',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Headlong Theatre',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Rupert Goold',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'producerCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'person',
						name: 'Ralph Fiennes',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Richard, Duke of Gloucester',
								characterName: 'King Richard III',
								characterDifferentiator: '1',
								qualifier: 'foo',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Tom Canton',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Brakenbury',
								characterName: 'Sir Robert Brakenbury',
								characterDifferentiator: '1',
								qualifier: 'bar',
								errors: {}
							},
							{
								model: 'role',
								name: 'Richmond',
								characterName: 'Henry, Earl of Richmond',
								characterDifferentiator: '1',
								qualifier: 'baz',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Mark Hadfield',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: 'Ratcliffe',
								characterName: 'Sir Richard Ratcliffe',
								characterDifferentiator: '1',
								qualifier: 'qux',
								errors: {}
							},
							{
								model: 'role',
								name: 'Lord Mayor',
								characterName: 'Lord Mayor of London',
								characterDifferentiator: '1',
								qualifier: 'quux',
								errors: {}
							},
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: 'Josh Collins',
						differentiator: '1',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					},
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'creativeCredit',
						name: 'Director',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Rupert Goold',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Fight Directors',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'RC-Annie',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Designers',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Hildegard Bechtler',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: 'Chloe Lamford',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Sound Designers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Autograph',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Andrew Bruce',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: 'Nick Lidster',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Video Designers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Autograph',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Andrew Bruce',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'creativeCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'crewCredit',
						name: 'Production Manager',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Anna Anderson',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Deputy Stage Managers',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Deputy Stage Managers Ltd',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Assistant Stage Managers',
						errors: {},
						entities: [
							{
								model: 'person',
								name: 'Cheryl Firth',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: 'Tom Leggat',
								differentiator: '1',
								errors: {}
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Design Assistants',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Design Assistants Ltd',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Colin Falconer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: 'Alex Lowde',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Sound Design Assistants',
						errors: {},
						entities: [
							{
								model: 'company',
								name: 'Design Assistants Ltd',
								differentiator: '1',
								errors: {},
								creditedMembers: [
									{
										model: 'person',
										name: 'Colin Falconer',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'person',
										name: '',
										differentiator: '',
										errors: {}
									}
								]
							},
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					},
					{
						model: 'crewCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
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

		it('shows production (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				startDate: '2016-06-07',
				pressDate: '2016-06-16',
				endDate: '2016-08-06',
				material: {
					model: 'material',
					uuid: THE_TRAGEDY_OF_KING_RICHARD_III_MATERIAL_UUID,
					name: 'The Tragedy of King Richard III',
					format: null,
					writingCredits: []
				},
				venue: {
					model: 'venue',
					uuid: ALMEIDA_THEATRE_VENUE_UUID,
					name: 'Almeida Theatre',
					surVenue: null
				},
				producerCredits: [
					{
						model: 'producerCredit',
						name: 'executive produced by',
						entities: [
							{
								model: 'person',
								uuid: DENISE_WOOD_PERSON_UUID,
								name: 'Denise Wood'
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'in association with',
						entities: [
							{
								model: 'company',
								uuid: TIATA_FAHODZI_COMPANY_UUID,
								name: 'Tiata Fahodzi',
								creditedMembers: []
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'associate produced by',
						entities: [
							{
								model: 'person',
								uuid: REBECCA_FRECKNALL_PERSON_UUID,
								name: 'Rebecca Frecknall'
							},
							{
								model: 'person',
								uuid: SIMEON_BLAKE_HALL_PERSON_UUID,
								name: 'Simeon Blake-Hall'
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'produced by',
						entities: [
							{
								model: 'company',
								uuid: ALMEIDA_THEATRE_COMPANY_UUID,
								name: 'Almeida Theatre Company',
								creditedMembers: [
									{
										model: 'person',
										uuid: RUPERT_GOOLD_PERSON_UUID,
										name: 'Rupert Goold'
									},
									{
										model: 'person',
										uuid: ROBERT_ICKE_PERSON_UUID,
										name: 'Robert Icke'
									}
								]
							}
						]
					},
					{
						model: 'producerCredit',
						name: 'Co-Producer',
						entities: [
							{
								model: 'company',
								uuid: HEADLONG_THEATRE_COMPANY_UUID,
								name: 'Headlong Theatre',
								creditedMembers: [
									{
										model: 'person',
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
						model: 'person',
						uuid: RALPH_FIENNES_PERSON_UUID,
						name: 'Ralph Fiennes',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Richard, Duke of Gloucester',
								qualifier: 'foo'
							}
						]
					},
					{
						model: 'person',
						uuid: TOM_CANTON_PERSON_UUID,
						name: 'Tom Canton',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Brakenbury',
								qualifier: 'bar'
							},
							{
								model: 'character',
								uuid: null,
								name: 'Richmond',
								qualifier: 'baz'
							}
						]
					},
					{
						model: 'person',
						uuid: MARK_HADFIELD_PERSON_UUID,
						name: 'Mark Hadfield',
						roles: [
							{
								model: 'character',
								uuid: null,
								name: 'Ratcliffe',
								qualifier: 'qux'
							},
							{
								model: 'character',
								uuid: null,
								name: 'Lord Mayor',
								qualifier: 'quux'
							}
						]
					},
					{
						model: 'person',
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
						model: 'creativeCredit',
						name: 'Director',
						entities: [
							{
								model: 'person',
								uuid: RUPERT_GOOLD_PERSON_UUID,
								name: 'Rupert Goold'
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Fight Directors',
						entities: [
							{
								model: 'company',
								uuid: RC_ANNIE_LTD_COMPANY_UUID,
								name: 'RC-Annie',
								creditedMembers: []
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Designers',
						entities: [
							{
								model: 'person',
								uuid: HILDEGARD_BECHTLER_PERSON_UUID,
								name: 'Hildegard Bechtler'
							},
							{
								model: 'person',
								uuid: CHLOE_LAMFORD_PERSON_UUID,
								name: 'Chloe Lamford'
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Sound Designers',
						entities: [
							{
								model: 'company',
								uuid: AUTOGRAPH_COMPANY_UUID,
								name: 'Autograph',
								creditedMembers: [
									{
										model: 'person',
										uuid: ANDREW_BRUCE_PERSON_UUID,
										name: 'Andrew Bruce'
									},
									{
										model: 'person',
										uuid: NICK_LIDSTER_PERSON_UUID,
										name: 'Nick Lidster'
									}
								]
							}
						]
					},
					{
						model: 'creativeCredit',
						name: 'Video Designers',
						entities: [
							{
								model: 'company',
								uuid: AUTOGRAPH_COMPANY_UUID,
								name: 'Autograph',
								creditedMembers: [
									{
										model: 'person',
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
						model: 'crewCredit',
						name: 'Production Manager',
						entities: [
							{
								model: 'person',
								uuid: ANNA_ANDERSON_PERSON_UUID,
								name: 'Anna Anderson'
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Deputy Stage Managers',
						entities: [
							{
								model: 'company',
								uuid: DEPUTY_STAGE_MANAGERS_LTD_COMPANY_UUID,
								name: 'Deputy Stage Managers Ltd',
								creditedMembers: []
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Assistant Stage Managers',
						entities: [
							{
								model: 'person',
								uuid: CHERYL_FIRTH_PERSON_UUID,
								name: 'Cheryl Firth'
							},
							{
								model: 'person',
								uuid: TOM_LEGGAT_PERSON_UUID,
								name: 'Tom Leggat'
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Design Assistants',
						entities: [
							{
								model: 'company',
								uuid: DESIGN_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Design Assistants Ltd',
								creditedMembers: [
									{
										model: 'person',
										uuid: COLIN_FALCONER_PERSON_UUID,
										name: 'Colin Falconer'
									},
									{
										model: 'person',
										uuid: ALEX_LOWDE_PERSON_UUID,
										name: 'Alex Lowde'
									}
								]
							}
						]
					},
					{
						model: 'crewCredit',
						name: 'Sound Design Assistants',
						entities: [
							{
								model: 'company',
								uuid: DESIGN_ASSISTANTS_LTD_COMPANY_UUID,
								name: 'Design Assistants Ltd',
								creditedMembers: [
									{
										model: 'person',
										uuid: COLIN_FALCONER_PERSON_UUID,
										name: 'Colin Falconer'
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates production to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.put(`/productions/${PRODUCTION_UUID}`)
				.send({
					name: 'Richard III'
				});

			const expectedResponseBody = {
				model: 'production',
				uuid: PRODUCTION_UUID,
				name: 'Richard III',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'venue',
					name: '',
					differentiator: '',
					errors: {}
				},
				producerCredits: [
					{
						model: 'producerCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				cast: [
					{
						model: 'person',
						name: '',
						differentiator: '',
						errors: {},
						roles: [
							{
								model: 'role',
								name: '',
								characterName: '',
								characterDifferentiator: '',
								qualifier: '',
								errors: {}
							}
						]
					}
				],
				creativeCredits: [
					{
						model: 'creativeCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
								name: '',
								differentiator: '',
								errors: {}
							}
						]
					}
				],
				crewCredits: [
					{
						model: 'crewCredit',
						name: '',
						errors: {},
						entities: [
							{
								model: 'person',
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

		it('deletes production', async () => {

			expect(await countNodesWithLabel('Production')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/productions/${PRODUCTION_UUID}`);

			const expectedResponseBody = {
				model: 'production',
				name: 'Richard III',
				startDate: '',
				pressDate: '',
				endDate: '',
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				venue: {
					model: 'venue',
					name: '',
					differentiator: '',
					errors: {}
				},
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

	describe('GET list endpoint', () => {

		const MEASURE_FOR_MEASURE_NATIONAL_PRODUCTION_UUID = '0';
		const NATIONAL_THEATRE_VENUE_UUID = '2';
		const HAMLET_NATIONAL_PRODUCTION_UUID = '3';
		const MEASURE_FOR_MEASURE_ALMEIDA_PRODUCTION_UUID = '6';
		const ALMEIDA_THEATRE_VENUE_UUID = '8';
		const HAMLET_ALMEIDA_PRODUCTION_UUID = '9';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Measure for Measure',
					startDate: '2004-05-18',
					pressDate: '2004-05-27',
					endDate: '2006-03-18',
					venue: {
						name: 'National Theatre'
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
					name: 'Measure for Measure',
					startDate: '2010-02-12',
					pressDate: '2010-02-18',
					endDate: '2010-04-10',
					venue: {
						name: 'Almeida Theatre'
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

		it('lists all productions ordered by name then venue name', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
				{
					model: 'production',
					uuid: HAMLET_ALMEIDA_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2017-06-09',
					endDate: '2017-09-02',
					venue: {
						model: 'venue',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					}
				},
				{
					model: 'production',
					uuid: HAMLET_NATIONAL_PRODUCTION_UUID,
					name: 'Hamlet',
					startDate: '2010-09-30',
					endDate: '2011-01-26',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					}
				},
				{
					model: 'production',
					uuid: MEASURE_FOR_MEASURE_ALMEIDA_PRODUCTION_UUID,
					name: 'Measure for Measure',
					startDate: '2010-02-12',
					endDate: '2010-04-10',
					venue: {
						model: 'venue',
						uuid: ALMEIDA_THEATRE_VENUE_UUID,
						name: 'Almeida Theatre',
						surVenue: null
					}
				},
				{
					model: 'production',
					uuid: MEASURE_FOR_MEASURE_NATIONAL_PRODUCTION_UUID,
					name: 'Measure for Measure',
					startDate: '2004-05-18',
					endDate: '2006-03-18',
					venue: {
						model: 'venue',
						uuid: NATIONAL_THEATRE_VENUE_UUID,
						name: 'National Theatre',
						surVenue: null
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

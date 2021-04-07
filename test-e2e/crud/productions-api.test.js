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
				name: '',
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
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
						creativeEntities: [
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
						crewEntities: [
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
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
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
						creativeEntities: [
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
						crewEntities: [
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
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
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
						creativeEntities: [
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
						crewEntities: [
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
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
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
						creativeEntities: [
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
						crewEntities: [
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
				material: null,
				theatre: null,
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
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
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
		const NATIONAL_THEATRE_UUID = '2';
		const RORY_KINNEAR_PERSON_UUID = '3';
		const JAMES_LAURENSON_PERSON_UUID = '4';
		const MICHAEL_SHELDON_PERSON_UUID = '5';
		const LEO_STAAR_PERSON_UUID = '6';
		const NICHOLAS_HYTNER_PERSON_UUID = '7';
		const HANDSPRING_PUPPET_COMPANY_UUID = '8';
		const BEN_RINGHAM_PERSON_UUID = '9';
		const MAX_RINGHAM_PERSON_UUID = '10';
		const FIFTY_NINE_PRODUCTIONS_COMPANY_UUID = '11';
		const LEO_WARNER_PERSON_UUID = '12';
		const MARK_GRIMMER_PERSON_UUID = '13';
		const IGOR_PERSON_UUID = '14';
		const CREW_DEPUTIES_LTD_COMPANY_UUID = '15';
		const SARA_GUNTER_PERSON_UUID = '16';
		const JULIA_WICKHAM_PERSON_UUID = '17';
		const CREW_ASSISTANTS_LTD_COMPANY_UUID = '18';
		const MOLLY_EINCHCOMB_PERSON_UUID = '19';
		const MATTHEW_HELLYER_PERSON_UUID = '20';
		const THE_TRAGEDY_OF_KING_RICHARD_III_MATERIAL_UUID = '21';
		const ALMEIDA_THEATRE_UUID = '22';
		const RALPH_FIENNES_PERSON_UUID = '23';
		const TOM_CANTON_PERSON_UUID = '24';
		const MARK_HADFIELD_PERSON_UUID = '25';
		const JOSH_COLLINS_PERSON_UUID = '26';
		const RUPERT_GOOLD_PERSON_UUID = '27';
		const RC_ANNIE_LTD_COMPANY_UUID = '28';
		const HILDEGARD_BECHTLER_PERSON_UUID = '29';
		const CHLOE_LAMFORD_PERSON_UUID = '30';
		const AUTOGRAPH_COMPANY_UUID = '31';
		const ANDREW_BRUCE_PERSON_UUID = '32';
		const NICK_LIDSTER_PERSON_UUID = '33';
		const ANNA_ANDERSON_PERSON_UUID = '34';
		const DEPUTY_STAGE_MANAGERS_LTD_COMPANY_UUID = '35';
		const CHERYL_FIRTH_PERSON_UUID = '36';
		const TOM_LEGGAT_PERSON_UUID = '37';
		const DESIGN_ASSISTANTS_LTD_COMPANY_UUID = '38';
		const COLIN_FALCONER_PERSON_UUID = '39';
		const ALEX_LOWDE_PERSON_UUID = '40';

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
					material: {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						differentiator: '1'
					},
					theatre: {
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
					creativeCredits: [
						{
							name: 'Director',
							creativeEntities: [
								{
									name: 'Nicholas Hytner',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Designers',
							creativeEntities: [
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
							creativeEntities: [
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
							creativeEntities: [
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
							creativeEntities: [
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
							crewEntities: [
								{
									name: 'Igor',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'Deputy Stage Managers',
							crewEntities: [
								{
									model: 'company',
									name: 'Crew Deputies Ltd',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Assistant Stage Managers',
							crewEntities: [
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
							crewEntities: [
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
							crewEntities: [
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
				errors: {},
				material: {
					model: 'material',
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					differentiator: '1',
					errors: {}
				},
				theatre: {
					model: 'theatre',
					name: 'National Theatre',
					differentiator: '1',
					errors: {}
				},
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
				material: {
					model: 'material',
					uuid: THE_TRAGEDY_OF_HAMLET_PRINCE_OF_DENMARK_MATERIAL_UUID,
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					format: null,
					writingCredits: []
				},
				theatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre',
					surTheatre: null
				},
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
				errors: {},
				material: {
					model: 'material',
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					differentiator: '1',
					errors: {}
				},
				theatre: {
					model: 'theatre',
					name: 'National Theatre',
					differentiator: '1',
					errors: {}
				},
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
					material: {
						name: 'The Tragedy of King Richard III',
						differentiator: '1'
					},
					theatre: {
						name: 'Almeida Theatre',
						differentiator: '1'
					},
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
							creativeEntities: [
								{
									name: 'Rupert Goold',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'Fight Directors',
							creativeEntities: [
								{
									model: 'company',
									name: 'RC-Annie',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Designers',
							creativeEntities: [
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
							creativeEntities: [
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
							creativeEntities: [
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
							crewEntities: [
								{
									name: 'Anna Anderson',
									differentiator: '1'
								}
							]
						},
						// Contrivance for purposes of test.
						{
							name: 'Deputy Stage Managers',
							crewEntities: [
								{
									model: 'company',
									name: 'Deputy Stage Managers Ltd',
									differentiator: '1'
								}
							]
						},
						{
							name: 'Assistant Stage Managers',
							crewEntities: [
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
							crewEntities: [
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
							crewEntities: [
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
				errors: {},
				material: {
					model: 'material',
					name: 'The Tragedy of King Richard III',
					differentiator: '1',
					errors: {}
				},
				theatre: {
					model: 'theatre',
					name: 'Almeida Theatre',
					differentiator: '1',
					errors: {}
				},
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
				material: {
					model: 'material',
					uuid: THE_TRAGEDY_OF_KING_RICHARD_III_MATERIAL_UUID,
					name: 'The Tragedy of King Richard III',
					format: null,
					writingCredits: []
				},
				theatre: {
					model: 'theatre',
					uuid: ALMEIDA_THEATRE_UUID,
					name: 'Almeida Theatre',
					surTheatre: null
				},
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						creativeEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
						crewEntities: [
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
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
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
						creativeEntities: [
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
						crewEntities: [
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
				errors: {},
				material: {
					model: 'material',
					name: '',
					differentiator: '',
					errors: {}
				},
				theatre: {
					model: 'theatre',
					name: '',
					differentiator: '',
					errors: {}
				},
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
		const NATIONAL_THEATRE_UUID = '2';
		const HAMLET_NATIONAL_PRODUCTION_UUID = '3';
		const MEASURE_FOR_MEASURE_ALMEIDA_PRODUCTION_UUID = '6';
		const ALMEIDA_THEATRE_UUID = '8';
		const HAMLET_ALMEIDA_PRODUCTION_UUID = '9';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Measure for Measure',
					theatre: {
						name: 'National Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					theatre: {
						name: 'National Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Measure for Measure',
					theatre: {
						name: 'Almeida Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					theatre: {
						name: 'Almeida Theatre'
					}
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all productions ordered by name then theatre name', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
				{
					model: 'production',
					uuid: HAMLET_ALMEIDA_PRODUCTION_UUID,
					name: 'Hamlet',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					}
				},
				{
					model: 'production',
					uuid: HAMLET_NATIONAL_PRODUCTION_UUID,
					name: 'Hamlet',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					}
				},
				{
					model: 'production',
					uuid: MEASURE_FOR_MEASURE_ALMEIDA_PRODUCTION_UUID,
					name: 'Measure for Measure',
					theatre: {
						model: 'theatre',
						uuid: ALMEIDA_THEATRE_UUID,
						name: 'Almeida Theatre',
						surTheatre: null
					}
				},
				{
					model: 'production',
					uuid: MEASURE_FOR_MEASURE_NATIONAL_PRODUCTION_UUID,
					name: 'Measure for Measure',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

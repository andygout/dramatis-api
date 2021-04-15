import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Productions with creative team', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_UUID = '4';
	const OLIVIER_THEATRE_UUID = '5';
	const LYTTELTON_THEATRE_UUID = '6';
	const COTTESLOE_THEATRE_UUID = '7';
	const JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID = '8';
	const BARBICAN_THEATRE_UUID = '10';
	const DEBORAH_WARNER_PERSON_UUID = '11';
	const AUTOGRAPH_COMPANY_UUID = '12';
	const MESMER_COMPANY_UUID = '13';
	const DICK_STRAKER_PERSON_UUID = '14';
	const IAN_WILLIAM_GALLOWAY_PERSON_UUID = '15';
	const JOHN_O_CONNELL_PERSON_UUID = '16';
	const AKHILA_KIRSHNAN_PERSON_UUID = '17';
	const CINELUMA_COMPANY_UUID = '18';
	const FIFTY_NINE_PRODUCTIONS_COMPANY_UUID = '19';
	const LEO_WARNER_PERSON_UUID = '20';
	const MARK_GRIMMER_PERSON_UUID = '21';
	const LYSANDER_ASHTON_PERSON_UUID = '22';
	const NINA_DUNN_PERSON_UUID = '23';
	const MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID = '24';
	const DANIEL_DENTON_PERSON_UUID = '33';
	const ANNA_JAMESON_PERSON_UUID = '36';
	const HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID = '40';
	const BARBORA_ŠENOLTOVÁ_PERSON_UUID = '50';
	const RICHARD_SLANEY_PERSON_UUID = '54';
	const RICHARD_II_COTTESLOE_PRODUCTION_UUID = '56';

	let juliusCaesarBarbicanProduction;
	let motherCourageAndHerChildrenOlivierProduction;
	let happyDaysLytteltonProduction;
	let richardIICottesloeProduction;
	let deborahWarnerPerson;
	let ninaDunnPerson;
	let leoWarnerPerson;
	let annaJamesonPerson;
	let autographCompany;
	let mesmerCompany;
	let fiftyNineProductionsCompany;

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
				name: 'Julius Caesar',
				theatre: {
					name: 'Barbican Theatre'
				},
				creativeCredits: [
					{
						name: 'Director',
						entities: [
							{
								name: 'Deborah Warner'
							}
						]
					},
					// Contrivance for purposes of testing company with multiple creative credits for same production.
					{
						name: 'Designer',
						entities: [
							{
								model: 'company',
								name: 'Autograph'
							}
						]
					},
					{
						name: 'Sound Designer',
						entities: [
							{
								model: 'company',
								name: 'Autograph'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Video Designers',
						entities: [
							{
								model: 'company',
								name: 'Mesmer',
								creditedMembers: [
									{
										name: 'Dick Straker'
									},
									{
										name: 'Ian William Galloway'
									},
									{
										name: 'John O\'Connell'
									}
								]
							},
							{
								name: 'Akhila Krishnan'
							},
							{
								model: 'company',
								name: 'Cineluma'
							},
							{
								model: 'company',
								name: '59 Productions',
								creditedMembers: [
									{
										name: 'Leo Warner'
									},
									{
										name: 'Mark Grimmer'
									},
									{
										name: 'Lysander Ashton'
									}
								]
							},
							{
								name: 'Nina Dunn'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mother Courage and Her Children',
				theatre: {
					name: 'Olivier Theatre'
				},
				creativeCredits: [
					{
						name: 'Directed by',
						entities: [
							{
								name: 'Deborah Warner'
							}
						]
					},
					// Contrivance for purposes of testing company and credited member with multiple creative credits for same production.
					{
						name: 'Design by',
						entities: [
							{
								model: 'company',
								name: '59 Productions',
								creditedMembers: [
									{
										name: 'Leo Warner'
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Sound Design by',
						entities: [
							{
								model: 'company',
								name: 'Autograph'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Video Design by',
						entities: [
							{
								name: 'Nina Dunn'
							},
							{
								model: 'company',
								name: 'Mesmer',
								creditedMembers: [
									{
										name: 'Daniel Denton'
									},
									{
										name: 'Dick Straker'
									},
									{
										name: 'Ian William Galloway'
									}
								]
							},
							{
								model: 'company',
								name: '59 Productions',
								creditedMembers: [
									{
										name: 'Anna Jameson'
									},
									{
										name: 'Leo Warner'
									},
									{
										name: 'Mark Grimmer'
									}
								]
							},
							{
								model: 'company',
								name: 'Cineluma'
							},
							{
								name: 'Akhila Krishnan'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Happy Days',
				theatre: {
					name: 'Lyttelton Theatre'
				},
				creativeCredits: [
					{
						name: 'Direction',
						entities: [
							{
								name: 'Deborah Warner'
							}
						]
					},
					// Contrivance for purposes of testing person with multiple creative credits for same production.
					{
						name: 'Design',
						entities: [
							{
								name: 'Nina Dunn'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Sound Design',
						entities: [
							{
								model: 'company',
								name: 'Autograph'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Video Design',
						entities: [
							{
								model: 'company',
								name: 'Cineluma'
							},
							{
								name: 'Akhila Krishnan'
							},
							{
								model: 'company',
								name: 'Mesmer',
								creditedMembers: [
									{
										name: 'Dick Straker'
									},
									{
										name: 'Barbora Šenoltová'
									},
									{
										name: 'Ian William Galloway'
									}
								]
							},
							{
								name: 'Nina Dunn'
							},
							{
								model: 'company',
								name: '59 Productions',
								creditedMembers: [
									{
										name: 'Leo Warner'
									},
									{
										name: 'Richard Slaney'
									},
									{
										name: 'Mark Grimmer'
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
				name: 'Richard II',
				theatre: {
					name: 'Cottesloe Theatre'
				},
				creativeCredits: [
					// Contrivance for purposes of test.
					{
						name: 'Video Design by',
						entities: [
							{
								name: 'Nina Dunn'
							},
							{
								model: 'company',
								name: 'Mesmer',
								creditedMembers: [
									{
										name: 'Daniel Denton'
									},
									{
										name: 'Dick Straker'
									},
									{
										name: 'Ian William Galloway'
									}
								]
							},
							{
								model: 'company',
								name: '59 Productions',
								creditedMembers: [
									{
										name: 'Lysander Ashton'
									},
									{
										name: 'Leo Warner'
									},
									{
										name: 'Mark Grimmer'
									}
								]
							},
							{
								model: 'company',
								name: 'Cineluma'
							},
							{
								name: 'Akhila Krishnan'
							}
						]
					}
				]
			});

		juliusCaesarBarbicanProduction = await chai.request(app)
			.get(`/productions/${JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID}`);

		motherCourageAndHerChildrenOlivierProduction = await chai.request(app)
			.get(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID}`);

		happyDaysLytteltonProduction = await chai.request(app)
			.get(`/productions/${HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID}`);

		richardIICottesloeProduction = await chai.request(app)
			.get(`/productions/${RICHARD_II_COTTESLOE_PRODUCTION_UUID}`);

		deborahWarnerPerson = await chai.request(app)
			.get(`/people/${DEBORAH_WARNER_PERSON_UUID}`);

		ninaDunnPerson = await chai.request(app)
			.get(`/people/${NINA_DUNN_PERSON_UUID}`);

		leoWarnerPerson = await chai.request(app)
			.get(`/people/${LEO_WARNER_PERSON_UUID}`);

		annaJamesonPerson = await chai.request(app)
			.get(`/people/${ANNA_JAMESON_PERSON_UUID}`);

		autographCompany = await chai.request(app)
			.get(`/companies/${AUTOGRAPH_COMPANY_UUID}`);

		mesmerCompany = await chai.request(app)
			.get(`/companies/${MESMER_COMPANY_UUID}`);

		fiftyNineProductionsCompany = await chai.request(app)
			.get(`/companies/${FIFTY_NINE_PRODUCTIONS_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Julius Caesar at Barbican Theatre (production)', () => {

		it('includes creative team credits', () => {

			const expectedCreativeCredits = [
				{
					model: 'creativeCredit',
					name: 'Director',
					entities: [
						{
							model: 'person',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Designer',
					entities: [
						{
							model: 'company',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							creditedMembers: []
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Sound Designer',
					entities: [
						{
							model: 'company',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							creditedMembers: []
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Video Designers',
					entities: [
						{
							model: 'company',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							creditedMembers: [
								{
									model: 'person',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'person',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								},
								{
									model: 'person',
									uuid: JOHN_O_CONNELL_PERSON_UUID,
									name: 'John O\'Connell'
								}
							]
						},
						{
							model: 'person',
							uuid: AKHILA_KIRSHNAN_PERSON_UUID,
							name: 'Akhila Krishnan'
						},
						{
							model: 'company',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							creditedMembers: []
						},
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
								},
								{
									model: 'person',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								}
							]
						},
						{
							model: 'person',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						}
					]
				}
			];

			const { creativeCredits } = juliusCaesarBarbicanProduction.body;

			expect(creativeCredits).to.deep.equal(expectedCreativeCredits);

		});

	});

	describe('Mother Courage and Her Children at Olivier Theatre (production)', () => {

		it('includes creative team credits', () => {

			const expectedCreativeCredits = [
				{
					model: 'creativeCredit',
					name: 'Directed by',
					entities: [
						{
							model: 'person',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Design by',
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
				},
				{
					model: 'creativeCredit',
					name: 'Sound Design by',
					entities: [
						{
							model: 'company',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							creditedMembers: []
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Video Design by',
					entities: [
						{
							model: 'person',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						},
						{
							model: 'company',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							creditedMembers: [
								{
									model: 'person',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'person',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'person',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							]
						},
						{
							model: 'company',
							uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
							name: '59 Productions',
							creditedMembers: [
								{
									model: 'person',
									uuid: ANNA_JAMESON_PERSON_UUID,
									name: 'Anna Jameson'
								},
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
						},
						{
							model: 'company',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							creditedMembers: []
						},
						{
							model: 'person',
							uuid: AKHILA_KIRSHNAN_PERSON_UUID,
							name: 'Akhila Krishnan'
						}
					]
				}
			];

			const { creativeCredits } = motherCourageAndHerChildrenOlivierProduction.body;

			expect(creativeCredits).to.deep.equal(expectedCreativeCredits);

		});

	});

	describe('Happy Days at Lyttelton Theatre (production)', () => {

		it('includes creative team credits', () => {

			const expectedCreativeCredits = [
				{
					model: 'creativeCredit',
					name: 'Direction',
					entities: [
						{
							model: 'person',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Design',
					entities: [
						{
							model: 'person',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Sound Design',
					entities: [
						{
							model: 'company',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							creditedMembers: []
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Video Design',
					entities: [
						{
							model: 'company',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							creditedMembers: []
						},
						{
							model: 'person',
							uuid: AKHILA_KIRSHNAN_PERSON_UUID,
							name: 'Akhila Krishnan'
						},
						{
							model: 'company',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							creditedMembers: [
								{
									model: 'person',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'person',
									uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
									name: 'Barbora Šenoltová'
								},
								{
									model: 'person',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							]
						},
						{
							model: 'person',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						},
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
									uuid: RICHARD_SLANEY_PERSON_UUID,
									name: 'Richard Slaney'
								},
								{
									model: 'person',
									uuid: MARK_GRIMMER_PERSON_UUID,
									name: 'Mark Grimmer'
								}
							]
						}
					]
				}
			];

			const { creativeCredits } = happyDaysLytteltonProduction.body;

			expect(creativeCredits).to.deep.equal(expectedCreativeCredits);

		});

	});

	describe('Richard II at Cottesloe Theatre (production)', () => {

		it('includes creative team credits', () => {

			const expectedCreativeCredits = [
				{
					model: 'creativeCredit',
					name: 'Video Design by',
					entities: [
						{
							model: 'person',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						},
						{
							model: 'company',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							creditedMembers: [
								{
									model: 'person',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'person',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'person',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							]
						},
						{
							model: 'company',
							uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
							name: '59 Productions',
							creditedMembers: [
								{
									model: 'person',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								},
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
						},
						{
							model: 'company',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							creditedMembers: []
						},
						{
							model: 'person',
							uuid: AKHILA_KIRSHNAN_PERSON_UUID,
							name: 'Akhila Krishnan'
						}
					]
				}
			];

			const { creativeCredits } = richardIICottesloeProduction.body;

			expect(creativeCredits).to.deep.equal(expectedCreativeCredits);

		});

	});

	describe('Deborah Warner (person)', () => {

		it('includes productions for which they have a creative team credit', () => {

			const expectedCreativeProductions = [
				{
					model: 'production',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Direction',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican Theatre',
						surTheatre: null
					},
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Director',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Directed by',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						}
					]
				}
			];

			const { creativeProductions } = deborahWarnerPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Nina Dunn (person)', () => {

		it('includes productions for which they have a creative team credit, included co-credited entities', () => {

			const expectedCreativeProductions = [
				{
					model: 'production',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Design',
							creditedEmployerCompany: null,
							coCreditedEntities: []
						},
						{
							model: 'creativeCredit',
							name: 'Video Design',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
											name: 'Barbora Šenoltová'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
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
											uuid: RICHARD_SLANEY_PERSON_UUID,
											name: 'Richard Slaney'
										},
										{
											model: 'person',
											uuid: MARK_GRIMMER_PERSON_UUID,
											name: 'Mark Grimmer'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican Theatre',
						surTheatre: null
					},
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Designers',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										},
										{
											model: 'person',
											uuid: JOHN_O_CONNELL_PERSON_UUID,
											name: 'John O\'Connell'
										}
									]
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
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
										},
										{
											model: 'person',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Design by',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'company',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: ANNA_JAMESON_PERSON_UUID,
											name: 'Anna Jameson'
										},
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
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Design by',
							creditedEmployerCompany: null,
							coCreditedEntities: [
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'company',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										},
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
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = ninaDunnPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Leo Warner (person)', () => {

		it('includes productions for which they have a creative team credit, included co-credited entities', () => {

			const expectedCreativeProductions = [
				{
					model: 'production',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Design',
							creditedEmployerCompany: {
								model: 'company',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coCreditedMembers: [
									{
										model: 'person',
										uuid: RICHARD_SLANEY_PERSON_UUID,
										name: 'Richard Slaney'
									},
									{
										model: 'person',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
											name: 'Barbora Šenoltová'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican Theatre',
						surTheatre: null
					},
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Designers',
							creditedEmployerCompany: {
								model: 'company',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coCreditedMembers: [
									{
										model: 'person',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									},
									{
										model: 'person',
										uuid: LYSANDER_ASHTON_PERSON_UUID,
										name: 'Lysander Ashton'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										},
										{
											model: 'person',
											uuid: JOHN_O_CONNELL_PERSON_UUID,
											name: 'John O\'Connell'
										}
									]
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Design by',
							creditedEmployerCompany: {
								model: 'company',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coCreditedMembers: []
							},
							coCreditedEntities: []
						},
						{
							model: 'creativeCredit',
							name: 'Video Design by',
							creditedEmployerCompany: {
								model: 'company',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coCreditedMembers: [
									{
										model: 'person',
										uuid: ANNA_JAMESON_PERSON_UUID,
										name: 'Anna Jameson'
									},
									{
										model: 'person',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Design by',
							creditedEmployerCompany: {
								model: 'company',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coCreditedMembers: [
									{
										model: 'person',
										uuid: LYSANDER_ASHTON_PERSON_UUID,
										name: 'Lysander Ashton'
									},
									{
										model: 'person',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							},
							coCreditedEntities: [
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = leoWarnerPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Anna Jameson (person)', () => {

		it('includes productions for which they have a creative team credit, included co-credited entities', () => {

			const expectedCreativeProductions = [
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Design by',
							creditedEmployerCompany: {
								model: 'company',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coCreditedMembers: [
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
							},
							coCreditedEntities: [
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = annaJamesonPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Autograph (company)', () => {

		it('includes productions for which they have a creative team credit', () => {

			const expectedCreativeProductions = [
				{
					model: 'production',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							creditedMembers: [],
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican Theatre',
						surTheatre: null
					},
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Designer',
							creditedMembers: [],
							coCreditedEntities: []
						},
						{
							model: 'creativeCredit',
							name: 'Sound Designer',
							creditedMembers: [],
							coCreditedEntities: []
						}
					]
				},
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design by',
							creditedMembers: [],
							coCreditedEntities: []
						}
					]
				}
			];

			const { creativeProductions } = autographCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Mesmer (company)', () => {

		it('includes productions for which they have a creative team credit', () => {

			const expectedCreativeProductions = [
				{
					model: 'production',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Design',
							creditedMembers: [
								{
									model: 'person',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'person',
									uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
									name: 'Barbora Šenoltová'
								},
								{
									model: 'person',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							],
							coCreditedEntities: [
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
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
											uuid: RICHARD_SLANEY_PERSON_UUID,
											name: 'Richard Slaney'
										},
										{
											model: 'person',
											uuid: MARK_GRIMMER_PERSON_UUID,
											name: 'Mark Grimmer'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican Theatre',
						surTheatre: null
					},
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Designers',
							creditedMembers: [
								{
									model: 'person',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'person',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								},
								{
									model: 'person',
									uuid: JOHN_O_CONNELL_PERSON_UUID,
									name: 'John O\'Connell'
								}
							],
							coCreditedEntities: [
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
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
										},
										{
											model: 'person',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										}
									]
								},
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Design by',
							creditedMembers: [
								{
									model: 'person',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'person',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'person',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							],
							coCreditedEntities: [
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'company',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: ANNA_JAMESON_PERSON_UUID,
											name: 'Anna Jameson'
										},
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
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Design by',
							creditedMembers: [
								{
									model: 'person',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'person',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'person',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							],
							coCreditedEntities: [
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'company',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									creditedMembers: [
										{
											model: 'person',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										},
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
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = mesmerCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('59 Productions (company)', () => {

		it('includes productions for which they have a creative team credit, included co-credited entities', () => {

			const expectedCreativeProductions = [
				{
					model: 'production',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Design',
							creditedMembers: [
								{
									model: 'person',
									uuid: LEO_WARNER_PERSON_UUID,
									name: 'Leo Warner'
								},
								{
									model: 'person',
									uuid: RICHARD_SLANEY_PERSON_UUID,
									name: 'Richard Slaney'
								},
								{
									model: 'person',
									uuid: MARK_GRIMMER_PERSON_UUID,
									name: 'Mark Grimmer'
								}
							],
							coCreditedEntities: [
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
											name: 'Barbora Šenoltová'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					theatre: {
						model: 'theatre',
						uuid: BARBICAN_THEATRE_UUID,
						name: 'Barbican Theatre',
						surTheatre: null
					},
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Designers',
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
								},
								{
									model: 'person',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								}
							],
							coCreditedEntities: [
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										},
										{
											model: 'person',
											uuid: JOHN_O_CONNELL_PERSON_UUID,
											name: 'John O\'Connell'
										}
									]
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Design by',
							creditedMembers: [
								{
									model: 'person',
									uuid: LEO_WARNER_PERSON_UUID,
									name: 'Leo Warner'
								}
							],
							coCreditedEntities: []
						},
						{
							model: 'creativeCredit',
							name: 'Video Design by',
							creditedMembers: [
								{
									model: 'person',
									uuid: ANNA_JAMESON_PERSON_UUID,
									name: 'Anna Jameson'
								},
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
							],
							coCreditedEntities: [
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'production',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
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
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Video Design by',
							creditedMembers: [
								{
									model: 'person',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								},
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
							],
							coCreditedEntities: [
								{
									model: 'person',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'company',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									creditedMembers: [
										{
											model: 'person',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'person',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'person',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'company',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									creditedMembers: []
								},
								{
									model: 'person',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = fiftyNineProductionsCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

});

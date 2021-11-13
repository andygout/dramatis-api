import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Productions with creative team', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_VENUE_UUID = '4';
	const OLIVIER_THEATRE_VENUE_UUID = '5';
	const LYTTELTON_THEATRE_VENUE_UUID = '6';
	const COTTESLOE_THEATRE_VENUE_UUID = '7';
	const JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID = '8';
	const BARBICAN_THEATRE_VENUE_UUID = '10';
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
				name: 'Julius Caesar',
				startDate: '2005-04-14',
				pressDate: '2005-04-20',
				endDate: '2005-05-14',
				venue: {
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
								model: 'COMPANY',
								name: 'Autograph'
							}
						]
					},
					{
						name: 'Sound Designer',
						entities: [
							{
								model: 'COMPANY',
								name: 'Autograph'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Video Designers',
						entities: [
							{
								model: 'COMPANY',
								name: 'Mesmer',
								members: [
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
								model: 'COMPANY',
								name: 'Cineluma'
							},
							{
								model: 'COMPANY',
								name: '59 Productions',
								members: [
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
				startDate: '2009-09-16',
				pressDate: '2009-09-25',
				endDate: '2009-12-08',
				venue: {
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
								model: 'COMPANY',
								name: '59 Productions',
								members: [
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
								model: 'COMPANY',
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
								model: 'COMPANY',
								name: 'Mesmer',
								members: [
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
								model: 'COMPANY',
								name: '59 Productions',
								members: [
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
								model: 'COMPANY',
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
				startDate: '2007-01-18',
				pressDate: '2007-01-25',
				endDate: '2007-03-01',
				venue: {
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
								model: 'COMPANY',
								name: 'Autograph'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Video Design',
						entities: [
							{
								model: 'COMPANY',
								name: 'Cineluma'
							},
							{
								name: 'Akhila Krishnan'
							},
							{
								model: 'COMPANY',
								name: 'Mesmer',
								members: [
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
								model: 'COMPANY',
								name: '59 Productions',
								members: [
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
				startDate: '1995-05-26',
				pressDate: '1995-06-02',
				endDate: '1996-02-17',
				venue: {
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
								model: 'COMPANY',
								name: 'Mesmer',
								members: [
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
								model: 'COMPANY',
								name: '59 Productions',
								members: [
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
								model: 'COMPANY',
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
					model: 'CREATIVE_CREDIT',
					name: 'Director',
					entities: [
						{
							model: 'PERSON',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Designer',
					entities: [
						{
							model: 'COMPANY',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							members: []
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Sound Designer',
					entities: [
						{
							model: 'COMPANY',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							members: []
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Video Designers',
					entities: [
						{
							model: 'COMPANY',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							members: [
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								},
								{
									model: 'PERSON',
									uuid: JOHN_O_CONNELL_PERSON_UUID,
									name: 'John O\'Connell'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: AKHILA_KIRSHNAN_PERSON_UUID,
							name: 'Akhila Krishnan'
						},
						{
							model: 'COMPANY',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							members: []
						},
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
								},
								{
									model: 'PERSON',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								}
							]
						},
						{
							model: 'PERSON',
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
					model: 'CREATIVE_CREDIT',
					name: 'Directed by',
					entities: [
						{
							model: 'PERSON',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Design by',
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
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Sound Design by',
					entities: [
						{
							model: 'COMPANY',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							members: []
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Video Design by',
					entities: [
						{
							model: 'PERSON',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						},
						{
							model: 'COMPANY',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							members: [
								{
									model: 'PERSON',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
							name: '59 Productions',
							members: [
								{
									model: 'PERSON',
									uuid: ANNA_JAMESON_PERSON_UUID,
									name: 'Anna Jameson'
								},
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
						},
						{
							model: 'COMPANY',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							members: []
						},
						{
							model: 'PERSON',
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
					model: 'CREATIVE_CREDIT',
					name: 'Direction',
					entities: [
						{
							model: 'PERSON',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Design',
					entities: [
						{
							model: 'PERSON',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Sound Design',
					entities: [
						{
							model: 'COMPANY',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph',
							members: []
						}
					]
				},
				{
					model: 'CREATIVE_CREDIT',
					name: 'Video Design',
					entities: [
						{
							model: 'COMPANY',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							members: []
						},
						{
							model: 'PERSON',
							uuid: AKHILA_KIRSHNAN_PERSON_UUID,
							name: 'Akhila Krishnan'
						},
						{
							model: 'COMPANY',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							members: [
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
									name: 'Barbora Šenoltová'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							]
						},
						{
							model: 'PERSON',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						},
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
									uuid: RICHARD_SLANEY_PERSON_UUID,
									name: 'Richard Slaney'
								},
								{
									model: 'PERSON',
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
					model: 'CREATIVE_CREDIT',
					name: 'Video Design by',
					entities: [
						{
							model: 'PERSON',
							uuid: NINA_DUNN_PERSON_UUID,
							name: 'Nina Dunn'
						},
						{
							model: 'COMPANY',
							uuid: MESMER_COMPANY_UUID,
							name: 'Mesmer',
							members: [
								{
									model: 'PERSON',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							]
						},
						{
							model: 'COMPANY',
							uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
							name: '59 Productions',
							members: [
								{
									model: 'PERSON',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								},
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
						},
						{
							model: 'COMPANY',
							uuid: CINELUMA_COMPANY_UUID,
							name: 'Cineluma',
							members: []
						},
						{
							model: 'PERSON',
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
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Directed by',
							employerCompany: null,
							coEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Direction',
							employerCompany: null,
							coEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Director',
							employerCompany: null,
							coEntities: []
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
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ANNA_JAMESON_PERSON_UUID,
											name: 'Anna Jameson'
										},
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
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Design',
							employerCompany: null,
							coEntities: []
						},
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
											name: 'Barbora Šenoltová'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
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
											uuid: RICHARD_SLANEY_PERSON_UUID,
											name: 'Richard Slaney'
										},
										{
											model: 'PERSON',
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
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										},
										{
											model: 'PERSON',
											uuid: JOHN_O_CONNELL_PERSON_UUID,
											name: 'John O\'Connell'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
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
										},
										{
											model: 'PERSON',
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
					model: 'PRODUCTION',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									members: [
										{
											model: 'PERSON',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										},
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
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
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
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Design by',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: []
							},
							coEntities: []
						},
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: [
									{
										model: 'PERSON',
										uuid: ANNA_JAMESON_PERSON_UUID,
										name: 'Anna Jameson'
									},
									{
										model: 'PERSON',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: [
									{
										model: 'PERSON',
										uuid: RICHARD_SLANEY_PERSON_UUID,
										name: 'Richard Slaney'
									},
									{
										model: 'PERSON',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							},
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
											name: 'Barbora Šenoltová'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: [
									{
										model: 'PERSON',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									},
									{
										model: 'PERSON',
										uuid: LYSANDER_ASHTON_PERSON_UUID,
										name: 'Lysander Ashton'
									}
								]
							},
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										},
										{
											model: 'PERSON',
											uuid: JOHN_O_CONNELL_PERSON_UUID,
											name: 'John O\'Connell'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: [
									{
										model: 'PERSON',
										uuid: LYSANDER_ASHTON_PERSON_UUID,
										name: 'Lysander Ashton'
									},
									{
										model: 'PERSON',
										uuid: MARK_GRIMMER_PERSON_UUID,
										name: 'Mark Grimmer'
									}
								]
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
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
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							employerCompany: {
								model: 'COMPANY',
								uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
								name: '59 Productions',
								coMembers: [
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
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
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
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Sound Design by',
							members: [],
							coEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Sound Design',
							members: [],
							coEntities: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Designer',
							members: [],
							coEntities: []
						},
						{
							model: 'CREATIVE_CREDIT',
							name: 'Sound Designer',
							members: [],
							coEntities: []
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
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							members: [
								{
									model: 'PERSON',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									members: [
										{
											model: 'PERSON',
											uuid: ANNA_JAMESON_PERSON_UUID,
											name: 'Anna Jameson'
										},
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
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design',
							members: [
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
									name: 'Barbora Šenoltová'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							],
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
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
											uuid: RICHARD_SLANEY_PERSON_UUID,
											name: 'Richard Slaney'
										},
										{
											model: 'PERSON',
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
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Designers',
							members: [
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								},
								{
									model: 'PERSON',
									uuid: JOHN_O_CONNELL_PERSON_UUID,
									name: 'John O\'Connell'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
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
										},
										{
											model: 'PERSON',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							members: [
								{
									model: 'PERSON',
									uuid: DANIEL_DENTON_PERSON_UUID,
									name: 'Daniel Denton'
								},
								{
									model: 'PERSON',
									uuid: DICK_STRAKER_PERSON_UUID,
									name: 'Dick Straker'
								},
								{
									model: 'PERSON',
									uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
									name: 'Ian William Galloway'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: FIFTY_NINE_PRODUCTIONS_COMPANY_UUID,
									name: '59 Productions',
									members: [
										{
											model: 'PERSON',
											uuid: LYSANDER_ASHTON_PERSON_UUID,
											name: 'Lysander Ashton'
										},
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
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
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
					model: 'PRODUCTION',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					startDate: '2009-09-16',
					endDate: '2009-12-08',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Design by',
							members: [
								{
									model: 'PERSON',
									uuid: LEO_WARNER_PERSON_UUID,
									name: 'Leo Warner'
								}
							],
							coEntities: []
						},
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							members: [
								{
									model: 'PERSON',
									uuid: ANNA_JAMESON_PERSON_UUID,
									name: 'Anna Jameson'
								},
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
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID,
					name: 'Happy Days',
					startDate: '2007-01-18',
					endDate: '2007-03-01',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design',
							members: [
								{
									model: 'PERSON',
									uuid: LEO_WARNER_PERSON_UUID,
									name: 'Leo Warner'
								},
								{
									model: 'PERSON',
									uuid: RICHARD_SLANEY_PERSON_UUID,
									name: 'Richard Slaney'
								},
								{
									model: 'PERSON',
									uuid: MARK_GRIMMER_PERSON_UUID,
									name: 'Mark Grimmer'
								}
							],
							coEntities: [
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: BARBORA_ŠENOLTOVÁ_PERSON_UUID,
											name: 'Barbora Šenoltová'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID,
					name: 'Julius Caesar',
					startDate: '2005-04-14',
					endDate: '2005-05-14',
					venue: {
						model: 'VENUE',
						uuid: BARBICAN_THEATRE_VENUE_UUID,
						name: 'Barbican Theatre',
						surVenue: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Designers',
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
								},
								{
									model: 'PERSON',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								}
							],
							coEntities: [
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										},
										{
											model: 'PERSON',
											uuid: JOHN_O_CONNELL_PERSON_UUID,
											name: 'John O\'Connell'
										}
									]
								},
								{
									model: 'PERSON',
									uuid: AKHILA_KIRSHNAN_PERSON_UUID,
									name: 'Akhila Krishnan'
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: RICHARD_II_COTTESLOE_PRODUCTION_UUID,
					name: 'Richard II',
					startDate: '1995-05-26',
					endDate: '1996-02-17',
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
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Video Design by',
							members: [
								{
									model: 'PERSON',
									uuid: LYSANDER_ASHTON_PERSON_UUID,
									name: 'Lysander Ashton'
								},
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
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: NINA_DUNN_PERSON_UUID,
									name: 'Nina Dunn'
								},
								{
									model: 'COMPANY',
									uuid: MESMER_COMPANY_UUID,
									name: 'Mesmer',
									members: [
										{
											model: 'PERSON',
											uuid: DANIEL_DENTON_PERSON_UUID,
											name: 'Daniel Denton'
										},
										{
											model: 'PERSON',
											uuid: DICK_STRAKER_PERSON_UUID,
											name: 'Dick Straker'
										},
										{
											model: 'PERSON',
											uuid: IAN_WILLIAM_GALLOWAY_PERSON_UUID,
											name: 'Ian William Galloway'
										}
									]
								},
								{
									model: 'COMPANY',
									uuid: CINELUMA_COMPANY_UUID,
									name: 'Cineluma',
									members: []
								},
								{
									model: 'PERSON',
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

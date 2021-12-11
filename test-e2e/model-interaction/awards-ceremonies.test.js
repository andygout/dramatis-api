import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Award ceremonies', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_VENUE_UUID = '4';
	const OLIVIER_THEATRE_VENUE_UUID = '5';
	const LYTTELTON_THEATRE_VENUE_UUID = '6';
	const DORFMAN_THEATRE_VENUE_UUID = '7';
	const THE_LEHMAN_TRILOGY_LYTTELTON_PRODUCTION_UUID = '12';
	const KING_LEAR_DUKE_OF_YORKS_PRODUCTION_UUID = '15';
	const THE_INHERITANCE_YOUNG_VIC_MAIN_HOUSE_PRODUCTION_UUID = '18';
	const THE_INHERITANCE_NOËL_COWARD_PRODUCTION_UUID = '21';
	const NOËL_COWARD_THEATRE_VENUE_UUID = '23';
	const PRESENT_LAUGHTER_OLD_VIC_PRODUCTION_UUID = '24';
	const OLD_VIC_THEATRE_VENUE_UUID = '26';
	const UNCLE_VANYA_HAROLD_PINTER_PRODUCTION_UUID = '27';
	const HAROLD_PINTER_THEATRE_VENUE_UUID = '29';
	const DEATH_OF_A_SALESMAN_YOUNG_VIC_MAIN_HOUSE_PRODUCTION_UUID = '30';
	const DEATH_OF_A_SALESMAN_PICCADILLY_PRODUCTION_UUID = '33';
	const GARPLY_LYTTELTON_PRODUCTION_UUID = '36';
	const GARPLY_WYNDHAMS_PRODUCTION_UUID = '39';
	const WYNDHAMS_THEATRE_VENUE_UUID = '41';
	const PLUGH_PLAYHOUSE_PRODUCTION_UUID = '42';
	const PLAYHOUSE_THEATRE_VENUE_UUID = '44';
	const FRED_OLD_VIC_PRODUCTION_UUID = '45';
	const WALDO_DORFMAN_PRODUCTION_UUID = '48';
	const WALDO_NOËL_COWARD_PRODUCTION_UUID = '51';
	const NETWORK_LYTTELTON_PRODUCTION_UUID = '54';
	const ANGELS_IN_AMERICA_LYTTELTON_PRODUCTION_UUID = '57';
	const HAMLET_ALMEIDA_PRODUCTION_UUID = '60';
	const ALMEIDA_THEATRE_VENUE_UUID = '62';
	const PIYO_HAROLD_PINTER_PRODUCTION_UUID = '63';
	const XYZZY_DORFMAN_PRODUCTION_UUID = '66';
	const XYZZY_PLAYHOUSE_PRODUCTION_UUID = '69';
	const WIBBLE_OLD_VIC_PRODUCTION_UUID = '72';
	const WIBBLE_WYNDHAMS_PRODUCTION_UUID = '75';
	const HOGE_ALMEIDA_PRODUCTION_UUID = '78';
	const THUD_DUKE_OF_YORKS_PRODUCTION_UUID = '81';
	const ANTONY_AND_CLEOPATRA_OLIVIER_PRODUCTION_UUID = '84';
	const TOTO_NOËL_COWARD_PRODUCTION_UUID = '87';
	const FUGA_OLIVIER_PRODUCTION_UUID = '90';
	const TUTU_PLAYHOUSE_PRODUCTION_UUID = '93';
	const DOWNSTATE_DORFMAN_PRODUCTION_UUID = '96';
	const GRAULT_ALMEIDA_PRODUCTION_UUID = '99';
	const INK_ALMEIDA_PRODUCTION_UUID = '102';
	const INK_DUKE_OF_YORKS_PRODUCTION_UUID = '105';
	const HAMLET_HAROLD_PINTER_PRODUCTION_UUID = '108';
	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '118';
	const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '119';
	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = '143';
	const JOHN_DOE_PERSON_UUID = '148';
	const CURTAIN_UP_LTD_COMPANY_UUID = '149';
	const JANE_ROE_PERSON_UUID = '150';
	const STAGECRAFT_LTD_COMPANY_UUID = '151';
	const FERDINAND_FOO_PERSON_UUID = '152';
	const BEATRICE_BAR_PERSON_UUID = '153';
	const BRANDON_BAZ_PERSON_UUID = '154';
	const THEATRICALS_LTD_COMPANY_UUID = '155';
	const QUINCY_QUX_PERSON_UUID = '156';
	const CLARA_QUUX_PERSON_UUID = '157';
	const CHRISTIAN_QUUZ_PERSON_UUID = '158';
	const CONOR_CORGE_PERSON_UUID = '159';
	const BACKSTAGE_LTD_COMPANY_UUID = '160';
	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '179';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '211';
	const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '212';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '236';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID = '265';
	const CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '299';
	const CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID = '300';

	let laurenceOlivierAwardsAward;
	let eveningStandardTheatreAwardsAward;
	let johnDoePerson;
	let curtainUpCompany;
	let conorCorgePerson;
	let stagecraftLtdCompany;
	let quincyQuxPerson;
	let garplyLytteltonProduction;
	let xyzzyPlayhouseProduction;

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
							name: 'Dorfman Theatre'
						}
					]
				});

			await chai.request(app)
				.post('/venues')
				.send({
					name: 'Young Vic Theatre',
					subVenues: [
						{
							name: 'Main House'
						}
					]
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'The Lehman Trilogy',
					startDate: '2018-07-04',
					endDate: '2018-10-20',
					venue: {
						name: 'Lyttelton Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'King Lear',
					startDate: '2018-07-11',
					endDate: '2018-11-03',
					venue: {
						name: 'Duke of York\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'The Inheritance',
					startDate: '2018-03-02',
					endDate: '2018-05-19',
					venue: {
						name: 'Main House'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'The Inheritance',
					startDate: '2018-09-21',
					endDate: '2019-01-25',
					venue: {
						name: 'Noël Coward Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Present Laughter',
					startDate: '2019-06-17',
					endDate: '2019-08-10',
					venue: {
						name: 'Old Vic Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Uncle Vanya',
					startDate: '2020-01-14',
					endDate: '2020-03-16',
					venue: {
						name: 'Harold Pinter Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Death of a Salesman',
					startDate: '2019-05-01',
					endDate: '2019-07-13',
					venue: {
						name: 'Main House'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Death of a Salesman',
					startDate: '2019-10-24',
					endDate: '2020-01-04',
					venue: {
						name: 'Piccadilly Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Garply',
					startDate: '2019-06-01',
					endDate: '2019-06-30',
					venue: {
						name: 'Lyttelton Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Garply',
					startDate: '2019-07-01',
					endDate: '2019-07-31',
					venue: {
						name: 'Wyndham\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Plugh',
					startDate: '2019-08-01',
					endDate: '2019-08-31',
					venue: {
						name: 'Playhouse Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Fred',
					startDate: '2019-09-01',
					endDate: '2019-09-30',
					venue: {
						name: 'Old Vic Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Waldo',
					startDate: '2019-10-01',
					endDate: '2019-10-31',
					venue: {
						name: 'Dorfman Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Waldo',
					startDate: '2019-11-01',
					endDate: '2019-11-30',
					venue: {
						name: 'Noël Coward Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Network',
					startDate: '2017-11-04',
					endDate: '2018-03-24',
					venue: {
						name: 'Lyttelton Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Angels in America',
					startDate: '2017-04-11',
					endDate: '2017-08-19',
					venue: {
						name: 'Lyttelton Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					startDate: '2017-02-17',
					endDate: '2017-04-15',
					venue: {
						name: 'Almeida Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Piyo',
					startDate: '2017-05-01',
					endDate: '2017-05-31',
					venue: {
						name: 'Harold Pinter Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Xyzzy',
					startDate: '2017-06-01',
					endDate: '2017-06-30',
					venue: {
						name: 'Dorfman Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Xyzzy',
					startDate: '2017-07-01',
					endDate: '2017-07-31',
					venue: {
						name: 'Playhouse Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Wibble',
					startDate: '2017-08-01',
					endDate: '2017-08-31',
					venue: {
						name: 'Old Vic Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Wibble',
					startDate: '2017-09-01',
					endDate: '2017-09-30',
					venue: {
						name: 'Wyndham\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hoge',
					startDate: '2017-10-01',
					endDate: '2017-10-31',
					venue: {
						name: 'Almeida Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Thud',
					startDate: '2017-11-01',
					endDate: '2017-11-30',
					venue: {
						name: 'Duke of York\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Antony and Cleopatra',
					startDate: '2018-09-18',
					endDate: '2019-01-19',
					venue: {
						name: 'Olivier Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Toto',
					startDate: '2018-03-01',
					endDate: '2018-03-31',
					venue: {
						name: 'Noël Coward Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Fuga',
					startDate: '2018-04-01',
					endDate: '2018-04-30',
					venue: {
						name: 'Olivier Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Tutu',
					startDate: '2018-05-01',
					endDate: '2018-05-31',
					venue: {
						name: 'Playhouse Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Downstate',
					startDate: '2019-03-12',
					endDate: '2019-04-27',
					venue: {
						name: 'Dorfman Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Grault',
					startDate: '2019-12-01',
					endDate: '2019-12-31',
					venue: {
						name: 'Almeida Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Ink',
					startDate: '2017-06-17',
					endDate: '2017-08-05',
					venue: {
						name: 'Almeida Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Ink',
					startDate: '2017-09-09',
					endDate: '2018-01-06',
					venue: {
						name: 'Duke of York\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Hamlet',
					startDate: '2017-06-09',
					endDate: '2017-09-02',
					venue: {
						name: 'Harold Pinter Theatre'
					}
				});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2019',
				award: {
					name: 'Laurence Olivier Awards'
				},
				categories: [
					{
						name: 'Best Actor',
						nominations: [
							{
								entities: [
									{
										name: 'Simon Russell Beale'
									},
									{
										name: 'Adam Godley'
									},
									{
										name: 'Ben Miles'
									}
								],
								productions: [
									{
										uuid: THE_LEHMAN_TRILOGY_LYTTELTON_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Ian McKellen'
									}
								],
								productions: [
									{
										uuid: KING_LEAR_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Kyle Soller'
									}
								],
								productions: [
									{
										uuid: THE_INHERITANCE_YOUNG_VIC_MAIN_HOUSE_PRODUCTION_UUID
									},
									{
										uuid: THE_INHERITANCE_NOËL_COWARD_PRODUCTION_UUID
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2020',
				award: {
					name: 'Laurence Olivier Awards'
				},
				categories: [
					{
						name: 'Best Actor',
						nominations: [
							{
								isWinner: true,
								entities: [
									{
										name: 'Andrew Scott'
									}
								],
								productions: [
									{
										uuid: PRESENT_LAUGHTER_OLD_VIC_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Toby Jones'
									}
								],
								productions: [
									{
										uuid: UNCLE_VANYA_HAROLD_PINTER_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Wendell Pierce'
									}
								],
								productions: [
									{
										uuid: DEATH_OF_A_SALESMAN_YOUNG_VIC_MAIN_HOUSE_PRODUCTION_UUID
									},
									{
										uuid: DEATH_OF_A_SALESMAN_PICCADILLY_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								isWinner: true,
								entities: [
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									},
									{
										name: 'Jane Roe'
									},
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Ferdinand Foo'
											},
											{
												name: 'Beatrice Bar'
											},
											{
												name: 'Brandon Baz'
											}
										]
									},
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Quincy Qux'
											},
											{
												name: 'Clara Quux'
											},
											{
												name: 'Christian Quuz'
											}
										]
									},
									{
										name: 'Conor Corge'
									}
								],
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								],
								productions: [
									{
										uuid: FRED_OLD_VIC_PRODUCTION_UUID
									},
									{
										uuid: WALDO_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Random Role',
						nominations: [
							{
								entities: [
									{
										name: 'Jane Roe'
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'John Doe'
									},
									{
										name: 'Jane Roe'
									},
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Clara Quux'
											},
											{
												name: 'Christian Quuz'
											},
											{
												name: 'Quincy Qux'
											}
										]
									},
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Beatrice Bar'
											},
											{
												name: 'Brandon Baz'
											},
											{
												name: 'Ferdinand Foo'
											}
										]
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Noteworthy Production',
						nominations: [
							{
								productions: [
									{
										uuid: FRED_OLD_VIC_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID
									}
								]
							},
							{
								productions: [
									{
										uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2018',
				award: {
					name: 'Laurence Olivier Awards'
				},
				categories: [
					{
						name: 'Best Actor',
						nominations: [
							{
								isWinner: true,
								entities: [
									{
										name: 'Bryan Cranston'
									}
								],
								productions: [
									{
										uuid: NETWORK_LYTTELTON_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Andrew Garfield'
									}
								],
								productions: [
									{
										uuid: ANGELS_IN_AMERICA_LYTTELTON_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Andrew Scott'
									}
								],
								productions: [
									{
										uuid: HAMLET_ALMEIDA_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									}
								],
								productions: [
									{
										uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Jane Roe'
									},
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									},
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: XYZZY_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Brandon Baz'
											},
											{
												name: 'Ferdinand Foo'
											},
											{
												name: 'Beatrice Bar'
											}
										]
									},
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Christian Quuz'
											},
											{
												name: 'Quincy Qux'
											},
											{
												name: 'Clara Quux'
											}
										]
									}
								],
								productions: [
									{
										uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID
									},
									{
										uuid: WIBBLE_WYNDHAMS_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								],
								productions: [
									{
										uuid: HOGE_ALMEIDA_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Noteworthy Production',
						nominations: [
							{
								productions: [
									{
										uuid: THUD_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								]
							},
							{
								productions: [
									{
										uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID
									},
									{
										uuid: WIBBLE_WYNDHAMS_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: XYZZY_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2018',
				award: {
					name: 'Evening Standard Theatre Awards'
				},
				categories: [
					{
						name: 'Best Actor',
						nominations: [
							{
								entities: [
									{
										name: 'Bryan Cranston'
									}
								],
								productions: [
									{
										uuid: NETWORK_LYTTELTON_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Ralph Fiennes'
									}
								],
								productions: [
									{
										uuid: ANTONY_AND_CLEOPATRA_OLIVIER_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Ian McKellen'
									}
								],
								productions: [
									{
										uuid: KING_LEAR_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									},
									{
										name: 'John Doe'
									},
									{
										name: 'Jane Roe'
									}
								],
								productions: [
									{
										uuid: TOTO_NOËL_COWARD_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									}
								],
								productions: [
									{
										uuid: FUGA_OLIVIER_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Ferdinand Foo'
											},
											{
												name: 'Brandon Baz'
											},
											{
												name: 'Beatrice Bar'
											}
										]
									},
									{
										name: 'Conor Corge'
									}
								],
								productions: [
									{
										uuid: TUTU_PLAYHOUSE_PRODUCTION_UUID
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2019',
				award: {
					name: 'Evening Standard Theatre Awards'
				},
				categories: [
					{
						name: 'Best Actor',
						nominations: [
							{
								entities: [
									{
										name: 'K Todd Freeman'
									}
								],
								productions: [
									{
										uuid: DOWNSTATE_DORFMAN_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Francis Guinan'
									}
								],
								productions: [
									{
										uuid: DOWNSTATE_DORFMAN_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Andrew Scott'
									}
								],
								productions: [
									{
										uuid: PRESENT_LAUGHTER_OLD_VIC_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								isWinner: true,
								entities: [
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Quincy Qux'
											},
											{
												name: 'Christian Quuz'
											},
											{
												name: 'Clara Quux'
											}
										]
									}
								],
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Noteworthy Production',
						nominations: [
							{
								isWinner: true,
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									}
								]
							},
							{
								productions: [
									{
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID
									}
								]
							},
							{
								productions: [
									{
										uuid: WALDO_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2017',
				award: {
					name: 'Evening Standard Theatre Awards'
				},
				categories: [
					{
						name: 'Best Actor',
						nominations: [
							{
								entities: [
									{
										name: 'Bertie Carvel'
									}
								],
								productions: [
									{
										uuid: INK_ALMEIDA_PRODUCTION_UUID
									},
									{
										uuid: INK_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Andrew Garfield'
									}
								],
								productions: [
									{
										uuid: ANGELS_IN_AMERICA_LYTTELTON_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Andrew Scott'
									}
								],
								productions: [
									{
										uuid: HAMLET_ALMEIDA_PRODUCTION_UUID
									},
									{
										uuid: HAMLET_HAROLD_PINTER_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Random Role',
						nominations: [
							{
								entities: [
									{
										name: 'Jane Roe'
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'John Doe'
									},
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									},
									{
										name: 'Jane Roe'
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Clara Quux'
											},
											{
												name: 'Quincy Qux'
											},
											{
												name: 'Christian Quuz'
											}
										]
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Beatrice Bar'
											},
											{
												name: 'Ferdinand Foo'
											},
											{
												name: 'Brandon Baz'
											}
										]
									},
									{
										name: 'Conor Corge'
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								],
								productions: [
									{
										uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										name: 'Jane Roe'
									},
									{
										name: 'John Doe'
									},
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								],
								productions: [
									{
										uuid: XYZZY_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID
									},
									{
										uuid: HOGE_ALMEIDA_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Conor Corge'
									},
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Christian Quuz'
											},
											{
												name: 'Clara Quux'
											},
											{
												name: 'Quincy Qux'
											}
										]
									},
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Brandon Baz'
											},
											{
												name: 'Beatrice Bar'
											},
											{
												name: 'Ferdinand Foo'
											}
										]
									}
								],
								productions: [
									{
										uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									}
								],
								productions: [
									{
										uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Noteworthy Production',
						nominations: [
							{
								productions: [
									{
										uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: THUD_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								]
							},
							{
								productions: [
									{
										uuid: XYZZY_DORFMAN_PRODUCTION_UUID
									},
									{
										uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2019',
				award: {
					name: 'Critics\' Circle Theatre Awards'
				},
				categories: [
					{
						name: 'Best Actor',
						nominations: [
							{
								isWinner: true,
								entities: [
									{
										name: 'Andrew Scott'
									}
								],
								productions: [
									{
										uuid: PRESENT_LAUGHTER_OLD_VIC_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Miscellaneous Role',
						nominations: [
							{
								entities: [
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
									},
									{
										name: 'Jane Roe'
									},
									{
										name: 'John Doe'
									}
								],
								productions: [
									{
										uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID
									}
								]
							},
							{
								entities: [
									{
										model: 'COMPANY',
										name: 'Stagecraft Ltd',
										members: [
											{
												name: 'Ferdinand Foo'
											},
											{
												name: 'Beatrice Bar'
											},
											{
												name: 'Brandon Baz'
											}
										]
									},
									{
										model: 'COMPANY',
										name: 'Theatricals Ltd',
										members: [
											{
												name: 'Quincy Qux'
											},
											{
												name: 'Clara Quux'
											},
											{
												name: 'Christian Quuz'
											}
										]
									},
									{
										name: 'Conor Corge'
									}
								],
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
									}
								],
								productions: [
									{
										uuid: FRED_OLD_VIC_PRODUCTION_UUID
									},
									{
										uuid: WALDO_DORFMAN_PRODUCTION_UUID
									}
								]
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Best Noteworthy Production',
						nominations: [
							{
								isWinner: true,
								productions: [
									{
										uuid: FRED_OLD_VIC_PRODUCTION_UUID
									}
								]
							},
							{
								productions: [
									{
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID
									}
								]
							},
							{
								productions: [
									{
										uuid: WALDO_DORFMAN_PRODUCTION_UUID
									}
								]
							}
						]
					}
				]
			});

		laurenceOlivierAwardsAward = await chai.request(app)
			.get(`/awards/${LAURENCE_OLIVIER_AWARDS_AWARD_UUID}`);

		eveningStandardTheatreAwardsAward = await chai.request(app)
			.get(`/awards/${EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID}`);

		johnDoePerson = await chai.request(app)
			.get(`/people/${JOHN_DOE_PERSON_UUID}`);

		curtainUpCompany = await chai.request(app)
			.get(`/companies/${CURTAIN_UP_LTD_COMPANY_UUID}`);

		conorCorgePerson = await chai.request(app)
			.get(`/people/${CONOR_CORGE_PERSON_UUID}`);

		stagecraftLtdCompany = await chai.request(app)
			.get(`/companies/${STAGECRAFT_LTD_COMPANY_UUID}`);

		quincyQuxPerson = await chai.request(app)
			.get(`/people/${QUINCY_QUX_PERSON_UUID}`);

		garplyLytteltonProduction = await chai.request(app)
			.get(`/productions/${GARPLY_LYTTELTON_PRODUCTION_UUID}`);

		xyzzyPlayhouseProduction = await chai.request(app)
			.get(`/productions/${XYZZY_PLAYHOUSE_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Laurence Olivier Awards (award)', () => {

		it('includes its ceremonies', () => {

			const expectedCeremonies = [
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
					name: '2020'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '2019'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
					name: '2018'
				}
			];

			const { ceremonies } = laurenceOlivierAwardsAward.body;

			expect(ceremonies).to.deep.equal(expectedCeremonies);

		});

	});

	describe('Evening Standard Theatre Awards (award)', () => {

		it('includes its ceremonies', () => {

			const expectedCeremonies = [
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '2019'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
					name: '2018'
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID,
					name: '2017'
				}
			];

			const { ceremonies } = eveningStandardTheatreAwardsAward.body;

			expect(ceremonies).to.deep.equal(expectedCeremonies);

		});

	});

	describe('John Doe (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
													name: 'Grault',
													startDate: '2019-12-01',
													endDate: '2019-12-31',
													venue: {
														model: 'VENUE',
														uuid: ALMEIDA_THEATRE_VENUE_UUID,
														name: 'Almeida Theatre',
														surVenue: null
													}
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
													name: 'Grault',
													startDate: '2019-12-01',
													endDate: '2019-12-31',
													venue: {
														model: 'VENUE',
														uuid: ALMEIDA_THEATRE_VENUE_UUID,
														name: 'Almeida Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: BACKSTAGE_LTD_COMPANY_UUID,
													name: 'Backstage Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: TOTO_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2018-03-01',
													endDate: '2018-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												}
											],
											productions: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'COMPANY',
													uuid: BACKSTAGE_LTD_COMPANY_UUID,
													name: 'Backstage Ltd',
													members: []
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-07-01',
													endDate: '2017-07-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_ALMEIDA_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2017-10-01',
													endDate: '2017-10-31',
													venue: {
														model: 'VENUE',
														uuid: ALMEIDA_THEATRE_VENUE_UUID,
														name: 'Almeida Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: LYTTELTON_THEATRE_VENUE_UUID,
														name: 'Lyttelton Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											employerCompany: null,
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'COMPANY',
													uuid: BACKSTAGE_LTD_COMPANY_UUID,
													name: 'Backstage Ltd',
													members: []
												}
											],
											productions: []
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-07-01',
													endDate: '2017-07-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = johnDoePerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Curtain Up (company)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [],
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: FUGA_OLIVIER_PRODUCTION_UUID,
													name: 'Fuga',
													startDate: '2018-04-01',
													endDate: '2018-04-30',
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
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											members: [],
											coEntities: [
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												},
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												}
											],
											productions: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2017-05-01',
													endDate: '2017-05-31',
													venue: {
														model: 'VENUE',
														uuid: HAROLD_PINTER_THEATRE_VENUE_UUID,
														name: 'Harold Pinter Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [],
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2019-08-01',
													endDate: '2019-08-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [],
											coEntities: [],
											productions: []
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PIYO_HAROLD_PINTER_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2017-05-01',
													endDate: '2017-05-31',
													venue: {
														model: 'VENUE',
														uuid: HAROLD_PINTER_THEATRE_VENUE_UUID,
														name: 'Harold Pinter Theatre',
														surVenue: null
													}
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [],
											coEntities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: XYZZY_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-07-01',
													endDate: '2017-07-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = curtainUpCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Conor Corge (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: LYTTELTON_THEATRE_VENUE_UUID,
														name: 'Lyttelton Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: LYTTELTON_THEATRE_VENUE_UUID,
														name: 'Lyttelton Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: TUTU_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Tutu',
													startDate: '2018-05-01',
													endDate: '2018-05-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												}
											],
											productions: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: LYTTELTON_THEATRE_VENUE_UUID,
														name: 'Lyttelton Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: []
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											employerCompany: null,
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_WYNDHAMS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-09-01',
													endDate: '2017-09-30',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = conorCorgePerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Stagecraft Ltd (company)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												}
											],
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: LYTTELTON_THEATRE_VENUE_UUID,
														name: 'Lyttelton Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												},
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												}
											],
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: TUTU_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Tutu',
													startDate: '2018-05-01',
													endDate: '2018-05-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												}
											],
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											members: [
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												},
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												}
											],
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												}
											],
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: LYTTELTON_THEATRE_VENUE_UUID,
														name: 'Lyttelton Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											members: [
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												},
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												}
											],
											coEntities: [
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: []
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											members: [
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												},
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												}
											],
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_WYNDHAMS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-09-01',
													endDate: '2017-09-30',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = stagecraftLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Quincy Qux (person)', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													},
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													}
												]
											},
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: LYTTELTON_THEATRE_VENUE_UUID,
														name: 'Lyttelton Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													},
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													}
												]
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: LYTTELTON_THEATRE_VENUE_UUID,
														name: 'Lyttelton Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													},
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													}
												]
											},
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													},
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													}
												]
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													},
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													}
												]
											},
											coEntities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-06-01',
													endDate: '2019-06-30',
													venue: {
														model: 'VENUE',
														uuid: LYTTELTON_THEATRE_VENUE_UUID,
														name: 'Lyttelton Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													},
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													}
												]
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														}
													]
												}
											],
											productions: []
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											employerCompany: {
												model: 'COMPANY',
												uuid: THEATRICALS_LTD_COMPANY_UUID,
												name: 'Theatricals Ltd',
												coMembers: [
													{
														model: 'PERSON',
														uuid: CHRISTIAN_QUUZ_PERSON_UUID,
														name: 'Christian Quuz'
													},
													{
														model: 'PERSON',
														uuid: CLARA_QUUX_PERSON_UUID,
														name: 'Clara Quux'
													}
												]
											},
											coEntities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														},
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														}
													]
												}
											],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_OLD_VIC_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-08-01',
													endDate: '2017-08-31',
													venue: {
														model: 'VENUE',
														uuid: OLD_VIC_THEATRE_VENUE_UUID,
														name: 'Old Vic Theatre',
														surVenue: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_WYNDHAMS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2017-09-01',
													endDate: '2017-09-30',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = quincyQuxPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Garply at Lyttelton Theatre (production)', () => {

		it('includes its award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID,
					name: 'Critics\' Circle Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											entities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											coProductions: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Noteworthy Production',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											entities: [],
											coProductions: []
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
							name: '2019',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														}
													]
												}
											],
											coProductions: []
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Noteworthy Production',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											entities: [],
											coProductions: []
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
							name: '2020',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											entities: [
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											entities: [
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: FERDINAND_FOO_PERSON_UUID,
															name: 'Ferdinand Foo'
														},
														{
															model: 'PERSON',
															uuid: BEATRICE_BAR_PERSON_UUID,
															name: 'Beatrice Bar'
														},
														{
															model: 'PERSON',
															uuid: BRANDON_BAZ_PERSON_UUID,
															name: 'Brandon Baz'
														}
													]
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd',
													members: [
														{
															model: 'PERSON',
															uuid: QUINCY_QUX_PERSON_UUID,
															name: 'Quincy Qux'
														},
														{
															model: 'PERSON',
															uuid: CLARA_QUUX_PERSON_UUID,
															name: 'Clara Quux'
														},
														{
															model: 'PERSON',
															uuid: CHRISTIAN_QUUZ_PERSON_UUID,
															name: 'Christian Quuz'
														}
													]
												},
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Noteworthy Production',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											entities: [],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
													name: 'Garply',
													startDate: '2019-07-01',
													endDate: '2019-07-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = garplyLytteltonProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Xyzzy at Playhouse Theatre (production)', () => {

		it('includes its award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID,
							name: '2017',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											entities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												},
												{
													model: 'COMPANY',
													uuid: BACKSTAGE_LTD_COMPANY_UUID,
													name: 'Backstage Ltd',
													members: []
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_ALMEIDA_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2017-10-01',
													endDate: '2017-10-31',
													venue: {
														model: 'VENUE',
														uuid: ALMEIDA_THEATRE_VENUE_UUID,
														name: 'Almeida Theatre',
														surVenue: null
													}
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Noteworthy Production',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											entities: [],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
							name: '2018',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Role',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											entities: [
												{
													model: 'PERSON',
													uuid: JANE_ROE_PERSON_UUID,
													name: 'Jane Roe'
												},
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd',
													members: []
												},
												{
													model: 'PERSON',
													uuid: JOHN_DOE_PERSON_UUID,
													name: 'John Doe'
												}
											],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												}
											]
										}
									]
								},
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Noteworthy Production',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											entities: [],
											coProductions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_DORFMAN_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2017-06-01',
													endDate: '2017-06-30',
													venue: {
														model: 'VENUE',
														uuid: DORFMAN_THEATRE_VENUE_UUID,
														name: 'Dorfman Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			];

			const { awards } = xyzzyPlayhouseProduction.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

});

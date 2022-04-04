import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

// Contrived data for purposes of tests.
describe('Award ceremonies with nominated materials', () => {

	chai.use(chaiHttp);

	const PIYO_MATERIAL_UUID = '5';
	const FERDINAND_FOO_PERSON_UUID = '7';
	const CLARA_QUUX_PERSON_UUID = '8';
	const SONGBIRDS_LTD_COMPANY_UUID = '9';
	const WALDO_MATERIAL_UUID = '14';
	const JANE_ROE_PERSON_UUID = '16';
	const FICTIONEERS_LTD_COMPANY_UUID = '17';
	const WIBBLE_MATERIAL_UUID = '23';
	const QUINCY_QUX_PERSON_UUID = '25';
	const THEATRICALS_LTD_COMPANY_UUID = '26';
	const XYZZY_MATERIAL_UUID = '34';
	const CONOR_CORGE_PERSON_UUID = '36';
	const SCRIBES_LTD_COMPANY_UUID = '37';
	const BRANDON_BAZ_PERSON_UUID = '38';
	const CREATORS_LTD_COMPANY_UUID = '39';
	const FRED_MATERIAL_UUID = '44';
	const JOHN_DOE_PERSON_UUID = '46';
	const PLAYWRIGHTS_LTD_COMPANY_UUID = '47';
	const PLUGH_ORIGINAL_VERSION_MATERIAL_UUID = '58';
	const FRANCIS_FLOB_PERSON_UUID = '60';
	const CURTAIN_UP_LTD_COMPANY_UUID = '61';
	const PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = '68';
	const BEATRICE_BAR_PERSON_UUID = '72';
	const STAGECRAFT_LTD_COMPANY_UUID = '73';
	const HOGE_MATERIAL_UUID = '80';
	const CINERIGHTS_LTD_COMPANY_UUID = '84';
	const TALYSE_TATA_PERSON_UUID = '85';
	const THUD_MATERIAL_UUID = '89';
	const TOTO_MATERIAL_UUID = '104';
	const GRAULT_MATERIAL_UUID = '119';
	const NATIONAL_THEATRE_VENUE_UUID = '126';
	const OLIVIER_THEATRE_VENUE_UUID = '127';
	const LYTTELTON_THEATRE_VENUE_UUID = '128';
	const COTTESLOE_THEATRE_VENUE_UUID = '129';
	const ROYAL_COURT_THEATRE_VENUE_UUID = '133';
	const JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID = '134';
	const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = '135';
	const PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '136';
	const PIYO_WYNDHAMS_PRODUCTION_UUID = '139';
	const WYNDHAMS_THEATRE_VENUE_UUID = '141';
	const WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '142';
	const WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID = '145';
	const DUKE_OF_YORKS_THEATRE_VENUE_UUID = '147';
	const XYZZY_OLIVIER_PRODUCTION_UUID = '148';
	const XYZZY_DUKE_OF_YORKS_PRODUCTION_UUID = '151';
	const FRED_LYTTELTON_PRODUCTION_UUID = '154';
	const FRED_NOËL_COWARD_PRODUCTION_UUID = '157';
	const NOËL_COWARD_THEATRE_VENUE_UUID = '159';
	const GARPLY_ALMEIDA_PRODUCTION_UUID = '160';
	const PLUGH_LYTTELTON_PRODUCTION_UUID = '163';
	const PLUGH_WYNDHAMS_PRODUCTION_UUID = '166';
	const HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '169';
	const HOGE_NOËL_COWARD_PRODUCTION_UUID = '172';
	const THUD_PLAYHOUSE_PRODUCTION_UUID = '175';
	const PLAYHOUSE_THEATRE_VENUE_UUID = '177';
	const TUTU_OLD_VIC_PRODUCTION_UUID = '178';
	const TOTO_COTTESLOE_PRODUCTION_UUID = '181';
	const TOTO_GIELGUD_PRODUCTION_UUID = '184';
	const GIELGUD_THEATRE_VENUE_UUID = '186';
	const FUGA_ALMEIDA_PRODUCTION_UUID = '187';
	const GRAULT_GIELGUD_PRODUCTION_UUID = '190';
	const WORDSMITH_AWARD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID = '198';
	const WORDSMITH_AWARD_UUID = '199';
	const WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID = '208';
	const WORDSMITH_AWARD_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID = '218';
	const PLAYWRITING_PRIZE_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID = '228';
	const PLAYWRITING_PRIZE_AWARD_UUID = '229';
	const PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID = '238';
	const PLAYWRITING_PRIZE_TWO_THOUSAND_AND_SEVEN_AWARD_CEREMONY_UUID = '248';

	let wordsmithAward2009AwardCeremony;
	let playwritingPrize2009AwardCeremony;
	let johnDoePerson;
	let playwrightsLtdCompany;
	let claraQuuxPerson;
	let songbirdsLtdCompany;
	let beatriceBarPerson;
	let theatricalsLtdCompany;
	let waldoMaterial;
	let janeRoePerson;
	let fictioneersLtdCompany;
	let brandonBazPerson;
	let creatorsLtdCompany;
	let plughOriginalVersionMaterial;
	let francisFlobPerson;
	let curtainUpLtdCompany;
	let talyseTataPerson;
	let cinerightsLtdCompany;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Piyo',
				format: 'musical',
				year: '2008',
				writingCredits: [
					{
						name: 'book by',
						entities: [
							{
								name: 'Ferdinand Foo'
							},
							{
								name: 'Clara Quux'
							}
						]
					},
					{
						name: 'music by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Songbirds Ltd'
							},
							{
								name: 'Ferdinand Foo'
							}
						]
					},
					{
						name: 'lyrics by',
						entities: [
							{
								name: 'Clara Quux'
							},
							{
								model: 'COMPANY',
								name: 'Songbirds Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Waldo',
				format: 'novel',
				year: '1974',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jane Roe'
							},
							{
								model: 'COMPANY',
								name: 'Fictioneers Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Wibble',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux'
							},
							{
								model: 'COMPANY',
								name: 'Theatricals Ltd'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Waldo'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Xyzzy',
				format: 'play',
				year: '2008',
				writingCredits: [
					{
						entities: [
							{
								name: 'Conor Corge'
							},
							{
								model: 'COMPANY',
								name: 'Scribes Ltd'
							}
						]
					},
					{
						name: 'based on the works of',
						creditType: 'NON_SPECIFIC_SOURCE_MATERIAL',
						entities: [
							{
								name: 'Brandon Baz'
							},
							{
								model: 'COMPANY',
								name: 'Creators Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Fred',
				format: 'play',
				year: '2010',
				writingCredits: [
					{
						entities: [
							{
								name: 'John Doe'
							},
							{
								model: 'COMPANY',
								name: 'Playwrights Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Garply',
				format: 'play',
				year: '2010',
				writingCredits: [
					{
						entities: [
							{
								name: 'Conor Corge'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Plugh',
				differentiator: '1',
				format: 'play',
				year: '1899',
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob'
							},
							{
								model: 'COMPANY',
								name: 'Curtain Up Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Plugh',
				differentiator: '2',
				format: 'play',
				year: '2009',
				originalVersionMaterial: {
					name: 'Plugh',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob'
							},
							{
								model: 'COMPANY',
								name: 'Curtain Up Ltd'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Beatrice Bar'
							},
							{
								model: 'COMPANY',
								name: 'Stagecraft Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Hoge',
				format: 'play',
				year: '2008',
				writingCredits: [
					{
						entities: [
							{
								name: 'Beatrice Bar'
							},
							{
								model: 'COMPANY',
								name: 'Theatricals Ltd'
							}
						]
					},
					{
						name: 'by arrangement with',
						creditType: 'RIGHTS_GRANTOR',
						entities: [
							{
								model: 'COMPANY',
								name: 'Cinerights Ltd'
							},
							{
								name: 'Talyse Tata'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Thud',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Clara Quux'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Tutu',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Christian Quuz'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Toto',
				format: 'play',
				year: '2008',
				writingCredits: [
					{
						entities: [
							{
								name: 'Brandon Baz'
							},
							{
								model: 'COMPANY',
								name: 'Playwrights Ltd'
							}
						]
					},
					{
						name: 'additional material by',
						entities: [
							{
								model: 'COMPANY',
								name: 'Inkists Ltd'
							},
							{
								name: 'John Doe'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Fuga',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Conor Corge'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Grault',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Beatrice Bar'
							}
						]
					}
				]
			});

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
			.post('/venues')
			.send({
				name: 'Royal Court Theatre',
				subVenues: [
					{
						name: 'Jerwood Theatre Downstairs'
					},
					{
						name: 'Jerwood Theatre Upstairs'
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Piyo',
				startDate: '2008-09-01',
				endDate: '2008-09-30',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Piyo',
				startDate: '2008-10-01',
				endDate: '2008-10-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Wibble',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Wibble',
				startDate: '2009-06-01',
				endDate: '2009-06-30',
				venue: {
					name: 'Duke of York\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Xyzzy',
				startDate: '2008-11-01',
				endDate: '2008-11-30',
				venue: {
					name: 'Olivier Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Xyzzy',
				startDate: '2008-12-01',
				endDate: '2008-12-31',
				venue: {
					name: 'Duke of York\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Fred',
				startDate: '2010-02-01',
				endDate: '2010-02-28',
				venue: {
					name: 'Lyttelton Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Fred',
				startDate: '2010-03-01',
				endDate: '2010-03-31',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Garply',
				startDate: '2010-04-01',
				endDate: '2010-04-30',
				venue: {
					name: 'Almeida Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Plugh',
				startDate: '2009-07-01',
				endDate: '2009-07-31',
				venue: {
					name: 'Lyttelton Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Plugh',
				startDate: '2009-08-01',
				endDate: '2009-08-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hoge',
				startDate: '2008-05-01',
				endDate: '2008-05-31',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Hoge',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Thud',
				startDate: '2007-03-01',
				endDate: '2007-03-31',
				venue: {
					name: 'Playhouse Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Tutu',
				startDate: '2007-04-01',
				endDate: '2007-04-30',
				venue: {
					name: 'Old Vic Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Toto',
				startDate: '2008-07-01',
				endDate: '2008-07-31',
				venue: {
					name: 'Cottesloe Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Toto',
				startDate: '2008-08-01',
				endDate: '2008-08-31',
				venue: {
					name: 'Gielgud Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Fuga',
				startDate: '2007-05-01',
				endDate: '2007-05-31',
				venue: {
					name: 'Almeida Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Grault',
				startDate: '2007-06-01',
				endDate: '2007-06-30',
				venue: {
					name: 'Gielgud Theatre'
				}
			});

		await chai.request(app)
			.post('/awards/ceremonies')
			.send({
				name: '2009',
				award: {
					name: 'Wordsmith Award'
				},
				categories: [
					{
						name: 'Best Miscellaneous Play',
						nominations: [
							{
								customType: 'Shortlisted',
								productions: [
									{
										uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: PIYO_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Piyo'
									}
								]
							},
							{
								customType: 'Longlisted',
								productions: [
									{
										uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Wibble'
									}
								]
							},
							{
								isWinner: true,
								customType: 'First Place',
								productions: [
									{
										uuid: XYZZY_OLIVIER_PRODUCTION_UUID
									},
									{
										uuid: XYZZY_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Xyzzy'
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
				name: '2010',
				award: {
					name: 'Wordsmith Award'
				},
				categories: [
					{
						name: 'Best Miscellaneous Play',
						nominations: [
							{
								customType: 'Longlisted',
								productions: [
									{
										uuid: FRED_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: FRED_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Fred'
									}
								]
							},
							{
								isWinner: true,
								customType: 'First Place',
								productions: [
									{
										uuid: GARPLY_ALMEIDA_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Garply'
									}
								]
							},
							{
								customType: 'Shortlisted',
								productions: [
									{
										uuid: PLUGH_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: PLUGH_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Plugh',
										differentiator: '2'
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
				name: '2008',
				award: {
					name: 'Wordsmith Award'
				},
				categories: [
					{
						name: 'Best Miscellaneous Play',
						nominations: [
							{
								isWinner: true,
								customType: 'First Place',
								productions: [
									{
										uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Hoge'
									}
								]
							},
							{
								customType: 'Shortlisted',
								productions: [
									{
										uuid: THUD_PLAYHOUSE_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Thud'
									}
								]
							},
							{
								customType: 'Longlisted',
								productions: [
									{
										uuid: TUTU_OLD_VIC_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Tutu'
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
				name: '2008',
				award: {
					name: 'Playwriting Prize'
				},
				categories: [
					{
						name: 'Best Random Play',
						nominations: [
							{
								productions: [
									{
										uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Piyo'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: TOTO_COTTESLOE_PRODUCTION_UUID
									},
									{
										uuid: TOTO_GIELGUD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Toto'
									}
								]
							},
							{
								productions: [
									{
										uuid: XYZZY_OLIVIER_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Xyzzy'
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
				name: '2009',
				award: {
					name: 'Playwriting Prize'
				},
				categories: [
					{
						name: 'Best Random Play',
						nominations: [
							{
								productions: [
									{
										uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Hoge'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: PLUGH_LYTTELTON_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Plugh',
										differentiator: '2'
									}
								]
							},
							{
								productions: [
									{
										uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Wibble'
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
				name: '2007',
				award: {
					name: 'Playwriting Prize'
				},
				categories: [
					{
						name: 'Best Random Play',
						nominations: [
							{
								productions: [
									{
										uuid: FUGA_ALMEIDA_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Fuga'
									}
								]
							},
							{
								productions: [
									{
										uuid: GRAULT_GIELGUD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Grault'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: THUD_PLAYHOUSE_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Thud'
									}
								]
							}
						]
					}
				]
			});

		wordsmithAward2009AwardCeremony = await chai.request(app)
			.get(`/awards/ceremonies/${WORDSMITH_AWARD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID}`);

		playwritingPrize2009AwardCeremony = await chai.request(app)
			.get(`/awards/ceremonies/${PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID}`);

		johnDoePerson = await chai.request(app)
			.get(`/people/${JOHN_DOE_PERSON_UUID}`);

		playwrightsLtdCompany = await chai.request(app)
			.get(`/companies/${PLAYWRIGHTS_LTD_COMPANY_UUID}`);

		claraQuuxPerson = await chai.request(app)
			.get(`/people/${CLARA_QUUX_PERSON_UUID}`);

		songbirdsLtdCompany = await chai.request(app)
			.get(`/companies/${SONGBIRDS_LTD_COMPANY_UUID}`);

		beatriceBarPerson = await chai.request(app)
			.get(`/people/${BEATRICE_BAR_PERSON_UUID}`);

		theatricalsLtdCompany = await chai.request(app)
			.get(`/companies/${THEATRICALS_LTD_COMPANY_UUID}`);

		waldoMaterial = await chai.request(app)
			.get(`/materials/${WALDO_MATERIAL_UUID}`);

		janeRoePerson = await chai.request(app)
			.get(`/people/${JANE_ROE_PERSON_UUID}`);

		fictioneersLtdCompany = await chai.request(app)
			.get(`/companies/${FICTIONEERS_LTD_COMPANY_UUID}`);

		brandonBazPerson = await chai.request(app)
			.get(`/people/${BRANDON_BAZ_PERSON_UUID}`);

		creatorsLtdCompany = await chai.request(app)
			.get(`/companies/${CREATORS_LTD_COMPANY_UUID}`);

		plughOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`);

		francisFlobPerson = await chai.request(app)
			.get(`/people/${FRANCIS_FLOB_PERSON_UUID}`);

		curtainUpLtdCompany = await chai.request(app)
			.get(`/companies/${CURTAIN_UP_LTD_COMPANY_UUID}`);

		talyseTataPerson = await chai.request(app)
			.get(`/people/${TALYSE_TATA_PERSON_UUID}`);

		cinerightsLtdCompany = await chai.request(app)
			.get(`/companies/${CINERIGHTS_LTD_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Wordsmith Award 2009 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					name: 'Best Miscellaneous Play',
					model: 'AWARD_CEREMONY_CATEGORY',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							customType: 'Shortlisted',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
									name: 'Piyo',
									startDate: '2008-09-01',
									endDate: '2008-09-30',
									venue: {
										model: 'VENUE',
										uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
										name: 'Jerwood Theatre Downstairs',
										surVenue: {
											model: 'VENUE',
											uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
											name: 'Royal Court Theatre'
										}
									}
								},
								{
									model: 'PRODUCTION',
									uuid: PIYO_WYNDHAMS_PRODUCTION_UUID,
									name: 'Piyo',
									startDate: '2008-10-01',
									endDate: '2008-10-31',
									venue: {
										model: 'VENUE',
										uuid: WYNDHAMS_THEATRE_VENUE_UUID,
										name: 'Wyndham\'s Theatre',
										surVenue: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: PIYO_MATERIAL_UUID,
									name: 'Piyo',
									format: 'musical',
									year: 2008,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'book by',
											entities: [
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												},
												{
													model: 'PERSON',
													uuid: CLARA_QUUX_PERSON_UUID,
													name: 'Clara Quux'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'music by',
											entities: [
												{
													model: 'COMPANY',
													uuid: SONGBIRDS_LTD_COMPANY_UUID,
													name: 'Songbirds Ltd'
												},
												{
													model: 'PERSON',
													uuid: FERDINAND_FOO_PERSON_UUID,
													name: 'Ferdinand Foo'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'lyrics by',
											entities: [
												{
													model: 'PERSON',
													uuid: CLARA_QUUX_PERSON_UUID,
													name: 'Clara Quux'
												},
												{
													model: 'COMPANY',
													uuid: SONGBIRDS_LTD_COMPANY_UUID,
													name: 'Songbirds Ltd'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							customType: 'Longlisted',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Wibble',
									startDate: '2009-05-01',
									endDate: '2009-05-31',
									venue: {
										model: 'VENUE',
										uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
										name: 'Jerwood Theatre Upstairs',
										surVenue: {
											model: 'VENUE',
											uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
											name: 'Royal Court Theatre'
										}
									}
								},
								{
									model: 'PRODUCTION',
									uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
									name: 'Wibble',
									startDate: '2009-06-01',
									endDate: '2009-06-30',
									venue: {
										model: 'VENUE',
										uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
										name: 'Duke of York\'s Theatre',
										surVenue: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: WIBBLE_MATERIAL_UUID,
									name: 'Wibble',
									format: 'play',
									year: 2009,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: QUINCY_QUX_PERSON_UUID,
													name: 'Quincy Qux'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'based on',
											entities: [
												{
													model: 'MATERIAL',
													uuid: WALDO_MATERIAL_UUID,
													name: 'Waldo',
													format: 'novel',
													year: 1974,
													writingCredits: [
														{
															name: 'by',
															model: 'WRITING_CREDIT',
															entities: [
																{
																	model: 'PERSON',
																	uuid: JANE_ROE_PERSON_UUID,
																	name: 'Jane Roe'
																},
																{
																	model: 'COMPANY',
																	uuid: FICTIONEERS_LTD_COMPANY_UUID,
																	name: 'Fictioneers Ltd'
																}
															]
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
							model: 'NOMINATION',
							isWinner: true,
							customType: 'First Place',
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: XYZZY_OLIVIER_PRODUCTION_UUID,
									name: 'Xyzzy',
									startDate: '2008-11-01',
									endDate: '2008-11-30',
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
									uuid: XYZZY_DUKE_OF_YORKS_PRODUCTION_UUID,
									name: 'Xyzzy',
									startDate: '2008-12-01',
									endDate: '2008-12-31',
									venue: {
										model: 'VENUE',
										uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
										name: 'Duke of York\'s Theatre',
										surVenue: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: XYZZY_MATERIAL_UUID,
									name: 'Xyzzy',
									format: 'play',
									year: 2008,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: CONOR_CORGE_PERSON_UUID,
													name: 'Conor Corge'
												},
												{
													model: 'COMPANY',
													uuid: SCRIBES_LTD_COMPANY_UUID,
													name: 'Scribes Ltd'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'based on the works of',
											entities: [
												{
													model: 'PERSON',
													uuid: BRANDON_BAZ_PERSON_UUID,
													name: 'Brandon Baz'
												},
												{
													model: 'COMPANY',
													uuid: CREATORS_LTD_COMPANY_UUID,
													name: 'Creators Ltd'
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

			const { categories } = wordsmithAward2009AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('Playwriting Prize 2009 (award ceremony)', () => {

		it('includes its categories', () => {

			const expectedCategories = [
				{
					name: 'Best Random Play',
					model: 'AWARD_CEREMONY_CATEGORY',
					nominations: [
						{
							model: 'NOMINATION',
							isWinner: false,
							customType: null,
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
									name: 'Hoge',
									startDate: '2008-05-01',
									endDate: '2008-05-31',
									venue: {
										model: 'VENUE',
										uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
										name: 'Jerwood Theatre Downstairs',
										surVenue: {
											model: 'VENUE',
											uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
											name: 'Royal Court Theatre'
										}
									}
								},
								{
									model: 'PRODUCTION',
									uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID,
									name: 'Hoge',
									startDate: '2008-06-01',
									endDate: '2008-06-30',
									venue: {
										model: 'VENUE',
										uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
										name: 'Noël Coward Theatre',
										surVenue: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: HOGE_MATERIAL_UUID,
									name: 'Hoge',
									format: 'play',
									year: 2008,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'by arrangement with',
											entities: [
												{
													model: 'COMPANY',
													uuid: CINERIGHTS_LTD_COMPANY_UUID,
													name: 'Cinerights Ltd'
												},
												{
													model: 'PERSON',
													uuid: TALYSE_TATA_PERSON_UUID,
													name: 'Talyse Tata'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: true,
							customType: null,
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
									name: 'Plugh',
									startDate: '2009-07-01',
									endDate: '2009-07-31',
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
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
									name: 'Plugh',
									format: 'play',
									year: 2009,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: FRANCIS_FLOB_PERSON_UUID,
													name: 'Francis Flob'
												},
												{
													model: 'COMPANY',
													uuid: CURTAIN_UP_LTD_COMPANY_UUID,
													name: 'Curtain Up Ltd'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'version by',
											entities: [
												{
													model: 'PERSON',
													uuid: BEATRICE_BAR_PERSON_UUID,
													name: 'Beatrice Bar'
												},
												{
													model: 'COMPANY',
													uuid: STAGECRAFT_LTD_COMPANY_UUID,
													name: 'Stagecraft Ltd'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'NOMINATION',
							isWinner: false,
							customType: null,
							entities: [],
							productions: [
								{
									model: 'PRODUCTION',
									uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
									name: 'Wibble',
									startDate: '2009-05-01',
									endDate: '2009-05-31',
									venue: {
										model: 'VENUE',
										uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
										name: 'Jerwood Theatre Upstairs',
										surVenue: {
											model: 'VENUE',
											uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
											name: 'Royal Court Theatre'
										}
									}
								},
								{
									model: 'PRODUCTION',
									uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
									name: 'Wibble',
									startDate: '2009-06-01',
									endDate: '2009-06-30',
									venue: {
										model: 'VENUE',
										uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
										name: 'Duke of York\'s Theatre',
										surVenue: null
									}
								}
							],
							materials: [
								{
									model: 'MATERIAL',
									uuid: WIBBLE_MATERIAL_UUID,
									name: 'Wibble',
									format: 'play',
									year: 2009,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: QUINCY_QUX_PERSON_UUID,
													name: 'Quincy Qux'
												},
												{
													model: 'COMPANY',
													uuid: THEATRICALS_LTD_COMPANY_UUID,
													name: 'Theatricals Ltd'
												}
											]
										},
										{
											model: 'WRITING_CREDIT',
											name: 'based on',
											entities: [
												{
													model: 'MATERIAL',
													uuid: WALDO_MATERIAL_UUID,
													name: 'Waldo',
													format: 'novel',
													year: 1974,
													writingCredits: [
														{
															model: 'WRITING_CREDIT',
															name: 'by',
															entities: [
																{
																	model: 'PERSON',
																	uuid: JANE_ROE_PERSON_UUID,
																	name: 'Jane Roe'
																},
																{
																	model: 'COMPANY',
																	uuid: FICTIONEERS_LTD_COMPANY_UUID,
																	name: 'Fictioneers Ltd'
																}
															]
														}
													]
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

			const { categories } = playwritingPrize2009AwardCeremony.body;

			expect(categories).to.deep.equal(expectedCategories);

		});

	});

	describe('John Doe (person): single credit per nomination; single nomination per category', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: null,
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: TOTO_COTTESLOE_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-07-01',
													endDate: '2008-07-31',
													venue: {
														model: 'VENUE',
														uuid: COTTESLOE_THEATRE_VENUE_UUID,
														name: 'Cottesloe Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: TOTO_GIELGUD_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-08-01',
													endDate: '2008-08-31',
													venue: {
														model: 'VENUE',
														uuid: GIELGUD_THEATRE_VENUE_UUID,
														name: 'Gielgud Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: TOTO_MATERIAL_UUID,
													name: 'Toto',
													format: 'play',
													year: 2008
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Longlisted',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Fred',
													startDate: '2010-02-01',
													endDate: '2010-02-28',
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
													uuid: FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: FRED_MATERIAL_UUID,
													name: 'Fred',
													format: 'play',
													year: 2010
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

	describe('Playwrights Ltd (company): single credit per nomination; single nomination per category', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: null,
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: TOTO_COTTESLOE_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-07-01',
													endDate: '2008-07-31',
													venue: {
														model: 'VENUE',
														uuid: COTTESLOE_THEATRE_VENUE_UUID,
														name: 'Cottesloe Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: TOTO_GIELGUD_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-08-01',
													endDate: '2008-08-31',
													venue: {
														model: 'VENUE',
														uuid: GIELGUD_THEATRE_VENUE_UUID,
														name: 'Gielgud Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: TOTO_MATERIAL_UUID,
													name: 'Toto',
													format: 'play',
													year: 2008
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Longlisted',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Fred',
													startDate: '2010-02-01',
													endDate: '2010-02-28',
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
													uuid: FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: FRED_MATERIAL_UUID,
													name: 'Fred',
													format: 'play',
													year: 2010
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

			const { awards } = playwrightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Clara Quux (person): multiple credits in same nomination', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-09-01',
													endDate: '2008-09-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PIYO_MATERIAL_UUID,
													name: 'Piyo',
													format: 'musical',
													year: 2008
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_SEVEN_AWARD_CEREMONY_UUID,
							name: '2007',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: null,
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: THUD_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Thud',
													startDate: '2007-03-01',
													endDate: '2007-03-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: THUD_MATERIAL_UUID,
													name: 'Thud',
													format: 'play',
													year: 2007
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Shortlisted',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-09-01',
													endDate: '2008-09-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: PIYO_WYNDHAMS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-10-01',
													endDate: '2008-10-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PIYO_MATERIAL_UUID,
													name: 'Piyo',
													format: 'musical',
													year: 2008
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Shortlisted',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: THUD_PLAYHOUSE_PRODUCTION_UUID,
													name: 'Thud',
													startDate: '2007-03-01',
													endDate: '2007-03-31',
													venue: {
														model: 'VENUE',
														uuid: PLAYHOUSE_THEATRE_VENUE_UUID,
														name: 'Playhouse Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: THUD_MATERIAL_UUID,
													name: 'Thud',
													format: 'play',
													year: 2007
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

			const { awards } = claraQuuxPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Songbirds Ltd (company): multiple credits in same nomination', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-09-01',
													endDate: '2008-09-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PIYO_MATERIAL_UUID,
													name: 'Piyo',
													format: 'musical',
													year: 2008
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Shortlisted',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PIYO_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-09-01',
													endDate: '2008-09-30',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: PIYO_WYNDHAMS_PRODUCTION_UUID,
													name: 'Piyo',
													startDate: '2008-10-01',
													endDate: '2008-10-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PIYO_MATERIAL_UUID,
													name: 'Piyo',
													format: 'musical',
													year: 2008
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

			const { awards } = songbirdsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Beatrice Bar (person): multiple nominations in same category', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: null,
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_SEVEN_AWARD_CEREMONY_UUID,
							name: '2007',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: GRAULT_GIELGUD_PRODUCTION_UUID,
													name: 'Grault',
													startDate: '2007-06-01',
													endDate: '2007-06-30',
													venue: {
														model: 'VENUE',
														uuid: GIELGUD_THEATRE_VENUE_UUID,
														name: 'Gielgud Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: GRAULT_MATERIAL_UUID,
													name: 'Grault',
													format: 'play',
													year: 2007
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Shortlisted',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: 'First Place',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008
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

			const { awards } = beatriceBarPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Theatricals Ltd (company): multiple nominations in same category', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008
												}
											]
										},
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Longlisted',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: 'First Place',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008
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

			const { awards } = theatricalsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Plugh (play, 1899) (material): subsequent versions have nominations', () => {

		it('includes awards of its subsequent versions', () => {

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: null,
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Shortlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009
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

			const { subsequentVersionMaterialAwards } = plughOriginalVersionMaterial.body;

			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Francis Flob (person): subsequent versions of their work have nominations', () => {

		it('includes awards of subsequent versions of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: null,
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Shortlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009
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

			const { awards, subsequentVersionMaterialAwards } = francisFlobPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Curtain Up Ltd (company): subsequent versions of their work have nominations', () => {

		it('includes awards of subsequent versions of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: null,
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID,
							name: '2010',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Shortlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: PLUGH_LYTTELTON_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													uuid: PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Plugh',
													format: 'play',
													year: 2009
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

			const { awards, subsequentVersionMaterialAwards } = curtainUpLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Waldo (novel, 1974) (material): materials that used it as source material have nominations', () => {

		it('includes awards of materials that used it as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Longlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009
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

			const { sourcingMaterialAwards } = waldoMaterial.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Jane Roe (person): materials that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Longlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009
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

			const { sourcingMaterialAwards } = janeRoePerson.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Fictioneers Ltd (company): materials that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: 'Longlisted',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-05-01',
													endDate: '2009-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Upstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: WIBBLE_MATERIAL_UUID,
													name: 'Wibble',
													format: 'play',
													year: 2009
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

			const { sourcingMaterialAwards } = fictioneersLtdCompany.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Brandon Baz (person): materials that used their (non-specific) work as source material have nominations', () => {

		it('includes awards of materials that used their (non-specific) work as source material', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: null,
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: TOTO_COTTESLOE_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-07-01',
													endDate: '2008-07-31',
													venue: {
														model: 'VENUE',
														uuid: COTTESLOE_THEATRE_VENUE_UUID,
														name: 'Cottesloe Theatre',
														surVenue: {
															model: 'VENUE',
															uuid: NATIONAL_THEATRE_VENUE_UUID,
															name: 'National Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: TOTO_GIELGUD_PRODUCTION_UUID,
													name: 'Toto',
													startDate: '2008-08-01',
													endDate: '2008-08-31',
													venue: {
														model: 'VENUE',
														uuid: GIELGUD_THEATRE_VENUE_UUID,
														name: 'Gielgud Theatre',
														surVenue: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: TOTO_MATERIAL_UUID,
													name: 'Toto',
													format: 'play',
													year: 2008
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

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_OLIVIER_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-11-01',
													endDate: '2008-11-30',
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
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2008
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: 'First Place',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_OLIVIER_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-11-01',
													endDate: '2008-11-30',
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
													uuid: XYZZY_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-12-01',
													endDate: '2008-12-31',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2008
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

			const { awards, sourcingMaterialAwards } = brandonBazPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Creators Ltd (company): materials that used their (non-specific) work as source material have nominations', () => {

		it('includes awards of materials that used their (non-specific) work as source material', () => {

			const expectedAwards = [];

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_OLIVIER_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-11-01',
													endDate: '2008-11-30',
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
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2008
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: 'First Place',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: XYZZY_OLIVIER_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-11-01',
													endDate: '2008-11-30',
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
													uuid: XYZZY_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Xyzzy',
													startDate: '2008-12-01',
													endDate: '2008-12-31',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: XYZZY_MATERIAL_UUID,
													name: 'Xyzzy',
													format: 'play',
													year: 2008
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

			const { awards, sourcingMaterialAwards } = creatorsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Talyse Tata (person): materials to which they have granted rights have nominations', () => {

		it('includes awards of materials to which they have granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: 'First Place',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008
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

			const { awards, rightsGrantorMaterialAwards } = talyseTataPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

	describe('Cinerights Ltd (company): materials to which they granted rights have nominations', () => {

		it('includes awards of materials to which they granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: PLAYWRITING_PRIZE_AWARD_UUID,
					name: 'Playwriting Prize',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Random Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											customType: null,
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008
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
					uuid: WORDSMITH_AWARD_UUID,
					name: 'Wordsmith Award',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: WORDSMITH_AWARD_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Best Miscellaneous Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											customType: 'First Place',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Hoge',
													startDate: '2008-05-01',
													endDate: '2008-05-31',
													venue: {
														model: 'VENUE',
														uuid: JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID,
														name: 'Jerwood Theatre Downstairs',
														surVenue: {
															model: 'VENUE',
															uuid: ROYAL_COURT_THEATRE_VENUE_UUID,
															name: 'Royal Court Theatre'
														}
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: HOGE_MATERIAL_UUID,
													name: 'Hoge',
													format: 'play',
													year: 2008
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

			const { awards, rightsGrantorMaterialAwards } = cinerightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

});

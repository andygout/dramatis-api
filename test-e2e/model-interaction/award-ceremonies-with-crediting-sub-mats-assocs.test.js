import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Award ceremonies with crediting sub-materials (with person/company/material nominations gained through associations to sur and sub-materials)', () => {

	chai.use(chaiHttp);

	const SUB_FRED_PART_I_MATERIAL_UUID = '4';
	const JOHN_DOE_JR_PERSON_UUID = '6';
	const SUB_PLAYWRIGHTS_LTD_COMPANY_UUID = '7';
	const SUB_FRED_PART_II_MATERIAL_UUID = '10';
	const SUR_FRED_MATERIAL_UUID = '20';
	const JOHN_DOE_SR_PERSON_UUID = '22';
	const SUR_PLAYWRIGHTS_LTD_COMPANY_UUID = '23';
	const SUB_PLUGH_PART_I_ORIGINAL_VERSION_MATERIAL_UUID = '30';
	const FRANCIS_FLOB_JR_PERSON_UUID = '32';
	const SUB_CURTAIN_UP_LTD_COMPANY_UUID = '33';
	const SUR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID = '46';
	const FRANCIS_FLOB_SR_PERSON_UUID = '48';
	const SUR_CURTAIN_UP_LTD_COMPANY_UUID = '49';
	const SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID = '58';
	const SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID = '66';
	const SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = '78';
	const SUB_WALDO_PART_I_MATERIAL_UUID = '90';
	const JANE_ROE_JR_PERSON_UUID = '92';
	const SUB_FICTIONEERS_LTD_COMPANY_UUID = '93';
	const SUR_WALDO_MATERIAL_UUID = '106';
	const JANE_ROE_SR_PERSON_UUID = '108';
	const SUR_FICTIONEERS_LTD_COMPANY_UUID = '109';
	const SUB_WIBBLE_PART_I_MATERIAL_UUID = '117';
	const SUB_WIBBLE_PART_II_MATERIAL_UUID = '124';
	const SUR_WIBBLE_MATERIAL_UUID = '135';
	const SUB_HOGE_PART_I_MATERIAL_UUID = '148';
	const SUB_CINERIGHTS_LTD_COMPANY_UUID = '152';
	const TALYSE_TATA_JR_PERSON_UUID = '153';
	const SUB_HOGE_PART_II_MATERIAL_UUID = '156';
	const SUR_HOGE_MATERIAL_UUID = '168';
	const SUR_CINERIGHTS_LTD_COMPANY_UUID = '172';
	const TALYSE_TATA_SR_PERSON_UUID = '173';
	const NATIONAL_THEATRE_VENUE_UUID = '181';
	const OLIVIER_THEATRE_VENUE_UUID = '182';
	const LYTTELTON_THEATRE_VENUE_UUID = '183';
	const ROYAL_COURT_THEATRE_VENUE_UUID = '189';
	const JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID = '190';
	const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = '191';
	const SUB_FRED_PART_I_LYTTELTON_PRODUCTION_UUID = '192';
	const SUR_FRED_LYTTELTON_PRODUCTION_UUID = '195';
	const SUB_FRED_PART_I_NOËL_COWARD_PRODUCTION_UUID = '198';
	const NOËL_COWARD_THEATRE_VENUE_UUID = '200';
	const SUR_FRED_NOËL_COWARD_PRODUCTION_UUID = '201';
	const SUB_PLUGH_PART_I_OLIVIER_PRODUCTION_UUID = '204';
	const SUR_PLUGH_OLIVIER_PRODUCTION_UUID = '207';
	const SUB_PLUGH_PART_I_WYNDHAMS_PRODUCTION_UUID = '210';
	const WYNDHAMS_THEATRE_VENUE_UUID = '212';
	const SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID = '213';
	const SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '216';
	const SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '219';
	const SUB_WIBBLE_PART_I_DUKE_OF_YORKS_PRODUCTION_UUID = '222';
	const DUKE_OF_YORKS_THEATRE_VENUE_UUID = '224';
	const SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID = '225';
	const SUB_HOGE_PART_I_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '228';
	const SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '231';
	const SUB_HOGE_PART_I_NOËL_COWARD_PRODUCTION_UUID = '234';
	const SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID = '237';
	const WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID = '246';
	const WORDSMITH_AWARD_UUID = '247';
	const PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID = '258';
	const PLAYWRITING_PRIZE_AWARD_UUID = '259';
	const SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID = '270';
	const SCRIPTING_SHIELD_AWARD_UUID = '271';

	let johnDoeJrPerson;
	let johnDoeSrPerson;
	let subPlaywrightsLtdCompany;
	let surPlaywrightsLtdCompany;
	let subPlughPartIOriginalVersionMaterial;
	let surPlughOriginalVersionMaterial;
	let francisFlobJrPerson;
	let francisFlobSrPerson;
	let subCurtainUpLtdCompany;
	let surCurtainUpLtdCompany;
	let subWaldoPartIMaterial;
	let surWaldoMaterial;
	let janeRoeJrPerson;
	let janeRoeSrPerson;
	let subFictioneersLtdCompany;
	let surFictioneersLtdCompany;
	let talyseTataJrPerson;
	let talyseTataSrPerson;
	let subCinerightsLtdCompany;
	let surCinerightsLtdCompany;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Fred: Part I',
				format: 'play',
				year: '2010',
				writingCredits: [
					{
						entities: [
							{
								name: 'John Doe Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Playwrights Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Fred: Part II',
				format: 'play',
				year: '2010'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Fred',
				format: 'collection of plays',
				year: '2010',
				writingCredits: [
					{
						entities: [
							{
								name: 'John Doe Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Playwrights Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Fred: Part I'
					},
					{
						name: 'Sub-Fred: Part II'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh: Part I',
				differentiator: '1',
				format: 'play',
				year: '1899',
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Curtain Up Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh: Part II',
				differentiator: '1',
				format: 'play',
				year: '1899'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Plugh',
				differentiator: '1',
				format: 'collection of plays',
				year: '1899',
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Curtain Up Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Plugh: Part I',
						differentiator: '1'
					},
					{
						name: 'Sub-Plugh: Part II',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh: Part I',
				differentiator: '2',
				format: 'play',
				year: '2009',
				originalVersionMaterial: {
					name: 'Sub-Plugh: Part I',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Curtain Up Ltd'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Beatrice Bar Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Stagecraft Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh: Part II',
				differentiator: '2',
				format: 'play',
				year: '2009',
				originalVersionMaterial: {
					name: 'Sub-Plugh: Part II',
					differentiator: '1'
				}
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Plugh',
				differentiator: '2',
				format: 'collection of plays',
				year: '2009',
				originalVersionMaterial: {
					name: 'Sur-Plugh',
					differentiator: '1'
				},
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Curtain Up Ltd'
							}
						]
					},
					{
						name: 'version by',
						entities: [
							{
								name: 'Beatrice Bar Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Stagecraft Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Plugh: Part I',
						differentiator: '2'
					},
					{
						name: 'Sub-Plugh: Part II',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Waldo: Part I',
				format: 'novel',
				year: '1974',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jane Roe Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Fictioneers Ltd'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Waldo: Part II',
				format: 'novel',
				year: '1974'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Waldo',
				format: 'trilogy of novels',
				year: '1974',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jane Roe Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Fictioneers Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Waldo: Part I'
					},
					{
						name: 'Sub-Waldo: Part II'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble: Part I',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Theatricals Ltd'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Sub-Waldo: Part I'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble: Part II',
				format: 'play',
				year: '2009'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Wibble',
				format: 'trilogy of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Theatricals Ltd'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Sur-Waldo'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Wibble: Part I'
					},
					{
						name: 'Sub-Wibble: Part II'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Hoge: Part I',
				format: 'play',
				year: '2008',
				writingCredits: [
					{
						entities: [
							{
								name: 'Beatrice Bar Jr'
							},
							{
								model: 'COMPANY',
								name: 'Sub-Theatricals Ltd'
							}
						]
					},
					{
						name: 'by arrangement with',
						creditType: 'RIGHTS_GRANTOR',
						entities: [
							{
								model: 'COMPANY',
								name: 'Sub-Cinerights Ltd'
							},
							{
								name: 'Talyse Tata Jr'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Hoge: Part II',
				format: 'play',
				year: '2008'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Hoge',
				format: 'collection of plays',
				year: '2008',
				writingCredits: [
					{
						entities: [
							{
								name: 'Beatrice Bar Sr'
							},
							{
								model: 'COMPANY',
								name: 'Sur-Theatricals Ltd'
							}
						]
					},
					{
						name: 'by arrangement with',
						creditType: 'RIGHTS_GRANTOR',
						entities: [
							{
								model: 'COMPANY',
								name: 'Sur-Cinerights Ltd'
							},
							{
								name: 'Talyse Tata Sr'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Hoge: Part I'
					},
					{
						name: 'Sub-Hoge: Part II'
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
				name: 'Sub-Fred: Part I',
				startDate: '2010-02-01',
				endDate: '2010-02-28',
				venue: {
					name: 'Lyttelton Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Fred',
				startDate: '2010-02-01',
				endDate: '2010-02-28',
				venue: {
					name: 'Lyttelton Theatre'
				},
				subProductions: [
					{
						uuid: SUB_FRED_PART_I_LYTTELTON_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Fred: Part I',
				startDate: '2010-03-01',
				endDate: '2010-03-31',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Fred',
				startDate: '2010-03-01',
				endDate: '2010-03-31',
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: SUB_FRED_PART_I_NOËL_COWARD_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Plugh: Part I',
				startDate: '2009-07-01',
				endDate: '2009-07-31',
				venue: {
					name: 'Olivier Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Plugh',
				startDate: '2009-07-01',
				endDate: '2009-07-31',
				venue: {
					name: 'Olivier Theatre'
				},
				subProductions: [
					{
						uuid: SUB_PLUGH_PART_I_OLIVIER_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Plugh: Part I',
				startDate: '2009-08-01',
				endDate: '2009-08-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Plugh',
				startDate: '2009-08-01',
				endDate: '2009-08-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				},
				subProductions: [
					{
						uuid: SUB_PLUGH_PART_I_WYNDHAMS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part I',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Wibble',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part I',
				startDate: '2009-06-01',
				endDate: '2009-06-30',
				venue: {
					name: 'Duke of York\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Wibble',
				startDate: '2009-06-01',
				endDate: '2009-06-30',
				venue: {
					name: 'Duke of York\'s Theatre'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_PART_I_DUKE_OF_YORKS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Hoge: Part I',
				startDate: '2008-05-01',
				endDate: '2008-05-31',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Hoge',
				startDate: '2008-05-01',
				endDate: '2008-05-31',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				},
				subProductions: [
					{
						uuid: SUB_HOGE_PART_I_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Hoge: Part I',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Hoge',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: SUB_HOGE_PART_I_NOËL_COWARD_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
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
								productions: [
									{
										uuid: SUB_FRED_PART_I_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: SUB_FRED_PART_I_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Fred: Part I'
									}
								]
							},
							{
								productions: [
									{
										uuid: SUB_PLUGH_PART_I_OLIVIER_PRODUCTION_UUID
									},
									{
										uuid: SUB_PLUGH_PART_I_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Plugh: Part I',
										differentiator: '2'
									}
								]
							},
							{
								productions: [
									{
										uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: SUB_WIBBLE_PART_I_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Wibble: Part I'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: SUB_HOGE_PART_I_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: SUB_HOGE_PART_I_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Hoge: Part I'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
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
										uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Fred'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID
									},
									{
										uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Plugh',
										differentiator: '2'
									}
								]
							},
							{
								productions: [
									{
										uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Wibble'
									}
								]
							},
							{
								productions: [
									{
										uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sur-Hoge'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/award-ceremonies')
			.send({
				name: '2009',
				award: {
					name: 'Scripting Shield'
				},
				categories: [
					{
						name: 'Most Notable Play',
						nominations: [
							{
								materials: [
									{
										name: 'Sub-Fred: Part II'
									}
								]
							},
							{
								isWinner: true,
								materials: [
									{
										name: 'Sub-Plugh: Part II',
										differentiator: '2'
									}
								]
							},
							{
								materials: [
									{
										name: 'Sub-Wibble: Part II'
									}
								]
							},
							{
								materials: [
									{
										name: 'Sub-Hoge: Part II'
									}
								]
							}
						]
					}
				]
			});

		johnDoeJrPerson = await chai.request(app)
			.get(`/people/${JOHN_DOE_JR_PERSON_UUID}`);

		johnDoeSrPerson = await chai.request(app)
			.get(`/people/${JOHN_DOE_SR_PERSON_UUID}`);

		subPlaywrightsLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_PLAYWRIGHTS_LTD_COMPANY_UUID}`);

		surPlaywrightsLtdCompany = await chai.request(app)
			.get(`/companies/${SUR_PLAYWRIGHTS_LTD_COMPANY_UUID}`);

		subPlughPartIOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${SUB_PLUGH_PART_I_ORIGINAL_VERSION_MATERIAL_UUID}`);

		surPlughOriginalVersionMaterial = await chai.request(app)
			.get(`/materials/${SUR_PLUGH_ORIGINAL_VERSION_MATERIAL_UUID}`);

		francisFlobJrPerson = await chai.request(app)
			.get(`/people/${FRANCIS_FLOB_JR_PERSON_UUID}`);

		francisFlobSrPerson = await chai.request(app)
			.get(`/people/${FRANCIS_FLOB_SR_PERSON_UUID}`);

		subCurtainUpLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_CURTAIN_UP_LTD_COMPANY_UUID}`);

		surCurtainUpLtdCompany = await chai.request(app)
			.get(`/companies/${SUR_CURTAIN_UP_LTD_COMPANY_UUID}`);

		subWaldoPartIMaterial = await chai.request(app)
			.get(`/materials/${SUB_WALDO_PART_I_MATERIAL_UUID}`);

		surWaldoMaterial = await chai.request(app)
			.get(`/materials/${SUR_WALDO_MATERIAL_UUID}`);

		janeRoeJrPerson = await chai.request(app)
			.get(`/people/${JANE_ROE_JR_PERSON_UUID}`);

		janeRoeSrPerson = await chai.request(app)
			.get(`/people/${JANE_ROE_SR_PERSON_UUID}`);

		subFictioneersLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_FICTIONEERS_LTD_COMPANY_UUID}`);

		surFictioneersLtdCompany = await chai.request(app)
			.get(`/companies/${SUR_FICTIONEERS_LTD_COMPANY_UUID}`);

		talyseTataJrPerson = await chai.request(app)
			.get(`/people/${TALYSE_TATA_JR_PERSON_UUID}`);

		talyseTataSrPerson = await chai.request(app)
			.get(`/people/${TALYSE_TATA_SR_PERSON_UUID}`);

		subCinerightsLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_CINERIGHTS_LTD_COMPANY_UUID}`);

		surCinerightsLtdCompany = await chai.request(app)
			.get(`/companies/${SUR_CINERIGHTS_LTD_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('John Doe Jr (person): credit for directly nominated material and their associated sur-material', () => {

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
											type: 'Nomination',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sur-Fred',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_FRED_MATERIAL_UUID,
													name: 'Sur-Fred',
													format: 'collection of plays',
													year: 2010,
													surMaterial: null
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
											type: 'Nomination',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_PART_I_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_PART_I_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred: Part I',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_PART_I_MATERIAL_UUID,
													name: 'Sub-Fred: Part I',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_FRED_MATERIAL_UUID,
														name: 'Sur-Fred',
														surMaterial: null
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

			const { awards } = johnDoeJrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('John Doe Sr (person): credit for directly nominated material and their associated sub-material', () => {

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
											type: 'Nomination',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sur-Fred',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_FRED_MATERIAL_UUID,
													name: 'Sur-Fred',
													format: 'collection of plays',
													year: 2010,
													surMaterial: null
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
					uuid: SCRIPTING_SHIELD_AWARD_UUID,
					name: 'Scripting Shield',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											employerCompany: null,
											coEntities: [],
											productions: [],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_PART_II_MATERIAL_UUID,
													name: 'Sub-Fred: Part II',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_FRED_MATERIAL_UUID,
														name: 'Sur-Fred',
														surMaterial: null
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
											type: 'Nomination',
											employerCompany: null,
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_PART_I_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_PART_I_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred: Part I',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_PART_I_MATERIAL_UUID,
													name: 'Sub-Fred: Part I',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_FRED_MATERIAL_UUID,
														name: 'Sur-Fred',
														surMaterial: null
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

			const { awards } = johnDoeSrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sub-Playwrights Ltd (company): credit for directly nominated material and their associated sur-material', () => {

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
											type: 'Nomination',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sur-Fred',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_FRED_MATERIAL_UUID,
													name: 'Sur-Fred',
													format: 'collection of plays',
													year: 2010,
													surMaterial: null
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
											type: 'Nomination',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_PART_I_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_PART_I_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred: Part I',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_PART_I_MATERIAL_UUID,
													name: 'Sub-Fred: Part I',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_FRED_MATERIAL_UUID,
														name: 'Sur-Fred',
														surMaterial: null
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

			const { awards } = subPlaywrightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Playwrights Ltd (company): credit for directly nominated material and their associated sub-material', () => {

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
											type: 'Nomination',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sur-Fred',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Fred',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUR_FRED_MATERIAL_UUID,
													name: 'Sur-Fred',
													format: 'collection of plays',
													year: 2010,
													surMaterial: null
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
					uuid: SCRIPTING_SHIELD_AWARD_UUID,
					name: 'Scripting Shield',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											members: [],
											coEntities: [],
											productions: [],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_PART_II_MATERIAL_UUID,
													name: 'Sub-Fred: Part II',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_FRED_MATERIAL_UUID,
														name: 'Sur-Fred',
														surMaterial: null
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
											type: 'Nomination',
											members: [],
											coEntities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_PART_I_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_PART_I_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred: Part I',
													startDate: '2010-03-01',
													endDate: '2010-03-31',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Fred',
														surProduction: null
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_PART_I_MATERIAL_UUID,
													name: 'Sub-Fred: Part I',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_FRED_MATERIAL_UUID,
														name: 'Sur-Fred',
														surMaterial: null
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

			const { awards } = surPlaywrightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sub-Plugh: Part I (play, 1899) (material): subsequent versions have nominations', () => {

		it('includes awards of its subsequent versions (and their respective sur-material) and its sur-material\'s subsequent versions', () => {

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
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
													year: 2009,
													surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
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

			const { subsequentVersionMaterialAwards } = subPlughPartIOriginalVersionMaterial.body;

			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Sur-Plugh (collection of plays, 1899) (material): subsequent versions have nominations', () => {

		it('includes awards of its subsequent versions (and their respective sub-materials) and its sub-materials\' subsequent versions', () => {

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
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
													year: 2009,
													surMaterial: null
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
					uuid: SCRIPTING_SHIELD_AWARD_UUID,
					name: 'Scripting Shield',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh: Part II',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
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

			const { subsequentVersionMaterialAwards } = surPlughOriginalVersionMaterial.body;

			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Francis Flob Jr (person): subsequent versions (and their associated sur-material) of their work have nominations', () => {

		it('includes awards of subsequent versions (and their associated sur-material) of their work', () => {

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
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
													year: 2009,
													surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
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

			const { awards, subsequentVersionMaterialAwards } = francisFlobJrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Francis Flob Sr (person): subsequent versions (and their associated sub-materials) of their work have nominations', () => {

		it('includes awards of subsequent versions (and their associated sub-materials) of their work', () => {

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
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
													year: 2009,
													surMaterial: null
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
					uuid: SCRIPTING_SHIELD_AWARD_UUID,
					name: 'Scripting Shield',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh: Part II',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
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

			const { awards, subsequentVersionMaterialAwards } = francisFlobSrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Sub-Curtain Up Ltd (company): subsequent versions (and their associated sur-material) of their work have nominations', () => {

		it('includes awards of subsequent versions (and their associated sur-material) of their work', () => {

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
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
													year: 2009,
													surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
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

			const { awards, subsequentVersionMaterialAwards } = subCurtainUpLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Sur-Curtain Up Ltd (company): subsequent versions (and their associated sub-materials) of their work have nominations', () => {

		it('includes awards of subsequent versions (and their associated sub-materials) of their work', () => {

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
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sur-Plugh',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sur-Plugh',
													format: 'collection of plays',
													year: 2009,
													surMaterial: null
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
					uuid: SCRIPTING_SHIELD_AWARD_UUID,
					name: 'Scripting Shield',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_PART_II_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh: Part II',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-07-01',
													endDate: '2009-07-31',
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
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_PART_I_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh: Part I',
													startDate: '2009-08-01',
													endDate: '2009-08-31',
													venue: {
														model: 'VENUE',
														uuid: WYNDHAMS_THEATRE_VENUE_UUID,
														name: 'Wyndham\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Sur-Plugh',
														surProduction: null
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_PART_I_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Sur-Plugh',
														surMaterial: null
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

			const { awards, subsequentVersionMaterialAwards } = surCurtainUpLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Sub-Waldo: Part I (novel, 1974) (material): materials that used it as source material have nominations', () => {

		it('includes awards of materials (and their respective sur-material) that used it or its sur-material as source material', () => {

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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of plays',
													year: 2009,
													surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
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

			const { sourcingMaterialAwards } = subWaldoPartIMaterial.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Sur-Waldo (trilogy of novels, 1974) (material): materials that used it as source material have nominations', () => {

		it('includes awards of materials (and their respective sub-materials) that used it or its sub-materials as source material', () => {

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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of plays',
													year: 2009,
													surMaterial: null
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
					uuid: SCRIPTING_SHIELD_AWARD_UUID,
					name: 'Scripting Shield',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
													name: 'Sub-Wibble: Part II',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
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

			const { sourcingMaterialAwards } = surWaldoMaterial.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Jane Roe Jr (person): materials (and their associated sur-material) that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials (and their associated sur-material) that used their (specific) work as source material', () => {

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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of plays',
													year: 2009,
													surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
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

			const { sourcingMaterialAwards } = janeRoeJrPerson.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Jane Roe Sr (person): materials (and their associated sub-materials) that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials (and their associated sub-materials) that used their (specific) work as source material', () => {

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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of plays',
													year: 2009,
													surMaterial: null
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
					uuid: SCRIPTING_SHIELD_AWARD_UUID,
					name: 'Scripting Shield',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
													name: 'Sub-Wibble: Part II',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
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

			const { sourcingMaterialAwards } = janeRoeSrPerson.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Sub-Fictioneers Ltd (company): materials (and their associated sur-material) that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials (and their associated sur-material) that used their (specific) work as source material', () => {

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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of plays',
													year: 2009,
													surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
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

			const { sourcingMaterialAwards } = subFictioneersLtdCompany.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Sur-Fictioneers Ltd (company): materials (and their associated sub-materials) that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials (and their associated sub-materials) that used their (specific) work as source material', () => {

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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sur-Wibble',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_WIBBLE_MATERIAL_UUID,
													name: 'Sur-Wibble',
													format: 'trilogy of plays',
													year: 2009,
													surMaterial: null
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
					uuid: SCRIPTING_SHIELD_AWARD_UUID,
					name: 'Scripting Shield',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_II_MATERIAL_UUID,
													name: 'Sub-Wibble: Part II',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_PART_I_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble: Part I',
													startDate: '2009-06-01',
													endDate: '2009-06-30',
													venue: {
														model: 'VENUE',
														uuid: DUKE_OF_YORKS_THEATRE_VENUE_UUID,
														name: 'Duke of York\'s Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Sur-Wibble',
														surProduction: null
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_PART_I_MATERIAL_UUID,
													name: 'Sub-Wibble: Part I',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_WIBBLE_MATERIAL_UUID,
														name: 'Sur-Wibble',
														surMaterial: null
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

			const { sourcingMaterialAwards } = surFictioneersLtdCompany.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Talyse Tata Jr (person): materials (and their associated sur-material) to which they have granted rights have nominations', () => {

		it('includes awards of materials (and their associated sur-material) to which they have granted rights', () => {

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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Hoge',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2008,
													surMaterial: null
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
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_PART_I_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_PART_I_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge: Part I',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_PART_I_MATERIAL_UUID,
													name: 'Sub-Hoge: Part I',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
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

			const { awards, rightsGrantorMaterialAwards } = talyseTataJrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

	describe('Talyse Tata Sr (person): materials (and their associated sub-materials) to which they have granted rights have nominations', () => {

		it('includes awards of materials (and their associated sub-materials) to which they have granted rights', () => {

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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Hoge',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2008,
													surMaterial: null
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
					uuid: SCRIPTING_SHIELD_AWARD_UUID,
					name: 'Scripting Shield',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_PART_II_MATERIAL_UUID,
													name: 'Sub-Hoge: Part II',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
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
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_PART_I_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_PART_I_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge: Part I',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_PART_I_MATERIAL_UUID,
													name: 'Sub-Hoge: Part I',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
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

			const { awards, rightsGrantorMaterialAwards } = talyseTataSrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

	describe('Sub-Cinerights Ltd (company): materials (and their associated sur-material) to which they granted rights have nominations', () => {

		it('includes awards of materials (and their associated sur-material) to which they granted rights', () => {

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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Hoge',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2008,
													surMaterial: null
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
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_PART_I_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_PART_I_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge: Part I',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_PART_I_MATERIAL_UUID,
													name: 'Sub-Hoge: Part I',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
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

			const { awards, rightsGrantorMaterialAwards } = subCinerightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

	describe('Sur-Cinerights Ltd (company): materials (and their associated sub-materials) to which they granted rights have nominations', () => {

		it('includes awards of materials (and their associated sub-materials) to which they granted rights', () => {

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
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sur-Hoge',
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
													},
													surProduction: null
												},
												{
													model: 'PRODUCTION',
													uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sur-Hoge',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: null
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUR_HOGE_MATERIAL_UUID,
													name: 'Sur-Hoge',
													format: 'collection of plays',
													year: 2008,
													surMaterial: null
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
					uuid: SCRIPTING_SHIELD_AWARD_UUID,
					name: 'Scripting Shield',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: SCRIPTING_SHIELD_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID,
							name: '2009',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Notable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_PART_II_MATERIAL_UUID,
													name: 'Sub-Hoge: Part II',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
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
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_PART_I_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge: Part I',
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
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_PART_I_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge: Part I',
													startDate: '2008-06-01',
													endDate: '2008-06-30',
													venue: {
														model: 'VENUE',
														uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
														name: 'Noël Coward Theatre',
														surVenue: null
													},
													surProduction: {
														model: 'PRODUCTION',
														uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Sur-Hoge',
														surProduction: null
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_PART_I_MATERIAL_UUID,
													name: 'Sub-Hoge: Part I',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: SUR_HOGE_MATERIAL_UUID,
														name: 'Sur-Hoge',
														surMaterial: null
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

			const { awards, rightsGrantorMaterialAwards } = surCinerightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

});

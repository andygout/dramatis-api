import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Award ceremonies with crediting sub-sub-materials (with person/company nominations gained through associations to sur-sur and sub-sub-materials)', () => {

	chai.use(chaiHttp);

	const SUB_FRED_MATERIAL_UUID = '4';
	const JOHN_DOE_JR_PERSON_UUID = '6';
	const SUB_PLAYWRIGHTS_LTD_COMPANY_UUID = '7';
	const MID_FRED_MATERIAL_UUID = '14';
	const JOHN_DOE_PERSON_UUID = '16';
	const MID_PLAYWRIGHTS_LTD_COMPANY_UUID = '17';
	const SUR_FRED_MATERIAL_UUID = '25';
	const JOHN_DOE_SR_PERSON_UUID = '27';
	const SUR_PLAYWRIGHTS_LTD_COMPANY_UUID = '28';
	const FRANCIS_FLOB_JR_PERSON_UUID = '36';
	const SUB_CURTAIN_UP_LTD_COMPANY_UUID = '37';
	const FRANCIS_FLOB_PERSON_UUID = '46';
	const MID_CURTAIN_UP_LTD_COMPANY_UUID = '47';
	const FRANCIS_FLOB_SR_PERSON_UUID = '57';
	const SUR_CURTAIN_UP_LTD_COMPANY_UUID = '58';
	const SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = '66';
	const MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = '80';
	const SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID = '95';
	const JANE_ROE_JR_PERSON_UUID = '108';
	const SUB_FICTIONEERS_LTD_COMPANY_UUID = '109';
	const JANE_ROE_PERSON_UUID = '118';
	const MID_FICTIONEERS_LTD_COMPANY_UUID = '119';
	const JANE_ROE_SR_PERSON_UUID = '129';
	const SUR_FICTIONEERS_LTD_COMPANY_UUID = '130';
	const SUB_WIBBLE_MATERIAL_UUID = '137';
	const MID_WIBBLE_MATERIAL_UUID = '149';
	const SUR_WIBBLE_MATERIAL_UUID = '162';
	const SUB_HOGE_MATERIAL_UUID = '174';
	const SUB_CINERIGHTS_LTD_COMPANY_UUID = '178';
	const TALYSE_TATA_JR_PERSON_UUID = '179';
	const MID_HOGE_MATERIAL_UUID = '188';
	const MID_CINERIGHTS_LTD_COMPANY_UUID = '192';
	const TALYSE_TATA_PERSON_UUID = '193';
	const SUR_HOGE_MATERIAL_UUID = '203';
	const SUR_CINERIGHTS_LTD_COMPANY_UUID = '207';
	const TALYSE_TATA_SR_PERSON_UUID = '208';
	const NATIONAL_THEATRE_VENUE_UUID = '213';
	const OLIVIER_THEATRE_VENUE_UUID = '214';
	const LYTTELTON_THEATRE_VENUE_UUID = '215';
	const ROYAL_COURT_THEATRE_VENUE_UUID = '219';
	const JERWOOD_THEATRE_DOWNSTAIRS_VENUE_UUID = '220';
	const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = '221';
	const SUB_FRED_LYTTELTON_PRODUCTION_UUID = '222';
	const MID_FRED_LYTTELTON_PRODUCTION_UUID = '225';
	const SUR_FRED_LYTTELTON_PRODUCTION_UUID = '228';
	const SUB_FRED_NOËL_COWARD_PRODUCTION_UUID = '231';
	const NOËL_COWARD_THEATRE_VENUE_UUID = '233';
	const MID_FRED_NOËL_COWARD_PRODUCTION_UUID = '234';
	const SUR_FRED_NOËL_COWARD_PRODUCTION_UUID = '237';
	const SUB_PLUGH_OLIVIER_PRODUCTION_UUID = '240';
	const MID_PLUGH_OLIVIER_PRODUCTION_UUID = '243';
	const SUR_PLUGH_OLIVIER_PRODUCTION_UUID = '246';
	const SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID = '249';
	const WYNDHAMS_THEATRE_VENUE_UUID = '251';
	const MID_PLUGH_WYNDHAMS_PRODUCTION_UUID = '252';
	const SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID = '255';
	const SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '258';
	const MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '261';
	const SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '264';
	const SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID = '267';
	const DUKE_OF_YORKS_THEATRE_VENUE_UUID = '269';
	const MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID = '270';
	const SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID = '273';
	const SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '276';
	const MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '279';
	const SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID = '282';
	const SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID = '285';
	const MID_HOGE_NOËL_COWARD_PRODUCTION_UUID = '288';
	const SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID = '291';
	const WORDSMITH_AWARD_TWO_THOUSAND_AND_TEN_AWARD_CEREMONY_UUID = '300';
	const WORDSMITH_AWARD_UUID = '301';
	const PLAYWRITING_PRIZE_TWO_THOUSAND_AND_NINE_AWARD_CEREMONY_UUID = '312';
	const PLAYWRITING_PRIZE_AWARD_UUID = '313';
	const DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID = '324';
	const DRAMATISTS_MEDAL_AWARD_UUID = '325';

	let johnDoeJrPerson;
	let johnDoePerson;
	let johnDoeSrPerson;
	let subPlaywrightsLtdCompany;
	let midPlaywrightsLtdCompany;
	let surPlaywrightsLtdCompany;
	let francisFlobJrPerson;
	let francisFlobPerson;
	let francisFlobSrPerson;
	let subCurtainUpLtdCompany;
	let midCurtainUpLtdCompany;
	let surCurtainUpLtdCompany;
	let janeRoeJrPerson;
	let janeRoePerson;
	let janeRoeSrPerson;
	let subFictioneersLtdCompany;
	let midFictioneersLtdCompany;
	let surFictioneersLtdCompany;
	let talyseTataJrPerson;
	let talyseTataPerson;
	let talyseTataSrPerson;
	let subCinerightsLtdCompany;
	let midCinerightsLtdCompany;
	let surCinerightsLtdCompany;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Fred',
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
				name: 'Mid-Fred',
				format: 'sub-collection of plays',
				year: '2010',
				writingCredits: [
					{
						entities: [
							{
								name: 'John Doe'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Playwrights Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Fred'
					}
				]
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
						name: 'Mid-Fred'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh',
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
				name: 'Mid-Plugh',
				differentiator: '1',
				format: 'sub-collection of plays',
				year: '1899',
				writingCredits: [
					{
						entities: [
							{
								name: 'Francis Flob'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Curtain Up Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Plugh',
						differentiator: '1'
					}
				]
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
						name: 'Mid-Plugh',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Plugh',
				differentiator: '2',
				format: 'play',
				year: '2009',
				originalVersionMaterial: {
					name: 'Sub-Plugh',
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
				name: 'Mid-Plugh',
				differentiator: '2',
				format: 'sub-collection of plays',
				year: '2009',
				originalVersionMaterial: {
					name: 'Mid-Plugh',
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
								name: 'Mid-Curtain Up Ltd'
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
								name: 'Mid-Stagecraft Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Plugh',
						differentiator: '2'
					}
				]
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
						name: 'Mid-Plugh',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Waldo',
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
				name: 'Mid-Waldo',
				format: 'sub-trilogy of novels',
				year: '1974',
				writingCredits: [
					{
						entities: [
							{
								name: 'Jane Roe'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Fictioneers Ltd'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Waldo'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Waldo',
				format: 'trilogy of trilogies of novels',
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
						name: 'Mid-Waldo'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Wibble',
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
								name: 'Sub-Waldo'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mid-Wibble',
				format: 'sub-trilogy of plays',
				year: '2009',
				writingCredits: [
					{
						entities: [
							{
								name: 'Quincy Qux'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Theatricals Ltd'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Mid-Waldo'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Wibble'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sur-Wibble',
				format: 'trilogy of trilogies of plays',
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
						name: 'Mid-Wibble'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Sub-Hoge',
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
				name: 'Mid-Hoge',
				format: 'sub-collection of plays',
				year: '2008',
				writingCredits: [
					{
						entities: [
							{
								name: 'Beatrice Bar'
							},
							{
								model: 'COMPANY',
								name: 'Mid-Theatricals Ltd'
							}
						]
					},
					{
						name: 'by arrangement with',
						creditType: 'RIGHTS_GRANTOR',
						entities: [
							{
								model: 'COMPANY',
								name: 'Mid-Cinerights Ltd'
							},
							{
								name: 'Talyse Tata'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'Sub-Hoge'
					}
				]
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
						name: 'Mid-Hoge'
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
				name: 'Sub-Fred',
				startDate: '2010-02-01',
				endDate: '2010-02-28',
				venue: {
					name: 'Lyttelton Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Fred',
				startDate: '2010-02-01',
				endDate: '2010-02-28',
				venue: {
					name: 'Lyttelton Theatre'
				},
				subProductions: [
					{
						uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID
					}
				]
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
						uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Fred',
				startDate: '2010-03-01',
				endDate: '2010-03-31',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Fred',
				startDate: '2010-03-01',
				endDate: '2010-03-31',
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID
					}
				]
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
						uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Plugh',
				startDate: '2009-07-01',
				endDate: '2009-07-31',
				venue: {
					name: 'Olivier Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Plugh',
				startDate: '2009-07-01',
				endDate: '2009-07-31',
				venue: {
					name: 'Olivier Theatre'
				},
				subProductions: [
					{
						uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID
					}
				]
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
						uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Plugh',
				startDate: '2009-08-01',
				endDate: '2009-08-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Plugh',
				startDate: '2009-08-01',
				endDate: '2009-08-31',
				venue: {
					name: 'Wyndham\'s Theatre'
				},
				subProductions: [
					{
						uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID
					}
				]
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
						uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Wibble',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
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
						uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble',
				startDate: '2009-06-01',
				endDate: '2009-06-30',
				venue: {
					name: 'Duke of York\'s Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Wibble',
				startDate: '2009-06-01',
				endDate: '2009-06-30',
				venue: {
					name: 'Duke of York\'s Theatre'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
					}
				]
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
						uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Hoge',
				startDate: '2008-05-01',
				endDate: '2008-05-31',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Hoge',
				startDate: '2008-05-01',
				endDate: '2008-05-31',
				venue: {
					name: 'Jerwood Theatre Downstairs'
				},
				subProductions: [
					{
						uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
					}
				]
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
						uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Hoge',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				venue: {
					name: 'Noël Coward Theatre'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Hoge',
				startDate: '2008-06-01',
				endDate: '2008-06-30',
				venue: {
					name: 'Noël Coward Theatre'
				},
				subProductions: [
					{
						uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID
					}
				]
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
						uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID
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
										uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Fred'
									}
								]
							},
							{
								productions: [
									{
										uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID
									},
									{
										uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Plugh',
										differentiator: '2'
									}
								]
							},
							{
								productions: [
									{
										uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Wibble'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Sub-Hoge'
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
				name: '2008',
				award: {
					name: 'Dramatists Medal'
				},
				categories: [
					{
						name: 'Most Remarkable Play',
						nominations: [
							{
								productions: [
									{
										uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID
									},
									{
										uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Mid-Fred'
									}
								]
							},
							{
								productions: [
									{
										uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID
									},
									{
										uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Mid-Plugh',
										differentiator: '2'
									}
								]
							},
							{
								isWinner: true,
								productions: [
									{
										uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Mid-Wibble'
									}
								]
							},
							{
								productions: [
									{
										uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID
									},
									{
										uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID
									}
								],
								materials: [
									{
										name: 'Mid-Hoge'
									}
								]
							}
						]
					}
				]
			});

		johnDoeJrPerson = await chai.request(app)
			.get(`/people/${JOHN_DOE_JR_PERSON_UUID}`);

		johnDoePerson = await chai.request(app)
			.get(`/people/${JOHN_DOE_PERSON_UUID}`);

		johnDoeSrPerson = await chai.request(app)
			.get(`/people/${JOHN_DOE_SR_PERSON_UUID}`);

		subPlaywrightsLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_PLAYWRIGHTS_LTD_COMPANY_UUID}`);

		midPlaywrightsLtdCompany = await chai.request(app)
			.get(`/companies/${MID_PLAYWRIGHTS_LTD_COMPANY_UUID}`);

		surPlaywrightsLtdCompany = await chai.request(app)
			.get(`/companies/${SUR_PLAYWRIGHTS_LTD_COMPANY_UUID}`);

		francisFlobJrPerson = await chai.request(app)
			.get(`/people/${FRANCIS_FLOB_JR_PERSON_UUID}`);

		francisFlobPerson = await chai.request(app)
			.get(`/people/${FRANCIS_FLOB_PERSON_UUID}`);

		francisFlobSrPerson = await chai.request(app)
			.get(`/people/${FRANCIS_FLOB_SR_PERSON_UUID}`);

		subCurtainUpLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_CURTAIN_UP_LTD_COMPANY_UUID}`);

		midCurtainUpLtdCompany = await chai.request(app)
			.get(`/companies/${MID_CURTAIN_UP_LTD_COMPANY_UUID}`);

		surCurtainUpLtdCompany = await chai.request(app)
			.get(`/companies/${SUR_CURTAIN_UP_LTD_COMPANY_UUID}`);

		janeRoeJrPerson = await chai.request(app)
			.get(`/people/${JANE_ROE_JR_PERSON_UUID}`);

		janeRoePerson = await chai.request(app)
			.get(`/people/${JANE_ROE_PERSON_UUID}`);

		janeRoeSrPerson = await chai.request(app)
			.get(`/people/${JANE_ROE_SR_PERSON_UUID}`);

		subFictioneersLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_FICTIONEERS_LTD_COMPANY_UUID}`);

		midFictioneersLtdCompany = await chai.request(app)
			.get(`/companies/${MID_FICTIONEERS_LTD_COMPANY_UUID}`);

		surFictioneersLtdCompany = await chai.request(app)
			.get(`/companies/${SUR_FICTIONEERS_LTD_COMPANY_UUID}`);

		talyseTataJrPerson = await chai.request(app)
			.get(`/people/${TALYSE_TATA_JR_PERSON_UUID}`);

		talyseTataPerson = await chai.request(app)
			.get(`/people/${TALYSE_TATA_PERSON_UUID}`);

		talyseTataSrPerson = await chai.request(app)
			.get(`/people/${TALYSE_TATA_SR_PERSON_UUID}`);

		subCinerightsLtdCompany = await chai.request(app)
			.get(`/companies/${SUB_CINERIGHTS_LTD_COMPANY_UUID}`);

		midCinerightsLtdCompany = await chai.request(app)
			.get(`/companies/${MID_CINERIGHTS_LTD_COMPANY_UUID}`);

		surCinerightsLtdCompany = await chai.request(app)
			.get(`/companies/${SUR_CINERIGHTS_LTD_COMPANY_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('John Doe Jr (person): credit for directly nominated material and their associated sur-material and sur-sur-material', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
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
													uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_MATERIAL_UUID,
													name: 'Mid-Fred',
													format: 'sub-collection of plays',
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
													uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_MATERIAL_UUID,
													name: 'Sub-Fred',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_FRED_MATERIAL_UUID,
														name: 'Mid-Fred',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_FRED_MATERIAL_UUID,
															name: 'Sur-Fred'
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

			const { awards } = johnDoeJrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('John Doe (person): credit for directly nominated material and their associated sur-material and sub-materials', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
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
													uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_MATERIAL_UUID,
													name: 'Mid-Fred',
													format: 'sub-collection of plays',
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
													uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_MATERIAL_UUID,
													name: 'Sub-Fred',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_FRED_MATERIAL_UUID,
														name: 'Mid-Fred',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_FRED_MATERIAL_UUID,
															name: 'Sur-Fred'
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

			const { awards } = johnDoePerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('John Doe Sr (person): credit for directly nominated material and their associated sub-materials and sub-sub-materials', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
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
													uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_MATERIAL_UUID,
													name: 'Mid-Fred',
													format: 'sub-collection of plays',
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
													uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_MATERIAL_UUID,
													name: 'Sub-Fred',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_FRED_MATERIAL_UUID,
														name: 'Mid-Fred',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_FRED_MATERIAL_UUID,
															name: 'Sur-Fred'
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

			const { awards } = johnDoeSrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sub-Playwrights Ltd (company): credit for directly nominated material and their associated sur-material and sur-sur-material', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
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
													uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_MATERIAL_UUID,
													name: 'Mid-Fred',
													format: 'sub-collection of plays',
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
													uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_MATERIAL_UUID,
													name: 'Sub-Fred',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_FRED_MATERIAL_UUID,
														name: 'Mid-Fred',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_FRED_MATERIAL_UUID,
															name: 'Sur-Fred'
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

			const { awards } = subPlaywrightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Mid-Playwrights Ltd (company): credit for directly nominated material and their associated sur-material and sub-materials', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
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
													uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_MATERIAL_UUID,
													name: 'Mid-Fred',
													format: 'sub-collection of plays',
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
													uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_MATERIAL_UUID,
													name: 'Sub-Fred',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_FRED_MATERIAL_UUID,
														name: 'Mid-Fred',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_FRED_MATERIAL_UUID,
															name: 'Sur-Fred'
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

			const { awards } = midPlaywrightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Sur-Playwrights Ltd (company): credit for directly nominated material and their associated sub-materials and sub-sub-materials', () => {

		it('includes their award nominations', () => {

			const expectedAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
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
													uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Fred',
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
													uuid: MID_FRED_MATERIAL_UUID,
													name: 'Mid-Fred',
													format: 'sub-collection of plays',
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
													uuid: SUB_FRED_LYTTELTON_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_LYTTELTON_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_LYTTELTON_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_FRED_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Fred',
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
														uuid: MID_FRED_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Fred',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_FRED_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Fred'
														}
													}
												}
											],
											materials: [
												{
													model: 'MATERIAL',
													uuid: SUB_FRED_MATERIAL_UUID,
													name: 'Sub-Fred',
													format: 'play',
													year: 2010,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_FRED_MATERIAL_UUID,
														name: 'Mid-Fred',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_FRED_MATERIAL_UUID,
															name: 'Sur-Fred'
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

			const { awards } = surPlaywrightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);

		});

	});

	describe('Francis Flob Jr (person): subsequent versions (and their associated sur-material and sur-sur-material) of their work have nominations', () => {

		it('includes awards of subsequent versions (and their associated sur-material and sur-sur-material) of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
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
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
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

			const { awards, subsequentVersionMaterialAwards } = francisFlobJrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Francis Flob (person): subsequent versions (and their associated sur-material and sub-materials) of their work have nominations', () => {

		it('includes awards of subsequent versions (and their associated sur-material and sub-materials) of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
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
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
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

			const { awards, subsequentVersionMaterialAwards } = francisFlobPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Francis Flob Sr (person): subsequent versions (and their associated sub-materials and sub-sub-materials) of their work have nominations', () => {

		it('includes awards of subsequent versions (and their associated sub-materials and sub-sub-materials) of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
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
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
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

			const { awards, subsequentVersionMaterialAwards } = francisFlobSrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Sub-Curtain Up Ltd (company): subsequent versions (and their associated sur-material and sur-sur-material) of their work have nominations', () => {

		it('includes awards of subsequent versions (and their associated sur-material and sur-sur-material) of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
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
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
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

			const { awards, subsequentVersionMaterialAwards } = subCurtainUpLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Mid-Curtain Up Ltd (company): subsequent versions (and their associated sur-material and sub-materials) of their work have nominations', () => {

		it('includes awards of subsequent versions (and their associated sur-material and sub-materials) of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
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
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
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

			const { awards, subsequentVersionMaterialAwards } = midCurtainUpLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Sur-Curtain Up Ltd (company): subsequent versions (and their associated sub-materials and sub-sub-materials) of their work have nominations', () => {

		it('includes awards of subsequent versions (and their associated sub-materials and sub-sub-materials) of their work', () => {

			const expectedAwards = [];

			const expectedSubsequentVersionMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Mid-Plugh',
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
													uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Mid-Plugh',
													format: 'sub-collection of plays',
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
													uuid: SUB_PLUGH_OLIVIER_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_OLIVIER_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_OLIVIER_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_PLUGH_WYNDHAMS_PRODUCTION_UUID,
													name: 'Sub-Plugh',
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
														uuid: MID_PLUGH_WYNDHAMS_PRODUCTION_UUID,
														name: 'Mid-Plugh',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_PLUGH_WYNDHAMS_PRODUCTION_UUID,
															name: 'Sur-Plugh'
														}
													}
												}
											],
											materials: [],
											subsequentVersionMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
													name: 'Sub-Plugh',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
														name: 'Mid-Plugh',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_PLUGH_SUBSEQUENT_VERSION_MATERIAL_UUID,
															name: 'Sur-Plugh'
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

			const { awards, subsequentVersionMaterialAwards } = surCurtainUpLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(subsequentVersionMaterialAwards).to.deep.equal(expectedSubsequentVersionMaterialAwards);

		});

	});

	describe('Jane Roe Jr (person): materials (and their associated sur-material and sur-sur-material) that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials (and their associated sur-material and sur-sur-material) that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
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
													format: 'trilogy of trilogies of plays',
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
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
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

			const { sourcingMaterialAwards } = janeRoeJrPerson.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Jane Roe (person): materials (and their associated sur-material and sub-materials) that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials (and their associated sur-material and sub-materials) that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
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
													format: 'trilogy of trilogies of plays',
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
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
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

			const { sourcingMaterialAwards } = janeRoePerson.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Jane Roe Sr (person): materials (and their associated sub-materials and sub-sub-materials) that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials (and their associated sub-materials and sub-sub-materials) that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
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
													format: 'trilogy of trilogies of plays',
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
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
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

			const { sourcingMaterialAwards } = janeRoeSrPerson.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Sub-Fictioneers Ltd (company): materials (and their associated sur-material and sur-sur-material) that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials (and their associated sur-material and sur-sur-material) that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
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
													format: 'trilogy of trilogies of plays',
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
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
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

			const { sourcingMaterialAwards } = subFictioneersLtdCompany.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Mid-Fictioneers Ltd (company): materials (and their associated sur-material and sub-materials) that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials (and their associated sur-material and sub-materials) that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
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
													format: 'trilogy of trilogies of plays',
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
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
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

			const { sourcingMaterialAwards } = midFictioneersLtdCompany.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Sur-Fictioneers Ltd (company): materials (and their associated sub-materials and sub-sub-materials) that used their (specific) work as source material have nominations', () => {

		it('includes awards of materials (and their associated sub-materials and sub-sub-materials) that used their (specific) work as source material', () => {

			const expectedSourcingMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: true,
											type: 'Winner',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Mid-Wibble',
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
													uuid: MID_WIBBLE_MATERIAL_UUID,
													name: 'Mid-Wibble',
													format: 'sub-trilogy of plays',
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
													format: 'trilogy of trilogies of plays',
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
													uuid: SUB_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
													name: 'Sub-Wibble',
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
														uuid: MID_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
														name: 'Mid-Wibble',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_WIBBLE_DUKE_OF_YORKS_PRODUCTION_UUID,
															name: 'Sur-Wibble'
														}
													}
												}
											],
											materials: [],
											sourcingMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_WIBBLE_MATERIAL_UUID,
													name: 'Sub-Wibble',
													format: 'play',
													year: 2009,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_WIBBLE_MATERIAL_UUID,
														name: 'Mid-Wibble',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_WIBBLE_MATERIAL_UUID,
															name: 'Sur-Wibble'
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

			const { sourcingMaterialAwards } = surFictioneersLtdCompany.body;

			expect(sourcingMaterialAwards).to.deep.equal(expectedSourcingMaterialAwards);

		});

	});

	describe('Talyse Tata Jr (person): materials (and their associated sur-material and sur-sur-material) to which they have granted rights have nominations', () => {

		it('includes awards of materials (and their associated sur-material and sur-sur-material) to which they have granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
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
													uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
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

			const { awards, rightsGrantorMaterialAwards } = talyseTataJrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

	describe('Talyse Tata (person): materials (and their associated sur-material and sub-materials) to which they have granted rights have nominations', () => {

		it('includes awards of materials (and their associated sur-material and sub-materials) to which they have granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
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
													uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
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

			const { awards, rightsGrantorMaterialAwards } = talyseTataPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

	describe('Talyse Tata Sr (person): materials (and their associated sub-materials and sub-sub-materials) to which they have granted rights have nominations', () => {

		it('includes awards of materials (and their associated sub-materials and sub-sub-materials) to which they have granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
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
													uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
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

			const { awards, rightsGrantorMaterialAwards } = talyseTataSrPerson.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

	describe('Sub-Cinerights Ltd (company): materials (and their associated sur-material and sur-sur-material) to which they granted rights have nominations', () => {

		it('includes awards of materials (and their associated sur-material and sur-sur-material) to which they granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
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
													uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
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

			const { awards, rightsGrantorMaterialAwards } = subCinerightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

	describe('Mid-Cinerights Ltd (company): materials (and their associated sur-material and sub-materials) to which they granted rights have nominations', () => {

		it('includes awards of materials (and their associated sur-material and sub-materials) to which they granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
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
													uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
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

			const { awards, rightsGrantorMaterialAwards } = midCinerightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

	describe('Sur-Cinerights Ltd (company): materials (and their associated sub-material and sub-sub-materials) to which they granted rights have nominations', () => {

		it('includes awards of materials (and their associated sub-material and sub-sub-materials) to which they granted rights', () => {

			const expectedAwards = [];

			const expectedRightsGrantorMaterialAwards = [
				{
					model: 'AWARD',
					uuid: DRAMATISTS_MEDAL_AWARD_UUID,
					name: 'Dramatists Medal',
					ceremonies: [
						{
							model: 'AWARD_CEREMONY',
							uuid: DRAMATISTS_MEDAL_TWO_THOUSAND_AND_EIGHT_AWARD_CEREMONY_UUID,
							name: '2008',
							categories: [
								{
									model: 'AWARD_CEREMONY_CATEGORY',
									name: 'Most Remarkable Play',
									nominations: [
										{
											model: 'NOMINATION',
											isWinner: false,
											type: 'Nomination',
											entities: [],
											productions: [
												{
													model: 'PRODUCTION',
													uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Mid-Hoge',
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
													uuid: MID_HOGE_MATERIAL_UUID,
													name: 'Mid-Hoge',
													format: 'sub-collection of plays',
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
													uuid: SUB_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_JERWOOD_THEATRE_DOWNSTAIRS_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												},
												{
													model: 'PRODUCTION',
													uuid: SUB_HOGE_NOËL_COWARD_PRODUCTION_UUID,
													name: 'Sub-Hoge',
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
														uuid: MID_HOGE_NOËL_COWARD_PRODUCTION_UUID,
														name: 'Mid-Hoge',
														surProduction: {
															model: 'PRODUCTION',
															uuid: SUR_HOGE_NOËL_COWARD_PRODUCTION_UUID,
															name: 'Sur-Hoge'
														}
													}
												}
											],
											materials: [],
											rightsGrantorMaterials: [
												{
													model: 'MATERIAL',
													uuid: SUB_HOGE_MATERIAL_UUID,
													name: 'Sub-Hoge',
													format: 'play',
													year: 2008,
													surMaterial: {
														model: 'MATERIAL',
														uuid: MID_HOGE_MATERIAL_UUID,
														name: 'Mid-Hoge',
														surMaterial: {
															model: 'MATERIAL',
															uuid: SUR_HOGE_MATERIAL_UUID,
															name: 'Sur-Hoge'
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

			const { awards, rightsGrantorMaterialAwards } = surCinerightsLtdCompany.body;

			expect(awards).to.deep.equal(expectedAwards);
			expect(rightsGrantorMaterialAwards).to.deep.equal(expectedRightsGrantorMaterialAwards);

		});

	});

});

import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import countNodesWithLabel from '../test-helpers/neo4j/count-nodes-with-label';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('CRUD (Create, Read, Update, Delete): Award ceremonies API', () => {

	chai.use(chaiHttp);

	const sandbox = createSandbox();

	describe('GET new endpoint', () => {

		it('responds with data required to prepare new award ceremony', async () => {

			const response = await chai.request(app)
				.get('/awards/ceremonies/new');

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				name: '',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
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

	});

	describe('CRUD with minimum range of attributes assigned values', () => {

		const AWARD_CEREMONY_UUID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

		before(async () => {

			sandbox.stub(crypto, 'randomUUID').returns(AWARD_CEREMONY_UUID);

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

			const response = await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2020'
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2020',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('gets data required to edit specific award ceremony', async () => {

			const response = await chai.request(app)
				.get(`/awards/ceremonies/${AWARD_CEREMONY_UUID}/edit`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2020',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
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

		it('updates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.put(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`)
				.send({
					name: '2019'
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2019',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('shows award ceremony', async () => {

			const response = await chai.request(app)
				.get(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2019',
				award: null,
				categories: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('deletes award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				name: '2019',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

		});

	});

	describe('CRUD with full range of attributes assigned values', () => {

		const NATIONAL_THEATRE_VENUE_UUID = '4';
		const OLIVIER_THEATRE_VENUE_UUID = '5';
		const LYTTELTON_THEATRE_VENUE_UUID = '6';
		const DORFMAN_THEATRE_VENUE_UUID = '7';
		const HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID = '8';
		const SHAFTESBURY_THEATRE_VENUE_UUID = '10';
		const GARPLY_LYTTELTON_PRODUCTION_UUID = '11';
		const GARPLY_WYNDHAMS_PRODUCTION_UUID = '14';
		const WYNDHAMS_THEATRE_VENUE_UUID = '16';
		const SAINT_JOAN_OLIVIER_PRODUCTION_UUID = '17';
		const PARADE_DONMAR_PRODUCTION_UUID = '20';
		const DONMAR_WAREHOUSE_VENUE_UUID = '22';
		const GRAULT_ALMEIDA_PRODUCTION_UUID = '23';
		const ALMEIDA_THEATRE_VENUE_UUID = '25';
		const AWARD_CEREMONY_UUID = '40';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '41';
		const STEVE_C_KENNEDY_PERSON_UUID = '42';
		const SOUNDWAVES_LTD_COMPANY_UUID = '43';
		const PAUL_ARDITTI_PERSON_UUID = '44';
		const JOCELYN_POOK_PERSON_UUID = '45';
		const AUTOGRAPH_COMPANY_UUID = '46';
		const TERRY_JARDINE_PERSON_UUID = '47';
		const NICK_LIDSTER_PERSON_UUID ='48';
		const AUDIO_CREATIVE_LTD_COMPANY_UUID = '49';
		const ROB_ASHFORD_PERSON_UUID = '50';
		const MARIANNE_ELLIOTT_PERSON_UUID = '51';
		const TOM_MORRIS_PERSON_UUID = '52';
		const RUPERT_GOOLD_PERSON_UUID = '53';
		const THE_CHALK_GARDEN_DONMAR_PRODUCTION_UUID = '54';
		const PIAF_DONMAR_PRODUCTION_UUID = '57';
		const PIAF_VAUDEVILLE_PRODUCTION_UUID = '60';
		const VAUDEVILLE_THEATRE_VENUE_UUID = '62';
		const IVANOV_WYNDHAMS_PRODUCTION_UUID = '63';
		const WALDO_DORFMAN_PRODUCTION_UUID = '66';
		const WALDO_NOËL_COWARD_PRODUCTION_UUID = '69';
		const NOËL_COWARD_THEATRE_VENUE_UUID = '71';
		const FRED_OLD_VIC_PRODUCTION_UUID = '72';
		const OLD_VIC_THEATRE_VENUE_UUID = '74';
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '88';
		const PAULE_CONSTABLE_PERSON_UUID = '89';
		const ILLUMINATIONS_LTD_COMPANY_UUID = '90';
		const NEIL_AUSTIN_PERSON_UUID = '91';
		const MARK_HENDERSON_PERSON_UUID = '92';
		const LIMELIGHT_LTD_COMPANY_UUID = '93';
		const KEVIN_ADAMS_PERSON_UUID = '94';
		const JON_CLARK_PERSON_UUID = '95';
		const STAGE_SUN_LTD_COMPANY_UUID = '96';
		const RAFAEL_AMARGO_PERSON_UUID = '97';
		const STEVEN_HOGGETT_PERSON_UUID = '98';
		const LYNNE_PAGE_PERSON_UUID = '99';
		const KATE_PRINCE_PERSON_UUID = '100';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

		});

		after(() => {

			sandbox.restore();

		});

		it('creates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

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
				.post('/productions')
				.send({
					name: 'Hairspray',
					startDate: '2007-10-11',
					endDate: '2010-03-28',
					venue: {
						name: 'Shaftesbury Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Garply',
					startDate: '2007-10-01',
					endDate: '2007-10-31',
					venue: {
						name: 'Lyttelton Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Garply',
					startDate: '2007-11-01',
					endDate: '2007-11-30',
					venue: {
						name: 'Wyndham\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Saint Joan',
					startDate: '2007-07-04',
					endDate: '2007-09-25',
					venue: {
						name: 'Olivier Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Parade',
					startDate: '2007-09-14',
					endDate: '2007-11-24',
					venue: {
						name: 'Donmar Warehouse'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Grault',
					startDate: '2007-12-01',
					endDate: '2007-12-31',
					venue: {
						name: 'Almeida Theatre'
					}
				});

			const response = await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2008',
					award: {
						name: 'Laurence Olivier Awards',
						differentiator: '1'
					},
					categories: [
						{
							name: 'Best Sound Design',
							nominations: [
								{
									entities: [
										{
											name: 'Steve C Kennedy',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID
										}
									]
								},
								// Contrivance for purposes of test.
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Soundwaves Ltd',
											differentiator: '1'
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
									isWinner: true,
									entities: [
										{
											name: 'Paul Arditti',
											differentiator: '1'
										},
										{
											name: 'Jocelyn Pook',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Autograph',
											differentiator: '1',
											members: [
												{
													name: 'Terry Jardine',
													differentiator: '1'
												},
												{
													name: 'Nick Lidster',
													differentiator: '1'
												}
											]
										}
									],
									productions: [
										{
											uuid: PARADE_DONMAR_PRODUCTION_UUID
										}
									]
								},
								// Contrivance for purposes of test.
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Audio Creative Ltd',
											differentiator: '1',
											members: [
												{
													name: 'Terry Jardine',
													differentiator: '1'
												}
											]
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
								}
							]
						},
						{
							name: 'Best Director',
							nominations: [
								{
									entities: [
										{
											name: 'Rob Ashford',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											name: 'Marianne Elliott',
											differentiator: '1'
										},
										{
											name: 'Tom Morris',
											differentiator: '1'
										}
									]
								},
								{
									isWinner: true,
									entities: [
										{
											name: 'Rupert Goold',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best Revival',
							// Contrivance for purposes of test.
							nominations: [
								{
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
									isWinner: true,
									productions: [
										{
											uuid: GRAULT_ALMEIDA_PRODUCTION_UUID
										}
									]
								},
								{
									productions: [
										{
											uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID
										}
									]
								}
							]
						},
						{
							name: 'Best New Dance Production'
						}
					]
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2008',
				errors: {},
				award: {
					model: 'AWARD',
					name: 'Laurence Olivier Awards',
					differentiator: '1',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Sound Design',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Steve C Kennedy',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Soundwaves Ltd',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Paul Arditti',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Jocelyn Pook',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
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
												name: 'Terry Jardine',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PARADE_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Audio Creative Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Terry Jardine',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Director',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Rob Ashford',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Marianne Elliott',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Revival',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Dance Production',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('shows award ceremony (post-creation)', async () => {

			const response = await chai.request(app)
				.get(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2008',
				award: {
					model: 'AWARD',
					uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
					name: 'Laurence Olivier Awards'
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Sound Design',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								entities: [
									{
										model: 'PERSON',
										uuid: STEVE_C_KENNEDY_PERSON_UUID,
										name: 'Steve C Kennedy'
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID,
										name: 'Hairspray',
										startDate: '2007-10-11',
										endDate: '2010-03-28',
										venue: {
											model: 'VENUE',
											uuid: SHAFTESBURY_THEATRE_VENUE_UUID,
											name: 'Shaftesbury Theatre',
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
										uuid: SOUNDWAVES_LTD_COMPANY_UUID,
										name: 'Soundwaves Ltd',
										members: []
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										name: 'Garply',
										startDate: '2007-10-01',
										endDate: '2007-10-31',
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
										startDate: '2007-11-01',
										endDate: '2007-11-30',
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
								isWinner: true,
								entities: [
									{
										model: 'PERSON',
										uuid: PAUL_ARDITTI_PERSON_UUID,
										name: 'Paul Arditti'
									},
									{
										model: 'PERSON',
										uuid: JOCELYN_POOK_PERSON_UUID,
										name: 'Jocelyn Pook'
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										name: 'Saint Joan',
										startDate: '2007-07-04',
										endDate: '2007-09-25',
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
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								entities: [
									{
										model: 'COMPANY',
										uuid: AUTOGRAPH_COMPANY_UUID,
										name: 'Autograph',
										members: [
											{
												model: 'PERSON',
												uuid: TERRY_JARDINE_PERSON_UUID,
												name: 'Terry Jardine'
											},
											{
												model: 'PERSON',
												uuid: NICK_LIDSTER_PERSON_UUID,
												name: 'Nick Lidster'
											}
										]
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: PARADE_DONMAR_PRODUCTION_UUID,
										name: 'Parade',
										startDate: '2007-09-14',
										endDate: '2007-11-24',
										venue: {
											model: 'VENUE',
											uuid: DONMAR_WAREHOUSE_VENUE_UUID,
											name: 'Donmar Warehouse',
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
										uuid: AUDIO_CREATIVE_LTD_COMPANY_UUID,
										name: 'Audio Creative Ltd',
										members: [
											{
												model: 'PERSON',
												uuid: TERRY_JARDINE_PERSON_UUID,
												name: 'Terry Jardine'
											}
										]
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										name: 'Garply',
										startDate: '2007-10-01',
										endDate: '2007-10-31',
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
										startDate: '2007-11-01',
										endDate: '2007-11-30',
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
						name: 'Best Director',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								entities: [
									{
										model: 'PERSON',
										uuid: ROB_ASHFORD_PERSON_UUID,
										name: 'Rob Ashford'
									}
								],
								productions: []
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								entities: [
									{
										model: 'PERSON',
										uuid: MARIANNE_ELLIOTT_PERSON_UUID,
										name: 'Marianne Elliott'
									},
									{
										model: 'PERSON',
										uuid: TOM_MORRIS_PERSON_UUID,
										name: 'Tom Morris'
									}
								],
								productions: []
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								entities: [
									{
										model: 'PERSON',
										uuid: RUPERT_GOOLD_PERSON_UUID,
										name: 'Rupert Goold'
									}
								],
								productions: []
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Revival',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										name: 'Garply',
										startDate: '2007-10-01',
										endDate: '2007-10-31',
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
										startDate: '2007-11-01',
										endDate: '2007-11-30',
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
								isWinner: true,
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
										name: 'Grault',
										startDate: '2007-12-01',
										endDate: '2007-12-31',
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
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										name: 'Saint Joan',
										startDate: '2007-07-04',
										endDate: '2007-09-25',
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
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Dance Production',
						nominations: []
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('gets data required to edit specific award ceremony', async () => {

			const response = await chai.request(app)
				.get(`/awards/ceremonies/${AWARD_CEREMONY_UUID}/edit`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2008',
				errors: {},
				award: {
					model: 'AWARD',
					name: 'Laurence Olivier Awards',
					differentiator: '1',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Sound Design',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Steve C Kennedy',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: HAIRSPRAY_SHAFTESBURY_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Soundwaves Ltd',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Paul Arditti',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Jocelyn Pook',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
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
												name: 'Terry Jardine',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PARADE_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Audio Creative Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Terry Jardine',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Director',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Rob Ashford',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Marianne Elliott',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Revival',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_LYTTELTON_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GARPLY_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: GRAULT_ALMEIDA_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: SAINT_JOAN_OLIVIER_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Dance Production',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
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

		it('updates award ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'The Chalk Garden',
					startDate: '2008-06-05',
					endDate: '2008-08-02',
					venue: {
						name: 'Donmar Warehouse'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Piaf',
					startDate: '2008-08-08',
					endDate: '2008-09-20',
					venue: {
						name: 'Donmar Warehouse'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Piaf',
					startDate: '2008-10-16',
					endDate: '2009-01-24',
					venue: {
						name: 'Vaudeville Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Ivanov',
					startDate: '2008-09-12',
					endDate: '2008-11-29',
					venue: {
						name: 'Wyndham\'s Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Waldo',
					startDate: '2008-07-01',
					endDate: '2008-07-31',
					venue: {
						name: 'Dorfman Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Waldo',
					startDate: '2008-08-01',
					endDate: '2008-08-31',
					venue: {
						name: 'Noël Coward Theatre'
					}
				});

			await chai.request(app)
				.post('/productions')
				.send({
					name: 'Fred',
					startDate: '2008-09-01',
					endDate: '2008-09-30',
					venue: {
						name: 'Old Vic Theatre'
					}
				});

			const response = await chai.request(app)
				.put(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`)
				.send({
					name: '2009',
					award: {
						name: 'Evening Standard Theatre Awards',
						differentiator: '2'
					},
					// Contrivance for purposes of test.
					categories: [
						{
							name: 'Best Lighting Design',
							nominations: [
								{
									isWinner: true,
									entities: [
										{
											name: 'Paule Constable',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: THE_CHALK_GARDEN_DONMAR_PRODUCTION_UUID
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Illuminations Ltd',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: PIAF_DONMAR_PRODUCTION_UUID
										},
										{
											uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID
										}
									]
								},
								{
									entities: [
										{
											name: 'Neil Austin',
											differentiator: '1'
										},
										{
											name: 'Mark Henderson',
											differentiator: '1'
										}
									],
									productions: [
										{
											uuid: IVANOV_WYNDHAMS_PRODUCTION_UUID
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Limelight Ltd',
											differentiator: '1',
											members: [
												{
													name: 'Kevin Adams',
													differentiator: '1'
												},
												{
													name: 'Jon Clark',
													differentiator: '1'
												}
											]
										}
									],
									productions: [
										{
											uuid: WALDO_DORFMAN_PRODUCTION_UUID
										},
										{
											uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID
										}
									]
								},
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Stage Sun Ltd',
											differentiator: '1',
											members: [
												{
													name: 'Kevin Adams',
													differentiator: '1'
												}
											]
										}
									],
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
						},
						{
							name: 'Best Theatre Choreographer',
							nominations: [
								{
									entities: [
										{
											name: 'Rafael Amargo',
											differentiator: '1'
										}
									]
								},
								{
									isWinner: true,
									entities: [
										{
											name: 'Steven Hoggett',
											differentiator: '1'
										}
									]
								},
								{
									entities: [
										{
											name: 'Lynne Page',
											differentiator: '1'
										},
										{
											name: 'Kate Prince',
											differentiator: '1'
										}
									]
								}
							]
						},
						{
							name: 'Best Musical Revival',
							nominations: [
								{
									productions: [
										{
											uuid: FRED_OLD_VIC_PRODUCTION_UUID
										}
									]
								},
								{
									productions: [
										{
											uuid: PIAF_DONMAR_PRODUCTION_UUID
										},
										{
											uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID
										}
									]
								},
								{
									isWinner: true,
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
						},
						{
							name: 'Best New Opera Production'
						}
					]
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2009',
				errors: {},
				award: {
					model: 'AWARD',
					name: 'Evening Standard Theatre Awards',
					differentiator: '2',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Lighting Design',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: true,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Paule Constable',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: THE_CHALK_GARDEN_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Illuminations Ltd',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PIAF_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Neil Austin',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Mark Henderson',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: IVANOV_WYNDHAMS_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Limelight Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Kevin Adams',
												differentiator: '1',
												errors: {}
											},
											{
												model: 'PERSON',
												name: 'Jon Clark',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'COMPANY',
										name: 'Stage Sun Ltd',
										differentiator: '1',
										errors: {},
										members: [
											{
												model: 'PERSON',
												name: 'Kevin Adams',
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
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Theatre Choreographer',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Rafael Amargo',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Steven Hoggett',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: 'Lynne Page',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: 'Kate Prince',
										differentiator: '1',
										errors: {}
									},
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Musical Revival',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: FRED_OLD_VIC_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PIAF_DONMAR_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										errors: {}
									},
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Opera Production',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('shows award ceremony (post-update)', async () => {

			const response = await chai.request(app)
				.get(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2009',
				award: {
					model: 'AWARD',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
					name: 'Evening Standard Theatre Awards'
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Lighting Design',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: true,
								entities: [
									{
										model: 'PERSON',
										uuid: PAULE_CONSTABLE_PERSON_UUID,
										name: 'Paule Constable'
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: THE_CHALK_GARDEN_DONMAR_PRODUCTION_UUID,
										name: 'The Chalk Garden',
										startDate: '2008-06-05',
										endDate: '2008-08-02',
										venue: {
											model: 'VENUE',
											uuid: DONMAR_WAREHOUSE_VENUE_UUID,
											name: 'Donmar Warehouse',
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
										uuid: ILLUMINATIONS_LTD_COMPANY_UUID,
										name: 'Illuminations Ltd',
										members: []
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: PIAF_DONMAR_PRODUCTION_UUID,
										name: 'Piaf',
										startDate: '2008-08-08',
										endDate: '2008-09-20',
										venue: {
											model: 'VENUE',
											uuid: DONMAR_WAREHOUSE_VENUE_UUID,
											name: 'Donmar Warehouse',
											surVenue: null
										}
									},
									{
										model: 'PRODUCTION',
										uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID,
										name: 'Piaf',
										startDate: '2008-10-16',
										endDate: '2009-01-24',
										venue: {
											model: 'VENUE',
											uuid: VAUDEVILLE_THEATRE_VENUE_UUID,
											name: 'Vaudeville Theatre',
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
										model: 'PERSON',
										uuid: NEIL_AUSTIN_PERSON_UUID,
										name: 'Neil Austin'
									},
									{
										model: 'PERSON',
										uuid: MARK_HENDERSON_PERSON_UUID,
										name: 'Mark Henderson'
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: IVANOV_WYNDHAMS_PRODUCTION_UUID,
										name: 'Ivanov',
										startDate: '2008-09-12',
										endDate: '2008-11-29',
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
										uuid: LIMELIGHT_LTD_COMPANY_UUID,
										name: 'Limelight Ltd',
										members: [
											{
												model: 'PERSON',
												uuid: KEVIN_ADAMS_PERSON_UUID,
												name: 'Kevin Adams'
											},
											{
												model: 'PERSON',
												uuid: JON_CLARK_PERSON_UUID,
												name: 'Jon Clark'
											}
										]
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-07-01',
										endDate: '2008-07-31',
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
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-08-01',
										endDate: '2008-08-31',
										venue: {
											model: 'VENUE',
											uuid: NOËL_COWARD_THEATRE_VENUE_UUID,
											name: 'Noël Coward Theatre',
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
										uuid: STAGE_SUN_LTD_COMPANY_UUID,
										name: 'Stage Sun Ltd',
										members: [
											{
												model: 'PERSON',
												uuid: KEVIN_ADAMS_PERSON_UUID,
												name: 'Kevin Adams'
											}
										]
									}
								],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-07-01',
										endDate: '2008-07-31',
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
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-08-01',
										endDate: '2008-08-31',
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
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Theatre Choreographer',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								entities: [
									{
										model: 'PERSON',
										uuid: RAFAEL_AMARGO_PERSON_UUID,
										name: 'Rafael Amargo'
									}
								],
								productions: []
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								entities: [
									{
										model: 'PERSON',
										uuid: STEVEN_HOGGETT_PERSON_UUID,
										name: 'Steven Hoggett'
									}
								],
								productions: []
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								entities: [
									{
										model: 'PERSON',
										uuid: LYNNE_PAGE_PERSON_UUID,
										name: 'Lynne Page'
									},
									{
										model: 'PERSON',
										uuid: KATE_PRINCE_PERSON_UUID,
										name: 'Kate Prince'
									}
								],
								productions: []
							}
						]
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best Musical Revival',
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: FRED_OLD_VIC_PRODUCTION_UUID,
										name: 'Fred',
										startDate: '2008-09-01',
										endDate: '2008-09-30',
										venue: {
											model: 'VENUE',
											uuid: OLD_VIC_THEATRE_VENUE_UUID,
											name: 'Old Vic Theatre',
											surVenue: null
										}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: false,
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: PIAF_DONMAR_PRODUCTION_UUID,
										name: 'Piaf',
										startDate: '2008-08-08',
										endDate: '2008-09-20',
										venue: {
											model: 'VENUE',
											uuid: DONMAR_WAREHOUSE_VENUE_UUID,
											name: 'Donmar Warehouse',
											surVenue: null
										}
									},
									{
										model: 'PRODUCTION',
										uuid: PIAF_VAUDEVILLE_PRODUCTION_UUID,
										name: 'Piaf',
										startDate: '2008-10-16',
										endDate: '2009-01-24',
										venue: {
											model: 'VENUE',
											uuid: VAUDEVILLE_THEATRE_VENUE_UUID,
											name: 'Vaudeville Theatre',
											surVenue: null
										}
									}
								]
							},
							{
								model: 'NOMINATION',
								isWinner: true,
								entities: [],
								productions: [
									{
										model: 'PRODUCTION',
										uuid: WALDO_DORFMAN_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-07-01',
										endDate: '2008-07-31',
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
										uuid: WALDO_NOËL_COWARD_PRODUCTION_UUID,
										name: 'Waldo',
										startDate: '2008-08-01',
										endDate: '2008-08-31',
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
					},
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: 'Best New Opera Production',
						nominations: []
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

		it('updates award ceremony to remove all associations prior to deletion', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.put(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`)
				.send({
					name: '2009'
				});

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				uuid: AWARD_CEREMONY_UUID,
				name: '2009',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: [
					{
						model: 'AWARD_CEREMONY_CATEGORY',
						name: '',
						errors: {},
						nominations: [
							{
								model: 'NOMINATION',
								isWinner: false,
								errors: {},
								entities: [
									{
										model: 'PERSON',
										name: '',
										differentiator: '',
										errors: {}
									}
								],
								productions: [
									{
										model: 'PRODUCTION_IDENTIFIER',
										uuid: '',
										errors: {}
									}
								]
							}
						]
					}
				]
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

		});

		it('deletes awards ceremony', async () => {

			expect(await countNodesWithLabel('AwardCeremony')).to.equal(1);

			const response = await chai.request(app)
				.delete(`/awards/ceremonies/${AWARD_CEREMONY_UUID}`);

			const expectedResponseBody = {
				model: 'AWARD_CEREMONY',
				name: '2009',
				errors: {},
				award: {
					model: 'AWARD',
					name: '',
					differentiator: '',
					errors: {}
				},
				categories: []
			};

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);
			expect(await countNodesWithLabel('AwardCeremony')).to.equal(0);

		});

	});

	describe('GET list endpoint', () => {

		const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '2';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '3';
		const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = '6';
		const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '10';
		const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '14';
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '15';
		const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = '18';
		const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '22';

		before(async () => {

			let uuidCallCount = 0;

			sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

			await purgeDatabase();

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2019',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2020',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2018',
					award: {
						name: 'Laurence Olivier Awards'
					}
				});

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2019',
					award: {
						name: 'Evening Standard Theatre Awards'
					}
				});

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2020',
					award: {
						name: 'Evening Standard Theatre Awards'
					}
				});

			await chai.request(app)
				.post('/awards/ceremonies')
				.send({
					name: '2018',
					award: {
						name: 'Evening Standard Theatre Awards'
					}
				});

		});

		after(() => {

			sandbox.restore();

		});

		it('lists all award ceremonies ordered by name then award name', async () => {

			const response = await chai.request(app)
				.get('/awards/ceremonies');

			const expectedResponseBody = [
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
					name: '2020',
					award: {
						model: 'AWARD',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
						name: 'Evening Standard Theatre Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID,
					name: '2020',
					award: {
						model: 'AWARD',
						uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
						name: 'Laurence Olivier Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '2019',
					award: {
						model: 'AWARD',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
						name: 'Evening Standard Theatre Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID,
					name: '2019',
					award: {
						model: 'AWARD',
						uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
						name: 'Laurence Olivier Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
					name: '2018',
					award: {
						model: 'AWARD',
						uuid: EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID,
						name: 'Evening Standard Theatre Awards'
					}
				},
				{
					model: 'AWARD_CEREMONY',
					uuid: LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID,
					name: '2018',
					award: {
						model: 'AWARD',
						uuid: LAURENCE_OLIVIER_AWARDS_AWARD_UUID,
						name: 'Laurence Olivier Awards'
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

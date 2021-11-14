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

		const AWARD_CEREMONY_UUID = '14';
		const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '15';
		const STEVE_C_KENNEDY_PERSON_UUID = '16';
		const SOUNDWAVES_LTD_COMPANY_UUID = '17';
		const PAUL_ARDITTI_PERSON_UUID = '18';
		const JOCELYN_POOK_PERSON_UUID = '19';
		const AUTOGRAPH_COMPANY_UUID = '20';
		const TERRY_JARDINE_PERSON_UUID = '21';
		const NICK_LIDSTER_PERSON_UUID ='22';
		const AUDIO_CREATIVE_LTD_COMPANY_UUID = '23';
		const ROB_ASHFORD_PERSON_UUID = '24';
		const MARIANNE_ELLIOTT_PERSON_UUID = '25';
		const TOM_MORRIS_PERSON_UUID = '26';
		const RUPERT_GOOLD_PERSON_UUID = '27';
		const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '41';
		const PAULE_CONSTABLE_PERSON_UUID = '42';
		const ILLUMINATIONS_LTD_COMPANY_UUID = '43';
		const NEIL_AUSTIN_PERSON_UUID = '44';
		const MARK_HENDERSON_PERSON_UUID = '45';
		const LIMELIGHT_LTD_COMPANY_UUID = '46';
		const KEVIN_ADAMS_PERSON_UUID = '47';
		const JON_CLARK_PERSON_UUID = '48';
		const STAGE_SUN_LTD_COMPANY_UUID = '49';
		const RAFAEL_AMARGO_PERSON_UUID = '50';
		const STEVEN_HOGGETT_PERSON_UUID = '51';
		const LYNNE_PAGE_PERSON_UUID = '52';
		const KATE_PRINCE_PERSON_UUID = '53';

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
								]
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
								]
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
					name: '2009',
					award: {
						name: 'Evening Standard Theatre Awards',
						differentiator: '2'
					},
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
									]
								},
								// Contrivance for purposes of test.
								{
									entities: [
										{
											model: 'COMPANY',
											name: 'Illuminations Ltd',
											differentiator: '1'
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
									]
								},
								// Contrivance for purposes of test.
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
								// Contrivance for purposes of test.
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
								]
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
								]
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

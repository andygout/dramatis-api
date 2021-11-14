import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Award ceremonies', () => {

	chai.use(chaiHttp);

	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '7';
	const LAURENCE_OLIVIER_AWARDS_AWARD_UUID = '8';
	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_TWENTY_AWARD_CEREMONY_UUID = '32';
	const JOHN_DOE_PERSON_UUID = '37';
	const CURTAIN_UP_LTD_COMPANY_UUID = '38';
	const JANE_ROE_PERSON_UUID = '39';
	const STAGECRAFT_LTD_COMPANY_UUID = '40';
	const FERDINAND_FOO_PERSON_UUID = '41';
	const BEATRICE_BAR_PERSON_UUID = '42';
	const BRANDON_BAZ_PERSON_UUID = '43';
	const THEATRICALS_LTD_COMPANY_UUID = '44';
	const QUINCY_QUX_PERSON_UUID = '45';
	const CLARA_QUUX_PERSON_UUID = '46';
	const CHRISTIAN_QUUZ_PERSON_UUID = '47';
	const CONOR_CORGE_PERSON_UUID = '48';
	const BACKSTAGE_LTD_COMPANY_UUID = '49';
	const LAURENCE_OLIVIER_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '68';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_EIGHTEEN_AWARD_CEREMONY_UUID = '100';
	const EVENING_STANDARD_THEATRE_AWARDS_AWARD_UUID = '101';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '125';
	const EVENING_STANDARD_THEATRE_AWARDS_TWO_THOUSAND_AND_SEVENTEEN_AWARD_CEREMONY_UUID = '154';
	const CRITICS_CIRCLE_THEATRE_AWARDS_TWO_THOUSAND_AND_NINETEEN_AWARD_CEREMONY_UUID = '188';
	const CRITICS_CIRCLE_THEATRE_AWARDS_AWARD_UUID = '189';

	let laurenceOlivierAwardsAward;
	let eveningStandardTheatreAwardsAward;
	let johnDoePerson;
	let curtainUpCompany;
	let conorCorgePerson;
	let stagecraftLtdCompany;
	let quincyQuxPerson;

	const sandbox = createSandbox();

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
								]
							},
							{
								entities: [
									{
										name: 'Ian McKellen'
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Kyle Soller'
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
								]
							},
							{
								entities: [
									{
										name: 'Toby Jones'
									}
								]
							},
							{
								entities: [
									{
										name: 'Wendell Pierce'
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
								]
							},
							{
								entities: [
									{
										name: 'Andrew Garfield'
									}
								]
							},
							{
								entities: [
									{
										name: 'Andrew Scott'
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
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Ralph Fiennes'
									}
								]
							},
							{
								entities: [
									{
										name: 'Ian McKellen'
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
								]
							},
							{
								isWinner: true,
								entities: [
									{
										model: 'COMPANY',
										name: 'Curtain Up Ltd'
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
								]
							},
							{
								entities: [
									{
										name: 'Francis Guinan'
									}
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Andrew Scott'
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
								]
							},
							{
								isWinner: true,
								entities: [
									{
										name: 'Andrew Garfield'
									}
								]
							},
							{
								entities: [
									{
										name: 'Andrew Scott'
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
								]
							},
							{
								isWinner: true,
								entities: [
									{
										model: 'COMPANY',
										name: 'Backstage Ltd'
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
											coEntities: []
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
											coEntities: []
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
											]
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
											coEntities: []
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
											]
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
											coEntities: []
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
											]
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
											coEntities: []
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
											coEntities: []
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
											coEntities: []
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
											]
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
											]
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
											]
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
											]
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
											]
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
											]
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

});

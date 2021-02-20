import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Productions with creative team', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_UUID = '3';
	const OLIVIER_THEATRE_UUID = '4';
	const LYTTELTON_THEATRE_UUID = '5';
	const JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID = '6';
	const BARBICAN_THEATRE_UUID = '8';
	const DEBORAH_WARNER_PERSON_UUID = '9';
	const AUTOGRAPH_COMPANY_UUID = '10';
	const JO_LAKIN_PERSON_UUID = '11';
	const HANDSPRING_PUPPET_COMPANY_UUID = '12';
	const NICK_BARNES_PERSON_UUID = '13';
	const HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID = '14';
	const CHRIS_BARLOW_PERSON_UUID = '21';
	const MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID = '22';
	const SUE_BUCKMASTER_PERSON_UUID = '28';

	let juliusCaesarBarbicanProduction;
	let happyDaysLytteltonProduction;
	let motherCourageAndHerChildrenOlivierProduction;
	let deborahWarnerPerson;
	let joLakinPerson;
	let autographCompany;
	let handspringPuppetCompany;

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
						creativeEntities: [
							{
								name: 'Deborah Warner'
							}
						]
					},
					{
						name: 'Sound Designer',
						creativeEntities: [
							{
								model: 'company',
								name: 'Autograph'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Puppet Designers',
						creativeEntities: [
							{
								name: 'Jo Lakin'
							},
							{
								model: 'company',
								name: 'Handspring Puppet Company'
							},
							{
								name: 'Nick Barnes'
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
						creativeEntities: [
							{
								name: 'Deborah Warner'
							}
						]
					},
					// Contrivance for purposes of testing person with multiple creative credits for same production.
					{
						name: 'Design',
						creativeEntities: [
							{
								name: 'Jo Lakin'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Sound Design',
						creativeEntities: [
							{
								model: 'company',
								name: 'Autograph'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Puppet Design',
						creativeEntities: [
							{
								model: 'company',
								name: 'Handspring Puppet Company'
							},
							{
								name: 'Jo Lakin'
							},
							{
								name: 'Chris Barlow'
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
						creativeEntities: [
							{
								name: 'Deborah Warner'
							}
						]
					},
					// Contrivance for purposes of testing company with multiple creative credits for same production.
					{
						name: 'Designed by',
						creativeEntities: [
							{
								model: 'company',
								name: 'Handspring Puppet Company'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Sound designed by',
						creativeEntities: [
							{
								model: 'company',
								name: 'Autograph'
							}
						]
					},
					// Contrivance for purposes of test.
					{
						name: 'Puppets designed by',
						creativeEntities: [
							{
								name: 'Sue Buckmaster'
							},
							{
								model: 'company',
								name: 'Handspring Puppet Company'
							},
							{
								name: 'Jo Lakin'
							}
						]
					}
				]
			});

		juliusCaesarBarbicanProduction = await chai.request(app)
			.get(`/productions/${JULIUS_CAESAR_BARBICAN_PRODUCTION_UUID}`);

		happyDaysLytteltonProduction = await chai.request(app)
			.get(`/productions/${HAPPY_DAYS_LYTTELTON_PRODUCTION_UUID}`);

		motherCourageAndHerChildrenOlivierProduction = await chai.request(app)
			.get(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID}`);

		deborahWarnerPerson = await chai.request(app)
			.get(`/people/${DEBORAH_WARNER_PERSON_UUID}`);

		joLakinPerson = await chai.request(app)
			.get(`/people/${JO_LAKIN_PERSON_UUID}`);

		autographCompany = await chai.request(app)
			.get(`/companies/${AUTOGRAPH_COMPANY_UUID}`);

		handspringPuppetCompany = await chai.request(app)
			.get(`/companies/${HANDSPRING_PUPPET_COMPANY_UUID}`);

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
					creativeEntities: [
						{
							model: 'person',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Sound Designer',
					creativeEntities: [
						{
							model: 'company',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Puppet Designers',
					creativeEntities: [
						{
							model: 'person',
							uuid: JO_LAKIN_PERSON_UUID,
							name: 'Jo Lakin'
						},
						{
							model: 'company',
							uuid: HANDSPRING_PUPPET_COMPANY_UUID,
							name: 'Handspring Puppet Company'
						},
						{
							model: 'person',
							uuid: NICK_BARNES_PERSON_UUID,
							name: 'Nick Barnes'
						}
					]
				}
			];

			const { creativeCredits } = juliusCaesarBarbicanProduction.body;

			expect(creativeCredits).to.deep.equal(expectedCreativeCredits);

		});

	});

	describe('Happy Days at Lyttelton Theatre (production)', () => {

		it('includes creative team credits', () => {

			const expectedCreativeCredits = [
				{
					model: 'creativeCredit',
					name: 'Direction',
					creativeEntities: [
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
					creativeEntities: [
						{
							model: 'person',
							uuid: JO_LAKIN_PERSON_UUID,
							name: 'Jo Lakin'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Sound Design',
					creativeEntities: [
						{
							model: 'company',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Puppet Design',
					creativeEntities: [
						{
							model: 'company',
							uuid: HANDSPRING_PUPPET_COMPANY_UUID,
							name: 'Handspring Puppet Company'
						},
						{
							model: 'person',
							uuid: JO_LAKIN_PERSON_UUID,
							name: 'Jo Lakin'
						},
						{
							model: 'person',
							uuid: CHRIS_BARLOW_PERSON_UUID,
							name: 'Chris Barlow'
						}
					]
				}
			];

			const { creativeCredits } = happyDaysLytteltonProduction.body;

			expect(creativeCredits).to.deep.equal(expectedCreativeCredits);

		});

	});

	describe('Mother Courage and Her Children at Olivier Theatre (production)', () => {

		it('includes creative team credits', () => {

			const expectedCreativeCredits = [
				{
					model: 'creativeCredit',
					name: 'Directed by',
					creativeEntities: [
						{
							model: 'person',
							uuid: DEBORAH_WARNER_PERSON_UUID,
							name: 'Deborah Warner'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Designed by',
					creativeEntities: [
						{
							model: 'company',
							uuid: HANDSPRING_PUPPET_COMPANY_UUID,
							name: 'Handspring Puppet Company'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Sound designed by',
					creativeEntities: [
						{
							model: 'company',
							uuid: AUTOGRAPH_COMPANY_UUID,
							name: 'Autograph'
						}
					]
				},
				{
					model: 'creativeCredit',
					name: 'Puppets designed by',
					creativeEntities: [
						{
							model: 'person',
							uuid: SUE_BUCKMASTER_PERSON_UUID,
							name: 'Sue Buckmaster'
						},
						{
							model: 'company',
							uuid: HANDSPRING_PUPPET_COMPANY_UUID,
							name: 'Handspring Puppet Company'
						},
						{
							model: 'person',
							uuid: JO_LAKIN_PERSON_UUID,
							name: 'Jo Lakin'
						}
					]
				}
			];

			const { creativeCredits } = motherCourageAndHerChildrenOlivierProduction.body;

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
							coCreditedEntities: []
						}
					]
				}
			];

			const { creativeProductions } = deborahWarnerPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Jo Lakin (person)', () => {

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
							coCreditedEntities: []
						},
						{
							model: 'creativeCredit',
							name: 'Puppet Design',
							coCreditedEntities: [
								{
									model: 'company',
									uuid: HANDSPRING_PUPPET_COMPANY_UUID,
									name: 'Handspring Puppet Company'
								},
								{
									model: 'person',
									uuid: CHRIS_BARLOW_PERSON_UUID,
									name: 'Chris Barlow'
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
							name: 'Puppet Designers',
							coCreditedEntities: [
								{
									model: 'company',
									uuid: HANDSPRING_PUPPET_COMPANY_UUID,
									name: 'Handspring Puppet Company'
								},
								{
									model: 'person',
									uuid: NICK_BARNES_PERSON_UUID,
									name: 'Nick Barnes'
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
							name: 'Puppets designed by',
							coCreditedEntities: [
								{
									model: 'person',
									uuid: SUE_BUCKMASTER_PERSON_UUID,
									name: 'Sue Buckmaster'
								},
								{
									model: 'company',
									uuid: HANDSPRING_PUPPET_COMPANY_UUID,
									name: 'Handspring Puppet Company'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = joLakinPerson.body;

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
							name: 'Sound Designer',
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
							name: 'Sound designed by',
							coCreditedEntities: []
						}
					]
				}
			];

			const { creativeProductions } = autographCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Handspring Puppet Company (company)', () => {

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
							name: 'Puppet Design',
							coCreditedEntities: [
								{
									model: 'person',
									uuid: JO_LAKIN_PERSON_UUID,
									name: 'Jo Lakin'
								},
								{
									model: 'person',
									uuid: CHRIS_BARLOW_PERSON_UUID,
									name: 'Chris Barlow'
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
							name: 'Puppet Designers',
							coCreditedEntities: [
								{
									model: 'person',
									uuid: JO_LAKIN_PERSON_UUID,
									name: 'Jo Lakin'
								},
								{
									model: 'person',
									uuid: NICK_BARNES_PERSON_UUID,
									name: 'Nick Barnes'
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
							name: 'Designed by',
							coCreditedEntities: []
						},
						{
							model: 'creativeCredit',
							name: 'Puppets designed by',
							coCreditedEntities: [
								{
									model: 'person',
									uuid: SUE_BUCKMASTER_PERSON_UUID,
									name: 'Sue Buckmaster'
								},
								{
									model: 'person',
									uuid: JO_LAKIN_PERSON_UUID,
									name: 'Jo Lakin'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = handspringPuppetCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

});

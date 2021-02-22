import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Theatre with sub-theatres', () => {

	chai.use(chaiHttp);

	const NATIONAL_THEATRE_UUID = '4';
	const OLIVIER_THEATRE_UUID = '5';
	const LYTTELTON_THEATRE_UUID = '6';
	const DORFMAN_THEATRE_UUID = '7';
	const MOTHER_COURAGE_AND_HER_CHILDREN_MATERIAL_UUID = '11';
	const MOTHER_COURAGE_CHARACTER_UUID = '13';
	const RICHARD_II_MATERIAL_UUID = '17';
	const KING_RICHARD_II_CHARACTER_UUID = '19';
	const MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID = '20';
	const FIONA_SHAW_PERSON_UUID = '23';
	const RICHARD_II_NATIONAL_PRODUCTION_UUID = '24';

	let nationalTheatre;
	let olivierTheatre;
	let motherCourageCharacter;
	let kingRichardIICharacter;
	let motherCourageAndHerChildrenMaterial;
	let richardIIMaterial;
	let motherCourageAndHerChildrenOlivierProduction;
	let richardIINationalProduction;
	let fionaShawPerson;

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
						name: 'Dorfman Theatre'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Mother Courage and Her Children',
				characterGroups: [
					{
						characters: [
							{
								name: 'Mother Courage'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Richard II',
				characterGroups: [
					{
						characters: [
							{
								name: 'King Richard II'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mother Courage and Her Children',
				material: {
					name: 'Mother Courage and Her Children'
				},
				theatre: {
					name: 'Olivier Theatre'
				},
				cast: [
					{
						name: 'Fiona Shaw',
						roles: [
							{
								name: 'Mother Courage'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Richard II',
				material: {
					name: 'Richard II'
				},
				theatre: {
					name: 'National Theatre'
				},
				cast: [
					{
						name: 'Fiona Shaw',
						roles: [
							{
								name: 'King Richard II'
							}
						]
					}
				]
			});

		nationalTheatre = await chai.request(app)
			.get(`/theatres/${NATIONAL_THEATRE_UUID}`);

		olivierTheatre = await chai.request(app)
			.get(`/theatres/${OLIVIER_THEATRE_UUID}`);

		motherCourageCharacter = await chai.request(app)
			.get(`/characters/${MOTHER_COURAGE_CHARACTER_UUID}`);

		kingRichardIICharacter = await chai.request(app)
			.get(`/characters/${KING_RICHARD_II_CHARACTER_UUID}`);

		motherCourageAndHerChildrenMaterial = await chai.request(app)
			.get(`/materials/${MOTHER_COURAGE_AND_HER_CHILDREN_MATERIAL_UUID}`);

		richardIIMaterial = await chai.request(app)
			.get(`/materials/${RICHARD_II_MATERIAL_UUID}`);

		motherCourageAndHerChildrenOlivierProduction = await chai.request(app)
			.get(`/productions/${MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID}`);

		richardIINationalProduction = await chai.request(app)
			.get(`/productions/${RICHARD_II_NATIONAL_PRODUCTION_UUID}`);

		fionaShawPerson = await chai.request(app)
			.get(`/people/${FIONA_SHAW_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('National Theatre (theatre)', () => {

		it('includes its sub-theatres', () => {

			const expectedSubTheatres = [
				{
					model: 'theatre',
					uuid: OLIVIER_THEATRE_UUID,
					name: 'Olivier Theatre'
				},
				{
					model: 'theatre',
					uuid: LYTTELTON_THEATRE_UUID,
					name: 'Lyttelton Theatre'
				},
				{
					model: 'theatre',
					uuid: DORFMAN_THEATRE_UUID,
					name: 'Dorfman Theatre'
				}
			];

			const { subTheatres } = nationalTheatre.body;

			expect(subTheatres).to.deep.equal(expectedSubTheatres);

		});

		it('includes productions at this theatre and, where applicable, the specific sub-theatre', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					subTheatre: {
						model: 'theatre',
						name: 'Olivier Theatre',
						uuid: OLIVIER_THEATRE_UUID
					}
				},
				{
					model: 'production',
					uuid: RICHARD_II_NATIONAL_PRODUCTION_UUID,
					name: 'Richard II',
					subTheatre: null
				}
			];

			const { productions } = nationalTheatre.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Olivier Theatre (theatre)', () => {

		it('includes National Theatre as its sur-theatre', () => {

			const expectedSurTheatre = {
				model: 'theatre',
				uuid: NATIONAL_THEATRE_UUID,
				name: 'National Theatre'
			};

			const { surTheatre } = olivierTheatre.body;

			expect(surTheatre).to.deep.equal(expectedSurTheatre);

		});

		it('includes productions at this theatre', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: MOTHER_COURAGE_AND_HER_CHILDREN_OLIVIER_PRODUCTION_UUID,
					name: 'Mother Courage and Her Children',
					subTheatre: null
				}
			];

			const { productions } = olivierTheatre.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Mother Courage (character)', () => {

		it('includes productions in which character was portrayed, including the theatre and its sur-theatre', () => {

			const expectedProductions = [
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
					performers: [
						{
							model: 'person',
							uuid: FIONA_SHAW_PERSON_UUID,
							name: 'Fiona Shaw',
							roleName: 'Mother Courage',
							qualifier: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = motherCourageCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('King Richard II (character)', () => {

		it('includes productions in which character was portrayed, including the theatre (but with no sur-theatre as does not apply)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: RICHARD_II_NATIONAL_PRODUCTION_UUID,
					name: 'Richard II',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					performers: [
						{
							model: 'person',
							uuid: FIONA_SHAW_PERSON_UUID,
							name: 'Fiona Shaw',
							roleName: 'King Richard II',
							qualifier: null,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = kingRichardIICharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Mother Courage and Her Children (material)', () => {

		it('includes productions of material, including the theatre and its sur-theatre', () => {

			const expectedProductions = [
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
					}
				}
			];

			const { productions } = motherCourageAndHerChildrenMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Richard II (material)', () => {

		it('includes productions of material, including the theatre (but with no sur-theatre as does not apply)', () => {

			const expectedProductions = [
				{
					model: 'production',
					uuid: RICHARD_II_NATIONAL_PRODUCTION_UUID,
					name: 'Richard II',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					}
				}
			];

			const { productions } = richardIIMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Mother Courage and Her Children at Olivier Theatre (production)', () => {

		it('includes the theatre and its sur-theatre', () => {

			const expectedTheatre = {
				model: 'theatre',
				uuid: OLIVIER_THEATRE_UUID,
				name: 'Olivier Theatre',
				surTheatre: {
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre'
				}
			};

			const { theatre } = motherCourageAndHerChildrenOlivierProduction.body;

			expect(theatre).to.deep.equal(expectedTheatre);

		});

	});

	describe('Richard II at National Theatre (production)', () => {

		it('includes the theatre (but with no sur-theatre as does not apply)', () => {

			const expectedTheatre = {
				model: 'theatre',
				uuid: NATIONAL_THEATRE_UUID,
				name: 'National Theatre',
				surTheatre: null
			};

			const { theatre } = richardIINationalProduction.body;

			expect(theatre).to.deep.equal(expectedTheatre);

		});

	});

	describe('Fiona Shaw (person)', () => {

		it('includes in their production credits the theatre and, where applicable, its sur-theatre', () => {

			const expectedCastMemberProductions = [
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
					roles: [
						{
							model: 'character',
							uuid: MOTHER_COURAGE_CHARACTER_UUID,
							name: 'Mother Courage',
							qualifier: null
						}
					]
				},
				{
					model: 'production',
					uuid: RICHARD_II_NATIONAL_PRODUCTION_UUID,
					name: 'Richard II',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					},
					roles: [
						{
							model: 'character',
							uuid: KING_RICHARD_II_CHARACTER_UUID,
							name: 'King Richard II',
							qualifier: null
						}
					]
				}
			];

			const { castMemberProductions } = fionaShawPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('theatres list', () => {

		it('includes theatre and corresponding sub-theatres', async () => {

			const response = await chai.request(app)
				.get('/theatres');

			const expectedResponseBody = [
				{
					model: 'theatre',
					uuid: NATIONAL_THEATRE_UUID,
					name: 'National Theatre',
					subTheatres: [
						{
							model: 'theatre',
							uuid: OLIVIER_THEATRE_UUID,
							name: 'Olivier Theatre'
						},
						{
							model: 'theatre',
							uuid: LYTTELTON_THEATRE_UUID,
							name: 'Lyttelton Theatre'
						},
						{
							model: 'theatre',
							uuid: DORFMAN_THEATRE_UUID,
							name: 'Dorfman Theatre'
						}
					]
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

	describe('productions list', () => {

		it('includes theatre and (if applicable) corresponding sur-theatre', async () => {

			const response = await chai.request(app)
				.get('/productions');

			const expectedResponseBody = [
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
					}
				},
				{
					model: 'production',
					uuid: RICHARD_II_NATIONAL_PRODUCTION_UUID,
					name: 'Richard II',
					theatre: {
						model: 'theatre',
						uuid: NATIONAL_THEATRE_UUID,
						name: 'National Theatre',
						surTheatre: null
					}
				}
			];

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

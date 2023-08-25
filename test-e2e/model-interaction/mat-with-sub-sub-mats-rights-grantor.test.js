import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';

describe('Material with sub-sub-materials and rights grantor credits thereof', () => {

	chai.use(chaiHttp);

	const THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID = '2';
	const J_R_R_TOLKIEN_PERSON_UUID = '3';
	const THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID = '8';
	const TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID = '15';
	const THE_FELLOWSHIP_OF_THE_RINGS_PLAY_MATERIAL_UUID = '23';
	const SHAUN_MCKENNA_PERSON_UUID = '24';
	const THE_TOLKIEN_ESTATE_COMPANY_UUID = '26';
	const BAILLIE_TOLKIEN_PERSON_UUID = '27';
	const THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID = '33';
	const TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID = '42';

	let theTolkienEstateCompany;
	let baillieTolkienPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Fellowship of the Ring',
				differentiator: '1',
				format: 'novel',
				year: '1954',
				writingCredits: [
					{
						entities: [
							{
								name: 'J R R Tolkien'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Lord of the Rings',
				differentiator: '1',
				format: 'trilogy of novels',
				year: '1955',
				writingCredits: [
					{
						entities: [
							{
								name: 'J R R Tolkien'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Fellowship of the Ring',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Tolkien\'s Legendarium',
				differentiator: '1',
				format: 'body of writing',
				year: '1977',
				writingCredits: [
					{
						entities: [
							{
								name: 'J R R Tolkien'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Lord of the Rings',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Fellowship of the Ring',
				differentiator: '2',
				format: 'play',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Shaun McKenna'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Fellowship of the Ring',
								differentiator: '1'
							}
						]
					},
					{
						name: 'by special arrangement with',
						creditType: 'RIGHTS_GRANTOR',
						entities: [
							{
								model: 'COMPANY',
								name: 'The Tolkien Estate'
							},
							{
								name: 'Baillie Tolkien'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Lord of the Rings',
				differentiator: '2',
				format: 'trilogy of plays',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Shaun McKenna'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Lord of the Rings',
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Fellowship of the Ring',
						differentiator: '2'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Tolkien\'s Legendarium',
				differentiator: '2',
				format: 'collection of plays',
				year: '2007',
				writingCredits: [
					{
						entities: [
							{
								name: 'Shaun McKenna'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Tolkien\'s Legendarium',
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Lord of the Rings',
						differentiator: '2'
					}
				]
			});

		theTolkienEstateCompany = await chai.request(app)
			.get(`/companies/${THE_TOLKIEN_ESTATE_COMPANY_UUID}`);

		baillieTolkienPerson = await chai.request(app)
			.get(`/people/${BAILLIE_TOLKIEN_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Tolkien Estate (company)', () => {

		it('includes materials for which it has a rights grantor credit, with corresponding sur-material and sur-sur-material', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FELLOWSHIP_OF_THE_RINGS_PLAY_MATERIAL_UUID,
					name: 'The Fellowship of the Ring',
					format: 'play',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
						name: 'The Lord of the Rings',
						surMaterial: {
							model: 'MATERIAL',
							uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
							name: 'Tolkien\'s Legendarium'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID,
									name: 'The Fellowship of the Ring',
									format: 'novel',
									year: 1954,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
										name: 'The Lord of the Rings',
										surMaterial: {
											model: 'MATERIAL',
											uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
											name: 'Tolkien\'s Legendarium'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'by special arrangement with',
							entities: [
								{
									model: 'COMPANY',
									uuid: THE_TOLKIEN_ESTATE_COMPANY_UUID,
									name: 'The Tolkien Estate'
								},
								{
									model: 'PERSON',
									uuid: BAILLIE_TOLKIEN_PERSON_UUID,
									name: 'Baillie Tolkien'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = theTolkienEstateCompany.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

	});

	describe('Baillie Tolkien (person)', () => {

		it('includes materials for which they have a rights grantor credit, with corresponding sur-material and sur-sur-material', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_FELLOWSHIP_OF_THE_RINGS_PLAY_MATERIAL_UUID,
					name: 'The Fellowship of the Ring',
					format: 'play',
					year: 2007,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_PLAYS_MATERIAL_UUID,
						name: 'The Lord of the Rings',
						surMaterial: {
							model: 'MATERIAL',
							uuid: TOLKIENS_LEGENDARIUM_COLLECTION_OF_PLAYS_MATERIAL_UUID,
							name: 'Tolkien\'s Legendarium'
						}
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: SHAUN_MCKENNA_PERSON_UUID,
									name: 'Shaun McKenna'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_FELLOWSHIP_OF_THE_RING_NOVEL_MATERIAL_UUID,
									name: 'The Fellowship of the Ring',
									format: 'novel',
									year: 1954,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_LORD_OF_THE_RINGS_TRILOGY_OF_NOVELS_MATERIAL_UUID,
										name: 'The Lord of the Rings',
										surMaterial: {
											model: 'MATERIAL',
											uuid: TOLKIENS_LEGENDARIUM_BODY_OF_WRITING_MATERIAL_UUID,
											name: 'Tolkien\'s Legendarium'
										}
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: J_R_R_TOLKIEN_PERSON_UUID,
													name: 'J R R Tolkien'
												}
											]
										}
									]
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'by special arrangement with',
							entities: [
								{
									model: 'COMPANY',
									uuid: THE_TOLKIEN_ESTATE_COMPANY_UUID,
									name: 'The Tolkien Estate'
								},
								{
									model: 'PERSON',
									uuid: BAILLIE_TOLKIEN_PERSON_UUID,
									name: 'Baillie Tolkien'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = baillieTolkienPerson.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

	});

});

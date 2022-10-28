import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Sub-materials with rights grantor credits', () => {

	chai.use(chaiHttp);

	const THE_LION_THE_WITCH_AND_THE_WARDROBE_NOVEL_MATERIAL_UUID = '3';
	const C_S_LEWIS_PERSON_UUID = '5';
	const THE_CHRONICLES_OF_NARNIA_SERIES_OF_NOVELS_MATERIAL_UUID = '10';
	const THE_LION_THE_WITCH_AND_THE_WARDROBE_PLAY_MATERIAL_UUID = '20';
	const ADAM_PECK_PERSON_UUID = '22';
	const C_S_LEWIS_SOCIETY_COMPANY_UUID = '24';
	const SARAH_SELDEN_PERSON_UUID = '25';
	const THE_CHRONICLES_OF_NARNIA_PLAYS_MATERIAL_UUID = '31';

	let cSLewisSocietyCompany;
	let sarahSeldenPerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Lion, the Witch and the Wardrobe',
				differentiator: '1',
				format: 'novel',
				year: '1950',
				writingCredits: [
					{
						entities: [
							{
								name: 'C S Lewis'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Chronicles of Narnia',
				differentiator: '1',
				format: 'series of novels',
				year: '1956',
				writingCredits: [
					{
						entities: [
							{
								name: 'C S Lewis'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Lion, the Witch and the Wardrobe',
						differentiator: '1'
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Lion, the Witch and the Wardrobe',
				differentiator: '2',
				format: 'play',
				year: '2017',
				writingCredits: [
					{
						entities: [
							{
								name: 'Adam Peck'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Lion, the Witch and the Wardrobe',
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
								name: 'C S Lewis Society'
							},
							{
								name: 'Sarah Selden'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Chronicles of Narnia',
				differentiator: '2',
				format: 'plays',
				year: '2017',
				writingCredits: [
					{
						entities: [
							{
								name: 'Adam Peck'
							}
						]
					},
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Chronicles of Narnia',
								differentiator: '1'
							}
						]
					}
				],
				subMaterials: [
					{
						name: 'The Lion, the Witch and the Wardrobe',
						differentiator: '2'
					}
				]
			});

		cSLewisSocietyCompany = await chai.request(app)
			.get(`/companies/${C_S_LEWIS_SOCIETY_COMPANY_UUID}`);

		sarahSeldenPerson = await chai.request(app)
			.get(`/people/${SARAH_SELDEN_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('C S Lewis Society (company)', () => {

		it('includes materials for which it has a rights grantor credit, with corresponding sur-material', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_PLAY_MATERIAL_UUID,
					name: 'The Lion, the Witch and the Wardrobe',
					format: 'play',
					year: 2017,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_CHRONICLES_OF_NARNIA_PLAYS_MATERIAL_UUID,
						name: 'The Chronicles of Narnia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ADAM_PECK_PERSON_UUID,
									name: 'Adam Peck'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_NOVEL_MATERIAL_UUID,
									name: 'The Lion, the Witch and the Wardrobe',
									format: 'novel',
									year: 1950,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_CHRONICLES_OF_NARNIA_SERIES_OF_NOVELS_MATERIAL_UUID,
										name: 'The Chronicles of Narnia'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: C_S_LEWIS_PERSON_UUID,
													name: 'C S Lewis'
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
									uuid: C_S_LEWIS_SOCIETY_COMPANY_UUID,
									name: 'C S Lewis Society'
								},
								{
									model: 'PERSON',
									uuid: SARAH_SELDEN_PERSON_UUID,
									name: 'Sarah Selden'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = cSLewisSocietyCompany.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

	});

	describe('Sarah Selden (person)', () => {

		it('includes materials for which they have a rights grantor credit, with corresponding sur-material', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_PLAY_MATERIAL_UUID,
					name: 'The Lion, the Witch and the Wardrobe',
					format: 'play',
					year: 2017,
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_CHRONICLES_OF_NARNIA_PLAYS_MATERIAL_UUID,
						name: 'The Chronicles of Narnia'
					},
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: ADAM_PECK_PERSON_UUID,
									name: 'Adam Peck'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'based on',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LION_THE_WITCH_AND_THE_WARDROBE_NOVEL_MATERIAL_UUID,
									name: 'The Lion, the Witch and the Wardrobe',
									format: 'novel',
									year: 1950,
									surMaterial: {
										model: 'MATERIAL',
										uuid: THE_CHRONICLES_OF_NARNIA_SERIES_OF_NOVELS_MATERIAL_UUID,
										name: 'The Chronicles of Narnia'
									},
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: C_S_LEWIS_PERSON_UUID,
													name: 'C S Lewis'
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
									uuid: C_S_LEWIS_SOCIETY_COMPANY_UUID,
									name: 'C S Lewis Society'
								},
								{
									model: 'PERSON',
									uuid: SARAH_SELDEN_PERSON_UUID,
									name: 'Sarah Selden'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = sarahSeldenPerson.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

	});

});

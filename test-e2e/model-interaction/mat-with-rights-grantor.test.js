import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';

describe('Material with rights grantor credits', () => {

	chai.use(chaiHttp);

	const THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID = '3';
	const WILLIAM_ROSE_PERSON_UUID = '5';
	const THE_LADYKILLERS_PLAY_MATERIAL_UUID = '12';
	const GRAHAM_LINEHAN_PERSON_UUID = '14';
	const STUDIOCANAL_COMPANY_UUID = '16';
	const ALISON_MEESE_PERSON_UUID = '17';

	let studioCanalCompany;
	let alisonMeesePerson;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Ladykillers',
				differentiator: '1',
				format: 'motion picture screenplay',
				year: '1955',
				writingCredits: [
					{
						entities: [
							{
								name: 'William Rose'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Ladykillers',
				differentiator: '2',
				format: 'play',
				year: '2011',
				writingCredits: [
					{
						entities: [
							{
								name: 'Graham Linehan'
							}
						]
					},
					{
						name: 'from',
						entities: [
							{
								model: 'MATERIAL',
								name: 'The Ladykillers',
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
								name: 'StudioCanal'
							},
							{
								name: 'Alison Meese'
							}
						]
					}
				]
			});

		studioCanalCompany = await chai.request(app)
			.get(`/companies/${STUDIOCANAL_COMPANY_UUID}`);

		alisonMeesePerson = await chai.request(app)
			.get(`/people/${ALISON_MEESE_PERSON_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('StudioCanal (company)', () => {

		it('includes materials for which it has a rights grantor credit', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LADYKILLERS_PLAY_MATERIAL_UUID,
					name: 'The Ladykillers',
					format: 'play',
					year: 2011,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: GRAHAM_LINEHAN_PERSON_UUID,
									name: 'Graham Linehan'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID,
									name: 'The Ladykillers',
									format: 'motion picture screenplay',
									year: 1955,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_ROSE_PERSON_UUID,
													name: 'William Rose'
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
									uuid: STUDIOCANAL_COMPANY_UUID,
									name: 'StudioCanal'
								},
								{
									model: 'PERSON',
									uuid: ALISON_MEESE_PERSON_UUID,
									name: 'Alison Meese'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = studioCanalCompany.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

	});

	describe('Alison Meese (person)', () => {

		it('includes materials for which they have a rights grantor credit', () => {

			const expectedRightsGrantorMaterials = [
				{
					model: 'MATERIAL',
					uuid: THE_LADYKILLERS_PLAY_MATERIAL_UUID,
					name: 'The Ladykillers',
					format: 'play',
					year: 2011,
					surMaterial: null,
					writingCredits: [
						{
							model: 'WRITING_CREDIT',
							name: 'by',
							entities: [
								{
									model: 'PERSON',
									uuid: GRAHAM_LINEHAN_PERSON_UUID,
									name: 'Graham Linehan'
								}
							]
						},
						{
							model: 'WRITING_CREDIT',
							name: 'from',
							entities: [
								{
									model: 'MATERIAL',
									uuid: THE_LADYKILLERS_SCREENPLAY_MATERIAL_UUID,
									name: 'The Ladykillers',
									format: 'motion picture screenplay',
									year: 1955,
									surMaterial: null,
									writingCredits: [
										{
											model: 'WRITING_CREDIT',
											name: 'by',
											entities: [
												{
													model: 'PERSON',
													uuid: WILLIAM_ROSE_PERSON_UUID,
													name: 'William Rose'
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
									uuid: STUDIOCANAL_COMPANY_UUID,
									name: 'StudioCanal'
								},
								{
									model: 'PERSON',
									uuid: ALISON_MEESE_PERSON_UUID,
									name: 'Alison Meese'
								}
							]
						}
					]
				}
			];

			const { rightsGrantorMaterials } = alisonMeesePerson.body;

			expect(rightsGrantorMaterials).to.deep.equal(expectedRightsGrantorMaterials);

		});

	});

});

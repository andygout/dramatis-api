import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Playtexts with source material', () => {

	chai.use(chaiHttp);

	const A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID = '3';
	const WILLIAM_SHAKESPEARE_PERSON_UUID = '5';
	const THE_INDIAN_BOY_PLAYTEXT_UUID = '11';
	const RONA_MUNRO_PERSON_UUID = '13';
	const THE_INDIAN_BOY_CHARACTER_UUID = '15';
	const THE_INDIAN_BOY_ROYAL_SHAKESPEARE_THEATRE_PRODUCTION_UUID = '16';
	const ROYAL_SHAKESPEARE_THEATRE_UUID = '18';

	let theIndianBoyPlaytext;
	let aMidsummerNightsDreamPlaytext;
	let ronaMunroPerson;
	let williamShakespearePerson;
	let theIndianBoyRoyalShakespeareTheatreProduction;
	let theIndianBoyCharacter;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'A Midsummer Night\'s Dream',
				writerGroups: [
					{
						writers: [
							{
								name: 'William Shakespeare'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'The Indian Boy',
				writerGroups: [
					{
						writers: [
							{
								name: 'Rona Munro'
							}
						]
					},
					{
						name: 'inspired by',
						writers: [
							{
								name: 'A Midsummer Night\'s Dream',
								model: 'playtext'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'The Indian Boy'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Indian Boy',
				playtext: {
					name: 'The Indian Boy'
				},
				theatre: {
					name: 'Royal Shakespeare Theatre'
				}
			});

		theIndianBoyPlaytext = await chai.request(app)
			.get(`/playtexts/${THE_INDIAN_BOY_PLAYTEXT_UUID}`);

		aMidsummerNightsDreamPlaytext = await chai.request(app)
			.get(`/playtexts/${A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID}`);

		ronaMunroPerson = await chai.request(app)
			.get(`/people/${RONA_MUNRO_PERSON_UUID}`);

		williamShakespearePerson = await chai.request(app)
			.get(`/people/${WILLIAM_SHAKESPEARE_PERSON_UUID}`);

		theIndianBoyRoyalShakespeareTheatreProduction = await chai.request(app)
			.get(`/productions/${THE_INDIAN_BOY_ROYAL_SHAKESPEARE_THEATRE_PRODUCTION_UUID}`);

		theIndianBoyCharacter = await chai.request(app)
			.get(`/characters/${THE_INDIAN_BOY_CHARACTER_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('The Indian Boy (playtext)', () => {

		it('includes writers of this playtext and its source material in their respective groups', () => {

			const expectedWriterGroups = [
				{
					model: 'writerGroup',
					name: 'by',
					writers: [
						{
							model: 'person',
							uuid: RONA_MUNRO_PERSON_UUID,
							name: 'Rona Munro',
							sourceMaterialWriterGroups: []
						}
					]
				},
				{
					model: 'writerGroup',
					name: 'inspired by',
					writers: [
						{
							model: 'playtext',
							uuid: A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID,
							name: 'A Midsummer Night\'s Dream',
							sourceMaterialWriterGroups: [
								{
									model: 'writerGroup',
									name: 'by',
									writers: [
										{
											model: 'person',
											uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
											name: 'William Shakespeare'
										}
									]
								}
							]
						}
					]
				}
			];

			const { writerGroups } = theIndianBoyPlaytext.body;

			expect(writerGroups).to.deep.equal(expectedWriterGroups);

		});

	});

	describe('A Midsummer Night\'s Dream (playtext)', () => {

		it('includes playtexts that used it as source material (in which their uuid is nullified), with corresponding writers', () => {

			const expectedSourcingPlaytexts = [
				{
					model: 'playtext',
					uuid: THE_INDIAN_BOY_PLAYTEXT_UUID,
					name: 'The Indian Boy',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro'
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'inspired by',
							writers: [
								{
									model: 'playtext',
									uuid: null,
									name: 'A Midsummer Night\'s Dream'
								}
							]
						}
					]
				}
			];

			const { sourcingPlaytexts } = aMidsummerNightsDreamPlaytext.body;

			expect(sourcingPlaytexts).to.deep.equal(expectedSourcingPlaytexts);

		});

		it('includes productions of playtexts that used it as source material', () => {

			const expectedSourcingPlaytextProductions = [
				{
					model: 'production',
					uuid: THE_INDIAN_BOY_ROYAL_SHAKESPEARE_THEATRE_PRODUCTION_UUID,
					name: 'The Indian Boy',
					theatre: {
						model: 'theatre',
						uuid: ROYAL_SHAKESPEARE_THEATRE_UUID,
						name: 'Royal Shakespeare Theatre',
						surTheatre: null
					}
				}
			];

			const { sourcingPlaytextProductions } = aMidsummerNightsDreamPlaytext.body;

			expect(sourcingPlaytextProductions).to.deep.equal(expectedSourcingPlaytextProductions);

		});

	});

	describe('Rona Munro (person)', () => {

		it('includes playtexts they have written (in which their uuid is nullified), with corresponding writers', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: THE_INDIAN_BOY_PLAYTEXT_UUID,
					name: 'The Indian Boy',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: null,
									name: 'Rona Munro',
									sourceMaterialWriterGroups: []
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'inspired by',
							writers: [
								{
									model: 'playtext',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID,
									name: 'A Midsummer Night\'s Dream',
									sourceMaterialWriterGroups: [
										{
											model: 'writerGroup',
											name: 'by',
											writers: [
												{
													model: 'person',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
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

			const { playtexts } = ronaMunroPerson.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

	});

	describe('William Shakespeare (person)', () => {

		it('includes playtexts that used their work as source material, with corresponding writers', () => {

			const expectedSourcingPlaytexts = [
				{
					model: 'playtext',
					uuid: THE_INDIAN_BOY_PLAYTEXT_UUID,
					name: 'The Indian Boy',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro'
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'inspired by',
							writers: [
								{
									model: 'playtext',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID,
									name: 'A Midsummer Night\'s Dream'
								}
							]
						}
					]
				}
			];

			const { sourcingPlaytexts } = williamShakespearePerson.body;

			expect(sourcingPlaytexts).to.deep.equal(expectedSourcingPlaytexts);

		});

	});

	describe('The Indian Boy at Royal Shakespeare Theatre (production)', () => {

		it('includes in its playtext data the writers of the playtext and its source material', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: THE_INDIAN_BOY_PLAYTEXT_UUID,
				name: 'The Indian Boy',
				writerGroups: [
					{
						model: 'writerGroup',
						name: 'by',
						writers: [
							{
								model: 'person',
								uuid: RONA_MUNRO_PERSON_UUID,
								name: 'Rona Munro',
								sourceMaterialWriterGroups: []
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'inspired by',
						writers: [
							{
								model: 'playtext',
								uuid: A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID,
								name: 'A Midsummer Night\'s Dream',
								sourceMaterialWriterGroups: [
									{
										model: 'writerGroup',
										name: 'by',
										writers: [
											{
												model: 'person',
												uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
												name: 'William Shakespeare'
											}
										]
									}
								]
							}
						]
					}
				]
			};

			const { playtext } = theIndianBoyRoyalShakespeareTheatreProduction.body;

			expect(playtext).to.deep.equal(expectedPlaytext);

		});

	});

	describe('The Indian Boy (character)', () => {

		it('includes in its playtext data the writers of the playtext and its source material', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: THE_INDIAN_BOY_PLAYTEXT_UUID,
					name: 'The Indian Boy',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro',
									sourceMaterialWriterGroups: []
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'inspired by',
							writers: [
								{
									model: 'playtext',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID,
									name: 'A Midsummer Night\'s Dream',
									sourceMaterialWriterGroups: [
										{
											model: 'writerGroup',
											name: 'by',
											writers: [
												{
													model: 'person',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
												}
											]
										}
									]
								}
							]
						}
					],
					depictions: []
				}
			];

			const { playtexts } = theIndianBoyCharacter.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

	});

	describe('playtexts list', () => {

		it('includes writers of the playtexts and their corresponding source material', async () => {

			const response = await chai.request(app)
				.get('/playtexts');

			const expectedResponseBody = [
				{
					model: 'playtext',
					uuid: A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID,
					name: 'A Midsummer Night\'s Dream',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
									name: 'William Shakespeare',
									sourceMaterialWriterGroups: []
								}
							]
						}
					]
				},
				{
					model: 'playtext',
					uuid: THE_INDIAN_BOY_PLAYTEXT_UUID,
					name: 'The Indian Boy',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: RONA_MUNRO_PERSON_UUID,
									name: 'Rona Munro',
									sourceMaterialWriterGroups: []
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'inspired by',
							writers: [
								{
									model: 'playtext',
									uuid: A_MIDSUMMER_NIGHTS_DREAM_PLAYTEXT_UUID,
									name: 'A Midsummer Night\'s Dream',
									sourceMaterialWriterGroups: [
										{
											model: 'writerGroup',
											name: 'by',
											writers: [
												{
													model: 'person',
													uuid: WILLIAM_SHAKESPEARE_PERSON_UUID,
													name: 'William Shakespeare'
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

			expect(response).to.have.status(200);
			expect(response.body).to.deep.equal(expectedResponseBody);

		});

	});

});

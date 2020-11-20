import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Playtext with multiple writer groups', () => {

	chai.use(chaiHttp);

	const PEER_GYNT_PLAYTEXT_UUID = '6';
	const HENRIK_IBSEN_PERSON_UUID = '7';
	const GERRY_BAMMAN_PERSON_UUID = '8';
	const IRENE_B_BERMAN_PERSON_UUID = '9';
	const BALTASAR_KORMÁKUR_PERSON_UUID = '10';
	const PEER_GYNT_CHARACTER_UUID = '11';
	const GHOSTS_PLAYTEXT_UUID = '15';
	const AMELIA_BULLMORE_PERSON_UUID = '17';
	const PEER_GYNT_BARBICAN_PRODUCTION_UUID = '18';

	let peerGyntPlaytext;
	let henrikIbsenPerson;
	let peerGyntCharacter;
	let peerGyntBarbicanProduction;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(uuid, 'v4').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Peer Gynt',
				writerGroups: [
					{
						writers: [
							{
								name: 'Henrik Ibsen'
							}
						]
					},
					{
						name: 'translated by',
						writers: [
							{
								name: 'Gerry Bamman'
							},
							{
								name: 'Irene B Berman'
							}
						]
					},
					{
						name: 'adapted by',
						writers: [
							{
								name: 'Baltasar Kormákur'
							}
						]
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Peer Gynt'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Ghosts',
				writerGroups: [
					{
						writers: [
							{
								name: 'Henrik Ibsen'
							}
						]
					},
					{
						name: 'version by',
						writers: [
							{
								name: 'Amelia Bullmore'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Peer Gynt',
				playtext: {
					name: 'Peer Gynt'
				},
				theatre: {
					name: 'Barbican'
				}
			});

		peerGyntPlaytext = await chai.request(app)
			.get(`/playtexts/${PEER_GYNT_PLAYTEXT_UUID}`);

		henrikIbsenPerson = await chai.request(app)
			.get(`/people/${HENRIK_IBSEN_PERSON_UUID}`);

		peerGyntCharacter = await chai.request(app)
			.get(`/characters/${PEER_GYNT_CHARACTER_UUID}`);

		peerGyntBarbicanProduction = await chai.request(app)
			.get(`/productions/${PEER_GYNT_BARBICAN_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Peer Gynt (playtext)', () => {

		it('includes writers of this playtext in their respective groups', () => {

			const expectedWriterGroups = [
				{
					model: 'writerGroup',
					name: 'by',
					writers: [
						{
							model: 'person',
							uuid: HENRIK_IBSEN_PERSON_UUID,
							name: 'Henrik Ibsen'
						}
					]
				},
				{
					model: 'writerGroup',
					name: 'translated by',
					writers: [
						{
							model: 'person',
							uuid: GERRY_BAMMAN_PERSON_UUID,
							name: 'Gerry Bamman'
						},
						{
							model: 'person',
							uuid: IRENE_B_BERMAN_PERSON_UUID,
							name: 'Irene B Berman'
						}
					]
				},
				{
					model: 'writerGroup',
					name: 'adapted by',
					writers: [
						{
							model: 'person',
							uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
							name: 'Baltasar Kormákur'
						}
					]
				}
			];

			const { writerGroups } = peerGyntPlaytext.body;

			expect(writerGroups).to.deep.equal(expectedWriterGroups);

		});

	});

	describe('Henrik Ibsen (person)', () => {

		it('includes playtexts they have written, with corresponding writers (in which their uuid is nullified)', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: GHOSTS_PLAYTEXT_UUID,
					name: 'Ghosts',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: null,
									name: 'Henrik Ibsen'
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'version by',
							writers: [
								{
									model: 'person',
									uuid: AMELIA_BULLMORE_PERSON_UUID,
									name: 'Amelia Bullmore'
								}
							]
						}
					]
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_PLAYTEXT_UUID,
					name: 'Peer Gynt',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: null,
									name: 'Henrik Ibsen'
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'translated by',
							writers: [
								{
									model: 'person',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'adapted by',
							writers: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					]
				}
			];

			const { playtexts } = henrikIbsenPerson.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

	});

	describe('Peer Gynt at Barbican (production)', () => {

		it('includes in its playtext data the writers of the playtext', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: PEER_GYNT_PLAYTEXT_UUID,
				name: 'Peer Gynt',
				writerGroups: [
					{
						model: 'writerGroup',
						name: 'by',
						writers: [
							{
								model: 'person',
								uuid: HENRIK_IBSEN_PERSON_UUID,
								name: 'Henrik Ibsen'
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'translated by',
						writers: [
							{
								model: 'person',
								uuid: GERRY_BAMMAN_PERSON_UUID,
								name: 'Gerry Bamman'
							},
							{
								model: 'person',
								uuid: IRENE_B_BERMAN_PERSON_UUID,
								name: 'Irene B Berman'
							}
						]
					},
					{
						model: 'writerGroup',
						name: 'adapted by',
						writers: [
							{
								model: 'person',
								uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
								name: 'Baltasar Kormákur'
							}
						]
					}
				]
			};

			const { playtext } = peerGyntBarbicanProduction.body;

			expect(playtext).to.deep.equal(expectedPlaytext);

		});

	});

	describe('Peer Gynt (character)', () => {

		it('includes in its playtext data the writers of the playtext', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: PEER_GYNT_PLAYTEXT_UUID,
					name: 'Peer Gynt',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'translated by',
							writers: [
								{
									model: 'person',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'adapted by',
							writers: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
								}
							]
						}
					],
					depictions: []
				}
			];

			const { playtexts } = peerGyntCharacter.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

	});

	describe('playtexts list', () => {

		it('includes writers', async () => {

			const response = await chai.request(app)
				.get('/playtexts');

			const expectedResponseBody = [
				{
					model: 'playtext',
					uuid: GHOSTS_PLAYTEXT_UUID,
					name: 'Ghosts',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'version by',
							writers: [
								{
									model: 'person',
									uuid: AMELIA_BULLMORE_PERSON_UUID,
									name: 'Amelia Bullmore'
								}
							]
						}
					]
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_PLAYTEXT_UUID,
					name: 'Peer Gynt',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'by',
							writers: [
								{
									model: 'person',
									uuid: HENRIK_IBSEN_PERSON_UUID,
									name: 'Henrik Ibsen'
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'translated by',
							writers: [
								{
									model: 'person',
									uuid: GERRY_BAMMAN_PERSON_UUID,
									name: 'Gerry Bamman'
								},
								{
									model: 'person',
									uuid: IRENE_B_BERMAN_PERSON_UUID,
									name: 'Irene B Berman'
								}
							]
						},
						{
							model: 'writerGroup',
							name: 'adapted by',
							writers: [
								{
									model: 'person',
									uuid: BALTASAR_KORMÁKUR_PERSON_UUID,
									name: 'Baltasar Kormákur'
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

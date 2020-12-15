import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import app from '../../src/app';
import purgeDatabase from '../test-helpers/neo4j/purge-database';

describe('Playtexts with multiple versions and multiple writer groups', () => {

	chai.use(chaiHttp);

	const PEER_GYNT_ORIGINAL_VERSION_PLAYTEXT_UUID = '4';
	const HENRIK_IBSEN_PERSON_UUID = '6';
	const PEER_GYNT_CHARACTER_UUID = '7';
	const PEER_GYNT_SUBSEQUENT_VERSION_1_PLAYTEXT_UUID = '13';
	const FRANK_MCGUINNESS_PERSON_UUID = '16';
	const PEER_GYNT_SUBSEQUENT_VERSION_2_PLAYTEXT_UUID = '25';
	const GERRY_BAMMAN_PERSON_UUID = '28';
	const IRENE_B_BERMAN_PERSON_UUID = '29';
	const BALTASAR_KORMÁKUR_PERSON_UUID = '30';
	const GHOSTS_ORIGINAL_VERSION_PLAYTEXT_UUID = '35';
	const GHOSTS_SUBSEQUENT_VERSION_PLAYTEXT_UUID = '44';
	const PEER_GYNT_BARBICAN_PRODUCTION_UUID = '50';

	let peerGyntOriginalPlaytext;
	let peerGyntSubsequentVersion2Playtext;
	let henrikIbsenPerson;
	let gerryBammanPerson;
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
				differentiator: '1',
				writerGroups: [
					{
						writers: [
							{
								name: 'Henrik Ibsen'
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
				name: 'Peer Gynt',
				differentiator: '2',
				originalVersionPlaytext: {
					name: 'Peer Gynt',
					differentiator: '1'
				},
				writerGroups: [
					{
						isOriginalVersionWriter: true,
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
								name: 'Frank McGuinness'
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
				name: 'Peer Gynt',
				differentiator: '3',
				originalVersionPlaytext: {
					name: 'Peer Gynt',
					differentiator: '1'
				},
				writerGroups: [
					{
						isOriginalVersionWriter: true,
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
				differentiator: '1',
				writerGroups: [
					{
						writers: [
							{
								name: 'Henrik Ibsen'
							}
						]
					}
				]
			});

		// Contrivance for purposes of test.
		await chai.request(app)
			.post('/playtexts')
			.send({
				name: 'Ghosts',
				differentiator: '2',
				writerGroups: [
					{
						isOriginalVersionWriter: true,
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
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Peer Gynt',
				playtext: {
					name: 'Peer Gynt',
					differentiator: '3'
				},
				theatre: {
					name: 'Barbican'
				}
			});

		peerGyntOriginalPlaytext = await chai.request(app)
			.get(`/playtexts/${PEER_GYNT_ORIGINAL_VERSION_PLAYTEXT_UUID}`);

		peerGyntSubsequentVersion2Playtext = await chai.request(app)
			.get(`/playtexts/${PEER_GYNT_SUBSEQUENT_VERSION_2_PLAYTEXT_UUID}`);

		henrikIbsenPerson = await chai.request(app)
			.get(`/people/${HENRIK_IBSEN_PERSON_UUID}`);

		gerryBammanPerson = await chai.request(app)
			.get(`/people/${GERRY_BAMMAN_PERSON_UUID}`);

		peerGyntCharacter = await chai.request(app)
			.get(`/characters/${PEER_GYNT_CHARACTER_UUID}`);

		peerGyntBarbicanProduction = await chai.request(app)
			.get(`/productions/${PEER_GYNT_BARBICAN_PRODUCTION_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Peer Gynt (original version) (playtext)', () => {

		it('includes subsequent versions of this playtext, with corresponding writers (version writers only, i.e. excludes original version writers)', () => {

			const expectedSubsequentVersionPlaytexts = [
				{
					model: 'playtext',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_PLAYTEXT_UUID,
					name: 'Peer Gynt',
					writerGroups: [
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
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_PLAYTEXT_UUID,
					name: 'Peer Gynt',
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'version by',
							writers: [
								{
									model: 'person',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionPlaytexts } = peerGyntOriginalPlaytext.body;

			expect(subsequentVersionPlaytexts).to.deep.equal(expectedSubsequentVersionPlaytexts);

		});

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
				}
			];

			const { writerGroups } = peerGyntOriginalPlaytext.body;

			expect(writerGroups).to.deep.equal(expectedWriterGroups);

		});

	});

	describe('Peer Gynt (subsequent version) (playtext)', () => {

		it('includes original version of this playtext, with corresponding writers', () => {

			const expectedOriginalVersionPlaytext = {
				model: 'playtext',
				uuid: PEER_GYNT_ORIGINAL_VERSION_PLAYTEXT_UUID,
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
					}
				]
			};

			const { originalVersionPlaytext } = peerGyntSubsequentVersion2Playtext.body;

			expect(originalVersionPlaytext).to.deep.equal(expectedOriginalVersionPlaytext);

		});

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

			const { writerGroups } = peerGyntSubsequentVersion2Playtext.body;

			expect(writerGroups).to.deep.equal(expectedWriterGroups);

		});

	});

	describe('Henrik Ibsen (person)', () => {

		it('includes playtexts they have written (in which their uuid is nullified)', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: GHOSTS_ORIGINAL_VERSION_PLAYTEXT_UUID,
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
						}
					]
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_ORIGINAL_VERSION_PLAYTEXT_UUID,
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
						}
					]
				}
			];

			const { playtexts } = henrikIbsenPerson.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

		it('includes subsequent versions of playtexts they originally wrote (in which their uuid is nullified), with corresponding writers', () => {

			const expectedSubsequentVersionPlaytexts = [
				{
					model: 'playtext',
					uuid: GHOSTS_SUBSEQUENT_VERSION_PLAYTEXT_UUID,
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
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_PLAYTEXT_UUID,
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
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_PLAYTEXT_UUID,
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
							name: 'version by',
							writers: [
								{
									model: 'person',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				}
			];

			const { subsequentVersionPlaytexts } = henrikIbsenPerson.body;

			expect(subsequentVersionPlaytexts).to.deep.equal(expectedSubsequentVersionPlaytexts);

		});

	});

	describe('Gerry Bamman (person)', () => {

		it('includes playtexts they have written (in which their uuid is nullified), with corresponding writers', () => {

			const expectedPlaytexts = [
				{
					model: 'playtext',
					uuid: GHOSTS_SUBSEQUENT_VERSION_PLAYTEXT_UUID,
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
							name: 'translated by',
							writers: [
								{
									model: 'person',
									uuid: null,
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
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_PLAYTEXT_UUID,
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
									uuid: null,
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

			const { playtexts } = gerryBammanPerson.body;

			expect(playtexts).to.deep.equal(expectedPlaytexts);

		});

	});

	describe('Peer Gynt at Barbican (production)', () => {

		it('includes in its playtext data the writers of the playtext', () => {

			const expectedPlaytext = {
				model: 'playtext',
				uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_PLAYTEXT_UUID,
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
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_PLAYTEXT_UUID,
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
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_PLAYTEXT_UUID,
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
							name: 'version by',
							writers: [
								{
									model: 'person',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					],
					depictions: []
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_ORIGINAL_VERSION_PLAYTEXT_UUID,
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
					uuid: GHOSTS_ORIGINAL_VERSION_PLAYTEXT_UUID,
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
						}
					]
				},
				{
					model: 'playtext',
					uuid: GHOSTS_SUBSEQUENT_VERSION_PLAYTEXT_UUID,
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
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_ORIGINAL_VERSION_PLAYTEXT_UUID,
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
						}
					]
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_1_PLAYTEXT_UUID,
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
							name: 'version by',
							writers: [
								{
									model: 'person',
									uuid: FRANK_MCGUINNESS_PERSON_UUID,
									name: 'Frank McGuinness'
								}
							]
						}
					]
				},
				{
					model: 'playtext',
					uuid: PEER_GYNT_SUBSEQUENT_VERSION_2_PLAYTEXT_UUID,
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

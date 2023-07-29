import crypto from 'crypto';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox } from 'sinon';

import app from '../../src/app';
import { purgeDatabase } from '../test-helpers/neo4j';

describe('Ordering of multi-tiered materials/productions credits', () => {

	chai.use(chaiHttp);

	const BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID = '3';
	const BAR_CHARACTER_UUID = '5';
	const DURANDS_LINE_MATERIAL_UUID = '9';
	const CAMPAIGN_MATERIAL_UUID = '15';
	const PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID = '27';
	const BLACK_TULIPS_MATERIAL_UUID = '36';
	const BLOOD_AND_GIFTS_MATERIAL_UUID = '42';
	const MINISKIRTS_OF_KABUL_MATERIAL_UUID = '48';
	const PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID = '60';
	const HONEY_MATERIAL_UUID = '69';
	const THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID = '75';
	const ON_THE_SIDE_OF_THE_ANGELS_MATERIAL_UUID = '81';
	const PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID = '93';
	const THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID = '108';
	const BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID = '114';
	const TRICYCLE_THEATRE_VENUE_UUID = '116';
	const NICOLAS_KENT_PERSON_UUID = '117';
	const TRICYCLE_THEATRE_COMPANY_UUID = '118';
	const ZOË_INGENHAAG_PERSON_UUID = '119';
	const RICK_WARDEN_PERSON_UUID = '120';
	const HOWARD_HARRISON_PERSON_UUID = '121';
	const LIGHTING_DESIGN_LTD_COMPANY_UUID = '122';
	const JACK_KNOWLES_PERSON_UUID = '123';
	const LIZZIE_CHAPMAN_PERSON_UUID = '124';
	const STAGE_MANAGEMENT_LTD_COMPANY_UUID = '125';
	const CHARLOTTE_PADGHAM_PERSON_UUID = '126';
	const DURANDS_LINE_TRICYCLE_PRODUCTION_UUID = '127';
	const CAMPAIGN_TRICYCLE_PRODUCTION_UUID = '140';
	const PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID = '153';
	const BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID = '166';
	const BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID = '179';
	const MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID = '192';
	const PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID = '205';
	const HONEY_TRICYCLE_PRODUCTION_UUID = '218';
	const THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID = '231';
	const ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID = '244';
	const PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID = '257';
	const THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID = '270';
	const WALDO_MATERIAL_UUID = '285';
	const WIBBLE_MATERIAL_UUID = '290';
	const SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '293';
	const JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID = '295';
	const SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '296';
	const SUB_WIBBLE_PART_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '299';
	const MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '302';
	const SUB_WIBBLE_PART_IV_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '305';
	const SUB_WIBBLE_PART_V_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '308';
	const SUB_WIBBLE_PART_VI_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '311';
	const MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '314';
	const SUB_WIBBLE_PART_VII_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '317';
	const SUB_WIBBLE_PART_VIII_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '320';
	const SUB_WIBBLE_PART_IX_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '323';
	const MID_WIBBLE_SECTION_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '326';
	const SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID = '329';

	let nicolasKentPerson;
	let tricycleTheatreCompany;
	let zoëIngenhaagPerson;
	let rickWardenPerson;
	let howardHarrisonPerson;
	let lightingDesignLtdCompany;
	let jackKnowlesPerson;
	let lizzieChapmanPerson;
	let stageManagementLtdCompany;
	let charlottePadghamPerson;
	let barCharacter;
	let wibbleMaterial;
	let waldoMaterial;

	const sandbox = createSandbox();

	before(async () => {

		let uuidCallCount = 0;

		sandbox.stub(crypto, 'randomUUID').callsFake(() => (uuidCallCount++).toString());

		await purgeDatabase();

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Bugles at the Gates of Jalalabad',
				format: 'play',
				year: '2009',
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Durand\'s Line',
				format: 'play',
				year: '2009',
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Campaign',
				format: 'play',
				year: '2009',
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Part One - Invasions and Independence (1842-1930)',
				format: 'sub-collection of plays',
				year: '2009',
				subMaterials: [
					{
						name: 'Bugles at the Gates of Jalalabad'
					},
					{
						name: 'Durand\'s Line'
					},
					{
						name: 'Campaign'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Black Tulips',
				format: 'play',
				year: '2009',
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Blood and Gifts',
				format: 'play',
				year: '2009',
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Miniskirts of Kabul',
				format: 'play',
				year: '2009',
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
				format: 'sub-collection of plays',
				year: '2009',
				subMaterials: [
					{
						name: 'Black Tulips'
					},
					{
						name: 'Blood and Gifts'
					},
					{
						name: 'Miniskirts of Kabul'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Honey',
				format: 'play',
				year: '2009',
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Night Is Darkest Before the Dawn',
				format: 'play',
				year: '2009',
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'On the Side of the Angels',
				format: 'play',
				year: '2009',
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Part Three - Enduring Freedom (1996-2009)',
				format: 'sub-collection of plays',
				year: '2009',
				subMaterials: [
					{
						name: 'Honey'
					},
					{
						name: 'The Night Is Darkest Before the Dawn'
					},
					{
						name: 'On the Side of the Angels'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'The Great Game: Afghanistan',
				format: 'collection of plays',
				year: '2009',
				subMaterials: [
					{
						name: 'Part One - Invasions and Independence (1842-1930)'
					},
					{
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)'
					},
					{
						name: 'Part Three - Enduring Freedom (1996-2009)'
					}
				],
				characterGroups: [
					{
						characters: [
							{
								name: 'Bar'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Bugles at the Gates of Jalalabad',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Bugles at the Gates of Jalalabad'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Durand\'s Line',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Durand\'s Line'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Campaign',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Campaign'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part One - Invasions and Independence (1842-1930)',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Part One - Invasions and Independence (1842-1930)'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID
					}
				],
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Black Tulips',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Black Tulips'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Blood and Gifts',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Blood and Gifts'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Miniskirts of Kabul',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Miniskirts of Kabul'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID
					}
				],
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Honey',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Honey'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Night Is Darkest Before the Dawn',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'The Night Is Darkest Before the Dawn'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'On the Side of the Angels',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'On the Side of the Angels'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Part Three - Enduring Freedom (1996-2009)',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'Part Three - Enduring Freedom (1996-2009)'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: HONEY_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID
					}
				],
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'The Great Game: Afghanistan',
				startDate: '2009-04-17',
				pressDate: '2009-04-24',
				endDate: '2009-06-14',
				material: {
					name: 'The Great Game: Afghanistan'
				},
				venue: {
					name: 'Tricycle Theatre'
				},
				subProductions: [
					{
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID
					},
					{
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID
					}
				],
				producerCredits: [
					{
						entities: [
							{
								name: 'Nicolas Kent'
							},
							{
								model: 'COMPANY',
								name: 'Tricycle Theatre Company',
								members: [
									{
										name: 'Zoë Ingenhaag'
									}
								]
							}
						]
					}
				],
				cast: [
					{
						name: 'Rick Warden',
						roles: [
							{
								name: 'Bar'
							}
						]
					}
				],
				creativeCredits: [
					{
						name: 'Lighting Designers',
						entities: [
							{
								name: 'Howard Harrison'
							},
							{
								model: 'COMPANY',
								name: 'Lighting Design Ltd',
								members: [
									{
										name: 'Jack Knowles'
									}
								]
							}
						]
					}
				],
				crewCredits: [
					{
						name: 'Stage Managers',
						entities: [
							{
								name: 'Lizzie Chapman'
							},
							{
								model: 'COMPANY',
								name: 'Stage Management Ltd',
								members: [
									{
										name: 'Charlotte Padgham'
									}
								]
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Waldo',
				format: 'novel',
				year: '1974'
			});

		await chai.request(app)
			.post('/materials')
			.send({
				name: 'Wibble',
				format: 'play',
				year: '2009',
				writingCredits: [
					{
						name: 'based on',
						entities: [
							{
								model: 'MATERIAL',
								name: 'Waldo'
							}
						]
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part I',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part II',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part III',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Wibble: Section I',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: SUB_WIBBLE_PART_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part IV',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part V',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part VI',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Wibble: Section II',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_PART_IV_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: SUB_WIBBLE_PART_V_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: SUB_WIBBLE_PART_VI_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part VII',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part VIII',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sub-Wibble: Part IX',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				}
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Mid-Wibble: Section III',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: SUB_WIBBLE_PART_VII_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: SUB_WIBBLE_PART_VIII_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: SUB_WIBBLE_PART_IX_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		await chai.request(app)
			.post('/productions')
			.send({
				name: 'Sur-Wibble',
				startDate: '2009-05-01',
				endDate: '2009-05-31',
				material: {
					name: 'Wibble'
				},
				venue: {
					name: 'Jerwood Theatre Upstairs'
				},
				subProductions: [
					{
						uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					},
					{
						uuid: MID_WIBBLE_SECTION_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID
					}
				]
			});

		nicolasKentPerson = await chai.request(app)
			.get(`/people/${NICOLAS_KENT_PERSON_UUID}`);

		tricycleTheatreCompany = await chai.request(app)
			.get(`/companies/${TRICYCLE_THEATRE_COMPANY_UUID}`);

		zoëIngenhaagPerson = await chai.request(app)
			.get(`/people/${ZOË_INGENHAAG_PERSON_UUID}`);

		rickWardenPerson = await chai.request(app)
			.get(`/people/${RICK_WARDEN_PERSON_UUID}`);

		howardHarrisonPerson = await chai.request(app)
			.get(`/people/${HOWARD_HARRISON_PERSON_UUID}`);

		lightingDesignLtdCompany = await chai.request(app)
			.get(`/companies/${LIGHTING_DESIGN_LTD_COMPANY_UUID}`);

		jackKnowlesPerson = await chai.request(app)
			.get(`/people/${JACK_KNOWLES_PERSON_UUID}`);

		lizzieChapmanPerson = await chai.request(app)
			.get(`/people/${LIZZIE_CHAPMAN_PERSON_UUID}`);

		stageManagementLtdCompany = await chai.request(app)
			.get(`/companies/${STAGE_MANAGEMENT_LTD_COMPANY_UUID}`);

		charlottePadghamPerson = await chai.request(app)
			.get(`/people/${CHARLOTTE_PADGHAM_PERSON_UUID}`);

		barCharacter = await chai.request(app)
			.get(`/characters/${BAR_CHARACTER_UUID}`);

		wibbleMaterial = await chai.request(app)
			.get(`/materials/${WIBBLE_MATERIAL_UUID}`);

		waldoMaterial = await chai.request(app)
			.get(`/materials/${WALDO_MATERIAL_UUID}`);

	});

	after(() => {

		sandbox.restore();

	});

	describe('Nicolas Kent (person)', () => {

		it('includes all tiers of productions for which they have a direct producer credit, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = nicolasKentPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Tricycle Theatre Company (company)', () => {

		it('includes all tiers of productions for which they have a direct producer credit, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = tricycleTheatreCompany.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Zoë Ingenhaag (person)', () => {

		it('includes all tiers of productions for which they have a direct producer credit, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedProducerProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					producerCredits: [
						{
							model: 'PRODUCER_CREDIT',
							name: 'produced by',
							entities: [
								{
									model: 'PERSON',
									uuid: NICOLAS_KENT_PERSON_UUID,
									name: 'Nicolas Kent'
								},
								{
									model: 'COMPANY',
									uuid: TRICYCLE_THEATRE_COMPANY_UUID,
									name: 'Tricycle Theatre Company',
									members: [
										{
											model: 'PERSON',
											uuid: ZOË_INGENHAAG_PERSON_UUID,
											name: 'Zoë Ingenhaag'
										}
									]
								}
							]
						}
					]
				}
			];

			const { producerProductions } = zoëIngenhaagPerson.body;

			expect(producerProductions).to.deep.equal(expectedProducerProductions);

		});

	});

	describe('Rick Warden (person)', () => {

		it('includes all tiers of productions for which they have a direct cast credit, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedCastMemberProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					roles: [
						{
							model: 'CHARACTER',
							uuid: BAR_CHARACTER_UUID,
							name: 'Bar',
							qualifier: null,
							isAlternate: false
						}
					]
				}
			];

			const { castMemberProductions } = rickWardenPerson.body;

			expect(castMemberProductions).to.deep.equal(expectedCastMemberProductions);

		});

	});

	describe('Howard Harrison (person)', () => {

		it('includes all tiers of productions for which they have a direct creative team credit, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
									name: 'Lighting Design Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: JACK_KNOWLES_PERSON_UUID,
											name: 'Jack Knowles'
										}
									]
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = howardHarrisonPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Lighting Design Ltd (company)', () => {

		it('includes all tiers of productions for which they have a direct creative team credit, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							members: [
								{
									model: 'PERSON',
									uuid: JACK_KNOWLES_PERSON_UUID,
									name: 'Jack Knowles'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = lightingDesignLtdCompany.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Jack Knowles (person)', () => {

		it('includes all tiers of productions for which they have a direct creative team credit, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedCreativeProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					creativeCredits: [
						{
							model: 'CREATIVE_CREDIT',
							name: 'Lighting Designers',
							employerCompany: {
								model: 'COMPANY',
								uuid: LIGHTING_DESIGN_LTD_COMPANY_UUID,
								name: 'Lighting Design Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: HOWARD_HARRISON_PERSON_UUID,
									name: 'Howard Harrison'
								}
							]
						}
					]
				}
			];

			const { creativeProductions } = jackKnowlesPerson.body;

			expect(creativeProductions).to.deep.equal(expectedCreativeProductions);

		});

	});

	describe('Lizzie Chapman (person)', () => {

		it('includes all tiers of productions for which they have a direct crew credit, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: null,
							coEntities: [
								{
									model: 'COMPANY',
									uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
									name: 'Stage Management Ltd',
									members: [
										{
											model: 'PERSON',
											uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
											name: 'Charlotte Padgham'
										}
									]
								}
							]
						}
					]
				}
			];

			const { crewProductions } = lizzieChapmanPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Stage Management Ltd (company)', () => {

		it('includes all tiers of productions for which they have a direct crew credit, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							members: [
								{
									model: 'PERSON',
									uuid: CHARLOTTE_PADGHAM_PERSON_UUID,
									name: 'Charlotte Padgham'
								}
							],
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = stageManagementLtdCompany.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Charlotte Padgham (person)', () => {

		it('includes all tiers of productions for which they have a direct crew credit, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedCrewProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					crewCredits: [
						{
							model: 'CREW_CREDIT',
							name: 'Stage Managers',
							employerCompany: {
								model: 'COMPANY',
								uuid: STAGE_MANAGEMENT_LTD_COMPANY_UUID,
								name: 'Stage Management Ltd',
								coMembers: []
							},
							coEntities: [
								{
									model: 'PERSON',
									uuid: LIZZIE_CHAPMAN_PERSON_UUID,
									name: 'Lizzie Chapman'
								}
							]
						}
					]
				}
			];

			const { crewProductions } = charlottePadghamPerson.body;

			expect(crewProductions).to.deep.equal(expectedCrewProductions);

		});

	});

	describe('Bar (character)', () => {

		it('includes all tiers of materials in which character was depicted, including the sur-material and sur-sur-material as separate credits (ordered sub to sur ascending)', () => {

			const expectedMaterials = [
				{
					model: 'MATERIAL',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_MATERIAL_UUID,
					name: 'On the Side of the Angels',
					format: 'play',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_MATERIAL_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					format: 'play',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: HONEY_MATERIAL_UUID,
					name: 'Honey',
					format: 'play',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: PART_THREE_ENDURING_FREEDOM_MATERIAL_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					format: 'sub-collection of plays',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
						name: 'The Great Game: Afghanistan',
						surMaterial: null
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: MINISKIRTS_OF_KABUL_MATERIAL_UUID,
					name: 'Miniskirts of Kabul',
					format: 'play',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: BLOOD_AND_GIFTS_MATERIAL_UUID,
					name: 'Blood and Gifts',
					format: 'play',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: BLACK_TULIPS_MATERIAL_UUID,
					name: 'Black Tulips',
					format: 'play',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_MATERIAL_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					format: 'sub-collection of plays',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
						name: 'The Great Game: Afghanistan',
						surMaterial: null
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: CAMPAIGN_MATERIAL_UUID,
					name: 'Campaign',
					format: 'play',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: DURANDS_LINE_MATERIAL_UUID,
					name: 'Durand\'s Line',
					format: 'play',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_MATERIAL_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					format: 'play',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surMaterial: {
							model: 'MATERIAL',
							uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_MATERIAL_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					format: 'sub-collection of plays',
					year: 2009,
					writingCredits: [],
					surMaterial: {
						model: 'MATERIAL',
						uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
						name: 'The Great Game: Afghanistan',
						surMaterial: null
					},
					depictions: []
				},
				{
					model: 'MATERIAL',
					uuid: THE_GREAT_GAME_AFGHANISTAN_MATERIAL_UUID,
					name: 'The Great Game: Afghanistan',
					format: 'collection of plays',
					year: 2009,
					writingCredits: [],
					surMaterial: null,
					depictions: []
				}
			];

			const { materials } = barCharacter.body;

			expect(materials).to.deep.equal(expectedMaterials);

		});

		it('includes all tiers of productions in which character was portrayed, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: ON_THE_SIDE_OF_THE_ANGELS_TRICYCLE_PRODUCTION_UUID,
					name: 'On the Side of the Angels',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_NIGHT_IS_DARKEST_BEFORE_THE_DAWN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Night Is Darkest Before the Dawn',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: HONEY_TRICYCLE_PRODUCTION_UUID,
					name: 'Honey',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Three - Enduring Freedom (1996-2009)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_THREE_ENDURING_FREEDOM_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Three - Enduring Freedom (1996-2009)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: MINISKIRTS_OF_KABUL_TRICYCLE_PRODUCTION_UUID,
					name: 'Miniskirts of Kabul',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLOOD_AND_GIFTS_TRICYCLE_PRODUCTION_UUID,
					name: 'Blood and Gifts',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BLACK_TULIPS_TRICYCLE_PRODUCTION_UUID,
					name: 'Black Tulips',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
						name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_TWO_COMMUNISM_THE_MUJAHIDEEN_AND_THE_TALIBAN_TRICYCLE_PRODUCTION_UUID,
					name: 'Part Two - Communism, the Mujahideen and the Taliban (1979-1996)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: CAMPAIGN_TRICYCLE_PRODUCTION_UUID,
					name: 'Campaign',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: DURANDS_LINE_TRICYCLE_PRODUCTION_UUID,
					name: 'Durand\'s Line',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: BUGLES_AT_THE_GATES_OF_JALALABAD_TRICYCLE_PRODUCTION_UUID,
					name: 'Bugles at the Gates of Jalalabad',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
						name: 'Part One - Invasions and Independence (1842-1930)',
						surProduction: {
							model: 'PRODUCTION',
							uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
							name: 'The Great Game: Afghanistan'
						}
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: PART_ONE_INVASIONS_AND_INDEPENDENCE_TRICYCLE_PRODUCTION_UUID,
					name: 'Part One - Invasions and Independence (1842-1930)',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
						name: 'The Great Game: Afghanistan',
						surProduction: null
					},
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				},
				{
					model: 'PRODUCTION',
					uuid: THE_GREAT_GAME_AFGHANISTAN_TRICYCLE_PRODUCTION_UUID,
					name: 'The Great Game: Afghanistan',
					startDate: '2009-04-17',
					endDate: '2009-06-14',
					venue: {
						model: 'VENUE',
						uuid: TRICYCLE_THEATRE_VENUE_UUID,
						name: 'Tricycle Theatre',
						surVenue: null
					},
					surProduction: null,
					performers: [
						{
							model: 'PERSON',
							uuid: RICK_WARDEN_PERSON_UUID,
							name: 'Rick Warden',
							roleName: 'Bar',
							qualifier: null,
							isAlternate: false,
							otherRoles: []
						}
					]
				}
			];

			const { productions } = barCharacter.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Wibble (material)', () => {

		it('includes all tiers of productions of this material, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedProductions = [
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_IX_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part IX',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section III',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_VIII_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part VIII',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section III',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_VII_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part VII',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section III',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: MID_WIBBLE_SECTION_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Mid-Wibble: Section III',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Sur-Wibble',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_VI_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part VI',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section II',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_V_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part V',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section II',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_IV_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part IV',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section II',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Mid-Wibble: Section II',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Sur-Wibble',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part III',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section I',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part II',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section I',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part I',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section I',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Mid-Wibble: Section I',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Sur-Wibble',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sur-Wibble',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: null
				}
			];

			const { productions } = wibbleMaterial.body;

			expect(productions).to.deep.equal(expectedProductions);

		});

	});

	describe('Waldo (material)', () => {

		it('includes all tiers of production of material which used this as source material, including the sur-production and sur-sur-production as separate credits (ordered sub to sur ascending)', () => {

			const expectedSourcingMaterialProductions = [
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_IX_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part IX',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section III',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_VIII_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part VIII',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section III',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_VII_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part VII',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section III',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: MID_WIBBLE_SECTION_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Mid-Wibble: Section III',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Sur-Wibble',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_VI_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part VI',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section II',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_V_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part V',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section II',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_IV_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part IV',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section II',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: MID_WIBBLE_SECTION_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Mid-Wibble: Section II',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Sur-Wibble',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_III_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part III',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section I',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_II_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part II',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section I',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUB_WIBBLE_PART_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sub-Wibble: Part I',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Mid-Wibble: Section I',
						surProduction: {
							model: 'PRODUCTION',
							uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
							name: 'Sur-Wibble'
						}
					}
				},
				{
					model: 'PRODUCTION',
					uuid: MID_WIBBLE_SECTION_I_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Mid-Wibble: Section I',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: {
						model: 'PRODUCTION',
						uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
						name: 'Sur-Wibble',
						surProduction: null
					}
				},
				{
					model: 'PRODUCTION',
					uuid: SUR_WIBBLE_JERWOOD_THEATRE_UPSTAIRS_PRODUCTION_UUID,
					name: 'Sur-Wibble',
					startDate: '2009-05-01',
					endDate: '2009-05-31',
					venue: {
						model: 'VENUE',
						uuid: JERWOOD_THEATRE_UPSTAIRS_VENUE_UUID,
						name: 'Jerwood Theatre Upstairs',
						surVenue: null
					},
					surProduction: null
				}
			];

			const { sourcingMaterialProductions } = waldoMaterial.body;

			expect(sourcingMaterialProductions).to.deep.equal(expectedSourcingMaterialProductions);

		});

	});

});

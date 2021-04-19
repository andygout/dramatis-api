import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Production from '../../src/models/Production';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('Production instance', () => {

	const STRING_MAX_LENGTH = 1000;
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	const sandbox = createSandbox();

	beforeEach(() => {

		sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 0 });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('input validation failure', () => {

		context('name value is empty string', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: ''
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: ABOVE_MAX_LENGTH_STRING
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('startDate, pressDate, and endDate values with invalid date format', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					startDate: 'foobar',
					pressDate: 'foobar',
					endDate: 'foobar'
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: 'foobar',
					pressDate: 'foobar',
					endDate: 'foobar',
					hasErrors: true,
					errors: {
						startDate: [
							'Value needs to be in date format'
						],
						pressDate: [
							'Value needs to be in date format'
						],
						endDate: [
							'Value needs to be in date format'
						]
					},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('startDate, pressDate, and endDate with valid date format with startDate after pressDate and pressDate after endDate', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					startDate: '2011-01-26',
					pressDate: '2010-10-07',
					endDate: '2010-09-30'
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '2011-01-26',
					pressDate: '2010-10-07',
					endDate: '2010-09-30',
					hasErrors: true,
					errors: {
						startDate: [
							'Start date must not be after end date',
							'Start date must not be after press date'
						],
						pressDate: [
							'Press date must not be before start date',
							'Press date must not be after end date'
						],
						endDate: [
							'End date must not be before start date',
							'End date must not be before press date'
						]
					},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('material name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					material: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('material differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					material: {
						name: 'Hamlet',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: 'Hamlet',
						differentiator: ABOVE_MAX_LENGTH_STRING,
						errors: {
							differentiator: [
								'Value is too long'
							]
						}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('theatre name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					theatre: {
						name: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('theatre differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					theatre: {
						name: 'National Theatre',
						differentiator: ABOVE_MAX_LENGTH_STRING
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: 'National Theatre',
						differentiator: ABOVE_MAX_LENGTH_STRING,
						errors: {
							differentiator: [
								'Value is too long'
							]
						}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('producer credit name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Value is too long'
								]
							},
							entities: []
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate producer credit name values', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'Producer'
						},
						{
							name: 'Producer'
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [
						{
							name: 'Producer',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						},
						{
							name: 'Producer',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('producer credit entity (person) name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					producerCredits: [
						{
							name: 'Producer',
							entities: [
								{
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [
						{
							name: 'Producer',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					cast: [],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('producer credit entity (person) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					crewCredits: [
						{
							name: 'Producer',
							entities: [
								{
									name: 'Paul Elliott',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Producer',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Paul Elliott',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('producer credit entity (company) name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					crewCredits: [
						{
							name: 'Producer',
							entities: [
								{
									model: 'company',
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Producer',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									creditedMembers: [],
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('producer credit entity (company) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					crewCredits: [
						{
							name: 'Producer',
							entities: [
								{
									model: 'company',
									name: 'Duncan C Weldon Productions',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Producer',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Duncan C Weldon Productions',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									creditedMembers: [],
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate producer credit entities, including producer credit entity (company) credited members', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					crewCredits: [
						{
							name: 'Producers',
							entities: [
								{
									model: 'company',
									name: 'Duncan C Weldon Productions',
									creditedMembers: [
										{
											name: 'Duncan C Weldon'
										},
										{
											name: 'Foo'
										}
									]
								},
								{
									name: 'Duncan C Weldon'
								},
								{
									model: 'company',
									name: 'Duncan C Weldon Productions'
								},
								{
									model: 'company',
									name: 'Foo'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Producers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Duncan C Weldon Productions',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									creditedMembers: [
										{
											uuid: undefined,
											name: 'Duncan C Weldon',
											differentiator: '',
											errors: {
												name: [
													'This item has been duplicated within the group'
												],
												differentiator: [
													'This item has been duplicated within the group'
												]
											}
										},
										{
											uuid: undefined,
											name: 'Foo',
											differentiator: '',
											errors: {}
										}
									]
								},
								{
									uuid: undefined,
									name: 'Duncan C Weldon',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									uuid: undefined,
									name: 'Duncan C Weldon Productions',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									creditedMembers: []
								},
								{
									uuid: undefined,
									name: 'Foo',
									differentiator: '',
									errors: {},
									creditedMembers: []
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);
				expect(result.crewCredits[0].entities[0].creditedMembers[1].model).to.equal('person');
				expect(result.crewCredits[0].entities[3].model).to.equal('company');

			});

		});

		context('producer credit entity without name has named credited members', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					crewCredits: [
						{
							name: 'Producer',
							entities: [
								{
									model: 'company',
									name: '',
									creditedMembers: [
										{
											name: 'Duncan C Weldon',
											differentiator: ''
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Producer',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: '',
									differentiator: '',
									errors: {
										name: [
											'Name is required if named children exist'
										]
									},
									creditedMembers: [
										{
											uuid: undefined,
											name: 'Duncan C Weldon',
											differentiator: '',
											errors: {}
										}
									]
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('producer credit entity (company) credited member name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					crewCredits: [
						{
							name: 'Producer',
							entities: [
								{
									model: 'company',
									name: 'Duncan C Weldon Productions',
									creditedMembers: [
										{
											name: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Producer',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Duncan C Weldon Productions',
									differentiator: '',
									errors: {},
									creditedMembers: [
										{
											uuid: undefined,
											name: ABOVE_MAX_LENGTH_STRING,
											differentiator: '',
											errors: {
												name: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('producer credit entity (company) credited member differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Waiting for Godot',
					crewCredits: [
						{
							name: 'Producer',
							entities: [
								{
									model: 'company',
									name: 'Duncan C Weldon Productions',
									creditedMembers: [
										{
											name: 'Duncan C Weldon',
											differentiator: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Waiting for Godot',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Producer',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Duncan C Weldon Productions',
									differentiator: '',
									errors: {},
									creditedMembers: [
										{
											uuid: undefined,
											name: 'Duncan C Weldon',
											differentiator: ABOVE_MAX_LENGTH_STRING,
											errors: {
												differentiator: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('cast member name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							roles: []
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							differentiator: '',
							errors: {
								name: [
									'Value is too long'
								]
							},
							roles: []
						}
					],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('cast member differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							differentiator: ABOVE_MAX_LENGTH_STRING,
							roles: []
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: ABOVE_MAX_LENGTH_STRING,
							errors: {
								differentiator: [
									'Value is too long'
								]
							},
							roles: []
						}
					],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate cast members', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear'
						},
						{
							name: 'Clare Higgins',
							differentiator: '1'
						},
						{
							name: 'Rory Kinnear'
						},
						{
							name: 'Clare Higgins',
							differentiator: '2'
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								]
							},
							roles: []
						},
						{
							uuid: undefined,
							name: 'Clare Higgins',
							differentiator: '1',
							errors: {},
							roles: []
						},
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								]
							},
							roles: []
						},
						{
							uuid: undefined,
							name: 'Clare Higgins',
							differentiator: '2',
							errors: {},
							roles: []
						}
					],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('cast member without name has named roles', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: '',
							roles: [
								{
									name: 'Hamlet'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: '',
							differentiator: '',
							errors: {
								name: [
									'Name is required if named children exist'
								]
							},
							roles: [
								{
									name: 'Hamlet',
									characterName: '',
									characterDifferentiator: '',
									qualifier: '',
									errors: {}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('cast member role name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: ABOVE_MAX_LENGTH_STRING,
									characterName: ''
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: ABOVE_MAX_LENGTH_STRING,
									characterName: '',
									characterDifferentiator: '',
									qualifier: '',
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('cast member role characterName value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: 'Hamlet',
									characterName: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: 'Hamlet',
									characterName: ABOVE_MAX_LENGTH_STRING,
									characterDifferentiator: '',
									qualifier: '',
									errors: {
										characterName: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('cast member role characterDifferentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: 'Hamlet',
									characterName: '',
									characterDifferentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: 'Hamlet',
									characterName: '',
									characterDifferentiator: ABOVE_MAX_LENGTH_STRING,
									qualifier: '',
									errors: {
										characterDifferentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('cast member role qualifier value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: 'Hamlet',
									qualifier: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: 'Hamlet',
									characterName: '',
									characterDifferentiator: '',
									qualifier: ABOVE_MAX_LENGTH_STRING,
									errors: {
										qualifier: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('cast member role name and characterName values are the same', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'Rory Kinnear',
							roles: [
								{
									name: 'Hamlet',
									characterName: 'Hamlet'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: 'Hamlet',
									characterName: 'Hamlet',
									characterDifferentiator: '',
									qualifier: '',
									errors: {
										characterName: [
											'Character name is only required if different from role name'
										]
									}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate cast member roles', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					cast: [
						{
							name: 'David Calder',
							roles: [
								{
									name: 'Polonius'
								},
								{
									name: 'Gravedigger',
									characterDifferentiator: '1'
								},
								{
									name: 'Polonius'
								},
								{
									name: 'Gravedigger',
									characterDifferentiator: '2'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [
						{
							uuid: undefined,
							name: 'David Calder',
							differentiator: '',
							errors: {},
							roles: [
								{
									name: 'Polonius',
									characterName: '',
									characterDifferentiator: '',
									qualifier: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										characterName: [
											'This item has been duplicated within the group'
										],
										characterDifferentiator: [
											'This item has been duplicated within the group'
										],
										qualifier: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									name: 'Gravedigger',
									characterName: '',
									characterDifferentiator: '1',
									qualifier: '',
									errors: {}
								},
								{
									name: 'Polonius',
									characterName: '',
									characterDifferentiator: '',
									qualifier: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										characterName: [
											'This item has been duplicated within the group'
										],
										characterDifferentiator: [
											'This item has been duplicated within the group'
										],
										qualifier: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									name: 'Gravedigger',
									characterName: '',
									characterDifferentiator: '2',
									qualifier: '',
									errors: {}
								}
							]
						}
					],
					creativeCredits: [],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('creative credit name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Value is too long'
								]
							},
							entities: []
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate creative credit name values', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design'
						},
						{
							name: 'Sound Design'
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						},
						{
							name: 'Sound Design',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('creative credit without name has named creative entities', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: '',
							entities: [
								{
									name: 'Paul Groothuis'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: '',
							errors: {
								name: [
									'Name is required if named children exist'
								]
							},
							entities: [
								{
									uuid: undefined,
									name: 'Paul Groothuis',
									differentiator: '',
									errors: {}
								}
							]
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('creative credit entity (person) name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('creative credit entity (person) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									name: 'Paul Groothuis',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Paul Groothuis',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('creative credit entity (company) name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'company',
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									creditedMembers: [],
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('creative credit entity (company) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Autograph',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									creditedMembers: [],
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate creative credit entities, including creative credit entity (company) credited members', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									creditedMembers: [
										{
											name: 'Andrew Bruce'
										},
										{
											name: 'Foo'
										}
									]
								},
								{
									name: 'Andrew Bruce'
								},
								{
									model: 'company',
									name: 'Autograph'
								},
								{
									model: 'company',
									name: 'Foo'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Autograph',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									creditedMembers: [
										{
											uuid: undefined,
											name: 'Andrew Bruce',
											differentiator: '',
											errors: {
												name: [
													'This item has been duplicated within the group'
												],
												differentiator: [
													'This item has been duplicated within the group'
												]
											}
										},
										{
											uuid: undefined,
											name: 'Foo',
											differentiator: '',
											errors: {}
										}
									]
								},
								{
									uuid: undefined,
									name: 'Andrew Bruce',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									uuid: undefined,
									name: 'Autograph',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									creditedMembers: []
								},
								{
									uuid: undefined,
									name: 'Foo',
									differentiator: '',
									errors: {},
									creditedMembers: []
								}
							]
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);
				expect(result.creativeCredits[0].entities[0].creditedMembers[1].model).to.equal('person');
				expect(result.creativeCredits[0].entities[3].model).to.equal('company');

			});

		});

		context('creative credit entity without name has named credited members', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'company',
									name: '',
									creditedMembers: [
										{
											name: 'Andrew Bruce',
											differentiator: ''
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: '',
									differentiator: '',
									errors: {
										name: [
											'Name is required if named children exist'
										]
									},
									creditedMembers: [
										{
											uuid: undefined,
											name: 'Andrew Bruce',
											differentiator: '',
											errors: {}
										}
									]
								}
							]
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('creative credit entity (company) credited member name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									creditedMembers: [
										{
											name: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Autograph',
									differentiator: '',
									errors: {},
									creditedMembers: [
										{
											uuid: undefined,
											name: ABOVE_MAX_LENGTH_STRING,
											differentiator: '',
											errors: {
												name: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('creative credit entity (company) credited member differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							entities: [
								{
									model: 'company',
									name: 'Autograph',
									creditedMembers: [
										{
											name: 'Andrew Bruce',
											differentiator: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [
						{
							name: 'Sound Design',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Autograph',
									differentiator: '',
									errors: {},
									creditedMembers: [
										{
											uuid: undefined,
											name: 'Andrew Bruce',
											differentiator: ABOVE_MAX_LENGTH_STRING,
											errors: {
												differentiator: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					],
					crewCredits: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('crew credit name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Value is too long'
								]
							},
							entities: []
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate crew credit name values', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Stage Manager'
						},
						{
							name: 'Stage Manager'
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Stage Manager',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						},
						{
							name: 'Stage Manager',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							entities: []
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('crew credit without name has named crew entities', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: '',
							entities: [
								{
									name: 'Andrew Speed'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: '',
							errors: {
								name: [
									'Name is required if named children exist'
								]
							},
							entities: [
								{
									uuid: undefined,
									name: 'Andrew Speed',
									differentiator: '',
									errors: {}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('crew credit entity (person) name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Stage Manager',
							entities: [
								{
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Stage Manager',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('crew credit entity (person) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Stage Manager',
							entities: [
								{
									name: 'Andrew Speed',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Stage Manager',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Andrew Speed',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('crew credit entity (company) name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Stage Manager',
							entities: [
								{
									model: 'company',
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Stage Manager',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: ABOVE_MAX_LENGTH_STRING,
									differentiator: '',
									creditedMembers: [],
									errors: {
										name: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('crew credit entity (company) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									model: 'company',
									name: 'Assistant Stage Managers Ltd',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Assistant Stage Managers Ltd',
									differentiator: ABOVE_MAX_LENGTH_STRING,
									creditedMembers: [],
									errors: {
										differentiator: [
											'Value is too long'
										]
									}
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate crew credit entities, including crew credit entity (company) credited members', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									model: 'company',
									name: 'Assistant Stage Managers Ltd',
									creditedMembers: [
										{
											name: 'Sara Gunter'
										},
										{
											name: 'Foo'
										}
									]
								},
								{
									name: 'Sara Gunter'
								},
								{
									model: 'company',
									name: 'Assistant Stage Managers Ltd'
								},
								{
									model: 'company',
									name: 'Foo'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Assistant Stage Managers Ltd',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									creditedMembers: [
										{
											uuid: undefined,
											name: 'Sara Gunter',
											differentiator: '',
											errors: {
												name: [
													'This item has been duplicated within the group'
												],
												differentiator: [
													'This item has been duplicated within the group'
												]
											}
										},
										{
											uuid: undefined,
											name: 'Foo',
											differentiator: '',
											errors: {}
										}
									]
								},
								{
									uuid: undefined,
									name: 'Sara Gunter',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									}
								},
								{
									uuid: undefined,
									name: 'Assistant Stage Managers Ltd',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									},
									creditedMembers: []
								},
								{
									uuid: undefined,
									name: 'Foo',
									differentiator: '',
									errors: {},
									creditedMembers: []
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);
				expect(result.crewCredits[0].entities[0].creditedMembers[1].model).to.equal('person');
				expect(result.crewCredits[0].entities[3].model).to.equal('company');

			});

		});

		context('crew credit entity without name has named credited members', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									model: 'company',
									name: '',
									creditedMembers: [
										{
											name: 'Sara Gunter',
											differentiator: ''
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: '',
									differentiator: '',
									errors: {
										name: [
											'Name is required if named children exist'
										]
									},
									creditedMembers: [
										{
											uuid: undefined,
											name: 'Sara Gunter',
											differentiator: '',
											errors: {}
										}
									]
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('crew credit entity (company) credited member name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									model: 'company',
									name: 'Assistant Stage Managers Ltd',
									creditedMembers: [
										{
											name: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Assistant Stage Managers Ltd',
									differentiator: '',
									errors: {},
									creditedMembers: [
										{
											uuid: undefined,
											name: ABOVE_MAX_LENGTH_STRING,
											differentiator: '',
											errors: {
												name: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('crew credit entity (company) credited member differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							entities: [
								{
									model: 'company',
									name: 'Assistant Stage Managers Ltd',
									creditedMembers: [
										{
											name: 'Sara Gunter',
											differentiator: ABOVE_MAX_LENGTH_STRING
										}
									]
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'Hamlet',
					startDate: '',
					pressDate: '',
					endDate: '',
					hasErrors: true,
					errors: {},
					material: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					producerCredits: [],
					cast: [],
					creativeCredits: [],
					crewCredits: [
						{
							name: 'Assistant Stage Managers',
							errors: {},
							entities: [
								{
									uuid: undefined,
									name: 'Assistant Stage Managers Ltd',
									differentiator: '',
									errors: {},
									creditedMembers: [
										{
											uuid: undefined,
											name: 'Sara Gunter',
											differentiator: ABOVE_MAX_LENGTH_STRING,
											errors: {
												differentiator: [
													'Value is too long'
												]
											}
										}
									]
								}
							]
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

});

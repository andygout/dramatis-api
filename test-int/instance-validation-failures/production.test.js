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
					model: 'production',
					uuid: undefined,
					name: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
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
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
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
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						differentiator: '',
						errors: {
							name: [
								'Value is too long'
							]
						}
					},
					cast: [],
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: 'National Theatre',
						differentiator: ABOVE_MAX_LENGTH_STRING,
						errors: {
							differentiator: [
								'Value is too long'
							]
						}
					},
					cast: [],
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
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
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
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
					creativeCredits: []
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
							name: 'Clare Higgins'
						},
						{
							name: 'Rory Kinnear'
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
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
							model: 'person',
							uuid: undefined,
							name: 'Clare Higgins',
							differentiator: '',
							errors: {},
							roles: []
						},
						{
							model: 'person',
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
						}
					],
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
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
									model: 'role',
									name: 'Hamlet',
									characterName: '',
									characterDifferentiator: '',
									qualifier: '',
									errors: {}
								}
							]
						}
					],
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									model: 'role',
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
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									model: 'role',
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
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									model: 'role',
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
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									model: 'role',
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
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: 'Rory Kinnear',
							differentiator: '',
							errors: {},
							roles: [
								{
									model: 'role',
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
					creativeCredits: []
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
									name: 'Gravedigger'
								},
								{
									name: 'Polonius'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: 'David Calder',
							differentiator: '',
							errors: {},
							roles: [
								{
									model: 'role',
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
									model: 'role',
									name: 'Gravedigger',
									characterName: '',
									characterDifferentiator: '',
									qualifier: '',
									errors: {}
								},
								{
									model: 'role',
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
								}
							]
						}
					],
					creativeCredits: []
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Value is too long'
								]
							},
							creativeEntities: []
						}
					]
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							creativeEntities: []
						},
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							creativeEntities: []
						}
					]
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
							creativeEntities: [
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: '',
							errors: {
								name: [
									'Name is required if named children exist'
								]
							},
							creativeEntities: [
								{
									model: 'person',
									uuid: undefined,
									name: 'Paul Groothuis',
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

		context('creative credit entity (person) name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							creativeEntities: [
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							errors: {},
							creativeEntities: [
								{
									model: 'person',
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

		context('creative credit entity (person) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							creativeEntities: [
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							errors: {},
							creativeEntities: [
								{
									model: 'person',
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
					]
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
							creativeEntities: [
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							errors: {},
							creativeEntities: [
								{
									model: 'company',
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

		context('creative credit entity (company) differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							creativeEntities: [
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							errors: {},
							creativeEntities: [
								{
									model: 'company',
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
					]
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
							creativeEntities: [
								{
									model: 'company',
									name: 'Autograph',
									creditedMembers: [
										{
											name: 'Andrew Bruce'
										},
										{
											name: 'Nick Lidster'
										}
									]
								},
								{
									model: 'company',
									name: '59 Productions'
								},
								{
									name: 'Andrew Bruce'
								},
								{
									model: 'company',
									name: 'Autograph'
								},
								{
									name: 'Gregory Clarke'
								}
							]
						}
					]
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							errors: {},
							creativeEntities: [
								{
									model: 'company',
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
											model: 'person',
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
											model: 'person',
											uuid: undefined,
											name: 'Nick Lidster',
											differentiator: '',
											errors: {}
										}
									]
								},
								{
									model: 'company',
									uuid: undefined,
									name: '59 Productions',
									differentiator: '',
									errors: {},
									creditedMembers: []
								},
								{
									model: 'person',
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
									model: 'company',
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
									model: 'person',
									uuid: undefined,
									name: 'Gregory Clarke',
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

		context('creative credit entity without name has named credited members', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							creativeEntities: [
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							errors: {},
							creativeEntities: [
								{
									model: 'company',
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
											model: 'person',
											uuid: undefined,
											name: 'Andrew Bruce',
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

		context('creative credit entity (company) credited member name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							creativeEntities: [
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							errors: {},
							creativeEntities: [
								{
									model: 'company',
									uuid: undefined,
									name: 'Autograph',
									differentiator: '',
									errors: {},
									creditedMembers: [
										{
											model: 'person',
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

		context('creative credit entity (company) credited member differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					creativeCredits: [
						{
							name: 'Sound Design',
							creativeEntities: [
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
					model: 'production',
					uuid: undefined,
					name: 'Hamlet',
					hasErrors: true,
					errors: {},
					material: {
						model: 'material',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: '',
						differentiator: '',
						errors: {}
					},
					cast: [],
					creativeCredits: [
						{
							model: 'creativeCredit',
							name: 'Sound Design',
							errors: {},
							creativeEntities: [
								{
									model: 'company',
									uuid: undefined,
									name: 'Autograph',
									differentiator: '',
									errors: {},
									creditedMembers: [
										{
											model: 'person',
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
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

});

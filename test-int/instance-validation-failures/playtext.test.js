import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Playtext from '../../src/models/Playtext';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('Playtext instance', () => {

	const STRING_MAX_LENGTH = 1000;
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	const sandbox = createSandbox();

	afterEach(() => {

		sandbox.restore();

	});

	describe('input validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 0 });

		});

		context('name value is empty string', () => {

			it('assigns appropriate error', async () => {

				const instance = new Playtext({ name: '' });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					writerGroups: [],
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Playtext({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					writerGroups: [],
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instance = new Playtext({ name: 'Rosmersholm', differentiator: ABOVE_MAX_LENGTH_STRING });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						differentiator: [
							'Value is too long'
						]
					},
					writerGroups: [],
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('writerGroup name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writerGroups: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [
						{
							model: 'writerGroup',
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Value is too long'
								]
							},
							writers: []
						}
					],
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate writerGroups', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writerGroups: [
						{
							name: 'version by'
						},
						{
							name: 'version by'
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [
						{
							model: 'writerGroup',
							name: 'version by',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							writers: []
						},
						{
							model: 'writerGroup',
							name: 'version by',
							errors: {
								name: [
									'This item has been duplicated within the group'
								]
							},
							writers: []
						}
					],
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('writer name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writerGroups: [
						{
							writers: [
								{
									name: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [
						{
							model: 'writerGroup',
							name: '',
							errors: {},
							writers: [
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
					],
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('writer differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writerGroups: [
						{
							writers: [
								{
									name: 'Henrik Ibsen',
									differentiator: ABOVE_MAX_LENGTH_STRING
								}
							]
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [
						{
							model: 'writerGroup',
							name: '',
							errors: {},
							writers: [
								{
									model: 'person',
									uuid: undefined,
									name: 'Henrik Ibsen',
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
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate writers', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					writerGroups: [
						{
							writers: [
								{
									name: 'Henrik Ibsen'
								},
								{
									name: 'Henrik Ibsen'
								}
							]
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [
						{
							model: 'writerGroup',
							name: '',
							errors: {},
							writers: [
								{
									model: 'person',
									uuid: undefined,
									name: 'Henrik Ibsen',
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
									name: 'Henrik Ibsen',
									differentiator: '',
									errors: {
										name: [
											'This item has been duplicated within the group'
										],
										differentiator: [
											'This item has been duplicated within the group'
										]
									}
								}
							]
						}
					],
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [],
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							underlyingName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {
								name: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character underlyingName value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer',
							underlyingName: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [],
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							underlyingName: ABOVE_MAX_LENGTH_STRING,
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {
								underlyingName: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character differentiator value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer',
							differentiator: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [],
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							underlyingName: '',
							differentiator: ABOVE_MAX_LENGTH_STRING,
							qualifier: '',
							group: '',
							errors: {
								differentiator: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character qualifier value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer',
							qualifier: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [],
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							underlyingName: '',
							differentiator: '',
							qualifier: ABOVE_MAX_LENGTH_STRING,
							group: '',
							errors: {
								qualifier: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character group value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer',
							group: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [],
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							underlyingName: '',
							differentiator: '',
							qualifier: '',
							group: ABOVE_MAX_LENGTH_STRING,
							errors: {
								group: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('character name and underlyingName values are the same', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer',
							underlyingName: 'Johannes Rosmer'
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [],
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							underlyingName: 'Johannes Rosmer',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {
								underlyingName: [
									'Underlying name is only required if different from character name'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate characters', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: 'Johannes Rosmer'
						},
						{
							name: 'Rebecca West'
						},
						{
							name: 'Johannes Rosmer'
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {},
					writerGroups: [],
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							underlyingName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								underlyingName: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								],
								qualifier: [
									'This item has been duplicated within the group'
								],
								group: [
									'This item has been duplicated within the group'
								]
							}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Rebecca West',
							underlyingName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {}
						},
						{
							model: 'character',
							uuid: undefined,
							name: 'Johannes Rosmer',
							underlyingName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								underlyingName: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								],
								qualifier: [
									'This item has been duplicated within the group'
								],
								group: [
									'This item has been duplicated within the group'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

	describe('database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 1 });

		});

		context('name value already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instance = new Playtext({ name: 'Rosmersholm' });

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					},
					writerGroups: [],
					characters: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

	describe('combined input and database validation failure', () => {

		beforeEach(() => {

			sandbox.stub(neo4jQueryModule, 'neo4jQuery').resolves({ instanceCount: 1 });

		});

		context('character name value exceeds maximum limit and name value already exists in database', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Rosmersholm',
					characters: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Playtext(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'playtext',
					uuid: undefined,
					name: 'Rosmersholm',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Name and differentiator combination already exists'
						],
						differentiator: [
							'Name and differentiator combination already exists'
						]
					},
					writerGroups: [],
					characters: [
						{
							model: 'character',
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							underlyingName: '',
							differentiator: '',
							qualifier: '',
							group: '',
							errors: {
								name: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

	});

});

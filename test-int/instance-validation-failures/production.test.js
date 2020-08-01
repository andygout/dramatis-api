import { expect } from 'chai';
import { createSandbox } from 'sinon';

import Production from '../../src/models/Production';
import * as neo4jQueryModule from '../../src/neo4j/query';

describe('Production instance', () => {

	const EMPTY_STRING = '';
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
					name: EMPTY_STRING,
					theatre: {
						name: 'National Theatre'
					}
				};

				const instance = new Production(instanceProps);

				const result = await instance.create();

				const expectedResponseBody = {
					model: 'production',
					uuid: undefined,
					name: EMPTY_STRING,
					hasErrors: true,
					errors: {
						name: [
							'Name is too short'
						]
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: 'National Theatre',
						errors: {}
					},
					playtext: {
						model: 'playtext',
						uuid: undefined,
						name: '',
						errors: {}
					},
					cast: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: ABOVE_MAX_LENGTH_STRING,
					theatre: {
						name: 'National Theatre'
					}
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
							'Name is too long'
						]
					},
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: 'National Theatre',
						errors: {}
					},
					playtext: {
						model: 'playtext',
						uuid: undefined,
						name: '',
						errors: {}
					},
					cast: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('theatre name value is empty string', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					theatre: {
						name: EMPTY_STRING
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
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: EMPTY_STRING,
						errors: {
							name: [
								'Name is too short'
							]
						}
					},
					playtext: {
						model: 'playtext',
						uuid: undefined,
						name: '',
						errors: {}
					},
					cast: []
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
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						errors: {
							name: [
								'Name is too long'
							]
						}
					},
					playtext: {
						model: 'playtext',
						uuid: undefined,
						name: '',
						errors: {}
					},
					cast: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('playtext name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					theatre: {
						name: 'National Theatre'
					},
					playtext: {
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
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: 'National Theatre',
						errors: {}
					},
					playtext: {
						model: 'playtext',
						uuid: undefined,
						name: ABOVE_MAX_LENGTH_STRING,
						errors: {
							name: [
								'Name is too long'
							]
						}
					},
					cast: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('cast member name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					theatre: {
						name: 'National Theatre'
					},
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
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: 'National Theatre',
						errors: {}
					},
					playtext: {
						model: 'playtext',
						uuid: undefined,
						name: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							errors: {
								name: [
									'Name is too long'
								]
							},
							roles: []
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('duplicate cast member name values', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					theatre: {
						name: 'National Theatre'
					},
					cast: [
						{
							name: 'Rory Kinnear',
							roles: []
						},
						{
							name: 'David Calder',
							roles: []
						},
						{
							name: 'Rory Kinnear',
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
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: 'National Theatre',
						errors: {}
					},
					playtext: {
						model: 'playtext',
						uuid: undefined,
						name: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: 'Rory Kinnear',
							errors: {
								name: [
									'Name has been duplicated in this group'
								]
							},
							roles: []
						},
						{
							model: 'person',
							uuid: undefined,
							name: 'David Calder',
							errors: {},
							roles: []
						},
						{
							model: 'person',
							uuid: undefined,
							name: 'Rory Kinnear',
							errors: {
								name: [
									'Name has been duplicated in this group'
								]
							},
							roles: []
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		});

		context('cast member role name value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					theatre: {
						name: 'National Theatre'
					},
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
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: 'National Theatre',
						errors: {}
					},
					playtext: {
						model: 'playtext',
						uuid: undefined,
						name: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: 'Rory Kinnear',
							errors: {},
							roles: [
								{
									model: 'role',
									name: ABOVE_MAX_LENGTH_STRING,
									characterName: '',
									errors: {
										name: [
											'Name is too long'
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

		context('cast member role characterName value exceeds maximum limit', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					theatre: {
						name: 'National Theatre'
					},
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
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: 'National Theatre',
						errors: {}
					},
					playtext: {
						model: 'playtext',
						uuid: undefined,
						name: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: 'Rory Kinnear',
							errors: {},
							roles: [
								{
									model: 'role',
									name: 'Hamlet',
									characterName: ABOVE_MAX_LENGTH_STRING,
									errors: {
										characterName: [
											'Name is too long'
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

		context('duplicate cast member role name values', () => {

			it('assigns appropriate error', async () => {

				const instanceProps = {
					name: 'Hamlet',
					theatre: {
						name: 'National Theatre'
					},
					cast: [
						{
							name: 'David Calder',
							roles: [
								{
									name: 'Polonius',
									characterName: ''
								},
								{
									name: 'Gravedigger',
									characterName: ''
								},
								{
									name: 'Polonius',
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
					theatre: {
						model: 'theatre',
						uuid: undefined,
						name: 'National Theatre',
						errors: {}
					},
					playtext: {
						model: 'playtext',
						uuid: undefined,
						name: '',
						errors: {}
					},
					cast: [
						{
							model: 'person',
							uuid: undefined,
							name: 'David Calder',
							errors: {},
							roles: [
								{
									model: 'role',
									name: 'Polonius',
									characterName: '',
									errors: {
										name: [
											'Name has been duplicated in this group'
										]
									}
								},
								{
									model: 'role',
									name: 'Gravedigger',
									characterName: '',
									errors: {}
								},
								{
									model: 'role',
									name: 'Polonius',
									characterName: '',
									errors: {
										name: [
											'Name has been duplicated in this group'
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

	});

});

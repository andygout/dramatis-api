import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import applyModelGetter from '../../test-helpers/apply-model-getter.js';

describe('Prepare As Params module', () => {
	let stubs;
	let prepareAsParams;
	let getRandomUuidValues;

	beforeEach(async (test) => {
		getRandomUuidValues = ['xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'];

		stubs = {
			neo4j: {
				int: test.mock.fn((value) => value)
			},
			getRandomUuid: test.mock.fn(() => getRandomUuidValues.shift())
		};

		prepareAsParams = await esmock('../../../src/lib/prepare-as-params.js', {
			'neo4j-driver': stubs.neo4j,
			'../../../src/lib/get-random-uuid.js': stubs.getRandomUuid
		});
	});

	it('returns new object with modifications but will not mutate input object', async () => {
		const instance = {
			uuid: '',
			name: 'Foo',
			items: [
				{
					name: 'Foo',
					nestedItems: [
						{
							name: 'Baz'
						},
						{
							name: 'Qux'
						}
					]
				},
				{
					name: 'Bar',
					nestedItems: [
						{
							name: 'Quux'
						},
						{
							name: 'Quuz'
						}
					]
				}
			]
		};

		const result = prepareAsParams(instance);

		assert.equal(result.uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		assert.equal(result.items[0].position, 0);
		assert.equal(result.items[0].nestedItems[0].position, 0);
		assert.equal(result.items[0].nestedItems[1].position, 1);
		assert.equal(result.items[1].position, 1);
		assert.equal(result.items[1].nestedItems[0].position, 0);
		assert.equal(result.items[1].nestedItems[1].position, 1);
		assert.equal(instance.uuid, '');
		assert.equal(Object.hasOwn(instance.items[0], 'position'), false);
		assert.equal(Object.hasOwn(instance.items[0].nestedItems[0], 'position'), false);
		assert.equal(Object.hasOwn(instance.items[0].nestedItems[1], 'position'), false);
		assert.equal(Object.hasOwn(instance.items[1], 'position'), false);
		assert.equal(Object.hasOwn(instance.items[1].nestedItems[0], 'position'), false);
		assert.equal(Object.hasOwn(instance.items[1].nestedItems[0], 'position'), false);
	});

	describe('top level properties', () => {
		describe('name property and value is present', () => {
			it('assigns value to uuid property if empty string', async () => {
				const instance = { uuid: '', name: 'Foo' };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
			});

			it('assigns value to uuid property if undefined', async () => {
				const instance = { uuid: undefined, name: 'Foo' };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
			});

			it('will not assign value to uuid property if one already exists', async () => {
				const instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: 'Foo' };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.uuid, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			});
		});

		describe('name property is present; its value is an empty string', () => {
			it('assigns value to uuid property if empty string', async () => {
				const instance = { uuid: '', name: '' };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.uuid, null);
			});

			it('assigns value to uuid property if undefined', async () => {
				const instance = { uuid: undefined, name: '' };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.uuid, null);
			});

			it('will not assign value to uuid property if one already exists', async () => {
				const instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: '' };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.uuid, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			});
		});

		describe('name property is absent', () => {
			it('assigns value to uuid property if empty string', async () => {
				const instance = { uuid: '' };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.uuid, null);
			});

			it('assigns value to uuid property if undefined', async () => {
				const instance = { uuid: undefined };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.uuid, null);
			});

			it('will not assign value to uuid property if one already exists', async () => {
				const instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.uuid, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			});
		});

		it('will retaining existing value for non-uuid properties with non-empty string values', async () => {
			const instance = { foo: 'bar' };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.foo, 'bar');
		});

		it('will assign null value to non-uuid properties with empty string values', async () => {
			const instance = { foo: '' };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.foo, null);
		});

		it('will assign null value to non-uuid properties with false values', async () => {
			const instance = { foo: false };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.foo, null);
		});

		it('will not add position property', async () => {
			const instance = { foo: '' };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(Object.hasOwn(result, 'position'), false);
		});

		it('will add model property with value from model getter method', async () => {
			const instance = applyModelGetter({ foo: '' });

			const result = prepareAsParams(instance);

			assert.equal(result.model, 'BASE');
		});
	});

	describe('nested level properties', () => {
		describe('name property and value is present', () => {
			it('assigns value to uuid property if empty string', async () => {
				const instance = { venue: { uuid: '', name: 'Foo' } };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.venue.uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
			});

			it('assigns value to uuid property if undefined', async () => {
				const instance = { venue: { uuid: undefined, name: 'Foo' } };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.venue.uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
			});

			it('will not assign value to uuid property if one already exists', async () => {
				const instance = { venue: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: 'Foo' } };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.venue.uuid, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			});
		});

		describe('name property is present; its value is an empty string', () => {
			it('assigns value to uuid property if empty string', async () => {
				const instance = { venue: { uuid: '', name: '' } };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.venue.uuid, null);
			});

			it('assigns value to uuid property if undefined', async () => {
				const instance = { venue: { uuid: undefined, name: '' } };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.venue.uuid, null);
			});

			it('will not assign value to uuid property if one already exists', async () => {
				const instance = { venue: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: '' } };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.venue.uuid, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			});
		});

		describe('name property is absent', () => {
			it('assigns value to uuid property if empty string', async () => {
				const instance = { venue: { uuid: '' } };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.venue.uuid, null);
			});

			it('assigns value to uuid property if undefined', async () => {
				const instance = { venue: { uuid: undefined } };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.venue.uuid, null);
			});

			it('will not assign value to uuid property if one already exists', async () => {
				const instance = { venue: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' } };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.venue.uuid, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			});
		});

		it('will retaining existing value for non-uuid properties with non-empty string values', async () => {
			const instance = { venue: { foo: 'bar' } };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.venue.foo, 'bar');
		});

		it('will assign null value to non-uuid properties with empty string values', async () => {
			const instance = { venue: { foo: '' } };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.venue.foo, null);
		});

		it('will assign null value to non-uuid properties with false values', async () => {
			const instance = { venue: { foo: false } };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.venue.foo, null);
		});

		it('will not add position property', async () => {
			const instance = { venue: { uuid: '' } };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(Object.hasOwn(result.venue, 'position'), false);
		});

		it('will add model property with value from model getter method', async () => {
			const instance = { venue: applyModelGetter({ foo: '' }) };

			const result = prepareAsParams(instance);

			assert.equal(result.venue.model, 'BASE');
		});
	});

	describe('properties in arrays at top level', () => {
		it('assigns value to uuid property if empty string', async () => {
			const instance = { cast: [{ uuid: '', name: 'David Calder' }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		});

		it('assigns value to uuid property if undefined', async () => {
			const instance = { cast: [{ uuid: undefined, name: 'David Calder' }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		});

		it('will not assign value to uuid property if one already exists', async () => {
			const instance = { cast: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: 'David Calder' }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].uuid, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
		});

		it('will retaining existing value for non-uuid properties with non-empty string values', async () => {
			const instance = { cast: [{ foo: 'bar', name: 'David Calder' }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].foo, 'bar');
		});

		it('will assign null value to non-uuid properties with empty string values', async () => {
			const instance = { cast: [{ foo: '', name: 'David Calder' }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].foo, null);
		});

		it('will assign null value to non-uuid properties with false values', async () => {
			const instance = { cast: [{ foo: false, name: 'David Calder' }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].foo, null);
		});

		describe('array contains a single item', () => {
			it('will not add position property', async () => {
				const instance = { cast: [{ uuid: '', name: 'David Calder' }] };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(Object.hasOwn(result.cast[0], 'position'), false);
			});

			it('will add model property with value from model getter method', async () => {
				const instance = { cast: [applyModelGetter({ foo: '', name: 'David Calder' })] };

				const result = prepareAsParams(instance);

				assert.equal(result.cast[0].model, 'BASE');
			});
		});

		describe('array contains more than a single item', () => {
			it('adds position property with value of array index', async () => {
				const instance = {
					cast: [
						{ uuid: '', name: 'David Calder' },
						{ uuid: '', name: 'Ruth Negga' }
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 2);
				assert.equal(stubs.neo4j.int.mock.calls.length, 2);
				assert.deepStrictEqual(stubs.neo4j.int.mock.calls[0].arguments, [0]);
				assert.deepStrictEqual(stubs.neo4j.int.mock.calls[1].arguments, [1]);
				assert.equal(Object.hasOwn(result.cast[0], 'position'), true);
				assert.equal(result.cast[0].position, 0);
				assert.equal(Object.hasOwn(result.cast[1], 'position'), true);
				assert.equal(result.cast[1].position, 1);
			});

			it('will add model property with value from model getter method', async () => {
				const instance = {
					cast: [
						applyModelGetter({ foo: '', name: 'David Calder' }),
						applyModelGetter({ foo: '', name: 'Ruth Negga' })
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(result.cast[0].model, 'BASE');
			});
		});

		describe('object is in array whose items are not permitted an empty string name value', () => {
			it('filters out objects that have a name attribute which is an empty string', async () => {
				const instance = {
					cast: [
						{ uuid: '', name: '' },
						{ uuid: '', name: 'David Calder' }
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.cast.length, 1);
				assert.equal(result.cast[0].name, 'David Calder');
				assert.equal(Object.hasOwn(result.cast[0], 'position'), false);
			});
		});

		describe('object is in array where items are permitted an absent name property or empty string name value regardless of whether they have named children', () => {
			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {
				const instance = {
					productions: [{ uuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' }],
					subProductions: [{ uuid: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' }]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.productions.length, 1);
				assert.equal(Object.hasOwn(result.productions[0], 'name'), false);
				assert.equal(Object.hasOwn(result.productions[0], 'position'), false);
				assert.equal(result.subProductions.length, 1);
				assert.equal(Object.hasOwn(result.subProductions[0], 'name'), false);
				assert.equal(Object.hasOwn(result.subProductions[0], 'position'), false);
			});
		});

		describe('object is in array where items are permitted an absent name property or empty string name value providing they have named children', () => {
			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {
				const instance = {
					characterGroups: [{ name: '', characters: [{ name: 'Malene' }] }],
					nominations: [{ entities: [{ name: 'Simon Baker' }] }],
					producerCredits: [{ name: '', entities: [{ name: 'National Theatre Company' }] }],
					writingCredits: [{ name: '', entities: [{ name: 'Henrik Ibsen' }] }]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.characterGroups.length, 1);
				assert.equal(result.characterGroups[0].name, null);
				assert.equal(Object.hasOwn(result.characterGroups[0], 'position'), false);
				assert.equal(result.nominations.length, 1);
				assert.equal(Object.hasOwn(result.nominations[0], 'name'), false);
				assert.equal(Object.hasOwn(result.nominations[0], 'position'), false);
				assert.equal(result.producerCredits.length, 1);
				assert.equal(result.producerCredits[0].name, null);
				assert.equal(Object.hasOwn(result.producerCredits[0], 'position'), false);
				assert.equal(result.writingCredits.length, 1);
				assert.equal(result.writingCredits[0].name, null);
				assert.equal(Object.hasOwn(result.writingCredits[0], 'position'), false);
			});
		});

		describe('object is in array where items must have at least one named child', () => {
			it('filters out objects that do not have any named children (e.g. entities, characters)', async () => {
				const instance = {
					characterGroups: [
						{ name: 'The Rentheims', characters: [{ name: '' }] },
						{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
						{ name: 'The Foldals' }
					],
					creativeCredits: [
						{ name: 'Director', entities: [{ name: '' }] },
						{ name: 'Designer', entities: [{ name: 'Vicki Mortimer' }] },
						{ name: 'Lighting Designer' }
					],
					crewCredits: [
						{ name: 'Production Manager', entities: [{ name: '' }] },
						{ name: 'Stage Manager', entities: [{ name: 'Andrew Speed' }] },
						{ name: 'Costume Supervisor' }
					],
					nominations: [
						{ entities: [{ name: '' }] },
						{ entities: [{ name: 'Simon Baker' }] },
						{ productions: [{ uuid: '' }] },
						{ productions: [{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }] },
						{ materials: [{ name: '' }] },
						{ materials: [{ name: 'Hairspray' }] },
						{
							entities: [{ name: '' }],
							productions: [{ uuid: '' }],
							materials: [{ name: '' }]
						},
						{
							entities: [{ name: 'Steve C Kennedy' }],
							productions: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }],
							materials: [{ name: 'Hairspray' }]
						},
						{}
					],
					producerCredits: [
						{ name: 'in partnership with', entities: [{ name: '' }] },
						{ name: 'in association with', entities: [{ name: 'Fuel Theatre' }] },
						{ name: 'originally commissioned by' }
					],
					writingCredits: [
						{ name: 'adaptation by', entities: [{ name: '' }] },
						{ name: 'version by', entities: [{ name: 'David Eldridge' }] },
						{ name: 'translation by' }
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 4);
				assert.equal(result.characterGroups.length, 1);
				assert.equal(Object.hasOwn(result.characterGroups[0], 'position'), false);
				assert.equal(result.characterGroups[0].name, 'The Borkmans');
				assert.equal(result.creativeCredits.length, 1);
				assert.equal(Object.hasOwn(result.creativeCredits[0], 'position'), false);
				assert.equal(result.creativeCredits[0].name, 'Designer');
				assert.equal(result.crewCredits.length, 1);
				assert.equal(Object.hasOwn(result.crewCredits[0], 'position'), false);
				assert.equal(result.crewCredits[0].name, 'Stage Manager');
				assert.equal(result.nominations.length, 4);
				assert.equal(Object.hasOwn(result.nominations[0], 'name'), false);
				assert.equal(result.nominations[0].position, 0);
				assert.equal(result.producerCredits.length, 1);
				assert.equal(Object.hasOwn(result.producerCredits[0], 'position'), false);
				assert.equal(result.producerCredits[0].name, 'in association with');
				assert.equal(result.writingCredits.length, 1);
				assert.equal(result.writingCredits[0].name, 'version by');
				assert.equal(Object.hasOwn(result.writingCredits[0], 'position'), false);
			});
		});

		describe('object is in array where items do not require any named children', () => {
			it('retains objects whether they have named children (e.g. roles) or not', async () => {
				const instance = {
					cast: [
						{ name: 'David Bradley', roles: [{ name: 'King Henry IV' }] },
						{ name: 'Matthew Macfadyen', roles: [] },
						{ name: 'Samuel Roukin' }
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 3);
				assert.equal(result.cast.length, 3);
			});
		});

		describe('object is in array where items require a url', () => {
			it('retains objects only if they have a non-empty url value', async () => {
				const instance = {
					reviews: [{ url: '' }, { url: 'https://www.foo.com' }, { url: '' }]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.reviews.length, 1);
			});
		});

		describe('object is in array where items require a uuid', () => {
			it('retains objects only if they have a non-empty uuid value', async () => {
				const instance = {
					productions: [{ uuid: '' }, { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, { uuid: '' }],
					subProductions: [{ uuid: '' }, { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }, { uuid: '' }]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.productions.length, 1);
				assert.equal(result.subProductions.length, 1);
			});
		});

		it('applies the same uuid value to items that will need to share the same database entry', async () => {
			getRandomUuidValues = [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				'cccccccc-cccc-cccc-cccc-cccccccccccc',
				'dddddddd-dddd-dddd-dddd-dddddddddddd',
				'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
				'ffffffff-ffff-ffff-ffff-ffffffffffff'
			];
			const instance = {
				characters: [
					applyModelGetter({
						uuid: '',
						name: 'Ferdinand Foo',
						underlyingName: '',
						differentiator: '',
						qualifier: 'younger'
					}),
					applyModelGetter({
						uuid: '',
						name: 'Bar',
						underlyingName: 'Beatrice Bar',
						differentiator: '1',
						qualifier: 'younger'
					}),
					applyModelGetter({
						uuid: '',
						name: 'Brandon Baz',
						underlyingName: '',
						differentiator: '',
						qualifier: ''
					}),
					applyModelGetter({
						uuid: '',
						name: 'Qux',
						underlyingName: 'Quincy Qux',
						differentiator: '',
						qualifier: ''
					}),
					applyModelGetter({
						uuid: '',
						name: 'Quux',
						underlyingName: 'Clara Qux',
						differentiator: '',
						qualifier: ''
					}),
					applyModelGetter({
						uuid: '',
						name: 'Ferdinand Foo',
						underlyingName: '',
						differentiator: '',
						qualifier: 'older'
					}),
					applyModelGetter({
						uuid: '',
						name: 'Beatrice',
						underlyingName: 'Beatrice Bar',
						differentiator: '1',
						qualifier: 'older'
					}),
					applyModelGetter({
						uuid: '',
						name: 'Baz',
						underlyingName: 'Brandon Baz',
						differentiator: '',
						qualifier: ''
					}),
					applyModelGetter({
						uuid: '',
						name: 'Quincy Qux',
						underlyingName: '',
						differentiator: '',
						qualifier: ''
					}),
					applyModelGetter({
						uuid: '',
						name: 'Clara Quux',
						underlyingName: '',
						differentiator: '1',
						qualifier: ''
					})
				]
			};

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 6);
			assert.equal(stubs.neo4j.int.mock.calls.length, 10);
			assert.equal(result.characters[0].uuid, result.characters[5].uuid);
			assert.equal(result.characters[1].uuid, result.characters[6].uuid);
			assert.equal(result.characters[2].uuid, result.characters[7].uuid);
			assert.equal(result.characters[3].uuid, result.characters[8].uuid);
			assert.notEqual(result.characters[4].uuid, result.characters[9].uuid);
		});
	});

	describe('properties in arrays at nested level (nested in object)', () => {
		it('assigns value to uuid property if empty string', async () => {
			const instance = { production: { cast: [{ uuid: '', name: 'David Calder' }] } };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.production.cast[0].uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		});

		it('assigns value to uuid property if undefined', async () => {
			const instance = { production: { cast: [{ uuid: undefined, name: 'David Calder' }] } };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.production.cast[0].uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		});

		it('will not assign value to uuid property if one already exists', async () => {
			const instance = {
				production: {
					cast: [
						{
							uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
							name: 'David Calder'
						}
					]
				}
			};

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.production.cast[0].uuid, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
		});

		it('will retaining existing value for non-uuid properties with non-empty string values', async () => {
			const instance = { production: { cast: [{ foo: 'bar', name: 'David Calder' }] } };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.production.cast[0].foo, 'bar');
		});

		it('will assign null value to non-uuid properties with empty string values', async () => {
			const instance = { production: { cast: [{ foo: '', name: 'David Calder' }] } };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.production.cast[0].foo, null);
		});

		it('will assign null value to non-uuid properties with false values', async () => {
			const instance = { production: { cast: [{ foo: false, name: 'David Calder' }] } };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.production.cast[0].foo, null);
		});

		describe('array contains a single item', () => {
			it('will not add position property', async () => {
				const instance = { production: { cast: [{ uuid: '', name: 'David Calder' }] } };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(Object.hasOwn(result.production.cast[0], 'position'), false);
			});

			it('will add model property with value from model getter method', async () => {
				const instance = { production: { cast: [applyModelGetter({ foo: '', name: 'David Calder' })] } };

				const result = prepareAsParams(instance);

				assert.equal(result.production.cast[0].model, 'BASE');
			});
		});

		describe('array contains more than a single item', () => {
			it('adds position property with value of array index', async () => {
				const instance = {
					production: {
						cast: [
							{ uuid: '', name: 'David Calder' },
							{ uuid: '', name: 'Ruth Negga' }
						]
					}
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 2);
				assert.equal(stubs.neo4j.int.mock.calls.length, 2);
				assert.deepStrictEqual(stubs.neo4j.int.mock.calls[0].arguments, [0]);
				assert.deepStrictEqual(stubs.neo4j.int.mock.calls[1].arguments, [1]);
				assert.equal(Object.hasOwn(result.production.cast[0], 'position'), true);
				assert.equal(result.production.cast[0].position, 0);
				assert.equal(Object.hasOwn(result.production.cast[1], 'position'), true);
				assert.equal(result.production.cast[1].position, 1);
			});

			it('will add model property with value from model getter method', async () => {
				const instance = {
					production: {
						cast: [
							applyModelGetter({ foo: '', name: 'David Calder' }),
							applyModelGetter({ foo: '', name: 'Ruth Negga' })
						]
					}
				};

				const result = prepareAsParams(instance);

				assert.equal(result.production.cast[0].model, 'BASE');
			});
		});

		describe('object is in array whose items are not permitted an empty string name value', () => {
			it('filters out objects that have a name attribute which is an empty string', async () => {
				const instance = {
					production: {
						cast: [
							{ uuid: '', name: '' },
							{ uuid: '', name: 'David Calder' }
						]
					}
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.production.cast.length, 1);
				assert.equal(result.production.cast[0].name, 'David Calder');
				assert.equal(Object.hasOwn(result.production.cast[0], 'position'), false);
			});
		});

		describe('object is in array where items are permitted an absent name property or empty string name value regardless of whether they have named children', () => {
			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {
				const instance = {
					foo: {
						productions: [{ uuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' }],
						subProductions: [{ uuid: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' }]
					}
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.foo.productions.length, 1);
				assert.equal(Object.hasOwn(result.foo.productions[0], 'name'), false);
				assert.equal(Object.hasOwn(result.foo.productions[0], 'position'), false);
				assert.equal(result.foo.subProductions.length, 1);
				assert.equal(Object.hasOwn(result.foo.subProductions[0], 'name'), false);
				assert.equal(Object.hasOwn(result.foo.subProductions[0], 'position'), false);
			});
		});

		describe('object is in array where items are permitted an absent name property or empty string name value providing they have named children', () => {
			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {
				const instance = {
					foo: {
						characterGroups: [{ name: '', characters: [{ name: 'Malene' }] }],
						nominations: [{ entities: [{ name: 'Simon Baker' }] }],
						producerCredits: [{ name: '', entities: [{ name: 'National Theatre Company' }] }],
						writingCredits: [{ name: '', entities: [{ name: 'Henrik Ibsen' }] }]
					}
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.foo.characterGroups.length, 1);
				assert.equal(result.foo.characterGroups[0].name, null);
				assert.equal(Object.hasOwn(result.foo.characterGroups[0], 'position'), false);
				assert.equal(result.foo.nominations.length, 1);
				assert.equal(Object.hasOwn(result.foo.nominations[0], 'name'), false);
				assert.equal(Object.hasOwn(result.foo.nominations[0], 'position'), false);
				assert.equal(result.foo.producerCredits.length, 1);
				assert.equal(result.foo.producerCredits[0].name, null);
				assert.equal(Object.hasOwn(result.foo.producerCredits[0], 'position'), false);
				assert.equal(result.foo.writingCredits.length, 1);
				assert.equal(result.foo.writingCredits[0].name, null);
				assert.equal(Object.hasOwn(result.foo.writingCredits[0], 'position'), false);
			});
		});

		describe('object is in array where items must have at least one named child', () => {
			it('filters out objects that do not have any named children (e.g. entities, characters)', async () => {
				const instance = {
					foo: {
						characterGroups: [
							{ name: 'The Rentheims', characters: [{ name: '' }] },
							{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
							{ name: 'The Foldals' }
						],
						creativeCredits: [
							{ name: 'Director', entities: [{ name: '' }] },
							{ name: 'Designer', entities: [{ name: 'Vicki Mortimer' }] },
							{ name: 'Lighting Designer' }
						],
						crewCredits: [
							{ name: 'Production Manager', entities: [{ name: '' }] },
							{ name: 'Stage Manager', entities: [{ name: 'Andrew Speed' }] },
							{ name: 'Costume Supervisor' }
						],
						nominations: [
							{ entities: [{ name: '' }] },
							{ entities: [{ name: 'Simon Baker' }] },
							{ productions: [{ uuid: '' }] },
							{ productions: [{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }] },
							{ materials: [{ name: '' }] },
							{ materials: [{ name: 'Hairspray' }] },
							{
								entities: [{ name: '' }],
								productions: [{ uuid: '' }],
								materials: [{ name: '' }]
							},
							{
								entities: [{ name: 'Steve C Kennedy' }],
								productions: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }],
								materials: [{ name: 'Hairspray' }]
							},
							{}
						],
						producerCredits: [
							{ name: 'in partnership with', entities: [{ name: '' }] },
							{ name: 'in association with', entities: [{ name: 'Fuel Theatre' }] },
							{ name: 'originally commissioned by' }
						],
						writingCredits: [
							{ name: 'adaptation by', entities: [{ name: '' }] },
							{ name: 'version by', entities: [{ name: 'David Eldridge' }] },
							{ name: 'translation by' }
						]
					}
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 4);
				assert.equal(result.foo.characterGroups.length, 1);
				assert.equal(Object.hasOwn(result.foo.characterGroups[0], 'position'), false);
				assert.equal(result.foo.characterGroups[0].name, 'The Borkmans');
				assert.equal(result.foo.creativeCredits.length, 1);
				assert.equal(Object.hasOwn(result.foo.creativeCredits[0], 'position'), false);
				assert.equal(result.foo.creativeCredits[0].name, 'Designer');
				assert.equal(result.foo.crewCredits.length, 1);
				assert.equal(Object.hasOwn(result.foo.crewCredits[0], 'position'), false);
				assert.equal(result.foo.crewCredits[0].name, 'Stage Manager');
				assert.equal(result.foo.nominations.length, 4);
				assert.equal(Object.hasOwn(result.foo.nominations[0], 'name'), false);
				assert.equal(result.foo.nominations[0].position, 0);
				assert.equal(result.foo.producerCredits.length, 1);
				assert.equal(Object.hasOwn(result.foo.producerCredits[0], 'position'), false);
				assert.equal(result.foo.producerCredits[0].name, 'in association with');
				assert.equal(result.foo.writingCredits.length, 1);
				assert.equal(Object.hasOwn(result.foo.writingCredits[0], 'position'), false);
				assert.equal(result.foo.writingCredits[0].name, 'version by');
			});
		});

		describe('object is in array where items do not require any named children', () => {
			it('retains objects whether they have named children (e.g. roles) or not', async () => {
				const instance = {
					production: {
						cast: [
							{ name: 'David Bradley', roles: [{ name: 'King Henry IV' }] },
							{ name: 'Matthew Macfadyen', roles: [] },
							{ name: 'Samuel Roukin' }
						]
					}
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 3);
				assert.equal(result.production.cast.length, 3);
			});
		});

		describe('object is in array where items require a url', () => {
			it('retains objects only if they have a non-empty url value', async () => {
				const instance = {
					foo: {
						reviews: [{ url: '' }, { url: 'https://www.foo.com' }, { url: '' }]
					}
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.foo.reviews.length, 1);
			});
		});

		describe('object is in array where items require a uuid', () => {
			it('retains objects only if they have a non-empty uuid value', async () => {
				const instance = {
					foo: {
						productions: [{ uuid: '' }, { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, { uuid: '' }],
						subProductions: [{ uuid: '' }, { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, { uuid: '' }]
					}
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.foo.productions.length, 1);
				assert.equal(result.foo.subProductions.length, 1);
			});
		});

		it('applies the same uuid value to items that will need to share the same database entry', async () => {
			getRandomUuidValues = [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				'cccccccc-cccc-cccc-cccc-cccccccccccc',
				'dddddddd-dddd-dddd-dddd-dddddddddddd',
				'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
				'ffffffff-ffff-ffff-ffff-ffffffffffff'
			];
			const instance = {
				production: {
					cast: [
						applyModelGetter({
							uuid: '',
							name: 'Ferdinand Foo',
							underlyingName: '',
							differentiator: '',
							qualifier: 'younger'
						}),
						applyModelGetter({
							uuid: '',
							name: 'Bar',
							underlyingName: 'Beatrice Bar',
							differentiator: '1',
							qualifier: 'younger'
						}),
						applyModelGetter({
							uuid: '',
							name: 'Brandon Baz',
							underlyingName: '',
							differentiator: '',
							qualifier: ''
						}),
						applyModelGetter({
							uuid: '',
							name: 'Qux',
							underlyingName: 'Quincy Qux',
							differentiator: '',
							qualifier: ''
						}),
						applyModelGetter({
							uuid: '',
							name: 'Quux',
							underlyingName: 'Clara Qux',
							differentiator: '',
							qualifier: ''
						}),
						applyModelGetter({
							uuid: '',
							name: 'Ferdinand Foo',
							underlyingName: '',
							differentiator: '',
							qualifier: 'older'
						}),
						applyModelGetter({
							uuid: '',
							name: 'Beatrice',
							underlyingName: 'Beatrice Bar',
							differentiator: '1',
							qualifier: 'older'
						}),
						applyModelGetter({
							uuid: '',
							name: 'Baz',
							underlyingName: 'Brandon Baz',
							differentiator: '',
							qualifier: ''
						}),
						applyModelGetter({
							uuid: '',
							name: 'Quincy Qux',
							underlyingName: '',
							differentiator: '',
							qualifier: ''
						}),
						applyModelGetter({
							uuid: '',
							name: 'Clara Quux',
							underlyingName: '',
							differentiator: '1',
							qualifier: ''
						})
					]
				}
			};

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 6);
			assert.equal(stubs.neo4j.int.mock.calls.length, 10);
			assert.equal(result.production.cast[0].uuid, result.production.cast[5].uuid);
			assert.equal(result.production.cast[1].uuid, result.production.cast[6].uuid);
			assert.equal(result.production.cast[2].uuid, result.production.cast[7].uuid);
			assert.equal(result.production.cast[3].uuid, result.production.cast[8].uuid);
			assert.notEqual(result.production.cast[4].uuid, result.production.cast[9].uuid);
		});
	});

	describe('properties in arrays at nested level (nested in array)', () => {
		it('assigns value to uuid property if empty string', async () => {
			const instance = { cast: [{ name: 'David Calder', roles: [{ uuid: '', name: 'Polonius' }] }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].roles[0].uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		});

		it('assigns value to uuid property if undefined', async () => {
			const instance = { cast: [{ name: 'David Calder', roles: [{ uuid: undefined, name: 'Polonius' }] }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].roles[0].uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		});

		it('will not assign value to uuid property if one already exists', async () => {
			const instance = {
				cast: [
					{
						name: 'David Calder',
						roles: [
							{
								uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
								name: 'Polonius'
							}
						]
					}
				]
			};

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].roles[0].uuid, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
		});

		it('will retaining existing value for non-uuid properties with non-empty string values', async () => {
			const instance = { cast: [{ name: 'David Calder', roles: [{ foo: 'bar', name: 'Polonius' }] }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].roles[0].foo, 'bar');
		});

		it('will assign null value to non-uuid properties with empty string values', async () => {
			const instance = { cast: [{ name: 'David Calder', roles: [{ foo: '', name: 'Polonius' }] }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].roles[0].foo, null);
		});

		it('will assign null value to non-uuid properties with false values', async () => {
			const instance = { cast: [{ name: 'David Calder', roles: [{ foo: false, name: 'Polonius' }] }] };

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
			assert.equal(stubs.neo4j.int.mock.calls.length, 0);
			assert.equal(result.cast[0].roles[0].foo, null);
		});

		describe('array contains a single item', () => {
			it('will not add position property', async () => {
				const instance = { cast: [{ name: 'David Calder', roles: [{ uuid: '', name: 'Polonius' }] }] };

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(Object.hasOwn(result.cast[0], 'position'), false);
				assert.equal(Object.hasOwn(result.cast[0].roles[0], 'position'), false);
			});

			it('will add model property with value from model getter method', async () => {
				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [applyModelGetter({ foo: '', name: 'Polonius' })]
						}
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(result.cast[0].roles[0].model, 'BASE');
			});
		});

		describe('array contains more than a single item', () => {
			it('adds position property with value of array index', async () => {
				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								{ uuid: '', name: 'Polonius' },
								{ uuid: '', name: 'Gravedigger' }
							]
						}
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 2);
				assert.equal(stubs.neo4j.int.mock.calls.length, 2);
				assert.deepStrictEqual(stubs.neo4j.int.mock.calls[0].arguments, [0]);
				assert.deepStrictEqual(stubs.neo4j.int.mock.calls[1].arguments, [1]);
				assert.equal(Object.hasOwn(result.cast[0], 'position'), false);
				assert.equal(Object.hasOwn(result.cast[0].roles[0], 'position'), true);
				assert.equal(result.cast[0].roles[0].position, 0);
				assert.equal(Object.hasOwn(result.cast[0].roles[1], 'position'), true);
				assert.equal(result.cast[0].roles[1].position, 1);
			});

			it('will add model property with value from model getter method', async () => {
				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								applyModelGetter({ foo: '', name: 'Polonius' }),
								applyModelGetter({ foo: '', name: 'Gravedigger' })
							]
						}
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(result.cast[0].roles[0].model, 'BASE');
			});
		});

		describe('object is in array whose items are not permitted an empty string name value', () => {
			it('filters out objects that have a name attribute which is an empty string', async () => {
				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								{ uuid: '', name: '' },
								{ uuid: '', name: 'Polonius' }
							]
						}
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 1);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.cast[0].roles.length, 1);
				assert.equal(result.cast[0].roles[0].name, 'Polonius');
				assert.equal(Object.hasOwn(result.cast[0].roles[0], 'position'), false);
			});
		});

		describe('object is in array where items are permitted an absent name property or empty string name value regardless of whether they have named children', () => {
			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {
				const instance = {
					foos: [
						{
							name: 'Foobar',
							productions: [{ uuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' }],
							subProductions: [{ uuid: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' }]
						}
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.foos[0].productions.length, 1);
				assert.equal(Object.hasOwn(result.foos[0].productions[0], 'name'), false);
				assert.equal(Object.hasOwn(result.foos[0].productions[0], 'position'), false);
				assert.equal(result.foos[0].subProductions.length, 1);
				assert.equal(Object.hasOwn(result.foos[0].subProductions[0], 'name'), false);
				assert.equal(Object.hasOwn(result.foos[0].subProductions[0], 'position'), false);
			});
		});

		describe('object is in array where items are permitted an absent name property empty string name value providing they have named children', () => {
			it('does not filter out objects that have a name attribute which is absent or is an empty string', async () => {
				const instance = {
					foos: [
						{
							name: 'Foobar',
							characterGroups: [{ name: '', characters: [{ name: 'Malene' }] }],
							nominations: [{ entities: [{ name: 'Simon Baker' }] }],
							producerCredits: [{ name: '', entities: [{ name: 'National Theatre Company' }] }],
							writingCredits: [{ name: '', entities: [{ name: 'Henrik Ibsen' }] }]
						}
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.foos[0].characterGroups.length, 1);
				assert.equal(result.foos[0].characterGroups[0].name, null);
				assert.equal(Object.hasOwn(result.foos[0].characterGroups[0], 'position'), false);
				assert.equal(result.foos[0].nominations.length, 1);
				assert.equal(Object.hasOwn(result.foos[0].nominations[0], 'name'), false);
				assert.equal(Object.hasOwn(result.foos[0].nominations[0], 'position'), false);
				assert.equal(result.foos[0].producerCredits.length, 1);
				assert.equal(result.foos[0].producerCredits[0].name, null);
				assert.equal(Object.hasOwn(result.foos[0].producerCredits[0], 'position'), false);
				assert.equal(result.foos[0].writingCredits.length, 1);
				assert.equal(result.foos[0].writingCredits[0].name, null);
				assert.equal(Object.hasOwn(result.foos[0].writingCredits[0], 'position'), false);
			});
		});

		describe('object is in array where items must have at least one named child', () => {
			it('filters out objects that do not have any named children (e.g. entities, characters)', async () => {
				const instance = {
					foos: [
						{
							name: 'Foobar',
							characterGroups: [
								{ name: 'The Rentheims', characters: [{ name: '' }] },
								{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
								{ name: 'The Foldals' }
							],
							creativeCredits: [
								{ name: 'Director', entities: [{ name: '' }] },
								{ name: 'Designer', entities: [{ name: 'Vicki Mortimer' }] },
								{ name: 'Lighting Designer' }
							],
							crewCredits: [
								{ name: 'Production Manager', entities: [{ name: '' }] },
								{ name: 'Stage Manager', entities: [{ name: 'Andrew Speed' }] },
								{ name: 'Costume Supervisor' }
							],
							nominations: [
								{ entities: [{ name: '' }] },
								{ entities: [{ name: 'Simon Baker' }] },
								{ productions: [{ uuid: '' }] },
								{ productions: [{ uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }] },
								{ materials: [{ name: '' }] },
								{ materials: [{ name: 'Hairspray' }] },
								{
									entities: [{ name: '' }],
									productions: [{ uuid: '' }],
									materials: [{ name: '' }]
								},
								{
									entities: [{ name: 'Steve C Kennedy' }],
									productions: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }],
									materials: [{ name: 'Hairspray' }]
								},
								{}
							],
							producerCredits: [
								{ name: 'in partnership with', entities: [{ name: '' }] },
								{ name: 'in association with', entities: [{ name: 'Fuel Theatre' }] },
								{ name: 'translation by' }
							],
							writingCredits: [
								{ name: 'adaptation by', entities: [{ name: '' }] },
								{ name: 'version by', entities: [{ name: 'David Eldridge' }] },
								{ name: 'translation by' }
							]
						}
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 4);
				assert.equal(result.foos[0].characterGroups.length, 1);
				assert.equal(Object.hasOwn(result.foos[0].characterGroups[0], 'position'), false);
				assert.equal(result.foos[0].characterGroups[0].name, 'The Borkmans');
				assert.equal(result.foos[0].creativeCredits.length, 1);
				assert.equal(Object.hasOwn(result.foos[0].creativeCredits[0], 'position'), false);
				assert.equal(result.foos[0].creativeCredits[0].name, 'Designer');
				assert.equal(result.foos[0].crewCredits.length, 1);
				assert.equal(Object.hasOwn(result.foos[0].crewCredits[0], 'position'), false);
				assert.equal(result.foos[0].crewCredits[0].name, 'Stage Manager');
				assert.equal(result.foos[0].nominations.length, 4);
				assert.equal(Object.hasOwn(result.foos[0].nominations[0], 'name'), false);
				assert.equal(result.foos[0].nominations[0].position, 0);
				assert.equal(result.foos[0].producerCredits.length, 1);
				assert.equal(Object.hasOwn(result.foos[0].producerCredits[0], 'position'), false);
				assert.equal(result.foos[0].producerCredits[0].name, 'in association with');
				assert.equal(result.foos[0].writingCredits.length, 1);
				assert.equal(Object.hasOwn(result.foos[0].writingCredits[0], 'position'), false);
				assert.equal(result.foos[0].writingCredits[0].name, 'version by');
			});
		});

		describe('object is in array where items do not require any named children', () => {
			it('retains objects whether they have named children (e.g. roles) or not', async () => {
				const instance = {
					productions: [
						{
							name: 'Henry IV, Part 1',
							cast: [
								{ name: 'David Bradley', roles: [{ name: 'King Henry IV' }] },
								{ name: 'Matthew Macfadyen', roles: [] },
								{ name: 'Samuel Roukin' }
							]
						}
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 3);
				assert.equal(result.productions[0].cast.length, 3);
			});
		});

		describe('object is in array where items require a url', () => {
			it('retains objects only if they have a non-empty url value', async () => {
				const instance = {
					subProductions: [
						{
							reviews: [{ url: '' }, { url: 'https://www.foo.com' }, { url: '' }]
						}
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.subProductions[0].reviews.length, 1);
			});
		});

		describe('object is in array where items require a uuid', () => {
			it('retains objects only if they have a non-empty uuid value', async () => {
				const instance = {
					nominations: [
						{
							productions: [{ uuid: '' }, { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, { uuid: '' }]
						}
					],
					productions: [
						{
							subProductions: [
								{ uuid: '' },
								{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' },
								{ uuid: '' }
							]
						}
					]
				};

				const result = prepareAsParams(instance);

				assert.equal(stubs.getRandomUuid.mock.calls.length, 0);
				assert.equal(stubs.neo4j.int.mock.calls.length, 0);
				assert.equal(result.nominations[0].productions.length, 1);
				assert.equal(result.productions[0].subProductions.length, 1);
			});
		});

		it('applies the same uuid value to items in the same array that will need to share the same database entry', async () => {
			getRandomUuidValues = [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				'cccccccc-cccc-cccc-cccc-cccccccccccc',
				'dddddddd-dddd-dddd-dddd-dddddddddddd',
				'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
				'ffffffff-ffff-ffff-ffff-ffffffffffff'
			];
			const instance = {
				characterGroups: [
					{
						characters: [
							applyModelGetter({
								uuid: '',
								name: 'Ferdinand Foo',
								underlyingName: '',
								differentiator: '',
								qualifier: 'younger'
							}),
							applyModelGetter({
								uuid: '',
								name: 'Bar',
								underlyingName: 'Beatrice Bar',
								differentiator: '1',
								qualifier: 'younger'
							}),
							applyModelGetter({
								uuid: '',
								name: 'Brandon Baz',
								underlyingName: '',
								differentiator: '',
								qualifier: ''
							}),
							applyModelGetter({
								uuid: '',
								name: 'Qux',
								underlyingName: 'Quincy Qux',
								differentiator: '',
								qualifier: ''
							}),
							applyModelGetter({
								uuid: '',
								name: 'Quux',
								underlyingName: 'Clara Qux',
								differentiator: '',
								qualifier: ''
							}),
							applyModelGetter({
								uuid: '',
								name: 'Ferdinand Foo',
								underlyingName: '',
								differentiator: '',
								qualifier: 'older'
							}),
							applyModelGetter({
								uuid: '',
								name: 'Beatrice',
								underlyingName: 'Beatrice Bar',
								differentiator: '1',
								qualifier: 'older'
							}),
							applyModelGetter({
								uuid: '',
								name: 'Baz',
								underlyingName: 'Brandon Baz',
								differentiator: '',
								qualifier: ''
							}),
							applyModelGetter({
								uuid: '',
								name: 'Quincy Qux',
								underlyingName: '',
								differentiator: '',
								qualifier: ''
							}),
							applyModelGetter({
								uuid: '',
								name: 'Clara Quux',
								underlyingName: '',
								differentiator: '1',
								qualifier: ''
							})
						]
					}
				]
			};

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 6);
			assert.equal(stubs.neo4j.int.mock.calls.length, 10);
			assert.equal(result.characterGroups[0].characters[0].uuid, result.characterGroups[0].characters[5].uuid);
			assert.equal(result.characterGroups[0].characters[1].uuid, result.characterGroups[0].characters[6].uuid);
			assert.equal(result.characterGroups[0].characters[2].uuid, result.characterGroups[0].characters[7].uuid);
			assert.equal(result.characterGroups[0].characters[3].uuid, result.characterGroups[0].characters[8].uuid);
			assert.notEqual(result.characterGroups[0].characters[4].uuid, result.characterGroups[0].characters[9].uuid);
		});

		it('applies the same uuid value to items in different arrays that will need to share the same database entry', async () => {
			getRandomUuidValues = [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				'cccccccc-cccc-cccc-cccc-cccccccccccc',
				'dddddddd-dddd-dddd-dddd-dddddddddddd',
				'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
				'ffffffff-ffff-ffff-ffff-ffffffffffff'
			];
			const instance = {
				characterGroups: [
					{
						name: 'Montagues',
						characters: [
							applyModelGetter({
								uuid: '',
								name: 'Ferdinand Foo',
								underlyingName: '',
								differentiator: '',
								qualifier: 'younger'
							}),
							applyModelGetter({
								uuid: '',
								name: 'Bar',
								underlyingName: 'Beatrice Bar',
								differentiator: '1',
								qualifier: 'younger'
							}),
							applyModelGetter({
								uuid: '',
								name: 'Brandon Baz',
								underlyingName: '',
								differentiator: '',
								qualifier: ''
							}),
							applyModelGetter({
								uuid: '',
								name: 'Qux',
								underlyingName: 'Quincy Qux',
								differentiator: '',
								qualifier: ''
							}),
							applyModelGetter({
								uuid: '',
								name: 'Quux',
								underlyingName: 'Clara Qux',
								differentiator: '',
								qualifier: ''
							})
						]
					},
					{
						name: 'Capulets',
						characters: [
							applyModelGetter({
								uuid: '',
								name: 'Ferdinand Foo',
								underlyingName: '',
								differentiator: '',
								qualifier: 'older'
							}),
							applyModelGetter({
								uuid: '',
								name: 'Beatrice',
								underlyingName: 'Beatrice Bar',
								differentiator: '1',
								qualifier: 'older'
							}),
							applyModelGetter({
								uuid: '',
								name: 'Baz',
								underlyingName: 'Brandon Baz',
								differentiator: '',
								qualifier: ''
							}),
							applyModelGetter({
								uuid: '',
								name: 'Quincy Qux',
								underlyingName: '',
								differentiator: '',
								qualifier: ''
							}),
							applyModelGetter({
								uuid: '',
								name: 'Clara Quux',
								underlyingName: '',
								differentiator: '1',
								qualifier: ''
							})
						]
					}
				]
			};

			const result = prepareAsParams(instance);

			assert.equal(stubs.getRandomUuid.mock.calls.length, 6);
			assert.equal(stubs.neo4j.int.mock.calls.length, 12);
			assert.equal(result.characterGroups[0].characters[0].uuid, result.characterGroups[1].characters[0].uuid);
			assert.equal(result.characterGroups[0].characters[1].uuid, result.characterGroups[1].characters[1].uuid);
			assert.equal(result.characterGroups[0].characters[2].uuid, result.characterGroups[1].characters[2].uuid);
			assert.equal(result.characterGroups[0].characters[3].uuid, result.characterGroups[1].characters[3].uuid);
			assert.notEqual(result.characterGroups[0].characters[4].uuid, result.characterGroups[1].characters[4].uuid);
		});
	});
});

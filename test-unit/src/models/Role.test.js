import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

const context = describe;

describe('Role model', () => {
	let stubs;
	let Role;

	beforeEach(async (test) => {
		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: test.mock.fn((arg) => arg?.trim() || '')
			}
		};

		Role = await esmock(
			'../../../src/models/Role.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/strings.js': stubs.stringsModule
			}
		);
	});

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new Role();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.mock.callCount(), 4);
		});

		describe('characterName property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Role({ characterName: 'Hamlet' });

				assert.deepEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[1].arguments, ['Hamlet']);
				assert.equal(instance.characterName, 'Hamlet');
			});
		});

		describe('characterDifferentiator property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Role({ characterDifferentiator: '1' });

				assert.deepEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[2].arguments, ['1']);
				assert.equal(instance.characterDifferentiator, '1');
			});
		});

		describe('qualifier property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Role({ qualifier: 'younger' });

				assert.deepEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[3].arguments, ['younger']);
				assert.equal(instance.qualifier, 'younger');
			});
		});

		describe('isAlternate property', () => {
			it('assigns false if absent from props', async () => {
				const instance = new Role({ name: 'Young Lucius' });

				assert.equal(instance.isAlternate, false);
			});

			it('assigns false if included in props but value evaluates to false', async () => {
				const instance = new Role({ name: 'Young Lucius', isAlternate: null });

				assert.equal(instance.isAlternate, false);
			});

			it('assigns false if included in props but value is false', async () => {
				const instance = new Role({ name: 'Young Lucius', isAlternate: false });

				assert.equal(instance.isAlternate, false);
			});

			it('assigns true if included in props and value evaluates to true', async () => {
				const instance = new Role({ name: 'Young Lucius', isAlternate: 'foobar' });

				assert.equal(instance.isAlternate, true);
			});

			it('assigns true if included in props and value is true', async () => {
				const instance = new Role({ name: 'Young Lucius', isAlternate: true });

				assert.equal(instance.isAlternate, true);
			});
		});
	});

	describe('validateCharacterName method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });

			test.mock.method(instance, 'validateStringForProperty');

			instance.validateCharacterName();

			assert.equal(instance.validateStringForProperty.mock.callCount(), 1);
			assert.deepEqual(instance.validateStringForProperty.mock.calls[0].arguments, ['characterName', {
				isRequired: false
			}]);
		});
	});

	describe('validateCharacterDifferentiator method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const instance = new Role({ name: 'Cinna', characterDifferentiator: '1' });

			test.mock.method(instance, 'validateStringForProperty');

			instance.validateCharacterDifferentiator();

			assert.equal(instance.validateStringForProperty.mock.callCount(), 1);
			assert.deepEqual(instance.validateStringForProperty.mock.calls[0].arguments, ['characterDifferentiator', {
				isRequired: false
			}]);
		});
	});

	describe('validateRoleNameCharacterNameDisparity method', () => {
		context('valid data', () => {
			context('role name without a character name', () => {
				it('will not add properties to errors property', async (test) => {
					const instance = new Role({ name: 'Hamlet', characterName: '' });

					test.mock.method(instance, 'addPropertyError');

					instance.validateRoleNameCharacterNameDisparity();

					assert.equal(instance.addPropertyError.mock.callCount(), 0);
				});
			});

			context('role name and different character name', () => {
				it('will not add properties to errors property', async (test) => {
					const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });

					test.mock.method(instance, 'addPropertyError');

					instance.validateRoleNameCharacterNameDisparity();

					assert.equal(instance.addPropertyError.mock.callCount(), 0);
				});
			});

			context('no role name and no character name', () => {
				it('will not add properties to errors property', async (test) => {
					const instance = new Role({ name: '', characterName: '' });

					test.mock.method(instance, 'addPropertyError');

					instance.validateRoleNameCharacterNameDisparity();

					assert.equal(instance.addPropertyError.mock.callCount(), 0);
				});
			});
		});

		context('invalid data', () => {
			it('adds properties whose values are arrays to errors property', async (test) => {
				const instance = new Role({ name: 'Hamlet', characterName: 'Hamlet' });

				test.mock.method(instance, 'addPropertyError');

				instance.validateRoleNameCharacterNameDisparity();

				assert.equal(instance.addPropertyError.mock.callCount(), 1);
				assert.deepEqual(
					instance.addPropertyError.mock.calls[0].arguments,
					[
						'characterName',
						'Character name is only required if different from role name'
					]
				);
			});
		});
	});
});

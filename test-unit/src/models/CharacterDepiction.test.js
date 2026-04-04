import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

describe('CharacterDepiction model', () => {
	let stubs;
	let CharacterDepiction;

	beforeEach(async (test) => {
		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: test.mock.fn((arg) => arg?.trim() || '')
			}
		};

		CharacterDepiction = await esmock(
			'../../../src/models/CharacterDepiction.js',
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
			new CharacterDepiction();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls.length, 4);
		});

		describe('underlyingName property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new CharacterDepiction({ underlyingName: 'King Henry V' });

				assert.deepStrictEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[2].arguments, ['King Henry V']);
				assert.equal(instance.underlyingName, 'King Henry V');
			});
		});

		describe('qualifier property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new CharacterDepiction({ qualifier: 'older' });

				assert.deepStrictEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[3].arguments, ['older']);
				assert.equal(instance.qualifier, 'older');
			});
		});
	});

	describe('validateUnderlyingName method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });

			test.mock.method(instance, 'validateStringForProperty', () => undefined);

			instance.validateUnderlyingName();

			assert.strictEqual(instance.validateStringForProperty.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateStringForProperty.mock.calls[0].arguments, ['underlyingName', {
				isRequired: false
			}]);
		});
	});

	describe('validateCharacterNameUnderlyingNameDisparity method', () => {
		describe('valid data', () => {
			describe('role name without a character name', () => {
				it('will not add properties to errors property', async (test) => {
					const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: '' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateCharacterNameUnderlyingNameDisparity();

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			describe('role name and different character name', () => {
				it('will not add properties to errors property', async (test) => {
					const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateCharacterNameUnderlyingNameDisparity();

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			describe('no role name and no character name', () => {
				it('will not add properties to errors property', async (test) => {
					const instance = new CharacterDepiction({ name: '', underlyingName: '' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateCharacterNameUnderlyingNameDisparity();

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});
		});

		describe('invalid data', () => {
			it('adds properties whose values are arrays to errors property', async (test) => {
				const instance = new CharacterDepiction({ name: 'King Henry V', underlyingName: 'King Henry V' });

				test.mock.method(instance, 'addPropertyError', () => undefined);

				instance.validateCharacterNameUnderlyingNameDisparity();

				assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
				assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
					'underlyingName',
					'Underlying name is only required if different from character name'
				]);
			});
		});
	});
});

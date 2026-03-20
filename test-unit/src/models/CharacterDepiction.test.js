import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, spy, stub } from 'sinon';

describe('CharacterDepiction model', () => {
	let stubs;
	let CharacterDepiction;

	beforeEach(async () => {
		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
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

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new CharacterDepiction();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.callCount, 4);
		});

		describe('underlyingName property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new CharacterDepiction({ underlyingName: 'King Henry V' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.thirdCall, 'King Henry V');
				assert.equal(instance.underlyingName, 'King Henry V');
			});
		});

		describe('qualifier property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new CharacterDepiction({ qualifier: 'older' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.getCall(3), 'older');
				assert.equal(instance.qualifier, 'older');
			});
		});
	});

	describe('validateUnderlyingName method', () => {
		it('will call validateStringForProperty method', async () => {
			const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });

			spy(instance, 'validateStringForProperty');

			instance.validateUnderlyingName();

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'underlyingName', {
				isRequired: false
			});
		});
	});

	describe('validateCharacterNameUnderlyingNameDisparity method', () => {
		describe('valid data', () => {
			describe('role name without a character name', () => {
				it('will not add properties to errors property', async () => {
					const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: '' });

					spy(instance, 'addPropertyError');

					instance.validateCharacterNameUnderlyingNameDisparity();

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			describe('role name and different character name', () => {
				it('will not add properties to errors property', async () => {
					const instance = new CharacterDepiction({ name: 'Prince Hal', underlyingName: 'King Henry V' });

					spy(instance, 'addPropertyError');

					instance.validateCharacterNameUnderlyingNameDisparity();

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			describe('no role name and no character name', () => {
				it('will not add properties to errors property', async () => {
					const instance = new CharacterDepiction({ name: '', underlyingName: '' });

					spy(instance, 'addPropertyError');

					instance.validateCharacterNameUnderlyingNameDisparity();

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});
		});

		describe('invalid data', () => {
			it('adds properties whose values are arrays to errors property', async () => {
				const instance = new CharacterDepiction({ name: 'King Henry V', underlyingName: 'King Henry V' });

				spy(instance, 'addPropertyError');

				instance.validateCharacterNameUnderlyingNameDisparity();

				sinonAssert.calledOnceWithExactly(
					instance.addPropertyError,
					'underlyingName',
					'Underlying name is only required if different from character name'
				);
			});
		});
	});
});

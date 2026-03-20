import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, spy, stub } from 'sinon';

const context = describe;

describe('Role model', () => {
	let stubs;
	let Role;

	beforeEach(async () => {
		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
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

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new Role();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.callCount, 4);
		});

		describe('characterName property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Role({ characterName: 'Hamlet' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.secondCall, 'Hamlet');
				assert.equal(instance.characterName, 'Hamlet');
			});
		});

		describe('characterDifferentiator property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Role({ characterDifferentiator: '1' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.thirdCall, '1');
				assert.equal(instance.characterDifferentiator, '1');
			});
		});

		describe('qualifier property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Role({ qualifier: 'younger' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.getCall(3), 'younger');
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
		it('will call validateStringForProperty method', async () => {
			const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });

			spy(instance, 'validateStringForProperty');

			instance.validateCharacterName();

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'characterName', {
				isRequired: false
			});
		});
	});

	describe('validateCharacterDifferentiator method', () => {
		it('will call validateStringForProperty method', async () => {
			const instance = new Role({ name: 'Cinna', characterDifferentiator: '1' });

			spy(instance, 'validateStringForProperty');

			instance.validateCharacterDifferentiator();

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'characterDifferentiator', {
				isRequired: false
			});
		});
	});

	describe('validateRoleNameCharacterNameDisparity method', () => {
		context('valid data', () => {
			context('role name without a character name', () => {
				it('will not add properties to errors property', async () => {
					const instance = new Role({ name: 'Hamlet', characterName: '' });

					spy(instance, 'addPropertyError');

					instance.validateRoleNameCharacterNameDisparity();

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('role name and different character name', () => {
				it('will not add properties to errors property', async () => {
					const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });

					spy(instance, 'addPropertyError');

					instance.validateRoleNameCharacterNameDisparity();

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('no role name and no character name', () => {
				it('will not add properties to errors property', async () => {
					const instance = new Role({ name: '', characterName: '' });

					spy(instance, 'addPropertyError');

					instance.validateRoleNameCharacterNameDisparity();

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});
		});

		context('invalid data', () => {
			it('adds properties whose values are arrays to errors property', async () => {
				const instance = new Role({ name: 'Hamlet', characterName: 'Hamlet' });

				spy(instance, 'addPropertyError');

				instance.validateRoleNameCharacterNameDisparity();

				sinonAssert.calledOnceWithExactly(
					instance.addPropertyError,
					'characterName',
					'Character name is only required if different from role name'
				);
			});
		});
	});
});

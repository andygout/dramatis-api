import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Base model', () => {
	let stubs;

	beforeEach((test) => {
		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: test.mock.fn((arg) => arg?.trim() || '')
			},
			validateString: test.mock.fn((value, opts) => {
				if (value === '' && opts?.isRequired === true) {
					return 'Value is too short';
				}

				if (value === ABOVE_MAX_LENGTH_STRING && opts?.isRequired === false) {
					return 'Value is too long';
				}

				return undefined;
			})
		};
	});

	const createSubject = (model = 'Base') =>
		esmock(
			`../../../src/models/${model}.js`,
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when instances of class extensions of the Base class are tested.
			{
				'../../../src/lib/strings.js': stubs.stringsModule,
				'../../../src/lib/validate-string.js': stubs.validateString
			}
		);

	describe('constructor method', () => {
		describe('name property', () => {
			describe('model is not exempt', () => {
				it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					assert.strictEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[0].arguments, ['Foobar']);
					assert.equal(instance.name, 'Foobar');
				});
			});

			describe('model is exempt', () => {
				describe('model is Nomination', () => {
					it('does not assign name property', async () => {
						const Nomination = await createSubject('Nomination');

						const instance = new Nomination({ name: '1' });

						assert.equal(Object.hasOwn(instance, 'name'), false);
					});
				});

				describe('model is ProductionIdentifier', () => {
					it('does not assign name property', async () => {
						const ProductionIdentifier = await createSubject('ProductionIdentifier');

						const instance = new ProductionIdentifier({
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							name: '1'
						});

						assert.equal(Object.hasOwn(instance, 'name'), false);
					});
				});

				describe('model is Review', () => {
					it('does not assign name property', async () => {
						const Review = await createSubject('Review');

						const instance = new Review({
							url: 'https://www.foo.com',
							name: 'foo'
						});

						assert.equal(Object.hasOwn(instance, 'name'), false);
					});
				});
			});
		});
	});

	describe('validateName method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const Base = await createSubject();

			const instance = new Base();

			test.mock.method(instance, 'validateStringForProperty', () => undefined);

			instance.validateName({ isRequired: false });

			assert.strictEqual(instance.validateStringForProperty.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateStringForProperty.mock.calls[0].arguments, ['name', { isRequired: false }]);
		});
	});

	describe('validateQualifier method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const Base = await createSubject();

			const instance = new Base();

			test.mock.method(instance, 'validateStringForProperty', () => undefined);

			instance.validateQualifier();

			assert.strictEqual(instance.validateStringForProperty.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateStringForProperty.mock.calls[0].arguments, ['qualifier', { isRequired: false }]);
		});
	});

	describe('validateStringForProperty method', () => {
		describe('valid data', () => {
			it('will not call addPropertyError method', async (test) => {
				const Base = await createSubject();

				const instance = new Base();

				test.mock.method(instance, 'addPropertyError', () => undefined);

				instance.validateStringForProperty('name', { isRequired: false });

				assert.strictEqual(stubs.validateString.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.validateString.mock.calls[0].arguments, [instance.name, { isRequired: false }]);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
			});
		});

		describe('invalid data', () => {
			it('will call addPropertyError method', async (test) => {
				const Base = await createSubject();
				const callOrder = [];

				stubs.validateString = test.mock.fn((value, opts) => {
					callOrder.push('validateString');

					if (value === '' && opts?.isRequired === true) {
						return 'Value is too short';
					}

					if (value === ABOVE_MAX_LENGTH_STRING && opts?.isRequired === false) {
						return 'Value is too long';
					}

					return undefined;
				});

				const BaseWithOrderedValidateString = await createSubject();
				const instance = new BaseWithOrderedValidateString({ name: '' });

				test.mock.method(instance, 'addPropertyError', (...args) => {
					callOrder.push('addPropertyError');

					return undefined;
				});

				instance.validateStringForProperty('name', { isRequired: true });

				assert.deepStrictEqual(callOrder, ['validateString', 'addPropertyError']);
				assert.strictEqual(stubs.validateString.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.validateString.mock.calls[0].arguments, [instance.name, { isRequired: true }]);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
				assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, ['name', 'Value is too short']);
			});
		});
	});

	describe('validateUniquenessInGroup method', () => {
		describe('valid data', () => {
			it('will not call addPropertyError method', async (test) => {
				const Base = await createSubject();

				const instance = new Base({ name: 'Foobar' });

				test.mock.method(instance, 'addPropertyError', () => undefined);

				const opts = { isDuplicate: false };

				instance.validateUniquenessInGroup(opts);

				assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
			});
		});

		describe('invalid data', () => {
			describe('instance does not have differentiator, characterDifferentiator, or qualifier property', () => {
				it('will call addPropertyError method with group context error text for name property only', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'name',
						'This item has been duplicated within the group'
					]);
				});
			});

			describe('instance has underlyingName property', () => {
				it('will call addPropertyError method with group context error text for name and underlyingName properties', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.underlyingName = '';

					test.mock.method(instance, 'addPropertyError', () => undefined);

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'name',
						'This item has been duplicated within the group'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
						'underlyingName',
						'This item has been duplicated within the group'
					]);
				});
			});

			describe('instance has characterName property', () => {
				it('will call addPropertyError method with group context error text for name and characterName properties', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.characterName = '';

					test.mock.method(instance, 'addPropertyError', () => undefined);

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'name',
						'This item has been duplicated within the group'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
						'characterName',
						'This item has been duplicated within the group'
					]);
				});
			});

			describe('instance has differentiator property', () => {
				it('will call addPropertyError method with group context error text for name and differentiator properties', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.differentiator = '';

					test.mock.method(instance, 'addPropertyError', () => undefined);

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'name',
						'This item has been duplicated within the group'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
						'differentiator',
						'This item has been duplicated within the group'
					]);
				});
			});

			describe('instance has characterDifferentiator property', () => {
				it('will call addPropertyError method with group context error text for name and differentiator properties', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.characterDifferentiator = '';

					test.mock.method(instance, 'addPropertyError', () => undefined);

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'name',
						'This item has been duplicated within the group'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
						'characterDifferentiator',
						'This item has been duplicated within the group'
					]);
				});
			});

			describe('instance has qualifier property', () => {
				it('will call addPropertyError method with group context error text for name and qualifier properties', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.qualifier = '';

					test.mock.method(instance, 'addPropertyError', () => undefined);

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 2);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'name',
						'This item has been duplicated within the group'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
						'qualifier',
						'This item has been duplicated within the group'
					]);
				});
			});

			describe('instance has differentiator, characterDifferentiator, and qualifier property', () => {
				it('will call addPropertyError method with group context error text for name, differentiator, and qualifier properties', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.differentiator = '';
					instance.characterDifferentiator = '';
					instance.qualifier = '';

					test.mock.method(instance, 'addPropertyError', () => undefined);

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					assert.equal(instance.addPropertyError.mock.calls.length, 4);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'name',
						'This item has been duplicated within the group'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[1].arguments, [
						'differentiator',
						'This item has been duplicated within the group'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[2].arguments, [
						'characterDifferentiator',
						'This item has been duplicated within the group'
					]);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[3].arguments, [
						'qualifier',
						'This item has been duplicated within the group'
					]);
				});
			});

			describe('instance has uuid property which is specified via opts argument as requiring an error assigned to it', () => {
				it('will call addPropertyError method with group context error text for uuid property only (i.e. not name property)', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.uuid = '';

					test.mock.method(instance, 'addPropertyError', () => undefined);

					const opts = { isDuplicate: true, properties: new Set(['uuid']) };

					instance.validateUniquenessInGroup(opts);

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
					assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
						'uuid',
						'This item has been duplicated within the group'
					]);
				});
			});
		});
	});

	describe('validateNamePresenceIfNamedChildren method', () => {
		it('will call validatePropertyPresenceIfNamedChildren', async (test) => {
			const Base = await createSubject();

			const instance = new Base({ name: 'Foobar' });

			test.mock.method(instance, 'validatePropertyPresenceIfNamedChildren', () => undefined);

			instance.validateNamePresenceIfNamedChildren([{ name: 'Foo' }, { name: 'Bar' }]);

			assert.strictEqual(instance.validatePropertyPresenceIfNamedChildren.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validatePropertyPresenceIfNamedChildren.mock.calls[0].arguments, [
				'name',
				[{ name: 'Foo' }, { name: 'Bar' }]
			]);
		});
	});

	describe('validatePropertyPresenceIfNamedChildren method', () => {
		describe('valid data', () => {
			describe('instance does not have name nor any children with names', () => {
				it('will not add properties to errors property', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: '' });

					instance.name = '';

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validatePropertyPresenceIfNamedChildren('name', [{ name: '' }]);

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			describe('instance has a name and no children with names', () => {
				it('will not add properties to errors property', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validatePropertyPresenceIfNamedChildren('name', [{ name: '' }]);

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			describe('instance has a name and children with names', () => {
				it('will not add properties to errors property', async (test) => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validatePropertyPresenceIfNamedChildren('name', [{ name: 'Bar' }]);

					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});
		});

		describe('invalid data', () => {
			it('adds properties to errors property', async (test) => {
				const Base = await createSubject();

				const instance = new Base({ name: '' });

				instance.name = '';

				test.mock.method(instance, 'addPropertyError', () => undefined);

				instance.validatePropertyPresenceIfNamedChildren('name', [{ name: 'Bar' }]);

				assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
				assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
					'name',
					'Value is required if named children exist'
				]);
			});
		});
	});

	describe('addPropertyError method', () => {
		describe('property exists on errors object', () => {
			it('merges error into existing array', async () => {
				const Base = await createSubject();

				const instance = new Base({ name: 'Foobar' });

				instance.errors.name = ['Value is too long'];

				instance.addPropertyError('name', 'Name has been duplicated in this group');

				assert.deepEqual(instance.errors.name, ['Value is too long', 'Name has been duplicated in this group']);
			});
		});

		describe('property does not exist on errors object', () => {
			it('adds new property to errors object and assigns a value of an array containing error text', async () => {
				const Base = await createSubject();

				const instance = new Base({ name: 'Foobar' });

				instance.errors.name = ['Name has been duplicated in this group'];

				instance.addPropertyError('characterName', 'Value is too long');

				assert.deepEqual(instance.errors.name, ['Name has been duplicated in this group']);
				assert.deepEqual(instance.errors.characterName, ['Value is too long']);
			});
		});
	});
});

import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, restore, spy, stub } from 'sinon';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Base model', () => {
	let stubs;

	beforeEach(() => {
		stubs = {
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
			},
			validateString: stub().returns(undefined)
		};

		stubs.validateString.withArgs('', { isRequired: true }).returns('Value is too short');
		stubs.validateString.withArgs(ABOVE_MAX_LENGTH_STRING, { isRequired: false }).returns('Value is too long');
	});

	afterEach(() => {
		restore();
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

					sinonAssert.calledOnceWithExactly(stubs.stringsModule.getTrimmedOrEmptyString, 'Foobar');
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
		it('will call validateStringForProperty method', async () => {
			const Base = await createSubject();

			const instance = new Base();

			spy(instance, 'validateStringForProperty');

			instance.validateName({ isRequired: false });

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'name', { isRequired: false });
		});
	});

	describe('validateQualifier method', () => {
		it('will call validateStringForProperty method', async () => {
			const Base = await createSubject();

			const instance = new Base();

			spy(instance, 'validateStringForProperty');

			instance.validateQualifier();

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'qualifier', { isRequired: false });
		});
	});

	describe('validateStringForProperty method', () => {
		describe('valid data', () => {
			it('will not call addPropertyError method', async () => {
				const Base = await createSubject();

				const instance = new Base();

				spy(instance, 'addPropertyError');

				instance.validateStringForProperty('name', { isRequired: false });

				sinonAssert.calledOnceWithExactly(stubs.validateString, instance.name, { isRequired: false });
				sinonAssert.notCalled(instance.addPropertyError);
			});
		});

		describe('invalid data', () => {
			it('will call addPropertyError method', async () => {
				const Base = await createSubject();

				const instance = new Base({ name: '' });

				spy(instance, 'addPropertyError');

				instance.validateStringForProperty('name', { isRequired: true });

				sinonAssert.callOrder(stubs.validateString, instance.addPropertyError);
				sinonAssert.calledOnceWithExactly(stubs.validateString, instance.name, { isRequired: true });
				sinonAssert.calledOnceWithExactly(instance.addPropertyError, 'name', 'Value is too short');
			});
		});
	});

	describe('validateUniquenessInGroup method', () => {
		describe('valid data', () => {
			it('will not call addPropertyError method', async () => {
				const Base = await createSubject();

				const instance = new Base({ name: 'Foobar' });

				spy(instance, 'addPropertyError');

				const opts = { isDuplicate: false };

				instance.validateUniquenessInGroup(opts);

				sinonAssert.notCalled(instance.addPropertyError);
			});
		});

		describe('invalid data', () => {
			describe('instance does not have differentiator, characterDifferentiator, or qualifier property', () => {
				it('will call addPropertyError method with group context error text for name property only', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					spy(instance, 'addPropertyError');

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'name',
						'This item has been duplicated within the group'
					);
				});
			});

			describe('instance has underlyingName property', () => {
				it('will call addPropertyError method with group context error text for name and underlyingName properties', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.underlyingName = '';

					spy(instance, 'addPropertyError');

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					sinonAssert.calledTwice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name',
						'This item has been duplicated within the group'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'underlyingName',
						'This item has been duplicated within the group'
					);
				});
			});

			describe('instance has characterName property', () => {
				it('will call addPropertyError method with group context error text for name and characterName properties', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.characterName = '';

					spy(instance, 'addPropertyError');

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					sinonAssert.calledTwice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name',
						'This item has been duplicated within the group'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'characterName',
						'This item has been duplicated within the group'
					);
				});
			});

			describe('instance has differentiator property', () => {
				it('will call addPropertyError method with group context error text for name and differentiator properties', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.differentiator = '';

					spy(instance, 'addPropertyError');

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					sinonAssert.calledTwice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name',
						'This item has been duplicated within the group'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'differentiator',
						'This item has been duplicated within the group'
					);
				});
			});

			describe('instance has characterDifferentiator property', () => {
				it('will call addPropertyError method with group context error text for name and differentiator properties', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.characterDifferentiator = '';

					spy(instance, 'addPropertyError');

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					sinonAssert.calledTwice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name',
						'This item has been duplicated within the group'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'characterDifferentiator',
						'This item has been duplicated within the group'
					);
				});
			});

			describe('instance has qualifier property', () => {
				it('will call addPropertyError method with group context error text for name and qualifier properties', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.qualifier = '';

					spy(instance, 'addPropertyError');

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					sinonAssert.calledTwice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name',
						'This item has been duplicated within the group'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'qualifier',
						'This item has been duplicated within the group'
					);
				});
			});

			describe('instance has differentiator, characterDifferentiator, and qualifier property', () => {
				it('will call addPropertyError method with group context error text for name, differentiator, and qualifier properties', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.differentiator = '';
					instance.characterDifferentiator = '';
					instance.qualifier = '';

					spy(instance, 'addPropertyError');

					const opts = { isDuplicate: true };

					instance.validateUniquenessInGroup(opts);

					assert.equal(instance.addPropertyError.callCount, 4);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name',
						'This item has been duplicated within the group'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'differentiator',
						'This item has been duplicated within the group'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.thirdCall,
						'characterDifferentiator',
						'This item has been duplicated within the group'
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.getCall(3),
						'qualifier',
						'This item has been duplicated within the group'
					);
				});
			});

			describe('instance has uuid property which is specified via opts argument as requiring an error assigned to it', () => {
				it('will call addPropertyError method with group context error text for uuid property only (i.e. not name property)', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					instance.uuid = '';

					spy(instance, 'addPropertyError');

					const opts = { isDuplicate: true, properties: new Set(['uuid']) };

					instance.validateUniquenessInGroup(opts);

					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'uuid',
						'This item has been duplicated within the group'
					);
				});
			});
		});
	});

	describe('validateNamePresenceIfNamedChildren method', () => {
		it('will call validatePropertyPresenceIfNamedChildren', async () => {
			const Base = await createSubject();

			const instance = new Base({ name: 'Foobar' });

			spy(instance, 'validatePropertyPresenceIfNamedChildren');

			instance.validateNamePresenceIfNamedChildren([{ name: 'Foo' }, { name: 'Bar' }]);

			sinonAssert.calledOnceWithExactly(instance.validatePropertyPresenceIfNamedChildren, 'name', [
				{ name: 'Foo' },
				{ name: 'Bar' }
			]);
		});
	});

	describe('validatePropertyPresenceIfNamedChildren method', () => {
		describe('valid data', () => {
			describe('instance does not have name nor any children with names', () => {
				it('will not add properties to errors property', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: '' });

					instance.name = '';

					spy(instance, 'addPropertyError');

					instance.validatePropertyPresenceIfNamedChildren('name', [{ name: '' }]);

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			describe('instance has a name and no children with names', () => {
				it('will not add properties to errors property', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					spy(instance, 'addPropertyError');

					instance.validatePropertyPresenceIfNamedChildren('name', [{ name: '' }]);

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			describe('instance has a name and children with names', () => {
				it('will not add properties to errors property', async () => {
					const Base = await createSubject();

					const instance = new Base({ name: 'Foobar' });

					spy(instance, 'addPropertyError');

					instance.validatePropertyPresenceIfNamedChildren('name', [{ name: 'Bar' }]);

					sinonAssert.notCalled(instance.addPropertyError);
				});
			});
		});

		describe('invalid data', () => {
			it('adds properties to errors property', async () => {
				const Base = await createSubject();

				const instance = new Base({ name: '' });

				instance.name = '';

				spy(instance, 'addPropertyError');

				instance.validatePropertyPresenceIfNamedChildren('name', [{ name: 'Bar' }]);

				sinonAssert.calledOnceWithExactly(
					instance.addPropertyError,
					'name',
					'Value is required if named children exist'
				);
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

import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import * as validateStringModule from '../../../src/lib/validate-string';
import Base from '../../../src/models/Base';
import { Nomination, ProductionIdentifier } from '../../../src/models';

describe('Base model', () => {

	let stubs;
	let instance;

	const STRING_MAX_LENGTH = 1000;
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			validateString: sandbox.stub(validateStringModule, 'validateString').returns(undefined)
		};

		stubs.validateString.withArgs('', { isRequired: true }).returns('Value is too short');
		stubs.validateString.withArgs(ABOVE_MAX_LENGTH_STRING, { isRequired: false }).returns('Value is too long');

		instance = new Base({ name: 'Foobar' });

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('name property', () => {

			context('model is not exempt', () => {

				it('assigns empty string if absent from props', () => {

					const instance = new Base({});
					expect(instance.name).to.equal('');

				});

				it('assigns empty string if included in props but value is empty string', () => {

					const instance = new Base({ name: '' });
					expect(instance.name).to.equal('');

				});

				it('assigns empty string if included in props but value is whitespace-only string', () => {

					const instance = new Base({ name: ' ' });
					expect(instance.name).to.equal('');

				});

				it('assigns value if included in props and is string with length', () => {

					const instance = new Base({ name: 'Barfoo' });
					expect(instance.name).to.equal('Barfoo');

				});

				it('trims value before assigning', () => {

					const instance = new Base({ name: ' Barfoo ' });
					expect(instance.name).to.equal('Barfoo');

				});

			});

			context('model is exempt', () => {

				context('model is Nomination', () => {

					it('does not assign name property', () => {

						const instance = new Nomination({ name: '1' });
						expect(instance).to.not.have.property('name');

					});

				});

				context('model is ProductionIdentifier', () => {

					it('does not assign name property', () => {

						const instance = new ProductionIdentifier({
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
							name: '1'
						});
						expect(instance).to.not.have.property('name');

					});

				});

			});

		});

	});

	describe('validateName method', () => {

		it('will call validateStringForProperty method', () => {

			spy(instance, 'validateStringForProperty');
			instance.validateName({ isRequired: false });
			assert.calledOnce(instance.validateStringForProperty);
			assert.calledWithExactly(
				instance.validateStringForProperty,
				'name', { isRequired: false }
			);

		});

	});

	describe('validateQualifier method', () => {

		it('will call validateStringForProperty method', () => {

			spy(instance, 'validateStringForProperty');
			instance.validateQualifier();
			assert.calledOnce(instance.validateStringForProperty);
			assert.calledWithExactly(
				instance.validateStringForProperty,
				'qualifier', { isRequired: false }
			);

		});

	});

	describe('validateStringForProperty method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', () => {

				spy(instance, 'addPropertyError');
				instance.validateStringForProperty('name', { isRequired: false });
				assert.calledOnce(stubs.validateString);
				assert.calledWithExactly(
					stubs.validateString,
					instance.name, { isRequired: false }
				);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data', () => {

			it('will call addPropertyError method', () => {

				const instance = new Base({ name: '' });
				spy(instance, 'addPropertyError');
				instance.validateStringForProperty('name', { isRequired: true });
				assert.callOrder(
					stubs.validateString,
					instance.addPropertyError
				);
				assert.calledOnce(stubs.validateString);
				assert.calledWithExactly(
					stubs.validateString,
					instance.name, { isRequired: true }
				);
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'name', 'Value is too short'
				);

			});

		});

	});

	describe('validateUniquenessInGroup method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', () => {

				spy(instance, 'addPropertyError');
				const opts = { isDuplicate: false };
				instance.validateUniquenessInGroup(opts);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('invalid data', () => {

			context('instance does not have differentiator, characterDifferentiator, qualifier, or group property', () => {

				it('will call addPropertyError method with group context error text for name property only', () => {

					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledOnce(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError,
						'name', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has underlyingName property', () => {

				it('will call addPropertyError method with group context error text for name and underlyingName properties', () => {

					instance.underlyingName = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'underlyingName', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has characterName property', () => {

				it('will call addPropertyError method with group context error text for name and characterName properties', () => {

					instance.characterName = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'characterName', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has differentiator property', () => {

				it('will call addPropertyError method with group context error text for name and differentiator properties', () => {

					instance.differentiator = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'differentiator', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has characterDifferentiator property', () => {

				it('will call addPropertyError method with group context error text for name and differentiator properties', () => {

					instance.characterDifferentiator = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'characterDifferentiator', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has qualifier property', () => {

				it('will call addPropertyError method with group context error text for name and qualifier properties', () => {

					instance.qualifier = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledTwice(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'qualifier', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has group property', () => {

				it('will call addPropertyError method with group context error text for name property', () => {

					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					assert.calledOnce(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError,
						'name', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has differentiator, characterDifferentiator, qualifier, and group property', () => {

				it('will call addPropertyError method with group context error text for name, differentiator, and qualifier properties', () => {

					instance.differentiator = '';
					instance.characterDifferentiator = '';
					instance.qualifier = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.callCount).to.equal(4);
					assert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'name', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'differentiator', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.thirdCall,
						'characterDifferentiator', 'This item has been duplicated within the group'
					);
					assert.calledWithExactly(
						instance.addPropertyError.getCall(3),
						'qualifier', 'This item has been duplicated within the group'
					);

				});

			});

			context('instance has uuid property which is specified via opts argument as requiring an error assigned to it', () => {

				it('will call addPropertyError method with group context error text for uuid property only (i.e. not name property)', () => {

					instance.uuid = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true, properties: new Set(['uuid']) };
					instance.validateUniquenessInGroup(opts);
					assert.calledOnce(instance.addPropertyError);
					assert.calledWithExactly(
						instance.addPropertyError,
						'uuid', 'This item has been duplicated within the group'
					);

				});

			});

		});

	});

	describe('validateNamePresenceIfNamedChildren method', () => {

		context('valid data', () => {

			context('instance does not have name nor any children with names', () => {

				it('will not add properties to errors property', () => {

					const instance = new Base({ name: '' });
					spy(instance, 'addPropertyError');
					instance.validateNamePresenceIfNamedChildren([{ name: '' }]);
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('instance has a name and no children with names', () => {

				it('will not add properties to errors property', () => {

					const instance = new Base({ name: 'Foo' });
					spy(instance, 'addPropertyError');
					instance.validateNamePresenceIfNamedChildren([{ name: '' }]);
					assert.notCalled(instance.addPropertyError);
				});

			});

			context('instance has a name and children with names', () => {

				it('will not add properties to errors property', () => {

					const instance = new Base({ name: 'Foo' });
					spy(instance, 'addPropertyError');
					instance.validateNamePresenceIfNamedChildren([{ name: 'Bar' }]);
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			it('adds properties to errors property', () => {

				const instance = new Base({ name: '' });
				spy(instance, 'addPropertyError');
				instance.validateNamePresenceIfNamedChildren([{ name: 'Bar' }]);
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'name', 'Name is required if named children exist'
				);

			});

		});

	});

	describe('addPropertyError method', () => {

		context('property exists on errors object', () => {

			it('merges error into existing array', async () => {

				instance.errors.name = ['Value is too long'];
				instance.addPropertyError('name', 'Name has been duplicated in this group');
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.equal(['Value is too long', 'Name has been duplicated in this group']);

			});

		});

		context('property does not exist on errors object', () => {

			it('adds new property to errors object and assigns a value of an array containing error text', async () => {

				instance.errors.name = ['Name has been duplicated in this group'];
				instance.addPropertyError('characterName', 'Value is too long');
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.equal(['Name has been duplicated in this group']);
				expect(instance.errors)
					.to.have.property('characterName')
					.that.is.an('array')
					.that.deep.equal(['Value is too long']);

			});

		});

	});

});

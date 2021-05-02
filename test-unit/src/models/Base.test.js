import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import * as validateStringModule from '../../../src/lib/validate-string';
import Base from '../../../src/models/Base';

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

			it('assigns empty string if absent from props', () => {

				instance = new Base({});
				expect(instance.name).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				instance = new Base({ name: '' });
				expect(instance.name).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				instance = new Base({ name: ' ' });
				expect(instance.name).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				instance = new Base({ name: 'Barfoo' });
				expect(instance.name).to.equal('Barfoo');

			});

			it('trims value before assigning', () => {

				instance = new Base({ name: ' Barfoo ' });
				expect(instance.name).to.equal('Barfoo');

			});

		});

	});

	describe('validateName method', () => {

		it('will call validateStringForProperty method', () => {

			spy(instance, 'validateStringForProperty');
			instance.validateName({ isRequired: false });
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly('name', { isRequired: false })).to.be.true;

		});

	});

	describe('validateQualifier method', () => {

		it('will call validateStringForProperty method', () => {

			spy(instance, 'validateStringForProperty');
			instance.validateQualifier();
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly('qualifier', { isRequired: false })).to.be.true;

		});

	});

	describe('validateStringForProperty method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', () => {

				spy(instance, 'addPropertyError');
				instance.validateStringForProperty('name', { isRequired: false });
				expect(stubs.validateString.calledOnce).to.be.true;
				expect(stubs.validateString.calledWithExactly(instance.name, { isRequired: false })).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data', () => {

			it('will call addPropertyError method', () => {

				instance = new Base({ name: '' });
				spy(instance, 'addPropertyError');
				instance.validateStringForProperty('name', { isRequired: true });
				assert.callOrder(
					stubs.validateString,
					instance.addPropertyError
				);
				expect(stubs.validateString.calledOnce).to.be.true;
				expect(stubs.validateString.calledWithExactly(instance.name, { isRequired: true })).to.be.true;
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly('name', 'Value is too short')).to.be.true;

			});

		});

	});

	describe('validateUniquenessInGroup method', () => {

		context('valid data', () => {

			it('will not call addPropertyError method', () => {

				spy(instance, 'addPropertyError');
				const opts = { isDuplicate: false };
				instance.validateUniquenessInGroup(opts);
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('invalid data', () => {

			context('instance does not have differentiator, characterDifferentiator, qualifier, or group property', () => {

				it('will call addPropertyError method with group context error text for name property only', () => {

					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledOnce).to.be.true;
					expect(instance.addPropertyError.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has underlyingName property', () => {

				it('will call addPropertyError method with group context error text for name and underlyingName properties', () => {

					instance.underlyingName = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'underlyingName', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has characterName property', () => {

				it('will call addPropertyError method with group context error text for name and characterName properties', () => {

					instance.characterName = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'characterName', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has differentiator property', () => {

				it('will call addPropertyError method with group context error text for name and differentiator properties', () => {

					instance.differentiator = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'differentiator', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has characterDifferentiator property', () => {

				it('will call addPropertyError method with group context error text for name and differentiator properties', () => {

					instance.characterDifferentiator = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'characterDifferentiator', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has qualifier property', () => {

				it('will call addPropertyError method with group context error text for name and qualifier properties', () => {

					instance.qualifier = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'qualifier', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has group property', () => {

				it('will call addPropertyError method with group context error text for name and group properties', () => {

					instance.group = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.calledTwice).to.be.true;
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'group', 'This item has been duplicated within the group'
					)).to.be.true;

				});

			});

			context('instance has differentiator, characterDifferentiator, qualifier, and group property', () => {

				it('will call addPropertyError method with group context error text for name, differentiator, qualifier, and group properties', () => {

					instance.differentiator = '';
					instance.characterDifferentiator = '';
					instance.qualifier = '';
					instance.group = '';
					spy(instance, 'addPropertyError');
					const opts = { isDuplicate: true };
					instance.validateUniquenessInGroup(opts);
					expect(instance.addPropertyError.callCount).to.equal(5);
					expect(instance.addPropertyError.firstCall.calledWithExactly(
						'name', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.secondCall.calledWithExactly(
						'differentiator', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.thirdCall.calledWithExactly(
						'characterDifferentiator', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(3).calledWithExactly(
						'qualifier', 'This item has been duplicated within the group'
					)).to.be.true;
					expect(instance.addPropertyError.getCall(4).calledWithExactly(
						'group', 'This item has been duplicated within the group'
					)).to.be.true;

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
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

			context('instance has a name and no children with names', () => {

				it('will not add properties to errors property', () => {

					const instance = new Base({ name: 'Foo' });
					spy(instance, 'addPropertyError');
					instance.validateNamePresenceIfNamedChildren([{ name: '' }]);
					expect(instance.addPropertyError.notCalled).to.be.true;
				});

			});

			context('instance has a name and children with names', () => {

				it('will not add properties to errors property', () => {

					const instance = new Base({ name: 'Foo' });
					spy(instance, 'addPropertyError');
					instance.validateNamePresenceIfNamedChildren([{ name: 'Bar' }]);
					expect(instance.addPropertyError.notCalled).to.be.true;

				});

			});

		});

		context('invalid data', () => {

			it('adds properties to errors property', () => {

				const instance = new Base({ name: '' });
				spy(instance, 'addPropertyError');
				instance.validateNamePresenceIfNamedChildren([{ name: 'Bar' }]);
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'name',
					'Name is required if named children exist'
				)).to.be.true;

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

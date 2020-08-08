import { expect } from 'chai';
import { assert, createSandbox, spy } from 'sinon';

import * as validateStringModule from '../../../src/lib/validate-string';
import Role from '../../../src/models/Role';

describe('Role model', () => {

	let stubs;

	const STRING_MAX_LENGTH = 1000;
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			validateString: sandbox.stub(validateStringModule, 'validateString').returns(undefined)
		};

		stubs.validateString.withArgs(ABOVE_MAX_LENGTH_STRING, { isRequiredString: false }).returns('Name is too long');

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('name property', () => {

			it('assigns given value', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				expect(instance.name).to.equal('Hamlet, Prince of Denmark');

			});

			it('trims given value before assigning', () => {

				const instance = new Role({ name: ' Hamlet, Prince of Denmark ', characterName: '' });
				expect(instance.name).to.equal('Hamlet, Prince of Denmark');

			});

		});

		describe('characterName property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				expect(instance.characterName).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				expect(instance.characterName).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: ' ' });
				expect(instance.characterName).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
				expect(instance.characterName).to.equal('Hamlet');

			});

			it('trims value before assigning', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: ' Hamlet ' });
				expect(instance.characterName).to.equal('Hamlet');

			});

		});

	});

	describe('validateCharacterName method', () => {

		context('valid data', () => {

			it('will not add properties to errors property', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				spy(instance, 'addPropertyError');
				instance.validateCharacterName({ requiresCharacterName: false });
				expect(stubs.validateString.calledOnce).to.be.true;
				expect(stubs.validateString.calledWithExactly(
					instance.characterName, { isRequiredString: false })
				).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance =
					new Role({ name: 'Hamlet, Prince of Denmark', characterName: ABOVE_MAX_LENGTH_STRING });
				spy(instance, 'addPropertyError');
				instance.validateCharacterName({ requiresCharacterName: false });
				assert.callOrder(
					stubs.validateString,
					instance.addPropertyError
				);
				expect(stubs.validateString.calledOnce).to.be.true;
				expect(stubs.validateString.calledWithExactly(
					instance.characterName, { isRequiredString: false })
				).to.be.true;
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly('characterName', 'Name is too long')).to.be.true;
				expect(instance.errors)
					.to.have.property('characterName')
					.that.is.an('array')
					.that.deep.eq(['Name is too long']);

			});

		});

	});

	describe('validateCharacterNameHasRoleName method', () => {

		context('valid data', () => {

			it('will not add properties to errors property', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
				spy(instance, 'addPropertyError');
				instance.validateCharacterNameHasRoleName();
				expect(instance.addPropertyError.notCalled).to.be.true;
				expect(instance.errors).not.to.have.property('characterName');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new Role({ name: '', characterName: 'Hamlet' });
				spy(instance, 'addPropertyError');
				instance.validateCharacterNameHasRoleName();
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'name',
					'Role name is required when character name is present'
				)).to.be.true;
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Role name is required when character name is present']);

			});

		});

	});

	describe('validateRoleNameCharacterNameDisparity method', () => {

		context('valid data', () => {

			context('role name without a character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Role({ name: 'Hamlet', characterName: '' });
					spy(instance, 'addPropertyError');
					instance.validateRoleNameCharacterNameDisparity();
					expect(instance.addPropertyError.notCalled).to.be.true;
					expect(instance.errors).not.to.have.property('characterName');
					expect(instance.errors).to.deep.eq({});

				});

			});

			context('role name a different character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
					spy(instance, 'addPropertyError');
					instance.validateRoleNameCharacterNameDisparity();
					expect(instance.addPropertyError.notCalled).to.be.true;
					expect(instance.errors).not.to.have.property('characterName');
					expect(instance.errors).to.deep.eq({});

				});

			});

			context('no role name and no character name', () => {

				it('will not add properties to errors property', () => {

					const instance = new Role({ name: '', characterName: '' });
					spy(instance, 'addPropertyError');
					instance.validateRoleNameCharacterNameDisparity();
					expect(instance.addPropertyError.notCalled).to.be.true;
					expect(instance.errors).not.to.have.property('characterName');
					expect(instance.errors).to.deep.eq({});

				});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new Role({ name: 'Hamlet', characterName: 'Hamlet' });
				spy(instance, 'addPropertyError');
				instance.validateRoleNameCharacterNameDisparity();
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'characterName',
					'Character name is only required if different from role name'
				)).to.be.true;
				expect(instance.errors)
					.to.have.property('characterName')
					.that.is.an('array')
					.that.deep.eq(['Character name is only required if different from role name']);

			});

		});

	});

});

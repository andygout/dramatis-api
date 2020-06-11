import { expect } from 'chai';
import { createSandbox } from 'sinon';

import * as validateStringModule from '../../../src/lib/validate-string';
import Role from '../../../src/models/Role';

describe('Role model', () => {

	let stubs;

	const STRING_MAX_LENGTH = 1000;
	const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			validateString: sandbox.stub(validateStringModule, 'validateString').returns([])
		};

		stubs.validateString.withArgs(ABOVE_MAX_LENGTH_STRING, false).returns(['Name is too long']);

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('name property', () => {

			it('assigns given value', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				expect(instance.name).to.eq('Hamlet, Prince of Denmark');

			});

			it('trims given value before assigning', () => {

				const instance = new Role({ name: ' Hamlet, Prince of Denmark ', characterName: '' });
				expect(instance.name).to.eq('Hamlet, Prince of Denmark');

			});

		});

		describe('characterName property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				expect(instance.characterName).to.eq('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				expect(instance.characterName).to.eq('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: ' ' });
				expect(instance.characterName).to.eq('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
				expect(instance.characterName).to.eq('Hamlet');

			});

			it('trims value before assigning', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: ' Hamlet ' });
				expect(instance.characterName).to.eq('Hamlet');

			});

		});

	});

	describe('validateCharacterName method', () => {

		context('valid data', () => {

			it('will not add properties to errors property', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				instance.validateCharacterName({ requiresCharacterName: false });
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: ABOVE_MAX_LENGTH_STRING });
				instance.validateCharacterName({ requiresCharacterName: false });
				expect(instance.errors)
					.to.have.property('characterName')
					.that.is.an('array')
					.that.deep.eq(['Name is too long']);

			});

		});

	});

});

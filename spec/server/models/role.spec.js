import { expect } from 'chai';
import sinon from 'sinon';

import * as validateStringModule from '../../../server/lib/validate-string';
import Role from '../../../server/models/role';

describe('Role model', () => {

	let stubs;

	const sandbox = sinon.createSandbox();

	beforeEach(() => {

		stubs = {
			validateString: sandbox.stub(validateStringModule, 'validateString').returns([])
		};

		stubs.validateString.withArgs('').returns(['Name is too short']);

	});

	afterEach(() => {

		sandbox.restore();

	});

	describe('constructor method', () => {

		describe('name property', () => {

			it('assigns given value', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark' });
				expect(instance.name).to.eq('Hamlet, Prince of Denmark');

			});

			it('trims', () => {

				const instance = new Role({ name: ' Hamlet, Prince of Denmark ' });
				expect(instance.name).to.eq('Hamlet, Prince of Denmark');

			});

		});

		describe('characterName property', () => {

			it('assigns null if not included in props', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark' });
				expect(instance.characterName).to.eq(null);

			});

			it('assigns null if included in props but value is empty string', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: '' });
				expect(instance.characterName).to.eq(null);

			});

			it('assigns null if included in props but value is whitespace-only string', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: ' ' });
				expect(instance.characterName).to.eq(null);

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
				expect(instance.characterName).to.eq('Hamlet');

			});

		});

	});

	describe('validate method', () => {

		context('valid data', () => {

			it('will not add properties to errors property', () => {

				const instance = new Role({ name: 'Hamlet, Prince of Denmark' });
				instance.validate();
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data', () => {

			it('adds properties whose values are arrays to errors property', () => {

				const instance = new Role({ name: '' });
				instance.validate();
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name is too short']);

			});

		});

	});

});

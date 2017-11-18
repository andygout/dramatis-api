import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

let stubs;
let instance;

beforeEach(() => {

	stubs = {
		trimStrings: sinon.stub(),
		validateString: sinon.stub().returns([])
	};

	instance = createInstance();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/models/role', {
		'../lib/trim-strings': stubs.trimStrings,
		'../lib/validate-string': stubOverrides.validateString || stubs.validateString
	});

const createInstance = (stubOverrides = {}, props = { name: 'Hamlet, Prince of Denmark' }) => {

	const subject = createSubject(stubOverrides);

	return new subject(props);

};

describe('Role model', () => {

	describe('constructor method', () => {

		describe('characterName property', () => {

			it('will assign as null if not included in props', () => {

				expect(instance.characterName).to.eq(null);

			});

			it('will assign as null if included in props but value is empty string', () => {

				instance = createInstance({}, { name: 'Hamlet, Prince of Denmark', characterName: '' });
				expect(instance.characterName).to.eq(null);

			});

			it('will assign value if included in props and value is string with length', () => {

				instance = createInstance({}, { name: 'Hamlet, Prince of Denmark', characterName: 'Hamlet' });
				expect(instance.characterName).to.eq('Hamlet');

			});

		});

	});

	describe('validate method', () => {

		it('will trim strings before validating name and characterName', () => {

			instance.validate();
			sinon.assert.callOrder(
				stubs.trimStrings.withArgs(instance),
				stubs.validateString.withArgs(instance.name, {}),
				stubs.validateString.withArgs(instance.characterName, {})
			);
			expect(stubs.trimStrings.calledOnce).to.be.true;
			expect(stubs.validateString.calledTwice).to.be.true;

		});

		context('valid data', () => {

			it('will not add properties to errors property', () => {

				instance.validate();
				expect(instance.errors).not.to.have.property('name');
				expect(instance.errors).to.deep.eq({});

			});

		});

		context('invalid data', () => {

			it('will add properties that are arrays to errors property', () => {

				instance = createInstance({ validateString: sinon.stub().returns(['Name is too short']) });
				instance.validate();
				expect(instance.errors)
					.to.have.property('name')
					.that.is.an('array')
					.that.deep.eq(['Name is too short']);

			});

		});

	});

});

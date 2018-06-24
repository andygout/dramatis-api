import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

let stubs;
let subject;
let instance;

beforeEach(() => {

	stubs = {
		isObject: sinon.stub().returns(false)
	};

	subject = createSubject();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/lib/trim-strings', {
		'./is-object': stubOverrides.isObject || stubs.isObject
	});

describe('Trim Strings module', () => {

	context('top level string values', () => {

		it('will trim leading and trailing whitespace', () => {

			instance = { name: ' foobar ' };
			subject(instance);
			expect(stubs.isObject.calledOnce).to.be.true;
			expect(stubs.isObject.calledWithExactly(' foobar ')).to.be.true;
			expect(instance.name).to.eq('foobar');

		});

	});

	context('nested level string values', () => {

		it('will trim leading and trailing whitespace', () => {

			const isObjectStub = sinon.stub();
			isObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
			subject = createSubject({ isObject: isObjectStub });
			instance = { theatre: { name: ' foobar ' } };
			subject(instance);
			expect(isObjectStub.calledTwice).to.be.true;
			sinon.assert.calledWithExactly(isObjectStub.secondCall, ' foobar ');
			expect(instance.theatre.name).to.eq('foobar');

		});

	});

	context('string values of objects in arrays at top level', () => {

		it('will trim leading and trailing whitespace', () => {

			const isObjectStub = sinon.stub();
			isObjectStub.onFirstCall().returns(false).onSecondCall().returns(true).onThirdCall().returns(false);
			subject = createSubject({ isObject: isObjectStub });
			instance = { cast: [{ name: ' foobar ' }] };
			subject(instance);
			expect(isObjectStub.calledThrice).to.be.true;
			sinon.assert.calledWithExactly(isObjectStub.thirdCall, ' foobar ');
			expect(instance.cast[0].name).to.eq('foobar');

		});

	});

});

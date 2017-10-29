import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const sandbox = sinon.sandbox.create();

let stubs;
let subject;
let instance;

beforeEach(() => {

	stubs = {
		propIsObject: sandbox.stub().returns(false)
	};

	subject = createSubject();

});

afterEach(() => {

	sandbox.restore();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/lib/verify-error-presence', {
		'./prop-is-object': stubOverrides.propIsObject || stubs.propIsObject
	});

describe('Verify Error Presence module', () => {

	context('no valid error values present', () => {

		it('will return false if no error values present', () => {

			const propIsObjectStub = sinon.stub();
			propIsObjectStub.onFirstCall().returns(false).onSecondCall().returns(true).onThirdCall().returns(false);
			subject = createSubject({ propIsObject: propIsObjectStub });
			instance = { errors: {}, theatre: { errors: {} } };
			const result = subject(instance);
			expect(propIsObjectStub.calledThrice).to.be.true;
			sinon.assert.calledWithExactly(propIsObjectStub.firstCall, {});
			sinon.assert.calledWithExactly(propIsObjectStub.secondCall, { errors: {} });
			sinon.assert.calledWithExactly(propIsObjectStub.thirdCall, {});
			expect(result).to.be.false;

		});

		it('will return false if no error properties present', () => {

			instance = { notErrors: {} };
			const result = subject(instance);
			expect(stubs.propIsObject.calledOnce).to.be.true;
			expect(stubs.propIsObject.calledWithExactly({})).to.be.true;
			expect(result).to.be.false;

		});

		it('will return false if errors present in form of null value', () => {

			instance = { errors: null };
			const result = subject(instance);
			expect(stubs.propIsObject.calledOnce).to.be.true;
			expect(stubs.propIsObject.calledWithExactly(null)).to.be.true;
			expect(result).to.be.false;

		});

		it('will return false if errors present in form of array', () => {

			instance = { errors: ['Name is too short'] };
			const result = subject(instance);
			expect(stubs.propIsObject.calledTwice).to.be.true;
			sinon.assert.calledWithExactly(stubs.propIsObject.firstCall, ['Name is too short']);
			sinon.assert.calledWithExactly(stubs.propIsObject.secondCall, 'Name is too short');
			expect(result).to.be.false;

		});

	});

	context('top level errors present', () => {

		it('will return true', () => {

			instance = { errors: { name: ['Name is too short'] } };
			const result = subject(instance);
			expect(stubs.propIsObject.notCalled).to.be.true;
			expect(result).to.be.true;

		});

	});

	context('nested errors present', () => {

		it('will return true', () => {

			const propIsObjectStub = sinon.stub().returns(true);
			subject = createSubject({ propIsObject: propIsObjectStub });
			instance = { theatre: { errors: { name: ['Name is too short'] } } };
			const result = subject(instance);
			expect(propIsObjectStub.calledOnce).to.be.true;
			expect(propIsObjectStub.calledWithExactly({ errors: { name: ['Name is too short'] } })).to.be.true;
			expect(result).to.be.true;


		});

	});

	context('errors present in objects in arrays at top level', () => {

		it('will return true', () => {

			const propIsObjectStub = sinon.stub();
			propIsObjectStub.onFirstCall().returns(false).onSecondCall().returns(true);
			subject = createSubject({ propIsObject: propIsObjectStub });
			instance = { cast: [{ errors: { name: ['Name is too short'] } }] };
			const result = subject(instance);
			expect(propIsObjectStub.calledTwice).to.be.true;
			sinon.assert.calledWithExactly(propIsObjectStub.firstCall, [{ errors: { name: ['Name is too short'] } }]);
			sinon.assert.calledWithExactly(propIsObjectStub.secondCall, { errors: { name: ['Name is too short'] } });
			expect(result).to.be.true;


		});

	});

});

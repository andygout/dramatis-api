import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

let stubs;
let subject;
let instance;

beforeEach(() => {

	stubs = {
		propIsObject: sinon.stub().returns(false)
	};

	subject = createSubject();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/lib/verify-error-presence', {
		'./prop-is-object': stubOverrides.propIsObject || stubs.propIsObject
	});

describe('Verify Error Presence module', () => {

	context('no valid error values present', () => {

		it('will return false if no error values present', () => {

			const propIsObjectStub = sinon.stub();
			propIsObjectStub
				.onFirstCall().returns(false)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			subject = createSubject({ propIsObject: propIsObjectStub });
			instance = { errors: {}, theatre: { errors: {} } };
			const result = subject(instance);
			expect(propIsObjectStub.callCount).to.eq(5);
			sinon.assert.calledWithExactly(propIsObjectStub.firstCall, {});
			sinon.assert.calledWithExactly(propIsObjectStub.secondCall, {});
			sinon.assert.calledWithExactly(propIsObjectStub.thirdCall, { errors: {} });
			sinon.assert.calledWithExactly(propIsObjectStub.getCall(3), {});
			sinon.assert.calledWithExactly(propIsObjectStub.getCall(4), {});
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
			expect(stubs.propIsObject.calledTwice).to.be.true;
			sinon.assert.calledWithExactly(stubs.propIsObject.firstCall, null);
			sinon.assert.calledWithExactly(stubs.propIsObject.secondCall, null);
			expect(result).to.be.false;

		});

		it('will return false if errors present in form of array', () => {

			instance = { errors: ['Name is too short'] };
			const result = subject(instance);
			expect(stubs.propIsObject.calledThrice).to.be.true;
			sinon.assert.calledWithExactly(stubs.propIsObject.firstCall, ['Name is too short']);
			sinon.assert.calledWithExactly(stubs.propIsObject.secondCall, ['Name is too short']);
			sinon.assert.calledWithExactly(stubs.propIsObject.thirdCall, 'Name is too short');
			expect(result).to.be.false;

		});

	});

	context('top level errors present', () => {

		it('will return true', () => {

			const propIsObjectStub = sinon.stub().returns(true);
			subject = createSubject({ propIsObject: propIsObjectStub });
			instance = { errors: { name: ['Name is too short'] } };
			const result = subject(instance);
			expect(propIsObjectStub.calledOnce).to.be.true;
			expect(propIsObjectStub.calledWithExactly({ name: ['Name is too short'] })).to.be.true;
			expect(result).to.be.true;

		});

	});

	context('nested errors present', () => {

		it('will return true', () => {

			const propIsObjectStub = sinon.stub();
			propIsObjectStub
				.onFirstCall().returns(true)
				.onSecondCall().returns(true);
			subject = createSubject({ propIsObject: propIsObjectStub });
			instance = { theatre: { errors: { name: ['Name is too short'] } } };
			const result = subject(instance);
			expect(propIsObjectStub.calledTwice).to.be.true;
			sinon.assert.calledWithExactly(propIsObjectStub.firstCall, { errors: { name: ['Name is too short'] } });
			sinon.assert.calledWithExactly(propIsObjectStub.secondCall, { name: ['Name is too short'] });
			expect(result).to.be.true;

		});

	});

	context('errors present in objects in arrays at top level', () => {

		it('will return true', () => {

			const propIsObjectStub = sinon.stub();
			propIsObjectStub
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(true);
			subject = createSubject({ propIsObject: propIsObjectStub });
			instance = { cast: [{ errors: { name: ['Name is too short'] } }] };
			const result = subject(instance);
			expect(propIsObjectStub.calledThrice).to.be.true;
			sinon.assert.calledWithExactly(propIsObjectStub.firstCall, [{ errors: { name: ['Name is too short'] } }]);
			sinon.assert.calledWithExactly(propIsObjectStub.secondCall, { errors: { name: ['Name is too short'] } });
			sinon.assert.calledWithExactly(propIsObjectStub.thirdCall, { name: ['Name is too short'] });
			expect(result).to.be.true;

		});

	});

});

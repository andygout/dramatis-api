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
	proxyquire('../../../server/lib/verify-error-presence', {
		'./is-object': stubOverrides.isObject || stubs.isObject
	});

describe('Verify Error Presence module', () => {

	context('no valid error values present', () => {

		it('will return false if no error values present', () => {

			const isObjectStub = sinon.stub();
			isObjectStub
				.onFirstCall().returns(false)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			subject = createSubject({ isObject: isObjectStub });
			instance = { errors: {}, theatre: { errors: {} } };
			const result = subject(instance);
			expect(isObjectStub.callCount).to.eq(5);
			sinon.assert.calledWithExactly(isObjectStub.firstCall, {});
			sinon.assert.calledWithExactly(isObjectStub.secondCall, {});
			sinon.assert.calledWithExactly(isObjectStub.thirdCall, { errors: {} });
			sinon.assert.calledWithExactly(isObjectStub.getCall(3), {});
			sinon.assert.calledWithExactly(isObjectStub.getCall(4), {});
			expect(result).to.be.false;

		});

		it('will return false if no error properties present', () => {

			instance = { notErrors: {} };
			const result = subject(instance);
			expect(stubs.isObject.calledOnce).to.be.true;
			expect(stubs.isObject.calledWithExactly({})).to.be.true;
			expect(result).to.be.false;

		});

		it('will return false if errors present in form of null value', () => {

			instance = { errors: null };
			const result = subject(instance);
			expect(stubs.isObject.calledTwice).to.be.true;
			sinon.assert.calledWithExactly(stubs.isObject.firstCall, null);
			sinon.assert.calledWithExactly(stubs.isObject.secondCall, null);
			expect(result).to.be.false;

		});

		it('will return false if errors present in form of array', () => {

			instance = { errors: ['Name is too short'] };
			const result = subject(instance);
			expect(stubs.isObject.calledThrice).to.be.true;
			sinon.assert.calledWithExactly(stubs.isObject.firstCall, ['Name is too short']);
			sinon.assert.calledWithExactly(stubs.isObject.secondCall, ['Name is too short']);
			sinon.assert.calledWithExactly(stubs.isObject.thirdCall, 'Name is too short');
			expect(result).to.be.false;

		});

	});

	context('top level errors present', () => {

		it('will return true', () => {

			const isObjectStub = sinon.stub().returns(true);
			subject = createSubject({ isObject: isObjectStub });
			instance = { errors: { name: ['Name is too short'] } };
			const result = subject(instance);
			expect(isObjectStub.calledOnce).to.be.true;
			expect(isObjectStub.calledWithExactly({ name: ['Name is too short'] })).to.be.true;
			expect(result).to.be.true;

		});

	});

	context('nested errors present', () => {

		it('will return true', () => {

			const isObjectStub = sinon.stub();
			isObjectStub
				.onFirstCall().returns(true)
				.onSecondCall().returns(true);
			subject = createSubject({ isObject: isObjectStub });
			instance = { theatre: { errors: { name: ['Name is too short'] } } };
			const result = subject(instance);
			expect(isObjectStub.calledTwice).to.be.true;
			sinon.assert.calledWithExactly(isObjectStub.firstCall, { errors: { name: ['Name is too short'] } });
			sinon.assert.calledWithExactly(isObjectStub.secondCall, { name: ['Name is too short'] });
			expect(result).to.be.true;

		});

	});

	context('errors present in objects in arrays at top level', () => {

		it('will return true', () => {

			const isObjectStub = sinon.stub();
			isObjectStub
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(true);
			subject = createSubject({ isObject: isObjectStub });
			instance = { cast: [{ errors: { name: ['Name is too short'] } }] };
			const result = subject(instance);
			expect(isObjectStub.calledThrice).to.be.true;
			sinon.assert.calledWithExactly(isObjectStub.firstCall, [{ errors: { name: ['Name is too short'] } }]);
			sinon.assert.calledWithExactly(isObjectStub.secondCall, { errors: { name: ['Name is too short'] } });
			sinon.assert.calledWithExactly(isObjectStub.thirdCall, { name: ['Name is too short'] });
			expect(result).to.be.true;

		});

	});

});

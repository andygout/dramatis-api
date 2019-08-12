import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

let stubs;
let subject;
let instance;

beforeEach(() => {

	stubs = {
		uuid: {
			v4: sinon.stub().returns('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
		},
		isObject: sinon.stub().returns(false)
	};

	subject = createSubject();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../server/lib/prepare-as-params', {
		'uuid': stubs.uuid,
		'./is-object': stubOverrides.isObject || stubs.isObject
	});

describe('Prepare As Params module', () => {

	describe('assigning uuids', () => {

		context('top level properties', () => {

			it('will assign value to uuid properties if empty string', () => {

				instance = { uuid: '' };
				const result = subject(instance);
				expect(stubs.isObject.calledOnce).to.be.true;
				expect(stubs.isObject.calledWithExactly('')).to.be.true;
				expect(stubs.uuid.v4.calledOnce).to.be.true;
				expect(result.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will assign value to uuid properties if undefined', () => {

				instance = { uuid: undefined };
				const result = subject(instance);
				expect(stubs.isObject.calledOnce).to.be.true;
				expect(stubs.isObject.calledWithExactly(undefined)).to.be.true;
				expect(stubs.uuid.v4.calledOnce).to.be.true;
				expect(result.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will not assign value to uuid properties if already exists', () => {

				instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' };
				const result = subject(instance);
				expect(stubs.isObject.calledOnce).to.be.true;
				expect(stubs.isObject.calledWithExactly('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy')).to.be.true;
				expect(stubs.uuid.v4.called).to.be.false;
				expect(result.uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

			it('will not assign value to non-uuid properties', () => {

				instance = { foo: '' };
				const result = subject(instance);
				expect(stubs.isObject.calledOnce).to.be.true;
				expect(stubs.isObject.calledWithExactly('')).to.be.true;
				expect(stubs.uuid.v4.called).to.be.false;
				expect(result.foo).to.eq('');

			});

			it('will not add position property', () => {

				instance = { foo: '' };
				const result = subject(instance);
				expect(stubs.isObject.calledOnce).to.be.true;
				expect(stubs.uuid.v4.called).to.be.false;
				expect(result).not.to.have.property('position');

			});

		});

		context('nested level properties', () => {

			it('will assign value to uuid properties if empty string', () => {

				const isObjectStub = sinon.stub();
				isObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
				subject = createSubject({ isObject: isObjectStub });
				instance = { theatre: { uuid: '' } };
				const result = subject(instance);
				expect(isObjectStub.calledTwice).to.be.true;
				sinon.assert.calledWithExactly(isObjectStub.secondCall, '');
				expect(stubs.uuid.v4.calledOnce).to.be.true;
				expect(result.theatre.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will assign value to uuid properties if undefined', () => {

				const isObjectStub = sinon.stub();
				isObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
				subject = createSubject({ isObject: isObjectStub });
				instance = { theatre: { uuid: undefined } };
				const result = subject(instance);
				expect(isObjectStub.calledTwice).to.be.true;
				sinon.assert.calledWithExactly(isObjectStub.secondCall, undefined);
				expect(stubs.uuid.v4.calledOnce).to.be.true;
				expect(result.theatre.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will not assign value to uuid properties if already exists', () => {

				const isObjectStub = sinon.stub();
				isObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
				subject = createSubject({ isObject: isObjectStub });
				instance = { theatre: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' } };
				const result = subject(instance);
				expect(isObjectStub.calledTwice).to.be.true;
				sinon.assert.calledWithExactly(isObjectStub.secondCall, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
				expect(stubs.uuid.v4.called).to.be.false;
				expect(result.theatre.uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

			it('will not assign value to non-uuid properties', () => {

				const isObjectStub = sinon.stub();
				isObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
				subject = createSubject({ isObject: isObjectStub });
				instance = { theatre: { foo: '' } };
				const result = subject(instance);
				expect(isObjectStub.calledTwice).to.be.true;
				sinon.assert.calledWithExactly(isObjectStub.secondCall, '');
				expect(stubs.uuid.v4.called).to.be.false;
				expect(result.theatre.foo).to.eq('');

			});

			it('will not add position property', () => {

				const isObjectStub = sinon.stub();
				isObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
				subject = createSubject({ isObject: isObjectStub });
				instance = { theatre: { uuid: '' } };
				const result = subject(instance);
				expect(isObjectStub.calledTwice).to.be.true;
				expect(stubs.uuid.v4.calledOnce).to.be.true;
				expect(result.theatre).not.to.have.property('position');

			});

		});

		context('properties in arrays at top level', () => {

			it('will assign value to uuid properties if empty string', () => {

				const isObjectStub = sinon.stub();
				isObjectStub
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false);
				subject = createSubject({ isObject: isObjectStub });
				instance = { cast: [{ uuid: '' }] };
				const result = subject(instance);
				expect(isObjectStub.callCount).to.eq(4);
				sinon.assert.calledWithExactly(isObjectStub.thirdCall, '');
				expect(stubs.uuid.v4.calledOnce).to.be.true;
				expect(result.cast[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will assign value to uuid properties if undefined', () => {

				const isObjectStub = sinon.stub();
				isObjectStub
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false);
				subject = createSubject({ isObject: isObjectStub });
				instance = { cast: [{ uuid: undefined }] };
				const result = subject(instance);
				expect(isObjectStub.callCount).to.eq(4);
				sinon.assert.calledWithExactly(isObjectStub.thirdCall, undefined);
				expect(stubs.uuid.v4.calledOnce).to.be.true;
				expect(result.cast[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will not assign value to uuid properties if already exists', () => {

				const isObjectStub = sinon.stub();
				isObjectStub
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false);
				subject = createSubject({ isObject: isObjectStub });
				instance = { cast: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] };
				const result = subject(instance);
				expect(isObjectStub.callCount).to.eq(4);
				sinon.assert.calledWithExactly(isObjectStub.thirdCall, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
				expect(stubs.uuid.v4.called).to.be.false;
				expect(result.cast[0].uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

			it('will not assign value to non-uuid properties', () => {

				const isObjectStub = sinon.stub();
				isObjectStub
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false);
				subject = createSubject({ isObject: isObjectStub });
				instance = { cast: [{ foo: '' }] }
				const result = subject(instance);
				expect(isObjectStub.callCount).to.eq(4);
				sinon.assert.calledWithExactly(isObjectStub.thirdCall, '');
				expect(stubs.uuid.v4.called).to.be.false;
				expect(result.cast[0].foo).to.eq('');

			});

			it('will add position property with value of array index', () => {

				const isObjectStub = sinon.stub();
				isObjectStub
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false);
				subject = createSubject({ isObject: isObjectStub });
				instance = { cast: [{ uuid: '' }] };
				const result = subject(instance);
				expect(isObjectStub.callCount).to.eq(4);
				sinon.assert.calledWithExactly(isObjectStub.lastCall, 0);
				expect(stubs.uuid.v4.calledOnce).to.be.true;
				expect(result.cast[0].position).to.eq(0);

			});

		});

	});

});

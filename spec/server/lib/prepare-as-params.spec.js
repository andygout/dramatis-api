const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const sandbox = sinon.sandbox.create();

let stubs;
let subject;
let instance;

beforeEach(() => {

	stubs = {
		uuid: {
			v4: sandbox.stub().returns('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
		},
		propIsObject: sandbox.stub().returns(false)
	};

	subject = createSubject();

});

afterEach(() => {

	sandbox.restore();

});

const createSubject = (stubOverrides = {}) =>
	proxyquire('../../../dist/lib/prepare-as-params', {
		'uuid': stubs.uuid,
		'./prop-is-object': stubOverrides.propIsObject || stubs.propIsObject
	});

describe('Prepare As Params module', () => {

	describe('assigning uuids', () => {

		context('top level properties', () => {

			it('will assign value to uuid properties if empty string', () => {

				instance = { uuid: '' };
				subject(instance);
				expect(stubs.propIsObject.calledOnce).to.be.true;
				expect(stubs.propIsObject.calledWithExactly('')).to.be.true;
				expect(instance.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will assign value to uuid properties if undefined', () => {

				instance = { uuid: undefined };
				subject(instance);
				expect(stubs.propIsObject.calledOnce).to.be.true;
				expect(stubs.propIsObject.calledWithExactly(undefined)).to.be.true;
				expect(instance.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will not assign value to uuid properties if already exists', () => {

				instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' };
				subject(instance);
				expect(stubs.propIsObject.calledOnce).to.be.true;
				expect(stubs.propIsObject.calledWithExactly('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy')).to.be.true;
				expect(instance.uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

			it('will not assign value to non-uuid properties', () => {

				instance = { foo: '' };
				subject(instance);
				expect(stubs.propIsObject.calledOnce).to.be.true;
				expect(stubs.propIsObject.calledWithExactly('')).to.be.true;
				expect(instance.foo).to.eq('');

			});

			it('will not add position property', () => {

				instance = { foo: '' };
				subject(instance);
				expect(stubs.propIsObject.calledOnce).to.be.true;
				expect(instance).not.to.have.property('position');

			});

		});

		context('nested level properties', () => {

			it('will assign value to uuid properties if empty string', () => {

				const propIsObjectStub = sinon.stub();
				propIsObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
				subject = createSubject({ propIsObject: propIsObjectStub });
				instance = { theatre: { uuid: '' } };
				subject(instance);
				expect(propIsObjectStub.calledTwice).to.be.true;
				sinon.assert.calledWithExactly(propIsObjectStub.secondCall, '');
				expect(instance.theatre.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will assign value to uuid properties if undefined', () => {

				const propIsObjectStub = sinon.stub();
				propIsObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
				subject = createSubject({ propIsObject: propIsObjectStub });
				instance = { theatre: { uuid: undefined } };
				subject(instance);
				expect(propIsObjectStub.calledTwice).to.be.true;
				sinon.assert.calledWithExactly(propIsObjectStub.secondCall, undefined);
				expect(instance.theatre.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will not assign value to uuid properties if already exists', () => {

				const propIsObjectStub = sinon.stub();
				propIsObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
				subject = createSubject({ propIsObject: propIsObjectStub });
				instance = { theatre: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' } };
				subject(instance);
				expect(propIsObjectStub.calledTwice).to.be.true;
				sinon.assert.calledWithExactly(propIsObjectStub.secondCall, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
				expect(instance.theatre.uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

			it('will not assign value to non-uuid properties', () => {

				const propIsObjectStub = sinon.stub();
				propIsObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
				subject = createSubject({ propIsObject: propIsObjectStub });
				instance = { theatre: { foo: '' } };
				subject(instance);
				expect(propIsObjectStub.calledTwice).to.be.true;
				sinon.assert.calledWithExactly(propIsObjectStub.secondCall, '');
				expect(instance.theatre.foo).to.eq('');

			});

			it('will not add position property', () => {

				const propIsObjectStub = sinon.stub();
				propIsObjectStub.onFirstCall().returns(true).onSecondCall().returns(false);
				subject = createSubject({ propIsObject: propIsObjectStub });
				instance = { theatre: { uuid: '' } };
				subject(instance);
				expect(propIsObjectStub.calledTwice).to.be.true;
				expect(instance.theatre).not.to.have.property('position');

			});

		});

		context('properties in arrays at top level', () => {

			it('will assign value to uuid properties if empty string', () => {

				const propIsObjectStub = sinon.stub();
				propIsObjectStub
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false);
				subject = createSubject({ propIsObject: propIsObjectStub });
				instance = { cast: [{ uuid: '' }] };
				subject(instance);
				expect(propIsObjectStub.callCount).to.eq(4);
				sinon.assert.calledWithExactly(propIsObjectStub.thirdCall, '');
				expect(instance.cast[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will assign value to uuid properties if undefined', () => {

				const propIsObjectStub = sinon.stub();
				propIsObjectStub
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false);
				subject = createSubject({ propIsObject: propIsObjectStub });
				instance = { cast: [{ uuid: undefined }] };
				subject(instance);
				expect(propIsObjectStub.callCount).to.eq(4);
				sinon.assert.calledWithExactly(propIsObjectStub.thirdCall, undefined);
				expect(instance.cast[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

			});

			it('will not assign value to uuid properties if already exists', () => {

				const propIsObjectStub = sinon.stub();
				propIsObjectStub
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false);
				subject = createSubject({ propIsObject: propIsObjectStub });
				instance = { cast: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] };
				subject(instance);
				expect(propIsObjectStub.callCount).to.eq(4);
				sinon.assert.calledWithExactly(propIsObjectStub.thirdCall, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
				expect(instance.cast[0].uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

			});

			it('will not assign value to non-uuid properties', () => {

				const propIsObjectStub = sinon.stub();
				propIsObjectStub
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false);
				subject = createSubject({ propIsObject: propIsObjectStub });
				instance = { cast: [{ foo: '' }] }
				subject(instance);
				expect(propIsObjectStub.callCount).to.eq(4);
				sinon.assert.calledWithExactly(propIsObjectStub.thirdCall, '');
				expect(instance.cast[0].foo).to.eq('');

			});

			it('will add position property with value of array index', () => {

				const propIsObjectStub = sinon.stub();
				propIsObjectStub
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false);
				subject = createSubject({ propIsObject: propIsObjectStub });
				instance = { cast: [{ uuid: '' }] };
				subject(instance);
				expect(propIsObjectStub.callCount).to.eq(4);
				sinon.assert.calledWithExactly(propIsObjectStub.lastCall, 0);
				expect(instance.cast[0].position).to.eq(0);

			});

		});

	});

});

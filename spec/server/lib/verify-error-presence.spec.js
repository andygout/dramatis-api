import { expect } from 'chai';
import { assert, createSandbox } from 'sinon';

import * as isObjectModule from '../../../server/lib/is-object';
import { verifyErrorPresence } from '../../../server/lib/verify-error-presence';

describe('Verify Error Presence module', () => {

	let stubs;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			isObject: sandbox.stub(isObjectModule, 'isObject')
		};

	});

	afterEach(() => {

		sandbox.restore();

	});

	context('no valid error values present', () => {

		it('returns false if no error values present', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { errors: {}, theatre: { errors: {} } };
			const result = verifyErrorPresence(instance);
			expect(stubs.isObject.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObject.firstCall, {});
			assert.calledWithExactly(stubs.isObject.secondCall, {});
			assert.calledWithExactly(stubs.isObject.thirdCall, { errors: {} });
			assert.calledWithExactly(stubs.isObject.getCall(3), {});
			assert.calledWithExactly(stubs.isObject.getCall(4), {});
			expect(result).to.be.false;

		});

		it('returns false if no error properties present', () => {

			const instance = { notErrors: {} };
			const result = verifyErrorPresence(instance);
			expect(stubs.isObject.calledOnce).to.be.true;
			expect(stubs.isObject.calledWithExactly({})).to.be.true;
			expect(result).to.be.false;

		});

		it('returns false if errors present in form of null value', () => {

			const instance = { errors: null };
			const result = verifyErrorPresence(instance);
			expect(stubs.isObject.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObject.firstCall, null);
			assert.calledWithExactly(stubs.isObject.secondCall, null);
			expect(result).to.be.false;

		});

		it('returns false if errors present in form of array', () => {

			const instance = { errors: ['Name is too short'] };
			const result = verifyErrorPresence(instance);
			expect(stubs.isObject.calledThrice).to.be.true;
			assert.calledWithExactly(stubs.isObject.firstCall, ['Name is too short']);
			assert.calledWithExactly(stubs.isObject.secondCall, ['Name is too short']);
			assert.calledWithExactly(stubs.isObject.thirdCall, 'Name is too short');
			expect(result).to.be.false;

		});

	});

	context('top level errors present', () => {

		it('returns true', () => {

			stubs.isObject.returns(true);
			const instance = { errors: { name: ['Name is too short'] } };
			const result = verifyErrorPresence(instance);
			expect(stubs.isObject.calledOnce).to.be.true;
			expect(stubs.isObject.calledWithExactly({ name: ['Name is too short'] })).to.be.true;
			expect(result).to.be.true;

		});

	});

	context('nested errors present', () => {

		it('returns true', () => {

			stubs.isObject
				.onFirstCall().returns(true)
				.onSecondCall().returns(true);
			const instance = { theatre: { errors: { name: ['Name is too short'] } } };
			const result = verifyErrorPresence(instance);
			expect(stubs.isObject.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObject.firstCall, { errors: { name: ['Name is too short'] } });
			assert.calledWithExactly(stubs.isObject.secondCall, { name: ['Name is too short'] });
			expect(result).to.be.true;

		});

	});

	context('errors present in objects in arrays at top level', () => {

		it('returns true', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(true);
			const instance = { cast: [{ errors: { name: ['Name is too short'] } }] };
			const result = verifyErrorPresence(instance);
			expect(stubs.isObject.calledThrice).to.be.true;
			assert.calledWithExactly(stubs.isObject.firstCall, [{ errors: { name: ['Name is too short'] } }]);
			assert.calledWithExactly(stubs.isObject.secondCall, { errors: { name: ['Name is too short'] } });
			assert.calledWithExactly(stubs.isObject.thirdCall, { name: ['Name is too short'] });
			expect(result).to.be.true;

		});

	});

});

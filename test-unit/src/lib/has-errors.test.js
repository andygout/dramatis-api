import { expect } from 'chai';
import { assert, createSandbox } from 'sinon';

import { hasErrors } from '../../../src/lib/has-errors';
import * as isObjectWithKeysModule from '../../../src/lib/is-object-with-keys';

describe('Has Errors module', () => {

	let stubs;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			isObjectWithKeys: sandbox.stub(isObjectWithKeysModule, 'isObjectWithKeys')
		};

	});

	afterEach(() => {

		sandbox.restore();

	});

	context('no valid error values present', () => {

		it('returns false if no error values present', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { errors: {}, theatre: { errors: {} } };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(5);
			assert.calledWithExactly(stubs.isObjectWithKeys.firstCall, {});
			assert.calledWithExactly(stubs.isObjectWithKeys.secondCall, {});
			assert.calledWithExactly(stubs.isObjectWithKeys.thirdCall, { errors: {} });
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(3), {});
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(4), {});
			expect(result).to.be.false;

		});

		it('returns false if no error properties present', () => {

			const instance = { notErrors: {} };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly({})).to.be.true;
			expect(result).to.be.false;

		});

		it('returns false if errors present in form of null value', () => {

			const instance = { errors: null };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObjectWithKeys.firstCall, null);
			assert.calledWithExactly(stubs.isObjectWithKeys.secondCall, null);
			expect(result).to.be.false;

		});

		it('returns false if errors present in form of array', () => {

			const instance = { errors: ['Name is too short'] };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.calledThrice).to.be.true;
			assert.calledWithExactly(stubs.isObjectWithKeys.firstCall, ['Name is too short']);
			assert.calledWithExactly(stubs.isObjectWithKeys.secondCall, ['Name is too short']);
			assert.calledWithExactly(stubs.isObjectWithKeys.thirdCall, 'Name is too short');
			expect(result).to.be.false;

		});

	});

	context('top level errors present', () => {

		it('returns true', () => {

			stubs.isObjectWithKeys.returns(true);
			const instance = { errors: { name: ['Name is too short'] } };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly({ name: ['Name is too short'] })).to.be.true;
			expect(result).to.be.true;

		});

	});

	context('nested errors present', () => {

		it('returns true', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(true);
			const instance = { theatre: { errors: { name: ['Name is too short'] } } };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObjectWithKeys.firstCall, { errors: { name: ['Name is too short'] } });
			assert.calledWithExactly(stubs.isObjectWithKeys.secondCall, { name: ['Name is too short'] });
			expect(result).to.be.true;

		});

	});

	context('errors present in objects in arrays at top level', () => {

		it('returns true', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(true);
			const instance = { cast: [{ errors: { name: ['Name is too short'] } }] };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.calledThrice).to.be.true;
			assert.calledWithExactly(stubs.isObjectWithKeys.firstCall, [{ errors: { name: ['Name is too short'] } }]);
			assert.calledWithExactly(stubs.isObjectWithKeys.secondCall, { errors: { name: ['Name is too short'] } });
			assert.calledWithExactly(stubs.isObjectWithKeys.thirdCall, { name: ['Name is too short'] });
			expect(result).to.be.true;

		});

	});

});

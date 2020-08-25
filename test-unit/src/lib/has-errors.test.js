import { expect } from 'chai';
import { createSandbox } from 'sinon';

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
			expect(stubs.isObjectWithKeys.firstCall.calledWithExactly({})).to.be.true;
			expect(stubs.isObjectWithKeys.secondCall.calledWithExactly({})).to.be.true;
			expect(stubs.isObjectWithKeys.thirdCall.calledWithExactly({ errors: {} })).to.be.true;
			expect(stubs.isObjectWithKeys.getCall(3).calledWithExactly({})).to.be.true;
			expect(stubs.isObjectWithKeys.getCall(4).calledWithExactly({})).to.be.true;
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
			expect(stubs.isObjectWithKeys.firstCall.calledWithExactly(null)).to.be.true;
			expect(stubs.isObjectWithKeys.secondCall.calledWithExactly(null)).to.be.true;
			expect(result).to.be.false;

		});

		it('returns false if errors present in form of array', () => {

			const instance = { errors: ['Value is too short'] };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.calledThrice).to.be.true;
			expect(stubs.isObjectWithKeys.firstCall.calledWithExactly(['Value is too short'])).to.be.true;
			expect(stubs.isObjectWithKeys.secondCall.calledWithExactly(['Value is too short'])).to.be.true;
			expect(stubs.isObjectWithKeys.thirdCall.calledWithExactly('Value is too short')).to.be.true;
			expect(result).to.be.false;

		});

	});

	context('top level errors present', () => {

		it('returns true', () => {

			stubs.isObjectWithKeys.returns(true);
			const instance = { errors: { name: ['Value is too short'] } };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly({ name: ['Value is too short'] })).to.be.true;
			expect(result).to.be.true;

		});

	});

	context('nested errors present', () => {

		it('returns true', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(true);
			const instance = { theatre: { errors: { name: ['Value is too short'] } } };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			expect(stubs.isObjectWithKeys.firstCall.calledWithExactly(
				{ errors: { name: ['Value is too short'] } }
			)).to.be.true;
			expect(stubs.isObjectWithKeys.secondCall.calledWithExactly(
				{ name: ['Value is too short'] }
			)).to.be.true;
			expect(result).to.be.true;

		});

	});

	context('errors present in objects in arrays at top level', () => {

		it('returns true', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(true);
			const instance = { cast: [{ errors: { name: ['Value is too short'] } }] };
			const result = hasErrors(instance);
			expect(stubs.isObjectWithKeys.calledThrice).to.be.true;
			expect(stubs.isObjectWithKeys.firstCall.calledWithExactly(
				[{ errors: { name: ['Value is too short'] } }]
			)).to.be.true;
			expect(stubs.isObjectWithKeys.secondCall.calledWithExactly(
				{ errors: { name: ['Value is too short'] } }
			)).to.be.true;
			expect(stubs.isObjectWithKeys.thirdCall.calledWithExactly({ name: ['Value is too short'] })).to.be.true;
			expect(result).to.be.true;

		});

	});

});

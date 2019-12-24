import { expect } from 'chai';
import { assert, createSandbox } from 'sinon';
import { v4 as uuid } from 'uuid';

import * as isObjectModule from '../../../server/lib/is-object';
import { prepareAsParams } from '../../../server/lib/prepare-as-params';

describe('Prepare As Params module', () => {

	let stubs;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			uuid: sandbox.stub(uuid, 'v4').returns('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'),
			isObject: sandbox.stub(isObjectModule, 'isObject').returns(false)
		};

	});

	afterEach(() => {

		sandbox.restore();

	});

	it('returns new object with modifications but will not mutate input object', () => {

		const instance = { uuid: '' };
		const result = prepareAsParams(instance);
		expect(result.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		expect(instance.uuid).to.eq('');

	});

	context('top level properties', () => {

		it('assigns value to uuid property if empty string', () => {

			const instance = { uuid: '' };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.calledOnce).to.be.true;
			expect(stubs.isObject.calledWithExactly('')).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { uuid: undefined };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.calledOnce).to.be.true;
			expect(stubs.isObject.calledWithExactly(undefined)).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.calledOnce).to.be.true;
			expect(stubs.isObject.calledWithExactly('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(result.uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will not assign value to non-uuid properties', () => {

			const instance = { foo: '' };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.calledOnce).to.be.true;
			expect(stubs.isObject.calledWithExactly('')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(result.foo).to.eq('');

		});

		it('will not add position property', () => {

			const instance = { foo: '' };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.calledOnce).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(result).not.to.have.property('position');

		});

	});

	context('nested level properties', () => {

		it('assigns value to uuid property if empty string', () => {

			stubs.isObject.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { uuid: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObject.secondCall, '');
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.theatre.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObject.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { uuid: undefined } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObject.secondCall, undefined);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.theatre.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObject.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObject.secondCall, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			expect(stubs.uuid.called).to.be.false;
			expect(result.theatre.uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will not assign value to non-uuid properties', () => {

			stubs.isObject.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { foo: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObject.secondCall, '');
			expect(stubs.uuid.called).to.be.false;
			expect(result.theatre.foo).to.eq('');

		});

		it('will not add position property', () => {

			stubs.isObject.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { uuid: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.calledTwice).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.theatre).not.to.have.property('position');

		});

	});

	context('properties in arrays at top level', () => {

		it('assigns value to uuid property if empty string', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ uuid: '' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObject.thirdCall, '');
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.cast[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ uuid: undefined }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObject.thirdCall, undefined);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.cast[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObject.thirdCall, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			expect(stubs.uuid.called).to.be.false;
			expect(result.cast[0].uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will not assign value to non-uuid properties', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ foo: '' }] }
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObject.thirdCall, '');
			expect(stubs.uuid.called).to.be.false;
			expect(result.cast[0].foo).to.eq('');

		});

		it('adds position property with value of array index', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ uuid: '' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObject.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.cast[0].position).to.eq(0);

		});

		it('filters out objects in array that have a name attribute which is an empty string', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { cast: [{ uuid: '', name: '' }, { uuid: '', name: 'Ian McKellen' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObject.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.cast.length).to.eq(1);
			expect(result.cast[0].name).to.eq('Ian McKellen');
			expect(result.cast[0].position).to.eq(0);

		});

	});

	context('properties in arrays at nested level (nested in object)', () => {

		it('assigns value to uuid property if empty string', () => {

			stubs.isObject
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ uuid: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObject.getCall(3), '');
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.playtext.characters[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObject
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ uuid: undefined }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObject.getCall(3), undefined);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.playtext.characters[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObject
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObject.getCall(3), 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			expect(stubs.uuid.called).to.be.false;
			expect(result.playtext.characters[0].uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will not assign value to non-uuid properties', () => {

			stubs.isObject
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ foo: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObject.getCall(3), '');
			expect(stubs.uuid.called).to.be.false;
			expect(result.playtext.characters[0].foo).to.eq('');

		});

		it('adds position property with value of array index', () => {

			stubs.isObject
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ uuid: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObject.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.playtext.characters[0].position).to.eq(0);

		});

		it('filters out objects in array that have a name attribute which is an empty string', () => {

			stubs.isObject
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false)
				.onCall(5).returns(false);
			const instance = { playtext: { characters: [{ uuid: '', name: '' }, { uuid: '', name: 'Laertes' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(6);
			assert.calledWithExactly(stubs.isObject.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.playtext.characters.length).to.eq(1);
			expect(result.playtext.characters[0].name).to.eq('Laertes');
			expect(result.playtext.characters[0].position).to.eq(0);

		});

	});

	context('properties in arrays at nested level (nested in array)', () => {

		it('assigns value to uuid property if empty string', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ uuid: '' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObject.getCall(4), '');
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ uuid: undefined }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObject.getCall(4), undefined);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObject.getCall(4), 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			expect(stubs.uuid.called).to.be.false;
			expect(result.cast[0].roles[0].uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will not assign value to non-uuid properties', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ foo: '' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObject.getCall(4), '');
			expect(stubs.uuid.called).to.be.false;
			expect(result.cast[0].roles[0].foo).to.eq('');

		});

		it('adds position property with value of array index', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ uuid: '' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObject.getCall(5), 0);
			assert.calledWithExactly(stubs.isObject.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.cast[0].position).to.eq(0);
			expect(result.cast[0].roles[0].position).to.eq(0);

		});

		it('filters out objects in array that have a name attribute which is an empty string', () => {

			stubs.isObject
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false)
				.onCall(7).returns(false);
			const instance = { cast: [{ roles: [{ uuid: '', name: '' }, { uuid: '', name: 'Laertes' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObject.callCount).to.eq(8);
			assert.calledWithExactly(stubs.isObject.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(result.cast[0].roles.length).to.eq(1);
			expect(result.cast[0].roles[0].name).to.eq('Laertes');
			expect(result.cast[0].roles[0].position).to.eq(0);

		});

	});

});

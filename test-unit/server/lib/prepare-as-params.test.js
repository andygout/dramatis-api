import { expect } from 'chai';
import { assert, createSandbox } from 'sinon';
import neo4j from 'neo4j-driver';
import { v4 as uuid } from 'uuid';

import * as isObjectWithKeysModule from '../../../server/lib/is-object-with-keys';
import { prepareAsParams } from '../../../server/lib/prepare-as-params';

describe('Prepare As Params module', () => {

	let stubs;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			neo4jInt: sandbox.stub(neo4j, 'int').returnsArg(0),
			uuid: sandbox.stub(uuid, 'v4').returns('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'),
			isObjectWithKeys: sandbox.stub(isObjectWithKeysModule, 'isObjectWithKeys').returns(false)
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
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly('')).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { uuid: undefined };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly(undefined)).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { foo: 'bar' };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly('bar')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.foo).to.eq('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { foo: '' };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly('')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.foo).to.eq(null);

		});

		it('will not add position property', () => {

			const instance = { foo: '' };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result).not.to.have.property('position');

		});

	});

	context('nested level properties', () => {

		it('assigns value to uuid property if empty string', () => {

			stubs.isObjectWithKeys.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { uuid: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObjectWithKeys.secondCall, '');
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObjectWithKeys.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { uuid: undefined } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObjectWithKeys.secondCall, undefined);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre.uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObjectWithKeys.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObjectWithKeys.secondCall, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre.uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			stubs.isObjectWithKeys.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { foo: 'bar' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObjectWithKeys.secondCall, 'bar');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre.foo).to.eq('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			stubs.isObjectWithKeys.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { foo: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			assert.calledWithExactly(stubs.isObjectWithKeys.secondCall, '');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre.foo).to.eq(null);

		});

		it('will not add position property', () => {

			stubs.isObjectWithKeys.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { uuid: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre).not.to.have.property('position');

		});

	});

	context('properties in arrays at top level', () => {

		it('assigns value to uuid property if empty string', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ uuid: '' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObjectWithKeys.thirdCall, '');
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.cast[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ uuid: undefined }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObjectWithKeys.thirdCall, undefined);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.cast[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObjectWithKeys.thirdCall, 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.cast[0].uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ foo: 'bar' }] }
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObjectWithKeys.thirdCall, 'bar');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.cast[0].foo).to.eq('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ foo: '' }] }
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObjectWithKeys.thirdCall, '');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.cast[0].foo).to.eq(null);

		});

		it('adds position property with value of array index', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ uuid: '' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(4);
			assert.calledWithExactly(stubs.isObjectWithKeys.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.cast[0].position).to.eq(0);

		});

		it('filters out objects in array that have a name attribute which is an empty string', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { cast: [{ uuid: '', name: '' }, { uuid: '', name: 'Ian McKellen' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObjectWithKeys.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.cast.length).to.eq(1);
			expect(result.cast[0].name).to.eq('Ian McKellen');
			expect(result.cast[0].position).to.eq(0);

		});

	});

	context('properties in arrays at nested level (nested in object)', () => {

		it('assigns value to uuid property if empty string', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ uuid: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(3), '');
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.playtext.characters[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ uuid: undefined }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(3), undefined);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.playtext.characters[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(3), 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.playtext.characters[0].uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ foo: 'bar' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(3), 'bar');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.playtext.characters[0].foo).to.eq('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ foo: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(3), '');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.playtext.characters[0].foo).to.eq(null);

		});

		it('adds position property with value of array index', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ uuid: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(5);
			assert.calledWithExactly(stubs.isObjectWithKeys.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.playtext.characters[0].position).to.eq(0);

		});

		it('filters out objects in array that have a name attribute which is an empty string', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false)
				.onCall(5).returns(false);
			const instance = { playtext: { characters: [{ uuid: '', name: '' }, { uuid: '', name: 'Laertes' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(6);
			assert.calledWithExactly(stubs.isObjectWithKeys.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledWith(0)).to.be.true;
			expect(result.playtext.characters.length).to.eq(1);
			expect(result.playtext.characters[0].name).to.eq('Laertes');
			expect(result.playtext.characters[0].position).to.eq(0);

		});

	});

	context('properties in arrays at nested level (nested in array)', () => {

		it('assigns value to uuid property if empty string', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ uuid: '' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(4), '');
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledTwice).to.be.true;
			expect((stubs.neo4jInt.getCall(0)).calledWith(0)).to.be.true;
			expect((stubs.neo4jInt.getCall(1)).calledWith(0)).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ uuid: undefined }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(4), undefined);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledTwice).to.be.true;
			expect((stubs.neo4jInt.getCall(0)).calledWith(0)).to.be.true;
			expect((stubs.neo4jInt.getCall(1)).calledWith(0)).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.eq('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(4), 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.calledTwice).to.be.true;
			expect((stubs.neo4jInt.getCall(0)).calledWith(0)).to.be.true;
			expect((stubs.neo4jInt.getCall(1)).calledWith(0)).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.eq('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ foo: 'bar' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(4), 'bar');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.calledTwice).to.be.true;
			expect((stubs.neo4jInt.getCall(0)).calledWith(0)).to.be.true;
			expect((stubs.neo4jInt.getCall(1)).calledWith(0)).to.be.true;
			expect(result.cast[0].roles[0].foo).to.eq('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ foo: '' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(4), '');
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.calledTwice).to.be.true;
			expect((stubs.neo4jInt.getCall(0)).calledWith(0)).to.be.true;
			expect((stubs.neo4jInt.getCall(1)).calledWith(0)).to.be.true;
			expect(result.cast[0].roles[0].foo).to.eq(null);

		});

		it('adds position property with value of array index', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false)
				.onCall(6).returns(false);
			const instance = { cast: [{ roles: [{ uuid: '' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.eq(7);
			assert.calledWithExactly(stubs.isObjectWithKeys.getCall(5), 0);
			assert.calledWithExactly(stubs.isObjectWithKeys.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledTwice).to.be.true;
			expect((stubs.neo4jInt.getCall(0)).calledWith(0)).to.be.true;
			expect((stubs.neo4jInt.getCall(1)).calledWith(0)).to.be.true;
			expect(result.cast[0].position).to.eq(0);
			expect(result.cast[0].roles[0].position).to.eq(0);

		});

		it('filters out objects in array that have a name attribute which is an empty string', () => {

			stubs.isObjectWithKeys
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
			expect(stubs.isObjectWithKeys.callCount).to.eq(8);
			assert.calledWithExactly(stubs.isObjectWithKeys.lastCall, 0);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.calledTwice).to.be.true;
			expect((stubs.neo4jInt.getCall(0)).calledWith(0)).to.be.true;
			expect((stubs.neo4jInt.getCall(1)).calledWith(0)).to.be.true;
			expect(result.cast[0].roles.length).to.eq(1);
			expect(result.cast[0].roles[0].name).to.eq('Laertes');
			expect(result.cast[0].roles[0].position).to.eq(0);

		});

	});

});

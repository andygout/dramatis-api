import { expect } from 'chai';
import { createSandbox } from 'sinon';
import neo4j from 'neo4j-driver';
import { v4 as uuid } from 'uuid';

import * as isObjectWithKeysModule from '../../../src/lib/is-object-with-keys';
import { prepareAsParams } from '../../../src/lib/prepare-as-params';

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
		expect(result.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		expect(instance.uuid).to.equal('');

	});

	context('top level properties', () => {

		it('assigns value to uuid property if empty string', () => {

			const instance = { uuid: '' };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly('')).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { uuid: undefined };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly(undefined)).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { foo: 'bar' };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly('bar')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { foo: '' };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledOnce).to.be.true;
			expect(stubs.isObjectWithKeys.calledWithExactly('')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.foo).to.equal(null);

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
			expect(stubs.isObjectWithKeys.secondCall.calledWithExactly('')).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObjectWithKeys.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { uuid: undefined } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			expect(stubs.isObjectWithKeys.secondCall.calledWithExactly(undefined)).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObjectWithKeys.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			expect(stubs.isObjectWithKeys.secondCall.calledWithExactly(
				'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
			)).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			stubs.isObjectWithKeys.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { foo: 'bar' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			expect(stubs.isObjectWithKeys.secondCall.calledWithExactly('bar')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre.foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			stubs.isObjectWithKeys.onFirstCall().returns(true).onSecondCall().returns(false);
			const instance = { theatre: { foo: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.calledTwice).to.be.true;
			expect(stubs.isObjectWithKeys.secondCall.calledWithExactly('')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.called).to.be.false;
			expect(result.theatre.foo).to.equal(null);

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
				.onThirdCall().returns(false);
			const instance = { cast: [{ uuid: '' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(3);
			expect(stubs.isObjectWithKeys.thirdCall.calledWithExactly('')).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false);
			const instance = { cast: [{ uuid: undefined }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(3);
			expect(stubs.isObjectWithKeys.thirdCall.calledWithExactly(undefined)).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false);
			const instance = { cast: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(3);
			expect(stubs.isObjectWithKeys.thirdCall.calledWithExactly(
				'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
			)).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false);
			const instance = { cast: [{ foo: 'bar' }] }
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(3);
			expect(stubs.isObjectWithKeys.thirdCall.calledWithExactly('bar')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false);
			const instance = { cast: [{ foo: '' }] }
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(3);
			expect(stubs.isObjectWithKeys.thirdCall.calledWithExactly('')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('does not add a position property', () => {

				stubs.isObjectWithKeys
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false);
				const instance = { cast: [{ uuid: '' }] };
				const result = prepareAsParams(instance);
				expect(stubs.isObjectWithKeys.callCount).to.equal(3);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.cast[0]).to.not.have.property('position');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', () => {

				stubs.isObjectWithKeys
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(false)
					.onCall(4).returns(true)
					.onCall(5).returns(false)
					.onCall(6).returns(false);
				const instance = { cast: [{ uuid: '' }, { uuid: '' }] };
				const result = prepareAsParams(instance);
				expect(stubs.isObjectWithKeys.callCount).to.equal(7);
				expect(stubs.isObjectWithKeys.lastCall.calledWithExactly(1)).to.be.true;
				expect(stubs.uuid.calledTwice).to.be.true;
				expect(stubs.neo4jInt.calledTwice).to.be.true;
				expect((stubs.neo4jInt.getCall(0)).calledWithExactly(0)).to.be.true;
				expect((stubs.neo4jInt.getCall(1)).calledWithExactly(1)).to.be.true;
				expect(result.cast[0]).to.have.property('position');
				expect(result.cast[0].position).to.equal(0);
				expect(result.cast[1]).to.have.property('position');
				expect(result.cast[1].position).to.equal(1);

			});

		});

		it('filters out objects in array that have a name attribute which is an empty string', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(false);
			const instance = { cast: [{ uuid: '', name: '' }, { uuid: '', name: 'Ian McKellen' }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(4);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast.length).to.equal(1);
			expect(result.cast[0].name).to.equal('Ian McKellen');
			expect(result.cast[0]).to.not.have.property('position');

		});

	});

	context('properties in arrays at nested level (nested in object)', () => {

		it('assigns value to uuid property if empty string', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false);
			const instance = { playtext: { characters: [{ uuid: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(4);
			expect(stubs.isObjectWithKeys.getCall(3).calledWithExactly('')).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false);
			const instance = { playtext: { characters: [{ uuid: undefined }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(4);
			expect(stubs.isObjectWithKeys.getCall(3).calledWithExactly(undefined)).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false);
			const instance = { playtext: { characters: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(4);
			expect(stubs.isObjectWithKeys.getCall(3).calledWithExactly(
				'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
			)).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false);
			const instance = { playtext: { characters: [{ foo: 'bar' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(4);
			expect(stubs.isObjectWithKeys.getCall(3).calledWithExactly('bar')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false);
			const instance = { playtext: { characters: [{ foo: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(4);
			expect(stubs.isObjectWithKeys.getCall(3).calledWithExactly('')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('does not add a position property', () => {

				stubs.isObjectWithKeys
					.onFirstCall().returns(true)
					.onSecondCall().returns(false)
					.onThirdCall().returns(true)
					.onCall(3).returns(false);
				const instance = { playtext: { characters: [{ uuid: '' }] } };
				const result = prepareAsParams(instance);
				expect(stubs.isObjectWithKeys.callCount).to.equal(4);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.playtext.characters[0]).to.not.have.property('position');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', () => {

				stubs.isObjectWithKeys
					.onFirstCall().returns(true)
					.onSecondCall().returns(false)
					.onThirdCall().returns(true)
					.onCall(3).returns(false)
					.onCall(4).returns(false)
					.onCall(5).returns(true)
					.onCall(6).returns(false)
					.onCall(7).returns(false);
				const instance = { playtext: { characters: [{ uuid: '' }, { uuid: '' }] } };
				const result = prepareAsParams(instance);
				expect(stubs.isObjectWithKeys.callCount).to.equal(8);
				expect(stubs.isObjectWithKeys.lastCall.calledWithExactly(1)).to.be.true;
				expect(stubs.uuid.calledTwice).to.be.true;
				expect(stubs.neo4jInt.calledTwice).to.be.true;
				expect((stubs.neo4jInt.getCall(0)).calledWithExactly(0)).to.be.true;
				expect((stubs.neo4jInt.getCall(1)).calledWithExactly(1)).to.be.true;
				expect(result.playtext.characters[0]).to.have.property('position');
				expect(result.playtext.characters[0].position).to.equal(0);
				expect(result.playtext.characters[1]).to.have.property('position');
				expect(result.playtext.characters[1].position).to.equal(1);

			});

		});

		it('filters out objects in array that have a name attribute which is an empty string', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(true)
				.onSecondCall().returns(false)
				.onThirdCall().returns(true)
				.onCall(3).returns(false)
				.onCall(4).returns(false);
			const instance = { playtext: { characters: [{ uuid: '', name: '' }, { uuid: '', name: 'Laertes' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(5);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters.length).to.equal(1);
			expect(result.playtext.characters[0].name).to.equal('Laertes');
			expect(result.playtext.characters[0]).to.not.have.property('position');

		});

	});

	context('properties in arrays at nested level (nested in array)', () => {

		it('assigns value to uuid property if empty string', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false);
			const instance = { cast: [{ roles: [{ uuid: '' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(5);
			expect(stubs.isObjectWithKeys.getCall(4).calledWithExactly('')).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false);
			const instance = { cast: [{ roles: [{ uuid: undefined }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(5);
			expect(stubs.isObjectWithKeys.getCall(4).calledWithExactly(undefined)).to.be.true;
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false);
			const instance = { cast: [{ roles: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(5);
			expect(stubs.isObjectWithKeys.getCall(4).calledWithExactly(
				'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
			)).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false);
			const instance = { cast: [{ roles: [{ foo: 'bar' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(5);
			expect(stubs.isObjectWithKeys.getCall(4).calledWithExactly('bar')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false);
			const instance = { cast: [{ roles: [{ foo: '' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(5);
			expect(stubs.isObjectWithKeys.getCall(4).calledWithExactly('')).to.be.true;
			expect(stubs.uuid.called).to.be.false;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('does not add a position property', () => {

				stubs.isObjectWithKeys
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(true)
					.onCall(4).returns(false);
				const instance = { cast: [{ roles: [{ uuid: '' }] }] };
				const result = prepareAsParams(instance);
				expect(stubs.isObjectWithKeys.callCount).to.equal(5);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.cast[0]).to.not.have.property('position');
				expect(result.cast[0].roles[0]).to.not.have.property('position');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', () => {

				stubs.isObjectWithKeys
					.onFirstCall().returns(false)
					.onSecondCall().returns(true)
					.onThirdCall().returns(false)
					.onCall(3).returns(true)
					.onCall(4).returns(false)
					.onCall(5).returns(false)
					.onCall(6).returns(true)
					.onCall(7).returns(false)
					.onCall(8).returns(false);
				const instance = { cast: [{ roles: [{ uuid: '' }, { uuid: '' }] }] };
				const result = prepareAsParams(instance);
				expect(stubs.isObjectWithKeys.callCount).to.equal(9);
				expect(stubs.isObjectWithKeys.lastCall.calledWithExactly(1)).to.be.true;
				expect(stubs.uuid.calledTwice).to.be.true;
				expect(stubs.neo4jInt.calledTwice).to.be.true;
				expect((stubs.neo4jInt.getCall(0)).calledWithExactly(0)).to.be.true;
				expect((stubs.neo4jInt.getCall(1)).calledWithExactly(1)).to.be.true;
				expect(result.cast[0]).to.not.have.property('position');
				expect(result.cast[0].roles[0]).to.have.property('position');
				expect(result.cast[0].roles[0].position).to.equal(0);
				expect(result.cast[0].roles[1]).to.have.property('position');
				expect(result.cast[0].roles[1].position).to.equal(1);

			});

		});

		it('filters out objects in array that have a name attribute which is an empty string', () => {

			stubs.isObjectWithKeys
				.onFirstCall().returns(false)
				.onSecondCall().returns(true)
				.onThirdCall().returns(false)
				.onCall(3).returns(true)
				.onCall(4).returns(false)
				.onCall(5).returns(false);
			const instance = { cast: [{ roles: [{ uuid: '', name: '' }, { uuid: '', name: 'Laertes' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.isObjectWithKeys.callCount).to.equal(6);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles.length).to.equal(1);
			expect(result.cast[0].roles[0].name).to.equal('Laertes');
			expect(result.cast[0].roles[0]).to.not.have.property('position');

		});

	});

});

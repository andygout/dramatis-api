import { expect } from 'chai';
import { createSandbox } from 'sinon';
import neo4j from 'neo4j-driver';
import { v4 as uuid } from 'uuid';

import { prepareAsParams } from '../../../src/lib/prepare-as-params';

describe('Prepare As Params module', () => {

	let stubs;

	const sandbox = createSandbox();

	beforeEach(() => {

		stubs = {
			neo4jInt: sandbox.stub(neo4j, 'int').returnsArg(0),
			uuid: sandbox.stub(uuid, 'v4').returns('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
		};

	});

	afterEach(() => {

		sandbox.restore();

	});

	it('returns new object with modifications but will not mutate input object', () => {

		const instance = {
			uuid: '',
			items: [
				{
					name: 'Foo',
					nestedItems: [
						{
							name: 'Baz'
						},
						{
							name: 'Qux'
						}
					]
				},
				{
					name: 'Bar',
					nestedItems: [
						{
							name: 'Quux'
						},
						{
							name: 'Quuz'
						}
					]
				}
			]
		};
		const result = prepareAsParams(instance);
		expect(result.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
		expect(result.items[0].position).to.equal(0);
		expect(result.items[0].nestedItems[0].position).to.equal(0);
		expect(result.items[0].nestedItems[1].position).to.equal(1);
		expect(result.items[1].position).to.equal(1);
		expect(result.items[1].nestedItems[0].position).to.equal(0);
		expect(result.items[1].nestedItems[1].position).to.equal(1);
		expect(instance.uuid).to.equal('');
		expect(instance.items[0]).not.to.have.property('position');
		expect(instance.items[0].nestedItems[0]).not.to.have.property('position');
		expect(instance.items[0].nestedItems[1]).not.to.have.property('position');
		expect(instance.items[1]).not.to.have.property('position');
		expect(instance.items[1].nestedItems[0]).not.to.have.property('position');
		expect(instance.items[1].nestedItems[0]).not.to.have.property('position');

	});

	context('top level properties', () => {

		it('assigns value to uuid property if empty string', () => {

			const instance = { uuid: '' };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { uuid: undefined };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { foo: 'bar' };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { foo: '' };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.foo).to.equal(null);

		});

		it('will not add position property', () => {

			const instance = { foo: '' };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result).not.to.have.property('position');

		});

	});

	context('nested level properties', () => {

		it('assigns value to uuid property if empty string', () => {

			const instance = { theatre: { uuid: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.theatre.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { theatre: { uuid: undefined } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.theatre.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { theatre: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.theatre.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { theatre: { foo: 'bar' } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.theatre.foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { theatre: { foo: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.theatre.foo).to.equal(null);

		});

		it('will not add position property', () => {

			const instance = { theatre: { uuid: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.theatre).not.to.have.property('position');

		});

	});

	context('properties in arrays at top level', () => {

		it('assigns value to uuid property if empty string', () => {

			const instance = { cast: [{ uuid: '' }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { cast: [{ uuid: undefined }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { cast: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { cast: [{ foo: 'bar' }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { cast: [{ foo: '' }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('does not add a position property', () => {

				const instance = { cast: [{ uuid: '' }] };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.cast[0]).to.not.have.property('position');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', () => {

				const instance = { cast: [{ uuid: '' }, { uuid: '' }] };
				const result = prepareAsParams(instance);
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

			const instance = { cast: [{ uuid: '', name: '' }, { uuid: '', name: 'Ian McKellen' }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast.length).to.equal(1);
			expect(result.cast[0].name).to.equal('Ian McKellen');
			expect(result.cast[0]).to.not.have.property('position');

		});

	});

	context('properties in arrays at nested level (nested in object)', () => {

		it('assigns value to uuid property if empty string', () => {

			const instance = { playtext: { characters: [{ uuid: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { playtext: { characters: [{ uuid: undefined }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { playtext: { characters: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { playtext: { characters: [{ foo: 'bar' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { playtext: { characters: [{ foo: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('does not add a position property', () => {

				const instance = { playtext: { characters: [{ uuid: '' }] } };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.playtext.characters[0]).to.not.have.property('position');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', () => {

				const instance = { playtext: { characters: [{ uuid: '' }, { uuid: '' }] } };
				const result = prepareAsParams(instance);
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

			const instance = { playtext: { characters: [{ uuid: '', name: '' }, { uuid: '', name: 'Laertes' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.playtext.characters.length).to.equal(1);
			expect(result.playtext.characters[0].name).to.equal('Laertes');
			expect(result.playtext.characters[0]).to.not.have.property('position');

		});

	});

	context('properties in arrays at nested level (nested in array)', () => {

		it('assigns value to uuid property if empty string', () => {

			const instance = { cast: [{ roles: [{ uuid: '' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { cast: [{ roles: [{ uuid: undefined }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { cast: [{ roles: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { cast: [{ roles: [{ foo: 'bar' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { cast: [{ roles: [{ foo: '' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('does not add a position property', () => {

				const instance = { cast: [{ roles: [{ uuid: '' }] }] };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.cast[0]).to.not.have.property('position');
				expect(result.cast[0].roles[0]).to.not.have.property('position');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', () => {

				const instance = { cast: [{ roles: [{ uuid: '' }, { uuid: '' }] }] };
				const result = prepareAsParams(instance);
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

			const instance = { cast: [{ roles: [{ uuid: '', name: '' }, { uuid: '', name: 'Laertes' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles.length).to.equal(1);
			expect(result.cast[0].roles[0].name).to.equal('Laertes');
			expect(result.cast[0].roles[0]).to.not.have.property('position');

		});

	});

});

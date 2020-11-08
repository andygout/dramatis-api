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

		context('object is in array whose items are not permitted an empty string name value', () => {

			it('filters out objects that have a name attribute which is an empty string', () => {

				const instance = { cast: [{ uuid: '', name: '' }, { uuid: '', name: 'Ian McKellen' }] };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.cast.length).to.equal(1);
				expect(result.cast[0].name).to.equal('Ian McKellen');
				expect(result.cast[0]).to.not.have.property('position');

			});

		});

		context('object is in writerGroups array where items are permitted an empty string name value', () => {

			it('does not filter out objects that have a name attribute which is an empty string', () => {

				const instance = {
					writerGroups: [
						{ name: '', writers: [{ name: 'Henrik Ibsen' }] },
						{ name: 'version by', writers: [{ name: 'David Eldridge' }] }
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.calledTwice).to.be.true;
				expect(result.writerGroups.length).to.equal(2);
				expect(result.writerGroups[0].name).to.be.null;
				expect(result.writerGroups[0]).to.have.property('position');
				expect(result.writerGroups[0].position).to.equal(0);
				expect(result.writerGroups[1].name).to.equal('version by');
				expect(result.writerGroups[1]).to.have.property('position');
				expect(result.writerGroups[1].position).to.equal(1);

			});

			it('filters out objects that do not have any non-empty string name writers', () => {

				const instance = {
					writerGroups: [
						{ name: '', writers: [{ name: '' }] },
						{ name: 'version by', writers: [{ name: 'David Eldridge' }] },
						{ name: 'translation by', writers: [{ name: '' }] }
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.writerGroups.length).to.equal(1);
				expect(result.writerGroups[0].name).to.equal('version by');
				expect(result.writerGroups[0]).to.not.have.property('position');

			});

		});

		it('applies the same uuid value to items that will need to share the same database entry', () => {

			stubs.uuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd')
				.onCall(4).returns('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
				.onCall(5).returns('ffffffff-ffff-ffff-ffff-ffffffffffff');
			const instance = {
				cast: [
					{ uuid: '', name: 'Foo', differentiator: '', qualifier: 'younger' },
					{ uuid: '', name: 'Bar', differentiator: '1', qualifier: 'younger' },
					{ uuid: '', name: 'Baz', differentiator: '', qualifier: '' },
					{ uuid: '', name: 'Foo', differentiator: '', qualifier: 'older' },
					{ uuid: '', name: 'Bar', differentiator: '1', qualifier: 'older' },
					{ uuid: '', name: 'Baz', differentiator: '1', qualifier: '' },
				]
			};
			const result = prepareAsParams(instance);
			expect(stubs.uuid.callCount).to.equal(6);
			expect(stubs.neo4jInt.callCount).to.equal(6);
			expect(result.cast[0].uuid).to.equal(result.cast[3].uuid);
			expect(result.cast[1].uuid).to.equal(result.cast[4].uuid);
			expect(result.cast[2].uuid).not.to.equal(result.cast[5].uuid);

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

		context('object is in array whose items are not permitted an empty string name value', () => {

			it('filters out objects that have a name attribute which is an empty string', () => {

				const instance = { playtext: { characters: [{ uuid: '', name: '' }, { uuid: '', name: 'Laertes' }] } };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.playtext.characters.length).to.equal(1);
				expect(result.playtext.characters[0].name).to.equal('Laertes');
				expect(result.playtext.characters[0]).to.not.have.property('position');

			});

		});

		context('object is in writerGroups array where items are permitted an empty string name value', () => {

			it('does not filter out objects that have a name attribute which is an empty string', () => {

				const instance = {
					playtext: {
						writerGroups: [
							{ name: '', writers: [{ name: 'Henrik Ibsen' }] },
							{ name: 'version by', writers: [{ name: 'David Eldridge' }] }
						]
					}
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.calledTwice).to.be.true;
				expect(result.playtext.writerGroups.length).to.equal(2);
				expect(result.playtext.writerGroups[0].name).to.be.null;
				expect(result.playtext.writerGroups[0]).to.have.property('position');
				expect(result.playtext.writerGroups[0].position).to.equal(0);
				expect(result.playtext.writerGroups[1].name).to.equal('version by');
				expect(result.playtext.writerGroups[1]).to.have.property('position');
				expect(result.playtext.writerGroups[1].position).to.equal(1);

			});

			it('filters out objects that do not have any non-empty string name writers', () => {

				const instance = {
					playtext: {
						writerGroups: [
							{ name: '', writers: [{ name: '' }] },
							{ name: 'version by', writers: [{ name: 'David Eldridge' }] },
							{ name: 'translation by', writers: [{ name: '' }] }
						]
					}
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.playtext.writerGroups.length).to.equal(1);
				expect(result.playtext.writerGroups[0].name).to.equal('version by');
				expect(result.playtext.writerGroups[0]).to.not.have.property('position');

			});

		});

		it('applies the same uuid value to items that will need to share the same database entry', () => {

			stubs.uuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd')
				.onCall(4).returns('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
				.onCall(5).returns('ffffffff-ffff-ffff-ffff-ffffffffffff');
			const instance = {
				playtext: {
					characters: [
						{ uuid: '', name: 'Foo', differentiator: '', qualifier: 'younger' },
						{ uuid: '', name: 'Bar', differentiator: '1', qualifier: 'younger' },
						{ uuid: '', name: 'Baz', differentiator: '', qualifier: '' },
						{ uuid: '', name: 'Foo', differentiator: '', qualifier: 'older' },
						{ uuid: '', name: 'Bar', differentiator: '1', qualifier: 'older' },
						{ uuid: '', name: 'Baz', differentiator: '1', qualifier: '' },
					]
				}
			};
			const result = prepareAsParams(instance);
			expect(stubs.uuid.callCount).to.equal(6);
			expect(stubs.neo4jInt.callCount).to.equal(6);
			expect(result.playtext.characters[0].uuid).to.equal(result.playtext.characters[3].uuid);
			expect(result.playtext.characters[1].uuid).to.equal(result.playtext.characters[4].uuid);
			expect(result.playtext.characters[2].uuid).not.to.equal(result.playtext.characters[5].uuid);

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

		context('object is in array whose items are not permitted an empty string name value', () => {

			it('filters out objects that have a name attribute which is an empty string', () => {

				const instance = { cast: [{ roles: [{ uuid: '', name: '' }, { uuid: '', name: 'Laertes' }] }] };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.cast[0].roles.length).to.equal(1);
				expect(result.cast[0].roles[0].name).to.equal('Laertes');
				expect(result.cast[0].roles[0]).to.not.have.property('position');

			});

		});

		context('object is in writerGroups array where items are permitted an empty string name value', () => {

			it('does not filter out objects that have a name attribute which is an empty string', () => {

				const instance = {
					playtexts: [
						{
							writerGroups: [
								{ name: '', writers: [{ name: 'Henrik Ibsen' }] },
								{ name: 'version by', writers: [{ name: 'David Eldridge' }] }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.calledTwice).to.be.true;
				expect(result.playtexts[0].writerGroups.length).to.equal(2);
				expect(result.playtexts[0].writerGroups[0].name).to.be.null;
				expect(result.playtexts[0].writerGroups[0]).to.have.property('position');
				expect(result.playtexts[0].writerGroups[0].position).to.equal(0);
				expect(result.playtexts[0].writerGroups[1].name).to.equal('version by');
				expect(result.playtexts[0].writerGroups[1]).to.have.property('position');
				expect(result.playtexts[0].writerGroups[1].position).to.equal(1);

			});

			it('filters out objects that do not have any non-empty string name writers', () => {

				const instance = {
					playtexts: [
						{
							writerGroups: [
								{ name: '', writers: [{ name: '' }] },
								{ name: 'version by', writers: [{ name: 'David Eldridge' }] },
								{ name: 'translation by', writers: [{ name: '' }] }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.playtexts[0].writerGroups.length).to.equal(1);
				expect(result.playtexts[0].writerGroups[0].name).to.equal('version by');
				expect(result.playtexts[0].writerGroups[0]).to.not.have.property('position');

			});

		});

		it('applies the same uuid value to items that will need to share the same database entry', () => {

			stubs.uuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd')
				.onCall(4).returns('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
				.onCall(5).returns('ffffffff-ffff-ffff-ffff-ffffffffffff');
			const instance = {
				cast: [
					{
						roles: [
							{ uuid: '', name: 'Foo', differentiator: '', qualifier: 'younger' },
							{ uuid: '', name: 'Bar', differentiator: '1', qualifier: 'younger' },
							{ uuid: '', name: 'Baz', differentiator: '', qualifier: '' },
							{ uuid: '', name: 'Foo', differentiator: '', qualifier: 'older' },
							{ uuid: '', name: 'Bar', differentiator: '1', qualifier: 'older' },
							{ uuid: '', name: 'Baz', differentiator: '1', qualifier: '' },
						]
					}
				]
			};
			const result = prepareAsParams(instance);
			expect(stubs.uuid.callCount).to.equal(6);
			expect(stubs.neo4jInt.callCount).to.equal(6);
			expect(result.cast[0].roles[0].uuid).to.equal(result.cast[0].roles[3].uuid);
			expect(result.cast[0].roles[1].uuid).to.equal(result.cast[0].roles[4].uuid);
			expect(result.cast[0].roles[2].uuid).not.to.equal(result.cast[0].roles[5].uuid);

		});

	});

});

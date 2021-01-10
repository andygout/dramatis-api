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

			it('will not add position property', () => {

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
				expect(stubs.uuid.calledOnce).to.be.true;
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

		context('object is in array (e.g. writingCredits, characterGroups) where items are permitted an empty string name value', () => {

			it('does not filter out objects that have a name attribute which is an empty string', () => {

				const instance = {
					writingCredits: [
						{ name: '', writingEntities: [{ name: 'Henrik Ibsen' }] }
					],
					characterGroups: [
						{ name: '', characters: [{ name: 'Malene' }] }
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.writingCredits.length).to.equal(1);
				expect(result.writingCredits[0].name).to.be.null;
				expect(result.writingCredits[0]).to.not.have.property('position');
				expect(result.characterGroups.length).to.equal(1);
				expect(result.characterGroups[0].name).to.be.null;
				expect(result.characterGroups[0]).to.not.have.property('position');

			});

			it('filters out objects that do not have any non-empty string name writingEntities/characters', () => {

				const instance = {
					writingCredits: [
						{ name: '', writingEntities: [{ name: '' }] },
						{ name: 'version by', writingEntities: [{ name: 'David Eldridge' }] },
						{ name: 'translation by', writingEntities: [{ name: '' }] }
					],
					characterGroups: [
						{ name: '', characters: [{ name: '' }] },
						{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
						{ name: 'The Foldals', characters: [{ name: '' }] }
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.writingCredits.length).to.equal(1);
				expect(result.writingCredits[0].name).to.equal('version by');
				expect(result.writingCredits[0]).to.not.have.property('position');
				expect(result.characterGroups.length).to.equal(1);
				expect(result.characterGroups[0].name).to.equal('The Borkmans');
				expect(result.characterGroups[0]).to.not.have.property('position');

			});

		});

		it('applies the same uuid value to items that will need to share the same database entry', () => {

			stubs.uuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd');
			const instance = {
				characters: [
					{ model: 'character', uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'younger' },
					{ model: 'character', uuid: '', name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger' },
					{ model: 'character', uuid: '', name: 'Baz', underlyingName: '', differentiator: '', qualifier: '' },
					{ model: 'character', uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'older' },
					{ model: 'character', uuid: '', name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'older' },
					{ model: 'character', uuid: '', name: 'Baz', underlyingName: '', differentiator: '1', qualifier: '' }
				]
			};
			const result = prepareAsParams(instance);
			expect(stubs.uuid.callCount).to.equal(4);
			expect(stubs.neo4jInt.callCount).to.equal(6);
			expect(result.characters[0].uuid).to.equal(result.characters[3].uuid);
			expect(result.characters[1].uuid).to.equal(result.characters[4].uuid);
			expect(result.characters[2].uuid).not.to.equal(result.characters[5].uuid);

		});

	});

	context('properties in arrays at nested level (nested in object)', () => {

		it('assigns value to uuid property if empty string', () => {

			const instance = { production: { cast: [{ uuid: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.production.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { production: { cast: [{ uuid: undefined }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.production.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { production: { cast: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.production.cast[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { production: { cast: [{ foo: 'bar' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.production.cast[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { production: { cast: [{ foo: '' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.production.cast[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('will not add position property', () => {

				const instance = { production: { cast: [{ uuid: '' }] } };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.production.cast[0]).to.not.have.property('position');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', () => {

				const instance = { production: { cast: [{ uuid: '' }, { uuid: '' }] } };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.calledTwice).to.be.true;
				expect((stubs.neo4jInt.getCall(0)).calledWithExactly(0)).to.be.true;
				expect((stubs.neo4jInt.getCall(1)).calledWithExactly(1)).to.be.true;
				expect(result.production.cast[0]).to.have.property('position');
				expect(result.production.cast[0].position).to.equal(0);
				expect(result.production.cast[1]).to.have.property('position');
				expect(result.production.cast[1].position).to.equal(1);

			});

		});

		context('object is in array whose items are not permitted an empty string name value', () => {

			it('filters out objects that have a name attribute which is an empty string', () => {

				const instance = { production: { cast: [{ uuid: '', name: '' }, { uuid: '', name: 'Ian McKellen' }] } };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.production.cast.length).to.equal(1);
				expect(result.production.cast[0].name).to.equal('Ian McKellen');
				expect(result.production.cast[0]).to.not.have.property('position');

			});

		});

		context('object is in array (e.g. writingCredits, characterGroups) where items are permitted an empty string name value', () => {

			it('does not filter out objects that have a name attribute which is an empty string', () => {

				const instance = {
					material: {
						writingCredits: [
							{ name: '', writingEntities: [{ name: 'Henrik Ibsen' }] }
						],
						characterGroups: [
							{ name: '', characters: [{ name: 'Malene' }] }
						]
					}
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.material.writingCredits.length).to.equal(1);
				expect(result.material.writingCredits[0].name).to.be.null;
				expect(result.material.writingCredits[0]).to.not.have.property('position');
				expect(result.material.characterGroups.length).to.equal(1);
				expect(result.material.characterGroups[0].name).to.be.null;
				expect(result.material.characterGroups[0]).to.not.have.property('position');

			});

			it('filters out objects that do not have any non-empty string name writingEntities/characters', () => {

				const instance = {
					material: {
						writingCredits: [
							{ name: '', writingEntities: [{ name: '' }] },
							{ name: 'version by', writingEntities: [{ name: 'David Eldridge' }] },
							{ name: 'translation by', writingEntities: [{ name: '' }] }
						],
						characterGroups: [
							{ name: '', characters: [{ name: '' }] },
							{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
							{ name: 'The Foldals', characters: [{ name: '' }] }
						]
					}
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.material.writingCredits.length).to.equal(1);
				expect(result.material.writingCredits[0].name).to.equal('version by');
				expect(result.material.writingCredits[0]).to.not.have.property('position');

			});

		});

		it('applies the same uuid value to items that will need to share the same database entry', () => {

			stubs.uuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd');
			const instance = {
				production: {
					cast: [
						{ model: 'person', uuid: '', name: 'Foo', differentiator: '' },
						{ model: 'person', uuid: '', name: 'Bar', differentiator: '1' },
						{ model: 'person', uuid: '', name: 'Baz', differentiator: '' },
						{ model: 'person', uuid: '', name: 'Foo', differentiator: '' },
						{ model: 'person', uuid: '', name: 'Bar', differentiator: '1' },
						{ model: 'person', uuid: '', name: 'Baz', differentiator: '1' }
					]
				}
			};
			const result = prepareAsParams(instance);
			expect(stubs.uuid.callCount).to.equal(4);
			expect(stubs.neo4jInt.callCount).to.equal(6);
			expect(result.production.cast[0].uuid).to.equal(result.production.cast[3].uuid);
			expect(result.production.cast[1].uuid).to.equal(result.production.cast[4].uuid);
			expect(result.production.cast[2].uuid).not.to.equal(result.production.cast[5].uuid);

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

			it('will not add position property', () => {

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
				expect(stubs.uuid.calledOnce).to.be.true;
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

		context('object is in array (e.g. writingCredits, characterGroups) where items are permitted an empty string name value', () => {

			it('does not filter out objects that have a name attribute which is an empty string', () => {

				const instance = {
					materials: [
						{
							writingCredits: [
								{ name: '', writingEntities: [{ name: 'Henrik Ibsen' }] }
							],
							characterGroups: [
								{ name: '', characters: [{ name: 'Malene' }] }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.materials[0].writingCredits.length).to.equal(1);
				expect(result.materials[0].writingCredits[0].name).to.be.null;
				expect(result.materials[0].writingCredits[0]).to.not.have.property('position');
				expect(result.materials[0].characterGroups.length).to.equal(1);
				expect(result.materials[0].characterGroups[0].name).to.be.null;
				expect(result.materials[0].characterGroups[0]).to.not.have.property('position');

			});

			it('filters out objects that do not have any non-empty string name writingEntities/characters', () => {

				const instance = {
					materials: [
						{
							writingCredits: [
								{ name: '', writingEntities: [{ name: '' }] },
								{ name: 'version by', writingEntities: [{ name: 'David Eldridge' }] },
								{ name: 'translation by', writingEntities: [{ name: '' }] }
							],
							characterGroups: [
								{ name: '', characters: [{ name: '' }] },
								{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
								{ name: 'The Foldals', characters: [{ name: '' }] }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.materials[0].writingCredits.length).to.equal(1);
				expect(result.materials[0].writingCredits[0].name).to.equal('version by');
				expect(result.materials[0].writingCredits[0]).to.not.have.property('position');
				expect(result.materials[0].characterGroups.length).to.equal(1);
				expect(result.materials[0].characterGroups[0].name).to.equal('The Borkmans');
				expect(result.materials[0].characterGroups[0]).to.not.have.property('position');

			});

		});

		it('applies the same uuid value to items in the same array that will need to share the same database entry', () => {

			stubs.uuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd');
			const instance = {
				characterGroups: [
					{
						characters: [
							{ model: 'character', uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'younger' },
							{ model: 'character', uuid: '', name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger' },
							{ model: 'character', uuid: '', name: 'Baz', underlyingName: '', differentiator: '', qualifier: '' },
							{ model: 'character', uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'older' },
							{ model: 'character', uuid: '', name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'older' },
							{ model: 'character', uuid: '', name: 'Baz', underlyingName: '', differentiator: '1', qualifier: '' }
						]
					}
				]
			};
			const result = prepareAsParams(instance);
			expect(stubs.uuid.callCount).to.equal(4);
			expect(stubs.neo4jInt.callCount).to.equal(6);
			expect(result.characterGroups[0].characters[0].uuid).to.equal(result.characterGroups[0].characters[3].uuid);
			expect(result.characterGroups[0].characters[1].uuid).to.equal(result.characterGroups[0].characters[4].uuid);
			expect(result.characterGroups[0].characters[2].uuid).not.to.equal(
				result.characterGroups[0].characters[5].uuid
			);

		});

		it('applies the same uuid value to items in different arrays that will need to share the same database entry', () => {

			stubs.uuid
				.onFirstCall().returns('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
				.onSecondCall().returns('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
				.onThirdCall().returns('cccccccc-cccc-cccc-cccc-cccccccccccc')
				.onCall(3).returns('dddddddd-dddd-dddd-dddd-dddddddddddd');
			const instance = {
				characterGroups: [
					{
						model: 'characterGroup',
						name: 'Montagues',
						characters: [
							{ model: 'character', uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: '' },
							{ model: 'character', uuid: '', name: 'Bar', underlyingName: '', differentiator: '', qualifier: '' },
							{ model: 'character', uuid: '', name: 'Baz', underlyingName: '', differentiator: '', qualifier: '' }
						]
					},
					{
						model: 'characterGroup',
						name: 'Capulets',
						characters: [
							{ model: 'character', uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: '' },
							{ model: 'character', uuid: '', name: 'Bar', underlyingName: '', differentiator: '', qualifier: '' },
							{ model: 'character', uuid: '', name: 'Baz', underlyingName: '', differentiator: '1', qualifier: '' }
						]
					}
				]
			};
			const result = prepareAsParams(instance);
			expect(stubs.uuid.callCount).to.equal(4);
			expect(stubs.neo4jInt.callCount).to.equal(8);
			expect(result.characterGroups[0].characters[0].uuid).to.equal(result.characterGroups[1].characters[0].uuid);
			expect(result.characterGroups[0].characters[1].uuid).to.equal(result.characterGroups[1].characters[1].uuid);
			expect(result.characterGroups[0].characters[2].uuid).not.to.equal(result.characterGroups[1].characters[2].uuid);

		});

	});

});

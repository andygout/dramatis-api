import { expect } from 'chai';
import { createSandbox } from 'sinon';
import neo4j from 'neo4j-driver';
import { v4 as uuid } from 'uuid';

import { prepareAsParams } from '../../../src/lib/prepare-as-params';
import applyModelGetter from '../../test-helpers/apply-model-getter';

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

		it('will add model property with value from model getter method', () => {

			const instance = applyModelGetter({ foo: '' });
			const result = prepareAsParams(instance);
			expect(result.model).to.equal('BASE');

		});

	});

	context('nested level properties', () => {

		it('assigns value to uuid property if empty string', () => {

			const instance = { venue: { uuid: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.venue.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { venue: { uuid: undefined } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.venue.uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { venue: { uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy' } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.venue.uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { venue: { foo: 'bar' } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.venue.foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { venue: { foo: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.venue.foo).to.equal(null);

		});

		it('will not add position property', () => {

			const instance = { venue: { uuid: '' } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.venue).not.to.have.property('position');

		});

		it('will add model property with value from model getter method', () => {

			const instance = { venue: applyModelGetter({ foo: '' }) };
			const result = prepareAsParams(instance);
			expect(result.venue.model).to.equal('BASE');

		});

	});

	context('properties in arrays at top level', () => {

		it('assigns value to uuid property if empty string', () => {

			const instance = { cast: [{ uuid: '', name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { cast: [{ uuid: undefined, name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = { cast: [{ uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { cast: [{ foo: 'bar', name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { cast: [{ foo: '', name: 'David Calder' }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('will not add position property', () => {

				const instance = { cast: [{ uuid: '', name: 'David Calder' }] };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.cast[0]).to.not.have.property('position');

			});

			it('will add model property with value from model getter method', () => {

				const instance = { cast: [applyModelGetter({ foo: '', name: 'David Calder' })] };
				const result = prepareAsParams(instance);
				expect(result.cast[0].model).to.equal('BASE');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', () => {

				const instance = { cast: [{ uuid: '', name: 'David Calder' }, { uuid: '', name: 'Ruth Negga' }] };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledTwice).to.be.true;
				expect(stubs.neo4jInt.calledTwice).to.be.true;
				expect(stubs.neo4jInt.getCall(0).calledWithExactly(0)).to.be.true;
				expect(stubs.neo4jInt.getCall(1).calledWithExactly(1)).to.be.true;
				expect(result.cast[0]).to.have.property('position');
				expect(result.cast[0].position).to.equal(0);
				expect(result.cast[1]).to.have.property('position');
				expect(result.cast[1].position).to.equal(1);

			});

			it('will add model property with value from model getter method', () => {

				const instance = {
					cast: [
						applyModelGetter({ foo: '', name: 'David Calder' }),
						applyModelGetter({ foo: '', name: 'Ruth Negga' })
					]
				};
				const result = prepareAsParams(instance);
				expect(result.cast[0].model).to.equal('BASE');

			});

		});

		context('object is in array whose items are not permitted an empty string name value', () => {

			it('filters out objects that have a name attribute which is an empty string', () => {

				const instance = { cast: [{ uuid: '', name: '' }, { uuid: '', name: 'David Calder' }] };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.cast.length).to.equal(1);
				expect(result.cast[0].name).to.equal('David Calder');
				expect(result.cast[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items are permitted an empty string name value (providing they have named children)', () => {

			it('does not filter out objects that have a name attribute which is an empty string', () => {

				const instance = {
					writingCredits: [
						{ name: '', entities: [{ name: 'Henrik Ibsen' }] }
					],
					characterGroups: [
						{ name: '', characters: [{ name: 'Malene' }] }
					],
					producerCredits: [
						{ name: '', entities: [{ name: 'National Theatre Company' }] }
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
				expect(result.producerCredits.length).to.equal(1);
				expect(result.producerCredits[0].name).to.be.null;
				expect(result.producerCredits[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items must have at least one named child', () => {

			it('filters out objects that do not have any named children (e.g. entities, characters)', () => {

				const instance = {
					writingCredits: [
						{ name: 'adaptation by', entities: [{ name: '' }] },
						{ name: 'version by', entities: [{ name: 'David Eldridge' }] },
						{ name: 'translation by' }
					],
					characterGroups: [
						{ name: 'The Rentheims', characters: [{ name: '' }] },
						{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
						{ name: 'The Foldals' }
					],
					producerCredits: [
						{ name: 'in partnership with', entities: [{ name: '' }] },
						{ name: 'in association with', entities: [{ name: 'Fuel Theatre' }] },
						{ name: 'originally commissioned by' }
					],
					creativeCredits: [
						{ name: 'Director', entities: [{ name: '' }] },
						{ name: 'Designer', entities: [{ name: 'Vicki Mortimer' }] },
						{ name: 'Lighting Designer' }
					],
					crewCredits: [
						{ name: 'Production Manager', entities: [{ name: '' }] },
						{ name: 'Stage Manager', entities: [{ name: 'Andrew Speed' }] },
						{ name: 'Costume Supervisor' }
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
				expect(result.producerCredits.length).to.equal(1);
				expect(result.producerCredits[0].name).to.equal('in association with');
				expect(result.producerCredits[0]).to.not.have.property('position');
				expect(result.creativeCredits.length).to.equal(1);
				expect(result.creativeCredits[0].name).to.equal('Designer');
				expect(result.creativeCredits[0]).to.not.have.property('position');
				expect(result.crewCredits.length).to.equal(1);
				expect(result.crewCredits[0].name).to.equal('Stage Manager');
				expect(result.crewCredits[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items do not require any named children', () => {

			it('retains objects whether they have named children (e.g. roles) or not', () => {

				const instance = {
					cast: [
						{ name: 'David Bradley', roles: [{ name: 'King Henry IV' }] },
						{ name: 'Matthew Macfadyen', roles: [] },
						{ name: 'Samuel Roukin' }
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.calledThrice).to.be.true;
				expect(result.cast.length).to.equal(3);

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
					applyModelGetter({ uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'younger' }),
					applyModelGetter({ uuid: '', name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger' }),
					applyModelGetter({ uuid: '', name: 'Baz', underlyingName: '', differentiator: '', qualifier: '' }),
					applyModelGetter({ uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'older' }),
					applyModelGetter({ uuid: '', name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'older' }),
					applyModelGetter({ uuid: '', name: 'Baz', underlyingName: '', differentiator: '1', qualifier: '' })
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

			const instance = { production: { cast: [{ uuid: '', name: 'David Calder' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.production.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { production: { cast: [{ uuid: undefined, name: 'David Calder' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.production.cast[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = {
				production: {
					cast: [
						{
							uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
							name: 'David Calder'
						}
					]
				}
			};
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.production.cast[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { production: { cast: [{ foo: 'bar', name: 'David Calder' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.production.cast[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { production: { cast: [{ foo: '', name: 'David Calder' }] } };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.production.cast[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('will not add position property', () => {

				const instance = { production: { cast: [{ uuid: '', name: 'David Calder' }] } };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.production.cast[0]).to.not.have.property('position');

			});

			it('will add model property with value from model getter method', () => {

				const instance = { production: { cast: [applyModelGetter({ foo: '', name: 'David Calder' })] } };
				const result = prepareAsParams(instance);
				expect(result.production.cast[0].model).to.equal('BASE');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', () => {

				const instance = {
					production: {
						cast: [
							{ uuid: '', name: 'David Calder' },
							{ uuid: '', name: 'Ruth Negga' }
						]
					}
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledTwice).to.be.true;
				expect(stubs.neo4jInt.calledTwice).to.be.true;
				expect(stubs.neo4jInt.getCall(0).calledWithExactly(0)).to.be.true;
				expect(stubs.neo4jInt.getCall(1).calledWithExactly(1)).to.be.true;
				expect(result.production.cast[0]).to.have.property('position');
				expect(result.production.cast[0].position).to.equal(0);
				expect(result.production.cast[1]).to.have.property('position');
				expect(result.production.cast[1].position).to.equal(1);

			});

			it('will add model property with value from model getter method', () => {

				const instance = {
					production: {
						cast: [
							applyModelGetter({ foo: '', name: 'David Calder' }),
							applyModelGetter({ foo: '', name: 'Ruth Negga' })
						]
					}
				};
				const result = prepareAsParams(instance);
				expect(result.production.cast[0].model).to.equal('BASE');

			});

		});

		context('object is in array whose items are not permitted an empty string name value', () => {

			it('filters out objects that have a name attribute which is an empty string', () => {

				const instance = { production: { cast: [{ uuid: '', name: '' }, { uuid: '', name: 'David Calder' }] } };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.production.cast.length).to.equal(1);
				expect(result.production.cast[0].name).to.equal('David Calder');
				expect(result.production.cast[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items are permitted an empty string name value (providing they have named children)', () => {

			it('does not filter out objects that have a name attribute which is an empty string', () => {

				const instance = {
					material: {
						writingCredits: [
							{ name: '', entities: [{ name: 'Henrik Ibsen' }] }
						],
						characterGroups: [
							{ name: '', characters: [{ name: 'Malene' }] }
						],
						producerCredits: [
							{ name: '', entities: [{ name: 'National Theatre Company' }] }
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
				expect(result.material.producerCredits.length).to.equal(1);
				expect(result.material.producerCredits[0].name).to.be.null;
				expect(result.material.producerCredits[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items must have at least one named child', () => {

			it('filters out objects that do not have any named children (e.g. entities, characters)', () => {

				const instance = {
					material: {
						writingCredits: [
							{ name: 'adaptation by', entities: [{ name: '' }] },
							{ name: 'version by', entities: [{ name: 'David Eldridge' }] },
							{ name: 'translation by' }
						],
						characterGroups: [
							{ name: 'The Rentheims', characters: [{ name: '' }] },
							{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
							{ name: 'The Foldals' }
						],
						producerCredits: [
							{ name: 'in partnership with', entities: [{ name: '' }] },
							{ name: 'in association with', entities: [{ name: 'Fuel Theatre' }] },
							{ name: 'originally commissioned by' }
						],
						creativeCredits: [
							{ name: 'Director', entities: [{ name: '' }] },
							{ name: 'Designer', entities: [{ name: 'Vicki Mortimer' }] },
							{ name: 'Lighting Designer' }
						],
						crewCredits: [
							{ name: 'Production Manager', entities: [{ name: '' }] },
							{ name: 'Stage Manager', entities: [{ name: 'Andrew Speed' }] },
							{ name: 'Costume Supervisor' }
						]
					}
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.material.writingCredits.length).to.equal(1);
				expect(result.material.writingCredits[0].name).to.equal('version by');
				expect(result.material.writingCredits[0]).to.not.have.property('position');
				expect(result.material.characterGroups.length).to.equal(1);
				expect(result.material.characterGroups[0].name).to.equal('The Borkmans');
				expect(result.material.characterGroups[0]).to.not.have.property('position');
				expect(result.material.producerCredits.length).to.equal(1);
				expect(result.material.producerCredits[0].name).to.equal('in association with');
				expect(result.material.producerCredits[0]).to.not.have.property('position');
				expect(result.material.creativeCredits.length).to.equal(1);
				expect(result.material.creativeCredits[0].name).to.equal('Designer');
				expect(result.material.creativeCredits[0]).to.not.have.property('position');
				expect(result.material.crewCredits.length).to.equal(1);
				expect(result.material.crewCredits[0].name).to.equal('Stage Manager');
				expect(result.material.crewCredits[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items do not require any named children', () => {

			it('retains objects whether they have named children (e.g. roles) or not', () => {

				const instance = {
					production: {
						cast: [
							{ name: 'David Bradley', roles: [{ name: 'King Henry IV' }] },
							{ name: 'Matthew Macfadyen', roles: [] },
							{ name: 'Samuel Roukin' }
						]
					}
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.calledThrice).to.be.true;
				expect(result.production.cast.length).to.equal(3);

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
						applyModelGetter({ uuid: '', name: 'Foo', differentiator: '' }),
						applyModelGetter({ uuid: '', name: 'Bar', differentiator: '1' }),
						applyModelGetter({ uuid: '', name: 'Baz', differentiator: '' }),
						applyModelGetter({ uuid: '', name: 'Foo', differentiator: '' }),
						applyModelGetter({ uuid: '', name: 'Bar', differentiator: '1' }),
						applyModelGetter({ uuid: '', name: 'Baz', differentiator: '1' })
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

			const instance = { cast: [{ name: 'David Calder', roles: [{ uuid: '', name: 'Polonius' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('assigns value to uuid property if undefined', () => {

			const instance = { cast: [{ name: 'David Calder', roles: [{ uuid: undefined, name: 'Polonius' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.calledOnce).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.equal('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

		});

		it('will not assign value to uuid property if one already exists', () => {

			const instance = {
				cast: [
					{
						name: 'David Calder',
						roles: [
							{
								uuid: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
								name: 'Polonius'
							}
						]
					}
				]
			};
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].uuid).to.equal('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');

		});

		it('will retaining existing value for non-uuid properties with non-empty string values', () => {

			const instance = { cast: [{ name: 'David Calder', roles: [{ foo: 'bar', name: 'Polonius' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].foo).to.equal('bar');

		});

		it('will assign null value to non-uuid properties with empty string values', () => {

			const instance = { cast: [{ name: 'David Calder', roles: [{ foo: '', name: 'Polonius' }] }] };
			const result = prepareAsParams(instance);
			expect(stubs.uuid.notCalled).to.be.true;
			expect(stubs.neo4jInt.notCalled).to.be.true;
			expect(result.cast[0].roles[0].foo).to.equal(null);

		});

		context('array contains a single item', () => {

			it('will not add position property', () => {

				const instance = { cast: [{ name: 'David Calder', roles: [{ uuid: '', name: 'Polonius' }] }] };
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.cast[0]).to.not.have.property('position');
				expect(result.cast[0].roles[0]).to.not.have.property('position');

			});

			it('will add model property with value from model getter method', () => {

				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								applyModelGetter({ foo: '', name: 'Polonius' })
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(result.cast[0].roles[0].model).to.equal('BASE');

			});

		});

		context('array contains more than a single item', () => {

			it('adds position property with value of array index', () => {

				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								{ uuid: '', name: 'Polonius' },
								{ uuid: '', name: 'Gravedigger' }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledTwice).to.be.true;
				expect(stubs.neo4jInt.calledTwice).to.be.true;
				expect(stubs.neo4jInt.getCall(0).calledWithExactly(0)).to.be.true;
				expect(stubs.neo4jInt.getCall(1).calledWithExactly(1)).to.be.true;
				expect(result.cast[0]).to.not.have.property('position');
				expect(result.cast[0].roles[0]).to.have.property('position');
				expect(result.cast[0].roles[0].position).to.equal(0);
				expect(result.cast[0].roles[1]).to.have.property('position');
				expect(result.cast[0].roles[1].position).to.equal(1);

			});

			it('will add model property with value from model getter method', () => {

				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								applyModelGetter({ foo: '', name: 'Polonius' }),
								applyModelGetter({ foo: '', name: 'Gravedigger' })
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(result.cast[0].roles[0].model).to.equal('BASE');

			});

		});

		context('object is in array whose items are not permitted an empty string name value', () => {

			it('filters out objects that have a name attribute which is an empty string', () => {

				const instance = {
					cast: [
						{
							name: 'David Calder',
							roles: [
								{ uuid: '', name: '' },
								{ uuid: '', name: 'Polonius' }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.calledOnce).to.be.true;
				expect(stubs.neo4jInt.notCalled).to.be.true;
				expect(result.cast[0].roles.length).to.equal(1);
				expect(result.cast[0].roles[0].name).to.equal('Polonius');
				expect(result.cast[0].roles[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items are permitted an empty string name value (providing they have named children)', () => {

			it('does not filter out objects that have a name attribute which is an empty string', () => {

				const instance = {
					materials: [
						{
							name: 'Foobar',
							writingCredits: [
								{ name: '', entities: [{ name: 'Henrik Ibsen' }] }
							],
							characterGroups: [
								{ name: '', characters: [{ name: 'Malene' }] }
							],
							producerCredits: [
								{ name: '', entities: [{ name: 'National Theatre Company' }] }
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
				expect(result.materials[0].producerCredits.length).to.equal(1);
				expect(result.materials[0].producerCredits[0].name).to.be.null;
				expect(result.materials[0].producerCredits[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items must have at least one named child', () => {

			it('filters out objects that do not have any named children (e.g. entities, characters)', () => {

				const instance = {
					materials: [
						{
							name: 'Foobar',
							writingCredits: [
								{ name: 'adaptation by', entities: [{ name: '' }] },
								{ name: 'version by', entities: [{ name: 'David Eldridge' }] },
								{ name: 'translation by' }
							],
							characterGroups: [
								{ name: 'The Rentheims', characters: [{ name: '' }] },
								{ name: 'The Borkmans', characters: [{ name: 'John Gabriel Borkman' }] },
								{ name: 'The Foldals' }
							],
							producerCredits: [
								{ name: 'in partnership with', entities: [{ name: '' }] },
								{ name: 'in association with', entities: [{ name: 'Fuel Theatre' }] },
								{ name: 'translation by' }
							],
							creativeCredits: [
								{ name: 'Director', entities: [{ name: '' }] },
								{ name: 'Designer', entities: [{ name: 'Vicki Mortimer' }] },
								{ name: 'Lighting Designer' }
							],
							crewCredits: [
								{ name: 'Production Manager', entities: [{ name: '' }] },
								{ name: 'Stage Manager', entities: [{ name: 'Andrew Speed' }] },
								{ name: 'Costume Supervisor' }
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
				expect(result.materials[0].producerCredits.length).to.equal(1);
				expect(result.materials[0].producerCredits[0].name).to.equal('in association with');
				expect(result.materials[0].producerCredits[0]).to.not.have.property('position');
				expect(result.materials[0].creativeCredits.length).to.equal(1);
				expect(result.materials[0].creativeCredits[0].name).to.equal('Designer');
				expect(result.materials[0].creativeCredits[0]).to.not.have.property('position');
				expect(result.materials[0].crewCredits.length).to.equal(1);
				expect(result.materials[0].crewCredits[0].name).to.equal('Stage Manager');
				expect(result.materials[0].crewCredits[0]).to.not.have.property('position');

			});

		});

		context('object is in array where items do not require any named children', () => {

			it('retains objects whether they have named children (e.g. roles) or not', () => {

				const instance = {
					productions: [
						{
							name: 'Henry IV, Part 1',
							cast: [
								{ name: 'David Bradley', roles: [{ name: 'King Henry IV' }] },
								{ name: 'Matthew Macfadyen', roles: [] },
								{ name: 'Samuel Roukin' }
							]
						}
					]
				};
				const result = prepareAsParams(instance);
				expect(stubs.uuid.notCalled).to.be.true;
				expect(stubs.neo4jInt.calledThrice).to.be.true;
				expect(result.productions[0].cast.length).to.equal(3);

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
							applyModelGetter({ uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'younger' }),
							applyModelGetter({ uuid: '', name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'younger' }),
							applyModelGetter({ uuid: '', name: 'Baz', underlyingName: '', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: 'older' }),
							applyModelGetter({ uuid: '', name: 'Bar', underlyingName: '', differentiator: '1', qualifier: 'older' }),
							applyModelGetter({ uuid: '', name: 'Baz', underlyingName: '', differentiator: '1', qualifier: '' })
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
						name: 'Montagues',
						characters: [
							applyModelGetter({ uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Bar', underlyingName: '', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Baz', underlyingName: '', differentiator: '', qualifier: '' })
						]
					},
					{
						name: 'Capulets',
						characters: [
							applyModelGetter({ uuid: '', name: 'Foo', underlyingName: '', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Bar', underlyingName: '', differentiator: '', qualifier: '' }),
							applyModelGetter({ uuid: '', name: 'Baz', underlyingName: '', differentiator: '1', qualifier: '' })
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

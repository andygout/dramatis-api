import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

import { CompanyWithMembers, MaterialBase, NominatedProductionIdentifier, Person } from '../../../src/models/index.js';

describe('Nomination model', () => {
	let stubs;
	let Nomination;

	const CompanyWithMembersStub = function () {
		return createStubInstance(CompanyWithMembers);
	};

	const MaterialBaseStub = function () {
		return createStubInstance(MaterialBase);
	};

	const NominatedProductionIdentifierStub = function () {
		return createStubInstance(NominatedProductionIdentifier);
	};

	const PersonStub = function () {
		return createStubInstance(Person);
	};

	beforeEach(async () => {
		stubs = {
			getDuplicateEntityInfoModule: {
				getDuplicateEntities: stub().returns('getDuplicateEntities response'),
				isEntityInArray: stub().returns(false)
			},
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateUuidIndices: stub().returns([])
			},
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
			},
			models: {
				CompanyWithMembers: CompanyWithMembersStub,
				MaterialBase: MaterialBaseStub,
				NominatedProductionIdentifier: NominatedProductionIdentifierStub,
				Person: PersonStub
			}
		};

		Nomination = await esmock(
			'../../../src/models/Nomination.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-entity-info.js': stubs.getDuplicateEntityInfoModule,
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/lib/strings.js': stubs.stringsModule,
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		describe('isWinner property', () => {
			it('assigns false if absent from props', async () => {
				const instance = new Nomination({});

				assert.equal(instance.isWinner, false);
			});

			it('assigns false if included in props but value evaluates to false', async () => {
				const instance = new Nomination({ isWinner: null });

				assert.equal(instance.isWinner, false);
			});

			it('assigns false if included in props but value is false', async () => {
				const instance = new Nomination({ isWinner: false });

				assert.equal(instance.isWinner, false);
			});

			it('assigns true if included in props and value evaluates to true', async () => {
				const instance = new Nomination({ isWinner: 'foobar' });

				assert.equal(instance.isWinner, true);
			});

			it('assigns true if included in props and is true', async () => {
				const instance = new Nomination({ isWinner: true });

				assert.equal(instance.isWinner, true);
			});
		});

		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new Nomination();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.callCount, 1);
		});

		describe('customType property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Nomination({ customType: 'Shortlisted' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.firstCall, 'Shortlisted');
				assert.equal(instance.customType, 'Shortlisted');
			});
		});

		describe('entities property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Nomination({});

				assert.deepEqual(instance.entities, []);
			});

			it('assigns array of entities if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', async () => {
				const instance = new Nomination({
					entities: [
						{
							name: 'Simon Baker'
						},
						{
							model: 'COMPANY',
							name: 'Autograph'
						},
						{
							name: ''
						},
						{
							model: 'COMPANY',
							name: ''
						},
						{
							name: ' '
						},
						{
							model: 'COMPANY',
							name: ' '
						}
					]
				});

				assert.equal(instance.entities.length, 6);
				assert.ok(instance.entities[0] instanceof Person);
				assert.ok(instance.entities[1] instanceof CompanyWithMembers);
				assert.ok(instance.entities[2] instanceof Person);
				assert.ok(instance.entities[3] instanceof CompanyWithMembers);
				assert.ok(instance.entities[4] instanceof Person);
				assert.ok(instance.entities[5] instanceof CompanyWithMembers);
			});
		});

		describe('productions property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Nomination({});

				assert.deepEqual(instance.productions, []);
			});

			it('assigns array of productions if included in props, retaining those with empty or whitespace-only string uuids', async () => {
				const instance = new Nomination({
					productions: [
						{
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						},
						{
							uuid: ''
						},
						{
							uuid: ' '
						}
					]
				});

				assert.equal(instance.productions.length, 3);
				assert.ok(instance.productions[0] instanceof NominatedProductionIdentifier);
				assert.ok(instance.productions[1] instanceof NominatedProductionIdentifier);
				assert.ok(instance.productions[2] instanceof NominatedProductionIdentifier);
			});
		});

		describe('materials property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Nomination({});

				assert.deepEqual(instance.materials, []);
			});

			it('assigns array of materials if included in props, retaining those with empty or whitespace-only string names', async () => {
				const instance = new Nomination({
					materials: [
						{
							name: 'Baghdad Wedding'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});

				assert.equal(instance.materials.length, 3);
				assert.ok(instance.materials[0] instanceof MaterialBase);
				assert.ok(instance.materials[1] instanceof MaterialBase);
				assert.ok(instance.materials[2] instanceof MaterialBase);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async () => {
			const instance = new Nomination({
				customType: 'Shortlisted',
				entities: [
					{
						name: 'Simon Baker'
					},
					{
						model: 'COMPANY',
						name: 'Autograph'
					}
				],
				productions: [
					{
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				],
				materials: [
					{
						name: 'Baghdad Wedding'
					}
				]
			});

			spy(instance, 'validateCustomType');

			instance.runInputValidations();

			sinonAssert.callOrder(
				instance.validateCustomType,
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities[0].validateName,
				instance.entities[0].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[0].validateUniquenessInGroup,
				instance.entities[1].validateName,
				instance.entities[1].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[1].validateUniquenessInGroup,
				instance.entities[1].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateUuidIndices,
				instance.productions[0].validateUuid,
				instance.productions[0].validateUniquenessInGroup,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.materials[0].validateName,
				instance.materials[0].validateDifferentiator,
				instance.materials[0].validateUniquenessInGroup
			);
			sinonAssert.calledOnceWithExactly(instance.validateCustomType, { isRequired: false });
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities
			);
			sinonAssert.calledOnceWithExactly(instance.entities[0].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.entities[0].validateDifferentiator);
			sinonAssert.calledTwice(stubs.getDuplicateEntityInfoModule.isEntityInArray);
			sinonAssert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray.firstCall,
				instance.entities[0],
				'getDuplicateEntities response'
			);
			sinonAssert.calledOnceWithExactly(instance.entities[0].validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(instance.entities[1].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.entities[1].validateDifferentiator);
			sinonAssert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray.secondCall,
				instance.entities[1],
				'getDuplicateEntities response'
			);
			sinonAssert.calledOnceWithExactly(instance.entities[1].validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(instance.entities[1].runInputValidations, {
				duplicateEntities: 'getDuplicateEntities response'
			});
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateUuidIndices,
				instance.productions
			);
			sinonAssert.calledOnceWithExactly(instance.productions[0].validateUuid);
			sinonAssert.calledOnceWithExactly(instance.productions[0].validateUniquenessInGroup, {
				isDuplicate: false,
				properties: new Set(['uuid'])
			});
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.materials
			);
			sinonAssert.calledOnceWithExactly(instance.materials[0].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.materials[0].validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.materials[0].validateUniquenessInGroup, { isDuplicate: false });
		});
	});

	describe('validateCustomType method', () => {
		it('will call validateStringForProperty method', async () => {
			const instance = new Nomination({ customType: 'Shortlisted' });

			spy(instance, 'validateStringForProperty');

			instance.validateCustomType({ isRequired: false });

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'customType', { isRequired: false });
		});
	});

	describe('runDatabaseValidations method', () => {
		it("calls associated productions' runDatabaseValidations method", async () => {
			const instance = new Nomination({
				productions: [
					{
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				]
			});

			await instance.runDatabaseValidations();

			sinonAssert.calledOnceWithExactly(instance.productions[0].runDatabaseValidations);
		});
	});
});

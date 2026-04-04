import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { CompanyWithMembers, MaterialBase, NominatedProductionIdentifier, Person } from '../../../src/models/index.js';

describe('Nomination model', () => {
	let stubs;
	let Nomination;

	const CompanyWithMembersStub = function () {
		return new CompanyWithMembers();
	};

	const MaterialBaseStub = function () {
		return new MaterialBase();
	};

	const NominatedProductionIdentifierStub = function () {
		return new NominatedProductionIdentifier();
	};

	const PersonStub = function () {
		return new Person();
	};

	beforeEach(async (test) => {
		stubs = {
			getDuplicateEntityInfoModule: {
				getDuplicateEntities: test.mock.fn(() => 'getDuplicateEntities response'),
				isEntityInArray: test.mock.fn(() => false)
			},
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: test.mock.fn(() => []),
				getDuplicateUuidIndices: test.mock.fn(() => [])
			},
			stringsModule: {
				getTrimmedOrEmptyString: test.mock.fn((arg) => arg?.trim() || '')
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

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls.length, 1);
		});

		describe('customType property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Nomination({ customType: 'Shortlisted' });

				assert.deepStrictEqual(
					stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[0].arguments,
					['Shortlisted']
				);
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
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
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
			const callOrder = [];

			const originalValidateCustomType = instance.validateCustomType;
			const originalEntity0ValidateName = instance.entities[0].validateName;
			const originalEntity0ValidateDifferentiator = instance.entities[0].validateDifferentiator;
			const originalEntity0ValidateUniquenessInGroup = instance.entities[0].validateUniquenessInGroup;
			const originalEntity1ValidateName = instance.entities[1].validateName;
			const originalEntity1ValidateDifferentiator = instance.entities[1].validateDifferentiator;
			const originalEntity1ValidateUniquenessInGroup = instance.entities[1].validateUniquenessInGroup;
			const originalEntity1RunInputValidations = instance.entities[1].runInputValidations;
			const originalProduction0ValidateUuid = instance.productions[0].validateUuid;
			const originalProduction0ValidateUniquenessInGroup = instance.productions[0].validateUniquenessInGroup;
			const originalMaterial0ValidateName = instance.materials[0].validateName;
			const originalMaterial0ValidateDifferentiator = instance.materials[0].validateDifferentiator;
			const originalMaterial0ValidateUniquenessInGroup = instance.materials[0].validateUniquenessInGroup;

			test.mock.method(instance, 'validateCustomType', function (...args) {
				callOrder.push('instance.validateCustomType');

				return originalValidateCustomType.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateEntityInfoModule, 'getDuplicateEntities', function (...args) {
				callOrder.push('stubs.getDuplicateEntityInfoModule.getDuplicateEntities');

				return 'getDuplicateEntities response';
			});
			test.mock.method(instance.entities[0], 'validateName', function (...args) {
				callOrder.push('instance.entities[0].validateName');

				return originalEntity0ValidateName.apply(this, args);
			});
			test.mock.method(instance.entities[0], 'validateDifferentiator', function (...args) {
				callOrder.push('instance.entities[0].validateDifferentiator');

				return originalEntity0ValidateDifferentiator.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateEntityInfoModule, 'isEntityInArray', function (...args) {
				callOrder.push('stubs.getDuplicateEntityInfoModule.isEntityInArray');

				return false;
			});
			test.mock.method(instance.entities[0], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.entities[0].validateUniquenessInGroup');

				return originalEntity0ValidateUniquenessInGroup.apply(this, args);
			});
			test.mock.method(instance.entities[1], 'validateName', function (...args) {
				callOrder.push('instance.entities[1].validateName');

				return originalEntity1ValidateName.apply(this, args);
			});
			test.mock.method(instance.entities[1], 'validateDifferentiator', function (...args) {
				callOrder.push('instance.entities[1].validateDifferentiator');

				return originalEntity1ValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance.entities[1], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.entities[1].validateUniquenessInGroup');

				return originalEntity1ValidateUniquenessInGroup.apply(this, args);
			});
			test.mock.method(instance.entities[1], 'runInputValidations', function (...args) {
				callOrder.push('instance.entities[1].runInputValidations');

				return originalEntity1RunInputValidations.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateUuidIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateUuidIndices');

				return [];
			});
			test.mock.method(instance.productions[0], 'validateUuid', function (...args) {
				callOrder.push('instance.productions[0].validateUuid');

				return originalProduction0ValidateUuid.apply(this, args);
			});
			test.mock.method(instance.productions[0], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.productions[0].validateUniquenessInGroup');

				return originalProduction0ValidateUniquenessInGroup.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateBaseInstanceIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices');

				return [];
			});
			test.mock.method(instance.materials[0], 'validateName', function (...args) {
				callOrder.push('instance.materials[0].validateName');

				return originalMaterial0ValidateName.apply(this, args);
			});
			test.mock.method(instance.materials[0], 'validateDifferentiator', function (...args) {
				callOrder.push('instance.materials[0].validateDifferentiator');

				return originalMaterial0ValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance.materials[0], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.materials[0].validateUniquenessInGroup');

				return originalMaterial0ValidateUniquenessInGroup.apply(this, args);
			});

			instance.runInputValidations();

			assert.deepStrictEqual(callOrder, [
				'instance.validateCustomType',
				'stubs.getDuplicateEntityInfoModule.getDuplicateEntities',
				'instance.entities[0].validateName',
				'instance.entities[0].validateDifferentiator',
				'stubs.getDuplicateEntityInfoModule.isEntityInArray',
				'instance.entities[0].validateUniquenessInGroup',
				'instance.entities[1].validateName',
				'instance.entities[1].validateDifferentiator',
				'stubs.getDuplicateEntityInfoModule.isEntityInArray',
				'instance.entities[1].validateUniquenessInGroup',
				'instance.entities[1].runInputValidations',
				'stubs.getDuplicateIndicesModule.getDuplicateUuidIndices',
				'instance.productions[0].validateUuid',
				'instance.productions[0].validateUniquenessInGroup',
				'stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices',
				'instance.materials[0].validateName',
				'instance.materials[0].validateDifferentiator',
				'instance.materials[0].validateUniquenessInGroup'
			]);
			assert.strictEqual(instance.validateCustomType.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateCustomType.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(stubs.getDuplicateEntityInfoModule.getDuplicateEntities.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.getDuplicateEntityInfoModule.getDuplicateEntities.mock.calls[0].arguments, [
				instance.entities
			]);
			assert.strictEqual(instance.entities[0].validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[0].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.entities[0].validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[0].validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(stubs.getDuplicateEntityInfoModule.isEntityInArray.mock.calls.length, 2);
			assert.deepStrictEqual(stubs.getDuplicateEntityInfoModule.isEntityInArray.mock.calls[0].arguments, [
				instance.entities[0],
				'getDuplicateEntities response'
			]);
			assert.strictEqual(instance.entities[0].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[0].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
			assert.strictEqual(instance.entities[1].validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[1].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.entities[1].validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[1].validateDifferentiator.mock.calls[0].arguments, []);
			assert.deepStrictEqual(stubs.getDuplicateEntityInfoModule.isEntityInArray.mock.calls[1].arguments, [
				instance.entities[1],
				'getDuplicateEntities response'
			]);
			assert.strictEqual(instance.entities[1].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[1].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
			assert.strictEqual(instance.entities[1].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.entities[1].runInputValidations.mock.calls[0].arguments, [
				{
					duplicateEntities: 'getDuplicateEntities response'
				}
			]);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateUuidIndices.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.getDuplicateIndicesModule.getDuplicateUuidIndices.mock.calls[0].arguments, [
				instance.productions
			]);
			assert.strictEqual(instance.productions[0].validateUuid.mock.calls.length, 1);
			assert.deepStrictEqual(instance.productions[0].validateUuid.mock.calls[0].arguments, []);
			assert.strictEqual(instance.productions[0].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.productions[0].validateUniquenessInGroup.mock.calls[0].arguments, [
				{
					isDuplicate: false,
					properties: new Set(['uuid'])
				}
			]);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.mock.calls.length, 1);
			assert.deepStrictEqual(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.mock.calls[0].arguments,
				[instance.materials]
			);
			assert.strictEqual(instance.materials[0].validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.materials[0].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.materials[0].validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.materials[0].validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(instance.materials[0].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.materials[0].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
		});
	});

	describe('validateCustomType method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const instance = new Nomination({ customType: 'Shortlisted' });

			test.mock.method(instance, 'validateStringForProperty', () => undefined);

			instance.validateCustomType({ isRequired: false });

			assert.strictEqual(instance.validateStringForProperty.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateStringForProperty.mock.calls[0].arguments, ['customType', { isRequired: false }]);
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

			assert.strictEqual(instance.productions[0].runDatabaseValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.productions[0].runDatabaseValidations.mock.calls[0].arguments, []);
		});
	});
});

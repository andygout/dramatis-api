import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import {
	CharacterGroup,
	MaterialBase,
	OriginalVersionMaterial,
	SubMaterial,
	WritingCredit
} from '../../../src/models/index.js';

describe('Material model', () => {
	let stubs;
	let Material;

	const CharacterGroupStub = function () {
		return new CharacterGroup();
	};

	const OriginalVersionMaterialStub = function () {
		return new OriginalVersionMaterial();
	};

	const SubMaterialStub = function () {
		return new SubMaterial();
	};

	const WritingCreditStub = function () {
		return new WritingCredit();
	};

	beforeEach(async (test) => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: test.mock.fn(() => []),
				getDuplicateNameIndices: test.mock.fn(() => [])
			},
			isValidYear: test.mock.fn((value) => value === 1959),
			stringsModule: {
				getTrimmedOrEmptyString: test.mock.fn((arg) => arg?.trim() || '')
			},
			models: {
				CharacterGroup: CharacterGroupStub,
				OriginalVersionMaterial: OriginalVersionMaterialStub,
				SubMaterial: SubMaterialStub,
				WritingCredit: WritingCreditStub
			}
		};

		Material = await esmock(
			'../../../src/models/Material.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/lib/is-valid-year.js': stubs.isValidYear,
				'../../../src/lib/strings.js': stubs.stringsModule,
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new Material();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls.length, 5);
		});

		describe('subtitle property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Material({ subtitle: 'Prince of Denmark' });

				assert.deepStrictEqual(
					stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[2].arguments,
					['Prince of Denmark']
				);
				assert.equal(instance.subtitle, 'Prince of Denmark');
			});
		});

		describe('format property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Material({ format: 'play' });

				assert.deepStrictEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[3].arguments, ['play']);
				assert.equal(instance.format, 'play');
			});
		});

		describe('year property', () => {
			describe('value cannot be parsed as integer', () => {
				it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
					const instance = new Material({ year: 'Nineteen Fifty-Nine' });

					assert.deepStrictEqual(
						stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[4].arguments,
						['Nineteen Fifty-Nine']
					);
					assert.equal(instance.year, 'Nineteen Fifty-Nine');
				});
			});

			describe('value can be parsed as integer', () => {
				it('assigns value converted to integer if included in props and value can be parsed as integer', async () => {
					const instance = new Material({ year: '1959' });

					assert.equal(instance.year, 1959);
				});

				it('assigns value with flanking whitespace converted to integer if included in props and value can be parsed as integer', async () => {
					const instance = new Material({ year: ' 1959 ' });

					assert.equal(instance.year, 1959);
				});

				it('assigns value if included in props and is an integer', async () => {
					const instance = new Material({ year: 1959 });

					assert.equal(instance.year, 1959);
				});
			});
		});

		describe('originalVersionMaterial property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Material({
					name: 'The Seagull',
					differentiator: '2'
				});

				assert.ok(instance.originalVersionMaterial instanceof MaterialBase);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Material({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull',
						differentiator: '1'
					}
				});

				assert.ok(instance.originalVersionMaterial instanceof MaterialBase);
			});
		});

		describe('writingCredits property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Material({ name: 'The Tragedy of Hamlet' });

				assert.deepEqual(instance.writingCredits, []);
			});

			it('assigns array of writingCredits if included in props, retaining those with empty or whitespace-only string names', async () => {
				const instance = new Material({
					name: 'The Tragedy of Hamlet',
					writingCredits: [
						{
							name: 'version by'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});

				assert.equal(instance.writingCredits.length, 3);
				assert.ok(instance.writingCredits[0] instanceof WritingCredit);
				assert.ok(instance.writingCredits[1] instanceof WritingCredit);
				assert.ok(instance.writingCredits[2] instanceof WritingCredit);
			});
		});

		describe('subMaterials property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Material({ name: 'The Coast of Utopia' });

				assert.deepEqual(instance.subMaterials, []);
			});

			it('assigns array of subMaterials if included in props, retaining those with empty or whitespace-only string names', async () => {
				const instance = new Material({
					name: 'The Coast of Utopia',
					subMaterials: [
						{
							name: 'Voyage'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});

				assert.equal(instance.subMaterials.length, 3);
				assert.ok(instance.subMaterials[0] instanceof SubMaterial);
				assert.ok(instance.subMaterials[1] instanceof SubMaterial);
				assert.ok(instance.subMaterials[2] instanceof SubMaterial);
			});
		});

		describe('characterGroups property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new Material({ name: 'The Tragedy of Hamlet' });

				assert.deepEqual(instance.characterGroups, []);
			});

			it('assigns array of characterGroups if included in props, retaining those with empty or whitespace-only string names', async () => {
				const instance = new Material({
					name: 'The Tragedy of Hamlet',
					characterGroups: [
						{
							name: 'Court of Elsinore'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});

				assert.equal(instance.characterGroups.length, 3);
				assert.ok(instance.characterGroups[0] instanceof CharacterGroup);
				assert.ok(instance.characterGroups[1] instanceof CharacterGroup);
				assert.ok(instance.characterGroups[2] instanceof CharacterGroup);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
			const instance = new Material({
				name: 'The Tragedy of Hamlet',
				differentiator: '1',
				subtitle: 'Prince of Denmark',
				writingCredits: [
					{
						name: 'version by'
					}
				],
				subMaterials: [
					{
						name: 'The Murder of Gonzago'
					}
				],
				characterGroups: [
					{
						name: 'Court of Elsinore'
					}
				]
			});
			const callOrder = [];

			const originalValidateName = instance.validateName;
			const originalValidateDifferentiator = instance.validateDifferentiator;
			const originalValidateSubtitle = instance.validateSubtitle;
			const originalValidateFormat = instance.validateFormat;
			const originalValidateYear = instance.validateYear;
			const originalOriginalVersionMaterialValidateName = instance.originalVersionMaterial.validateName;
			const originalOriginalVersionMaterialValidateDifferentiator = instance.originalVersionMaterial.validateDifferentiator;
			const originalWritingCreditRunInputValidations = instance.writingCredits[0].runInputValidations;
			const originalSubMaterialValidateName = instance.subMaterials[0].validateName;
			const originalSubMaterialValidateDifferentiator = instance.subMaterials[0].validateDifferentiator;
			const originalSubMaterialValidateNoAssociationWithSelf = instance.subMaterials[0].validateNoAssociationWithSelf;
			const originalSubMaterialValidateUniquenessInGroup = instance.subMaterials[0].validateUniquenessInGroup;
			const originalCharacterGroupRunInputValidations = instance.characterGroups[0].runInputValidations;

			test.mock.method(instance, 'validateName', function (...args) {
				callOrder.push('instance.validateName');

				return originalValidateName.apply(this, args);
			});
			test.mock.method(instance, 'validateDifferentiator', function (...args) {
				callOrder.push('instance.validateDifferentiator');

				return originalValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance, 'validateSubtitle', function (...args) {
				callOrder.push('instance.validateSubtitle');

				return originalValidateSubtitle.apply(this, args);
			});
			test.mock.method(instance, 'validateFormat', function (...args) {
				callOrder.push('instance.validateFormat');

				return originalValidateFormat.apply(this, args);
			});
			test.mock.method(instance, 'validateYear', function (...args) {
				callOrder.push('instance.validateYear');

				return originalValidateYear.apply(this, args);
			});
			test.mock.method(instance.originalVersionMaterial, 'validateName', function (...args) {
				callOrder.push('instance.originalVersionMaterial.validateName');

				return originalOriginalVersionMaterialValidateName.apply(this, args);
			});
			test.mock.method(instance.originalVersionMaterial, 'validateDifferentiator', function (...args) {
				callOrder.push('instance.originalVersionMaterial.validateDifferentiator');

				return originalOriginalVersionMaterialValidateDifferentiator.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateNameIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateNameIndices');

				return [];
			});
			test.mock.method(instance.writingCredits[0], 'runInputValidations', function (...args) {
				callOrder.push('instance.writingCredits[0].runInputValidations');

				return originalWritingCreditRunInputValidations.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateBaseInstanceIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices');

				return [];
			});
			test.mock.method(instance.subMaterials[0], 'validateName', function (...args) {
				callOrder.push('instance.subMaterials[0].validateName');

				return originalSubMaterialValidateName.apply(this, args);
			});
			test.mock.method(instance.subMaterials[0], 'validateDifferentiator', function (...args) {
				callOrder.push('instance.subMaterials[0].validateDifferentiator');

				return originalSubMaterialValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance.subMaterials[0], 'validateNoAssociationWithSelf', function (...args) {
				callOrder.push('instance.subMaterials[0].validateNoAssociationWithSelf');

				return originalSubMaterialValidateNoAssociationWithSelf.apply(this, args);
			});
			test.mock.method(instance.subMaterials[0], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.subMaterials[0].validateUniquenessInGroup');

				return originalSubMaterialValidateUniquenessInGroup.apply(this, args);
			});
			test.mock.method(instance.characterGroups[0], 'runInputValidations', function (...args) {
				callOrder.push('instance.characterGroups[0].runInputValidations');

				return originalCharacterGroupRunInputValidations.apply(this, args);
			});

			instance.runInputValidations();

			assert.deepStrictEqual(callOrder, [
				'instance.validateName',
				'instance.validateDifferentiator',
				'instance.validateSubtitle',
				'instance.validateFormat',
				'instance.validateYear',
				'instance.originalVersionMaterial.validateName',
				'instance.originalVersionMaterial.validateDifferentiator',
				'stubs.getDuplicateIndicesModule.getDuplicateNameIndices',
				'instance.writingCredits[0].runInputValidations',
				'stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices',
				'instance.subMaterials[0].validateName',
				'instance.subMaterials[0].validateDifferentiator',
				'instance.subMaterials[0].validateNoAssociationWithSelf',
				'instance.subMaterials[0].validateUniquenessInGroup',
				'instance.characterGroups[0].runInputValidations'
			]);
			assert.strictEqual(instance.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: true }]);
			assert.strictEqual(instance.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(instance.validateSubtitle.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateSubtitle.mock.calls[0].arguments, []);
			assert.strictEqual(instance.validateFormat.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateFormat.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.validateYear.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateYear.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.originalVersionMaterial.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.originalVersionMaterial.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.originalVersionMaterial.validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.originalVersionMaterial.validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.mock.calls[0].arguments, [
				instance.writingCredits
			]);
			assert.strictEqual(instance.writingCredits[0].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.writingCredits[0].runInputValidations.mock.calls[0].arguments, [
				{
					isDuplicate: false,
					subject: {
						name: 'The Tragedy of Hamlet',
						differentiator: '1'
					}
				}
			]);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.mock.calls.length, 1);
			assert.deepStrictEqual(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.mock.calls[0].arguments,
				[instance.subMaterials]
			);
			assert.strictEqual(instance.subMaterials[0].validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.subMaterials[0].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.subMaterials[0].validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.subMaterials[0].validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(instance.subMaterials[0].validateNoAssociationWithSelf.mock.calls.length, 1);
			assert.deepStrictEqual(instance.subMaterials[0].validateNoAssociationWithSelf.mock.calls[0].arguments, [
				{
					name: 'The Tragedy of Hamlet',
					differentiator: '1'
				}
			]);
			assert.strictEqual(instance.subMaterials[0].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.subMaterials[0].validateUniquenessInGroup.mock.calls[0].arguments, [
				{
					isDuplicate: false
				}
			]);
			assert.strictEqual(instance.characterGroups[0].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.characterGroups[0].runInputValidations.mock.calls[0].arguments, []);
		});
	});

	describe('validateFormat method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const instance = new Material({ name: 'The Tragedy of Hamlet', format: 'play' });

			test.mock.method(instance, 'validateStringForProperty', () => undefined);

			instance.validateFormat({ isRequired: false });

			assert.strictEqual(instance.validateStringForProperty.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateStringForProperty.mock.calls[0].arguments, [
				'format',
				{ isRequired: false }
			]);
		});
	});

	describe('validateYear method', () => {
		describe('year value equates to false', () => {
			it('will not call isValidYear function or addPropertyError method', async (test) => {
				const instance = new Material({ name: 'The Caretaker', year: '' });

				test.mock.method(instance, 'addPropertyError', () => undefined);

				instance.validateYear();

				assert.strictEqual(stubs.isValidYear.mock.calls.length, 0);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
			});
		});

		describe('year value is not a valid year', () => {
			it('will call isValidYear function and addPropertyError method', async (test) => {
				const instance = new Material({ name: 'The Caretaker', year: 'Nineteen Fifty-Nine' });

				test.mock.method(instance, 'addPropertyError', () => undefined);

				instance.validateYear();

				assert.strictEqual(stubs.isValidYear.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.isValidYear.mock.calls[0].arguments, ['Nineteen Fifty-Nine']);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
				assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, [
					'year',
					'Value must be a valid year'
				]);
			});
		});

		describe('year value is a valid year', () => {
			it('will call isValidYear function but not addPropertyError method', async (test) => {
				const instance = new Material({ name: 'The Caretaker', year: 1959 });

				test.mock.method(instance, 'addPropertyError', () => undefined);

				instance.validateYear();

				assert.strictEqual(stubs.isValidYear.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.isValidYear.mock.calls[0].arguments, [1959]);
				assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
			});
		});
	});

	describe('runDatabaseValidations method', () => {
		it("calls associated subMaterials' runDatabaseValidations method", async (test) => {
			const instance = new Material({
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: 'Foo',
				originalVersionMaterial: {
					name: 'Ur-Foo'
				},
				writingCredits: [
					{
						model: 'MATERIAL',
						name: 'Pre-Foo'
					}
				],
				subMaterials: [
					{
						name: 'Sub-Foo'
					}
				]
			});

			test.mock.method(instance, 'validateUniquenessInDatabase', async () => undefined);

			await instance.runDatabaseValidations();

			assert.strictEqual(instance.validateUniquenessInDatabase.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateUniquenessInDatabase.mock.calls[0].arguments, []);
			assert.strictEqual(instance.originalVersionMaterial.runDatabaseValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.originalVersionMaterial.runDatabaseValidations.mock.calls[0].arguments, [
				{
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				}
			]);
			assert.strictEqual(instance.writingCredits[0].runDatabaseValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.writingCredits[0].runDatabaseValidations.mock.calls[0].arguments, [
				{
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				}
			]);
			assert.strictEqual(instance.subMaterials[0].runDatabaseValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.subMaterials[0].runDatabaseValidations.mock.calls[0].arguments, [
				{
					subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
				}
			]);
		});
	});
});

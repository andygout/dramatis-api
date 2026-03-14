import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

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
		return createStubInstance(CharacterGroup);
	};

	const OriginalVersionMaterialStub = function () {
		return createStubInstance(OriginalVersionMaterial);
	};

	const SubMaterialStub = function () {
		return createStubInstance(SubMaterial);
	};

	const WritingCreditStub = function () {
		return createStubInstance(WritingCredit);
	};

	beforeEach(async () => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateNameIndices: stub().returns([])
			},
			isValidYear: stub().returns(false),
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
			},
			models: {
				CharacterGroup: CharacterGroupStub,
				OriginalVersionMaterial: OriginalVersionMaterialStub,
				SubMaterial: SubMaterialStub,
				WritingCredit: WritingCreditStub
			}
		};

		stubs.isValidYear.withArgs(1959).returns(true);

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

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new Material();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.callCount, 5);
		});

		describe('subtitle property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Material({ subtitle: 'Prince of Denmark' });

				sinonAssert.calledWithExactly(
					stubs.stringsModule.getTrimmedOrEmptyString.thirdCall,
					'Prince of Denmark'
				);
				assert.equal(instance.subtitle, 'Prince of Denmark');
			});
		});

		describe('format property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Material({ format: 'play' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.getCall(3), 'play');
				assert.equal(instance.format, 'play');
			});
		});

		describe('year property', () => {
			describe('value cannot be parsed as integer', () => {
				it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
					const instance = new Material({ year: 'Nineteen Fifty-Nine' });

					sinonAssert.calledWithExactly(
						stubs.stringsModule.getTrimmedOrEmptyString.getCall(4),
						'Nineteen Fifty-Nine'
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
		it("calls instance's validate methods and associated models' validate methods", async () => {
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

			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			spy(instance, 'validateSubtitle');
			spy(instance, 'validateFormat');
			spy(instance, 'validateYear');

			instance.runInputValidations();

			sinonAssert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				instance.validateSubtitle,
				instance.validateFormat,
				instance.validateYear,
				instance.originalVersionMaterial.validateName,
				instance.originalVersionMaterial.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.writingCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subMaterials[0].validateName,
				instance.subMaterials[0].validateDifferentiator,
				instance.subMaterials[0].validateNoAssociationWithSelf,
				instance.subMaterials[0].validateUniquenessInGroup,
				instance.characterGroups[0].runInputValidations
			);
			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: true });
			sinonAssert.calledOnceWithExactly(instance.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.validateSubtitle);
			sinonAssert.calledOnceWithExactly(instance.validateFormat, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.validateYear, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.originalVersionMaterial.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.originalVersionMaterial.validateDifferentiator);
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.writingCredits
			);
			sinonAssert.calledOnceWithExactly(instance.writingCredits[0].runInputValidations, {
				isDuplicate: false,
				subject: {
					name: 'The Tragedy of Hamlet',
					differentiator: '1'
				}
			});
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subMaterials
			);
			sinonAssert.calledOnceWithExactly(instance.subMaterials[0].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.subMaterials[0].validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.subMaterials[0].validateNoAssociationWithSelf, {
				name: 'The Tragedy of Hamlet',
				differentiator: '1'
			});
			sinonAssert.calledOnceWithExactly(instance.subMaterials[0].validateUniquenessInGroup, {
				isDuplicate: false
			});
			sinonAssert.calledOnceWithExactly(instance.characterGroups[0].runInputValidations);
		});
	});

	describe('validateFormat method', () => {
		it('will call validateStringForProperty method', async () => {
			const instance = new Material({ name: 'The Tragedy of Hamlet', format: 'play' });

			spy(instance, 'validateStringForProperty');

			instance.validateFormat({ isRequired: false });

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'format', { isRequired: false });
		});
	});

	describe('validateYear method', () => {
		describe('year value equates to false', () => {
			it('will not call isValidYear function or addPropertyError method', async () => {
				const instance = new Material({ name: 'The Caretaker', year: '' });

				spy(instance, 'addPropertyError');

				instance.validateYear();

				sinonAssert.notCalled(stubs.isValidYear);
				sinonAssert.notCalled(instance.addPropertyError);
			});
		});

		describe('year value is not a valid year', () => {
			it('will call isValidYear function and addPropertyError method', async () => {
				const instance = new Material({ name: 'The Caretaker', year: 'Nineteen Fifty-Nine' });

				spy(instance, 'addPropertyError');

				instance.validateYear();

				sinonAssert.calledOnceWithExactly(stubs.isValidYear, 'Nineteen Fifty-Nine');
				sinonAssert.calledOnceWithExactly(instance.addPropertyError, 'year', 'Value must be a valid year');
			});
		});

		describe('year value is a valid year', () => {
			it('will call isValidYear function but not addPropertyError method', async () => {
				const instance = new Material({ name: 'The Caretaker', year: 1959 });

				spy(instance, 'addPropertyError');

				instance.validateYear();

				sinonAssert.calledOnceWithExactly(stubs.isValidYear, 1959);
				sinonAssert.notCalled(instance.addPropertyError);
			});
		});
	});

	describe('runDatabaseValidations method', () => {
		it("calls associated subMaterials' runDatabaseValidations method", async () => {
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

			stub(instance, 'validateUniquenessInDatabase');

			await instance.runDatabaseValidations();

			sinonAssert.calledOnceWithExactly(instance.validateUniquenessInDatabase);
			sinonAssert.calledOnceWithExactly(instance.originalVersionMaterial.runDatabaseValidations, {
				subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
			});
			sinonAssert.calledOnceWithExactly(instance.writingCredits[0].runDatabaseValidations, {
				subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
			});
			sinonAssert.calledOnceWithExactly(instance.subMaterials[0].runDatabaseValidations, {
				subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
			});
		});
	});
});

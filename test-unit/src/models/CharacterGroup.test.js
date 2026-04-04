import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { CharacterDepiction } from '../../../src/models/index.js';

describe('CharacterGroup model', () => {
	let stubs;
	let CharacterGroup;

	const CharacterDepictionStub = function () {
		return new CharacterDepiction();
	};

	beforeEach(async (test) => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateCharacterIndices: test.mock.fn(() => [])
			},
			models: {
				CharacterDepiction: CharacterDepictionStub
			}
		};

		CharacterGroup = await esmock(
			'../../../src/models/CharacterGroup.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	describe('constructor method', () => {
		describe('characters property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new CharacterGroup({ name: 'Montagues' });

				assert.deepEqual(instance.characters, []);
			});

			it('assigns array of characters if included in props, retaining those with empty or whitespace-only string names', async () => {
				const instance = new CharacterGroup({
					name: 'Montagues',
					characters: [
						{
							name: 'Romeo'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});

				assert.equal(instance.characters.length, 3);
				assert.equal(instance.characters[0] instanceof CharacterDepiction, true);
				assert.equal(instance.characters[1] instanceof CharacterDepiction, true);
				assert.equal(instance.characters[2] instanceof CharacterDepiction, true);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
			const instance = new CharacterGroup({
				name: 'Montagues',
				characters: [
					{
						name: 'Romeo'
					}
				]
			});
			const callOrder = [];

			const originalValidateName = instance.validateName;
			const originalValidateCharacterName = instance.characters[0].validateName;
			const originalValidateUnderlyingName = instance.characters[0].validateUnderlyingName;
			const originalValidateDifferentiator = instance.characters[0].validateDifferentiator;
			const originalValidateQualifier = instance.characters[0].validateQualifier;
			const originalValidateCharacterNameUnderlyingNameDisparity =
				instance.characters[0].validateCharacterNameUnderlyingNameDisparity;
			const originalValidateUniquenessInGroup = instance.characters[0].validateUniquenessInGroup;

			test.mock.method(instance, 'validateName', function (...args) {
				callOrder.push('instance.validateName');

				return originalValidateName.apply(this, args);
			});
			test.mock.method(stubs.getDuplicateIndicesModule, 'getDuplicateCharacterIndices', function (...args) {
				callOrder.push('stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices');

				return [];
			});
			test.mock.method(instance.characters[0], 'validateName', function (...args) {
				callOrder.push('instance.characters[0].validateName');

				return originalValidateCharacterName.apply(this, args);
			});
			test.mock.method(instance.characters[0], 'validateUnderlyingName', function (...args) {
				callOrder.push('instance.characters[0].validateUnderlyingName');

				return originalValidateUnderlyingName.apply(this, args);
			});
			test.mock.method(instance.characters[0], 'validateDifferentiator', function (...args) {
				callOrder.push('instance.characters[0].validateDifferentiator');

				return originalValidateDifferentiator.apply(this, args);
			});
			test.mock.method(instance.characters[0], 'validateQualifier', function (...args) {
				callOrder.push('instance.characters[0].validateQualifier');

				return originalValidateQualifier.apply(this, args);
			});
			test.mock.method(instance.characters[0], 'validateCharacterNameUnderlyingNameDisparity', function (...args) {
				callOrder.push('instance.characters[0].validateCharacterNameUnderlyingNameDisparity');

				return originalValidateCharacterNameUnderlyingNameDisparity.apply(this, args);
			});
			test.mock.method(instance.characters[0], 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.characters[0].validateUniquenessInGroup');

				return originalValidateUniquenessInGroup.apply(this, args);
			});

			instance.runInputValidations({ isDuplicate: false });

			assert.deepStrictEqual(callOrder, [
				'instance.validateName',
				'stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices',
				'instance.characters[0].validateName',
				'instance.characters[0].validateUnderlyingName',
				'instance.characters[0].validateDifferentiator',
				'instance.characters[0].validateQualifier',
				'instance.characters[0].validateCharacterNameUnderlyingNameDisparity',
				'instance.characters[0].validateUniquenessInGroup'
			]);
			assert.strictEqual(instance.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices.mock.calls.length, 1);
			assert.deepStrictEqual(
				stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices.mock.calls[0].arguments,
				[instance.characters]
			);
			assert.strictEqual(instance.characters[0].validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.characters[0].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.characters[0].validateUnderlyingName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.characters[0].validateUnderlyingName.mock.calls[0].arguments, []);
			assert.strictEqual(instance.characters[0].validateDifferentiator.mock.calls.length, 1);
			assert.deepStrictEqual(instance.characters[0].validateDifferentiator.mock.calls[0].arguments, []);
			assert.strictEqual(instance.characters[0].validateQualifier.mock.calls.length, 1);
			assert.deepStrictEqual(instance.characters[0].validateQualifier.mock.calls[0].arguments, []);
			assert.strictEqual(instance.characters[0].validateCharacterNameUnderlyingNameDisparity.mock.calls.length, 1);
			assert.deepStrictEqual(
				instance.characters[0].validateCharacterNameUnderlyingNameDisparity.mock.calls[0].arguments,
				[]
			);
			assert.strictEqual(instance.characters[0].validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.characters[0].validateUniquenessInGroup.mock.calls[0].arguments, [
				{
					isDuplicate: false
				}
			]);
		});
	});
});

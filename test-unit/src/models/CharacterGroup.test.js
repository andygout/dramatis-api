import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

import { CharacterDepiction } from '../../../src/models/index.js';

describe('CharacterGroup model', () => {
	let stubs;
	let CharacterGroup;

	const CharacterDepictionStub = function () {
		return createStubInstance(CharacterDepiction);
	};

	beforeEach(async () => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateCharacterIndices: stub().returns([])
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

	afterEach(() => {
		restore();
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
		it("calls instance's validate methods and associated models' validate methods", async () => {
			const instance = new CharacterGroup({
				name: 'Montagues',
				characters: [
					{
						name: 'Romeo'
					}
				]
			});

			spy(instance, 'validateName');

			instance.runInputValidations({ isDuplicate: false });

			sinonAssert.callOrder(
				instance.validateName,
				stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices,
				instance.characters[0].validateName,
				instance.characters[0].validateUnderlyingName,
				instance.characters[0].validateDifferentiator,
				instance.characters[0].validateQualifier,
				instance.characters[0].validateCharacterNameUnderlyingNameDisparity,
				instance.characters[0].validateUniquenessInGroup
			);
			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices,
				instance.characters
			);
			sinonAssert.calledOnceWithExactly(instance.characters[0].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.characters[0].validateUnderlyingName);
			sinonAssert.calledOnceWithExactly(instance.characters[0].validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.characters[0].validateQualifier);
			sinonAssert.calledOnceWithExactly(instance.characters[0].validateCharacterNameUnderlyingNameDisparity);
			sinonAssert.calledOnceWithExactly(instance.characters[0].validateUniquenessInGroup, {
				isDuplicate: false
			});
		});
	});
});

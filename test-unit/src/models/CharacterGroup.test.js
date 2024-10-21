import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CharacterDepiction } from '../../../src/models/index.js';

describe('CharacterGroup model', () => {

	let stubs;

	const CharacterDepictionStub = function () {

		return createStubInstance(CharacterDepiction);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateCharacterIndices: stub().returns([])
			},
			models: {
				CharacterDepiction: CharacterDepictionStub
			}
		};

	});

	const createSubject = () =>
		esmock(
			'../../../src/models/CharacterGroup.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/models/index.js': stubs.models
			}
		);

	describe('constructor method', () => {

		describe('characters property', () => {

			it('assigns empty array if absent from props', async () => {

				const CharacterGroup = await createSubject();
				const instance = new CharacterGroup({ name: 'Montagues' });
				expect(instance.characters).to.deep.equal([]);

			});

			it('assigns array of characters if included in props, retaining those with empty or whitespace-only string names', async () => {

				const CharacterGroup = await createSubject();
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
				expect(instance.characters.length).to.equal(3);
				expect(instance.characters[0] instanceof CharacterDepiction).to.be.true;
				expect(instance.characters[1] instanceof CharacterDepiction).to.be.true;
				expect(instance.characters[2] instanceof CharacterDepiction).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

			const CharacterGroup = await createSubject();
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
			assert.callOrder(
				instance.validateName,
				stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices,
				instance.characters[0].validateName,
				instance.characters[0].validateUnderlyingName,
				instance.characters[0].validateDifferentiator,
				instance.characters[0].validateQualifier,
				instance.characters[0].validateCharacterNameUnderlyingNameDisparity,
				instance.characters[0].validateUniquenessInGroup
			);
			assert.calledOnceWithExactly(instance.validateName, { isRequired: false });
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices,
				instance.characters
			);
			assert.calledOnceWithExactly(instance.characters[0].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.characters[0].validateUnderlyingName);
			assert.calledOnceWithExactly(instance.characters[0].validateDifferentiator);
			assert.calledOnceWithExactly(instance.characters[0].validateQualifier);
			assert.calledOnceWithExactly(instance.characters[0].validateCharacterNameUnderlyingNameDisparity);
			assert.calledOnceWithExactly(instance.characters[0].validateUniquenessInGroup, { isDuplicate: false });

		});

	});

});

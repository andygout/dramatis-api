import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CharacterDepiction } from '../../../src/models';

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
		proxyquire('../../../src/models/CharacterGroup', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const CharacterGroup = createSubject();

		return new CharacterGroup(props);

	};

	describe('constructor method', () => {

		describe('characters property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'Montagues' });
				expect(instance.characters).to.deep.equal([]);

			});

			it('assigns array of characters if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
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
				};
				const instance = createInstance(props);
				expect(instance.characters.length).to.equal(3);
				expect(instance.characters[0] instanceof CharacterDepiction).to.be.true;
				expect(instance.characters[1] instanceof CharacterDepiction).to.be.true;
				expect(instance.characters[2] instanceof CharacterDepiction).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', () => {

			const props = {
				name: 'Montagues',
				characters: [
					{
						name: 'Romeo'
					}
				]
			};
			const instance = createInstance(props);
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			instance.runInputValidations({ isDuplicate: false });
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices,
				instance.characters[0].validateName,
				instance.characters[0].validateUnderlyingName,
				instance.characters[0].validateDifferentiator,
				instance.characters[0].validateQualifier,
				instance.characters[0].validateCharacterNameUnderlyingNameDisparity,
				instance.characters[0].validateUniquenessInGroup
			);
			assert.calledOnce(instance.validateName);
			assert.calledWithExactly(instance.validateName, { isRequired: false });
			assert.calledOnce(stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateCharacterIndices,
				instance.characters
			);
			assert.calledOnce(instance.characters[0].validateName);
			assert.calledWithExactly(instance.characters[0].validateName, { isRequired: false });
			assert.calledOnce(instance.characters[0].validateUnderlyingName);
			assert.calledWithExactly(instance.characters[0].validateUnderlyingName);
			assert.calledOnce(instance.characters[0].validateDifferentiator);
			assert.calledWithExactly(instance.characters[0].validateDifferentiator);
			assert.calledOnce(instance.characters[0].validateQualifier);
			assert.calledWithExactly(instance.characters[0].validateQualifier);
			assert.calledOnce(instance.characters[0].validateCharacterNameUnderlyingNameDisparity);
			assert.calledWithExactly(instance.characters[0].validateCharacterNameUnderlyingNameDisparity);
			assert.calledOnce(instance.characters[0].validateUniquenessInGroup);
			assert.calledWithExactly(instance.characters[0].validateUniquenessInGroup, { isDuplicate: false });

		});

	});

});

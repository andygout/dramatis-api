import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CharacterGroup, MaterialBase, WritingCredit } from '../../../src/models';

describe('Material model', () => {

	let stubs;

	const CharacterGroupStub = function () {

		return createStubInstance(CharacterGroup);

	};

	const WritingCreditStub = function () {

		return createStubInstance(WritingCredit);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateNameIndices: stub().returns([])
			},
			isValidYearModule: {
				isValidYear: stub().returns(false)
			},
			models: {
				CharacterGroup: CharacterGroupStub,
				WritingCredit: WritingCreditStub
			}
		};

		stubs.isValidYearModule.isValidYear.withArgs(1959).returns(true);

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Material', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'../lib/is-valid-year': stubs.isValidYearModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const Material = createSubject();

		return new Material(props);

	};

	describe('constructor method', () => {

		describe('format property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark' });
				expect(instance.format).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark', format: '' });
				expect(instance.format).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark', format: ' ' });
				expect(instance.format).to.equal('');

			});

			it('assigns value if included in props and is string with length', () => {

				const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark', format: 'play' });
				expect(instance.format).to.equal('play');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark', format: ' play ' });
				expect(instance.format).to.equal('play');

			});

		});

		describe('year property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = createInstance({ name: 'The Caretaker' });
				expect(instance.year).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = createInstance({ name: 'The Caretaker', year: '' });
				expect(instance.year).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ name: 'The Caretaker', year: ' ' });
				expect(instance.year).to.equal('');

			});

			it('assigns value if included in props and cannot be parsed as integer', () => {

				const instance = createInstance({ name: 'The Caretaker', year: 'Nineteen Fifty-Nine' });
				expect(instance.year).to.equal('Nineteen Fifty-Nine');

			});

			it('assigns whitespace-trimmed value if included in props and value cannot be parsed as integer', () => {

				const instance = createInstance({ name: 'The Caretaker', year: ' Nineteen Fifty-Nine ' });
				expect(instance.year).to.equal('Nineteen Fifty-Nine');

			});

			it('assigns value converted to integer if included in props and value can be parsed as integer', () => {

				const instance = createInstance({ name: 'The Caretaker', year: '1959' });
				expect(instance.year).to.equal(1959);

			});

			it('assigns value with flanking whitespace converted to integer if included in props and value can be parsed as integer', () => {

				const instance = createInstance({ name: 'The Caretaker', year: ' 1959 ' });
				expect(instance.year).to.equal(1959);

			});

			it('assigns value if included in props and is an integer', () => {

				const instance = createInstance({ name: 'The Caretaker', year: 1959 });
				expect(instance.year).to.equal(1959);

			});

		});

		describe('originalVersionMaterial property', () => {

			it('assigns instance if absent from props', () => {

				const instance = createInstance({
					name: 'The Seagull',
					differentiator: '2'
				});
				expect(instance.originalVersionMaterial instanceof MaterialBase).to.be.true;

			});

			it('assigns instance if included in props', () => {

				const instance = createInstance({
					name: 'The Seagull',
					differentiator: '2',
					originalVersionMaterial: {
						name: 'The Seagull',
						differentiator: '1'
					}
				});
				expect(instance.originalVersionMaterial instanceof MaterialBase).to.be.true;

			});

		});

		describe('writingCredits property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark' });
				expect(instance.writingCredits).to.deep.equal([]);

			});

			it('assigns array of writingCredits if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'The Tragedy of Hamlet, Prince of Denmark',
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
				};
				const instance = createInstance(props);
				expect(instance.writingCredits.length).to.equal(3);
				expect(instance.writingCredits[0] instanceof WritingCredit).to.be.true;
				expect(instance.writingCredits[1] instanceof WritingCredit).to.be.true;
				expect(instance.writingCredits[2] instanceof WritingCredit).to.be.true;

			});

		});

		describe('sub-materials property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'The Coast of Utopia' });
				expect(instance.subMaterials).to.deep.equal([]);

			});

			it('assigns array of sub-materials if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
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
				};
				const instance = createInstance(props);
				expect(instance.subMaterials.length).to.equal(3);
				expect(instance.subMaterials[0] instanceof MaterialBase).to.be.true;
				expect(instance.subMaterials[1] instanceof MaterialBase).to.be.true;
				expect(instance.subMaterials[2] instanceof MaterialBase).to.be.true;

			});

		});

		describe('characterGroups property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark' });
				expect(instance.characterGroups).to.deep.equal([]);

			});

			it('assigns array of characterGroups if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'The Tragedy of Hamlet, Prince of Denmark',
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
				};
				const instance = createInstance(props);
				expect(instance.characterGroups.length).to.equal(3);
				expect(instance.characterGroups[0] instanceof CharacterGroup).to.be.true;
				expect(instance.characterGroups[1] instanceof CharacterGroup).to.be.true;
				expect(instance.characterGroups[2] instanceof CharacterGroup).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', () => {

			const props = {
				name: 'The Tragedy of Hamlet, Prince of Denmark',
				differentiator: '1',
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
			};
			const instance = createInstance(props);
			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			spy(instance, 'validateFormat');
			spy(instance, 'validateYear');
			spy(instance.originalVersionMaterial, 'validateName');
			spy(instance.originalVersionMaterial, 'validateDifferentiator');
			spy(instance.subMaterials[0], 'validateName');
			spy(instance.subMaterials[0], 'validateDifferentiator');
			spy(instance.subMaterials[0], 'validateNoAssociationWithSelf');
			spy(instance.subMaterials[0], 'validateUniquenessInGroup');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
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
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.characterGroups[0].runInputValidations
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.validateFormat.calledOnce).to.be.true;
			expect(instance.validateFormat.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.validateYear.calledOnce).to.be.true;
			expect(instance.validateYear.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.originalVersionMaterial.validateName.calledOnce).to.be.true;
			expect(instance.originalVersionMaterial.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.originalVersionMaterial.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.originalVersionMaterial.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.calledTwice).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices
				.firstCall.calledWithExactly(instance.writingCredits)
			).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices
				.secondCall.calledWithExactly(instance.characterGroups)
			).to.be.true;
			expect(instance.writingCredits[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.writingCredits[0].runInputValidations.calledWithExactly(
				{
					isDuplicate: false,
					subject: {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						differentiator: '1'
					}
				}
			)).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.calledWithExactly(
				instance.subMaterials
			)).to.be.true;
			expect(instance.subMaterials[0].validateName.calledOnce).to.be.true;
			expect(instance.subMaterials[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.subMaterials[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.subMaterials[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.subMaterials[0].validateNoAssociationWithSelf.calledOnce).to.be.true;
			expect(instance.subMaterials[0].validateNoAssociationWithSelf.calledWithExactly(
				{ name: 'The Tragedy of Hamlet, Prince of Denmark', differentiator: '1' }
			)).to.be.true;
			expect(instance.subMaterials[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.subMaterials[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.characterGroups[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.characterGroups[0].runInputValidations.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

	describe('validateFormat method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark', format: 'play' });
			spy(instance, 'validateStringForProperty');
			instance.validateFormat({ isRequired: false });
			expect(instance.validateStringForProperty.calledOnce).to.be.true;
			expect(instance.validateStringForProperty.calledWithExactly('format', { isRequired: false })).to.be.true;

		});

	});

	describe('validateYear method', () => {

		context('year value equates to false', () => {

			it('will not call isValidYear function or addPropertyError method', () => {

				const instance = createInstance({ name: 'The Caretaker', year: '' });
				spy(instance, 'addPropertyError');
				instance.validateYear();
				expect(stubs.isValidYearModule.isValidYear.notCalled).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

		context('year value is not a valid year', () => {

			it('will call isValidYear function and addPropertyError method', () => {

				const instance = createInstance({ name: 'The Caretaker', year: 'Nineteen Fifty-Nine' });
				spy(instance, 'addPropertyError');
				instance.validateYear();
				expect(stubs.isValidYearModule.isValidYear.calledOnce).to.be.true;
				expect(stubs.isValidYearModule.isValidYear.calledWithExactly('Nineteen Fifty-Nine')).to.be.true;
				expect(instance.addPropertyError.calledOnce).to.be.true;
				expect(instance.addPropertyError.calledWithExactly(
					'year', 'Value must be a valid year'
				)).to.be.true;

			});

		});

		context('year value is a valid year', () => {

			it('will call isValidYear function but not addPropertyError method', () => {

				const instance = createInstance({ name: 'The Caretaker', year: 1959 });
				spy(instance, 'addPropertyError');
				instance.validateYear();
				expect(stubs.isValidYearModule.isValidYear.calledOnce).to.be.true;
				expect(stubs.isValidYearModule.isValidYear.calledWithExactly(1959)).to.be.true;
				expect(instance.addPropertyError.notCalled).to.be.true;

			});

		});

	});

});

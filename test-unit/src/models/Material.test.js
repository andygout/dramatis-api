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
			assert.calledOnce(instance.validateName);
			assert.calledWithExactly(instance.validateName, { isRequired: true });
			assert.calledOnce(instance.validateDifferentiator);
			assert.calledWithExactly(instance.validateDifferentiator);
			assert.calledOnce(instance.validateFormat);
			assert.calledWithExactly(instance.validateFormat, { isRequired: false });
			assert.calledOnce(instance.validateYear);
			assert.calledWithExactly(instance.validateYear, { isRequired: false });
			assert.calledOnce(instance.originalVersionMaterial.validateName);
			assert.calledWithExactly(instance.originalVersionMaterial.validateName, { isRequired: false });
			assert.calledOnce(instance.originalVersionMaterial.validateDifferentiator);
			assert.calledWithExactly(instance.originalVersionMaterial.validateDifferentiator);
			assert.calledTwice(stubs.getDuplicateIndicesModule.getDuplicateNameIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.firstCall,
				instance.writingCredits
			);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices.secondCall,
				instance.characterGroups
			);
			assert.calledOnce(instance.writingCredits[0].runInputValidations);
			assert.calledWithExactly(
				instance.writingCredits[0].runInputValidations,
				{
					isDuplicate: false,
					subject: {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						differentiator: '1'
					}
				}
			);
			assert.calledOnce(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices);
			assert.calledWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.subMaterials
			);
			assert.calledOnce(instance.subMaterials[0].validateName);
			assert.calledWithExactly(instance.subMaterials[0].validateName, { isRequired: false });
			assert.calledOnce(instance.subMaterials[0].validateDifferentiator);
			assert.calledWithExactly(instance.subMaterials[0].validateDifferentiator);
			assert.calledOnce(instance.subMaterials[0].validateNoAssociationWithSelf);
			assert.calledWithExactly(
				instance.subMaterials[0].validateNoAssociationWithSelf,
				{ name: 'The Tragedy of Hamlet, Prince of Denmark', differentiator: '1' }
			);
			assert.calledOnce(instance.subMaterials[0].validateUniquenessInGroup);
			assert.calledWithExactly(
				instance.subMaterials[0].validateUniquenessInGroup,
				{ isDuplicate: false }
			);
			assert.calledOnce(instance.characterGroups[0].runInputValidations);
			assert.calledWithExactly(
				instance.characterGroups[0].runInputValidations,
				{ isDuplicate: false }
			);

		});

	});

	describe('validateFormat method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark', format: 'play' });
			spy(instance, 'validateStringForProperty');
			instance.validateFormat({ isRequired: false });
			assert.calledOnce(instance.validateStringForProperty);
			assert.calledWithExactly(
				instance.validateStringForProperty,
				'format', { isRequired: false }
			);

		});

	});

	describe('validateYear method', () => {

		context('year value equates to false', () => {

			it('will not call isValidYear function or addPropertyError method', () => {

				const instance = createInstance({ name: 'The Caretaker', year: '' });
				spy(instance, 'addPropertyError');
				instance.validateYear();
				assert.notCalled(stubs.isValidYearModule.isValidYear);
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('year value is not a valid year', () => {

			it('will call isValidYear function and addPropertyError method', () => {

				const instance = createInstance({ name: 'The Caretaker', year: 'Nineteen Fifty-Nine' });
				spy(instance, 'addPropertyError');
				instance.validateYear();
				assert.calledOnce(stubs.isValidYearModule.isValidYear);
				assert.calledWithExactly(stubs.isValidYearModule.isValidYear, 'Nineteen Fifty-Nine');
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'year', 'Value must be a valid year'
				);

			});

		});

		context('year value is a valid year', () => {

			it('will call isValidYear function but not addPropertyError method', () => {

				const instance = createInstance({ name: 'The Caretaker', year: 1959 });
				spy(instance, 'addPropertyError');
				instance.validateYear();
				assert.calledOnce(stubs.isValidYearModule.isValidYear);
				assert.calledWithExactly(stubs.isValidYearModule.isValidYear, 1959);
				assert.notCalled(instance.addPropertyError);

			});

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated sub-materials\' runDatabaseValidations method', async () => {

			const props = {
				uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
				name: 'The Coast of Utopia',
				subMaterials: [
					{
						name: 'Voyage'
					}
				]
			};
			const instance = createInstance(props);
			stub(instance, 'validateUniquenessInDatabase');
			stub(instance.subMaterials[0], 'runSubMaterialDatabaseValidations');
			await instance.runDatabaseValidations();
			assert.calledOnce(instance.validateUniquenessInDatabase);
			assert.calledWithExactly(instance.validateUniquenessInDatabase);
			assert.calledOnce(instance.subMaterials[0].runSubMaterialDatabaseValidations);
			assert.calledWithExactly(
				instance.subMaterials[0].runSubMaterialDatabaseValidations,
				{ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
			);

		});

	});

});

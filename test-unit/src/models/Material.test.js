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
				getDuplicateNameIndices: stub().returns([])
			},
			models: {
				CharacterGroup: CharacterGroupStub,
				WritingCredit: WritingCreditStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Material', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
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

			it('assigns value if included in props and value is string with length', () => {

				const instance = createInstance({
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					format: 'play'
				});
				expect(instance.format).to.equal('play');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({
					name: 'The Tragedy of Hamlet, Prince of Denmark',
					format: ' play '
				});
				expect(instance.format).to.equal('play');

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

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'The Tragedy of Hamlet, Prince of Denmark',
				differentiator: '1',
				writingCredits: [
					{
						name: 'version by'
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
			spy(instance.originalVersionMaterial, 'validateName');
			spy(instance.originalVersionMaterial, 'validateDifferentiator');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				instance.validateFormat,
				instance.originalVersionMaterial.validateName,
				instance.originalVersionMaterial.validateDifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.writingCredits[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateNameIndices,
				instance.characterGroups[0].runInputValidations
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.validateFormat.calledOnce).to.be.true;
			expect(instance.validateFormat.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.originalVersionMaterial.validateName.calledOnce).to.be.true;
			expect(instance.originalVersionMaterial.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.originalVersionMaterial.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.originalVersionMaterial.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices.calledTwice).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices
				.firstCall.calledWithExactly(instance.writingCredits)
			).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateNameIndices
				.secondCall.calledWithExactly(
			instance.characterGroups)).to.be.true;
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

});

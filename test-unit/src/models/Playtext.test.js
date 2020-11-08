import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Character, WriterGroup } from '../../../src/models';

describe('Playtext model', () => {

	let stubs;

	const CharacterStub = function () {

		return createStubInstance(Character);

	};

	const WriterGroupStub = function () {

		return createStubInstance(WriterGroup);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateBaseInstanceIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([])
			},
			getDuplicateCharacterIndicesModule: {
				getDuplicateCharacterIndices: stub().returns([])
			},
			models: {
				Character: CharacterStub,
				WriterGroup: WriterGroupStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Playtext', {
			'../lib/get-duplicate-base-instance-indices': stubs.getDuplicateBaseInstanceIndicesModule,
			'../lib/get-duplicate-character-indices': stubs.getDuplicateCharacterIndicesModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const Playtext = createSubject();

		return new Playtext(props);

	};

	describe('constructor method', () => {

		describe('differentiator property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = createInstance({ name: 'Home' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = createInstance({ name: 'Home', differentiator: '' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ name: 'Home', differentiator: ' ' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = createInstance({ name: 'Home', differentiator: '1' });
				expect(instance.differentiator).to.equal('1');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({ name: 'Home', differentiator: ' 1 ' });
				expect(instance.differentiator).to.equal('1');

			});

		});

		describe('writerGroups property', () => {

			context('instance is subject', () => {

				it('assigns empty array if absent from props', () => {

					const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark' });
					expect(instance.writerGroups).to.deep.equal([]);

				});

				it('assigns array of writerGroups if included in props, retaining those with empty or whitespace-only string names', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						writerGroups: [
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
					expect(instance.writerGroups.length).to.equal(3);
					expect(instance.writerGroups[0] instanceof WriterGroup).to.be.true;
					expect(instance.writerGroups[1] instanceof WriterGroup).to.be.true;
					expect(instance.writerGroups[2] instanceof WriterGroup).to.be.true;

				});

			});

			context('instance is not subject, i.e. it is an association of another instance', () => {

				it('will not assign any value if absent from props', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						isAssociation: true
					};
					const instance = createInstance(props);
					expect(instance).not.to.have.property('writerGroups');

				});

				it('will not assign any value if included in props', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						writerGroups: [
							{
								name: 'version by'
							}
						],
						isAssociation: true
					};
					const instance = createInstance(props);
					expect(instance).not.to.have.property('writerGroups');

				});

			});

		});

		describe('characters property', () => {

			context('instance is subject', () => {

				it('assigns empty array if absent from props', () => {

					const instance = createInstance({ name: 'The Tragedy of Hamlet, Prince of Denmark' });
					expect(instance.characters).to.deep.equal([]);

				});

				it('assigns array of characters if included in props, retaining those with empty or whitespace-only string names', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						characters: [
							{
								name: 'Hamlet'
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
					expect(instance.characters[0] instanceof Character).to.be.true;
					expect(instance.characters[1] instanceof Character).to.be.true;
					expect(instance.characters[2] instanceof Character).to.be.true;

				});

			});

			context('instance is not subject, i.e. it is an association of another instance', () => {

				it('will not assign any value if absent from props', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						isAssociation: true
					};
					const instance = createInstance(props);
					expect(instance).not.to.have.property('characters');

				});

				it('will not assign any value if included in props', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						characters: [
							{
								name: 'Hamlet'
							}
						],
						isAssociation: true
					};
					const instance = createInstance(props);
					expect(instance).not.to.have.property('characters');

				});

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'The Tragedy of Hamlet, Prince of Denmark',
				writerGroups: [
					{
						name: 'version by'
					}
				],
				characters: [
					{
						name: 'Hamlet'
					}
				]
			};
			const instance = createInstance(props);
			spy(instance, 'validateName');
			spy(instance, 'validateDifferentiator');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validateDifferentiator,
				stubs.getDuplicateBaseInstanceIndicesModule.getDuplicateBaseInstanceIndices,
				instance.writerGroups[0].runInputValidations,
				stubs.getDuplicateCharacterIndicesModule.getDuplicateCharacterIndices,
				instance.characters[0].validateName,
				instance.characters[0].validateUnderlyingName,
				instance.characters[0].validateDifferentiator,
				instance.characters[0].validateQualifier,
				instance.characters[0].validateGroup,
				instance.characters[0].validateCharacterNameUnderlyingNameDisparity,
				instance.characters[0].validateUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateBaseInstanceIndicesModule.getDuplicateBaseInstanceIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateBaseInstanceIndicesModule.getDuplicateBaseInstanceIndices.calledWithExactly(
				instance.writerGroups
			)).to.be.true;
			expect(instance.writerGroups[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.writerGroups[0].runInputValidations.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(stubs.getDuplicateCharacterIndicesModule.getDuplicateCharacterIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateCharacterIndicesModule.getDuplicateCharacterIndices.calledWithExactly(
				instance.characters
			)).to.be.true;
			expect(instance.characters[0].validateName.calledOnce).to.be.true;
			expect(instance.characters[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.characters[0].validateUnderlyingName.calledOnce).to.be.true;
			expect(instance.characters[0].validateUnderlyingName.calledWithExactly()).to.be.true;
			expect(instance.characters[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.characters[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.characters[0].validateQualifier.calledOnce).to.be.true;
			expect(instance.characters[0].validateQualifier.calledWithExactly()).to.be.true;
			expect(instance.characters[0].validateGroup.calledOnce).to.be.true;
			expect(instance.characters[0].validateGroup.calledWithExactly()).to.be.true;
			expect(instance.characters[0].validateCharacterNameUnderlyingNameDisparity.calledOnce).to.be.true;
			expect(instance.characters[0].validateCharacterNameUnderlyingNameDisparity.calledWithExactly()).to.be.true;
			expect(instance.characters[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.characters[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

});

import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CharacterGroup, WriterGroup } from '../../../src/models';

describe('Playtext model', () => {

	let stubs;

	const CharacterGroupStub = function () {

		return createStubInstance(CharacterGroup);

	};

	const WriterGroupStub = function () {

		return createStubInstance(WriterGroup);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([])
			},
			models: {
				CharacterGroup: CharacterGroupStub,
				WriterGroup: WriterGroupStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Playtext', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
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

		describe('characterGroups property', () => {

			context('instance is subject', () => {

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

			context('instance is not subject, i.e. it is an association of another instance', () => {

				it('will not assign any value if absent from props', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						isAssociation: true
					};
					const instance = createInstance(props);
					expect(instance).not.to.have.property('characterGroups');

				});

				it('will not assign any value if included in props', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						characterGroups: [
							{
								name: 'Court of Elsinore'
							}
						],
						isAssociation: true
					};
					const instance = createInstance(props);
					expect(instance).not.to.have.property('characterGroups');

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
				characterGroups: [
					{
						name: 'Court of Elsinore'
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
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.writerGroups[0].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.characterGroups[0].runInputValidations
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.validateDifferentiator.calledOnce).to.be.true;
			expect(instance.validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices.calledTwice).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices
				.firstCall.calledWithExactly(instance.writerGroups)
			).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices
				.secondCall.calledWithExactly(
			instance.characterGroups)).to.be.true;
			expect(instance.writerGroups[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.writerGroups[0].runInputValidations.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(instance.characterGroups[0].runInputValidations.calledOnce).to.be.true;
			expect(instance.characterGroups[0].runInputValidations.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

});

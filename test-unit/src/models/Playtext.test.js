import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Character } from '../../../src/models';

describe('Playtext model', () => {

	let stubs;
	let instance;

	const DEFAULT_INSTANCE_PROPS = {
		name: 'The Tragedy of Hamlet, Prince of Denmark',
		characters: [{ name: 'Hamlet' }]
	};

	const CharacterStub = function () {

		return createStubInstance(Character);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateIndices: stub().returns([])
			},
			Base: {
				validateStringModule: {
					validateString: stub()
				}
			},
			models: {
				Character: CharacterStub
			}
		};

		instance = createInstance();

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Playtext', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'./Base': proxyquire('../../../src/models/Base', {
				'../lib/validate-string': stubs.Base.validateStringModule
			}),
			'.': stubs.models
		}).default;

	const createInstance = (props = DEFAULT_INSTANCE_PROPS) => {

		const Playtext = createSubject();

		return new Playtext(props);

	};

	describe('constructor method', () => {

		context('instance is subject', () => {

			describe('characters property', () => {

				it('assigns empty array if absent from props', () => {

					const props = { name: 'The Tragedy of Hamlet, Prince of Denmark' };
					const instance = createInstance(props);
					expect(instance.characters).to.deep.equal([]);

				});

				it('assigns array of characters if included in props, retaining those with empty or whitespace-only string names', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						characters: [
							{ name: 'Hamlet' },
							{ name: '' },
							{ name: ' ' }
						]
					};
					const instance = createInstance(props);
					expect(instance.characters.length).to.equal(3);
					expect(instance.characters[0] instanceof Character).to.be.true;
					expect(instance.characters[1] instanceof Character).to.be.true;
					expect(instance.characters[2] instanceof Character).to.be.true;

				});

			});

		});

		context('instance is not subject, i.e. it is an association of another instance', () => {

			describe('characters property', () => {

				it('will not assign any value if absent from props', () => {

					const props = { name: 'The Tragedy of Hamlet, Prince of Denmark', isAssociation: true };
					const instance = createInstance(props);
					expect(instance).not.to.have.property('characters');

				});

				it('will not assign any value if included in props', () => {

					const props = {
						name: 'The Tragedy of Hamlet, Prince of Denmark',
						characters: [{ name: 'Hamlet' }],
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

			spy(instance, 'validateName');
			spy(instance, 'validatedifferentiator');
			instance.runInputValidations();
			assert.callOrder(
				instance.validateName,
				instance.validatedifferentiator,
				stubs.getDuplicateIndicesModule.getDuplicateIndices,
				instance.characters[0].validateName,
				instance.characters[0].validatedifferentiator,
				instance.characters[0].validateUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: true })).to.be.true;
			expect(instance.validatedifferentiator.calledOnce).to.be.true;
			expect(instance.validatedifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateIndices.calledWithExactly(
				instance.characters
			)).to.be.true;
			expect(instance.characters[0].validateName.calledOnce).to.be.true;
			expect(instance.characters[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.characters[0].validatedifferentiator.calledOnce).to.be.true;
			expect(instance.characters[0].validatedifferentiator.calledWithExactly()).to.be.true;
			expect(instance.characters[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.characters[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

});

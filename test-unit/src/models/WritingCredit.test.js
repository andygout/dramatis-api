import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Person, Material } from '../../../src/models';

describe('WritingCredit model', () => {

	let stubs;

	const MaterialStub = function () {

		return createStubInstance(Material);

	};

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateWritingEntityIndices: stub().returns([])
			},
			models: {
				Material: MaterialStub,
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/WritingCredit', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const WritingCredit = createSubject();

		return new WritingCredit(props);

	};

	describe('constructor method', () => {

		describe('creditType property', () => {

			it('assigns null if absent from props', () => {

				const instance = createInstance({ name: '' });
				expect(instance.creditType).to.equal(null);

			});

			it('assigns null if included in props but value is not an accepted credit type', () => {

				const instance = createInstance({ name: '', creditType: 'foobar' });
				expect(instance.creditType).to.equal(null);

			});

			it('assigns value if included in props and value is an accepted credit type', () => {

				const creditTypes = [
					'ORIGINAL_VERSION',
					'NON_SPECIFIC_SOURCE_MATERIAL'
				];

				creditTypes.forEach(creditType => {

					const instance = createInstance({ name: '', creditType });
					expect(instance.creditType).to.equal(creditType);

				});

			});

		});

		describe('writingEntities property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'version by' });
				expect(instance.writingEntities).to.deep.equal([]);

			});

			it('assigns array of writers and materials if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'version by',
					writingEntities: [
						{
							name: 'David Eldridge'
						},
						{
							model: 'material',
							name: 'A Midsummer Night\'s Dream'
						},
						{
							name: ''
						},
						{
							model: 'material',
							name: ''
						},
						{
							name: ' '
						},
						{
							model: 'material',
							name: ' '
						}
					]
				};
				const instance = createInstance(props);
				expect(instance.writingEntities.length).to.equal(6);
				expect(instance.writingEntities[0] instanceof Person).to.be.true;
				expect(instance.writingEntities[1] instanceof Material).to.be.true;
				expect(instance.writingEntities[2] instanceof Person).to.be.true;
				expect(instance.writingEntities[3] instanceof Material).to.be.true;
				expect(instance.writingEntities[4] instanceof Person).to.be.true;
				expect(instance.writingEntities[5] instanceof Material).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'version by',
				writingEntities: [
					{
						name: 'David Eldridge'
					},
					{
						model: 'material',
						name: 'A Midsummer Night\'s Dream'
					}
				]
			};
			const instance = createInstance(props);
			instance.writingEntities[1].model = 'material';
			instance.writingEntities[1].name = 'A Midsummer Night\'s Dream';
			instance.writingEntities[1].differentiator = '1';
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			instance.runInputValidations(
				{ isDuplicate: false, subject: { name: 'The Indian Boy', differentiator: '1' } }
			);
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				stubs.getDuplicateIndicesModule.getDuplicateWritingEntityIndices,
				instance.writingEntities[0].validateName,
				instance.writingEntities[0].validateDifferentiator,
				instance.writingEntities[0].validateUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateWritingEntityIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateWritingEntityIndices.calledWithExactly(
				instance.writingEntities
			)).to.be.true;
			expect(instance.writingEntities[0].validateName.calledOnce).to.be.true;
			expect(instance.writingEntities[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.writingEntities[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.writingEntities[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.writingEntities[0].validateNoAssociationWithSelf.notCalled).to.be.true;
			expect(instance.writingEntities[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.writingEntities[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.writingEntities[1].validateName.calledOnce).to.be.true;
			expect(instance.writingEntities[1].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.writingEntities[1].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.writingEntities[1].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.writingEntities[1].validateNoAssociationWithSelf.calledOnce).to.be.true;
			expect(instance.writingEntities[1].validateNoAssociationWithSelf.calledWithExactly(
				'The Indian Boy', '1'
			)).to.be.true;
			expect(instance.writingEntities[1].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.writingEntities[1].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

});

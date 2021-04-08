import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Company, Person, Material } from '../../../src/models';

describe('WritingCredit model', () => {

	let stubs;

	const CompanyStub = function () {

		return createStubInstance(Company);

	};

	const MaterialStub = function () {

		return createStubInstance(Material);

	};

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateEntityIndices: stub().returns([])
			},
			models: {
				Company: CompanyStub,
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
					'NON_SPECIFIC_SOURCE_MATERIAL',
					'RIGHTS_GRANTOR'
				];

				creditTypes.forEach(creditType => {

					const instance = createInstance({ name: '', creditType });
					expect(instance.creditType).to.equal(creditType);

				});

			});

		});

		describe('entities property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'version by' });
				expect(instance.entities).to.deep.equal([]);

			});

			it('assigns array of writers and materials if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'version by',
					entities: [
						{
							name: 'David Eldridge'
						},
						{
							model: 'company',
							name: 'Told by an Idiot'
						},
						{
							model: 'material',
							name: 'A Midsummer Night\'s Dream'
						},
						{
							name: ''
						},
						{
							model: 'company',
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
							model: 'company',
							name: ' '
						},
						{
							model: 'material',
							name: ' '
						}
					]
				};
				const instance = createInstance(props);
				expect(instance.entities.length).to.equal(9);
				expect(instance.entities[0] instanceof Person).to.be.true;
				expect(instance.entities[1] instanceof Company).to.be.true;
				expect(instance.entities[2] instanceof Material).to.be.true;
				expect(instance.entities[3] instanceof Person).to.be.true;
				expect(instance.entities[4] instanceof Company).to.be.true;
				expect(instance.entities[5] instanceof Material).to.be.true;
				expect(instance.entities[6] instanceof Person).to.be.true;
				expect(instance.entities[7] instanceof Company).to.be.true;
				expect(instance.entities[8] instanceof Material).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'version by',
				entities: [
					{
						name: 'David Eldridge'
					},
					{
						model: 'company',
						name: 'Told by an Idiot'
					},
					{
						model: 'material',
						name: 'A Midsummer Night\'s Dream'
					}
				]
			};
			const instance = createInstance(props);
			instance.entities[2].name = 'A Midsummer Night\'s Dream';
			instance.entities[2].differentiator = '1';
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			instance.runInputValidations(
				{ isDuplicate: false, subject: { name: 'The Indian Boy', differentiator: '1' } }
			);
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				stubs.getDuplicateIndicesModule.getDuplicateEntityIndices,
				instance.entities[0].validateName,
				instance.entities[0].validateDifferentiator,
				instance.entities[0].validateUniquenessInGroup,
				instance.entities[1].validateName,
				instance.entities[1].validateDifferentiator,
				instance.entities[1].validateUniquenessInGroup,
				instance.entities[2].validateName,
				instance.entities[2].validateDifferentiator,
				instance.entities[2].validateUniquenessInGroup,
				instance.entities[2].validateNoAssociationWithSelf
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateEntityIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateEntityIndices.calledWithExactly(
				instance.entities
			)).to.be.true;
			expect(instance.entities[0].validateName.calledOnce).to.be.true;
			expect(instance.entities[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.entities[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.entities[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.entities[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.entities[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.entities[0].validateNoAssociationWithSelf.notCalled).to.be.true;
			expect(instance.entities[1].validateName.calledOnce).to.be.true;
			expect(instance.entities[1].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.entities[1].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.entities[1].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.entities[1].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.entities[1].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.entities[1].validateNoAssociationWithSelf.notCalled).to.be.true;
			expect(instance.entities[2].validateName.calledOnce).to.be.true;
			expect(instance.entities[2].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.entities[2].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.entities[2].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.entities[2].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.entities[2].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.entities[2].validateNoAssociationWithSelf.calledOnce).to.be.true;
			expect(instance.entities[2].validateNoAssociationWithSelf.calledWithExactly(
				'The Indian Boy', '1'
			)).to.be.true;

		});

	});

});

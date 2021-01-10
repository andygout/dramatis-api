import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Person, Material } from '../../../src/models';

describe('WritingCredit model', () => {

	let stubs;

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateWritingEntityIndices: stub().returns([])
			},
			models: {
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

		describe('isOriginalVersionCredit property', () => {

			it('assigns null if absent from props', () => {

				const instance = createInstance({ name: 'version by' });
				expect(instance.isOriginalVersionCredit).to.equal(null);

			});

			it('assigns true if included in props and evaluates to true', () => {

				const props = {
					name: 'version by',
					isOriginalVersionCredit: true
				};
				const instance = createInstance(props);
				expect(instance.isOriginalVersionCredit).to.equal(true);

			});

			it('assigns null if included in props and evaluates to false', () => {

				const props = {
					name: 'version by',
					isOriginalVersionCredit: false
				};
				const instance = createInstance(props);
				expect(instance.isOriginalVersionCredit).to.equal(null);

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
							name: 'A Midsummer Night\'s Dream',
							model: 'material'
						},
						{
							name: ''
						},
						{
							name: '',
							model: 'material'
						},
						{
							name: ' '
						},
						{
							name: ' ',
							model: 'material'
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
			expect(instance.writingEntities[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.writingEntities[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

});

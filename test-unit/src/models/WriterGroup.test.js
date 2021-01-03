import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Person, Material } from '../../../src/models';

describe('WriterGroup model', () => {

	let stubs;

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateWriterIndices: stub().returns([])
			},
			models: {
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/WriterGroup', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const WriterGroup = createSubject();

		return new WriterGroup(props);

	};

	describe('constructor method', () => {

		describe('isOriginalVersionWriter property', () => {

			it('assigns null if absent from props', () => {

				const instance = createInstance({ name: 'version by' });
				expect(instance.isOriginalVersionWriter).to.equal(null);

			});

			it('assigns true if included in props and result of Boolean() evaluates to true', () => {

				const props = {
					name: 'version by',
					isOriginalVersionWriter: true
				};
				const instance = createInstance(props);
				expect(instance.isOriginalVersionWriter).to.equal(true);

			});

			it('assigns null if included in props and result of Boolean() evaluates to false', () => {

				const props = {
					name: 'version by',
					isOriginalVersionWriter: false
				};
				const instance = createInstance(props);
				expect(instance.isOriginalVersionWriter).to.equal(null);

			});

		});

		describe('writers property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'version by' });
				expect(instance.writers).to.deep.equal([]);

			});

			it('assigns array of writers and materials if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'version by',
					writers: [
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
				expect(instance.writers.length).to.equal(6);
				expect(instance.writers[0] instanceof Person).to.be.true;
				expect(instance.writers[1] instanceof Material).to.be.true;
				expect(instance.writers[2] instanceof Person).to.be.true;
				expect(instance.writers[3] instanceof Material).to.be.true;
				expect(instance.writers[4] instanceof Person).to.be.true;
				expect(instance.writers[5] instanceof Material).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'version by',
				writers: [
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
				stubs.getDuplicateIndicesModule.getDuplicateWriterIndices,
				instance.writers[0].validateName,
				instance.writers[0].validateDifferentiator,
				instance.writers[0].validateUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateWriterIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateWriterIndices.calledWithExactly(
				instance.writers
			)).to.be.true;
			expect(instance.writers[0].validateName.calledOnce).to.be.true;
			expect(instance.writers[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.writers[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.writers[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.writers[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.writers[0].validateUniquenessInGroup.calledWithExactly({ isDuplicate: false })).to.be.true;

		});

	});

});

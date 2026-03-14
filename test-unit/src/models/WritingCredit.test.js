import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

import { Company, Person, SourceMaterial } from '../../../src/models/index.js';

describe('WritingCredit model', () => {
	let stubs;
	let WritingCredit;

	const CompanyStub = function () {
		return createStubInstance(Company);
	};

	const SourceMaterialStub = function () {
		return createStubInstance(SourceMaterial);
	};

	const PersonStub = function () {
		return createStubInstance(Person);
	};

	beforeEach(async () => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateEntityIndices: stub().returns([])
			},
			models: {
				Company: CompanyStub,
				SourceMaterial: SourceMaterialStub,
				Person: PersonStub
			}
		};

		WritingCredit = await esmock(
			'../../../src/models/WritingCredit.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		describe('creditType property', () => {
			it('assigns null if absent from props', async () => {
				const instance = new WritingCredit({ name: '' });

				assert.equal(instance.creditType, null);
			});

			it('assigns null if included in props but value is not an accepted credit type', async () => {
				const instance = new WritingCredit({ name: '', creditType: 'foobar' });

				assert.equal(instance.creditType, null);
			});

			it('assigns value if included in props and is an accepted credit type', async () => {
				const creditTypes = ['NON_SPECIFIC_SOURCE_MATERIAL', 'RIGHTS_GRANTOR'];

				for (const creditType of creditTypes) {
					const instance = new WritingCredit({ name: '', creditType });

					assert.equal(instance.creditType, creditType);
				}
			});
		});

		describe('entities property', () => {
			it('assigns empty array if absent from props', async () => {
				const instance = new WritingCredit({ name: 'version by' });

				assert.deepEqual(instance.entities, []);
			});

			it('assigns array of writers and materials if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', async () => {
				const instance = new WritingCredit({
					name: 'version by',
					entities: [
						{
							name: 'David Eldridge'
						},
						{
							model: 'COMPANY',
							name: 'Told by an Idiot'
						},
						{
							model: 'MATERIAL',
							name: "A Midsummer Night's Dream"
						},
						{
							name: ''
						},
						{
							model: 'COMPANY',
							name: ''
						},
						{
							model: 'MATERIAL',
							name: ''
						},
						{
							name: ' '
						},
						{
							model: 'COMPANY',
							name: ' '
						},
						{
							model: 'MATERIAL',
							name: ' '
						}
					]
				});

				assert.equal(instance.entities.length, 9);
				assert.ok(instance.entities[0] instanceof Person);
				assert.ok(instance.entities[1] instanceof Company);
				assert.ok(instance.entities[2] instanceof SourceMaterial);
				assert.ok(instance.entities[3] instanceof Person);
				assert.ok(instance.entities[4] instanceof Company);
				assert.ok(instance.entities[5] instanceof SourceMaterial);
				assert.ok(instance.entities[6] instanceof Person);
				assert.ok(instance.entities[7] instanceof Company);
				assert.ok(instance.entities[8] instanceof SourceMaterial);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", async () => {
			const instance = new WritingCredit({
				name: 'version by',
				entities: [
					{
						name: 'David Eldridge'
					},
					{
						model: 'COMPANY',
						name: 'Told by an Idiot'
					},
					{
						model: 'MATERIAL',
						name: "A Midsummer Night's Dream"
					}
				]
			});

			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');

			instance.runInputValidations({
				isDuplicate: false,
				subject: { name: 'The Indian Boy', differentiator: '1' }
			});

			sinonAssert.callOrder(
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
			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateEntityIndices,
				instance.entities
			);
			sinonAssert.calledOnceWithExactly(instance.entities[0].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.entities[0].validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.entities[0].validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.notCalled(instance.entities[0].validateNoAssociationWithSelf);
			sinonAssert.calledOnceWithExactly(instance.entities[1].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.entities[1].validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.entities[1].validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.notCalled(instance.entities[1].validateNoAssociationWithSelf);
			sinonAssert.calledOnceWithExactly(instance.entities[2].validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.entities[2].validateDifferentiator);
			sinonAssert.calledOnceWithExactly(instance.entities[2].validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(instance.entities[2].validateNoAssociationWithSelf, {
				name: 'The Indian Boy',
				differentiator: '1'
			});
		});
	});

	describe('runDatabaseValidations method', () => {
		it("calls associated subMaterials' runDatabaseValidations method", async () => {
			const instance = new WritingCredit({
				name: 'version by',
				entities: [
					{
						name: 'David Eldridge'
					},
					{
						model: 'COMPANY',
						name: 'Told by an Idiot'
					},
					{
						model: 'MATERIAL',
						name: "A Midsummer Night's Dream"
					}
				]
			});

			await instance.runDatabaseValidations({ subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

			sinonAssert.notCalled(instance.entities[0].runDatabaseValidations);
			sinonAssert.notCalled(instance.entities[1].runDatabaseValidations);
			sinonAssert.calledOnceWithExactly(instance.entities[2].runDatabaseValidations, {
				subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
			});
		});
	});
});

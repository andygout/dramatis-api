import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { Company, Person, SourceMaterial } from '../../../src/models/index.js';

describe('WritingCredit model', () => {
	let stubs;
	let WritingCredit;

	const CompanyStub = function (props = {}) {
		const instance = new Company(props);

		instance.validateName = this.mock.fn();
		instance.validateDifferentiator = this.mock.fn();
		instance.validateUniquenessInGroup = this.mock.fn();
		instance.validateNoAssociationWithSelf = this.mock.fn();
		instance.runDatabaseValidations = this.mock.fn(async () => {});

		return instance;
	};

	const SourceMaterialStub = function (props = {}) {
		const instance = new SourceMaterial(props);

		instance.validateName = this.mock.fn();
		instance.validateDifferentiator = this.mock.fn();
		instance.validateUniquenessInGroup = this.mock.fn();
		instance.validateNoAssociationWithSelf = this.mock.fn();
		instance.runDatabaseValidations = this.mock.fn(async () => {});

		return instance;
	};

	const PersonStub = function (props = {}) {
		const instance = new Person(props);

		instance.validateName = this.mock.fn();
		instance.validateDifferentiator = this.mock.fn();
		instance.validateUniquenessInGroup = this.mock.fn();
		instance.validateNoAssociationWithSelf = this.mock.fn();
		instance.runDatabaseValidations = this.mock.fn(async () => {});

		return instance;
	};

	beforeEach(async (test) => {
		stubs = {
			getDuplicateIndicesModule: {
				getDuplicateEntityIndices: test.mock.fn(() => [])
			},
			models: {
				Company: CompanyStub.bind(test),
				SourceMaterial: SourceMaterialStub.bind(test),
				Person: PersonStub.bind(test)
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
		it("calls instance's validate methods and associated models' validate methods", async (test) => {
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

			test.mock.method(instance, 'validateName');
			test.mock.method(instance, 'validateUniquenessInGroup');

			instance.runInputValidations({
				isDuplicate: false,
				subject: { name: 'The Indian Boy', differentiator: '1' }
			});

			assert.equal(instance.validateName.mock.callCount(), 1);
			assert.deepEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.equal(stubs.getDuplicateIndicesModule.getDuplicateEntityIndices.mock.callCount(), 1);
			assert.deepEqual(
				stubs.getDuplicateIndicesModule.getDuplicateEntityIndices.mock.calls[0].arguments,
				[instance.entities]
			);
			assert.equal(instance.entities[0].validateName.mock.callCount(), 1);
			assert.deepEqual(instance.entities[0].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.equal(instance.entities[0].validateDifferentiator.mock.callCount(), 1);
			assert.deepEqual(instance.entities[0].validateDifferentiator.mock.calls[0].arguments, []);
			assert.equal(instance.entities[0].validateUniquenessInGroup.mock.callCount(), 1);
			assert.deepEqual(instance.entities[0].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
			assert.equal(instance.entities[0].validateNoAssociationWithSelf.mock.callCount(), 0);
			assert.equal(instance.entities[1].validateName.mock.callCount(), 1);
			assert.deepEqual(instance.entities[1].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.equal(instance.entities[1].validateDifferentiator.mock.callCount(), 1);
			assert.deepEqual(instance.entities[1].validateDifferentiator.mock.calls[0].arguments, []);
			assert.equal(instance.entities[1].validateUniquenessInGroup.mock.callCount(), 1);
			assert.deepEqual(instance.entities[1].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
			assert.equal(instance.entities[1].validateNoAssociationWithSelf.mock.callCount(), 0);
			assert.equal(instance.entities[2].validateName.mock.callCount(), 1);
			assert.deepEqual(instance.entities[2].validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.equal(instance.entities[2].validateDifferentiator.mock.callCount(), 1);
			assert.deepEqual(instance.entities[2].validateDifferentiator.mock.calls[0].arguments, []);
			assert.equal(instance.entities[2].validateUniquenessInGroup.mock.callCount(), 1);
			assert.deepEqual(instance.entities[2].validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
			assert.equal(instance.entities[2].validateNoAssociationWithSelf.mock.callCount(), 1);
			assert.deepEqual(instance.entities[2].validateNoAssociationWithSelf.mock.calls[0].arguments, [{
				name: 'The Indian Boy',
				differentiator: '1'
			}]);
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

			assert.equal(instance.entities[0].runDatabaseValidations.mock.callCount(), 0);
			assert.equal(instance.entities[1].runDatabaseValidations.mock.callCount(), 0);
			assert.equal(instance.entities[2].runDatabaseValidations.mock.callCount(), 1);
			assert.deepEqual(instance.entities[2].runDatabaseValidations.mock.calls[0].arguments, [{
				subjectMaterialUuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
			}]);
		});
	});
});

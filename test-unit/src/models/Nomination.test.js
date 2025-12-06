import { expect } from 'chai';
import esmock from 'esmock';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CompanyWithMembers, MaterialBase, NominatedProductionIdentifier, Person } from '../../../src/models/index.js';

describe('Nomination model', () => {

	let stubs;

	const CompanyWithMembersStub = function () {

		return createStubInstance(CompanyWithMembers);

	};

	const MaterialBaseStub = function () {

		return createStubInstance(MaterialBase);

	};

	const NominatedProductionIdentifierStub = function () {

		return createStubInstance(NominatedProductionIdentifier);

	};

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateEntityInfoModule: {
				getDuplicateEntities: stub().returns('getDuplicateEntities response'),
				isEntityInArray: stub().returns(false)
			},
			getDuplicateIndicesModule: {
				getDuplicateBaseInstanceIndices: stub().returns([]),
				getDuplicateUuidIndices: stub().returns([])
			},
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake(arg => arg?.trim() || '')
			},
			models: {
				CompanyWithMembers: CompanyWithMembersStub,
				MaterialBase: MaterialBaseStub,
				NominatedProductionIdentifier: NominatedProductionIdentifierStub,
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		esmock(
			'../../../src/models/Nomination.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/get-duplicate-entity-info.js': stubs.getDuplicateEntityInfoModule,
				'../../../src/lib/get-duplicate-indices.js': stubs.getDuplicateIndicesModule,
				'../../../src/lib/strings.js': stubs.stringsModule,
				'../../../src/models/index.js': stubs.models
			}
		);

	describe('constructor method', () => {

		describe('isWinner property', () => {

			it('assigns false if absent from props', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({});

				expect(instance.isWinner).to.equal(false);

			});

			it('assigns false if included in props but value evaluates to false', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({ isWinner: null });

				expect(instance.isWinner).to.equal(false);

			});

			it('assigns false if included in props but value is false', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({ isWinner: false });

				expect(instance.isWinner).to.equal(false);

			});

			it('assigns true if included in props and value evaluates to true', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({ isWinner: 'foobar' });

				expect(instance.isWinner).to.equal(true);

			});

			it('assigns true if included in props and is true', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({ isWinner: true });

				expect(instance.isWinner).to.equal(true);

			});

		});

		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {

			const Nomination = await createSubject();

			new Nomination();

			expect(stubs.stringsModule.getTrimmedOrEmptyString.callCount).to.equal(1);

		});

		describe('customType property', () => {

			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({ customType: 'Shortlisted' });

				assert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.firstCall, 'Shortlisted');
				expect(instance.customType).to.equal('Shortlisted');

			});

		});

		describe('entities property', () => {

			it('assigns empty array if absent from props', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({});

				expect(instance.entities).to.deep.equal([]);

			});

			it('assigns array of entities if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({
					entities: [
						{
							name: 'Simon Baker'
						},
						{
							model: 'COMPANY',
							name: 'Autograph'
						},
						{
							name: ''
						},
						{
							model: 'COMPANY',
							name: ''
						},
						{
							name: ' '
						},
						{
							model: 'COMPANY',
							name: ' '
						}
					]
				});

				expect(instance.entities.length).to.equal(6);
				expect(instance.entities[0] instanceof Person).to.be.true;
				expect(instance.entities[1] instanceof CompanyWithMembers).to.be.true;
				expect(instance.entities[2] instanceof Person).to.be.true;
				expect(instance.entities[3] instanceof CompanyWithMembers).to.be.true;
				expect(instance.entities[4] instanceof Person).to.be.true;
				expect(instance.entities[5] instanceof CompanyWithMembers).to.be.true;

			});

		});

		describe('productions property', () => {

			it('assigns empty array if absent from props', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({});

				expect(instance.productions).to.deep.equal([]);

			});

			it('assigns array of productions if included in props, retaining those with empty or whitespace-only string uuids', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({
					productions: [
						{
							uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
						},
						{
							uuid: ''
						},
						{
							uuid: ' '
						}
					]
				});

				expect(instance.productions.length).to.equal(3);
				expect(instance.productions[0] instanceof NominatedProductionIdentifier).to.be.true;
				expect(instance.productions[1] instanceof NominatedProductionIdentifier).to.be.true;
				expect(instance.productions[2] instanceof NominatedProductionIdentifier).to.be.true;

			});

		});

		describe('materials property', () => {

			it('assigns empty array if absent from props', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({});

				expect(instance.materials).to.deep.equal([]);

			});

			it('assigns array of materials if included in props, retaining those with empty or whitespace-only string names', async () => {

				const Nomination = await createSubject();

				const instance = new Nomination({
					materials: [
						{
							name: 'Baghdad Wedding'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				});

				expect(instance.materials.length).to.equal(3);
				expect(instance.materials[0] instanceof MaterialBase).to.be.true;
				expect(instance.materials[1] instanceof MaterialBase).to.be.true;
				expect(instance.materials[2] instanceof MaterialBase).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance\'s validate methods and associated models\' validate methods', async () => {

			const Nomination = await createSubject();

			const instance = new Nomination({
				customType: 'Shortlisted',
				entities: [
					{
						name: 'Simon Baker'
					},
					{
						model: 'COMPANY',
						name: 'Autograph'
					}
				],
				productions: [
					{
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				],
				materials: [
					{
						name: 'Baghdad Wedding'
					}
				]
			});

			spy(instance, 'validateCustomType');

			instance.runInputValidations();

			assert.callOrder(
				instance.validateCustomType,
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities[0].validateName,
				instance.entities[0].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[0].validateUniquenessInGroup,
				instance.entities[1].validateName,
				instance.entities[1].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[1].validateUniquenessInGroup,
				instance.entities[1].runInputValidations,
				stubs.getDuplicateIndicesModule.getDuplicateUuidIndices,
				instance.productions[0].validateUuid,
				instance.productions[0].validateUniquenessInGroup,
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.materials[0].validateName,
				instance.materials[0].validateDifferentiator,
				instance.materials[0].validateUniquenessInGroup
			);
			assert.calledOnceWithExactly(instance.validateCustomType, { isRequired: false });
			assert.calledOnceWithExactly(
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities
			);
			assert.calledOnceWithExactly(instance.entities[0].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.entities[0].validateDifferentiator);
			assert.calledTwice(stubs.getDuplicateEntityInfoModule.isEntityInArray);
			assert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray.firstCall,
				instance.entities[0], 'getDuplicateEntities response'
			);
			assert.calledOnceWithExactly(instance.entities[0].validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnceWithExactly(instance.entities[1].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.entities[1].validateDifferentiator);
			assert.calledWithExactly(
				stubs.getDuplicateEntityInfoModule.isEntityInArray.secondCall,
				instance.entities[1], 'getDuplicateEntities response'
			);
			assert.calledOnceWithExactly(instance.entities[1].validateUniquenessInGroup, { isDuplicate: false });
			assert.calledOnceWithExactly(
				instance.entities[1].runInputValidations,
				{ duplicateEntities: 'getDuplicateEntities response' }
			);
			assert.calledOnceWithExactly(stubs.getDuplicateIndicesModule.getDuplicateUuidIndices, instance.productions);
			assert.calledOnceWithExactly(instance.productions[0].validateUuid);
			assert.calledOnceWithExactly(
				instance.productions[0].validateUniquenessInGroup,
				{ isDuplicate: false, properties: new Set(['uuid']) }
			);
			assert.calledOnceWithExactly(
				stubs.getDuplicateIndicesModule.getDuplicateBaseInstanceIndices,
				instance.materials
			);
			assert.calledOnceWithExactly(instance.materials[0].validateName, { isRequired: false });
			assert.calledOnceWithExactly(instance.materials[0].validateDifferentiator);
			assert.calledOnceWithExactly(
				instance.materials[0].validateUniquenessInGroup,
				{ isDuplicate: false }
			);

		});

	});

	describe('validateCustomType method', () => {

		it('will call validateStringForProperty method', async () => {

			const Nomination = await createSubject();

			const instance = new Nomination({ customType: 'Shortlisted' });

			spy(instance, 'validateStringForProperty');

			instance.validateCustomType({ isRequired: false });

			assert.calledOnceWithExactly(
				instance.validateStringForProperty,
				'customType', { isRequired: false }
			);

		});

	});

	describe('runDatabaseValidations method', () => {

		it('calls associated productions\' runDatabaseValidations method', async () => {

			const Nomination = await createSubject();

			const instance = new Nomination({
				productions: [
					{
						uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
					}
				]
			});

			await instance.runDatabaseValidations();

			assert.calledOnceWithExactly(instance.productions[0].runDatabaseValidations);

		});

	});

});

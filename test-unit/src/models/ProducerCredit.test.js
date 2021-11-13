import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { CompanyWithMembers, Person } from '../../../src/models';

describe('ProducerCredit model', () => {

	let stubs;

	const CompanyWithMembersStub = function () {

		return createStubInstance(CompanyWithMembers);

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
			models: {
				CompanyWithMembers: CompanyWithMembersStub,
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/ProducerCredit', {
			'../lib/get-duplicate-entity-info': stubs.getDuplicateEntityInfoModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const ProducerCredit = createSubject();

		return new ProducerCredit(props);

	};

	describe('constructor method', () => {

		describe('entities property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'in association with' });
				expect(instance.entities).to.deep.equal([]);

			});

			it('assigns array of producers if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'in association with',
					entities: [
						{
							name: 'Jason Haigh-Ellery'
						},
						{
							model: 'COMPANY',
							name: 'Stage Entertainment UK'
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
				};
				const instance = createInstance(props);
				expect(instance.entities.length).to.equal(6);
				expect(instance.entities[0] instanceof Person).to.be.true;
				expect(instance.entities[1] instanceof CompanyWithMembers).to.be.true;
				expect(instance.entities[2] instanceof Person).to.be.true;
				expect(instance.entities[3] instanceof CompanyWithMembers).to.be.true;
				expect(instance.entities[4] instanceof Person).to.be.true;
				expect(instance.entities[5] instanceof CompanyWithMembers).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'in association with',
				entities: [
					{
						name: 'Jason Haigh-Ellery'
					},
					{
						model: 'COMPANY',
						name: 'Fiery Angel'
					}
				]
			};
			const instance = createInstance(props);
			instance.entities[0].name = 'Jason Haigh-Ellery';
			instance.entities[1].name = 'Fiery Angel';
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			instance.runInputValidations({ isDuplicate: false });
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				stubs.getDuplicateEntityInfoModule.getDuplicateEntities,
				instance.entities[0].validateName,
				instance.entities[0].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[0].validateUniquenessInGroup,
				instance.entities[1].validateName,
				instance.entities[1].validateDifferentiator,
				stubs.getDuplicateEntityInfoModule.isEntityInArray,
				instance.entities[1].validateUniquenessInGroup,
				instance.entities[1].runInputValidations
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.validateUniquenessInGroup.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(stubs.getDuplicateEntityInfoModule.getDuplicateEntities.calledOnce).to.be.true;
			expect(stubs.getDuplicateEntityInfoModule.getDuplicateEntities.calledWithExactly(
				instance.entities
			)).to.be.true;
			expect(instance.entities[0].validateName.calledOnce).to.be.true;
			expect(instance.entities[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.entities[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.entities[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateEntityInfoModule.isEntityInArray.calledTwice).to.be.true;
			expect(stubs.getDuplicateEntityInfoModule.isEntityInArray.getCall(0).calledWithExactly(
				instance.entities[0], 'getDuplicateEntities response'
			)).to.be.true;
			expect(instance.entities[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.entities[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.entities[1].validateName.calledOnce).to.be.true;
			expect(instance.entities[1].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.entities[1].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.entities[1].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateEntityInfoModule.isEntityInArray.getCall(1).calledWithExactly(
				instance.entities[1], 'getDuplicateEntities response'
			)).to.be.true;
			expect(instance.entities[1].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.entities[1].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.entities[1].runInputValidations.calledOnce).to.be.true;
			expect(instance.entities[1].runInputValidations.calledWithExactly(
				{ duplicateEntities: 'getDuplicateEntities response' }
			)).to.be.true;

		});

	});

});

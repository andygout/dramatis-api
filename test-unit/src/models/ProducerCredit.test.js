import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Company, Person } from '../../../src/models';

describe('ProducerCredit model', () => {

	let stubs;

	const CompanyStub = function () {

		return createStubInstance(Company);

	};

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicatesInfoModule: {
				getDuplicateEntities: stub().returns('getDuplicateEntities response'),
				isEntityInArray: stub().returns(false)
			},
			models: {
				Company: CompanyStub,
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/ProducerCredit', {
			'../lib/get-duplicate-entity-info': stubs.getDuplicatesInfoModule,
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
							model: 'company',
							name: 'Stage Entertainment UK'
						},
						{
							name: ''
						},
						{
							model: 'company',
							name: ''
						},
						{
							name: ' '
						},
						{
							model: 'company',
							name: ' '
						}
					]
				};
				const instance = createInstance(props);
				expect(instance.entities.length).to.equal(6);
				expect(instance.entities[0] instanceof Person).to.be.true;
				expect(instance.entities[1] instanceof Company).to.be.true;
				expect(instance.entities[2] instanceof Person).to.be.true;
				expect(instance.entities[3] instanceof Company).to.be.true;
				expect(instance.entities[4] instanceof Person).to.be.true;
				expect(instance.entities[5] instanceof Company).to.be.true;

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
						model: 'company',
						name: 'Fiery Angel',
						creditedMembers: [
							{
								name: 'Edward Snape'
							}
						]
					}
				]
			};
			const instance = createInstance(props);
			instance.entities[0].name = 'Jason Haigh-Ellery';
			instance.entities[1].name = 'Fiery Angel';
			instance.entities[1].creditedMembers = [createStubInstance(Person)];
			instance.entities[1].creditedMembers[0].name = 'Edward Snape';
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			spy(instance, 'validateNamePresenceIfNamedChildren');
			instance.runInputValidations({ isDuplicate: false });
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				stubs.getDuplicatesInfoModule.getDuplicateEntities,
				instance.entities[0].validateName,
				instance.entities[0].validateDifferentiator,
				stubs.getDuplicatesInfoModule.isEntityInArray,
				instance.entities[0].validateUniquenessInGroup,
				instance.entities[1].validateName,
				instance.entities[1].validateDifferentiator,
				stubs.getDuplicatesInfoModule.isEntityInArray,
				instance.entities[1].validateUniquenessInGroup,
				instance.entities[1].validateNamePresenceIfNamedChildren,
				instance.entities[1].creditedMembers[0].validateName,
				instance.entities[1].creditedMembers[0].validateDifferentiator,
				stubs.getDuplicatesInfoModule.isEntityInArray,
				instance.entities[1].creditedMembers[0].validateUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.validateUniquenessInGroup.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(stubs.getDuplicatesInfoModule.getDuplicateEntities.calledOnce).to.be.true;
			expect(stubs.getDuplicatesInfoModule.getDuplicateEntities.calledWithExactly(
				instance.entities
			)).to.be.true;
			expect(instance.entities[0].validateName.calledOnce).to.be.true;
			expect(instance.entities[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.entities[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.entities[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicatesInfoModule.isEntityInArray.calledThrice).to.be.true;
			expect(stubs.getDuplicatesInfoModule.isEntityInArray.getCall(0).calledWithExactly(
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
			expect(stubs.getDuplicatesInfoModule.isEntityInArray.getCall(1).calledWithExactly(
				instance.entities[1], 'getDuplicateEntities response'
			)).to.be.true;
			expect(instance.entities[1].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.entities[1].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.entities[1].validateNamePresenceIfNamedChildren.calledOnce).to.be.true;
			expect(instance.entities[1].validateNamePresenceIfNamedChildren.calledWithExactly(
				instance.entities[1].creditedMembers
			)).to.be.true;
			expect(instance.entities[1].creditedMembers[0].validateName.calledOnce).to.be.true;
			expect(instance.entities[1].creditedMembers[0].validateName.calledWithExactly(
				{ isRequired: false }
			)).to.be.true;
			expect(instance.entities[1].creditedMembers[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.entities[1].creditedMembers[0].validateDifferentiator.calledWithExactly())
				.to.be.true;
			expect(stubs.getDuplicatesInfoModule.isEntityInArray.getCall(2).calledWithExactly(
				instance.entities[1].creditedMembers[0], 'getDuplicateEntities response'
			)).to.be.true;
			expect(instance.entities[1].creditedMembers[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.entities[1].creditedMembers[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

});

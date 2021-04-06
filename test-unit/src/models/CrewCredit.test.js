import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Company, Person } from '../../../src/models';

describe('CrewCredit model', () => {

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
		proxyquire('../../../src/models/CrewCredit', {
			'../lib/get-duplicate-entity-info': stubs.getDuplicatesInfoModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const CrewCredit = createSubject();

		return new CrewCredit(props);

	};

	describe('constructor method', () => {

		describe('crewEntities property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'Sound Designers' });
				expect(instance.crewEntities).to.deep.equal([]);

			});

			it('assigns array of creatives and materials if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Assistant Stage Managers',
					crewEntities: [
						{
							name: 'Sara Gunter'
						},
						{
							model: 'company',
							name: 'Assistant Stage Managers Ltd'
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
				expect(instance.crewEntities.length).to.equal(6);
				expect(instance.crewEntities[0] instanceof Person).to.be.true;
				expect(instance.crewEntities[1] instanceof Company).to.be.true;
				expect(instance.crewEntities[2] instanceof Person).to.be.true;
				expect(instance.crewEntities[3] instanceof Company).to.be.true;
				expect(instance.crewEntities[4] instanceof Person).to.be.true;
				expect(instance.crewEntities[5] instanceof Company).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'Assistant Stage Managers ',
				crewEntities: [
					{
						name: 'Sara Gunter'
					},
					{
						model: 'company',
						name: 'Assistant Stage Managers Ltd',
						creditedMembers: [
							{
								name: 'Julia Wickham'
							}
						]
					}
				]
			};
			const instance = createInstance(props);
			instance.crewEntities[0].name = 'Sara Gunter';
			instance.crewEntities[1].name = 'Assistant Stage Managers Ltd';
			instance.crewEntities[1].creditedMembers = [createStubInstance(Person)];
			instance.crewEntities[1].creditedMembers[0].name = 'Julia Wickham';
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			spy(instance, 'validateNamePresenceIfNamedChildren');
			instance.runInputValidations({ isDuplicate: false });
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				instance.validateNamePresenceIfNamedChildren,
				stubs.getDuplicatesInfoModule.getDuplicateEntities,
				instance.crewEntities[0].validateName,
				instance.crewEntities[0].validateDifferentiator,
				stubs.getDuplicatesInfoModule.isEntityInArray,
				instance.crewEntities[0].validateUniquenessInGroup,
				instance.crewEntities[1].validateName,
				instance.crewEntities[1].validateDifferentiator,
				stubs.getDuplicatesInfoModule.isEntityInArray,
				instance.crewEntities[1].validateUniquenessInGroup,
				instance.crewEntities[1].validateNamePresenceIfNamedChildren,
				instance.crewEntities[1].creditedMembers[0].validateName,
				instance.crewEntities[1].creditedMembers[0].validateDifferentiator,
				stubs.getDuplicatesInfoModule.isEntityInArray,
				instance.crewEntities[1].creditedMembers[0].validateUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.validateUniquenessInGroup.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(instance.validateNamePresenceIfNamedChildren.calledOnce).to.be.true;
			expect(instance.validateNamePresenceIfNamedChildren.calledWithExactly(
				instance.crewEntities
			)).to.be.true;
			expect(stubs.getDuplicatesInfoModule.getDuplicateEntities.calledOnce).to.be.true;
			expect(stubs.getDuplicatesInfoModule.getDuplicateEntities.calledWithExactly(
				instance.crewEntities
			)).to.be.true;
			expect(instance.crewEntities[0].validateName.calledOnce).to.be.true;
			expect(instance.crewEntities[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.crewEntities[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.crewEntities[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicatesInfoModule.isEntityInArray.calledThrice).to.be.true;
			expect(stubs.getDuplicatesInfoModule.isEntityInArray.getCall(0).calledWithExactly(
				instance.crewEntities[0], 'getDuplicateEntities response'
			)).to.be.true;
			expect(instance.crewEntities[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.crewEntities[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.crewEntities[1].validateName.calledOnce).to.be.true;
			expect(instance.crewEntities[1].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.crewEntities[1].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.crewEntities[1].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicatesInfoModule.isEntityInArray.getCall(1).calledWithExactly(
				instance.crewEntities[1], 'getDuplicateEntities response'
			)).to.be.true;
			expect(instance.crewEntities[1].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.crewEntities[1].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.crewEntities[1].validateNamePresenceIfNamedChildren.calledOnce).to.be.true;
			expect(instance.crewEntities[1].validateNamePresenceIfNamedChildren.calledWithExactly(
				instance.crewEntities[1].creditedMembers
			)).to.be.true;
			expect(instance.crewEntities[1].creditedMembers[0].validateName.calledOnce).to.be.true;
			expect(instance.crewEntities[1].creditedMembers[0].validateName.calledWithExactly(
				{ isRequired: false }
			)).to.be.true;
			expect(instance.crewEntities[1].creditedMembers[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.crewEntities[1].creditedMembers[0].validateDifferentiator.calledWithExactly())
				.to.be.true;
			expect(stubs.getDuplicatesInfoModule.isEntityInArray.getCall(2).calledWithExactly(
				instance.crewEntities[1].creditedMembers[0], 'getDuplicateEntities response'
			)).to.be.true;
			expect(instance.crewEntities[1].creditedMembers[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.crewEntities[1].creditedMembers[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

});

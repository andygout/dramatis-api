import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Company, Person } from '../../../src/models';

describe('CreativeCredit model', () => {

	let stubs;

	const CompanyStub = function () {

		return createStubInstance(Company);

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
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/CreativeCredit', {
			'../lib/get-duplicate-indices': stubs.getDuplicateIndicesModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const CreativeCredit = createSubject();

		return new CreativeCredit(props);

	};

	describe('constructor method', () => {

		describe('creativeEntities property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'Sound Designers' });
				expect(instance.creativeEntities).to.deep.equal([]);

			});

			it('assigns array of creatives and materials if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Sound Designers',
					creativeEntities: [
						{
							name: 'Paul Arditti'
						},
						{
							model: 'company',
							name: 'Autograph'
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
				expect(instance.creativeEntities.length).to.equal(6);
				expect(instance.creativeEntities[0] instanceof Person).to.be.true;
				expect(instance.creativeEntities[1] instanceof Company).to.be.true;
				expect(instance.creativeEntities[2] instanceof Person).to.be.true;
				expect(instance.creativeEntities[3] instanceof Company).to.be.true;
				expect(instance.creativeEntities[4] instanceof Person).to.be.true;
				expect(instance.creativeEntities[5] instanceof Company).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'Sound Designers',
				creativeEntities: [
					{
						name: 'Paul Arditti'
					},
					{
						model: 'company',
						name: 'Autograph'
					}
				]
			};
			const instance = createInstance(props);
			instance.creativeEntities[0].model = 'person';
			instance.creativeEntities[0].name = 'Paul Arditti';
			instance.creativeEntities[1].model = 'company';
			instance.creativeEntities[1].name = 'Autograph';
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			spy(instance, 'validateNamePresenceIfNamedChildren');
			instance.runInputValidations({ isDuplicate: false });
			assert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				instance.validateNamePresenceIfNamedChildren,
				stubs.getDuplicateIndicesModule.getDuplicateEntityIndices,
				instance.creativeEntities[0].validateName,
				instance.creativeEntities[0].validateDifferentiator,
				instance.creativeEntities[0].validateUniquenessInGroup,
				instance.creativeEntities[1].validateName,
				instance.creativeEntities[1].validateDifferentiator,
				instance.creativeEntities[1].validateUniquenessInGroup
			);
			expect(instance.validateName.calledOnce).to.be.true;
			expect(instance.validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.validateUniquenessInGroup.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(instance.validateNamePresenceIfNamedChildren.calledOnce).to.be.true;
			expect(instance.validateNamePresenceIfNamedChildren.calledWithExactly(
				instance.creativeEntities
			)).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateEntityIndices.calledOnce).to.be.true;
			expect(stubs.getDuplicateIndicesModule.getDuplicateEntityIndices.calledWithExactly(
				instance.creativeEntities
			)).to.be.true;
			expect(instance.creativeEntities[0].validateName.calledOnce).to.be.true;
			expect(instance.creativeEntities[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.creativeEntities[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.creativeEntities[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.creativeEntities[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.creativeEntities[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;
			expect(instance.creativeEntities[1].validateName.calledOnce).to.be.true;
			expect(instance.creativeEntities[1].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.creativeEntities[1].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.creativeEntities[1].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(instance.creativeEntities[1].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.creativeEntities[1].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

});

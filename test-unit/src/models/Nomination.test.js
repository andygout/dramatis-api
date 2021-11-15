import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, stub } from 'sinon';

import { CompanyWithMembers, Person } from '../../../src/models';

describe('Nomination model', () => {

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
		proxyquire('../../../src/models/Nomination', {
			'../lib/get-duplicate-entity-info': stubs.getDuplicateEntityInfoModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const Nomination = createSubject();

		return new Nomination(props);

	};

	describe('constructor method', () => {

		describe('isWinner property', () => {

			it('assigns false if absent from props', () => {

				const instance = createInstance({});
				expect(instance.isWinner).to.equal(false);

			});

			it('assigns false if included in props but value is empty string', () => {

				const instance = createInstance({ isWinner: '' });
				expect(instance.isWinner).to.equal(false);

			});

			it('assigns true if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ isWinner: ' ' });
				expect(instance.isWinner).to.equal(true);

			});

			it('assigns true if included in props and is string with length', () => {

				const instance = createInstance({ isWinner: 'foo' });
				expect(instance.isWinner).to.equal(true);

			});

			it('assigns true if included in props and is true', () => {

				const instance = createInstance({ isWinner: true });
				expect(instance.isWinner).to.equal(true);

			});

		});

		describe('entities property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({});
				expect(instance.entities).to.deep.equal([]);

			});

			it('assigns array of nominees if included in props (defaulting to person if model is unspecified), retaining those with empty or whitespace-only string names', () => {

				const props = {
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

		it('calls instance\'s validate methods and associated models\' validate methods', () => {

			const props = {
				entities: [
					{
						name: 'Simon Baker'
					},
					{
						model: 'COMPANY',
						name: 'Autograph'
					}
				]
			};
			const instance = createInstance(props);
			instance.entities[0].name = 'Simon Baker';
			instance.entities[1].name = 'Autograph';
			instance.runInputValidations({ isDuplicate: false });
			assert.callOrder(
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
			expect(instance.entities[0].validateUniquenessInGroup.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(instance.entities[1].validateName.calledOnce).to.be.true;
			expect(instance.entities[1].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.entities[1].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.entities[1].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicateEntityInfoModule.isEntityInArray.getCall(1).calledWithExactly(
				instance.entities[1], 'getDuplicateEntities response'
			)).to.be.true;
			expect(instance.entities[1].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.entities[1].validateUniquenessInGroup.calledWithExactly({ isDuplicate: false })).to.be.true;
			expect(instance.entities[1].runInputValidations.calledOnce).to.be.true;
			expect(instance.entities[1].runInputValidations.calledWithExactly(
				{ duplicateEntities: 'getDuplicateEntities response' }
			)).to.be.true;

		});

	});

});

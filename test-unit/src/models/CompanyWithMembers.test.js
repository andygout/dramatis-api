import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import { Person } from '../../../src/models';

describe('CompanyWithMembers model', () => {

	let stubs;

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicatesInfoModule: {
				isEntityInArray: stub().returns(false)
			},
			models: {
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/CompanyWithMembers', {
			'../lib/get-duplicate-entity-info': stubs.getDuplicatesInfoModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const Person = createSubject();

		return new Person(props);

	};

	describe('constructor method', () => {

		describe('members property', () => {

			it('assigns empty array if absent from props', () => {

				const instance = createInstance({ name: 'Autograph' });
				expect(instance.members).to.deep.equal([]);

			});

			it('assigns array of members if included in props, retaining those with empty or whitespace-only string names', () => {

				const props = {
					name: 'Autograph',
					members: [
						{
							name: 'Andrew Bruce'
						},
						{
							name: ''
						},
						{
							name: ' '
						}
					]
				};
				const instance = createInstance(props);
				expect(instance.members.length).to.equal(3);
				expect(instance.members[0] instanceof Person).to.be.true;
				expect(instance.members[1] instanceof Person).to.be.true;
				expect(instance.members[2] instanceof Person).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		it('calls instance validate method and associated models\' validate methods', () => {

			const props = {
				name: 'Fiery Angel',
				members: [
					{
						name: 'Edward Snape'
					}
				]
			};
			const instance = createInstance(props);
			instance.members[0].name = 'Edward Snape';
			spy(instance, 'validateNamePresenceIfNamedChildren');
			instance.runInputValidations({ duplicateEntities: [] });
			assert.callOrder(
				instance.validateNamePresenceIfNamedChildren,
				instance.members[0].validateName,
				instance.members[0].validateDifferentiator,
				stubs.getDuplicatesInfoModule.isEntityInArray,
				instance.members[0].validateUniquenessInGroup
			);
			expect(instance.validateNamePresenceIfNamedChildren.calledOnce).to.be.true;
			expect(instance.members[0].validateName.calledOnce).to.be.true;
			expect(instance.members[0].validateName.calledWithExactly({ isRequired: false })).to.be.true;
			expect(instance.members[0].validateDifferentiator.calledOnce).to.be.true;
			expect(instance.members[0].validateDifferentiator.calledWithExactly()).to.be.true;
			expect(stubs.getDuplicatesInfoModule.isEntityInArray.calledOnce).to.be.true;
			expect(stubs.getDuplicatesInfoModule.isEntityInArray.calledWithExactly(
				instance.members[0], []
			)).to.be.true;
			expect(instance.members[0].validateUniquenessInGroup.calledOnce).to.be.true;
			expect(instance.members[0].validateUniquenessInGroup.calledWithExactly(
				{ isDuplicate: false }
			)).to.be.true;

		});

	});

});

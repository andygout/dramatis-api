import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { createStubInstance } from 'sinon';

import { Person } from '../../../src/models';

describe('Company model', () => {

	let stubs;

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			models: {
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Company', {
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const Person = createSubject();

		return new Person(props);

	};

	describe('constructor method', () => {

		describe('differentiator property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = createInstance({ name: 'London Theatre Company' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = createInstance({ name: 'London Theatre Company', differentiator: '' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ name: 'London Theatre Company', differentiator: ' ' });
				expect(instance.differentiator).to.equal('');

			});

			it('assigns value if included in props and value is string with length', () => {

				const instance = createInstance({ name: 'London Theatre Company', differentiator: '1' });
				expect(instance.differentiator).to.equal('1');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({ name: 'London Theatre Company', differentiator: ' 1 ' });
				expect(instance.differentiator).to.equal('1');

			});

		});

		describe('creditedMembers property', () => {

			context('it is not an association of a production instance', () => {

				it('will not assign any value if absent from props', () => {

					const props = { name: 'Autograph' };
					const instance = createInstance(props);
					expect(instance).not.to.have.property('creditedMembers');

				});

				it('will not assign any value if included in props', () => {

					const props = {
						name: 'Autograph',
						creditedMembers: [
							{
								name: 'Andrew Bruce'
							}
						]
					};
					const instance = createInstance(props);
					expect(instance).not.to.have.property('creditedMembers');

				});

			});

			context('instance is not subject, i.e. it is an association of a production instance', () => {

				it('assigns empty array if absent from props', () => {

					const instance = createInstance({ name: 'Autograph', isProductionAssociation: true });
					expect(instance.creditedMembers).to.deep.equal([]);

				});

				it('assigns array of creditedMembers if included in props, retaining those with empty or whitespace-only string names', () => {

					const props = {
						name: 'Autograph',
						creditedMembers: [
							{
								name: 'Andrew Bruce'
							},
							{
								name: ''
							},
							{
								name: ' '
							}
						],
						isProductionAssociation: true
					};
					const instance = createInstance(props);
					expect(instance.creditedMembers.length).to.equal(3);
					expect(instance.creditedMembers[0] instanceof Person).to.be.true;
					expect(instance.creditedMembers[1] instanceof Person).to.be.true;
					expect(instance.creditedMembers[2] instanceof Person).to.be.true;

				});

			});

		});

	});

});

import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { assert, createStubInstance, spy, stub } from 'sinon';

import Review from '../../../src/models/Review';
import { Company, Person } from '../../../src/models';

describe('Review model', () => {

	let stubs;

	const CompanyStub = function () {

		return createStubInstance(Company);

	};

	const PersonStub = function () {

		return createStubInstance(Person);

	};

	beforeEach(() => {

		stubs = {
			getDuplicateEntityInfoModule: {
				isEntityInArray: stub().returns(false)
			},
			isValidDateModule: {
				isValidDate: stub().returns(true)
			},
			models: {
				Company: CompanyStub,
				Person: PersonStub
			}
		};

	});

	const createSubject = () =>
		proxyquire('../../../src/models/Review', {
			'../lib/get-duplicate-entity-info': stubs.getDuplicateEntityInfoModule,
			'../lib/is-valid-date': stubs.isValidDateModule,
			'.': stubs.models
		}).default;

	const createInstance = props => {

		const ProductionTeamCredit = createSubject();

		return new ProductionTeamCredit(props);

	};

	describe('constructor method', () => {

		describe('url property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = createInstance({});
				expect(instance.url).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = createInstance({ url: '' });
				expect(instance.url).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ url: ' ' });
				expect(instance.url).to.equal('');

			});

			it('assigns value if included in props and is string with length', () => {

				const instance = createInstance({ url: 'https://www.foo.com' });
				expect(instance.url).to.equal('https://www.foo.com');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({ url: ' https://www.foo.com ' });
				expect(instance.url).to.equal('https://www.foo.com');

			});

		});

		describe('date property', () => {

			it('assigns empty string if absent from props', () => {

				const instance = createInstance({});
				expect(instance.date).to.equal('');

			});

			it('assigns empty string if included in props but value is empty string', () => {

				const instance = createInstance({ date: '' });
				expect(instance.date).to.equal('');

			});

			it('assigns empty string if included in props but value is whitespace-only string', () => {

				const instance = createInstance({ date: ' ' });
				expect(instance.date).to.equal('');

			});

			it('assigns value if included in props and is string with length', () => {

				const instance = createInstance({ date: '2024-04-03' });
				expect(instance.date).to.equal('2024-04-03');

			});

			it('trims value before assigning', () => {

				const instance = createInstance({ date: ' 2024-04-03 ' });
				expect(instance.date).to.equal('2024-04-03');

			});

		});

		describe('publication property', () => {

			it('assigns instance if absent from props', () => {

				const instance = createInstance({ url: 'https://www.foo.com' });
				expect(instance.publication instanceof Company).to.be.true;

			});

			it('assigns instance if included in props', () => {

				const instance = createInstance({
					url: 'https://www.foo.com',
					publication: {
						name: 'Financial Times'
					}
				});
				expect(instance.publication instanceof Company).to.be.true;

			});

		});

		describe('critic property', () => {

			it('assigns instance if absent from props', () => {

				const instance = createInstance({ url: 'https://www.foo.com' });
				expect(instance.critic instanceof Person).to.be.true;

			});

			it('assigns instance if included in props', () => {

				const instance = createInstance({
					name: 'https://www.foo.com',
					critic: {
						name: 'Sarah Hemming'
					}
				});
				expect(instance.critic instanceof Person).to.be.true;

			});

		});

	});

	describe('runInputValidations method', () => {

		context('instance url value is non-empty string', () => {

			it('calls instance\'s validate methods and associated models\' validate methods', () => {

				const props = {
					url: 'https://www.foo.com',
					publication: {
						name: 'Financial Times'
					},
					critic: {
						name: 'Sarah Hemming'
					}
				};
				const instance = createInstance(props);
				spy(instance, 'validateUrl');
				spy(instance, 'validateUniquenessInGroup');
				spy(instance, 'validateUrlPresenceIfNamedChildren');
				spy(instance, 'validateDate');
				instance.runInputValidations({ isDuplicate: false, duplicatePublicationAndCriticEntities: [] });
				assert.callOrder(
					instance.validateUrl,
					instance.validateUniquenessInGroup,
					instance.validateUrlPresenceIfNamedChildren,
					instance.validateDate,
					instance.publication.validateName,
					instance.publication.validateDifferentiator,
					stubs.getDuplicateEntityInfoModule.isEntityInArray,
					instance.publication.validateUniquenessInGroup,
					instance.critic.validateName,
					instance.critic.validateDifferentiator,
					stubs.getDuplicateEntityInfoModule.isEntityInArray,
					instance.critic.validateUniquenessInGroup
				);
				assert.calledOnce(instance.validateUrl);
				assert.calledWithExactly(instance.validateUrl, { isRequired: false });
				assert.calledOnce(instance.validateUniquenessInGroup);
				assert.calledWithExactly(
					instance.validateUniquenessInGroup,
					{ isDuplicate: false, properties: new Set(['url']) }
				);
				assert.calledOnce(instance.validateUrlPresenceIfNamedChildren);
				assert.calledWithExactly(
					instance.validateUrlPresenceIfNamedChildren,
					[instance.publication, instance.critic]
				);
				assert.calledOnce(instance.validateDate);
				assert.calledWithExactly(instance.validateDate);
				assert.calledOnce(instance.publication.validateName);
				assert.calledWithExactly(instance.publication.validateName, { isRequired: true });
				assert.calledOnce(instance.publication.validateDifferentiator);
				assert.calledWithExactly(instance.publication.validateDifferentiator);
				assert.calledTwice(stubs.getDuplicateEntityInfoModule.isEntityInArray);
				assert.calledWithExactly(
					stubs.getDuplicateEntityInfoModule.isEntityInArray.getCall(0),
					instance.publication, []
				);
				assert.calledOnce(instance.publication.validateUniquenessInGroup);
				assert.calledWithExactly(instance.publication.validateUniquenessInGroup, { isDuplicate: false });
				assert.calledOnce(instance.critic.validateName);
				assert.calledWithExactly(instance.critic.validateName, { isRequired: true });
				assert.calledOnce(instance.critic.validateDifferentiator);
				assert.calledWithExactly(instance.critic.validateDifferentiator);
				assert.calledWithExactly(
					stubs.getDuplicateEntityInfoModule.isEntityInArray.getCall(1),
					instance.critic, []
				);
				assert.calledOnce(instance.critic.validateUniquenessInGroup);
				assert.calledWithExactly(instance.critic.validateUniquenessInGroup, { isDuplicate: false });

			});

		});

		context('instance url value is empty string', () => {

			it('calls instance\'s publication and critic validateName methods with an argument that it is not required', () => {

				const props = {
					url: '',
					publication: {
						name: 'Financial Times'
					},
					critic: {
						name: 'Sarah Hemming'
					}
				};
				const instance = createInstance(props);
				instance.runInputValidations({ isDuplicate: false });
				assert.calledOnce(instance.publication.validateName);
				assert.calledWithExactly(instance.publication.validateName, { isRequired: false });
				assert.calledOnce(instance.critic.validateName);
				assert.calledWithExactly(instance.critic.validateName, { isRequired: false });

			});

		});

	});

	describe('validateUrl method', () => {

		it('will call validateStringForProperty method', () => {

			const instance = new Review({ url: 'https://www.foo.com' });
			spy(instance, 'validateStringForProperty');
			instance.validateUrl({ isRequired: false });
			assert.calledOnce(instance.validateStringForProperty);
			assert.calledWithExactly(
				instance.validateStringForProperty,
				'url', { isRequired: false }
			);

		});

		context('url property is a valid URL', () => {

			it('will not call addPropertyError method', () => {

				const instance = new Review({ url: 'https://www.foo.com' });
				spy(instance, 'addPropertyError');
				instance.validateUrl({ isRequired: false });
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('url property is an empty string', () => {

			it('will not call addPropertyError method', () => {

				const instance = new Review({ url: '' });
				spy(instance, 'addPropertyError');
				instance.validateUrl({ isRequired: false });
				assert.notCalled(instance.addPropertyError);

			});

		});

		context('url property is a non-empty string that is not a valid URL', () => {

			it('will call addPropertyError method', () => {

				const instance = new Review({ url: 'foobar' });
				spy(instance, 'addPropertyError');
				instance.validateUrl({ isRequired: false });
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'url', 'URL must be a valid URL'
				);

			});

		});

	});

	describe('validateUrlPresenceIfNamedChildren method', () => {

		context('valid data', () => {

			context('instance does not have url nor any children with names', () => {

				it('will not add properties to errors property', () => {

					const instance = new Review({ url: '' });
					spy(instance, 'addPropertyError');
					instance.validateUrlPresenceIfNamedChildren([{ name: '' }]);
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('instance has a url and no children with names', () => {

				it('will not add properties to errors property', () => {

					const instance = new Review({ url: 'https://www.foo.com' });
					spy(instance, 'addPropertyError');
					instance.validateUrlPresenceIfNamedChildren([{ name: '' }]);
					assert.notCalled(instance.addPropertyError);
				});

			});

			context('instance has a url and children with names', () => {

				it('will not add properties to errors property', () => {

					const instance = new Review({ url: 'https://www.foo.com' });
					spy(instance, 'addPropertyError');
					instance.validateUrlPresenceIfNamedChildren([{ name: 'Financial Times' }]);
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			it('adds properties to errors property', () => {

				const instance = new Review({ url: '' });
				spy(instance, 'addPropertyError');
				instance.validateUrlPresenceIfNamedChildren([{ name: 'Financial Times' }]);
				assert.calledOnce(instance.addPropertyError);
				assert.calledWithExactly(
					instance.addPropertyError,
					'url', 'URL is required if named children exist'
				);

			});

		});

	});

	describe('validateDate method', () => {

		context('valid data', () => {

			context('date is an empty string', () => {

				it('will not call isValidDate or addPropertyError method', () => {

					const instance = createInstance({ date: '' });
					spy(instance, 'addPropertyError');
					instance.validateDate();
					assert.notCalled(stubs.isValidDateModule.isValidDate);
					assert.notCalled(instance.addPropertyError);

				});

			});

			context('date is in a valid date format', () => {

				it('will call isValidDate; will not call addPropertyError method', () => {

					const instance = createInstance({ date: '2024-04-03' });
					spy(instance, 'addPropertyError');
					instance.validateDate();
					assert.calledOnce(stubs.isValidDateModule.isValidDate);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate, instance.date);
					assert.notCalled(instance.addPropertyError);

				});

			});

		});

		context('invalid data', () => {

			context('date is in an invalid date format', () => {

				it('will call isValidDate and addPropertyError method', () => {

					stubs.isValidDateModule.isValidDate.returns(false);
					const instance = createInstance({ date: 'foobar' });
					spy(instance, 'addPropertyError');
					instance.validateDate();
					assert.calledOnce(stubs.isValidDateModule.isValidDate);
					assert.calledWithExactly(stubs.isValidDateModule.isValidDate, instance.date);
					assert.calledOnce(instance.addPropertyError);
					assert.calledWithExactly(instance.addPropertyError, 'date', 'Value must be in date format');

				});

			});

		});

	});

});

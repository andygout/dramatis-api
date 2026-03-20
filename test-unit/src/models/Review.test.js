import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

import { Company, Person } from '../../../src/models/index.js';

const context = describe;

describe('Review model', () => {
	let stubs;
	let Review;

	const CompanyStub = function () {
		return createStubInstance(Company);
	};

	const PersonStub = function () {
		return createStubInstance(Person);
	};

	beforeEach(async () => {
		stubs = {
			isValidDate: stub().returns(true),
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
			},
			models: {
				Company: CompanyStub,
				Person: PersonStub
			}
		};

		Review = await esmock(
			'../../../src/models/Review.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/is-valid-date.js': stubs.isValidDate,
				'../../../src/lib/strings.js': stubs.stringsModule,
				'../../../src/models/index.js': stubs.models
			}
		);
	});

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new Review();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.callCount, 2);
		});

		describe('url property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Review({ url: 'https://www.foo.com' });

				sinonAssert.calledWithExactly(
					stubs.stringsModule.getTrimmedOrEmptyString.firstCall,
					'https://www.foo.com'
				);
				assert.equal(instance.url, 'https://www.foo.com');
			});
		});

		describe('date property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Review({ date: '2024-04-03' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.secondCall, '2024-04-03');
				assert.equal(instance.date, '2024-04-03');
			});
		});

		describe('publication property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Review({ url: 'https://www.foo.com' });

				assert.ok(instance.publication instanceof Company);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Review({
					url: 'https://www.foo.com',
					publication: {
						name: 'Financial Times'
					}
				});

				assert.ok(instance.publication instanceof Company);
			});
		});

		describe('critic property', () => {
			it('assigns instance if absent from props', async () => {
				const instance = new Review({ url: 'https://www.foo.com' });

				assert.ok(instance.critic instanceof Person);
			});

			it('assigns instance if included in props', async () => {
				const instance = new Review({
					name: 'https://www.foo.com',
					critic: {
						name: 'Sarah Hemming'
					}
				});

				assert.ok(instance.critic instanceof Person);
			});
		});
	});

	describe('runInputValidations method', () => {
		context('instance url value is non-empty string', () => {
			it("calls instance's validate methods and associated models' validate methods", async () => {
				const instance = new Review({
					url: 'https://www.foo.com',
					publication: {
						name: 'Financial Times'
					},
					critic: {
						name: 'Sarah Hemming'
					}
				});

				spy(instance, 'validateUrl');
				spy(instance, 'validateUniquenessInGroup');
				spy(instance, 'validateUrlPresenceIfNamedChildren');
				spy(instance, 'validateDate');

				instance.runInputValidations({ isDuplicate: false, duplicatePublicationAndCriticEntities: [] });

				sinonAssert.callOrder(
					instance.validateUrl,
					instance.validateUniquenessInGroup,
					instance.validateUrlPresenceIfNamedChildren,
					instance.validateDate,
					instance.publication.validateName,
					instance.publication.validateDifferentiator,
					instance.critic.validateName,
					instance.critic.validateDifferentiator
				);
				sinonAssert.calledOnceWithExactly(instance.validateUrl, { isRequired: false });
				sinonAssert.calledOnceWithExactly(instance.validateUniquenessInGroup, {
					isDuplicate: false,
					properties: new Set(['url'])
				});
				sinonAssert.calledOnceWithExactly(instance.validateUrlPresenceIfNamedChildren, [
					instance.publication,
					instance.critic
				]);
				sinonAssert.calledOnceWithExactly(instance.validateDate);
				sinonAssert.calledOnceWithExactly(instance.publication.validateName, { isRequired: true });
				sinonAssert.calledOnceWithExactly(instance.publication.validateDifferentiator);
				sinonAssert.calledOnceWithExactly(instance.critic.validateName, { isRequired: true });
				sinonAssert.calledOnceWithExactly(instance.critic.validateDifferentiator);
			});
		});

		context('instance url value is empty string', () => {
			it("calls instance's publication and critic validateName methods with an argument that it is not required", async () => {
				const instance = new Review({
					url: '',
					publication: {
						name: 'Financial Times'
					},
					critic: {
						name: 'Sarah Hemming'
					}
				});

				instance.runInputValidations({ isDuplicate: false });

				sinonAssert.calledOnceWithExactly(instance.publication.validateName, { isRequired: false });
				sinonAssert.calledOnceWithExactly(instance.critic.validateName, { isRequired: false });
			});
		});
	});

	describe('validateUrl method', () => {
		it('will call validateStringForProperty method', async () => {
			const instance = new Review({ url: 'https://www.foo.com' });

			spy(instance, 'validateStringForProperty');

			instance.validateUrl({ isRequired: false });

			sinonAssert.calledOnceWithExactly(instance.validateStringForProperty, 'url', { isRequired: false });
		});

		context('url property is a valid URL', () => {
			it('will not call addPropertyError method', async () => {
				const instance = new Review({ url: 'https://www.foo.com' });

				spy(instance, 'addPropertyError');

				instance.validateUrl({ isRequired: false });

				sinonAssert.notCalled(instance.addPropertyError);
			});
		});

		context('url property is an empty string', () => {
			it('will not call addPropertyError method', async () => {
				const instance = new Review({ url: '' });

				spy(instance, 'addPropertyError');

				instance.validateUrl({ isRequired: false });

				sinonAssert.notCalled(instance.addPropertyError);
			});
		});

		context('url property is a non-empty string that is not a valid URL', () => {
			it('will call addPropertyError method', async () => {
				const instance = new Review({ url: 'foobar' });

				spy(instance, 'addPropertyError');

				instance.validateUrl({ isRequired: false });

				sinonAssert.calledOnceWithExactly(instance.addPropertyError, 'url', 'URL must be a valid URL');
			});
		});
	});

	describe('validateUrlPresenceIfNamedChildren method', () => {
		it('will call validatePropertyPresenceIfNamedChildren', async () => {
			const instance = new Review();

			spy(instance, 'validatePropertyPresenceIfNamedChildren');

			instance.validateUrlPresenceIfNamedChildren([{ name: 'Financial Times' }, { name: 'Sarah Hemming' }]);

			sinonAssert.calledOnceWithExactly(instance.validatePropertyPresenceIfNamedChildren, 'url', [
				{ name: 'Financial Times' },
				{ name: 'Sarah Hemming' }
			]);
		});
	});

	describe('validateDate method', () => {
		context('valid data', () => {
			context('date is an empty string', () => {
				it('will not call isValidDate or addPropertyError method', async () => {
					const instance = new Review({ date: '' });

					spy(instance, 'addPropertyError');

					instance.validateDate();

					sinonAssert.notCalled(stubs.isValidDate);
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('date is in a valid date format', () => {
				it('will call isValidDate; will not call addPropertyError method', async () => {
					const instance = new Review({ date: '2024-04-03' });

					spy(instance, 'addPropertyError');

					instance.validateDate();

					sinonAssert.calledOnceWithExactly(stubs.isValidDate, instance.date);
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});
		});

		context('invalid data', () => {
			context('date is in an invalid date format', () => {
				it('will call isValidDate and addPropertyError method', async () => {
					stubs.isValidDate.returns(false);

					const instance = new Review({ date: 'foobar' });

					spy(instance, 'addPropertyError');

					instance.validateDate();

					sinonAssert.calledOnceWithExactly(stubs.isValidDate, instance.date);
					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'date',
						'Value must be in date format'
					);
				});
			});
		});
	});
});

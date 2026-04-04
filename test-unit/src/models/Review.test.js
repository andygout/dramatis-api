import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

import { Company, Person } from '../../../src/models/index.js';

const context = describe;

describe('Review model', () => {
	let stubs;
	let Review;

	const CompanyStub = function () {
		return new Company();
	};

	const PersonStub = function () {
		return new Person();
	};

	beforeEach(async (test) => {
		stubs = {
			isValidDate: test.mock.fn(() => true),
			stringsModule: {
				getTrimmedOrEmptyString: test.mock.fn((arg) => arg?.trim() || '')
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

	describe('constructor method', () => {
		it('calls getTrimmedOrEmptyString to get values to assign to properties', async () => {
			new Review();

			assert.equal(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls.length, 2);
		});

		describe('url property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Review({ url: 'https://www.foo.com' });

				assert.deepStrictEqual(
					stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[0].arguments,
					['https://www.foo.com']
				);
				assert.equal(instance.url, 'https://www.foo.com');
			});
		});

		describe('date property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Review({ date: '2024-04-03' });

				assert.deepStrictEqual(stubs.stringsModule.getTrimmedOrEmptyString.mock.calls[1].arguments, ['2024-04-03']);
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
			it("calls instance's validate methods and associated models' validate methods", async (test) => {
				const instance = new Review({
					url: 'https://www.foo.com',
					publication: {
						name: 'Financial Times'
					},
					critic: {
						name: 'Sarah Hemming'
					}
				});
				const callOrder = [];

				const originalValidateUrl = instance.validateUrl;
				const originalValidateUniquenessInGroup = instance.validateUniquenessInGroup;
				const originalValidateUrlPresenceIfNamedChildren = instance.validateUrlPresenceIfNamedChildren;
				const originalValidateDate = instance.validateDate;
				const originalPublicationValidateName = instance.publication.validateName;
				const originalPublicationValidateDifferentiator = instance.publication.validateDifferentiator;
				const originalCriticValidateName = instance.critic.validateName;
				const originalCriticValidateDifferentiator = instance.critic.validateDifferentiator;

				test.mock.method(instance, 'validateUrl', function (...args) {
					callOrder.push('instance.validateUrl');

					return originalValidateUrl.apply(this, args);
				});
				test.mock.method(instance, 'validateUniquenessInGroup', function (...args) {
					callOrder.push('instance.validateUniquenessInGroup');

					return originalValidateUniquenessInGroup.apply(this, args);
				});
				test.mock.method(instance, 'validateUrlPresenceIfNamedChildren', function (...args) {
					callOrder.push('instance.validateUrlPresenceIfNamedChildren');

					return originalValidateUrlPresenceIfNamedChildren.apply(this, args);
				});
				test.mock.method(instance, 'validateDate', function (...args) {
					callOrder.push('instance.validateDate');

					return originalValidateDate.apply(this, args);
				});
				test.mock.method(instance.publication, 'validateName', function (...args) {
					callOrder.push('instance.publication.validateName');

					return originalPublicationValidateName.apply(this, args);
				});
				test.mock.method(instance.publication, 'validateDifferentiator', function (...args) {
					callOrder.push('instance.publication.validateDifferentiator');

					return originalPublicationValidateDifferentiator.apply(this, args);
				});
				test.mock.method(instance.critic, 'validateName', function (...args) {
					callOrder.push('instance.critic.validateName');

					return originalCriticValidateName.apply(this, args);
				});
				test.mock.method(instance.critic, 'validateDifferentiator', function (...args) {
					callOrder.push('instance.critic.validateDifferentiator');

					return originalCriticValidateDifferentiator.apply(this, args);
				});

				instance.runInputValidations({ isDuplicate: false, duplicatePublicationAndCriticEntities: [] });

				assert.deepStrictEqual(callOrder, [
					'instance.validateUrl',
					'instance.validateUniquenessInGroup',
					'instance.validateUrlPresenceIfNamedChildren',
					'instance.validateDate',
					'instance.publication.validateName',
					'instance.publication.validateDifferentiator',
					'instance.critic.validateName',
					'instance.critic.validateDifferentiator'
				]);
				assert.strictEqual(instance.validateUrl.mock.calls.length, 1);
				assert.deepStrictEqual(instance.validateUrl.mock.calls[0].arguments, [{ isRequired: false }]);
				assert.strictEqual(instance.validateUniquenessInGroup.mock.calls.length, 1);
				assert.deepStrictEqual(instance.validateUniquenessInGroup.mock.calls[0].arguments, [
					{
						isDuplicate: false,
						properties: new Set(['url'])
					}
				]);
				assert.strictEqual(instance.validateUrlPresenceIfNamedChildren.mock.calls.length, 1);
				assert.deepStrictEqual(instance.validateUrlPresenceIfNamedChildren.mock.calls[0].arguments, [
					[instance.publication, instance.critic]
				]);
				assert.strictEqual(instance.validateDate.mock.calls.length, 1);
				assert.deepStrictEqual(instance.validateDate.mock.calls[0].arguments, []);
				assert.strictEqual(instance.publication.validateName.mock.calls.length, 1);
				assert.deepStrictEqual(instance.publication.validateName.mock.calls[0].arguments, [{ isRequired: true }]);
				assert.strictEqual(instance.publication.validateDifferentiator.mock.calls.length, 1);
				assert.deepStrictEqual(instance.publication.validateDifferentiator.mock.calls[0].arguments, []);
				assert.strictEqual(instance.critic.validateName.mock.calls.length, 1);
				assert.deepStrictEqual(instance.critic.validateName.mock.calls[0].arguments, [{ isRequired: true }]);
				assert.strictEqual(instance.critic.validateDifferentiator.mock.calls.length, 1);
				assert.deepStrictEqual(instance.critic.validateDifferentiator.mock.calls[0].arguments, []);
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

				assert.strictEqual(instance.publication.validateName.mock.calls.length, 1);
				assert.deepStrictEqual(instance.publication.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
				assert.strictEqual(instance.critic.validateName.mock.calls.length, 1);
				assert.deepStrictEqual(instance.critic.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			});
		});
	});

	describe('validateUrl method', () => {
		it('will call validateStringForProperty method', async (test) => {
			const instance = new Review({ url: 'https://www.foo.com' });

			test.mock.method(instance, 'validateStringForProperty', () => undefined);

			instance.validateUrl({ isRequired: false });

			assert.strictEqual(instance.validateStringForProperty.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateStringForProperty.mock.calls[0].arguments, ['url', { isRequired: false }]);
		});

		context('url property is a valid URL', () => {
			it('will not call addPropertyError method', async (test) => {
				const instance = new Review({ url: 'https://www.foo.com' });

				test.mock.method(instance, 'addPropertyError', () => undefined);

				instance.validateUrl({ isRequired: false });

				assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
			});
		});

		context('url property is an empty string', () => {
			it('will not call addPropertyError method', async (test) => {
				const instance = new Review({ url: '' });

				test.mock.method(instance, 'addPropertyError', () => undefined);

				instance.validateUrl({ isRequired: false });

				assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
			});
		});

		context('url property is a non-empty string that is not a valid URL', () => {
			it('will call addPropertyError method', async (test) => {
				const instance = new Review({ url: 'foobar' });

				test.mock.method(instance, 'addPropertyError', () => undefined);

				instance.validateUrl({ isRequired: false });

				assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
				assert.deepStrictEqual(instance.addPropertyError.mock.calls[0].arguments, ['url', 'URL must be a valid URL']);
			});
		});
	});

	describe('validateUrlPresenceIfNamedChildren method', () => {
		it('will call validatePropertyPresenceIfNamedChildren', async (test) => {
			const instance = new Review();

			test.mock.method(instance, 'validatePropertyPresenceIfNamedChildren', () => undefined);

			instance.validateUrlPresenceIfNamedChildren([{ name: 'Financial Times' }, { name: 'Sarah Hemming' }]);

			assert.strictEqual(instance.validatePropertyPresenceIfNamedChildren.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validatePropertyPresenceIfNamedChildren.mock.calls[0].arguments, [
				'url',
				[{ name: 'Financial Times' }, { name: 'Sarah Hemming' }]
			]);
		});
	});

	describe('validateDate method', () => {
		context('valid data', () => {
			context('date is an empty string', () => {
				it('will not call isValidDate or addPropertyError method', async (test) => {
					const instance = new Review({ date: '' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDate();

					assert.strictEqual(stubs.isValidDate.mock.calls.length, 0);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});

			context('date is in a valid date format', () => {
				it('will call isValidDate; will not call addPropertyError method', async (test) => {
					const instance = new Review({ date: '2024-04-03' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDate();

					assert.strictEqual(stubs.isValidDate.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, [instance.date]);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 0);
				});
			});
		});

		context('invalid data', () => {
			context('date is in an invalid date format', () => {
				it('will call isValidDate and addPropertyError method', async (test) => {
					stubs.isValidDate = test.mock.fn(() => false);

					const instance = new Review({ date: 'foobar' });

					test.mock.method(instance, 'addPropertyError', () => undefined);

					instance.validateDate();

					assert.strictEqual(stubs.isValidDate.mock.calls.length, 1);
					assert.deepStrictEqual(stubs.isValidDate.mock.calls[0].arguments, [instance.date]);
					assert.strictEqual(instance.addPropertyError.mock.calls.length, 1);
					assert.deepStrictEqual(
						instance.addPropertyError.mock.calls[0].arguments,
						['date', 'Value must be in date format']
					);
				});
			});
		});
	});
});

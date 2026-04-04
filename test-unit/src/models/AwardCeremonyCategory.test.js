import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AwardCeremonyCategory, Nomination } from '../../../src/models/index.js';

describe('AwardCeremonyCategory model', () => {
	describe('constructor method', () => {
		describe('nominations property', () => {
			it('assigns empty array if absent from props', () => {
				const instance = new AwardCeremonyCategory({});

				assert.deepEqual(instance.nominations, []);
			});

			it('assigns array of nominations if included in props', () => {
				const props = {
					nominations: [{}, {}, {}]
				};

				const instance = new AwardCeremonyCategory(props);

				assert.equal(instance.nominations.length, 3);
				assert.equal(instance.nominations[0] instanceof Nomination, true);
				assert.equal(instance.nominations[1] instanceof Nomination, true);
				assert.equal(instance.nominations[2] instanceof Nomination, true);
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods and associated models' validate methods", (test) => {
			const props = {
				name: 'Best New Play',
				nominations: [{}]
			};
			const instance = new AwardCeremonyCategory(props);
			const callOrder = [];
			const originalValidateName = instance.validateName;
			const originalValidateUniquenessInGroup = instance.validateUniquenessInGroup;
			const originalValidateNamePresenceIfNamedChildren = instance.validateNamePresenceIfNamedChildren;
			const originalRunInputValidations = instance.nominations[0].runInputValidations;

			test.mock.method(instance, 'validateName', function (...args) {
				callOrder.push('instance.validateName');

				return originalValidateName.apply(this, args);
			});
			test.mock.method(instance, 'validateUniquenessInGroup', function (...args) {
				callOrder.push('instance.validateUniquenessInGroup');

				return originalValidateUniquenessInGroup.apply(this, args);
			});
			test.mock.method(instance, 'validateNamePresenceIfNamedChildren', function (...args) {
				callOrder.push('instance.validateNamePresenceIfNamedChildren');

				return originalValidateNamePresenceIfNamedChildren.apply(this, args);
			});
			test.mock.method(instance.nominations[0], 'runInputValidations', function (...args) {
				callOrder.push('instance.nominations[0].runInputValidations');

				return originalRunInputValidations.apply(this, args);
			});

			instance.runInputValidations({ isDuplicate: false });

			assert.deepStrictEqual(callOrder, [
				'instance.validateName',
				'instance.validateUniquenessInGroup',
				'instance.validateNamePresenceIfNamedChildren',
				'instance.nominations[0].runInputValidations'
			]);
			assert.strictEqual(instance.validateName.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateName.mock.calls[0].arguments, [{ isRequired: false }]);
			assert.strictEqual(instance.validateUniquenessInGroup.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateUniquenessInGroup.mock.calls[0].arguments, [{ isDuplicate: false }]);
			assert.strictEqual(instance.validateNamePresenceIfNamedChildren.mock.calls.length, 1);
			assert.deepStrictEqual(instance.validateNamePresenceIfNamedChildren.mock.calls[0].arguments, []);
			assert.strictEqual(instance.nominations[0].runInputValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.nominations[0].runInputValidations.mock.calls[0].arguments, []);
		});
	});

	describe('runDatabaseValidations method', () => {
		it("calls associated nominations' runDatabaseValidations method", async (test) => {
			const props = {
				nominations: [{}]
			};
			const instance = new AwardCeremonyCategory(props);
			const originalRunDatabaseValidations = instance.nominations[0].runDatabaseValidations;

			test.mock.method(instance.nominations[0], 'runDatabaseValidations', function (...args) {
				return originalRunDatabaseValidations.apply(this, args);
			});
			await instance.runDatabaseValidations();
			assert.strictEqual(instance.nominations[0].runDatabaseValidations.mock.calls.length, 1);
			assert.deepStrictEqual(instance.nominations[0].runDatabaseValidations.mock.calls[0].arguments, []);
		});
	});
});

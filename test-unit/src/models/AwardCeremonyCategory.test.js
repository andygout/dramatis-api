import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { assert as sinonAssert, restore, spy } from 'sinon';

import { AwardCeremonyCategory, Nomination } from '../../../src/models/index.js';

describe('AwardCeremonyCategory model', () => {
	afterEach(() => {
		restore();
	});

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
		it("calls instance's validate methods and associated models' validate methods", () => {
			const props = {
				name: 'Best New Play',
				nominations: [{}]
			};
			const instance = new AwardCeremonyCategory(props);
			spy(instance, 'validateName');
			spy(instance, 'validateUniquenessInGroup');
			spy(instance, 'validateNamePresenceIfNamedChildren');
			spy(instance.nominations[0], 'runInputValidations');
			instance.runInputValidations({ isDuplicate: false });
			sinonAssert.callOrder(
				instance.validateName,
				instance.validateUniquenessInGroup,
				instance.validateNamePresenceIfNamedChildren,
				instance.nominations[0].runInputValidations
			);
			sinonAssert.calledOnceWithExactly(instance.validateName, { isRequired: false });
			sinonAssert.calledOnceWithExactly(instance.validateUniquenessInGroup, { isDuplicate: false });
			sinonAssert.calledOnceWithExactly(instance.validateNamePresenceIfNamedChildren, []);
			sinonAssert.calledOnceWithExactly(instance.nominations[0].runInputValidations);
		});
	});

	describe('runDatabaseValidations method', () => {
		it("calls associated nominations' runDatabaseValidations method", async () => {
			const props = {
				nominations: [{}]
			};
			const instance = new AwardCeremonyCategory(props);
			spy(instance.nominations[0], 'runDatabaseValidations');
			await instance.runDatabaseValidations();
			sinonAssert.calledOnceWithExactly(instance.nominations[0].runDatabaseValidations);
		});
	});
});

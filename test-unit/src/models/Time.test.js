import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import { assert as sinonAssert, createStubInstance, restore, spy, stub } from 'sinon';

const context = describe;

describe('Time model', () => {
	let stubs;
	let Time;

	beforeEach(async () => {
		stubs = {
			isValidDate: stub().returns(false),
			stringsModule: {
				getTrimmedOrEmptyString: stub().callsFake((arg) => arg?.trim() || '')
			}
		};

		Time = await esmock(
			'../../../src/models/Time.js',
			{},
			// globalmocks: mock definitions imported everywhere.
			// Required for when functions are invoked by ancestor class methods.
			{
				'../../../src/lib/is-valid-date.js': stubs.isValidDate,
				'../../../src/lib/strings.js': stubs.stringsModule
			}
		);
	});

	afterEach(() => {
		restore();
	});

	describe('constructor method', () => {
		describe('fromDate property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Time({ fromDate: '1962-01-01' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.thirdCall, '1962-01-01');
				assert.equal(instance.fromDate, '1962-01-01');
			});
		});

		describe('toDate property', () => {
			it('assigns return value from getTrimmedOrEmptyString called with props value', async () => {
				const instance = new Time({ toDate: '1962-12-31' });

				sinonAssert.calledWithExactly(stubs.stringsModule.getTrimmedOrEmptyString.getCall(3), '1962-12-31');
				assert.equal(instance.toDate, '1962-12-31');
			});
		});
	});

	describe('runInputValidations method', () => {
		it("calls instance's validate methods", async () => {
			const instance = new Time({
				fromDate: '1962-01-01',
				toDate: '1962-12-31'
			});

			spy(instance, 'validateDates');

			instance.runInputValidations();

			sinonAssert.calledOnceWithExactly(instance.validateDates);
		});
	});

	describe('validateDates method', () => {
		context('valid data', () => {
			context('fromDate and toDate properties are absent', () => {
				it('will not call addPropertyError method', async () => {
					const instance = new Time({ name: '1962' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('fromDate property has empty string value; toDate property is absent', () => {
				it('will not call addPropertyError method', async () => {
					const instance = new Time({ name: '1962', fromDate: '' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('toDate property has empty string value; fromDate property is absent', () => {
				it('will not call addPropertyError method', async () => {
					const instance = new Time({ name: '1962', toDate: '' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('fromDate and toDate properties have empty string values', () => {
				it('will not call addPropertyError method', async () => {
					const instance = new Time({ name: '1962', fromDate: '', toDate: '' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('fromDate and toDate with valid date format with fromDate before toDate', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true).onSecondCall().returns(true);

					const instance = new Time({
						name: '1962',
						fromDate: '1962-01-01',
						toDate: '1962-12-31'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '1962-01-01');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '1962-12-31');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});

			context('fromDate and toDate with valid date format with fromDate same as toDate', () => {
				it('will not call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true).onSecondCall().returns(true);

					const instance = new Time({
						name: '5th March 1962',
						fromDate: '1962-03-05',
						toDate: '1962-03-05'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '1962-03-05');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '1962-03-05');
					sinonAssert.notCalled(instance.addPropertyError);
				});
			});
		});

		context('invalid data', () => {
			context('fromDate with invalid date format', () => {
				it('will call addPropertyError method', async () => {
					const instance = new Time({ name: '1962', fromDate: 'foobar' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, 'foobar');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'fromDate',
						'Value must be in date format'
					);
				});
			});

			context('toDate with invalid date format', () => {
				it('will call addPropertyError method', async () => {
					const instance = new Time({ name: '1962', toDate: 'foobar' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, 'foobar');
					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'toDate',
						'Value must be in date format'
					);
				});
			});

			context('valid toDate without corresponding fromDate', () => {
				it('will call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(false).onSecondCall().returns(true);

					const instance = new Time({ name: '1962', toDate: '1962-12-31' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '1962-12-31');
					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'fromDate',
						"'To' date requires corresponding 'from' date"
					);
				});
			});

			context('valid fromDate without corresponding toDate', () => {
				it('will call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true).onSecondCall().returns(false);

					const instance = new Time({ name: '1962', fromDate: '1962-01-01' });

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '1962-01-01');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '');
					sinonAssert.calledOnceWithExactly(
						instance.addPropertyError,
						'toDate',
						"'From' date requires corresponding 'to' date"
					);
				});
			});

			context('fromDate and toDate with valid date format with fromDate after toDate', () => {
				it('will call addPropertyError method', async () => {
					stubs.isValidDate.onFirstCall().returns(true).onSecondCall().returns(true);

					const instance = new Time({
						name: '1962',
						fromDate: '1962-12-31',
						toDate: '1962-01-01'
					});

					spy(instance, 'addPropertyError');

					instance.validateDates();

					assert.equal(stubs.isValidDate.callCount, 2);
					sinonAssert.calledWithExactly(stubs.isValidDate.firstCall, '1962-12-31');
					sinonAssert.calledWithExactly(stubs.isValidDate.secondCall, '1962-01-01');
					sinonAssert.calledTwice(instance.addPropertyError);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.firstCall,
						'fromDate',
						"'From' date must not be after 'to' date"
					);
					sinonAssert.calledWithExactly(
						instance.addPropertyError.secondCall,
						'toDate',
						"'To' date must not be before 'from' date"
					);
				});
			});
		});
	});
});

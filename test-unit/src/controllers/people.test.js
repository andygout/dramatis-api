import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';

describe('People controller', () => {
	let stubs;
	let peopleController;

	const PersonStub = function () {
		return {};
	};

	beforeEach(async (test) => {
		stubs = {
			callClassMethodsModule: {
				callInstanceMethod: test.mock.fn(async () => 'callInstanceMethod response'),
				callStaticListMethod: test.mock.fn(async () => 'callStaticListMethod response')
			},
			sendJsonResponse: test.mock.fn(() => 'sendJsonResponse response'),
			models: {
				Person: PersonStub
			},
			request: test.mock.fn(),
			response: test.mock.fn(),
			next: test.mock.fn()
		};

		peopleController = await esmock('../../../src/controllers/people.js', {
			'../../../src/lib/call-class-methods.js': stubs.callClassMethodsModule,
			'../../../src/lib/send-json-response.js': stubs.sendJsonResponse,
			'../../../src/models/index.js': stubs.models
		});
	});

	const callFunction = async (functionName) => {
		return peopleController[functionName](stubs.request, stubs.response, stubs.next);
	};

	describe('newRoute function', () => {
		it('calls sendJsonResponse module', async () => {
			const result = await callFunction('newRoute');

			assert.strictEqual(stubs.sendJsonResponse.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.sendJsonResponse.mock.calls[0].arguments, [
				stubs.response,
				stubs.models.Person() // eslint-disable-line new-cap
			]);
			assert.strictEqual(result, 'sendJsonResponse response');
		});
	});

	describe('createRoute function', () => {
		it('calls callInstanceMethod module', async () => {
			const result = await callFunction('createRoute');

			assert.strictEqual(stubs.callClassMethodsModule.callInstanceMethod.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.callClassMethodsModule.callInstanceMethod.mock.calls[0].arguments, [
				stubs.response,
				stubs.next,
				stubs.models.Person(), // eslint-disable-line new-cap
				'CREATE'
			]);
			assert.strictEqual(result, 'callInstanceMethod response');
		});
	});

	describe('editRoute function', () => {
		it('calls callInstanceMethod module', async () => {
			const result = await callFunction('editRoute');

			assert.strictEqual(stubs.callClassMethodsModule.callInstanceMethod.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.callClassMethodsModule.callInstanceMethod.mock.calls[0].arguments, [
				stubs.response,
				stubs.next,
				stubs.models.Person(), // eslint-disable-line new-cap
				'EDIT'
			]);
			assert.strictEqual(result, 'callInstanceMethod response');
		});
	});

	describe('updateRoute function', () => {
		it('calls callInstanceMethod module', async () => {
			const result = await callFunction('updateRoute');

			assert.strictEqual(stubs.callClassMethodsModule.callInstanceMethod.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.callClassMethodsModule.callInstanceMethod.mock.calls[0].arguments, [
				stubs.response,
				stubs.next,
				stubs.models.Person(), // eslint-disable-line new-cap
				'UPDATE'
			]);
			assert.strictEqual(result, 'callInstanceMethod response');
		});
	});

	describe('deleteRoute function', () => {
		it('calls callInstanceMethod module', async () => {
			const result = await callFunction('deleteRoute');

			assert.strictEqual(stubs.callClassMethodsModule.callInstanceMethod.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.callClassMethodsModule.callInstanceMethod.mock.calls[0].arguments, [
				stubs.response,
				stubs.next,
				stubs.models.Person(), // eslint-disable-line new-cap
				'DELETE'
			]);
			assert.strictEqual(result, 'callInstanceMethod response');
		});
	});

	describe('showRoute function', () => {
		it('calls callInstanceMethod module', async () => {
			const result = await callFunction('showRoute');

			assert.strictEqual(stubs.callClassMethodsModule.callInstanceMethod.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.callClassMethodsModule.callInstanceMethod.mock.calls[0].arguments, [
				stubs.response,
				stubs.next,
				stubs.models.Person(), // eslint-disable-line new-cap
				'SHOW'
			]);
			assert.strictEqual(result, 'callInstanceMethod response');
		});
	});

	describe('listRoute function', () => {
		it('calls callStaticListMethod module', async () => {
			const result = await callFunction('listRoute');

			assert.strictEqual(stubs.callClassMethodsModule.callStaticListMethod.mock.calls.length, 1);
			assert.deepStrictEqual(stubs.callClassMethodsModule.callStaticListMethod.mock.calls[0].arguments, [
				stubs.response,
				stubs.next,
				stubs.models.Person,
				'PERSON'
			]);
			assert.strictEqual(result, 'callStaticListMethod response');
		});
	});
});

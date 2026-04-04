import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import esmock from 'esmock';
import httpMocks from 'node-mocks-http';

import { Character } from '../../../src/models/index.js';

describe('Call Class Methods module', () => {
	let stubs;
	let callClassMethods;

	const error = new Error('errorText');
	const notFoundError = new Error('Not Found');

	beforeEach(async (test) => {
		stubs = {
			sendJsonResponse: test.mock.fn(() => 'sendJsonResponse response'),
			response: httpMocks.createResponse(),
			next: test.mock.fn()
		};

		callClassMethods = await esmock('../../../src/lib/call-class-methods.js', {
			'../../../src/lib/send-json-response.js': stubs.sendJsonResponse
		});
	});

	describe('callInstanceMethod function', () => {
		let character;
		const method = 'edit';

		beforeEach(() => {
			character = new Character();
		});

		describe('resolves with data', () => {
			it('calls renderPage module', async (test) => {
				const instanceMethodResponse = { property: 'value' };
				test.mock.method(character, method, () => {
					return Promise.resolve(instanceMethodResponse);
				});

				const result = await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);

				assert.strictEqual(stubs.sendJsonResponse.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.sendJsonResponse.mock.calls[0].arguments, [stubs.response, instanceMethodResponse]);
				assert.strictEqual(stubs.next.mock.calls.length, 0);
				assert.equal(result, 'sendJsonResponse response');
			});
		});

		describe('resolves with error', () => {
			it('calls next() with error', async (test) => {
				test.mock.method(character, method, () => {
					return Promise.reject(error);
				});

				await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);

				assert.strictEqual(stubs.next.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.next.mock.calls[0].arguments, [error]);
				assert.strictEqual(stubs.sendJsonResponse.mock.calls.length, 0);
			});
		});

		describe("resolves with 'Not Found' error", () => {
			it('responds with 404 status and sends error message', async (test) => {
				test.mock.method(character, method, () => {
					return Promise.reject(notFoundError);
				});

				await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);

				assert.equal(stubs.response.statusCode, 404);
				assert.equal(stubs.response._getData(), 'Not Found'); // eslint-disable-line no-underscore-dangle
				assert.strictEqual(stubs.sendJsonResponse.mock.calls.length, 0);
				assert.strictEqual(stubs.next.mock.calls.length, 0);
			});
		});
	});

	describe('callStaticListMethod function', () => {
		const method = 'list';

		describe('resolves with data', () => {
			it('calls renderPage module', async (test) => {
				const staticListMethodResponse = [{ property: 'value' }];
				test.mock.method(Character, method, () => {
					return Promise.resolve(staticListMethodResponse);
				});

				const result = await callClassMethods.callStaticListMethod(
					stubs.response,
					stubs.next,
					Character,
					'character'
				);

				assert.strictEqual(stubs.sendJsonResponse.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.sendJsonResponse.mock.calls[0].arguments, [stubs.response, staticListMethodResponse]);
				assert.strictEqual(stubs.next.mock.calls.length, 0);
				assert.equal(result, 'sendJsonResponse response');
			});
		});

		describe('resolves with error', () => {
			it('calls next() with error', async (test) => {
				test.mock.method(Character, method, () => {
					return Promise.reject(error);
				});

				await callClassMethods.callStaticListMethod(stubs.response, stubs.next, Character, 'character');

				assert.strictEqual(stubs.next.mock.calls.length, 1);
				assert.deepStrictEqual(stubs.next.mock.calls[0].arguments, [error]);
				assert.strictEqual(stubs.sendJsonResponse.mock.calls.length, 0);
			});
		});
	});
});

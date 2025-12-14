import { expect } from 'chai';
import esmock from 'esmock';
import httpMocks from 'node-mocks-http';
import { assert, restore, stub } from 'sinon';

import { Character } from '../../../src/models/index.js';

describe('Call Class Methods module', () => {

	let stubs;
	let callClassMethods;

	const error = new Error('errorText');
	const notFoundError = new Error('Not Found');

	beforeEach(async () => {

		stubs = {
			sendJsonResponse: stub().returns('sendJsonResponse response'),
			response: httpMocks.createResponse(),
			next: stub()
		};

		callClassMethods = await esmock(
			'../../../src/lib/call-class-methods.js',
			{
				'../../../src/lib/send-json-response.js': stubs.sendJsonResponse
			}
		);

	});

	afterEach(() => {

		restore();

	});

	describe('callInstanceMethod function', () => {

		let character;
		const method = 'edit';

		beforeEach(() => {

			character = new Character;

		});

		context('resolves with data', () => {

			it('calls renderPage module', async () => {

				const instanceMethodResponse = { property: 'value' };
				stub(character, method).callsFake(() => { return Promise.resolve(instanceMethodResponse); });

				const result = await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);

				assert.calledOnceWithExactly(
					stubs.sendJsonResponse,
					stubs.response, instanceMethodResponse
				);
				assert.notCalled(stubs.next);
				expect(result).to.equal('sendJsonResponse response');

			});

		});

		context('resolves with error', () => {

			it('calls next() with error', async () => {

				stub(character, method).callsFake(() => { return Promise.reject(error); });

				await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);

				assert.calledOnceWithExactly(stubs.next, error);
				assert.notCalled(stubs.sendJsonResponse);

			});

		});

		context('resolves with \'Not Found\' error', () => {

			it('responds with 404 status and sends error message', async () => {

				stub(character, method).callsFake(() => { return Promise.reject(notFoundError); });

				await callClassMethods.callInstanceMethod(stubs.response, stubs.next, character, method);

				expect(stubs.response.statusCode).to.equal(404);
				expect(stubs.response._getData()).to.equal('Not Found'); // eslint-disable-line no-underscore-dangle
				assert.notCalled(stubs.sendJsonResponse);
				assert.notCalled(stubs.next);

			});

		});

	});

	describe('callStaticListMethod function', () => {

		const method = 'list';

		afterEach(() => {

			Character[method].restore();

		});

		context('resolves with data', () => {

			it('calls renderPage module', async () => {

				const staticListMethodResponse = [{ property: 'value' }];
				stub(Character, method).callsFake(() => { return Promise.resolve(staticListMethodResponse); });

				const result =
					await callClassMethods.callStaticListMethod(stubs.response, stubs.next, Character, 'character');

				assert.calledOnceWithExactly(
					stubs.sendJsonResponse,
					stubs.response, staticListMethodResponse
				);
				assert.notCalled(stubs.next);
				expect(result).to.equal('sendJsonResponse response');

			});

		});

		context('resolves with error', () => {

			it('calls next() with error', async () => {

				stub(Character, method).callsFake(() => { return Promise.reject(error); });

				await callClassMethods.callStaticListMethod(stubs.response, stubs.next, Character, 'character');

				assert.calledOnceWithExactly(stubs.next, error);
				assert.notCalled(stubs.sendJsonResponse);

			});

		});

	});

});
